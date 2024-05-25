import React, { useState, useEffect } from 'react';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import './FilterDiscount.css';

const FilterDiscount = ({ handleChangeFunction, label, options, selectedOption }) => {
  const [selectedId, setSelectedId] = useState('');

  useEffect(() => {
    if (selectedOption !== null && selectedOption !== undefined) {
      setSelectedId(selectedOption.toString());
    }
  }, [selectedOption]);

  const handleChange = (event) => {
    const selectedId = event.target.value;
    const selectedItem = options.find((item) => item.id.toString() === selectedId);
    if (selectedItem) {
      const selectedPercentage = selectedItem.percentage;
      handleChangeFunction(selectedPercentage);
      setSelectedId(selectedId);
    }
  };

  return (
    <div className="filter-container">
      <FormControl sx={{ m: 1, minWidth: 110 }}>
        <InputLabel id="demo-simple-select-autowidth-label">
          {label} %
        </InputLabel>
        <Select
          className='selector'
          labelId="demo-simple-select-autowidth-label"
          id="demo-simple-select-autowidth"
          value={selectedId}
          onChange={handleChange}
          autoWidth
          label={label}
          MenuProps={{ PaperProps: { style: { maxHeight: 200 } } }}
        >
          {options.map((item) => (
            <MenuItem key={item.id} value={item.id.toString()}>
              {item.percentage}%
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
};

export default FilterDiscount;
