/** main.js - entry point: wires input, starts level 1, shows the tutorial. */
import './input.js';
import { $ } from './utils.js';
import { newLevel } from './levels.js';
import { openTutorial } from './tutorial.js';

$('#hb').onclick = () => openTutorial(0);
newLevel(0);
setTimeout(() => openTutorial(0), 300);
