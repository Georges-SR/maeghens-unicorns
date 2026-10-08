import type { FictionEntry, FictionKind } from './types';

export const fictionFilters: { kind: FictionKind | 'all'; label: string }[] = [
  { kind: 'all', label: 'All' },
  { kind: 'page', label: 'Literature' },
  { kind: 'screen', label: 'Screen' },
  { kind: 'culture', label: 'Song & culture' },
];

/** "In fiction", in chronological order. */
export const fiction: FictionEntry[] = [
  {
    year: 1871,
    title: 'Through the Looking-Glass',
    who: 'Lewis Carroll',
    kind: 'page',
    body: 'The Unicorn meets Alice and proposes a bargain: “If you’ll believe in me, I’ll believe in you.”',
  },
  {
    year: 1922,
    title: 'Sonnets to Orpheus',
    who: 'Rainer Maria Rilke',
    kind: 'page',
    body: 'A sonnet to the creature that does not exist — fed not on grain but on the possibility that it might be.',
  },
  {
    year: 1956,
    title: 'The Last Battle',
    who: 'C. S. Lewis',
    kind: 'page',
    body: 'Jewel the Unicorn, King Tirian’s dearest friend, rides into the final chapter of Narnia.',
  },
  {
    year: 1962,
    title: '“The Unicorn”',
    who: 'Shel Silverstein · The Irish Rovers, 1968',
    kind: 'culture',
    body: 'Why are there no unicorns? Because they were too busy playing to board Noah’s ark.',
  },
  {
    year: 1968,
    title: 'The Last Unicorn',
    who: 'Peter S. Beagle',
    kind: 'page',
    body: 'A unicorn learns she may be the last of her kind and sets out to find the others. Animated in 1982 — a cult classic ever since.',
  },
  {
    year: 1978,
    title: 'A Swiftly Tilting Planet',
    who: 'Madeleine L’Engle',
    kind: 'page',
    body: 'Charles Wallace rides Gaudior, a winged unicorn, through the winds of time.',
  },
  {
    year: 1982,
    title: 'Blade Runner',
    who: 'Ridley Scott',
    kind: 'screen',
    body: 'A tiny origami unicorn left on the floor — and, in the 1992 Director’s Cut, a unicorn dream — asks whether Deckard is human.',
  },
  {
    year: 1983,
    title: 'My Little Pony',
    who: 'Hasbro',
    kind: 'culture',
    body: 'Unicorn ponies gallop into toy boxes — and, decades later, into one of the most devoted fandoms on the internet.',
  },
  {
    year: 1985,
    title: 'Legend',
    who: 'Ridley Scott',
    kind: 'screen',
    body: 'The Lord of Darkness plots to destroy the last unicorns and plunge the world into eternal night.',
  },
  {
    year: 1985,
    title: 'She-Ra: Princess of Power',
    who: 'Filmation',
    kind: 'screen',
    body: 'Swift Wind, a winged unicorn, carries She-Ra into battle against the Horde.',
  },
  {
    year: 1997,
    title: 'Harry Potter and the Philosopher’s Stone',
    who: 'J. K. Rowling',
    kind: 'page',
    body: 'In the Forbidden Forest, unicorn blood can keep you alive — at the cost of a cursed half-life.',
  },
  {
    year: 2010,
    title: 'Despicable Me',
    who: 'Illumination',
    kind: 'screen',
    body: '“It’s so fluffy!” — a carnival prize unicorn becomes a meme for the ages.',
  },
  {
    year: 2013,
    title: 'The startup unicorn',
    who: 'Aileen Lee',
    kind: 'culture',
    body: 'The venture capitalist names billion-dollar startups “unicorns” — rare, magical, and much hunted.',
  },
  {
    year: 2020,
    title: 'Onward',
    who: 'Pixar',
    kind: 'screen',
    body: 'In a world that has forgotten magic, unicorns have become feral, bin-raiding pests. A sad, funny fall from grace.',
  },
];
