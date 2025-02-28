import { EventEmitter } from 'pixi.js';

import { createApp } from './app';

export const main = async () => {
  const elem = document.querySelector<HTMLDivElement>('#app');

  if (!elem) {
    throw new Error('#app must be provided!');
  }

  const eventEmitter = new EventEmitter();

  // add keyboard handling logic
  document.addEventListener('keydown', (ev: unknown) => {
    eventEmitter.emit('keydown', ev);
  });

  const app = await createApp(elem, eventEmitter);

  elem.appendChild(app.canvas);
};
