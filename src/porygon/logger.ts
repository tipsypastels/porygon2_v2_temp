import colors, { Color } from 'colors';
import strftime from 'strftime';
import { DEV } from './dev';

export { colors };

export type LogLevel = 'error' | 'warn' | 'info' | 'debug';
export type LogFn = (message: string) => void;
export type LogErrorFn = (message: string | Error) => void;

export interface Logger {
  error: LogErrorFn;
  warn: LogFn;
  info: LogFn;
  debug: LogFn;
}

export function createLogger(name: string, color: Color): Logger {
  function createHeader(level: LogLevel) {
    const nameText = color(name);
    const levelColor = COLORS[level];

    return `${levelColor(`${level}(`)}${nameText}${levelColor(')')}`;
  }

  function log(level: LogLevel, message: string | Error | undefined) {
    if (!message) {
      return;
    }

    if (typeof message !== 'string') {
      message = message.stack;
    }

    const ts = createTimestamp();
    const header = createHeader(level);

    console.log(`${ts} ${header} ${message}`);
  }

  const error: LogErrorFn = (m) => log('error', m);
  const warn: LogFn = (m) => log('warn', m);
  const info: LogFn = (m) => log('info', m);
  const debug: LogFn = (m) => DEV && log('debug', m);

  return { error, warn, info, debug };
}

function createTimestamp() {
  return colors.gray(strftime('%H:%M'));
}

const COLORS: Record<LogLevel, Color> = {
  error: colors.red,
  warn: colors.yellow,
  info: colors.blue,
  debug: colors.bgMagenta,
};

// shared loggers
export const bugLogger = createLogger('bug', colors.bgRed);
export const setupLogger = createLogger('setup', colors.green);
