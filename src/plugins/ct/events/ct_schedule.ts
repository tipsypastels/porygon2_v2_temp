import { EventFactory } from 'porygon/plugin';
import { schedule, at } from 'porygon/schedule';
import { CtConfig, ctHandleMessage, ctRunCycle, ctRunTick } from '../impl';

type Kind = typeof import('../$plugin').default;

const TICK_FREQ = at.every(12).hours();
const CYCLE_FREQ = at.everyWeek();
const ACTIVE = () => CtConfig.enabled;

const ctSchedule: EventFactory<Kind> = ({ events, kind, client }) => {
  const guild = kind.guild(client);

  if (guild) {
    events.on('messageCreate', ctHandleMessage);

    schedule('ct.tick', TICK_FREQ, () => ctRunTick(guild)).activeIf(ACTIVE);
    schedule('ct.cycle', CYCLE_FREQ, () => ctRunCycle()).activeIf(ACTIVE);
  }
};

export default ctSchedule;
