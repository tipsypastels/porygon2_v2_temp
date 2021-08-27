import { config } from 'porygon/config';
import { schedule, at } from 'porygon/schedule';
import { random } from 'support/array';
import { Porygon } from './client';

const MESSAGES = config('activityMessages');

export function setupActivityMessages(client: Porygon) {
  set(client);
  schedule('pory.activity', at.every(30).minutes(), () => set(client)).silent();
}

function set(client: Porygon) {
  const { user } = client;

  if (!user) {
    return; // before ready event
  }

  user.setActivity(random(MESSAGES.value));
}
