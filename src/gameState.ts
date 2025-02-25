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
  private readonly brightnessLevels = [0, -0.3, -0.6];
  private readonly timeChange = 10000;

  // dynamic parts
  private brightnessIndex = 0;

  public gameSpeed: number = 4;
  public isPlayerMoving: boolean = false;
  public gameEnded: boolean = false;

  constructor(props: Props) {
    this.application = props.application;
    this.eventEmitter = props.eventEmitter;

    this.width = props.width;
    this.height = props.height;

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
  }

  private changeGameDynamics() {
    this.eventEmitter.emit('changeTime');
    this.eventEmitter.emit('changeGameSpeed');
  }

  private changeBrightness() {
    if (this.brightnessIndex === 2) {
      this.brightnessIndex = 0;
    } else {
      this.brightnessIndex += 1;
    }
  }

  private changeGameSpeed() {
    if (this.gameSpeed < 16) {
      this.gameSpeed += 4;
    }
  }

  public get brightness() {
    return this.brightnessLevels[this.brightnessIndex];
  }
}
