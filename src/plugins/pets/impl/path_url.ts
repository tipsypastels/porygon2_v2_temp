const URL_HEADER = 'https://cdn.discordapp.com/attachments/';

export function petUrl(path: string) {
  return URL_HEADER + path;
}

export function petExtractPath(url: string) {
  return url.replace(URL_HEADER, '');
}
