import React from 'react';
import Communication from './Communication.jsx';
import './SignatureSection.css';

const SignatureSection = ({ totalTVA, totalDetailLine }) => {
  const totalTTC = (parseFloat(totalTVA) + parseFloat(totalDetailLine)).toFixed(2);

  return (
    <div className='container-signature'>
      <Communication />
      <div className='agencement-proposition'>
        <strong>TOTAL TTC</strong>
        <div className='important-information'>{`€ ${totalTTC}`}</div>
      </div>
    </div>
  );
};

export default SignatureSection;
