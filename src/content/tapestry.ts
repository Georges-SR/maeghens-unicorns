import type { TapestryDetail } from './types';

/** "Read the tapestry": hotspots on The Unicorn Rests in a Garden, in reading order. */
export const tapestryIntro = {
  eyebrow: 'The Met Cloisters, New York',
  title: 'A captive by choice?',
  body: 'The unicorn sits inside a fence it could easily leap. Is this the risen Christ, or a lover, happily tamed? Medieval viewers were comfortable holding both meanings at once. Choose a glowing point to begin.',
};

export const tapestryDetails: TapestryDetail[] = [
  {
    id: 'horn',
    label: 'The horn',
    title: 'The horn',
    body: 'Long, straight and spiralled — clearly modelled on the narwhal tusks that circulated in Europe as “alicorns”. Weavers knew exactly what a unicorn horn looked like, because they could see one in a cathedral treasury.',
    x: 32,
    y: 26,
  },
  {
    id: 'pomegranate',
    label: 'The pomegranate tree',
    title: 'The pomegranate tree',
    body: 'Bursting with seeds, the pomegranate was a symbol of fertility and marriage — and, in Christian art, of the Resurrection and the unity of the Church. The unicorn is tethered to it.',
    x: 48,
    y: 12,
  },
  {
    id: 'monogram',
    label: 'The monogram',
    title: 'The monogram',
    body: 'The letters <strong>A</strong> and a reversed <strong>E</strong>, tied together with a cord, appear in the tree and in the corners. They surely name the couple who commissioned the set — but who they were is still a mystery.',
    x: 43,
    y: 24,
  },
  {
    id: 'chain',
    label: 'The collar and chain',
    title: 'Collar & chain',
    body: 'A jewelled collar binds the unicorn to the tree by a slender gold chain. The tether is decorative rather than cruel: a sign of devotion, the bond of a faithful lover.',
    x: 42,
    y: 47,
  },
  {
    id: 'stains',
    label: 'The red stains',
    title: 'The red stains',
    body: 'Are they wounds from the hunt in the other tapestries? Most scholars read them instead as juice dripping from the ripe pomegranates above — not blood, but a sign of fruitfulness.',
    x: 57,
    y: 56,
  },
  {
    id: 'tail',
    label: 'The beard, hooves and tail',
    title: 'Beard, hooves & tail',
    body: 'Look closely: this is not a horse. The medieval unicorn has a goat’s beard, cloven hooves and a lion-like tufted tail — a patchwork animal assembled from ancient descriptions.',
    x: 70,
    y: 49,
  },
  {
    id: 'fence',
    label: 'The fence',
    title: 'The fence',
    body: 'A circular paling barely higher than the unicorn’s back. Like the enclosed garden of medieval love poetry, it marks a paradise — a place one stays in willingly.',
    x: 19,
    y: 64,
  },
  {
    id: 'flowers',
    label: 'The flowers',
    title: 'A thousand flowers',
    body: 'The dark <em>millefleur</em> ground is a botanical record: botanists have identified dozens of real plants here, among them wild orchids, Madonna lilies, carnations and wild strawberries — many associated with love and marriage.',
    x: 81,
    y: 83,
  },
];
