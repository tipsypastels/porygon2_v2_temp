import { EventFactory, PluginGuild } from 'porygon/plugin';
import { schedule } from 'porygon/schedule';
import { ctHandleMessage, ctRunCycle } from '../impl';

const ctSchedule: EventFactory<PluginGuild> = ({ events, kind, client }) => {
  const guild = kind.guild(client);

  if (guild) {
    events.on('messageCreate', ctHandleMessage);
    schedule('cooltrainer.cycle', '0 0 * * 0', () => ctRunCycle(guild));
  }
};

export default ctSchedule;
