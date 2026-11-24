/**
 * matcher.js - chess-aware match detection (no DOM, no animation).
 *
 * findMatches() returns a list of groups:
 *   { kind: 'R'|'P'|'B'|'N'|'K', cells: [[r, c], ...], col, line, d }
 * To add a new piece rule, add another detector and call it in findMatches().
 */
import { N, DIRS, FAMILIES, KNIGHT_MOVES, KING_MOVES } from './config.js';
import { state as S } from './state.js';
import { inBounds } from './utils.js';

const cellAt = (r, c) => (inBounds(r, c) ? S.board[r][c] : null);

// Rooks, pawns, bishops and queens: straight runs of 3+.
function findLines(groups) {
  for (const fam of FAMILIES) {
    for (const d of fam.dirs) {
      const [dr, dc] = DIRS[d];
      for (let r = 0; r < N; r++) {
        for (let c = 0; c < N; c++) {
          const first = cellAt(r, c);
          if (!first || !fam.types.includes(first.t)) continue;

          // Only start a run at its beginning, so runs are not counted twice.
          const prev = cellAt(r - dr, c - dc);
          if (prev && prev.c === first.c && fam.types.includes(prev.t)) continue;

          const cells = [[r, c]];
          let rr = r + dr;
          let cc = c + dc;
          for (let next = cellAt(rr, cc);
               next && next.c === first.c && fam.types.includes(next.t);
               next = cellAt(rr, cc)) {
            cells.push([rr, cc]);
            rr += dr;
            cc += dc;
          }
          if (cells.length >= 3) {
            groups.push({ kind: fam.kind, d, cells, col: first.c, line: true });
          }
        }
      }
    }
  }
}

// Connected components of marked cells (marked = Set of r*N+c).
function addClusters(marked, neighbours, groups, kind, col, minSize) {
  const seen = new Set();
  for (const start of marked) {
    if (seen.has(start)) continue;
    const stack = [start];
    const cells = [];
    seen.add(start);
    while (stack.length) {
      const key = stack.pop();
      const r = key >> 3;
      const c = key & 7;
      cells.push([r, c]);
      for (const [dr, dc] of neighbours) {
        const nr = r + dr;
        const nc = c + dc;
        const nk = nr * N + nc;
        if (inBounds(nr, nc) && marked.has(nk) && !seen.has(nk)) {
          seen.add(nk);
          stack.push(nk);
        }
      }
    }
    if (cells.length >= minSize) groups.push({ kind, cells, col, line: false, d: -1 });
  }
}

// Knights: a knight with 2+ knight-move neighbours forms an L-chain.
function findKnights(groups) {
  for (const col of [0, 1]) {
    const isKnight = (r, c) => {
      const p = cellAt(r, c);
      return p && p.t === 1 && p.c === col;
    };
    const marked = new Set();
    for (let r = 0; r < N; r++) {
      for (let c = 0; c < N; c++) {
        if (!isKnight(r, c)) continue;
        const near = KNIGHT_MOVES.map(([a, b]) => [r + a, c + b])
          .filter(([a, b]) => isKnight(a, b));
        if (near.length >= 2) {
          marked.add(r * N + c);
          near.forEach(([a, b]) => marked.add(a * N + b));
        }
      }
    }
    addClusters(marked, KNIGHT_MOVES, groups, 'N', col, 3);
  }
}

// Kings: touching clusters of 3+ (8-neighbour adjacency).
function findKings(groups) {
  for (const col of [0, 1]) {
    const marked = new Set();
    for (let r = 0; r < N; r++) {
      for (let c = 0; c < N; c++) {
        const p = cellAt(r, c);
        if (p && p.t === 5 && p.c === col) marked.add(r * N + c);
      }
    }
    addClusters(marked, KING_MOVES, groups, 'K', col, 3);
  }
}

export function findMatches() {
  const groups = [];
  findLines(groups);
  findKnights(groups);
  findKings(groups);
  return groups;
}

// True if at least one swap of two neighbours creates a match.
export function hasMove() {
  const b = S.board;
  for (let r = 0; r < N; r++) {
    for (let c = 0; c < N; c++) {
      for (const [dr, dc] of [[0, 1], [1, 0]]) {
        const r2 = r + dr;
        const c2 = c + dc;
        if (!inBounds(r2, c2)) continue;
        const a = b[r][c];
        const e = b[r2][c2];
        b[r][c] = e;
        b[r2][c2] = a;
        const ok = findMatches().length > 0;
        b[r][c] = a;
        b[r2][c2] = e;
        if (ok) return true;
      }
    }
  }
  return false;
}

/**
 * Special effects for big matches. Calls add(r, c) for every extra cell to
 * clear and returns a label for the floating text ('' if none).
 */
export function specialClear(group, add) {
  const [r0, c0] = group.cells[0];

  if (group.line && group.cells.length >= 4) {
    const [dr, dc] = DIRS[group.d];
    let r = r0;
    let c = c0;
    while (inBounds(r - dr, c - dc)) { r -= dr; c -= dc; }
    while (inBounds(r, c)) { add(r, c); r += dr; c += dc; }
    return 'Line clear!';
  }
  if (group.kind === 'P' && group.cells.length >= 5) {
    const [r, c] = group.cells[2];
    for (let a = -1; a <= 1; a++) {
      for (let b = -1; b <= 1; b++) if (inBounds(r + a, c + b)) add(r + a, c + b);
    }
    return 'Pawn blast!';
  }
  if (group.kind === 'N' && group.cells.length >= 5) {
    for (let r = 0; r < N; r++) {
      for (let c = 0; c < N; c++) {
        const p = S.board[r][c];
        if (p && p.t === 1 && p.c === group.col) add(r, c);
      }
    }
    return 'Knight storm!';
  }
  return '';
}
