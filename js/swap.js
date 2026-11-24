/** swap.js - swapping two neighbours; invalid swaps slide back. */
import { state as S } from './state.js';
import { sleep } from './utils.js';
import { findMatches } from './matcher.js';
import { placeAll } from './board.js';
import { resolveMatches } from './cascade.js';
import { updateHud } from './hud.js';
import { checkEnd } from './levels.js';
import { sfx, vibrate } from './audio.js';

export async function trySwap(r1, c1, r2, c2) {
  S.busy = true;
  sfx.swap();
  const a = S.board[r1][c1];
  const b = S.board[r2][c2];
  S.board[r1][c1] = b;
  S.board[r2][c2] = a;
  placeAll();
  await sleep(260);

  if (!findMatches().length) { // invalid: swap back
    S.board[r1][c1] = a;
    S.board[r2][c2] = b;
    placeAll();
    sfx.bad();
    vibrate(40);
    a.el.classList.add('shake');
    b.el.classList.add('shake');
    await sleep(280);
    a.el.classList.remove('shake');
    b.el.classList.remove('shake');
    S.busy = false;
    return;
  }

  S.moves--;
  updateHud();
  await resolveMatches();
  updateHud();
  S.busy = false;
  checkEnd();
}
