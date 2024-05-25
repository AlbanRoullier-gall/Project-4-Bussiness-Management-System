import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setDiscountPercentage } from '../redux/discountPercentageSlice';
import FilterDiscount from './FilterDiscount';

const DiscountFilter = () => {
  const dispatch = useDispatch();
  const discountPercentage = useSelector(state => state.discountPercentage);

  const handleChangeFunction = (newValue) => {
    dispatch(setDiscountPercentage(newValue));
  };

  const options = [
    { id: 1, percentage: 0 },
    { id: 2, percentage: 10 },
    { id: 3, percentage: 20 },
    { id: 4, percentage: 30 },
    { id: 5, percentage: 40 },
    { id: 6, percentage: 50 },
    { id: 7, percentage: 60 },
    { id: 8, percentage: 70 },
    { id: 9, percentage: 80 },
  ];

  const selectedOption = options.find(option => option.percentage === (discountPercentage));

  return (
    <FilterDiscount
      handleChangeFunction={handleChangeFunction}
      label="Rabais"
      options={options}
      selectedOption={selectedOption ? selectedOption.id : null} 
    />
  );
};

export default DiscountFilter;
