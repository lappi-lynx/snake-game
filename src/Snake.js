import React from 'react';

export default (props) => {
  console.log(props);

  return (
    <div>
      {props.snakePoints.map((point, i) => {
        const style = {
          left: `${point[0]}%`,
          top: `${point[1]}%`
        };

        return (
          <div className="snake-point" key={i} style={ style }></div>
        )
      })}
    </div>
  );
}
