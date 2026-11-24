/** board.js - creating tiles, filling the board and gravity. */
import { N, GLYPHS } from './config.js';
import { state as S } from './state.js';
import { $, randomType, randomColor } from './utils.js';
import { findMatches, hasMove } from './matcher.js';

const boardEl = $('#board');

function placeTile(tile, row, col) {
  tile.el.style.transform = 'translate(' + col * 100 + '%,' + row * 100 + '%)';
}

// Creates a tile that slides in from `fromRow` to `row`.
function createTile(type, color, row, col, fromRow) {
  const el = document.createElement('div');
  el.className = 't ' + (color ? 'k' : 'w');
  el.innerHTML = '<span class="g">' + GLYPHS[type] + '</span>';
  const tile = { t: type, c: color, el };
  placeTile(tile, fromRow, col);
  boardEl.appendChild(el);
  el.offsetWidth; // commit the start position so the transition runs
  placeTile(tile, row, col);
  return tile;
}

export function placeAll() {
  for (let r = 0; r < N; r++) {
    for (let c = 0; c < N; c++) if (S.board[r][c]) placeTile(S.board[r][c], r, c);
  }
}

// Fills the board with a random layout that has no matches but has a move.
export function fillBoard() {
  boardEl.querySelectorAll('.t').forEach((el) => el.remove());
  for (let tries = 0; tries < 500; tries++) {
    S.board = Array.from({ length: N }, () => Array(N).fill(null));
    for (let r = 0; r < N; r++) {
      for (let c = 0; c < N; c++) S.board[r][c] = { t: randomType(), c: randomColor() };
    }
    if (!findMatches().length && hasMove()) break;
  }
  for (let r = 0; r < N; r++) {
    for (let c = 0; c < N; c++) {
      const p = S.board[r][c];
      S.board[r][c] = createTile(p.t, p.c, r, c, -N + r);
    }
  }
}

// Pieces fall to fill gaps, then new pieces drop in from above.
export function applyGravity() {
  for (let c = 0; c < N; c++) {
    let write = N - 1;
    for (let r = N - 1; r >= 0; r--) {
      if (!S.board[r][c]) continue;
      S.board[write][c] = S.board[r][c];
      if (write !== r) S.board[r][c] = null;
      write--;
    }
    const missing = write + 1;
    for (let i = 0; i < missing; i++) {
      S.board[i][c] = createTile(randomType(), randomColor(), i, c, i - missing - 1);
    }
  }
  placeAll();
}
