import type { HuntChapter } from './types';

/**
 * "The Hunt": the seven Unicorn Tapestries told as one scroll-driven story.
 * `focus` is where the slow camera move settles on each tapestry (percent of the image).
 */
export const huntIntro = {
  title: 'The Hunt of the Unicorn',
  body: 'Seven tapestries, woven around 1500 and now at The Met Cloisters, tell one story: a hunt, a capture, a death — and a strange resurrection. Reportedly used to shield vegetables from frost after the French Revolution, they were bought by John D. Rockefeller Jr. and given to the museum in 1937.',
};

export const hunt: HuntChapter[] = [
  {
    numeral: 'I',
    title: 'The hunters enter the woods',
    body: 'At dawn, a party of noblemen and hunters sets out with their hounds. In the trees, a scout raises his hand: the quarry has been sighted.',
    artworkId: 'hunt-hunters',
    focus: { x: 55, y: 45 },
  },
  {
    numeral: 'II',
    title: 'The unicorn purifies water',
    body: 'At a fountain, the unicorn kneels and dips its horn into the stream to cleanse it of poison, so the other animals can drink. The hunters watch, astonished — and wait.',
    artworkId: 'hunt-purifies',
    focus: { x: 40, y: 72 },
  },
  {
    numeral: 'III',
    title: 'The unicorn is attacked',
    body: 'Startled, the unicorn leaps across the stream. The hunters close in from every side, spears levelled, horns sounding.',
    artworkId: 'hunt-attacked',
    focus: { x: 70, y: 40 },
  },
  {
    numeral: 'IV',
    title: 'The unicorn defends itself',
    body: 'Cornered, it fights back: kicking out at the hunters and goring a hound with its horn. No ordinary beast, it will not be taken by force.',
    artworkId: 'hunt-defends',
    focus: { x: 50, y: 55 },
  },
  {
    numeral: 'V',
    title: 'The mystic capture',
    body: 'Only two fragments survive. A maiden — of whom just a sleeve and a hand on the mane remain — tames the unicorn, as the old legend demands, while her companion signals to the hunter.',
    artworkId: 'hunt-mystic',
    focus: { x: 68, y: 70 },
  },
  {
    numeral: 'VI',
    title: 'Killed and brought to the castle',
    body: 'The unicorn is speared. Its body, wreathed in oak, is carried on horseback to the lord and lady of the castle — an image Christian viewers read as the Passion of Christ.',
    artworkId: 'hunt-killed',
    focus: { x: 45, y: 65 },
  },
  {
    numeral: 'VII',
    title: 'The unicorn rests in a garden',
    body: 'And yet here it is, alive, collared and content within a low fence beneath a pomegranate tree. Resurrection, or a lover happily tamed? Perhaps both.',
    artworkId: 'hunt-captivity',
    focus: { x: 48, y: 48 },
  },
];
