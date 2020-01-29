import React, { useEffect, useState } from 'react';
import Snake from './Snake';
import Target from './Target';
import useInterval from './useInterval';
import './App.css';
import skull from './skull.jpg';

const getRandomTarget = () => {
  let min = 1;
  let max = 98;
  let x = Math.floor((Math.random() * (max - min + 1) + min) / 2) * 2;
  let y = Math.floor((Math.random() * (max - min + 1) + min) / 2) * 2;

  return [x, y]
}

const initialState = {
  snakePoints: [[0, 0], [2, 0]],
  target: getRandomTarget,
  direction: 'RIGHT',
  speed: 200
};

function App() {
  const [snakePoints, setSnakePoints] = useState(initialState.snakePoints);
  const [target, generateTarget] = useState(initialState.target());
  const [direction, setDirection] = useState(initialState.direction);
  const [speed, setSpeed] = useState(initialState.speed);
  const [isGameOver, updateIsGameOver] = useState(false);
  const [gameOverText, setGameOverText] = useState('Game Over.');

  const onKeyDown = (e) => {
    e = e || window.event;

    switch (e.keyCode) {
      case 38:
        setDirection('UP');
        break;
      case 40:
        setDirection('DOWN');
        break;
      case 37:
        setDirection('LEFT');
        break;
      case 39:
        setDirection('RIGHT');
        break;
      default:
        setDirection('RIGHT');
        break;
    }
  }

  const moveSnake = () => {
    if (isGameOver) return

    let dots = [...snakePoints];
    let head = dots[dots.length - 1];

    switch (direction) {
      case 'RIGHT':
        head = [head[0] + 2, head[1]];
        break;
      case 'LEFT':
        head = [head[0] - 2, head[1]];
        break;
      case 'DOWN':
        head = [head[0], head[1] + 2];
        break;
      case 'UP':
        head = [head[0], head[1] - 2];
        break;
      default:
        head = [head[0] + 2, head[1]];
        break;
    }

    dots.push(head);
    dots.shift();
    setSnakePoints(dots);
  }

  const handleOutside = () => {
    let dots = [...snakePoints];
    let head = dots[dots.length - 1];

    if (head[0] >= 100 || head[1] >= 100 || head[0] < 0 || head[1] < 0) {
      onGameOver('outside');
    }
  }

  const handleSelfEaten = () => {
    let dots = [...snakePoints];
    let head = dots[dots.length - 1];

    dots.pop();
    dots.forEach(dot => {
      if (head[0] === dot[0] && head[1] === dot[1]) {
        onGameOver('suicide');
      }
    })
  }

  const handleIncrease = () => {
    let dots = [...snakePoints];
    let head = dots[dots.length - 1];

    if (head[0] === target[0] && head[1] === target[1]) {
      generateTarget(getRandomTarget());
      lvlUpSnake();
      if (speed > 10) setSpeed(speed - 10);
    }
  }

  const lvlUpSnake = () => {
    let newSnake = [...snakePoints];

    newSnake.unshift([]);
    setSnakePoints(newSnake);
  }

  const onGameOver = (action) => {
    let msg;

    if (action === 'suicide') {
      msg = "You ate yourself and committed suicide."
    } else if(action === 'outside') {
      msg = "You're squashed."
    }

    setGameOverText(`${msg} Snake length is ${snakePoints.length}.`);
    updateIsGameOver(true)
  }

  const resetDashboard = () => {
    setSnakePoints(initialState.snakePoints);
    generateTarget(initialState.target());
    setDirection(initialState.direction);
    setSpeed(initialState.speed);
    updateIsGameOver(false);
  }

  useEffect(() => {
    window.addEventListener("keydown", onKeyDown)
    handleOutside();
    handleSelfEaten();
    handleIncrease();

    return () => {
      window.removeEventListener("keydown", onKeyDown)
    }
  })

  useInterval(moveSnake, speed);

  return (
    <>
      <div className='scoreboard'>{ snakePoints.length }</div>
      <div className={ `game-container ${ isGameOver ? 'game-over-container' : '' }`}>
      { isGameOver &&
        <>
          <div className='skull-image'><img src={ skull } alt="Deadman" /></div>
          <div className='game-over-text'>{ gameOverText }</div>
          <button className='reset-button' onClick={ () => resetDashboard() }>
            Start Over!
          </button>
        </>
      }
        <Snake snakePoints={ snakePoints } />
        <Target targetPoint={ target } />
      </div>
    </>
  );
}

export default App;
