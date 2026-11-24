/** cascade.js - the match -> pop -> fall -> repeat loop and its effects. */
import { N } from './config.js';
import { state as S } from './state.js';
import { sleep } from './utils.js';
import { findMatches, hasMove, specialClear } from './matcher.js';
import { applyGravity, fillBoard } from './board.js';
import { updateHud } from './hud.js';
import { puff, ring, shakeBoard, glowBoard, flash, bumpScore } from './effects.js';
import { sfx, vibrate } from './audio.js';

export async function resolveMatches() {
  let chain = 0;
  for (;;) {
    const groups = findMatches();
    if (!groups.length) break;
    chain++;

    // Merge overlapping groups into one set of cells; add special clears.
    const cells = new Set();
    const add = (r, c) => cells.add(r * N + c);
    let base = 0;
    let label = '';
    for (const g of groups) {
      g.cells.forEach(([r, c]) => add(r, c));
      base += g.cells.length * 10 + (g.cells.length - 3) * 25;
      const special = specialClear(g, add);
      if (special) { label = special; base += 150; }
      if (g.d >= 2) S.stats.diag++;
      if (g.kind === 'N') S.stats.knightM++;
    }
    const multiplier = chain + (groups.length > 1 ? groups.length - 1 : 0);
    const gain = Math.round(base * multiplier + cells.size * 5);

    // Highlight, then pop.
    for (const key of cells) {
      const tile = S.board[key >> 3][key & 7];
      if (tile) tile.el.classList.add('hl');
    }
    await sleep(260);

    let k = 0;
    for (const key of cells) {
      const r = key >> 3;
      const c = key & 7;
      const tile = S.board[r][c];
      if (!tile) continue;
      S.stats.kind[tile.t]++;
      S.stats.color[tile.c]++;
      tile.el.classList.remove('hl');
      tile.el.classList.add('pop');
      puff(r, c);
      sfx.pop(chain, k++);
      S.board[r][c] = null;
      setTimeout(() => tile.el.remove(), 260);
    }

    S.score += gain;
    showImpact(label, chain, cells, gain);
    updateHud();
    await sleep(240);

    applyGravity();
    await sleep(300);
    squashLanded();
    sfx.drop();
    await sleep(60);
  }

  if (!hasMove()) {
    flash('No moves: reshuffle');
    await sleep(500);
    fillBoard();
    await sleep(500);
  }
}

function showImpact(label, chain, cells, gain) {
  if (label) {
    cells.forEach((key) => ring(key >> 3, key & 7, (key & 7) * 25));
  }
  if (label || chain >= 3 || cells.size >= 7) {
    shakeBoard();
    sfx.big();
    vibrate([30, 40, 30]);
    glowBoard();
  } else {
    vibrate(12);
  }
  bumpScore();
  const text = (label ? label + ' ' : '') + (chain > 1 ? 'Cascade ×' + chain + ' ' : '') + '+' + gain;
  flash(text);
}

function squashLanded() {
  for (let r = 0; r < N; r++) {
    for (let c = 0; c < N; c++) {
      const tile = S.board[r][c];
      if (!tile) continue;
      tile.el.classList.add('land');
      setTimeout(() => tile.el.classList.remove('land'), 320);
    }
  }
}
