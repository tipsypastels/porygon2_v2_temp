import { UserContextMenu } from 'porygon/interaction';

const test: UserContextMenu = async ({ intr, member, author }) => {
  await intr.reply(`${member.displayName} - ${author.displayName}`);
};

test.data = {
  name: 'test',
  type: 'USER',
};

export default test;
