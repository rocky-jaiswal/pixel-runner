import { AnimatedSprite, Container, Spritesheet, Texture } from 'pixi.js';

import { Enemy, GameState } from './gameState';

class FlyngEnemy {
  public readonly id: string;
  public readonly sprite: AnimatedSprite;

  constructor(id: string, sprite: AnimatedSprite) {
    this.id = id;
    this.sprite = sprite;
  }
}

export class FlyingEnemy {
  private readonly gameState: GameState;
  private container = new Container();
  private spritesheet: Spritesheet | null = null;
  private elements: FlyngEnemy[] = [];

  constructor(gameState: GameState) {
    this.gameState = gameState;

    this.gameState.application.stage.addChild(this.container);
  }

  public async init() {
    const frames = Array(13)
      .fill(null)
      .map((_, i) => {
        return {
          [`f${i}`]: {
            frame: { x: i * 108, y: 5, w: 108, h: 65 },
            sourceSize: { w: 108, h: 65 },
          },
        };
      })
      .reduce((acc, obj) => {
        acc[Object.keys(obj)[0]] = Object.values(obj)[0];
        return acc;
      }, {});

    const atlasData = {
      frames,
      meta: {
        scale: 1,
      },
      animations: {
        flying: ['f0', 'f1', 'f2', 'f3', 'f4', 'f3', 'f2'],
      },
    };

    // TODO: Can pull this up in game state setup (to avoid async / await)
    this.spritesheet = new Spritesheet(Texture.from('flyingEnemy'), atlasData);
    this.spritesheet.parse();
  }

  private addEnemy(enemy: Enemy) {
    const flyingAnimatedSprite = new AnimatedSprite(this.spritesheet!.animations.flying);

    flyingAnimatedSprite.position.x = enemy.position;
    flyingAnimatedSprite.position.y = this.gameState.playerGround - 90;

    flyingAnimatedSprite.anchor.set(0.5);
    flyingAnimatedSprite.visible = true;
    flyingAnimatedSprite.animationSpeed = this.gameState.gameSpeed * 0.0275;
    flyingAnimatedSprite.play();

    this.elements.push(new FlyngEnemy(enemy.id, flyingAnimatedSprite));
    this.container.addChild(flyingAnimatedSprite);
  }

  public update() {
    if (this.gameState.isPlayerMoving) {
      const enemies = this.gameState.enemies.filter((e) => e.type === 'a');

      enemies.forEach((enemy) => {
        if (!enemy.rendered) {
          this.addEnemy(enemy);
          enemy.rendered = true;
        }
      });

      this.elements.forEach((elem, idx) => {
        const match = enemies.find((e) => e.id === elem.id);

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
