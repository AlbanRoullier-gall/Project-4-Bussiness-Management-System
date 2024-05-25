import React from 'react';
import './SelectedProductDisplay.css';

const SelectedProductDisplay = ({ selectedProductInfo, setIsButtonClicked }) => {
  console.log("selectedProductInfo dans SelectedProductDisplay :", selectedProductInfo);

  return (
    <div className='item-selectionned'>
      <button className="button-item" onClick={() => setIsButtonClicked(true)}>
        Modifier le Produit
      </button>
      <div className='text-disposition2'>
        <span>Référence produit: {selectedProductInfo.item_number}</span>
        <span>Nom produit:  {selectedProductInfo.product_description}</span>
        <span>N° fournisseur: {selectedProductInfo.supplier_number}</span>
      </div>
    </div>
  );
};

export default SelectedProductDisplay;
