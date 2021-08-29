import { config } from 'porygon/config';
import { Task, at } from 'porygon/schedule';
import { random } from 'support/array';
import { Porygon } from './client';

const MESSAGES = config('activityMessages');

const TASK = new Task({
  name: 'pory.activity',
  silent: true,
  do: set,
});

export function setupActivityMessages(client: Porygon) {
  set(client);
  TASK.schedule(at.every(30).minutes(), client);
}

async function set(client: Porygon) {
  const { user } = client;

  if (!user) {
    return; // before ready event
  }

  user.setActivity(random(MESSAGES.value));
}
