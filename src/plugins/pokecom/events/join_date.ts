import { Guild } from 'discord.js';
import { DEV } from 'porygon/dev';
import { createLang } from 'porygon/lang';
import { logger } from 'porygon/logger';
import { EventFactory } from 'porygon/plugin';
import { Task, at } from 'porygon/schedule';
import { TimeDifferenceStat } from 'porygon/stats';
import { sleep } from 'support/async';
import { Seconds } from 'support/time';
import * as Cache from '../../_shared/event_logging';

type Kind = typeof import('../$plugin').default;

const CLEAR_TASK = new Task({
  name: 'pokecom.clearJoinDates',
  do: Cache.clearAndReloadAllJoinDates,
});

const handler: EventFactory<Kind> = ({ events, kind, client }) => {
  const guild = kind.guild(client);

  if (guild) {
    cacheAllMembers(guild);

    events.on('guildMemberAdd', Cache.cacheJoinDate);
    events.on('guildMemberRemove', Cache.uncacheJoinDate);

    CLEAR_TASK.schedule(at.everyWeek(), guild);
  }
};

export default handler;

const DELAY_UNTIL_MEMBER_LIST_IS_ACCURATE = Seconds(DEV ? 0 : 30);

async function cacheAllMembers(guild: Guild) {
  await sleep(DELAY_UNTIL_MEMBER_LIST_IS_ACCURATE);

  logger.task.info(lang('cacheAll.start'));

  const time = new TimeDifferenceStat().startTiming();
  const data = await Cache.cacheJoinDateForMembers(guild);
  const params = { ...data, time: time.inWords() };

  logger.task.info(lang('cacheAll.end', params));
}

const lang = createLang(<const>{
  cacheAll: {
    start: 'Building the cached join date list for PokéCommunity now...',
    end: 'Cached %{memberCount} ({newInserts} new)% join dates. Process took {time}.',
  },
});
