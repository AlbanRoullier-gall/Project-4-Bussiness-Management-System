import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setDiscountPercentage } from '../redux/discountPercentageSlice';
import { setTotalTVA, setTotalDetailLine } from '../redux/totalSlice';
import DividerHorizontal from './DividerHorizontal';
import HeaderDetails from './HeaderDetails';
import LineDetailsList from './LineDetailsList';
import DiscountSection from './DiscountSection';
import TaxesSection from './TaxesSection';
import TotalTVASection from './TotalTVASection';
import TotalTTCSection from './TotalTTCSection';
import SignatureSection from './SignatureSection';
import { calculateTotalByVATGroup, calculateTotalDetailLine, calculateTotalTVA } from '../containers/InvoiceDetailsFormUtils';
import './InvoiceDetailsForm.css';

const InvoiceDetailsForm = () => {
  const dispatch = useDispatch();
  const discountPercentage = useSelector(state => state.discountPercentage);
  const lineDetails = useSelector(state => state.lineDetails);
  const totalTVA = useSelector(state => state.total.totalTVA);
  const totalDetailLine = useSelector(state => state.total.totalDetailLine);
  const handleDiscount = (newValue) => {
    dispatch(setDiscountPercentage(newValue));
  };

  useEffect(() => {
    console.log("lineDetails:", lineDetails); 
    const totalBeforeDiscount = calculateTotalDetailLine(lineDetails);
    const discountAmount = (totalBeforeDiscount * discountPercentage) / 100;
    const calculatedTotalDetailLine = parseFloat((totalBeforeDiscount - discountAmount).toFixed(2));
    if (calculatedTotalDetailLine !== totalDetailLine) {
      dispatch(setTotalDetailLine(calculatedTotalDetailLine));
    }
  }, [dispatch, lineDetails, discountPercentage, totalDetailLine]);

  useEffect(() => {
    const totals = calculateTotalByVATGroup(lineDetails, discountPercentage);
    const totalTVAValue = calculateTotalTVA(totals);
    if (totalTVAValue !== totalTVA) {
      dispatch(setTotalTVA(totalTVAValue));
    }
  }, [dispatch, lineDetails, discountPercentage, totalTVA]);

  return (
    <div className='container-base-creation-bill2'>
      <div className='container-base-details'>
        <HeaderDetails />
        <LineDetailsList />
        <DividerHorizontal length={1600} color='black' />
        <DiscountSection totalDetailLine={totalDetailLine} handleDiscount={handleDiscount} />
        <DividerHorizontal length={1600} color='black' />
        <TaxesSection totals={calculateTotalByVATGroup(lineDetails, discountPercentage)} />
        <DividerHorizontal length={1600} color='black' />
        <TotalTVASection totalTVA={totalTVA} />
        <DividerHorizontal length={1600} color='black' />
        <TotalTTCSection totalTVA={totalTVA} totalDetailLine={totalDetailLine} />
        <DividerHorizontal length={1600} color='black' />
        <SignatureSection totalTVA={totalTVA} totalDetailLine={totalDetailLine} />
      </div>
    </div>
  );
};

export default InvoiceDetailsForm;
