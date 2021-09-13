import { addFaq } from './faq_list';

addFaq('duck', 'test1', (e) => {
  e.setTitle('test 1');
});

addFaq('pokecomstaf', 'test2', (e) => {
  e.setTitle('test 2');
});
