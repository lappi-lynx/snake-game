import React from 'react';

function HighScore(props) {
  return (
    <div className='highscore-container'>
      { props.highScore }
      <button className='reset-button' onClick={ () => props.renderStartScreen() }>
        Back
      </button>
    </div>
  )
}

export default HighScore;
