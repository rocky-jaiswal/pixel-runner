import { Ticker, Assets } from 'pixi.js';

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

    // Set up game loop
    this.gameState.application.ticker.add(this.update.bind(this));
  }

  public async init() {
    await Assets.load([]);

    this.startGame();
  }

  private startGame() {
    // Set up initial scenes
    this.sceneManager.addScene('game', new MainGameScene(this.gameState));
    this.sceneManager.addScene('result', new ResultScene(this.gameState));

    this.currentScene = this.sceneManager.switchTo('game');
    this.currentScene.init();
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
