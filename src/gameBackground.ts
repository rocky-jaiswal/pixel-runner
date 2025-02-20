import { Sprite } from 'pixi.js';
import { GameState } from './gameState';

export class GameBackground {
  private readonly gameState: GameState;

  private readonly backgrounds: any[];

  constructor(gameState: GameState) {
    this.gameState = gameState;

    this.backgrounds = [];

    this.init();
  }

  public init() {
    // Create two background sprites
    Array(2)
      .fill(null)
      .forEach((_, i) => {
        const background = Sprite.from('backgroundGrass');

        background.width = this.gameState.width;
        background.height = this.gameState.height;

        // Position the backgrounds next to each other
        background.position.x = i * this.gameState.width;
        background.position.y = 0;

        this.backgrounds.push(background);
        this.gameState.application.stage.addChild(background);
      });
  }

  public update() {
    if (this.gameState.isPlayerMoving) {
      this.backgrounds.forEach((bg) => {
        bg.position.x -= this.gameState.gameSpeed;

        if (bg.position.x + this.gameState.width <= 0) {
          bg.position.x = this.gameState.width - 2;
        }
      });
    }
  }
}
