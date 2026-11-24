/** utils.js - small helpers with no game knowledge. */
import { N, WEIGHTS } from './config.js';

export const $ = (selector) => document.querySelector(selector);
export const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
export const inBounds = (r, c) => r >= 0 && c >= 0 && r < N && c < N;
export const randomColor = () => (Math.random() < 0.5 ? 1 : 0);

// Weighted random piece type (see WEIGHTS).
export function randomType() {
  const total = WEIGHTS.reduce((a, b) => a + b, 0);
  let x = Math.random() * total;
  for (let i = 0; i < WEIGHTS.length; i++) {
    x -= WEIGHTS[i];
    if (x < 0) return i;
  }
  return 0;
}
