import { AnimatedSprite, Container } from 'pixi.js';

import { GameState } from './gameState';

export class Player {
  private readonly gameState: GameState;
  private container = new Container();

  private runningAnim: AnimatedSprite | null = null;
  private jumpingAnim: AnimatedSprite | null = null;
  private duckingAnim: AnimatedSprite | null = null;
  private endingAnim: AnimatedSprite | null = null;
  private animSpeed: number | null = null;

  constructor(gameState: GameState) {
    this.gameState = gameState;
  }

  public init() {
    const spritesheet = this.gameState.playerSpriteSheet!;
    this.runningAnim = new AnimatedSprite(spritesheet.animations.running);

    this.runningAnim.position.x = this.gameState.playerPositionX;
    this.runningAnim.position.y = this.gameState.playerPositionY;
    this.runningAnim.anchor.set(0.5);

    this.jumpingAnim = new AnimatedSprite(spritesheet.animations.jumping);

    this.jumpingAnim.position.x = this.gameState.playerPositionX;
    this.jumpingAnim.position.y = this.gameState.playerPositionY;
    this.jumpingAnim.anchor.set(0.5);
    this.jumpingAnim.visible = false;

    this.duckingAnim = new AnimatedSprite(spritesheet.animations.ducking);

    this.duckingAnim.position.x = this.gameState.playerPositionX;
    this.duckingAnim.position.y = this.gameState.playerPositionY;
    this.duckingAnim.anchor.set(0.5);
    this.duckingAnim.visible = false;

    this.endingAnim = new AnimatedSprite(spritesheet.animations.ending);

    this.endingAnim.position.x = this.gameState.playerPositionX;
    this.endingAnim.position.y = this.gameState.playerPositionY;
    this.endingAnim.anchor.set(0.5);
    this.endingAnim.visible = false;

    // debug helper
    // const mark = new Graphics();
    // mark.circle(155, this.gameState.playerGroundPosition, 90);
    // mark.fill('#ff0000');
    // this.container.addChild(mark);

    // add it to the stage to render
    this.container.addChild(this.runningAnim);
    this.container.addChild(this.jumpingAnim);
    this.container.addChild(this.duckingAnim);
    this.container.addChild(this.endingAnim);

    this.gameState.application.stage.addChild(this.container);
  }

  public update() {
    if (this.gameState.isPlayerMoving) {
      if (this.gameState.gameEnded) {
        this.runningAnim!.visible = false;
        this.duckingAnim!.visible = false;
        this.jumpingAnim!.visible = false;

        this.endingAnim!.position.y = this.gameState.playerPositionY;
        this.endingAnim!.visible = true;
        return;
      }

      if (this.animSpeed !== this.gameState.gameSpeed * 0.0275) {
        this.animSpeed = this.gameState.gameSpeed * 0.0275;

        this.runningAnim!.animationSpeed = this.animSpeed;
        this.jumpingAnim!.animationSpeed = this.animSpeed;
        this.duckingAnim!.animationSpeed = this.animSpeed;
        this.endingAnim!.animationSpeed = this.animSpeed;
      }

      if (this.gameState.isPlayerJumping) {
        this.runningAnim?.stop();

        this.runningAnim!.visible = false;
        this.duckingAnim!.visible = false;
        this.jumpingAnim!.visible = true;

        this.jumpingAnim?.play();
      }

      if (this.gameState.isPlayerDucking) {
        this.runningAnim?.stop();

        this.runningAnim!.visible = false;
        this.jumpingAnim!.visible = false;
        this.duckingAnim!.visible = true;

        this.duckingAnim?.play();
      }

      if (
        !this.gameState.isPlayerDucking &&
        !this.gameState.isPlayerJumping &&
        (!this.runningAnim?.playing || !this.runningAnim.visible)
      ) {
        this.duckingAnim?.stop();
        this.jumpingAnim?.stop();

        this.duckingAnim!.visible = false;
        this.jumpingAnim!.visible = false;
        this.runningAnim!.visible = true;

        this.runningAnim!.play();
      }

      this.runningAnim!.position.y = this.gameState.playerPositionY;
      this.jumpingAnim!.position.y = this.gameState.playerPositionY;
      this.duckingAnim!.position.y = this.gameState.playerPositionY;
      this.endingAnim!.position.y = this.gameState.playerPositionY;
    }
  }
}
