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
