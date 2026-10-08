/** Site-wide copy and navigation. */
export const site = {
  title: 'Maeghen’s Unicorns',
  shortTitle: 'Maeghen’s Unicorns',
  description:
    'A field guide to the animal that never was — the unicorn’s origins in history, its many cultures, and its life in fiction.',
  tagline: 'A field guide to the animal that never was',
  repoUrl: 'https://github.com/Georges-SR/maeghens-unicorns',
  dedication: 'Made for <em>Maeghen</em>, who believes.',
};

/** Section anchors in page order. `id` must match the section element's id. */
export const sections = [
  { id: 'origins', label: 'Origins', numeral: 'I' },
  { id: 'hunt', label: 'The Hunt', numeral: 'II' },
  { id: 'cultures', label: 'Cultures', numeral: 'III' },
  { id: 'tapestry', label: 'Tapestry', numeral: 'IV' },
  { id: 'gallery', label: 'Gallery', numeral: 'V' },
  { id: 'fiction', label: 'Fiction', numeral: 'VI' },
  { id: 'oracle', label: 'Oracle', numeral: 'VII' },
] as const;

export type SectionId = (typeof sections)[number]['id'];

export function section(id: SectionId) {
  const found = sections.find((s) => s.id === id);
  if (!found) throw new Error(`Unknown section "${id}"`);
  return found;
}

export const hero = {
  titleLines: ['Maeghen’s', 'Unicorns'],
  lede: 'Four thousand years of seals, scrolls, tapestries, thrones and stories — about a creature no one has ever seen, and no one has ever forgotten.',
  primaryCta: { label: 'Begin the hunt', href: '#origins' },
  secondaryCta: { label: 'Test your lore', href: '#oracle' },
  caption: 'the Unicorn, a constellation charted by Petrus Plancius in 1612',
};

export const prologue = {
  quote: 'O dieses ist das Tier, das es nicht gibt.',
  quoteLang: 'de',
  translation: '“Oh, this is the creature that does not exist.”',
  attribution: 'Rainer Maria Rilke, <cite>Sonnets to Orpheus</cite> II.4, 1922',
  body: 'And yet it exists everywhere: stamped into clay in the Indus Valley, described by Greek physicians, hunted across medieval tapestries, chained to the royal arms of Scotland, and galloping through novels, films and toy boxes. This is its story — where it came from, what it meant, and why it endures.',
};
