import { inspect } from 'util';

export type Stringable = string | { toString(): string };

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

export const ELLIPSIS = '…';

/**
 * Slices string to `len`, including an ellipsis
 * if the string exceeds that length.
 *
 * This should be used for most user input in
 * command responses.
 */
export function ellipsis(string: string, len: number) {
  return string.length > len ? `${string.slice(0, len)}${ELLIPSIS}` : string;
}

/**
 * Capitalizes the first letter of `input`.
 */
export function capitalize(input: string) {
  return input[0].toUpperCase() + input.slice(1);
}
