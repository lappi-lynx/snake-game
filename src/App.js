import React, { useEffect, useState } from 'react';
import Snake from './Snake';
import StartScreen from './StartScreen';
import HighScore from './HighScore';
import Target from './Target';
import useInterval from './useInterval';
import './App.css';
import skull from './skull.jpg';
import bender from './images/bender.png';

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
  const [snakePoints, setSnakePoints]   = useState(initialState.snakePoints);
  const [targets, generateTarget]       = useState([initialState.target(), initialState.target()]);
  const [direction, setDirection]       = useState(initialState.direction);
  const [speed, setSpeed]               = useState(initialState.speed);
  const [isGameOver, setIsGameOver]     = useState(false);
  const [gameOverText, setGameOverText] = useState('Game Over.');
  const [scoreText, setScoreText]       = useState('');
  const [showFunImage, setShowFunImage] = useState(false);
  const [gameStarted, setGameStarted]   = useState(false);
  const [showHighscores, highscoresVisible] = useState(false);
  const [startScreenVisible, setStartScreenVisible] = useState(true);

  useEffect(() => {
    window.addEventListener("keydown", onKeyDown)
    handleOutside();
    handleSelfEaten();
    handleIncrease();

    return () => {
      window.removeEventListener("keydown", onKeyDown)
    }
  })

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
    }
  }

  const moveSnake = () => {
    if (!gameStarted || isGameOver) return

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
    setIsGameOver(true);
    setGameStarted(false);
  }

  const highScore = parseInt(localStorage.getItem('highScore'));

  // current snake lenght - initial snake length
  const score = snakePoints.length - 2;

  const generateScoreText = () => {
    if (score < 1) {
      return `Please try again! Your snake died with ${score} points :(`;
    } else if (!highScore || (score > highScore)) {
      localStorage.setItem('highScore', score);
      return `You've beat a highscore! New result is ${score}`;
    } else {
      return `Your result is ${score}. Best result: ${highScore}`;
    }
  }

  const resetDashboard = () => {
    setSnakePoints(initialState.snakePoints);
    generateTarget([initialState.target(), initialState.target()]);
    setDirection(initialState.direction);
    setSpeed(initialState.speed);
    setIsGameOver(false);
    startGame();
  }

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

  const startGame = () => {
    setStartScreenVisible(false);
    setGameStarted(true);
  }

  const renderStartScreen = () => {
    setStartScreenVisible(true);
    highscoresVisible(false);
  }

  const renderHighscores = () => {
    setStartScreenVisible(false);
    setGameStarted(false);
    highscoresVisible(true)
  }

  useInterval(handleFunImage, Math.floor(Math.random() * Math.floor(10000)));
  useInterval(moveSnake, speed);

  return (
    <>
      <div className='scoreboard'>{ score }</div>
      <div className={ `game-container ${ isGameOver ? 'game-over-container' : '' }`}>
        { showHighscores &&
          <HighScore highScore={ highScore } renderStartScreen={ renderStartScreen }/>
        }

        { startScreenVisible &&
          <StartScreen startGame={ startGame } renderHighscores={ renderHighscores } />
        }

        { showFunImage && gameStarted &&
          <div className='fun-image'><img src={ bender } alt="bender" /></div>
        }

        { gameStarted &&
          <>
            <Snake snakePoints={ snakePoints } />
            { targets.map(target => {
              return <Target targetPoint={ target } />
            }) }
          </>
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
      </div>
    </>
  );
}

export default App;
