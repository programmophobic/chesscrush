/**
 * input.js - tap / swipe on the board, plus the pause, restart and sound buttons.
 */
import { N } from './config.js';
import { state as S } from './state.js';
import { $, inBounds } from './utils.js';
import { initAudio, sfx, toggleMute } from './audio.js';
import { trySwap } from './swap.js';
import { showOverlay } from './hud.js';
import { newLevel } from './levels.js';

const boardEl = $('#board');
let press = null; // where the pointer went down

function cellFromEvent(e) {
  const rect = boardEl.getBoundingClientRect();
  return [
    Math.floor(((e.clientY - rect.top) / rect.height) * N),
    Math.floor(((e.clientX - rect.left) / rect.width) * N),
  ];
}

function markSelected() {
  boardEl.querySelectorAll('.sel').forEach((el) => el.classList.remove('sel'));
  if (!S.selected) return;
  const tile = S.board[S.selected[0]][S.selected[1]];
  if (tile) tile.el.classList.add('sel');
}

const locked = () => S.busy || S.paused || S.over;

boardEl.addEventListener('pointerdown', (e) => {
  initAudio();
  if (locked()) return;
  const [r, c] = cellFromEvent(e);
  if (inBounds(r, c)) press = { r, c, x: e.clientX, y: e.clientY };
});

boardEl.addEventListener('pointerup', async (e) => {
  if (!press || locked()) { press = null; return; }
  const { r, c, x, y } = press;
  press = null;
  const dx = e.clientX - x;
  const dy = e.clientY - y;
  const threshold = boardEl.clientWidth / 16;

  // Swipe: swap with the neighbour in the swipe direction.
  if (Math.abs(dx) > threshold || Math.abs(dy) > threshold) {
    const horizontal = Math.abs(dx) > Math.abs(dy);
    const tr = horizontal ? r : r + Math.sign(dy);
    const tc = horizontal ? c + Math.sign(dx) : c;
    S.selected = null;
    markSelected();
    if (inBounds(tr, tc)) await trySwap(r, c, tr, tc);
    return;
  }

  // Tap: swap with the selected neighbour, otherwise select this tile.
  const sel = S.selected;
  if (sel && Math.abs(sel[0] - r) + Math.abs(sel[1] - c) === 1) {
    S.selected = null;
    markSelected();
    await trySwap(sel[0], sel[1], r, c);
  } else {
    S.selected = sel && sel[0] === r && sel[1] === c ? null : [r, c];
    sfx.select();
    markSelected();
  }
});

$('#pb').onclick = () => {
  if (S.over) return;
  S.paused = !S.paused;
  $('#pb').textContent = S.paused ? 'Resume' : 'Pause';
  if (S.paused) showOverlay('Paused', 'Take your time.', 'Resume', () => $('#pb').click());
  else $('#ov').classList.remove('on');
};

$('#rb').onclick = () => { if (!S.busy) newLevel(S.level); };

$('#mu').onclick = () => {
  $('#mu').textContent = toggleMute() ? '🔇' : '🔊';
};
