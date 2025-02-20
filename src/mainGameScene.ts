import { Container, Ticker } from 'pixi.js';

import { GameState } from './gameState';
import { GameScene } from './types';
import { GameBackground } from './gameBackground';
import { Ground } from './ground';
import { GroundNoise } from './groundNoise';
import { RandomGroundElement } from './randomGroundElement';
import { RandomCloudElement } from './randomCloudElement';

export class MainGameScene extends Container implements GameScene {
  private readonly gameState: GameState;

  private gameBackground: GameBackground | null = null;
  private ground: Ground | null = null;
  private groundNoise: GroundNoise | null = null;
  private randomElement1: RandomCloudElement | null = null;
  private randomElement2: RandomGroundElement | null = null;

  constructor(gameState: GameState) {
    super();

    this.gameState = gameState;
  }

  public init() {
    // Add stuff
    this.gameBackground = new GameBackground(this.gameState);
    this.ground = new Ground(this.gameState);
    this.groundNoise = new GroundNoise(this.gameState);
    this.randomElement1 = new RandomCloudElement(this.gameState);
    this.randomElement2 = new RandomGroundElement(this.gameState);
  }

  public update(_delta: Ticker) {
    // console.log({ delta, state: this.gameState });
    this.gameBackground?.update();
    this.ground?.update();
    this.groundNoise?.update();
    this.randomElement1?.update();
    this.randomElement2?.update();
  }

  public cleanup() {
    // Clean up resources when scene is destroyed
    this.removeAllListeners();
    this.removeChildren();
  }
}
