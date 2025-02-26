import { Application, EventEmitter } from 'pixi.js';

interface Props {
  width: number;
  height: number;
  application: Application;
  eventEmitter: EventEmitter;
}

export class GameState {
  public readonly application: Application;
  public readonly eventEmitter: EventEmitter;

  public readonly width: number;
  public readonly height: number;

  public readonly groundHeight: number = 180;
  public readonly noOfRocks: number = 50;

  private readonly playerGround;
  private readonly brightnessLevels = [0, -0.3, -0.6];
  private readonly timeChange = 10000;

  private _brightnessIndex = 0;
  private _playerPositionY;
  private _playerPositionX = 150;
  private _jumpUp = true;
  private _jumpTimer: NodeJS.Timeout | null = null;
  private _duckTimer: NodeJS.Timeout | null = null;

  public isPlayerMoving: boolean = false;
  public isPlayerJumping: boolean = false;
  public isPlayerDucking: boolean = false;

  public gameSpeed: number = 4;
  public gameEnded: boolean = false;

  constructor(props: Props) {
    this.application = props.application;
    this.eventEmitter = props.eventEmitter;

    this.width = props.width;
    this.height = props.height;

    this.playerGround = this.height - this.groundHeight - 92;

    this._playerPositionY = this.playerGround;

    console.log({ w: this.width, h: this.height });

    // Add event handlers
    this.eventEmitter.addListener('keydown', (ev) => this.handleKeyDown(ev));
    this.eventEmitter.addListener('changeTime', () => this.changeBrightness());
    this.eventEmitter.addListener('changeGameSpeed', () => this.changeGameSpeed());

    // change light cycle
    setInterval(() => {
      this.changeGameDynamics();
    }, this.timeChange);
  }

  private handleKeyDown(ev: KeyboardEvent) {
    if (ev.key === ' ') {
      this.isPlayerMoving = true;
    }

    if (ev.key === 'ArrowUp') {
      if (!this.isPlayerJumping && !this.isPlayerDucking) {
        this.isPlayerJumping = true;
        this._jumpUp = true;
        this._jumpTimer = setInterval(() => {
          this.handleJump();
        }, 35);
      }
    }

    if (ev.key === 'ArrowDown') {
      if (!this.isPlayerJumping && !this.isPlayerDucking) {
        this.isPlayerDucking = true;
        this._duckTimer = setInterval(() => {
          this.handleDuck();
        }, 800);
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
    // console.log(this.playerGround);
    // console.log(this._playerPositionY);
    if (!this._jumpUp && this._playerPositionY === this.playerGround) {
      this.isPlayerJumping = false; // jump is complete
      this._jumpUp = true; // set back jump direction
      clearInterval(this._jumpTimer!); // clear timer
    }

    if (this._jumpUp && this._playerPositionY - this.playerGround >= -100) {
      this._jumpUp = true;
    } else {
      this._jumpUp = false;
    }

    if (this._jumpUp && this.isPlayerJumping) {
      this._playerPositionY -= 7.5;
    }

    if (!this._jumpUp && this.isPlayerJumping) {
      this._playerPositionY += 7.5;
    }
  }

  private handleDuck() {
    clearInterval(this._duckTimer!); // clear timer
    this.isPlayerDucking = false;
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
