import React from 'react';
import FilterDiscount from './FilterDiscount';

const RemiseFilter = ({ handleChangeFunction, remiseValue }) => {
  const options = [
    { id: 0, percentage: 0 },
    { id: 5, percentage: 5 },
    { id: 10, percentage: 10 },
    { id: 20, percentage: 20 },
    { id: 30, percentage: 30 },
    { id: 40, percentage: 40 },
    { id: 50, percentage: 50 },
    { id: 60, percentage: 60 },
    { id: 70, percentage: 70 },
    { id: 80, percentage: 80 },
  ];

  let selectedPercentage = 0;
  if (remiseValue !== undefined) {
    console.log('remisevalue dans RemiseFilter: '+remiseValue)
    selectedPercentage = Math.round(remiseValue); 
  }

  return (
    <FilterDiscount
      handleChangeFunction={handleChangeFunction}
      label="Remise"
      options={options}
      selectedOption={selectedPercentage}
    />
  );
};

export default RemiseFilter;
