import { EXPERIMENT_ASSETS } from 'porygon/assets';
import { Command, CommandFn, ButtonFn, Row, SelectFn } from 'porygon/interaction';
import { createLang } from 'porygon/lang';
import { random } from 'support/array';
import { Minutes } from 'support/time';

const experiment: Command = (args) => {
  return random(experiments)(args);
};

const counter: CommandFn = async ({ intr, embed, channel }) => {
  let clicks = 0;

  embed
    .poryColor('ok')
    .poryThumb('speech')
    .setTitle(lang('counter.title'))
    .setDescription(lang('counter.desc'))
    .addField(lang('counter.leadin'), lang('counter.click', { count: clicks }));

  const onClick: ButtonFn = ({ intr }) => {
    clicks += 1;

    embed.fields[0].value = lang('counter.click', { count: clicks });
    intr.update({ embeds: [embed] });
  };

  const onEnd = () => {
    embed.poryThumb('angry').setDescription(lang('counter.done'));
    intr.editReply({ embeds: [embed], components: [] });
  };

  const row = new Row().addButton((button, setHandler) => {
    button.setStyle('PRIMARY').setLabel('Click me!');
    setHandler(onClick);
  });

  await intr.reply({ embeds: [embed], components: [row] });

  row.listen(channel, { time: Minutes(1) }).on('end', onEnd);
};

const potenuse: CommandFn = async ({ intr, embed, channel, author }) => {
  const subject = author.user.toString();

  let replied = false;

  embed
    .poryColor('ok')
    .poryThumb('speech')
    .setTitle(lang('potenuse.title'))
    .setDescription(lang('potenuse.desc'))
    .setImage(EXPERIMENT_ASSETS.get('potenuse').url);

  const onSelect: SelectFn = ({ intr }) => {
    const emotion = intr.values[0];

    embed.setDescription(lang('potenuse.result', { emotion, subject })).clearImage();

    intr.update({ embeds: [embed], components: [] });

    replied = true;
  };

  const onEnd = () => {
    if (replied) {
      return;
    }

    embed
      .poryThumb('angry')
      .setDescription(lang('potenuse.aborted', { subject }))
      .clearImage();

    intr.editReply({ embeds: [embed], components: [] });
  };

  const row = new Row().addSelect((select, setHandler) => {
    select.addOptions([
      { label: 'Adoring', value: 'adoring' },
      { label: 'Humble', value: 'humble' },
      { label: 'Solemn', value: 'solemn' },
      { label: 'Worshipful', value: 'worshipful' },
      { label: 'No feelings at this time', value: 'nothing' },
    ]);
    setHandler(onSelect);
  });

  await intr.reply({ embeds: [embed], components: [row] });

  row.listen(channel, { time: Minutes(1) }).on('end', onEnd);
};

const experiments = [counter, potenuse];

experiment.data = {
  name: 'experiment',
  description: 'Helps Porygon with a random science experiment.',
};

export default experiment;

const lang = createLang(<const>{
  counter: {
    title: "Pory's Button Experiment",
    desc: '_For my science project I need to see how many times the humans will click a button for absolutely no reason. Please help!_',
    leadin: 'The humans have clicked...',
    done: "_I'm bored now. Experiment over._",
    btn: 'Click me!',
    click: {
      1: '{count} time',
      _: '{count} times',
    },
  },
  potenuse: {
    title: "Pory's Psych Experiment",
    desc: '_For my psychology project I need to ask people how this image makes them feel. How does this image make you feel?_',
    result:
      '_Thank you for taking the experiment, {subject}! You said it made you feel **{emotion}**... interesting! I will make a note of that._',
    aborted:
      '_You took too long to answer, {subject}! Helping with important scientific research is too good for you, huh!_',
  },
});
