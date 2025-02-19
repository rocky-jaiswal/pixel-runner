import { useEffect } from 'react';

import { startApp } from './main';
import './css/style.css';

let started = false;

function App() {
  useEffect(() => {
    if (!started) {
      console.log('starting pixi...');
      startApp();
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
        <div className="scores"></div>
        <div className="actions-game">
          <button id="reset-game-btn">
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
