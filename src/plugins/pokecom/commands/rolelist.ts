import { config } from 'porygon/config';
import { Command } from 'porygon/interaction';

const URL = config('pkg.pokecom.roleListUrl');

const rolelist: Command = async ({ intr }) => {
  await intr.reply({
    content: `[You can see a list of requestable roles here :)](${URL.value})`,
    ephemeral: true,
  });
};

rolelist.data = {
  name: 'rolelist',
  description: 'Provides a link to a list of roles.',
};

export default rolelist;
