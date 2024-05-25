import React from 'react';
import './HeaderDetails.css';

const HeaderDetails = () => {
  return (
    <div className='title-details'>
      <div className='line-detail-number'>LIGNE</div>
      <div className='title-product'>PRODUIT</div>
      <div className='title-taxe'>TAXE</div>
      <div className='title-quantity'>QUANTITE</div>
      <div className='title-unitPrice'>UNITE</div>
      <div className='title-totalPrice'>TOTAL</div>
      <div className='title-remise'>REMISE</div>
    </div>
  );
};

export default HeaderDetails;
