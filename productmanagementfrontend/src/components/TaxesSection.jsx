import React from 'react';
import './VatTotal.css';


const TaxesSection = ({ totals }) => {
  const renderTotauxTVA = () => {
    return Object.keys(totals).map((vatPercentage) => {
      const match = vatPercentage.match(/\d+/);
      const percentageDecimal = match ? parseFloat(match[0]) / 100 : 0;
      const subtotal = percentageDecimal * totals[vatPercentage];
      return (
        <div className='container-vattotal' key={vatPercentage}>
          <div>{`${vatPercentage}%`}</div>
          <div>{`€ ${totals[vatPercentage]}`}</div>
          <div>{`€ ${subtotal.toFixed(2)}`}</div>
        </div>
      );
    });
  };

  return (
    <div>
      {renderTotauxTVA()}
    </div>
  );
};

export default TaxesSection;
