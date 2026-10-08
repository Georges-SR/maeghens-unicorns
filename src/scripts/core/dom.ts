/** Typed DOM helpers. `$req` throws so a renamed class fails loudly instead of silently. */

export function $<T extends Element = HTMLElement>(selector: string, root: ParentNode = document): T | null {
  return root.querySelector<T>(selector);
}

export function $req<T extends Element = HTMLElement>(selector: string, root: ParentNode = document): T {
  const el = root.querySelector<T>(selector);
  if (!el) throw new Error(`Missing required element: ${selector}`);
  return el;
}

export function $$<T extends Element = HTMLElement>(selector: string, root: ParentNode = document): T[] {
  return [...root.querySelectorAll<T>(selector)];
}

/** Run `init` for every element matching `selector` (each section script is a no-op if absent). */
export function forEach<T extends Element = HTMLElement>(selector: string, init: (el: T) => void): void {
  $$<T>(selector).forEach(init);
}
