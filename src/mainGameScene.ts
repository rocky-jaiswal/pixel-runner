import { Container, Graphics, Ticker } from 'pixi.js';

import { GameState } from './gameState';
import { GameScene } from './types';

export class MainGameScene extends Container implements GameScene {
  private readonly gameState: GameState;

  constructor(gameState: GameState) {
    super();

    this.gameState = gameState;
  }

  public init() {
    const graphics = new Graphics();

    // Rectangle
    graphics.rect(50, 50, 100, 100);
    graphics.fill(0xde3249);

    this.gameState.application.stage.addChild(graphics);
  }

  public update(_delta: Ticker) {
    // console.log({ delta, state: this.gameState });
  }

  public cleanup() {
    // Clean up resources when scene is destroyed
    this.removeAllListeners();
    this.removeChildren();
  }
}
