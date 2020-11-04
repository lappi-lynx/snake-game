import React from 'react';

function StartScreen(props) {
  return (
    <>
      <button className='reset-button' onClick={ () => props.startGame() }>
        Start
      </button>
      <button className='reset-button' onClick={ () => props.renderHighscores() }>
        Highscores
      </button>
    </>
  );
}

export default StartScreen;
