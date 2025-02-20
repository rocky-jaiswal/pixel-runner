import { Graphics } from 'pixi.js';
import { GameState } from './gameState';

export class Ground {
  private readonly gameState: GameState;

  constructor(gameState: GameState) {
    this.gameState = gameState;

    this.init();
  }

  public init() {
    const graphics = new Graphics();
    graphics.rect(
      0,
      this.gameState.height - this.gameState.groundHeight,
      this.gameState.width,
      this.gameState.groundHeight,
    );
    graphics.fill('#d26b4c');

    this.gameState.application.stage.addChild(graphics);
  }

  public update() {}
}
