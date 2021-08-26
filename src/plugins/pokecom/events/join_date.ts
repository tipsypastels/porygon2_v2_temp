import { Guild } from 'discord.js';
import { DEV } from 'porygon/dev';
import { EventFactory } from 'porygon/plugin';
import { sleep } from 'support/async';
import { Seconds } from 'support/time';
import * as Cache from '../impl/join_date_cache';

type Kind = typeof import('../$plugin').default;

const handler: EventFactory<Kind> = ({ events, kind, client }) => {
  const guild = kind.guild(client);

  if (guild) {
    cacheAllMembers(guild);

    events.on('guildMemberAdd', Cache.cacheJoinDate);
    events.on('guildMemberRemove', ({ id }) => Cache.uncacheJoinDate(id));
  }
};

export default handler;

const DELAY_UNTIL_MEMBER_LIST_IS_ACCURATE = Seconds(DEV ? 0 : 30);

async function cacheAllMembers(guild: Guild) {
  await sleep(DELAY_UNTIL_MEMBER_LIST_IS_ACCURATE);

  console.log('Caching members');
  const data = await Cache.cacheJoinDateForMembers(guild);
  console.log(data);
}
