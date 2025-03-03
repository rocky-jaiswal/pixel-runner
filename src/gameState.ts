import { Application, EventEmitter, Spritesheet } from 'pixi.js';
import { getRandomInt, getRandomIntBetween } from './util';

interface Props {
  width: number;
  height: number;
  application: Application;
  eventEmitter: EventEmitter;
}

export class Enemy {
  public readonly id;
  public readonly type: 'g' | 'a' = 'g';
  public position: number = 0;
  public rendered: boolean = false;
  public isPast: boolean = false;

  constructor(type: 'g' | 'a', position: number, rendered: boolean) {
    this.id = crypto.randomUUID();
    this.type = type;
    this.position = position;
    this.rendered = rendered;
  }
}

export class GameState {
  public readonly application: Application;
  public readonly eventEmitter: EventEmitter;

  public readonly width: number;
  public readonly height: number;

  public readonly grassStartHeight = 0.6;
  public readonly groundHeight: number = 0.85;
  public readonly noOfRocks: number = 50;
  public readonly numberOfHills = 12;
  public readonly numberOfTrees = 6;
  public readonly numberOfGroundElements = 1;
  public readonly playerGroundPosition: number;

  private readonly brightnessLevels = [0, -0.3, -0.7];
  private readonly timeChange = 10000;

  private _brightnessIndex = 0;
  private _gameSpeedStep = 4;

  private _playerPositionX = 150;
  private _playerPositionY: number;

  private _jumpUp = true;
  private _jumpHeight = 115;
  private _jumpStep = 7.5;
  private _duckDepth = 4;
  private _wasJustDucking: boolean = false;

  private _gameTimer: NodeJS.Timeout | null = null;
  private _jumpTimer: NodeJS.Timeout | null = null;
  private _duckTimer: NodeJS.Timeout | null = null;
  private _duckingControlTimer: NodeJS.Timeout | null = null;
  private _enemyReleaseTimer: NodeJS.Timeout | null = null;

  public playerSpriteSheet: Spritesheet | null = null;
  public flyingEnemySpriteSheet: Spritesheet | null = null;

  public isPlayerMoving: boolean = false;
  public isPlayerJumping: boolean = false;
  public isPlayerDucking: boolean = false;

  public gameSpeed: number = 8;
  public gameEnded: boolean = false;
  public worldStopped: boolean = false;

  public enemies: Enemy[] = [];
  public score: number = 0;

  constructor(props: Props) {
    this.application = props.application;
    this.eventEmitter = props.eventEmitter;

    this.width = props.width;
    this.height = props.height;
    console.log({ w: this.width, h: this.height });

    this.playerGroundPosition = this.height * this.groundHeight - 92;

    // when not jumping
    this._playerPositionY = this.playerGroundPosition;

    // Add event handlers
    this.eventEmitter.addListener('keydown', (ev) => this.handleKeyDown(ev));
    this.eventEmitter.addListener('changeTime', () => this.changeBrightness());
    this.eventEmitter.addListener('changeGameSpeed', () => this.changeGameSpeed());
    this.eventEmitter.addListener('releaseEnemy', () => this.releaseEnemy());
    this.eventEmitter.addListener('updateScore', () => this.updateScore());
    this.eventEmitter.addListener('gameEnded', () => this.endGame());
  }

  private handleKeyDown(ev: KeyboardEvent) {
    if (ev.key === ' ' || ev.key === 'ArrowUp') {
      if (!this.isPlayerMoving) {
        this.isPlayerMoving = true;

        // change light cycle
        this._gameTimer = setInterval(() => {
          this.changeGameDynamics();
        }, this.timeChange);

        // release enemies
        this.eventEmitter.emit('releaseEnemy');
      }
    }

    if (ev.key === 'ArrowUp') {
      if (!this.isPlayerJumping && !this.isPlayerDucking) {
        this.isPlayerJumping = true;
        this._jumpUp = true;
        this._jumpTimer = setInterval(() => {
          this.handleJump();
        }, 25);
      }
    }

    if (ev.key === 'ArrowDown') {
      if (!this.isPlayerJumping && !this.isPlayerDucking && !this._wasJustDucking) {
        this.isPlayerDucking = true;
        this._playerPositionY += this._duckDepth;

        if (this._duckingControlTimer) {
          clearTimeout(this._duckingControlTimer);
        }

        this._duckTimer = setInterval(() => {
          this.handleDuck();
        }, 750);
      }
    }

    if (ev.key === 'x') {
      this.eventEmitter.emit('gameEnded');
    }
  }

