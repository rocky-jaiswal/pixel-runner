import { useEffect, useRef, useState } from 'react';
import { Tooltip } from 'react-tooltip';
import { EventEmitter } from 'pixi.js';

import { main } from './main';
import './css/style.css';

const eventEmitter = new EventEmitter();
const highScore = localStorage.getItem('_pixel_runner_high_score') ?? '0'

function App() {
  const eventEmitterRef = useRef(eventEmitter);
  const calledOnce = useRef(false);

  eventEmitterRef.current.on('changeScore', (newScore: number) => {
    setScore(newScore)
  })
  const [score, setScore ] = useState<number>(0);
  const [semaphore, setSemaphore] = useState<boolean>(false)

  useEffect(() => {
    if (!semaphore && !calledOnce.current) {
      main(eventEmitter)
        .then(() => console.log('started game ...'))
        .catch((err) => console.error(err));

      calledOnce.current = true;
      setSemaphore(true);
    }
  }, [semaphore]);

  return (
    <main>
      <div id="header">
        <h1>Pixel Runner</h1>
      </div>
      <div id="app"></div>
      <div id="scorecard">
        <div className="scores">
          <p className="score score-head-1">Score: {score}</p>
        </div>
        <div className="scores">
          <p className="score score-head-2">High Score: {highScore}</p>
        </div>
        <div className="actions-game">
          <button className="help-button" id="help-button">
            <span>Help 🤔</span>
          </button>
          <Tooltip anchorSelect="#help-button" place="top">
            Use up / down arrow keys to jump / duck
          </Tooltip>
          <button id="reset-game-btn" onClick={() => document.location.reload()}>
            <span>Restart 🔁</span>
          </button>
        </div>
      </div>
    </main>
  );
}

export default App;
