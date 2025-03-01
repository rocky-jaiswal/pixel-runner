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

  public player: Player | null = null;
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
    this.randomElement1 = new RandomCloudElement(this.gameState); // cloud

    this.randomTrees = new RandomTrees(this.gameState);
    this.randomElement2 = new RandomGroundElement(this.gameState); // towers and houses

    this.ground = new Ground(this.gameState);
    this.groundNoise = new GroundNoise(this.gameState);

    this.flyingEnemy = new FlyingEnemy(this.gameState);
    this.groundObstacle = new GroundObstacle(this.gameState);

    this.player = new Player(this.gameState);
    this.player.init();
  }

  public update(_delta: Ticker) {
    if (!this.gameState.gameEnded) {
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

    if (this.gameState.isPlayerMoving && !this.gameState.gameEnded) {
      this.gameState.eventEmitter.emit('updateScore');
    }
  }

  public cleanup() {
    // Clean up resources when scene is destroyed
    this.removeAllListeners();
    this.removeChildren();
  }
}
