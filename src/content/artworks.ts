/**
 * Every artwork on the site, with its credit line.
 * The colophon renders its credits from this list, so adding a work here credits it automatically.
 */
import bestiary from '@/assets/art/bestiary.jpg';
import giraffe from '@/assets/art/giraffe.jpg';
import hunters from '@/assets/art/hunt-1-hunters.jpg';
import purifies from '@/assets/art/hunt-2-purifies.jpg';
import attacked from '@/assets/art/hunt-3-attacked.jpg';
import defends from '@/assets/art/hunt-4-defends.jpg';
import mystic from '@/assets/art/hunt-5-mystic.jpg';
import killed from '@/assets/art/hunt-6-killed.jpg';
import captivity from '@/assets/art/hunt-7-captivity.jpg';
import indusSeal from '@/assets/art/indus-seal.jpg';
import ladyDesire from '@/assets/art/lady-desire.jpg';
import ladySight from '@/assets/art/lady-sight.jpg';
import narwhal from '@/assets/art/narwhal.jpg';
import raphael from '@/assets/art/raphael.jpg';
import wormianum from '@/assets/art/wormianum.jpg';
import type { Artwork } from './types';

const commons = (file: string) => `https://commons.wikimedia.org/wiki/File:${file.replaceAll(' ', '_')}`;

const UNICORN_TAPESTRIES = {
  maker: 'South Netherlandish workshop',
  date: '1495–1505',
  collection: 'The Met Cloisters, New York · Gift of John D. Rockefeller Jr., 1937',
  license: 'CC0',
} as const;

const LADY_AND_THE_UNICORN = {
  maker: 'Flemish weavers after a Parisian design',
  date: 'c. 1500',
  collection: 'Musée de Cluny, Paris',
  license: 'Public domain',
} as const;

