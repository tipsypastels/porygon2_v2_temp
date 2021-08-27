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

  isSilent = false;
  runCount = 0;

  constructor(readonly name: string, readonly time: string, private fn: Fn) {
    logger.task.info(`Task scheduled: %${name}% at ${time}.`);
    cron.schedule(time, () => this.run());

    Task.ALL.set(name, this);
  }

  silent() {
    this.isSilent = true;
    return this;
  }

  private run() {
    const level = this.isSilent ? 'debug' : 'info';
    logger.task[level](`Task running: %${this.name}%.`);

    this.fn();

    this.runCount++;
  }

  get nextRun() {
    const date = parser.parseExpression(this.time).next().toDate();
    return formatDistance(date, new Date());
  }

  toEmbedString() {
    return `\`${this.name}\`\n**Runs:** ${this.runCount}\n**Runs in:** ${this.nextRun}`;
  }
}
