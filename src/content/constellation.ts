/**
 * The hero's "Monoceros" constellation: a unicorn's head in profile, facing left.
 * Shared by the WebGL sky and the static SVG fallback so both always draw the same figure.
 *
 * Coordinates are in a unit box (x right, y down); `size` is the star's relative magnitude.
 */
export interface Star {
  x: number;
  y: number;
  size: number;
}

export const stars = {
  hornTip: { x: 0.1, y: 0.02, size: 3.2 },
  hornMid: { x: 0.23, y: 0.16, size: 1.4 },
  hornBase: { x: 0.36, y: 0.3, size: 2.2 },
  brow: { x: 0.33, y: 0.37, size: 1.6 },
  earFront: { x: 0.42, y: 0.27, size: 1.4 },
  earTip: { x: 0.47, y: 0.1, size: 2.2 },
  earBack: { x: 0.5, y: 0.26, size: 1.4 },
  eye: { x: 0.34, y: 0.45, size: 2.6 },
  bridge: { x: 0.24, y: 0.53, size: 1.6 },
  nose: { x: 0.15, y: 0.62, size: 1.6 },
  muzzle: { x: 0.1, y: 0.69, size: 2.0 },
  lip: { x: 0.12, y: 0.75, size: 1.3 },
  mouth: { x: 0.19, y: 0.76, size: 1.3 },
  chin: { x: 0.25, y: 0.79, size: 1.6 },
  jaw: { x: 0.35, y: 0.72, size: 2.0 },
  throat: { x: 0.44, y: 0.7, size: 1.5 },
  neck1: { x: 0.5, y: 0.84, size: 1.5 },
  neck2: { x: 0.54, y: 1.0, size: 1.8 },
  poll: { x: 0.53, y: 0.3, size: 1.8 },
  crest1: { x: 0.64, y: 0.42, size: 1.6 },
  crest2: { x: 0.73, y: 0.6, size: 1.5 },
  crest3: { x: 0.8, y: 0.8, size: 1.6 },
  withers: { x: 0.86, y: 1.0, size: 2.0 },
  mane1: { x: 0.58, y: 0.22, size: 1.3 },
  mane2: { x: 0.7, y: 0.27, size: 1.6 },
  mane3: { x: 0.8, y: 0.4, size: 1.3 },
  mane4: { x: 0.88, y: 0.58, size: 1.8 },
  mane5: { x: 0.93, y: 0.8, size: 1.3 },
} as const satisfies Record<string, Star>;

export type StarName = keyof typeof stars;

/** `horn` lines are gilded, `mane` lines are soft and dashed, `outline` is the rest. */
export type EdgeKind = 'horn' | 'outline' | 'mane';

export interface Edge {
  from: StarName;
  to: StarName;
  kind: EdgeKind;
}

const e = (from: StarName, to: StarName, kind: EdgeKind = 'outline'): Edge => ({ from, to, kind });

/** In drawing order: the horn first, then the face, the neck and finally the mane. */
export const edges: Edge[] = [
  e('hornTip', 'hornMid', 'horn'),
  e('hornMid', 'hornBase', 'horn'),
  e('hornBase', 'brow'),
  e('hornBase', 'earFront'),
  e('earFront', 'earTip'),
  e('earTip', 'earBack'),
  e('earBack', 'poll'),
  e('brow', 'bridge'),
  e('bridge', 'nose'),
  e('nose', 'muzzle'),
  e('muzzle', 'lip'),
  e('lip', 'mouth'),
  e('mouth', 'chin'),
  e('chin', 'jaw'),
  e('jaw', 'throat'),
  e('throat', 'neck1'),
  e('neck1', 'neck2'),
  e('poll', 'crest1'),
  e('crest1', 'crest2'),
  e('crest2', 'crest3'),
  e('crest3', 'withers'),
  e('earBack', 'mane1', 'mane'),
  e('mane1', 'mane2', 'mane'),
  e('mane2', 'mane3', 'mane'),
  e('mane3', 'mane4', 'mane'),
  e('mane4', 'mane5', 'mane'),
];

/** Stars drawn with a four-point sparkle. */
export const sparkles: StarName[] = ['hornTip', 'eye'];
