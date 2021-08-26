import { logEvents } from 'plugins/_shared/event_logging';
import { config } from 'porygon/config';
import { EventFactory } from 'porygon/plugin';

type Kind = typeof import('../$plugin').default;

const LOGS = config('plug.pokecomstaf.logChannel');

const handler: EventFactory<Kind> = ({ events }) => {
  logEvents(events, {
    log: {
      joins: { to: LOGS },
      leaves: { to: LOGS },
      kicks: { to: LOGS },
      bans: { to: LOGS, details: 'all' },
      unbans: { to: LOGS, details: 'all' },
    },
  });
};

export default handler;
