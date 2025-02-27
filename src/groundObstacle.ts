import { Container, Sprite } from 'pixi.js';

import { GameState } from './gameState';
import { getRandomInt, getRandomIntBetween } from './util';

export class GroundObstacle {
  private readonly gameState: GameState;

  private container = new Container();
  private elements: Sprite[] = [];

  private allElements = {
    bush: 65,
    stone: 54,
    mushroom: 70,
  };

  constructor(gameState: GameState) {
    this.gameState = gameState;

    this.gameState.application.stage.addChild(this.container);
    this.init();
  }

  public init() {
    const elem = this.addElement();
    this.elements.push(elem);
    this.container.addChild(elem);
  }

  private addElement() {
    const idx = getRandomInt(Object.keys(this.allElements).length);

    const elem = Sprite.from(Object.keys(this.allElements)[idx]);
    elem.position.x = getRandomIntBetween(this.gameState.width, this.gameState.width + 100);
    elem.position.y = this.gameState.height * this.gameState.groundHeight - Object.values(this.allElements)[idx];

    return elem;
  }

  public update() {
    if (this.gameState.isPlayerMoving) {
      // console.log(this.elements.length);

      if (this.elements.length < 1) {
        const elem = this.addElement();
        this.elements.push(elem);
        this.container.addChild(elem);
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
