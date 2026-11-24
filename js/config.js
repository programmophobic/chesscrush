/** config.js - constants and level data. No logic, no state. */

export const N = 8; // board is N x N

// Piece types are indexes into this array: P N B R Q K
export const GLYPHS = ['\u265F', '\u265E', '\u265D', '\u265C', '\u265B', '\u265A']
  .map((g) => g + '\uFE0E'); // force text (not emoji) rendering

// How often each type spawns: pawn, knight, bishop, rook, queen, king
export const WEIGHTS = [3, 3, 2, 3, 2, 2];

// Line directions: horizontal, vertical, diagonal, anti-diagonal
export const DIRS = [[0, 1], [1, 0], [1, 1], [1, -1]];

export const KNIGHT_MOVES = [
  [1, 2], [2, 1], [-1, 2], [-2, 1],
  [1, -2], [2, -1], [-1, -2], [-2, -1],
];
export const KING_MOVES = [
  [0, 1], [1, 0], [0, -1], [-1, 0],
  [1, 1], [1, -1], [-1, 1], [-1, -1],
];

/**
 * Line-matching families. A run of 3+ same-colour pieces whose types are all
 * in `types`, travelling along one of `dirs`, is a match.
 * Queens appear in both the rook and bishop families, so they bridge them.
 */
export const FAMILIES = [
  { kind: 'R', types: [3, 4], dirs: [0, 1] },
  { kind: 'P', types: [0], dirs: [0, 1] },
  { kind: 'B', types: [2, 4], dirs: [2, 3] },
];

/**
 * Level goals. g = goal type:
 *   score | kind (k = type index) | color (k: 0 white, 1 black) | diag | knightM
 */
export const LEVELS = [
  { m: 25, g: 'score', n: 1500, d: 'Reach 1,500 points' },
  { m: 24, g: 'kind', k: 1, n: 10, d: 'Clear 10 knights' },
  { m: 24, g: 'color', k: 0, n: 30, d: 'Clear 30 white pieces' },
  { m: 22, g: 'diag', n: 6, d: 'Make 6 diagonal matches' },
  { m: 25, g: 'score', n: 3500, d: 'Reach 3,500 points' },
  { m: 24, g: 'knightM', n: 4, d: 'Make 4 knight L-matches' },
  { m: 22, g: 'color', k: 1, n: 40, d: 'Clear 40 black pieces' },
  { m: 22, g: 'score', n: 5500, d: 'Reach 5,500 points' },
];
