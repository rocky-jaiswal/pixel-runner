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

  // dynamic parts
  public gameSpeed: number = 2;
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
  }

  private handleKeyDown(ev: KeyboardEvent) {
    if (ev.key === ' ') {
      this.isPlayerMoving = !this.isPlayerMoving;
    }
  }
}
