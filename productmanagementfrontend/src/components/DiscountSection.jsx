import React from 'react';
import DiscountFilter from './DiscountFilter';
import './DiscountSection.css';


const DiscountSection = ({ totalDetailLine, handleDiscountChange}) => {
  return (
    <div className='container-discount'>
      <div>TOTAL HTVA</div>
      <div className='filter-discount'>
      <DiscountFilter handleChangeFunction={handleDiscountChange} />
      </div>
      <div>{`€ ${totalDetailLine.toFixed(2)}`}</div>
    </div>
  );
};

export default DiscountSection;
