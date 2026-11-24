/** levels.js - win/lose handling and level setup. */
import { LEVELS } from './config.js';
import { state as S } from './state.js';
import { $ } from './utils.js';
import { puff } from './effects.js';
import { sfx } from './audio.js';
import { fillBoard } from './board.js';
import { progress, updateHud, showOverlay } from './hud.js';

export function checkEnd() {
  if (progress() >= LEVELS[S.level].n) {
    S.over = true;
    sfx.win();
    for (let i = 0; i < 16; i++) {
      setTimeout(() => puff(Math.random() * 8 | 0, Math.random() * 8 | 0), i * 70);
    }
    const stars = S.moves >= 8 ? 3 : S.moves >= 3 ? 2 : 1;
    const hasNext = S.level < LEVELS.length - 1;
    showOverlay(
      'Level ' + (S.level + 1) + ' cleared',
      'Score ' + S.score.toLocaleString('en-US') + ' · ' + '★'.repeat(stars) + '☆'.repeat(3 - stars),
      hasNext ? 'Next level' : 'Play again',
      () => newLevel(hasNext ? S.level + 1 : 0)
    );
  } else if (S.moves <= 0) {
    S.over = true;
    sfx.lose();
    showOverlay('Out of moves', 'Goal: ' + LEVELS[S.level].d, 'Try again', () => newLevel(S.level));
  }
}

export function newLevel(i) {
  S.level = i;
  S.score = 0;
  S.moves = LEVELS[i].m;
  S.over = false;
  S.paused = false;
  S.selected = null;
  S.stats = { kind: Array(6).fill(0), color: [0, 0], diag: 0, knightM: 0 };
  $('#ov').classList.remove('on');
  $('#pb').textContent = 'Pause';
  fillBoard();
  updateHud();
}
