import { ColorMatrixFilter, Graphics } from 'pixi.js';
import { GameState } from './gameState';

export class GameBackgroundSky {
  private readonly gameState: GameState;

  private readonly colorMatrix;
  private brightness: number | null = null;

  constructor(gameState: GameState) {
    this.gameState = gameState;

    this.colorMatrix = new ColorMatrixFilter();

    this.init();
  }

  public init() {
    const background = new Graphics();
    background.rect(0, 0, this.gameState.width, this.gameState.height);
    background.fill('#cfeffc');
    background.filters = [this.colorMatrix];

    this.gameState.application.stage.addChild(background);
  }

  public update() {
    this.brightness = this.gameState.brightness;
    this.colorMatrix.contrast(this.brightness, false);
  }
}
