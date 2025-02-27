import { Container, Graphics } from 'pixi.js';

import { GameState } from './gameState';
import { getRandomInt } from './util';

export class BackgroundMountains {
  private readonly gameState: GameState;

  private readonly container: Container;
  private group1: Graphics | null = null;
  private group2: Graphics | null = null;

  constructor(gameState: GameState) {
    this.gameState = gameState;
    this.container = new Container();

    this.init();

    this.gameState.application.stage.addChild(this.container);
  }

  public init() {
    this.group1 = this.createMountainGroup();
    this.group2 = this.createMountainGroup();

    this.group2.x = this.gameState.width;

    this.gameState.application.stage.addChild(this.group1, this.group2);
  }

  private createMountainGroup() {
    // Create a graphics object to hold all the mountains in a group.
    const graphics = new Graphics();

    // Width of all the mountains.
    const width = (this.gameState.width / 2) * [1.1, 1.2, 1.3, 1.4, 1.5][getRandomInt(5)];

    // Starting point on the y-axis of all the mountains.
    const startY = this.gameState.height * 0.65;

    // Start point on the x-axis of the individual mountain.
    const startXLeft = 0;
    const startXMiddle = Number(this.gameState.width) / 4;
    const startXRight = this.gameState.width / 2;

    // Height of the individual mountain.
    const heightLeft = this.gameState.height / 2;
    const heightMiddle = (this.gameState.height * 4) / 6;
    const heightRight = (this.gameState.height * 2) / 3;

    // Color of the individual mountain.
    const colorLeft = '#54826d';
    const colorMiddle = '#607269';
    const colorRight = '#456355';

    graphics
      // Draw the middle mountain
      .moveTo(startXMiddle, startY)
      .bezierCurveTo(
        startXMiddle + width / 2,
        startY - heightMiddle,
        startXMiddle + width / 2,
        startY - heightMiddle,
        startXMiddle + width,
        startY,
      )
      .fill({ color: colorMiddle })

      // Draw the left mountain
      .moveTo(startXLeft, startY)
      .bezierCurveTo(
        startXLeft + width / 2,
        startY - heightLeft,
        startXLeft + width / 2,
        startY - heightLeft,
        startXLeft + width,
        startY,
      )
      .fill({ color: colorLeft })

      // Draw the right mountain
      .moveTo(startXRight, startY)
      .bezierCurveTo(
        startXRight + width / 2,
        startY - heightRight,
        startXRight + width / 2,
        startY - heightRight,
        startXRight + width,
        startY,
      )
      .fill({ color: colorRight });

    this.container.addChild(graphics);
    return graphics;
  }

  public update() {
    if (this.gameState.isPlayerMoving) {
      if (this.group1!.x <= -this.gameState.width) {
        this.group1!.x += this.gameState.width * 2;
      }

      if (this.group2!.x <= -this.gameState.width) {
        this.group2!.x += this.gameState.width * 2;
      }

      this.group1!.x -= 0.25;
      this.group2!.x -= 0.25;
    }
  }
}
