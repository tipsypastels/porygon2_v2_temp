import { inspect } from 'util';

export interface CodeBlockOpts {
  lang?: string;
  inspect?: boolean;
}

/**
 * Wraps the message in a Discord code block.
 */
export function codeBlock(message: string, opts: CodeBlockOpts = {}) {
  if (opts.inspect) message = inspect(message);
  return `\`\`\`${opts.lang}\n${message}\`\`\``;
}

/**
 * Wraps the message in a Discord inline code.
 */
export function code(message: string) {
  return `\`${message}\``;
}

/**
 * Formats a message as Discord bold.
 */
export function bold(message: string) {
  return `**${message}**`;
}

/**
 * Removes all spaces from `input`.
 */
export function stripSpaces(input: string) {
  return input.replace(/ /g, '');
}
