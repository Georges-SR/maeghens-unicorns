/** Media queries shared by every script, so breakpoints and motion rules are defined once. */
export const MQ = {
  /** Wide enough for horizontal timeline, pinned hunt, side-by-side layouts. */
  desktop: '(min-width: 900px) and (min-height: 600px)',
  motion: '(prefers-reduced-motion: no-preference)',
  reducedMotion: '(prefers-reduced-motion: reduce)',
  finePointer: '(pointer: fine)',
} as const;

export const matches = (query: string): boolean => matchMedia(query).matches;

export const prefersReducedMotion = (): boolean => matches(MQ.reducedMotion);

export const hasFinePointer = (): boolean => matches(MQ.finePointer);

/** Conditions object for `gsap.matchMedia().add(...)`. */
export const MM_CONDITIONS = {
  motion: MQ.motion,
  reduced: MQ.reducedMotion,
  desktop: MQ.desktop,
} as const;

export type MMConditions = { [K in keyof typeof MM_CONDITIONS]: boolean };
