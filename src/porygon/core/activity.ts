import { config } from 'porygon/config';
import { DEV } from 'porygon/dev';
import { Task, at } from 'porygon/schedule';
import { random } from 'support/array';
import { Porygon } from './client';

const MESSAGES = config('activityMessages');
const FREQ = at.every(DEV ? 1 : 30).minutes();

const TASK = new Task({
  name: 'pory.activity',
  silent: true,
  do: set,
});

export function setupActivityMessages(client: Porygon) {
  set(client);
  TASK.schedule(FREQ, client);
}

async function set(client: Porygon) {
  const { user } = client;

  if (!user) {
    return; // before ready event
  }

  user.setActivity(random(MESSAGES.value));
}
