import { logDeletions } from 'plugins/_shared/event_logging';
import { config } from 'porygon/config';
import { EventFactory } from 'porygon/plugin';

const LOG_CHANNEL_ID = config('pkg.pokecom.logging.logChannel');

const handler: EventFactory = ({ events }) => {
  logDeletions(events, { logTo: LOG_CHANNEL_ID, verbosity: 'verbose' });
};

export default handler;
