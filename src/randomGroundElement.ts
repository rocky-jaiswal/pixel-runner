import { Container, Sprite } from 'pixi.js';

import { GameState } from './gameState';
import { getRandomInt, getRandomIntBetween } from './util';

export class RandomGroundElement {
  private readonly gameState: GameState;

  private container = new Container();
  private elements: Sprite[] = [];

  private allElements = {
    house1: 545,
    house2: 545,
    tower1: 535,
    tower2: 535,
  };

  constructor(gameState: GameState) {
    this.gameState = gameState;

    this.gameState.application.stage.addChild(this.container);
    this.init();
  }

  public init() {
    const elem = this.addElement(null);
    this.elements.push(elem);
    this.container.addChild(elem);
  }

  private addElement(at: number | null) {
    const idx = getRandomInt(Object.keys(this.allElements).length);

    const elem = Sprite.from(Object.keys(this.allElements)[idx]);
    elem.position.x = at ?? getRandomIntBetween(0, this.gameState.width);
    elem.position.y = Object.values(this.allElements)[idx];

    return elem;
  }

  public update() {
    if (this.gameState.isPlayerMoving) {
      // console.log(this.elements.length);

      if (this.elements.length < 1) {
        const elem = this.addElement(this.gameState.width + 100);
        this.elements.push(elem);
        this.container.addChild(elem);
      }

      this.elements.forEach((elem, idx) => {
        if (elem.renderable) {
          elem.position.x -= this.gameState.gameSpeed * 1.2;
        }

        if (elem.position.x + elem.width <= 0) {
          elem.renderable = false;
          this.elements.splice(idx, 1);
        }
      });
    }
  }
}
