import React, { useEffect, useState } from 'react';
import Snake from './Snake';
import Target from './Target';
import useInterval from './useInterval';
import './App.css';
import skull from './skull.jpg';
import bender from './bender.png';

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

const App = () => {
  const [snakePoints, setSnakePoints] = useState(initialState.snakePoints);
  const [targets, generateTarget] = useState([initialState.target(), initialState.target()]);
  const [direction, setDirection] = useState(initialState.direction);
  const [speed, setSpeed] = useState(initialState.speed);
  const [isGameOver, setIsGameOver] = useState(false);
  const [gameOverText, setGameOverText] = useState('Game Over.');
  const [scoreText, setScoreText] = useState('');
  const [showFunImage, setShowFunImage] = useState(false);
  // localStorage.setItem('highScore', 0);

  const onKeyDown = (e) => {
    e = e || window.event;

    switch (e.keyCode) {
      case 38:
      case 87:
        setDirection('UP');
        break;
      case 40:
      case 83:
        setDirection('DOWN');
        break;
      case 37:
      case 65:
        setDirection('LEFT');
        break;
      case 39:
      case 68:
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
      if (!isGameOver) onGameOver('outside');
    }
  }

  const handleSelfEaten = () => {
    let dots = [...snakePoints];
    let head = dots[dots.length - 1];

    dots.pop();
    dots.forEach(dot => {
      if (head[0] === dot[0] && head[1] === dot[1]) {
        if (!isGameOver) onGameOver('suicide');
      }
    })
  }

  const handleIncrease = () => {
    let dots = [...snakePoints];
    let head = dots[dots.length - 1];

    targets.forEach(target => {
      if (head[0] === target[0] && head[1] === target[1]) {
        let index     = targets.indexOf(target)
        let newTarget = [...targets]

        newTarget.splice(index, 1, getRandomTarget());
        generateTarget(newTarget);
        lvlUpSnake();
        if (speed > 10) setSpeed(speed - Math.floor(Math.random() * Math.floor(30)));
      }
    })
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

    setShowFunImage(false);
    setGameOverText(msg);
    setScoreText(generateScoreText());
    setIsGameOver(true)
  }

  const generateScoreText = () => {
    const highScore = parseInt(localStorage.getItem('highScore'));

    if (!highScore || (snakePoints.length > highScore)) {
      localStorage.setItem('highScore', snakePoints.length);
      return `You've beat a highscore! New result is ${snakePoints.length}`;
    } else {
      return `Your result is ${snakePoints.length}. Best result: ${highScore}`;
    }
  }

  const resetDashboard = () => {
    setSnakePoints(initialState.snakePoints);
    generateTarget([initialState.target(), initialState.target()]);
    setDirection(initialState.direction);
    setSpeed(initialState.speed);
    setIsGameOver(false);
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

  const handleFunImage = () => {
    if (isGameOver) return
    setShowFunImage(true);

    const timer = setTimeout(() => {
      setShowFunImage(false);
    }, Math.floor(Math.random() * Math.floor(300)));

    return () => {
      clearTimeout(timer);
    }
  }

  useInterval(handleFunImage, Math.floor(Math.random() * Math.floor(10000)));
  useInterval(moveSnake, speed);

  return (
    <>
      <div className='scoreboard'>{ snakePoints.length }</div>
      <div className={ `game-container ${ isGameOver ? 'game-over-container' : '' }`}>
      { showFunImage &&
        <div className='fun-image'><img src={ bender } alt="bender" /></div>
      }
      { isGameOver &&
        <>
          <div className='skull-image'><img src={ skull } alt="Deadman" /></div>
          <div className='game-over-text'>{ gameOverText }</div>
          <div className='game-over-text new_high_score'>{ scoreText }</div>
          <button className='reset-button' onClick={ () => resetDashboard() }>
            Start Over!
          </button>
        </>
      }
        <Snake snakePoints={ snakePoints } />
        { targets.map(target => {
          return <Target targetPoint={ target } />
        }) }
      </div>
    </>
  );
}

export default App;
