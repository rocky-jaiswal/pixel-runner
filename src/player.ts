import { AnimatedSprite, Spritesheet, Texture } from 'pixi.js';

import { GameState } from './gameState';

export class Player {
  private readonly gameState: GameState;

  private runningAnim: AnimatedSprite | null = null;
  private duckingAnim: AnimatedSprite | null = null;
  private animSpeed: number | null = null;

  constructor(gameState: GameState) {
    this.gameState = gameState;
  }

  public async init() {
    const frames = Array(13)
      .fill(null)
      .map((_, i) => {
        return {
          [`f${i}`]: {
            frame: { x: i * 192, y: 5, w: 192, h: 224 },
            sourceSize: { w: 192, h: 223 },
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
        walking: ['f0', 'f1', 'f2', 'f3', 'f4', 'f5', 'f6', 'f7'],
        jumping: ['f5', 'f6', 'f7', 'f8', 'f9'],
        ducking: ['f10'],
      },
    };

    // TODO: Can pull this up in game state setup (to avoid async / await)
    const spritesheet = new Spritesheet(Texture.from('player'), atlasData);
    await spritesheet.parse();

    this.runningAnim = new AnimatedSprite(spritesheet.animations.walking);

    this.runningAnim.position.x = this.gameState.playerPositionX;
    this.runningAnim.position.y = this.gameState.playerPositionY;
    this.runningAnim.anchor.set(0.5);

    this.duckingAnim = new AnimatedSprite(spritesheet.animations.ducking);

    this.duckingAnim.position.x = this.gameState.playerPositionX;
    this.duckingAnim.position.y = this.gameState.playerPositionY;
    this.duckingAnim.anchor.set(0.5);
    this.duckingAnim.visible = false;

    // add it to the stage to render
    this.gameState.application.stage.addChild(this.runningAnim);
    this.gameState.application.stage.addChild(this.duckingAnim);
  }

  public update() {
    if (this.gameState.isPlayerMoving) {
      if (this.animSpeed !== this.gameState.gameSpeed * 0.0275) {
        this.animSpeed = this.gameState.gameSpeed * 0.0275;
        this.runningAnim!.animationSpeed = this.animSpeed;
        this.duckingAnim!.animationSpeed = this.animSpeed;
      }

      if (this.gameState.isPlayerDucking) {
        this.runningAnim?.stop();

        this.runningAnim!.visible = false;
        this.duckingAnim!.visible = true;

        this.duckingAnim?.play();
      }

      if (!this.gameState.isPlayerDucking && (!this.runningAnim?.playing || !this.runningAnim.visible)) {
        this.duckingAnim?.stop();

        this.duckingAnim!.visible = false;
        this.runningAnim!.visible = true;

        this.runningAnim!.play();
      }

      this.runningAnim!.position.y = this.gameState.playerPositionY;
      this.duckingAnim!.position.y = this.gameState.playerPositionY;
    }
  }
}
