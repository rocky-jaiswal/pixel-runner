import { AnimatedSprite, Spritesheet, Texture } from 'pixi.js';

import { GameState } from './gameState';

export class Player {
  private readonly gameState: GameState;
  private anim: AnimatedSprite | null = null;

  constructor(gameState: GameState) {
    this.gameState = gameState;
  }

  public async init() {
    const frames = Array(8)
      .fill(null)
      .map((_, i) => {
        return {
          [`walk${i}`]: {
            frame: { x: i * 192, y: 1024, w: 192, h: 256 },
            sourceSize: { w: 192, h: 256 },
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
        walking: ['walk0', 'walk1', 'walk2', 'walk3', 'walk4', 'walk5', 'walk6', 'walk7'],
      },
    };

    // TODO: Can pull this up in game state setup
    const spritesheet = new Spritesheet(Texture.from('player'), atlasData);
    await spritesheet.parse();

    this.anim = new AnimatedSprite(spritesheet.animations.walking);

    this.anim.position.x = 150;
    this.anim.position.y = this.gameState.height - this.gameState.groundHeight - 125;
    this.anim.anchor.set(0.5);
    this.anim.animationSpeed = 0.22;

    // add it to the stage to render
    this.gameState.application.stage.addChild(this.anim);
  }

  public update() {
    // console.log(1);
    if (this.gameState.isPlayerMoving) {
      // play the animation on a loop
      this.anim?.play();
    } else {
      this.anim?.stop();
    }
  }
}
