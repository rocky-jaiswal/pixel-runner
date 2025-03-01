import { useEffect, useRef, useState } from 'react';
import { EventEmitter } from 'pixi.js';

import { main } from './main';
import './css/style.css';

let started = false;
const eventEmitter = new EventEmitter();
const highScore = localStorage.getItem('_pixel_runner_high_score') ?? '0'

function App() {
  const eventEmitterRef = useRef(eventEmitter);
  const [score, setScore ] = useState<number>(0);

  eventEmitterRef.current.on('changeScore', (newScore: number) => {
    setScore(newScore)
  })

  useEffect(() => {
    if (!started) {
      main(eventEmitter)
        .then(() => console.log('started game ...'))
        .catch((err) => console.error(err));
      
      started = true;
    }
  }, [started]);

  return (
    <main>
      <div id="header">
        <h1>Pixel Runner</h1>
      </div>
      <div id="app"></div>
      <div id="scorecard">
        <div className="scores">
          <p className="score score-head-2">High Score: {highScore}</p>
        </div>
        <div className="scores">
          <p className="score score-head-1">Score: {score}</p>
        </div>
        <div className="actions-game">
          <button id="reset-game-btn" onClick={() => document.location.reload()}>
            <span>Restart 🔁</span>
          </button>
          <button className="help-button">
            <span>Help 🤔</span>
          </button>
        </div>
      </div>
    </main>
  );
}

export default App;
