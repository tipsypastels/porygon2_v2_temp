import { EventFactory } from 'porygon/plugin';
import { schedule, at } from 'porygon/schedule';
import { ctHandleMessage, ctRunCycle, ctRunTick } from '../impl';

type Kind = typeof import('../$plugin').default;

const TICK_FREQ = at.every(12).hours();
const CYCLE_FREQ = at.everyWeek();

const ctSchedule: EventFactory<Kind> = ({ events, kind, client }) => {
  const guild = kind.guild(client);

  if (guild) {
    events.on('messageCreate', ctHandleMessage);

    schedule('ct.tick', TICK_FREQ, () => ctRunTick(guild));
    schedule('ct.cycle', CYCLE_FREQ, () => ctRunCycle());
  }
};

export default ctSchedule;