export const artworks = [
  {
    id: 'hunt-hunters',
    image: hunters,
    title: 'The Hunters Enter the Woods',
    ...UNICORN_TAPESTRIES,
    sourceUrl: commons('The Hunters Enter the Woods (from the Unicorn Tapestries) MET DP118981.jpg'),
    alt: 'Tapestry: noblemen and hunters with spears and hounds set out into a flowering wood; a scout signals from the trees.',
  },
  {
    id: 'hunt-purifies',
    image: purifies,
    title: 'The Unicorn Purifies Water',
    ...UNICORN_TAPESTRIES,
    sourceUrl: commons('The Unicorn is Found (from the Unicorn Tapestries) MET DP118983.jpg'),
    alt: 'Tapestry: a white unicorn kneels at a fountain and dips its horn into the stream while hunters gather and animals wait to drink.',
  },
  {
    id: 'hunt-attacked',
    image: attacked,
    title: 'The Unicorn Is Attacked',
    ...UNICORN_TAPESTRIES,
    sourceUrl: commons('The Unicorn is Attacked (from the Unicorn Tapestries) MET DP118985.jpg'),
    alt: 'Tapestry: the unicorn leaps across a stream while hunters close in from all sides with spears.',
  },
  {
    id: 'hunt-defends',
    image: defends,
    title: 'The Unicorn Defends Itself',
    ...UNICORN_TAPESTRIES,
    sourceUrl: commons('The Unicorn Defends Itself (from the Unicorn Tapestries) MET DP118987.jpg'),
    alt: 'Tapestry: surrounded by hunters and hounds, the unicorn kicks out and gores a dog with its horn.',
  },
  {
    id: 'hunt-mystic',
    image: mystic,
    title: 'The Mystic Capture of the Unicorn',
    ...UNICORN_TAPESTRIES,
    sourceUrl: commons('The Mystic Capture of the Unicorn (from the Unicorn Tapestries) MET DP155501.jpg'),
    alt: 'Two tapestry fragments: a hunter blows his horn among trees, and a woman in red stands beside the white unicorn inside a fence.',
  },
  {
    id: 'hunt-killed',
    image: killed,
    title: 'The Unicorn Is Killed and Brought to the Castle',
    ...UNICORN_TAPESTRIES,
    sourceUrl: commons(
      'The Unicorn is Killed and Brought to the Castle (from the Unicorn Tapestries) MET DP118990.jpg',
    ),
    alt: 'Tapestry: hunters spear the unicorn; below, its body is carried on a horse to a lord and lady before a castle.',
  },
  {
    id: 'hunt-captivity',
    image: captivity,
    title: 'The Unicorn Rests in a Garden',
    ...UNICORN_TAPESTRIES,
    sourceUrl: commons('The Unicorn in Captivity (from the Unicorn Tapestries) MET DP118991.jpg'),
    alt: 'Tapestry: a white unicorn rests inside a low round wooden fence beneath a pomegranate tree, on a dark ground thick with flowers.',
  },
  {
    id: 'lady-desire',
    image: ladyDesire,
    title: 'À mon seul désir',
    ...LADY_AND_THE_UNICORN,
    sourceUrl: commons('(Toulouse) Mon seul désir (La Dame à la licorne) - Musée de Cluny Paris.jpg'),
    alt: 'Tapestry: a lady stands before a blue tent inscribed “À mon seul désir”, flanked by a lion and a unicorn on a red flowered ground.',
  },
  {
    id: 'lady-sight',
    image: ladySight,
    title: 'Sight',
    ...LADY_AND_THE_UNICORN,
    sourceUrl: commons('(Toulouse) Le Vue (La Dame à la licorne) - Musée de Cluny Paris.jpg'),
    alt: 'Tapestry: a seated lady holds up a mirror in which a unicorn, its forelegs in her lap, sees its own reflection.',
  },
  {
    id: 'raphael',
    image: raphael,
    title: 'Young Woman with Unicorn',
    maker: 'Raphael',
    date: 'c. 1505–06',
    collection: 'Galleria Borghese, Rome',
    license: 'Public domain',
    sourceUrl: commons('Raphael Portrait of a Lady with a Unicorn.jpg'),
    alt: 'Raphael’s portrait of a young blonde woman in a red and gold gown, holding a small unicorn in her lap before a landscape.',
  },
  {
    id: 'bestiary',
    image: bestiary,
    title: 'Monoceros',
    maker: 'Aberdeen Bestiary, f. 15r',
    date: 'c. 1200',
    collection: 'University of Aberdeen, MS 24',
    license: 'Public domain',
    sourceUrl: commons('F15r-aberdeen-best-detail.jpg'),
    alt: 'Manuscript illumination: a leaping red-and-white unicorn with a long horn on a gold ground framed in blue.',
  },
  {
    id: 'indus-seal',
    image: indusSeal,
    title: '“Unicorn” seal',
    maker: 'Indus Valley Civilization',
    date: 'c. 2600–1900 BCE',
    collection: 'Cast of a seal',
    license: 'CC0',
    sourceUrl: commons('Unicorn. Mold of Seal, Indus valley civilization.jpg'),
    alt: 'A square Indus Valley seal showing a one-horned bull-like animal facing a ritual stand, beneath a line of undeciphered script.',
  },
  {
    id: 'giraffe',
    image: giraffe,
    title: 'Tribute Giraffe with Attendant',
    maker: 'After Shen Du',
    date: 'Ming dynasty',
    collection: 'Philadelphia Museum of Art',
    license: 'Public domain',
    sourceUrl: commons('Tribute Giraffe with Attendant cropped.jpg'),
    alt: 'Ming dynasty painting of a giraffe led on a rope by an attendant, on a plain silk ground.',
  },
  {
    id: 'wormianum',
    image: wormianum,
    title: 'Museum Wormianum',
    maker: 'Frontispiece of Ole Worm’s catalogue',
    date: '1655',
    collection: 'Printed book, Leiden',
    license: 'Public domain',
    sourceUrl: commons('1655 - Frontispiece of Museum Wormiani Historia.jpg'),
    alt: 'Engraving of Ole Worm’s cabinet of curiosities: shelves of shells, horns and specimens, with stuffed animals hanging from the ceiling.',
  },
  {
    id: 'narwhal',
    image: narwhal,
    title: 'Narwhal',
    maker: 'Pearson Scott Foresman',
    date: '20th century',
    collection: 'Wikimedia Commons',
    license: 'Public domain',
    sourceUrl: commons('Narwhal (PSF).png'),
    alt: 'Line drawing of a narwhal, a spotted whale with a single long spiralled tusk.',
    invert: true,
  },
] as const satisfies readonly Artwork[];

export type ArtworkId = (typeof artworks)[number]['id'];

const byId = new Map<string, Artwork>(artworks.map((a) => [a.id, a]));

/** Look up an artwork; throws at build time on a typo so broken references never ship. */
export function artwork(id: string): Artwork {
  const found = byId.get(id);
  if (!found) throw new Error(`Unknown artwork id "${id}"`);
  return found;
}

/** Works shown in the gallery, in display order. */
export const galleryIds: ArtworkId[] = [
  'lady-desire',
  'hunt-hunters',
  'raphael',
  'lady-sight',
  'hunt-captivity',
  'bestiary',
  'hunt-purifies',
  'giraffe',
  'indus-seal',
  'hunt-defends',
  'wormianum',
];
