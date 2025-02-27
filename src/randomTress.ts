import { Container, Sprite } from 'pixi.js';

import { GameState } from './gameState';
import { getRandomInt, getRandomIntBetween } from './util';

export class RandomTrees {
  private readonly gameState: GameState;
  private readonly numberOfTrees: number;
  private readonly allElements: Record<string, number>;

  private container = new Container();
  private elements: Sprite[] = [];

  constructor(gameState: GameState) {
    this.gameState = gameState;
    this.numberOfTrees = this.gameState.numberOfTrees;

    const grassStartHeight = gameState.height * this.gameState.grassStartHeight;
    this.allElements = {
      tree1: grassStartHeight - 90,
      tree2: grassStartHeight - 90,
      tree3: grassStartHeight - 90,
      tree4: grassStartHeight - 90,
    };

    this.gameState.application.stage.addChild(this.container);
    this.init();
  }

  public init() {
    if (this.elements.length < this.numberOfTrees) {
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
      if (this.elements.length < this.numberOfTrees) {
        this.addElements();
        return;
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
