/** state.js - the one mutable game-state object, shared by every module. */

export const state = {
  board: null,     // N x N array of tiles ({ t: type, c: colour, el: DOM node })
  level: 0,
  score: 0,
  shownScore: 0,   // value currently displayed (for the count-up animation)
  moves: 0,
  stats: null,     // { kind[6], color[2], diag, knightM }
  busy: false,     // true while a swap or cascade is animating
  paused: false,
  over: false,     // level finished (won or lost)
  selected: null,  // [row, col] of the tapped tile
};
