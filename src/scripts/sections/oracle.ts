/**
 * The Oracle quiz. A small state machine: question → (answer) → verdict → (next) → … → fate.
 * The card flips with GSAP; a correct answer throws a burst of gold sparks.
 */
import { oracleQuestions, oracleRanks } from '@/content/oracle';
import { $req } from '@/scripts/core/dom';
import { prefersReducedMotion } from '@/scripts/core/env';
import { gsap } from '@/scripts/core/motion';

type Phase = 'question' | 'verdict' | 'fate';

export function initOracle(root: HTMLElement): void {
  const ui = {
    card: $req('[data-oracle-card]', root),
    front: $req('[data-oracle-front]', root),
    back: $req('[data-oracle-back]', root),
    claim: $req('[data-oracle-claim]', root),
    answers: $req('[data-oracle-answers]', root),
    verdict: $req('[data-oracle-verdict]', root),
    explain: $req('[data-oracle-explain]', root),
    next: $req<HTMLButtonElement>('[data-oracle-next]', root),
    count: $req('[data-oracle-count]', root),
    score: $req('[data-oracle-score]', root),
    sparks: $req('[data-oracle-sparks]', root),
  };
  const nextLabel = ui.next.querySelector('.btn__label') ?? ui.next;
  const reduced = prefersReducedMotion();
  const total = oracleQuestions.length;

  let index = 0;
  let score = 0;
  let phase: Phase = 'question';

  /** Show the front (question) or back (verdict) face. */
  function flip(toBack: boolean): void {
    gsap.to(ui.card, { rotationY: toBack ? 180 : 0, duration: reduced ? 0 : 1, ease: 'power3.inOut' });
    ui.front.inert = toBack;
    ui.back.inert = !toBack;
  }

  function showQuestion(): void {
    phase = 'question';
    const q = oracleQuestions[index]!;
    ui.count.textContent = `${index + 1} / ${total}`;
    ui.claim.textContent = q.claim;
    ui.answers.hidden = false;
    flip(false);
  }

  function answer(saysTruth: boolean): void {
    if (phase !== 'question') return;
    phase = 'verdict';
    const q = oracleQuestions[index]!;
    const right = saysTruth === q.truth;
    if (right) score++;
    ui.score.textContent = `Score ${score}`;
    ui.verdict.textContent = right
      ? q.truth
        ? 'Truth — well read.'
        : 'Myth — well spotted.'
      : q.truth
        ? 'Alas — it’s true.'
        : 'Alas — a myth.';
    ui.verdict.className = `quiz__verdict ${right ? 'is-right' : 'is-wrong'}`;
    ui.explain.textContent = q.explanation;
    nextLabel.textContent = index === total - 1 ? 'See my fate' : 'Next';
    flip(true);
    if (right) burst();
    ui.next.focus({ preventScroll: true });
  }

  function showFate(): void {
    phase = 'fate';
    const rank = oracleRanks.find((r) => score >= r.min) ?? oracleRanks[oracleRanks.length - 1]!;
    ui.count.textContent = 'Your fate';
    ui.claim.innerHTML = `${score} of ${total}: <em>${rank.title}</em>`;
    ui.answers.hidden = true;
    flip(false);
    gsap.delayedCall(reduced ? 0 : 1.1, () => {
      ui.verdict.textContent = rank.title;
      ui.verdict.className = 'quiz__verdict is-right';
      ui.explain.textContent = rank.line;
      nextLabel.textContent = 'Consult again';
      flip(true);
      burst(28);
    });
  }

  function next(): void {
    if (phase === 'fate') {
      index = 0;
      score = 0;
      ui.score.textContent = 'Score 0';
      showQuestion();
    } else if (index < total - 1) {
      index++;
      showQuestion();
    } else {
      showFate();
      return;
    }
    root.querySelector<HTMLElement>('[data-answer]')?.focus({ preventScroll: true });
  }

  /** A radial burst of gold sparks from behind the card. */
  function burst(count = 18): void {
    if (reduced) return;
    for (let i = 0; i < count; i++) {
      const spark = document.createElement('i');
      ui.sparks.append(spark);
      const angle = (i / count) * Math.PI * 2 + Math.random() * 0.4;
      const dist = 140 + Math.random() * 160;
      gsap.fromTo(
        spark,
        { x: 0, y: 0, scale: 1, opacity: 1 },
        {
          x: Math.cos(angle) * dist,
          y: Math.sin(angle) * dist * 0.7,
          scale: 0,
          opacity: 0,
          duration: 1 + Math.random() * 0.6,
          ease: 'expo.out',
          onComplete: () => spark.remove(),
        },
      );
    }
  }

  ui.answers.addEventListener('click', (e) => {
    const btn = (e.target as HTMLElement).closest<HTMLElement>('[data-answer]');
    if (btn) answer(btn.dataset['answer'] === 'truth');
  });
  ui.next.addEventListener('click', next);

  showQuestion();
}
