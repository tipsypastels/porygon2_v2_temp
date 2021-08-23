import { EventFactory } from 'porygon/plugin';
import { activatePetsBy, deactivatePetsBy } from '../impl';

type Kind = typeof import('../$plugin').default;

const activate: EventFactory<Kind> = ({ events }) => {
  events.on('guildMemberAdd', activatePetsBy).on('guildMemberRemove', deactivatePetsBy);
};

export default activate;
