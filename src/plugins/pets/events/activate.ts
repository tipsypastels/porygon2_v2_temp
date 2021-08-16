import { EventFactory } from 'porygon/plugin';
import { activatePetsBy, deactivatePetsBy } from '../impl';

const activate: EventFactory = ({ events }) => {
  events.on('guildMemberAdd', activatePetsBy).on('guildMemberRemove', deactivatePetsBy);
};

export default activate;
