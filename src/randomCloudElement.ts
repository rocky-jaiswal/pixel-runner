import { ColorMatrixFilter, Sprite } from 'pixi.js';

import { GameState } from './gameState';
import { getRandomInt, getRandomIntBetween } from './util';

export class RandomCloudElement {
  private readonly gameState: GameState;

  private elements: Sprite[] = [];
  private colorMatrix: ColorMatrixFilter;
  private brightness: number | null = null;

  private allElements = {
    cloud1: 30,
    cloud2: 35,
    cloud3: 40,
    cloud4: 45,
  };

  constructor(gameState: GameState) {
    this.gameState = gameState;

    this.colorMatrix = new ColorMatrixFilter();
    this.init();
  }

  public init() {
    const elem = this.addElement(null);
    this.elements.push(elem);
    this.gameState.application.stage.addChild(elem);
  }

  private addElement(at: number | null) {
    const idx = getRandomInt(Object.keys(this.allElements).length);

    const elem = Sprite.from(Object.keys(this.allElements)[idx]);
    elem.position.x = at ?? getRandomIntBetween(0, this.gameState.width);
    elem.position.y = Object.values(this.allElements)[idx];

    elem.filters = [this.colorMatrix];

    return elem;
  }

  public update() {
    if (this.gameState.isPlayerMoving) {
      // console.log(this.elements.length);
      if (this.brightness !== this.gameState.brightness) {
        this.brightness = this.gameState.brightness;
        this.colorMatrix.contrast(this.brightness, false);
      }

      if (this.elements.length < 1) {
        const elem = this.addElement(this.gameState.width + 100);
        this.elements.push(elem);
        this.gameState.application.stage.addChild(elem);
      }

      this.elements.forEach((elem, idx) => {
        if (elem.renderable) {
          elem.position.x = elem.position.x - this.gameState.gameSpeed * 0.15;
        }

        if (elem.position.x + elem.width <= 0) {
          elem.renderable = false;
          this.elements.splice(idx, 1);
        }
      });
    }
  }
}
