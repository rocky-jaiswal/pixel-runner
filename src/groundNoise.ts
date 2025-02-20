import { Graphics } from 'pixi.js';

import { GameState } from './gameState';
import { getRandomIntBetween } from './util';

export class GroundNoise {
  private readonly gameState: GameState;

  private rocks: Graphics[] = [];

  constructor(gameState: GameState) {
    this.gameState = gameState;

    this.init();
  }

  public init() {
    Array(this.gameState.noOfRocks)
      .fill(null)
      .forEach((_, i) => {
        const x = getRandomIntBetween(0, this.gameState.width);
        const y = getRandomIntBetween(this.gameState.height - this.gameState.groundHeight, this.gameState.height);

        const rock = new Graphics();
        rock.position.set(x, y);
        rock.roundRect(0, 0, getRandomIntBetween(10, 50), getRandomIntBetween(20, 30));
        rock.fill('#c26246');

        this.rocks.push(rock);
      });

    this.rocks.forEach((r) => {
      // console.log(r.position.x);
      this.gameState.application.stage.addChild(r);
    });
  }

  public update() {
    if (this.gameState.isPlayerMoving) {
      this.rocks.forEach((rock) => {
        rock.position.x -= this.gameState.gameSpeed;

        if (rock.position.x + rock.width <= 0) {
          rock.position.x = this.gameState.width + rock.width;
        }
      });
    }
  }
}
