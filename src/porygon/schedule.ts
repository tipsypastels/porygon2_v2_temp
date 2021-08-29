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
type Fn = () => void;

export function schedule(name: string, time: string, fn: Fn) {
  return new Task(name, time, fn);
}

export class Task {
  static ALL = new Collection<string, Task>();

  private isSilent = false;
  private isActive?: () => boolean;
  private counter = CounterStat.table(RESULTS);

  constructor(readonly name: string, readonly time: string, private fn: Fn) {
    logger.task.info(lang('log.new', { name, time }));
    cron.schedule(time, () => this.run());

    Task.ALL.set(name, this);
  }

  silent() {
    this.isSilent = true;
    return this;
  }

  activeIf(isActive: () => boolean) {
    this.isActive = isActive;
    return this;
  }

  private run() {
    if (this.isActive?.() ?? true) {
      this.logIgnorable(lang('log.run', { name: this.name }));

      try {
        this.fn();
        this.result('success');
      } catch (error) {
        this.result('failure', 'logError');
        this.logError(error);
      }
    } else {
      this.result('skipped');
    }
  }

  private result(result: Result, method: 'logIgnorable' | 'logError' = 'logIgnorable') {
    this.counter[result].increment();
    this[method](lang(`log.result.${result}`, { name: this.name }));
  }

  private logIgnorable(text: string) {
    logger.task[this.isSilent ? 'debug' : 'info'](text);
  }

  private logError(error: any) {
    logger.task.error(error);
  }

  private get nextRun() {
    const date = parser.parseExpression(this.time).next().toDate();
    return formatDistance(date, new Date());
  }

  toEmbedString() {
    return lang('embed', { name: this.name, nextRun: this.nextRun, ...this.counter });
  }
}

const lang = createLang(<const>{
  log: {
    new: 'Task scheduled: %{name}% at {time}.',
    run: 'Task running: %{name}%.',
    result: {
      success: 'Task finished: %{name}%.',
      failure: 'Task failed: %{name}%.',
      skipped: 'Task skipped: %{name}%.',
    },
  },
  embed:
    '`{name}`\n**Status:** `✅ {success} ❌ {failure} ↩️ {skipped}`\n**Runs in:** {nextRun}',
});
