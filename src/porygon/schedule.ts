import cron from 'node-cron';
import { logger } from './logger';
import at from 'cron-time-generator';
import parser from 'cron-parser';
import { Collection } from 'discord.js';
import { formatDistance } from 'date-fns';
import { createLang } from './lang';
import { CounterStat } from './stats';

export { at };

const RESULTS = <const>['success', 'failure', 'skipped'];
type Result = typeof RESULTS[number];

export interface TaskOpts<T extends any[], R> {
  name: string;
  silent?: boolean;
  active?(): boolean;
  do(...args: T): Promise<R>;
}

export type TaskRun<R> =
  | { result: 'success'; value: R }
  | { result: 'failure'; error: any }
  | { result: 'skipped' };

export class Task<T extends any[], R> {
  static ALL = new Collection<string, Task<unknown[], unknown>>();

  private results = CounterStat.table(RESULTS);
  private lastResult?: Result;
  private cronTime?: string; // only for toEmbedString

  constructor(private opts: TaskOpts<T, R>) {
    Task.ALL.set(opts.name, this);
  }

  get name() {
    return this.opts.name;
  }

  async run(...args: T): Promise<TaskRun<R>> {
    if (this.opts.active?.() ?? true) {
      try {
        this.logMessage(lang('log.run', { name: this.name }));

        const value = await this.opts.do(...args);

        this.logResult('success');
        return { result: 'success', value };
      } catch (error) {
        this.logResult('failure', error);
        return { result: 'failure', error };
      }
    } else {
      this.logResult('skipped');
      return { result: 'skipped' };
    }
  }

  private logResult(result: Result, error?: any) {
    const method = error ? 'logError' : 'logMessage';
    const params = { name: this.name };

    this[method](lang(`log.${result}`, params), error);

    this.lastResult = result;
    this.results[result].increment();
  }

  private logMessage(message: string) {
    logger.task[this.opts.silent ? 'debug' : 'info'](message);
  }

  private logError(message: string, error: any) {
    logger.task.error(message);
    logger.task.error(error);
  }

  schedule(time: string, ...args: T) {
    logger.task.info(lang('log.scheduled', { name: this.name, time }));
    cron.schedule(time, () => this.run(...args));

    this.cronTime = time;
  }

  toEmbedString() {
    const { name, lastResult: last } = this;
    const params = {
      name,
      last: last ? lang('embed.last', { last: symbols[last] }) : '',
      nextRun: this.nextRun(),
      ...this.results,
    };

    return lang('embed.base', params);
  }

  private nextRun() {
    if (this.cronTime) {
      const date = parser.parseExpression(this.cronTime).next().toDate();
      return formatDistance(date, new Date());
    }

    return 'Never';
  }
}

// export class Task {
//   static ALL = new Collection<string, Task>();

//   static run(name: string) {
//     const task = this.ALL.get(name);

//     if (!task) {
//       throw new Error(`Unknown task: ${name}`);
//     }

//     task.run();
//   }

//   private isSilent = false;
//   private isActive?: () => boolean;
//   private counter = CounterStat.table(RESULTS);

//   constructor(readonly name: string, readonly time: string, private fn: Fn) {
//     logger.task.info(lang('log.new', { name, time }));
//     cron.schedule(time, () => this.run());

//     Task.ALL.set(name, this);
//   }

//   silent() {
//     this.isSilent = true;
//     return this;
//   }

//   activeIf(isActive: () => boolean) {
//     this.isActive = isActive;
//     return this;
//   }

//   private run() {
//     if (this.isActive?.() ?? true) {
//       this.logIgnorable(lang('log.run', { name: this.name }));

//       try {
//         this.fn();
//         this.result('success');
//       } catch (error) {
//         this.result('failure', 'logError');
//         this.logError(error);
//       }
//     } else {
//       this.result('skipped');
//     }
//   }

//   private result(result: Result, method: 'logIgnorable' | 'logError' = 'logIgnorable') {
//     this.counter[result].increment();
//     this[method](lang(`log.result.${result}`, { name: this.name }));

//     return result;
//   }

//   private logIgnorable(text: string) {
//     logger.task[this.isSilent ? 'debug' : 'info'](text);
//   }

//   private logError(error: any) {
//     logger.task.error(error);
//   }

//   private get nextRun() {
//     const date = parser.parseExpression(this.time).next().toDate();
//     return formatDistance(date, new Date());
//   }

//   toEmbedString() {
//     return lang('embed', { name: this.name, nextRun: this.nextRun, ...this.counter });
//   }
// }
const symbols = {
  success: '✅',
  failure: '❌',
  skipped: '↩️',
};

const lang = createLang(<const>{
  log: {
    scheduled: 'Task scheduled: %{name}% at {time}.',
    run: 'Task running: %{name}%.',
    success: 'Task finished: %{name}%.',
    failure: 'Task failed: %{name}%.',
    skipped: 'Task skipped: %{name}%.',
  },
  embed: {
    base: '`{name}`\n**Status:** `✅ {success} ❌ {failure} ↩️ {skipped}`{last}\n**Runs in:** {nextRun}',
    last: ' (last was `{last}`) ',
  },
});
