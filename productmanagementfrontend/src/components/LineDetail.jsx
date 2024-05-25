import React, { useState, useEffect, useCallback } from 'react';
import Item from './Item';
import FilterQuantity from './FilterQuantity';
import RemiseFilter from './RemiseFilter';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { useDispatch } from 'react-redux';
import { updateLineDetail } from '../redux/lineDetailsSlice';

import './LineDetail.css';

const LineDetail = ({ detail, onDelete, item_id, remise, vat, unitPrice, quantity, totalPrice, purchasePrice, lineNumber }) => {
  const { id, remisePercentage, selectedProduct } = detail;
  const [quantityValue, setQuantityValue] = useState(parseInt(quantity, 10) || 1);
  const [remiseValue, setRemiseValue] = useState(() => {
    return remise !== undefined ? parseFloat(remise) : parseFloat(remisePercentage) || 0;
  });

  const [selectedProductState, setSelectedProduct] = useState(selectedProduct || null);
  const dispatch = useDispatch();

  useEffect(() => {
    const quantityValueParsed = isNaN(quantityValue) ? 1 : parseInt(quantityValue, 10);
    setQuantityValue(quantityValueParsed);
  }, [quantityValue]);

  const handleQuantityChange = (value) => {
    const parsedValue = parseInt(value, 10) || 1;
    setQuantityValue(parsedValue);
  };

  const handleRemiseChange = (value) => {
    setRemiseValue(parseFloat(value));
  };

  const handleProductSelect = (product) => {
    setSelectedProduct(product);
    setRemiseValue(0);
    setQuantityValue(1);
  };

  const updateLine = useCallback(() => {
    const remiseValuePercentage = remise !== undefined ? remise : remiseValue; // Use remise directly if provided, else use remiseValue
  
    const vatType = selectedProductState ? 
                     (selectedProductState.vat_type ? 
                       selectedProductState.vat_type.vat_type : 
                       selectedProductState.vat_type_id) : 
                     vat;
  
    const priceDecimal = selectedProductState ? parseFloat(selectedProductState.price) : parseFloat(unitPrice);
    const purchasePriceDecimal = selectedProductState ? parseFloat(selectedProductState.purchase_price) : parseFloat(purchasePrice);
    const quantityDecimal = parseFloat(quantityValue);
  
    const totalPrice = selectedProductState ?
    (priceDecimal * quantityDecimal * (1 - remiseValuePercentage / 100)).toFixed(2) : // Convert remisePercentage to decimal for calculation
    (unitPrice * quantityDecimal * (1 - remiseValuePercentage / 100)).toFixed(2); // Convert remisePercentage to decimal for calculation
  
    const reference = selectedProductState ? 
                       (selectedProductState.item_id ? 
                         selectedProductState.item_id : 
                         selectedProductState.item_number) : 
                       item_id;
  
    const updatedDetail = {
      id: id,
      référence: reference,
      product_description: selectedProductState ? selectedProductState.product_description : '',
      quantity: quantityDecimal,
      remisePercentage: remiseValuePercentage, // Store as percentage
      totalPrice: totalPrice,
      unitPrice: priceDecimal,
      vat: vatType,
      vat_type_id: vatType,
      purchasePrice: purchasePriceDecimal
    };
  
    dispatch(updateLineDetail(updatedDetail));
  }, [selectedProductState, quantityValue, remiseValue, dispatch, purchasePrice, id, unitPrice, item_id, vat, remise]);
  
  useEffect(() => {
    updateLine();
    console.log('totalPrice2 dans LineDetail: ' + totalPrice);
    console.log('remisevalue2 dans LineDetail: ' + remiseValue);
  }, [totalPrice, remiseValue, selectedProductState, quantityValue, updateLine]);


  return (
    <div className='line-details'>
      <div className='detail-id'>{lineNumber}</div>
      <div className='arrangement-line'>
        <Item onSelect={handleProductSelect} item_id={item_id ? item_id : undefined} />
      </div>
      <div className='vat'>{vat ? vat : (selectedProductState && selectedProductState.vat_type ? selectedProductState.vat_type.vat_type : '')}</div>
      <div className='arrangement-line'>
        <div className='filter-quantity'>
          <FilterQuantity
            value={quantityValue}
            onChange={handleQuantityChange}
          />
        </div>
      </div>
      <div className='unit-price'>{unitPrice ? unitPrice : (selectedProductState ? selectedProductState.price : '')}</div>
      <div className='total-price'>{!isNaN(totalPrice) ? totalPrice : ''}</div>
      <div className='filter-remise'>
        <RemiseFilter
          handleChangeFunction={handleRemiseChange}
          remiseValue={remiseValue}
        />
      </div>
      <div className='arrangement-line'>
        <button className='button-delete-line' onClick={() => onDelete(id)}>
          <FontAwesomeIcon icon={faXmark} className='iconDeleteLine' />
        </button>
      </div>
    </div>
  );
};

export default LineDetail;
