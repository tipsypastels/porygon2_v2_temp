const BASE = 'https://pokecommunity.com';

export function thread(id: number) {
  return `${BASE}/showthread.php?t=${id}`;
}

export function forum(slug: string) {
  return `${BASE}/forumdisplay.php?fn=${slug}`;
}

export function forumPrefix(slug: string, prefix: string) {
  return `${forum(slug)}&prefixid=${prefix}`;
}
