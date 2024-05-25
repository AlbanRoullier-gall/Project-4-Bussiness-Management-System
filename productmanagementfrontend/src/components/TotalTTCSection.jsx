import React from 'react';
import './TotalTTCSection.css';

const TotalTTCSection = ({ totalTVA, totalDetailLine }) => {
  const totalTTC = (parseFloat(totalTVA) + parseFloat(totalDetailLine)).toFixed(2);

  return (
    <div className='container-ttc'>
      <div>TOTAL TTC</div>
      <div>{`€ ${totalTTC}`}</div>
    </div>
  );
};

export default TotalTTCSection;
