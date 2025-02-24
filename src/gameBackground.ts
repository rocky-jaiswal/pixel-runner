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
    Array(4)
      .fill(null)
      .forEach((_, i) => {
        const background = Sprite.from('backgroundGrass');

        background.width = 1024;
        background.height = this.gameState.height;

        // Position the backgrounds next to each other
        background.position.x = i * 1024;
        background.position.y = 0;

        this.backgrounds.push(background);
        this.gameState.application.stage.addChild(background);
      });
  }

  public update() {
    if (this.gameState.isPlayerMoving) {
      this.backgrounds.forEach((bg) => {
        bg.position.x -= this.gameState.gameSpeed;

        if (bg.position.x <= -1 * 1024) {
          bg.position.x = 3 * 1024;
        }
      });
    }
  }
}
