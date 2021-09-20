import { withConfig } from 'porygon/config';
import { addFaq } from './faq_list';
import * as PC_URL from 'plugins/_shared/pc_url';
import { stripIndent } from 'common-tags';

const SELFPROMO = '<#843868495565029416>';
const MODEROID = '<@&157985920912588800>';
const COOLTRAINER = withConfig('plug.ct.role', (r) => `<@&${r}>`);

const PATCHING_TUT = PC_URL.thread(458595);

const RH_ALL_LIST = PC_URL.forum('rom-hacks-studio');
const RH_COMPLETED_LIST = PC_URL.thread(453539);

const GD_ALL_LIST = PC_URL.forum('games-showcase');
const GD_COMPLETED_LIST = PC_URL.forumPrefix('games-showcase', 'gc_completed');

addFaq('pokecom', 'How do I post in #self-promo?', (e) => {
  e.setTitle('#self-promo').setDescription(
    `Posting in ${SELFPROMO} is restricted to members with a special role. To prevent members joining to advertise, this role is only given to server regulars. If you've been around for a few months and chatting regularly, feel free to DM a ${MODEROID} and request the role!`,
  );
});

addFaq('pokecom', 'How do I get a role colour?', (e) => {
  e.setTitle('Role colours').setDescription(
    "PokéCommunity has a large list of requestable roles you can use to colour yourself however you like. [Click here to view the list of available roles](https://pokecommunity.com/about/discordroles). Once you've found one that strikes your fancy, use `/role add` to get it!",
  );
});

addFaq('pokecom', 'How do I get the COOLTRAINER role?', (e) => {
  e.setTitle('COOLTRAINER').setDescription(
    `${COOLTRAINER.value} is a special role given to our most active members over a period of time. It cannot be requested, and is always given out (and taken away) automagically by Porygon. If you want the role, try jumping in and chatting and you'll likely find yourself in the COOLTRAINER list before too long!`,
  );
});

addFaq('pokecom', 'How do I get a ROM?', (e) => {
  e.setTitle('Obtaining ROMs').setDescription(
    "For legal reasons, we can't give out ROMs on PokéCommunity or point you to a site that does. However, they're usually no more than a quick Google search away!",
  );
});

addFaq('pokecom', 'How do I patch a ROM?', (e) => {
  e.setTitle('Patching ROMs').setDescription(
    `Once you've obtained your ROM (see the previous question), [you can follow this guide](${PATCHING_TUT}) to patch it!`,
  );
});

addFaq('pokecom', 'What are some good fangames to play?', (e) => {
  e.setTitle('Fangame Recommendations')
    .setDescription(
      'Looking for something to play? PokéCommunity hosts a huge number of fangames on our forums. Here are some links to get you started!',
    )
    .addField(
      'Completed',
      stripIndent`
        ⭐ [Completed ROM Hacks Archive](${RH_COMPLETED_LIST})
        ⭐ [Games Showcase Completed Tag](${GD_COMPLETED_LIST})
      `,
    )
    .addField(
      'All Games',
      stripIndent`
        🔸 [ROM Hacks Studio](${RH_ALL_LIST})
        🔸 [Games Showcase](${GD_ALL_LIST})
      `,
    )
    .setFooter(
      'This command may be updated with more detailed recommendations in the future.',
    );
});
