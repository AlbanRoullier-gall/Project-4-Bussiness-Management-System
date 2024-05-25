import React from 'react';
import './VatTotal.css';

const TotalTVASection = ({ totalTVA }) => {
  return (
    <div className='container-vattotal'>
      <div>TOTAL TVA</div>
      <div>{`€ ${totalTVA}`}</div>
    </div>
  );
};

export default TotalTVASection;
