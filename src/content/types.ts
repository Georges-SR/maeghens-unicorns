/**
 * Content model for the whole site.
 *
 * Every piece of text and every artwork lives in `src/content/*.ts` as typed data.
 * Components only render it, so editing copy never means touching markup or motion code.
 *
 * Fields typed `Html` may contain a small set of inline tags (`<em>`, `<cite>`, `<strong>`)
 * and are rendered with `set:html`. They are authored here, never user-supplied.
 */
import type { ImageMetadata } from 'astro';

/** Trusted inline HTML authored in this repository. */
export type Html = string;

export type License = 'CC0' | 'Public domain';

export interface Artwork {
  /** Stable id, used to reference the artwork from other content. */
  id: string;
  image: ImageMetadata;
  title: string;
  /** Artist, workshop or culture. */
  maker: string;
  date: string;
  /** Current home of the original. */
  collection: string;
  license: License;
  /** Wikimedia Commons file page the image was taken from. */
  sourceUrl: string;
  alt: string;
  /** Render as light lines on dark (for line drawings on white paper). */
  invert?: boolean;
}

export interface TimelineEvent {
  id: string;
  /** Short label shown in the running year counter, e.g. "77 CE". */
  marker: string;
  /** Full date line on the card, e.g. "2nd–4th century CE". */
  date: string;
  title: string;
  body: Html;
  artworkId?: string;
}

export interface HuntChapter {
  numeral: string;
  title: string;
  body: Html;
  artworkId: string;
  /** Focal point for the slow camera move, as percentages of the image. */
  focus: { x: number; y: number };
}

export interface Culture {
  id: string;
  /** Decorative glyph from the culture's own script. */
  glyph: string;
  region: string;
  name: string;
  body: Html;
}

export interface TapestryDetail {
  id: string;
  label: string;
  title: string;
  body: Html;
  /** Hotspot position, as percentages of the tapestry image. */
  x: number;
  y: number;
}

export type FictionKind = 'page' | 'screen' | 'culture';

export interface FictionEntry {
  year: number;
  title: string;
  who: string;
  kind: FictionKind;
  body: Html;
}

export interface OracleQuestion {
  claim: string;
  truth: boolean;
  explanation: string;
}

export interface OracleRank {
  /** Minimum score needed for this rank. */
  min: number;
  title: string;
  line: string;
}
