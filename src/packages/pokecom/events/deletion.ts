import { logDeletions } from 'packages/_shared/event_logging';
import { config } from 'porygon/config';
import { EventFactory } from 'porygon/package';

const LOG_CHANNEL_ID = config('pkg.pokecom.logging.log_channel');

const handler: EventFactory = ({ events }) => {
  logDeletions(events, { logTo: LOG_CHANNEL_ID, verbosity: 'verbose' });
};

export default handler;
