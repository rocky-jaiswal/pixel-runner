import { Ticker, Assets, Spritesheet, Texture } from 'pixi.js';

import cloud1PNG from './assets/images/cloud1.png';
import cloud2PNG from './assets/images/cloud2.png';
import cloud3PNG from './assets/images/cloud3.png';
import cloud4PNG from './assets/images/cloud4.png';
import house1PNG from './assets/images/house1.png';
import house2PNG from './assets/images/house2.png';
import tower1PNG from './assets/images/tower1.png';
import tower2PNG from './assets/images/tower2.png';

import tree1PNG from './assets/images/tree1.png';
import tree2PNG from './assets/images/tree2.png';
import tree3PNG from './assets/images/tree3.png';
import tree4PNG from './assets/images/tree4.png';

import bushPNG from './assets/images/bushO.png';
import mushroomPNG from './assets/images/mushroom.png';
import stonePNG from './assets/images/stone.png';

import player1PNG from './assets/images/female_sheet_2.png';
import flyEnemyPNG from './assets/images/fly_sheet_2.png';

import { MainGameScene } from './mainGameScene';
import { GameState } from './gameState';
import { SceneManager } from './sceneManager';
import { ResultScene } from './resultScene';
import { GameScene } from './types';

export class Game {
  public readonly gameState: GameState;
  public readonly sceneManager: SceneManager;

  private currentScene: GameScene | null = null;
  private mainScene: MainGameScene;

  constructor(gameState: GameState) {
    this.gameState = gameState;
    this.sceneManager = new SceneManager(gameState);

    this.mainScene = new MainGameScene(this.gameState);
  }

  public async init() {
    await Assets.load([
      {
        src: tree1PNG,
        alias: 'tree1',
      },
      {
        src: tree2PNG,
        alias: 'tree2',
      },
      {
        src: tree3PNG,
        alias: 'tree3',
      },
      {
        src: tree4PNG,
        alias: 'tree4',
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
        src: bushPNG,
        alias: 'bush',
      },
      {
        src: mushroomPNG,
        alias: 'mushroom',
      },
      {
        src: stonePNG,
        alias: 'stone',
      },
      {
        src: player1PNG,
        alias: 'player',
      },
      {
        src: flyEnemyPNG,
        alias: 'flyingEnemy',
      },
    ]);

    const playerFrames = Array(13)
      .fill(null)
      .map((_, i) => {
        return {
          [`f${i}`]: {
            frame: { x: i * 192, y: 5, w: 192, h: 224 },
            sourceSize: { w: 192, h: 223 },
          },
        };
      })
      .reduce((acc, obj) => {
        acc[Object.keys(obj)[0]] = Object.values(obj)[0];
        return acc;
      }, {});

    const flyingEnemyFrames = Array(5)
      .fill(null)
      .map((_, i) => {
        return {
          [`f${i}`]: {
            frame: { x: i * 108, y: 5, w: 108, h: 65 },
            sourceSize: { w: 108, h: 65 },
          },
        };
      })
      .reduce((acc, obj) => {
        acc[Object.keys(obj)[0]] = Object.values(obj)[0];
        return acc;
      }, {});

    const playerAtlasData = {
      frames: playerFrames,
      meta: {
        scale: 1,
      },
      animations: {
        running: ['f0', 'f1', 'f2', 'f3', 'f4', 'f5', 'f6', 'f7'],
        jumping: ['f9'],
        ducking: ['f10'],
        ending: ['f12'],
      },
    };

    const flyingEnemyAtlasData = {
      frames: flyingEnemyFrames,
      meta: {
        scale: 1,
      },
      animations: {
        flying: ['f0', 'f1', 'f2', 'f3', 'f4', 'f3', 'f2'],
      },
    };

    const playerSpriteSheet = new Spritesheet(Texture.from('player'), playerAtlasData);
    const flyingEnemySpriteSheet = new Spritesheet(Texture.from('flyingEnemy'), flyingEnemyAtlasData);

    await Promise.all([playerSpriteSheet.parse(), flyingEnemySpriteSheet.parse()]);

    this.gameState.playerSpriteSheet = playerSpriteSheet;
    this.gameState.flyingEnemySpriteSheet = flyingEnemySpriteSheet;

    this.startGame();

    // Set up game loop
    this.gameState.application.ticker.add(this.update.bind(this));
  }

  private startGame() {
    // Set up initial scenes
    this.sceneManager.addScene('game', this.mainScene);
    this.sceneManager.addScene('result', new ResultScene(this.gameState));

    this.currentScene = this.sceneManager.switchTo('game');
    this.currentScene.init();
  }

  update(delta: Ticker) {
    if (this.sceneManager.allScenes.size === 0) {
      return;
    }

    if (this.gameState.gameEnded && !this.gameState.worldStopped) {
      this.currentScene = this.sceneManager.switchTo('result');
      this.currentScene.init();
      this.gameState.worldStopped = true;

      this.mainScene.player?.update(); // one last update to player
    }

    if (this.currentScene) {
      this.currentScene.update(delta);
    }
  }
}
