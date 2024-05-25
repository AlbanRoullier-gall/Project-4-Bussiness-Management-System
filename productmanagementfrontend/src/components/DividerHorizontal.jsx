import React from 'react';
import './DividerHorizontal.css';

const DividerHorizontal = ({ length, color }) => {
  const dividerHorizontalStyle = {
    width: `${length}px`,
    backgroundColor: color,
    height: '1px', 
    margin: '10px 0', 
  };

  return <div style={dividerHorizontalStyle}></div>;
};

export default DividerHorizontal;
