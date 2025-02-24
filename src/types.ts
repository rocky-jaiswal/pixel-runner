import { Ticker } from 'pixi.js';

export interface GameScene {
  init: () => Promise<void>;
  update: (d: Ticker) => void;
}
