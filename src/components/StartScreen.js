import React from 'react';

function StartScreen(props) {
  return (
    <div style={styles}>
      <button className='reset-button' onClick={ () => props.startGame() }>
        Start
      </button>
      <button className='reset-button' onClick={ () => props.renderHighscores() }>
        Highscores
      </button>
    </div>
  );
}

const styles = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexDirection: 'column'
}

export default StartScreen;
