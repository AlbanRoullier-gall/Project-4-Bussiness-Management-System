import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setDuration,setEndDate } from '../redux/durationSelectorSlice';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import useFetchPaymentTerms from '../hooks/useFetchPaymentTerms';
import { calculateEndDate } from '../containers/DueDateUtils'; 

import './DurationSelector.css';

const DurationSelector = () => {
  const dispatch = useDispatch();
  const { calculatedduration, duration: storedDuration, invoiceDate } = useSelector((state) => state.durationSelector); 
  const paymentTerms = useFetchPaymentTerms();
  const [defaultDuration, setDefaultDuration] = useState('');

  useEffect(() => {
    let newDefaultDuration = '';

    if (storedDuration && paymentTerms.some(term => term.payment_term === storedDuration)) {
      newDefaultDuration = storedDuration;
    } else if (calculatedduration && paymentTerms.some(term => term.payment_term === calculatedduration)) {
      newDefaultDuration = calculatedduration;
    } else if (paymentTerms.length > 0) {
      newDefaultDuration = paymentTerms[0].payment_term; 
    }

    setDefaultDuration(newDefaultDuration);
  }, [calculatedduration, storedDuration, paymentTerms]);

  const handleChange = (event) => {
    const selectedValue = event.target.value;
    dispatch(setDuration(selectedValue));
    // Calculer la date de fin en fonction de la durée sélectionnée et définir la date de fin
    const endDate = calculateEndDate(invoiceDate, selectedValue);
    dispatch(setEndDate(endDate.toISOString())); // Convertir la date en une chaîne ISO
  };


  return (
    <div className="filter-container">
      <FormControl sx={{ m: 1, minWidth: 200 }}>
        <InputLabel id="demo-simple-select-autowidth-label">Echeance</InputLabel>
        <Select
          className='selector'
          labelId="demo-simple-select-autowidth-label"
          id="demo-simple-select-autowidth"
          value={defaultDuration}
          onChange={handleChange}
          autoWidth
          label="Echeance"
          MenuProps={{ PaperProps: { style: { maxHeight: 200 } } }}
        >
          {paymentTerms.map((item, index) => (
            <MenuItem key={index} value={item.payment_term}>
              {item.payment_term}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
};

export default DurationSelector;