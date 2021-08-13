import cron from 'node-cron';
import { createLogger } from './logger';
import { red } from 'colors';

const logger = createLogger('task', red);

export function schedule(name: string, time: string, fn: () => void) {
  logger.info(`Task scheduled: ${name} at ${time}`);

  cron.schedule(time, () => {
    logger.info(`Task starting: ${name}`);
    fn();
  });
}
