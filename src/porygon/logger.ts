import colors, { Color } from 'colors';
import strftime from 'strftime';
import { DEV } from './dev';

export const logger = create({
  bug: { name: 'Bug', color: colors.red },
  setup: { name: 'Setup', color: colors.blue },
  ct: { name: 'Tier', color: colors.yellow },
  task: { name: 'Task', color: colors.green },
  asset: { name: 'Asset', color: colors.magenta },
  intr: { name: 'Intr', color: colors.cyan },
});

type LogFn = (message: string) => void;
type LogErrorFn = (message: string | Error) => void;

interface Opts {
  name: string;
  color: Color;
}

interface Logger {
  error: LogErrorFn;
  warn: LogFn;
  info: LogFn;
  debug: LogFn;
}

const LEVEL_COLORS: Record<keyof Logger, Color> = {
  error: colors.red,
  warn: colors.yellow,
  info: colors.blue,
  debug: colors.green,
};

const LEVELS_PAD_TO = 5;

function create<K extends string>(opts: Record<K, Opts>) {
  const out: Partial<Record<K, Logger>> = {};
  const entries = Object.entries(opts) as [K, Opts][];
  const namesPadTo = Math.max(...entries.map(([, o]) => o.name.length));

  for (const [key, opts] of entries) {
    out[key] = createOne(opts, namesPadTo);
  }

  return out as Record<K, Logger>;
}

function createOne(opts: Opts, namesPadTo: number): Logger {
  function log(level: keyof Logger, message: string | Error | undefined) {
    if (!message) {
      return;
    }

    if (message instanceof Error) {
      message = message.stack;
    }

    const nameText = header(opts.name, namesPadTo, opts.color);
    const levelText = header(level, LEVELS_PAD_TO, LEVEL_COLORS[level]);
    const timeText = time();

    doLog(`  ${nameText} ${levelText} ${timeText} ${message}`);
  }

  const error: LogErrorFn = (m) => log('error', m);
  const warn: LogFn = (m) => log('warn', m);
  const info: LogFn = (m) => log('info', m);
  const debug: LogFn = (m) => DEV && log('debug', m);

  return { error, warn, info, debug };
}

function header(text: string, len: number, color: Color) {
  return color.bold(`${text.toUpperCase().padEnd(len)}`);
}

function time() {
  return colors.gray.dim(strftime('%H:%M'));
}

function doLog(text: string) {
  (console as any)._stdout.write(`${text}\n`); // faster than console.log
}
