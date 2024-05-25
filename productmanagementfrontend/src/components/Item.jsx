// Item.jsx
import React from 'react';
import MultiFilterSelectItem from './MultiFilterSelectItem';

const Item = ({ onSelect, item_id }) => {
  const handleProductSelection = (selectedProductInfo) => {
    console.log('Produit sélectionné dans Item.jsx :', selectedProductInfo); 
    onSelect(selectedProductInfo);
  };

  return (
      <MultiFilterSelectItem onSelect={handleProductSelection} item_id={item_id} />
  );
};

export default Item;
