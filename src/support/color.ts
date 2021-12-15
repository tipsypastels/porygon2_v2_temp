const HEX = /^#?[0-9a-f]{6}$/;

export function parseColor(text: string): number {
  if (HEX.exec(text)) {
    return parseInt(text.replace('#', ''), 16);
  }

  throw new Error('Invalid color!');
}
