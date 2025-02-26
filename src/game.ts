import { Ticker, Assets } from 'pixi.js';

import backgroundGrassPNG from './assets/images/backgroundGrass.png';
import cloud1PNG from './assets/images/cloud1.png';
import cloud2PNG from './assets/images/cloud2.png';
import cloud3PNG from './assets/images/cloud3.png';
import cloud4PNG from './assets/images/cloud4.png';
import house1PNG from './assets/images/house1.png';
import house2PNG from './assets/images/house2.png';
import tower1PNG from './assets/images/tower1.png';
import tower2PNG from './assets/images/tower2.png';
import player1PNG from './assets/images/female_sheet_2.png';

import { MainGameScene } from './mainGameScene';
import { GameState } from './gameState';
import { SceneManager } from './sceneManager';
import { ResultScene } from './resultScene';
import { GameScene } from './types';

export class Game {
  public readonly gameState: GameState;
  public readonly sceneManager: SceneManager;
  private currentScene: GameScene | null = null;

  constructor(gameState: GameState) {
    this.gameState = gameState;
    this.sceneManager = new SceneManager(gameState);
  }

  public async init() {
    await Assets.load([
      {
        src: backgroundGrassPNG,
        alias: 'backgroundGrass',
      },
      {
        src: cloud1PNG,
        alias: 'cloud1',
      },
      {
        src: cloud2PNG,
        alias: 'cloud2',
      },
      {
        src: cloud3PNG,
        alias: 'cloud3',
      },
      {
        src: cloud4PNG,
        alias: 'cloud4',
      },
      {
        src: house1PNG,
        alias: 'house1',
      },
      {
        src: house2PNG,
        alias: 'house2',
      },
      {
        src: tower1PNG,
        alias: 'tower1',
      },
      {
        src: tower2PNG,
        alias: 'tower2',
      },
      {
        src: player1PNG,
        alias: 'player',
      },
    ]);

    await this.startGame();

    // Set up game loop
    this.gameState.application.ticker.add(this.update.bind(this));
  }

  private async startGame() {
    // Set up initial scenes
    this.sceneManager.addScene('game', new MainGameScene(this.gameState));
    this.sceneManager.addScene('result', new ResultScene(this.gameState));

    this.currentScene = this.sceneManager.switchTo('game');
    await this.currentScene.init();
  }

  update(delta: Ticker) {
    if (this.sceneManager.allScenes.size === 0) {
      return;
    }

    if (this.currentScene) {
      this.currentScene.update(delta);
    }
  }
}
