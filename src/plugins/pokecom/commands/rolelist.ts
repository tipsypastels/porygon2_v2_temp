import { config } from 'porygon/config';
import { Command } from 'porygon/interaction';

const URL = config('plug.pokecom.roleListUrl');

const rolelist: Command = async ({ intr }) => {
  await intr.reply({
    content: `[Click here to see a list of requestable roles :)](${URL.value})`,
    ephemeral: true,
  });
};

rolelist.data = {
  name: 'rolelist',
  description: 'Provides a link to a list of roles.',
};

export default rolelist;
