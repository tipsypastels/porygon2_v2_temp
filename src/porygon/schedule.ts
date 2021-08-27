import cron from 'node-cron';
import { logger } from './logger';
import at from 'cron-time-generator';
import parser from 'cron-parser';
import { Collection } from 'discord.js';
import { formatDistance } from 'date-fns';

export { at };

type Fn = () => void;

export function schedule(name: string, time: string, fn: Fn) {
  return new Task(name, time, fn);
}

export class Task {
  static ALL = new Collection<string, Task>();

  private isSilent = false;
  private isActive?: () => boolean;
  private runCount = 0;
  private skipCount = 0;

  constructor(readonly name: string, readonly time: string, private fn: Fn) {
    logger.task.info(`Task scheduled: %${name}% at ${time}.`);
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
    const level = this.isSilent ? 'debug' : 'info';
    const log = logger.task[level];

    if (this.isActive?.() ?? true) {
      log(`Task running: %${this.name}%.`);

      this.fn();
      this.runCount++;
    } else {
      log(`Task skipped: %${this.name}%.`);
      this.skipCount++;
    }
  }

  private get nextRun() {
    const date = parser.parseExpression(this.time).next().toDate();
    return formatDistance(date, new Date());
  }

  toEmbedString() {
    const lines = [`\`${this.name}\``];

    if (this.runCount) lines.push(`**Runs:** ${this.runCount}`);
    if (this.skipCount) lines.push(`**Skips:** ${this.skipCount}`);

    lines.push(`**Runs in:** ${this.nextRun}`);
    return lines.join('\n');
  }
}
