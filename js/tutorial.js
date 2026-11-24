/**
 * tutorial.js - step-by-step "how to play" overlay with mini boards.
 *
 * Grid tokens: "-" empty, "wR" white rook, "bN" black knight.
 * Suffix "*" = part of the match (pulses), "^" = piece being swapped (ringed).
 */
import { GLYPHS } from './config.js';
import { $ } from './utils.js';

const PAGES = [
  {
    title: 'Nasıl oynanır?',
    text: 'İki komşu taşa dokun (ya da kaydır) ve yer değiştir. Yer değişince eşleşme oluşuyorsa taşlar patlar, oluşmuyorsa geri döner. Siyah taşlar yalnızca siyahla, beyazlar yalnızca beyazla eşleşir. Eşleşme, taşın satrançtaki hareketine göre kurulur.',
    grid: ['- - - - -', '- - - - -', 'wR wR bN^ - -', 'bB - wR^ - bP', '- - - - -'],
  },
  {
    title: 'Kale ve Vezir',
    text: 'Kale yatay veya dikey 3 ya da daha fazla taşla eşleşir. Vezir kale gibi de davranır: kale, vezir, kale yan yana gelebilir. Vezir her yönde eşleşebilir.',
    grid: ['wR* wQ* wR* - -', '- - - - bR*', '- - - - bQ*', 'wB - - - bR*', '- - - - -'],
  },
  {
    title: 'Fil ve Vezir',
    text: 'Fil, çapraz çizgide 3 veya daha fazla taşla eşleşir. İki çapraz yön de geçerli. Fil, vezir, fil çaprazı da çalışır.',
    grid: ['wB* - - - -', '- wQ* - - -', '- - wB* - bB*', '- - - bQ* -', '- - bB* - -'],
  },
  {
    title: 'Piyon',
    text: 'Piyon yalnızca piyonlarla, yatay veya dikey dizilerek eşleşir. Kale ve vezirle karışmaz. 5 piyon dizersen çevresindeki 3×3 alan patlar.',
    grid: ['wP* wP* wP* - -', '- - - - bP*', 'wR - - - bP*', '- - - - bP*', '- bN - - -'],
  },
  {
    title: 'At',
    text: 'At L şeklinde zıplar: 3 at bir at zinciri oluşturunca eşleşir. Ortadaki at, diğer ikisine tam bir at hamlesi uzaklıktadır. 5 at birleşirse o rengin tüm atları patlar.',
    grid: ['- - wN* - -', 'wN* - - - -', '- - - wN* -', '- - - - -', '- - - - bN'],
  },
  {
    title: 'Şah',
    text: 'Şah yalnızca bir kare uzağa gider. 3 veya daha fazla şah yatay, dikey ya da çapraz birbirine değerek bir küme kurarsa eşleşir. Uzaktaki şahlar sayılmaz.',
    grid: ['- - - - -', '- wK* - - -', '- - wK* wK* -', '- - - - -', 'bK - - - -'],
  },
  {
    title: 'Özel hamleler',
    text: 'Bir çizgide 4 veya daha fazla taş eşleştirirsen tüm satır, sütun ya da çapraz temizlenir. Aynı anda birden çok eşleşme ve zincirleme patlamalar puanı katlar. Her seviyede hamlen sınırlı: hedefi hamleler bitmeden tamamla.',
    grid: ['wR* wR* wR* wR* -', '- - - - -', 'bP* - - - -', 'bP* - - - -', 'bP* - - - -'],
  },
];

function renderBoard(grid) {
  let html = '<div class="mb">';
  grid.forEach((row, r) => {
    row.split(' ').forEach((token, c) => {
      const square = (r + c) % 2 ? 'd' : 'l';
      if (token === '-') {
        html += '<div class="mc ' + square + '"></div>';
        return;
      }
      const color = token[0] === 'b' ? 'k' : 'w';
      const type = 'PNBRQK'.indexOf(token[1]);
      const extra = (token.includes('*') ? ' hl' : '') + (token.includes('^') ? ' sel' : '');
      html += '<div class="mc ' + square + ' ' + color + extra + '">' +
        '<span class="g">' + GLYPHS[type] + '</span></div>';
    });
  });
  return html + '</div>';
}

function close() {
  $('#tut').classList.remove('on');
}

function open(i) {
  const page = PAGES[i];
  const last = i === PAGES.length - 1;
  const dots = PAGES.map((_, j) => '<i' + (j === i ? ' class="on"' : '') + '></i>').join('');

  $('#tut').innerHTML =
    '<div class="tc"><h3>' + page.title + '</h3>' + renderBoard(page.grid) +
    '<p>' + page.text + '</p><div class="dots">' + dots + '</div>' +
    '<div class="row">' +
    '<button id="tb"' + (i ? '' : ' disabled') + '>Geri</button>' +
    '<button id="ts">Atla</button>' +
    '<button class="main" id="tn">' + (last ? 'Oyna' : 'İleri') + '</button>' +
    '</div></div>';
  $('#tut').classList.add('on');

  $('#tb').onclick = () => open(i - 1);
  $('#tn').onclick = () => (last ? close() : open(i + 1));
  $('#ts').onclick = close;
}

export { open as openTutorial };