  private changeGameDynamics() {
    this.eventEmitter.emit('changeTime');
    this.eventEmitter.emit('changeGameSpeed');
  }

  private changeBrightness() {
    if (this._brightnessIndex === 2) {
      this._brightnessIndex = 0;
    } else {
      this._brightnessIndex += 1;
    }
  }

  private changeGameSpeed() {
    if (this.gameSpeed < 16) {
      this.gameSpeed += this._gameSpeedStep;
    } else {
      this.gameSpeed += this._gameSpeedStep / 2;
    }
  }

  private handleJump() {
    if (!this._jumpUp && this._playerPositionY === this.playerGroundPosition) {
      this.isPlayerJumping = false; // jump is complete
      this._jumpUp = true; // set back jump direction
      clearInterval(this._jumpTimer!); // clear timer
    }

    if (this._jumpUp && this._playerPositionY - this.playerGroundPosition >= -this._jumpHeight) {
      this._jumpUp = true;
    } else {
      this._jumpUp = false;
    }

    if (this._jumpUp && this.isPlayerJumping) {
      this._playerPositionY -= this._jumpStep;
    }

    if (!this._jumpUp && this.isPlayerJumping) {
      this._playerPositionY += this._jumpStep;
    }
  }

  private handleDuck() {
    this._playerPositionY -= this._duckDepth;
    clearInterval(this._duckTimer!); // clear timer
    this.isPlayerDucking = false;

    this._wasJustDucking = true;
    this._duckingControlTimer = setInterval(() => {
      this._wasJustDucking = false;
    }, 450);
  }

  private releaseEnemy() {
    // console.log(this.enemies);

    if (this._enemyReleaseTimer) {
      clearInterval(this._enemyReleaseTimer);
    }

    if (this.isPlayerMoving) {
      const e = getRandomInt(100) % 4 === 0 ? 'a' : 'g';
      this.enemies.push(new Enemy(e, this.width + 50, false));

      // again release an enemy
      this._enemyReleaseTimer = setInterval(
        () => {
          this.eventEmitter.emit('releaseEnemy');
        },
        getRandomIntBetween(1225, 1600),
      );
    }
  }

  private updateScore() {
    this.score += this.gameSpeed * 0.01;
    this.eventEmitter.emit('changeScore', Math.ceil(this.score));
  }

  private endGame() {
    if (this._enemyReleaseTimer) {
      clearInterval(this._enemyReleaseTimer);
    }
    if (this._jumpTimer) {
      clearInterval(this._jumpTimer);
    }
    if (this._duckTimer) {
      clearInterval(this._duckTimer);
    }
    if (this._gameTimer) {
      clearInterval(this._gameTimer);
    }
    if (this._duckingControlTimer) {
      clearTimeout(this._duckingControlTimer);
    }

    const highScore = localStorage.getItem('_pixel_runner_high_score') ?? '0';

    if (this.score > parseInt(highScore)) {
      localStorage.setItem('_pixel_runner_high_score', Math.ceil(this.score).toString());
    }

    this._playerPositionY = this.playerGroundPosition + 5;
    this.gameEnded = true;
  }

  public get playerPositionX() {
    return this._playerPositionX;
  }

  public get playerPositionY() {
    return this._playerPositionY;
  }

  public get brightness() {
    return this.brightnessLevels[this._brightnessIndex];
  }
}
