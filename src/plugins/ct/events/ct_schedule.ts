import { EventFactory, PluginGuild } from 'porygon/plugin';
import { schedule } from 'porygon/schedule';
import { ctHandleMessage, ctRunCycle, ctRunTick } from '../impl';

const ctSchedule: EventFactory<PluginGuild> = ({ events, kind, client }) => {
  const guild = kind.guild(client);

  if (guild) {
    events.on('messageCreate', ctHandleMessage);

    schedule('cooltrainer.tick', '0 0,12 * * *', () => ctRunTick(guild));
    schedule('cooltrainer.cycle', '0 0 * * 0', () => ctRunCycle());
  }
};

export default ctSchedule;
