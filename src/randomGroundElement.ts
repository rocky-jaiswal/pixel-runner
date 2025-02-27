import { Container, Sprite } from 'pixi.js';

import { GameState } from './gameState';
import { getRandomInt, getRandomIntBetween } from './util';

export class RandomGroundElement {
  private readonly gameState: GameState;

  private container = new Container();
  private elements: Sprite[] = [];

  private readonly numberOfElements: number;
  private readonly allElements: Record<string, number>;

  constructor(gameState: GameState) {
    this.gameState = gameState;
    this.numberOfElements = this.gameState.numberOfGroundElements;

    const grassStartHeight = gameState.height * this.gameState.grassStartHeight;
    this.allElements = {
      house1: grassStartHeight - 80,
      house2: grassStartHeight - 80,
      tower1: grassStartHeight - 135,
      tower2: grassStartHeight - 135,
    };

    this.gameState.application.stage.addChild(this.container);
    this.init();
  }

  public init() {
    if (this.numberOfElements > 0) {
      const elem = this.addElement(null);
      this.elements.push(elem);
      this.container.addChild(elem);
    }
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

      if (this.elements.length < this.numberOfElements) {
        const elem = this.addElement(this.gameState.width + 100);
        this.elements.push(elem);
        this.container.addChild(elem);

        return;
      }

      this.elements.forEach((elem, idx) => {
        if (elem.renderable) {
          elem.position.x -= this.gameState.gameSpeed;
        }

        if (elem.position.x + elem.width <= 0) {
          elem.renderable = false;
          this.elements.splice(idx, 1);
        }
      });
    }
  }
}
