import { EventFactory, PackageGuild } from 'porygon/package';
import { schedule } from 'porygon/schedule';
import { ctHandleMessage, ctRunCycle } from '../impl';

const ctSchedule: EventFactory<PackageGuild> = ({ events, kind, client }) => {
  const guild = kind.guild(client);

  if (guild) {
    events.on('messageCreate', ctHandleMessage);
    schedule('cooltrainer.cycle', '0 0 * * 0', () => ctRunCycle(guild));
  }
};

export default ctSchedule;
