import { logEvents } from 'plugins/_shared/event_logging';
import { config } from 'porygon/config';
import { EventFactory } from 'porygon/plugin';
import { getJoinDateFromCache } from '../impl/join_date_cache';

type Kind = typeof import('../$plugin').default;

const LOGS = config('plug.pokecom.logging.logChannel');
const WARNS = config('plug.pokecom.logging.warningChannel');
const BOTH = [LOGS, WARNS];

const handler: EventFactory<Kind> = ({ events }) => {
  logEvents(events, {
    log: {
      joins: { to: LOGS, details: 'all' },
      leaves: { to: LOGS, details: 'all' },
      kicks: { to: BOTH, details: 'all' },
      bans: { to: BOTH, details: 'all' },
      unbans: { to: BOTH, details: 'all' },
      deletions: { to: LOGS, details: 'all' },
    },
    getFallbackJoinDate: getJoinDateFromCache,
  });
};

export default handler;
