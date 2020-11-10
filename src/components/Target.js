import React from 'react';

export default (props) => {
  const style = {
    left: `${props.targetPoint[0]}%`,
    top: `${props.targetPoint[1]}%`
  }

  return (
    <div className='snake-target' style={ style }></div>
  );
}
