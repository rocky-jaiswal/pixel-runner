import { Container, Ticker } from 'pixi.js';

import { GameState } from './gameState';
import { GameScene } from './types';
import { GameBackgroundSky } from './gameBackgroundSky';
import { Ground } from './ground';
import { GroundNoise } from './groundNoise';
import { RandomGroundElement } from './randomGroundElement';
import { RandomCloudElement } from './randomCloudElement';
import { Player } from './player';
import { GroundObstacle } from './groundObstacle';
import { FlyingEnemy } from './flyingEnemy';
import { GameBackgroundGrass } from './gameBackgroundGrass';
import { RandomTrees } from './randomTress';
import { BackgroundMountains } from './backgroundMountains';

export class MainGameScene extends Container implements GameScene {
  private readonly gameState: GameState;

  private gameBackgroundSky: GameBackgroundSky | null = null;
  private gameBackgroundGrass: GameBackgroundGrass | null = null;
  private backgroundMountains: BackgroundMountains | null = null;

  private ground: Ground | null = null;
  private groundNoise: GroundNoise | null = null;

  private randomTrees: RandomTrees | null = null;
  private randomElement1: RandomCloudElement | null = null;
  private randomElement2: RandomGroundElement | null = null;

  private player: Player | null = null;
  private groundObstacle: GroundObstacle | null = null;
  private flyingEnemy: FlyingEnemy | null = null;

  constructor(gameState: GameState) {
    super();

    this.gameState = gameState;
  }

  public async init() {
    // Add stuff
    this.gameBackgroundSky = new GameBackgroundSky(this.gameState);
    this.backgroundMountains = new BackgroundMountains(this.gameState);
    this.gameBackgroundGrass = new GameBackgroundGrass(this.gameState);

    this.ground = new Ground(this.gameState);
    this.groundNoise = new GroundNoise(this.gameState);

    this.randomTrees = new RandomTrees(this.gameState);
    this.randomElement1 = new RandomCloudElement(this.gameState);
    this.randomElement2 = new RandomGroundElement(this.gameState); // towers and houses

    this.player = new Player(this.gameState);
    await this.player.init();

    this.flyingEnemy = new FlyingEnemy(this.gameState);
    await this.flyingEnemy.init();

    this.groundObstacle = new GroundObstacle(this.gameState);
  }

  public update(_delta: Ticker) {
    // console.log({ delta, state: this.gameState });
    this.gameBackgroundSky?.update();
    this.gameBackgroundGrass?.update();
    this.backgroundMountains?.update();

    this.ground?.update();
    this.groundNoise?.update();

    this.randomTrees?.update();
    this.randomElement1?.update();
    this.randomElement2?.update();

    this.player?.update();

    this.groundObstacle?.update();
    this.flyingEnemy?.update();
  }

  public cleanup() {
    // Clean up resources when scene is destroyed
    this.removeAllListeners();
    this.removeChildren();
  }
}
