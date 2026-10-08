import type { OracleQuestion, OracleRank } from './types';

/** "The Oracle": a myth-or-truth quiz. Each explanation is shown after the answer. */
export const oracleQuestions: OracleQuestion[] = [
  {
    claim: 'Most “unicorn horns” sold in medieval and Renaissance Europe were really narwhal tusks.',
    truth: true,
    explanation:
      'Arctic traders brought narwhal tusks south, where they sold as alicorns for fortunes. Ole Worm exposed the trade in 1638.',
  },
  {
    claim: 'The word “unicorn” appears in the King James Bible.',
    truth: true,
    explanation:
      'Several times. Translators followed the Greek “monokeros” for the Hebrew re’em — probably the wild aurochs.',
  },
  {
    claim: 'Pliny the Elder wrote that the unicorn was gentle and easily tamed.',
    truth: false,
    explanation: 'The opposite: Pliny’s monoceros was the fiercest of beasts, and “cannot be taken alive”.',
  },
  {
    claim: 'The unicorn is the national animal of Scotland.',
    truth: true,
    explanation:
      'It has supported Scotland’s royal arms since the 15th century, and still does, chained, on the UK arms.',
  },
  {
    claim: 'Ctesias described the unicorn’s horn as pure white from base to tip.',
    truth: false,
    explanation: 'His horn was tricolour: white at the base, black in the middle, and crimson at the tip.',
  },
  {
    claim: 'Raphael’s “Young Woman with Unicorn” has always shown a unicorn.',
    truth: false,
    explanation:
      'The unicorn was painted over for centuries — she was disguised as Saint Catherine — until a 1930s restoration revealed it.',
  },
  {
    claim: 'A one-horned “Siberian unicorn” really walked the Earth alongside early humans.',
    truth: true,
    explanation:
      'Elasmotherium, a giant rhinoceros, survived until at least 39,000 years ago — after modern humans had reached its range.',
  },
  {
    claim: 'In 1414, a giraffe presented to the Ming emperor was celebrated as a qilin.',
    truth: true,
    explanation:
      'Envoys from Bengal brought it to Nanjing, and the court painter Shen Du recorded the auspicious “qilin”.',
  },
];

/** Ranks, highest first; the first rank whose `min` the score reaches is awarded. */
export const oracleRanks: OracleRank[] = [
  { min: 8, title: 'Keeper of the Alicorn', line: 'Flawless. The unicorn would lay its head in your lap.' },
  {
    min: 6,
    title: 'Royal Bestiarist',
    line: 'A scholar of the marvellous. The tapestry weavers would hire you.',
  },
  {
    min: 4,
    title: 'Wandering Hunter',
    line: 'You’ve glimpsed the white flank between the trees. Keep going.',
  },
  {
    min: 0,
    title: 'Bewildered Villager',
    line: 'The unicorn eludes you — for now. Scroll up and try the hunt again.',
  },
];
