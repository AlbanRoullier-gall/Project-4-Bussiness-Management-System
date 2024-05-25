import React from 'react';
import './DividerVertical.css';

const DividerVertical = ({ length, color }) => {
  const DividerVerticalStyle = {
    height: length,
    backgroundColor: color,
  };

  return <div className="DividerVertical" style={DividerVerticalStyle}></div>;
};

export default DividerVertical;




