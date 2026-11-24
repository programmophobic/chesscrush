/** hud.js - score/moves/goal display and the in-board overlay. */
import { LEVELS } from './config.js';
import { state as S } from './state.js';
import { $ } from './utils.js';
import { tweenScore } from './effects.js';

export function progress() {
  const L = LEVELS[S.level];
  switch (L.g) {
    case 'score': return S.score;
    case 'kind': return S.stats.kind[L.k];
    case 'color': return S.stats.color[L.k];
    case 'diag': return S.stats.diag;
    default: return S.stats.knightM;
  }
}

export function updateHud() {
  const L = LEVELS[S.level];
  const done = Math.min(progress(), L.n);
  const fmt = (n) => n.toLocaleString('en-US');
  $('#lv').textContent = S.level + 1;
  tweenScore();
  $('#mv').textContent = S.moves;
  $('#gd').textContent = L.d + ': ' + fmt(done) + ' / ' + fmt(L.n);
  $('#bar i').style.width = (done / L.n) * 100 + '%';
}

export function showOverlay(title, text, buttonLabel, onClick) {
  const ov = $('#ov');
  ov.innerHTML = '<h2></h2><p></p>';
  ov.firstChild.textContent = title;
  ov.lastChild.textContent = text;
  if (buttonLabel) {
    const btn = document.createElement('button');
    btn.className = 'main';
    btn.textContent = buttonLabel;
    btn.onclick = onClick;
    ov.appendChild(btn);
  }
  ov.classList.add('on');
}
