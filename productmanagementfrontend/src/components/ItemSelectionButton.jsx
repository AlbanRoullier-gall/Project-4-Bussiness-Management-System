import React from 'react';
import './ItemSelectionButton.css';

const ItemSelectionButton = ({ onClick, disabled }) => {
  return (
      <button className="button-item" onClick={onClick} disabled={disabled}>
        Choisissez un Produit
      </button>
  );
};

export default ItemSelectionButton;
