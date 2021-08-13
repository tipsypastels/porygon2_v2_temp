export function filterErrorMessage(message: string) {
  return message
    .replace(process.env.TOKEN!, '<filtered>')
    .replace(process.env.DATABASE_URL!, '<filtered>');
}
