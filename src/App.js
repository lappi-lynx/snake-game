import React, { useEffect, useState } from 'react';
import Snake from './Snake';
import Target from './Target';
import './App.css';

const getRandomTarget = () => {
  let min = 1;
  let max = 98;
  let x = Math.floor((Math.random() * (max - min + 1) + min) / 2) * 2;
  let y = Math.floor((Math.random() * (max - min + 1) + min) / 2) * 2;

  return [x, y]
}

function App() {
  const [snakePoints, setSnakePoints] = useState([[0,0], [2,0]]);
  const [target, generateTarget] = useState(getRandomTarget());
  const [direction, setDirection] = useState('RIGHT');
  const [speed, setSpeed] = useState(200);

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

  useEffect(() => {
    window.addEventListener("keydown", onKeyDown)
    // setInterval(moveSnake, 1000);
    return () => {
      window.removeEventListener("keydown", onKeyDown)
    }
  })

  return (
    <div className='game-container'>
      <Snake snakePoints={ snakePoints } />
      <Target targetPoint={ target } />
    </div>
  );
}

export default App;
