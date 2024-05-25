import React from 'react';
import './AddButton.css';

const AddButton = ({ onClick }) => {
  return (
    <div className='container-add-line'>
      <button className='button-add' onClick={onClick}>+</button>
    </div>
  );
};

export default AddButton;
