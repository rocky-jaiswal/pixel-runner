import { Container, Sprite } from 'pixi.js';

import { GameState } from './gameState';
import { getRandomInt, getRandomIntBetween } from './util';

export class RandomTrees {
  private readonly gameState: GameState;

  private container = new Container();
  private elements: Sprite[] = [];

  private allElements = {
    tree1: 595,
    tree2: 610,
    tree3: 620,
    tree4: 625,
  };

  constructor(gameState: GameState) {
    this.gameState = gameState;

    this.gameState.application.stage.addChild(this.container);
    this.init();
  }

  public init() {
    if (this.elements.length < 8) {
      this.addElements(true);
    }
  }

  private addElements(initial: boolean = false) {
    const idx = getRandomInt(Object.keys(this.allElements).length);

    const elem = Sprite.from(Object.keys(this.allElements)[idx]);
    elem.position.x = getRandomIntBetween(
      initial ? 0 : this.gameState.width,
      initial ? this.gameState.width : this.gameState.width + this.gameState.width,
    );
    elem.position.y = Object.values(this.allElements)[idx];

    this.elements.push(elem);
    this.container.addChild(elem);
  }

  public update() {
    if (this.gameState.isPlayerMoving) {
      // console.log(this.elements.length);

      if (this.elements.length < 8) {
        this.addElements();
      }

      this.elements.forEach((elem, idx) => {
        if (elem.renderable) {
          elem.position.x -= this.gameState.gameSpeed;
        }

        if (elem.position.x < -200) {
          elem.renderable = false;
          this.elements.splice(idx, 1);
        }
      });
    }
  }
}
