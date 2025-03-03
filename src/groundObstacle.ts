import { Container, Sprite } from 'pixi.js';

import { Enemy, GameState } from './gameState';
import { getRandomInt } from './util';

class GroundEnemy {
  public readonly id: string;
  public readonly sprite: Sprite;

  constructor(id: string, sprite: Sprite) {
    this.id = id;
    this.sprite = sprite;
  }
}

export class GroundObstacle {
  private readonly gameState: GameState;
  private container = new Container();
  private elements: GroundEnemy[] = [];

  private allElements = {
    bush: 65,
    stone: 60,
    mushroom: 65,
  };

  constructor(gameState: GameState) {
    this.gameState = gameState;

    this.gameState.application.stage.addChild(this.container);
  }

  private addEnemy(enemy: Enemy) {
    const idx = getRandomInt(Object.keys(this.allElements).length);

    const sprite = Sprite.from(Object.keys(this.allElements)[idx]);
    sprite.position.x = enemy.position;
    sprite.position.y = this.gameState.height * this.gameState.groundHeight - Object.values(this.allElements)[idx];

    this.elements.push(new GroundEnemy(enemy.id, sprite));
    this.container.addChild(sprite);
  }

  public update() {
    if (this.gameState.isPlayerMoving) {
      const groundEnemies = this.gameState.enemies.filter((e) => e.type === 'g');

      groundEnemies.forEach((enemy) => {
        if (!enemy.rendered) {
          this.addEnemy(enemy);
          enemy.rendered = true;
        }
      });

      this.elements.forEach((elem, idx) => {
        const match = groundEnemies.find((e) => e.id === elem.id);

        if (elem.sprite.renderable) {
          elem.sprite.position.x -= this.gameState.gameSpeed;
          match!.position = elem.sprite.position.x;
        }

        if (elem.sprite.position.x + elem.sprite.width <= 0) {
          elem.sprite.renderable = false;
          match!.isPast = true;
          this.elements.splice(idx, 1);
        }
      });
    }
  }
}
