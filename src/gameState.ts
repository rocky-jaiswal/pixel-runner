import { Application, EventEmitter } from 'pixi.js';
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
  public readonly playerGround;

  private readonly brightnessLevels = [0, -0.3, -0.6];
  private readonly timeChange = 10000;

  private _brightnessIndex = 0;

  private _playerPositionY;
  private _playerPositionX = 150;

  private _jumpUp = true;
  private _jumpHeight = 115;
  private _jumpStep = 7.5;

  private _jumpTimer: NodeJS.Timeout | null = null;
  private _duckTimer: NodeJS.Timeout | null = null;

  public isPlayerMoving: boolean = false;
  public isPlayerJumping: boolean = false;
  public isPlayerDucking: boolean = false;

  public gameSpeed: number = 8;
  public gameEnded: boolean = false;

  private _enemyReleaseTimer: NodeJS.Timeout | null = null;
  public enemies: Enemy[] = [];

  constructor(props: Props) {
    this.application = props.application;
    this.eventEmitter = props.eventEmitter;

    this.width = props.width;
    this.height = props.height;
    console.log({ w: this.width, h: this.height });

    this.playerGround = this.height * this.groundHeight - 92;

    // when not jumping
    this._playerPositionY = this.playerGround;

    // Add event handlers
    this.eventEmitter.addListener('keydown', (ev) => this.handleKeyDown(ev));
    this.eventEmitter.addListener('changeTime', () => this.changeBrightness());
    this.eventEmitter.addListener('changeGameSpeed', () => this.changeGameSpeed());
    this.eventEmitter.addListener('releaseEnemy', () => this.releaseEnemy());

    // change light cycle
    setInterval(() => {
      this.changeGameDynamics();
    }, this.timeChange);
  }

  private handleKeyDown(ev: KeyboardEvent) {
    if (ev.key === ' ' || ev.key === 'ArrowUp') {
      if (!this.isPlayerMoving) {
        this.isPlayerMoving = true;

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
      if (!this.isPlayerJumping && !this.isPlayerDucking) {
        this.isPlayerDucking = true;
        this._playerPositionY += 4;
        this._duckTimer = setInterval(() => {
          this.handleDuck();
        }, 500);
      }
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
      this.gameSpeed += 4;
    }
  }

  private handleJump() {
    if (!this._jumpUp && this._playerPositionY === this.playerGround) {
      this.isPlayerJumping = false; // jump is complete
      this._jumpUp = true; // set back jump direction
      clearInterval(this._jumpTimer!); // clear timer
    }

    if (this._jumpUp && this._playerPositionY - this.playerGround >= -this._jumpHeight) {
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
    this._playerPositionY -= 4;
    clearInterval(this._duckTimer!); // clear timer
    this.isPlayerDucking = false;
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
        getRandomIntBetween(1225, 1550),
      );
    }
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
