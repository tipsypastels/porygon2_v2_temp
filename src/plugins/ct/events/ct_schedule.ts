import { EventFactory } from 'porygon/plugin';
import { Task, at } from 'porygon/schedule';
import { CtConfig, ctHandleMessage, ctRunCycle, ctRunTick } from '../impl';

type Kind = typeof import('../$plugin').default;

const TICK_FREQ = at.every(12).hours();
const CYCLE_FREQ = at.everyWeek();
const ACTIVE = () => CtConfig.enabled;

export const CT_TICK_TASK = new Task({
  name: 'cooltrainer.tick',
  active: ACTIVE,
  do: ctRunTick,
});

export const CT_CYCLE_TASK = new Task({
  name: 'cooltrainer.cycle',
  active: ACTIVE,
  do: ctRunCycle,
});

const ctSchedule: EventFactory<Kind> = ({ events, kind, client }) => {
  const guild = kind.guild(client);

  if (guild) {
    events.on('messageCreate', ctHandleMessage);

    CT_TICK_TASK.schedule(TICK_FREQ, guild);
    CT_CYCLE_TASK.schedule(CYCLE_FREQ);
  }
};

export default ctSchedule;
