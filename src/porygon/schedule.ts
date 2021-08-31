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

  private results = new ResultCollector();
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
    this.results.increment(result);
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
    return lang('embed', {
      name: this.name,
      results: this.results,
      nextRun: this.nextRun(),
    });
  }

  private nextRun() {
    if (this.cronTime) {
      const date = parser.parseExpression(this.cronTime).next().toDate();
      return formatDistance(date, new Date());
    }

    return 'Never';
  }
}

class ResultCollector {
  private results = CounterStat.table(RESULTS);
  private lastResult?: Result;

  increment(result: Result) {
    this.results[result].increment();
    this.lastResult = result;
  }

  toString() {
    return lang('results.list', { ...this.results, last: this.lastText() });
  }

  private lastText() {
    if (this.lastResult && !this.resultsAreAllOfOneKind()) {
      return lang('results.last', { last: symbols[this.lastResult] });
    }

    return '';
  }

  // if we've always succeeded/failed/skipped, no need to list the latest
  private resultsAreAllOfOneKind() {
    return Object.values(this.results).filter((x) => x.touched).length === 1;
  }
}

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
  embed: '`{name}`\n**Status:** {results}\n**Runs in:** {nextRun}',
  results: {
    list: '`✅ {success} ❌ {failure} ↩️ {skipped}`{last}',
    last: ' (last was `{last}`) ',
  },
});
