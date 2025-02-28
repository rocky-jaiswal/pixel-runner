import { Ticker } from 'pixi.js';

export interface GameScene {
  init: () => void;
  update: (d: Ticker) => void;
}
