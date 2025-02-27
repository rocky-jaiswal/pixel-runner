import { AnimatedSprite, Spritesheet, Texture } from 'pixi.js';

import { GameState } from './gameState';

export class FlyingEnemy {
  private readonly gameState: GameState;

  private flyingAnim: AnimatedSprite | null = null;
  //   private animSpeed: number | null = null;

  constructor(gameState: GameState) {
    this.gameState = gameState;
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
    const spritesheet = new Spritesheet(Texture.from('flyingEnemy'), atlasData);
    await spritesheet.parse();

    this.flyingAnim = new AnimatedSprite(spritesheet.animations.flying);

    this.flyingAnim.position.x = this.gameState.playerPositionX + 100;
    this.flyingAnim.position.y = this.gameState.playerPositionY - 100;

    this.flyingAnim.anchor.set(0.5);
    this.flyingAnim.visible = true;
    this.flyingAnim.animationSpeed = this.gameState.gameSpeed * 0.0275;
    this.flyingAnim.play();

    // add it to the stage to render
    this.gameState.application.stage.addChild(this.flyingAnim);
  }

  public update() {}
}
