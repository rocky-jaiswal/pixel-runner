import { ColorMatrixFilter, Sprite } from 'pixi.js';
import { GameState } from './gameState';

export class GameBackground {
  private readonly gameState: GameState;

  private readonly backgrounds: any[];
  private readonly colorMatrix;
  private brightness: number | null = null;

  constructor(gameState: GameState) {
    this.gameState = gameState;

    this.backgrounds = [];
    this.colorMatrix = new ColorMatrixFilter();

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

        background.filters = [this.colorMatrix];

        this.backgrounds.push(background);
        this.gameState.application.stage.addChild(background);
      });
  }

  public update() {
    if (this.gameState.isPlayerMoving) {
      this.backgrounds.forEach((bg, _i) => {
        if (this.brightness !== this.gameState.brightness) {
          this.brightness = this.gameState.brightness;
          this.colorMatrix.contrast(this.brightness, false);
        }

        if (bg.position.x < -1024) {
          bg.position.x = 3 * 1024 - this.gameState.gameSpeed * 3.1;
        } else {
          bg.position.x -= this.gameState.gameSpeed;
        }
      });
    }
  }
}
