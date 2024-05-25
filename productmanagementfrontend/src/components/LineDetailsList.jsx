import React, { useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useDispatch, useSelector } from 'react-redux';
import LineDetail from './LineDetail';
import AddButton from './AddButton';
import { setLineDetails as setLineDetailsAction } from '../redux/lineDetailsSlice';

const LineDetailsList = () => {
  const dispatch = useDispatch();
  const lineDetails = useSelector(state => state.lineDetails);
  const invoiceItems = useSelector(state => state.invoiceItems);

  useEffect(() => {
    const generateLineDetails = () => {
      return invoiceItems.map((item) => {
        const unitPrice = parseFloat(item.price);
        const purchasePrice = parseFloat(item.purchase_price); 
        const quantity = parseFloat(item.quantity);
        const remisePercentage = parseFloat(item.discount); // Assuming item.discount is in percentage (e.g., 10 for 10%)
        const remise = remisePercentage / 100; // Convert percentage to decimal for calculation
        const totalPrice = (unitPrice * quantity * (1 - remise)).toFixed(2);
    
        return {
          id: item.uuid,
          purchasePrice: purchasePrice, 
          quantity,
          remisePercentage,
          référence: item.item_id,
          unitPrice,
          totalPrice,
          vat: item.vat_type_id,
        };
      });
    };
  
    const initialLineDetails = generateLineDetails();
    dispatch(setLineDetailsAction(initialLineDetails));
  }, [dispatch, invoiceItems]);
  
  const addLineDetail = useCallback(() => {
    const newLineDetail = {
      id: uuidv4(),
      vat: '0%',
      quantity: 1,
      unitPrice: 0,
      totalPrice: '€ 0',
      remisePercentage: '0%',
      product_description: '',
    };
    console.log('Ajout d\'une nouvelle ligne de détail :', newLineDetail);
    dispatch(setLineDetailsAction([...lineDetails, newLineDetail]));
  }, [dispatch, lineDetails]);

  const deleteLineDetail = useCallback((idToDelete) => {
    console.log('Suppression de la ligne de détail avec l\'ID :', idToDelete);
    const updatedDetails = lineDetails.filter(detail => detail.id !== idToDelete);
    dispatch(setLineDetailsAction(updatedDetails));
  }, [dispatch, lineDetails]);
  
  return (
    <div className='lineDetails'>
      {lineDetails.map((detail, index) => (
        <LineDetail
          key={detail.id}
          detail={detail}
          item_id={detail.référence || undefined}
          remise={detail.remise !== undefined ? detail.remise : undefined}
          vat={detail.vat || undefined}
          unitPrice={detail.unitPrice || undefined}
          purchasePrice={detail.purchasePrice || undefined}
          quantity={detail.quantity || undefined}
          totalPrice={detail.totalPrice || undefined}
          onDelete={deleteLineDetail}
          lineNumber={index + 1} 
        />
      ))}
      <AddButton onClick={addLineDetail} />
    </div>
  );
};

export default LineDetailsList;
