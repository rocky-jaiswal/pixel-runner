import { ColorMatrixFilter, Container, Graphics } from 'pixi.js';
import { GameState } from './gameState';
import { getRandomInt, getRandomIntBetween } from './util';

export class GameBackgroundGrass {
  private readonly gameState: GameState;

  private readonly container: Container;
  private readonly colorMatrix;
  private readonly pos: Record<number, any>;
  private readonly numberOfHills: number;
  private readonly grassColor = '#00bd65';

  private brightness: number | null = null;

  private grassStartHeight = 0;
  private hills: Graphics[] = [];
  private paths = [
    'm 1.2814396,229.3204 c 0,0 188.2610804,-42.35797 322.5641304,-60.72524 134.30305,-18.36717 183.4482,56.94901 183.4482,56.94901 l 10.40794,3.46915',
    'm -6.2551724e-7,162.06982 c 0,0 84.71238162551723,-88.154521 221.14383062551723,-71.370952 176.57218,21.721622 296.04581,71.298802 296.04581,71.298802',
    'm 3.7398408,348.50314 c 0,0 292.7769992,-163.98501 523.6321692,-65.28311 230.85511,98.70189 -26.78256,64.37036 -26.78256,64.37036 l -249.30531,-1.63294',
    'm 0.25603452,75.664299 c 0,0 215.07117548,-152.070538 352.08408548,-79.589353 l 153.58402,81.247467',
    'm 5.7959703,442.58835 c 0,0 149.8092897,-86.65685 295.3691497,-52.80158 l 231.80586,53.91493',
  ];

  constructor(gameState: GameState) {
    this.gameState = gameState;
    this.container = new Container();
    this.colorMatrix = new ColorMatrixFilter();
    this.container.filters = [this.colorMatrix];
    this.numberOfHills = this.gameState.numberOfHills;

    this.grassStartHeight = gameState.height * this.gameState.grassStartHeight;
    this.pos = {
      0: [this.grassStartHeight - 220, this.grassColor],
      1: [this.grassStartHeight - 150, this.grassColor],
      2: [this.grassStartHeight - 330, this.grassColor],
      3: [this.grassStartHeight - 70, this.grassColor],
      4: [this.grassStartHeight - 435, this.grassColor],
    };

    this.init();

    this.gameState.application.stage.addChild(this.container);
  }

  private addHill(atEnd = false) {
    const idx = getRandomInt(this.paths.length);
    const graphics = new Graphics();
    graphics.svg(`
          <svg>
            <path
            fill="${this.pos![idx][1]}"
            d="${this.paths[idx]}"
          </svg>
        `);
    graphics.position.x = atEnd ? this.gameState.width + 10 : getRandomIntBetween(0, this.gameState.width);
    graphics.position.y = this.pos![idx][0];

    this.hills.push(graphics);
    this.container.addChild(graphics);
  }

  public init() {
    const grassBackground = new Graphics();
    grassBackground.rect(0, this.grassStartHeight, this.gameState.width, this.gameState.height);
    grassBackground.fill(this.grassColor);
    this.container.addChild(grassBackground);

    while (this.hills.length < this.numberOfHills) {
      this.addHill();
    }
  }

  public update() {
    if (this.brightness !== this.gameState.brightness) {
      this.brightness = this.gameState.brightness;
      this.colorMatrix.contrast(this.brightness, false);
    }

    if (this.gameState.isPlayerMoving) {
      if (this.hills.length < this.numberOfHills) {
        this.addHill(true);
        return;
      }

      this.hills.forEach((elem, idx) => {
        if (elem.position.x < elem.width * -1) {
          elem.renderable = false;
          this.hills.splice(idx, 1);
        }

        if (elem.renderable) {
          elem.position.x -= this.gameState.gameSpeed;
        }
      });
    }
  }
}
