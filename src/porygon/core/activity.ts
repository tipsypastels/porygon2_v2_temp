import { config } from 'porygon/config';
import { schedule } from 'porygon/schedule';
import { random } from 'support/array';
import { Porygon } from './client';

const MESSAGES = config('activityMessages');

export function setupActivityMessages(client: Porygon) {
  set(client);
  schedule('pory.activity', '0,30 * * * *', () => set(client));
}

function set(client: Porygon) {
  const { user } = client;

  if (!user) {
    return; // before ready event
  }

  user.setActivity(random(MESSAGES.value));
}
