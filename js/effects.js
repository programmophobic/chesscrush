/**
 * effects.js - purely visual effects: particles, rings, board shake,
 * floating combo text and the animated score counter.
 */
import { state as S } from './state.js';
import { $ } from './utils.js';

const board = $('#board');
const COLORS = ['#ffd24a', '#ff7a45', '#fff4c2', '#7ad7ff', '#ff6fb1'];

// Burst of particles from a cell.
export function puff(r, c) {
  for (let i = 0; i < 12; i++) {
    const p = document.createElement('span');
    p.className = 'p';
    p.style.left = c * 12.5 + 5 + '%';
    p.style.top = r * 12.5 + 5 + '%';
    p.style.background = COLORS[i % COLORS.length];
    const angle = Math.random() * Math.PI * 2;
    const dist = 40 + Math.random() * 90;
    p.style.setProperty('--dx', Math.cos(angle) * dist + 'px');
    p.style.setProperty('--dy', Math.sin(angle) * dist + 'px');
    board.appendChild(p);
    setTimeout(() => p.remove(), 650);
  }
}

// Expanding shockwave ring on a cell.
export function ring(r, c, delayMs) {
  const el = document.createElement('span');
  el.className = 'ring';
  el.style.left = c * 12.5 + '%';
  el.style.top = r * 12.5 + '%';
  el.style.animationDelay = delayMs + 'ms';
  board.appendChild(el);
  setTimeout(() => el.remove(), 800 + delayMs);
}

export function shakeBoard() {
  board.classList.remove('shk');
  board.offsetWidth; // restart the animation
  board.classList.add('shk');
}

export function glowBoard() {
  board.classList.add('glow');
  setTimeout(() => board.classList.remove('glow'), 500);
}

// Floating text such as "Cascade x3 +450".
export function flash(text) {
  const el = $('#fl');
  el.textContent = text;
  el.classList.remove('on');
  el.offsetWidth;
  el.classList.add('on');
}

export function bumpScore() {
  const el = $('#sc');
  el.classList.remove('bump');
  el.offsetWidth;
  el.classList.add('bump');
}

// Counts the displayed score up towards the real score.
export function tweenScore() {
  if (S.score < S.shownScore) S.shownScore = S.score;
  const step = () => {
    S.shownScore += Math.max(1, Math.ceil((S.score - S.shownScore) / 6));
    if (S.shownScore > S.score) S.shownScore = S.score;
    $('#sc').textContent = S.shownScore.toLocaleString('en-US');
    if (S.shownScore < S.score) requestAnimationFrame(step);
  };
  step();
}
