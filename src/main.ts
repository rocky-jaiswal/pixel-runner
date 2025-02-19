import { EventEmitter } from 'pixi.js';

import { createApp } from './app';

export const startApp = async () => {
  const elem = document.querySelector<HTMLDivElement>('#app');

  if (!elem) {
    throw new Error('#app must be provided!');
  }

  const eventEmitter = new EventEmitter();

  const app = await createApp(elem, eventEmitter);

  elem.appendChild(app.canvas);
};
