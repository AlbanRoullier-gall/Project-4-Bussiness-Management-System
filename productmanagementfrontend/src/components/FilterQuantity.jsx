import React from 'react';
import PropTypes from 'prop-types';
import './FilterQuantity.css';

const FilterQuantity = ({ value, onChange }) => {
  const handleInputChange = (e) => {
    const newValue = e.target.value;
    if (!isNaN(newValue)) { 
      onChange(Number(newValue)); 
    }
  };

  return (
    <input
      className='input-number'
      type="number"
      value={value}
      onChange={handleInputChange}
      placeholder="Unité"
    />
  );
};

FilterQuantity.propTypes = {
  value: PropTypes.number.isRequired, 
  onChange: PropTypes.func.isRequired, 
};

export default FilterQuantity;
