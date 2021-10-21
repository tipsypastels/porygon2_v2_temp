import { clamp } from 'support/number';
import { stripWhitespace } from 'support/string';

const CAMEL = ['🐪', '🐫'];
const PATTERN = new RegExp(`^[${CAMEL.join('|')}]+$`, 'm');
const RESPONSE = 'yo '; // enshrined in ancient tradition
const RESPONSE_MAX_COUNT = 100;
const CHARS_PER_CAMEL = 2; // unicode emoji = 2 characters

export function getCamelResponseForMessage(message: string) {
  message = stripWhitespace(message);

  if (PATTERN.exec(message)) {
    const count = clamp(message.length / CHARS_PER_CAMEL, 0, RESPONSE_MAX_COUNT);
    const response = RESPONSE.repeat(count);

    return response;
  }
}
