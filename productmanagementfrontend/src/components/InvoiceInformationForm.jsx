import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setNomFournisseur, setReferenceFournisseur } from '../redux/supplierInfoSlice';
import DividerVertical from './DividerVertical.jsx';
import CustomerFilter from './CustomerFilter.jsx';
import DurationSelector from './DurationSelector.jsx';
import FileSelector from './FileSelector.jsx';
import './InvoiceInformationForm.css';

const InvoiceInformationForm = () => {
  const invoiceReference = useSelector(state => state.invoiceReference.reference);
  const emissionDate = useSelector(state => state.invoiceDate.emissionDate);

  const dispatch = useDispatch();
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDate(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Convertir emissionDate en chaîne de caractères si elle est définie
  const formattedDate = emissionDate ? new Date(emissionDate).toLocaleDateString() : currentDate.toLocaleDateString();

  const handleNomFournisseurChange = (event) => {
    const value = event.target.value;
    dispatch(setNomFournisseur(value));
  };

  const handleReferenceFournisseurChange = (event) => {
    const value = event.target.value;
    dispatch(setReferenceFournisseur(value));
  };

  return (
    <div className='container-base-creation-bill1'>
      <div className='container-base-information-bill'>
        <h3>FACTURE</h3>
        <div className='area-selectie'>
          <div>Référence</div>
          <div>{invoiceReference || 'Automatisé FXXXX-XXXX'}</div>
        </div>
        <div className='area-selectie'>
          <div>Date d’émission</div>
          <div>{formattedDate}</div>
        </div>
        <div className='area-selectie'>
          <div>Échéance</div>
          <div>
            <DurationSelector />
          </div>
        </div>
        <div className='area-selectie'>
          <div className='provider-text'>
            Bon de commande fournisseur
          </div>
          <div>
            <FileSelector />
          </div>
        </div>
        <div className='area-selectie'>
          <div>
            Fournisseur
          </div>
          <div>
            <input
              type="text"
              placeholder="Nom fournisseur"
              onChange={handleNomFournisseurChange}
            />
          </div>
        </div>
        <div className='area-selectie'>
          <div>
            Référence fournisseur
          </div>
          <div>
            <input
              type="text"
              placeholder="Référence fournisseur"
              onChange={handleReferenceFournisseurChange}
            />
          </div>
        </div>
      </div>
      <DividerVertical length="30rem" color="#43A8A4" />
      <div className='container-customer-information'>
        <CustomerFilter />
      </div>
    </div>
  );
}

export default InvoiceInformationForm;
