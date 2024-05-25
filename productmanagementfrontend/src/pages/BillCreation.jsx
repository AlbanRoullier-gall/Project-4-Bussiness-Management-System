import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import TitleBanner from '../components/TitleBanner.jsx';
import Menu from '../components/Menu.jsx';
import SectionBannerBillCreation from '../components/SectionBannerBillCreation.jsx';
import InvoiceInformationForm from '../components/InvoiceInformationForm.jsx';
import InvoiceDetailsForm from '../components/InvoiceDetailsForm.jsx';
import { updateLastInvoiceNumber, generateStructuredCommunication, cleanClientNumber } from '../containers/StructuredCommunicationUtils'; 
import { addDaysToDate } from '../containers/DueDateUtils'; 
import { saveInvoiceToDatabase } from '../services/api'; 
import { setDuration, resetDurationSelector } from '../redux/durationSelectorSlice'; 
import { setLineDetails } from '../redux/lineDetailsSlice'; 
import { updateCommunication, updateStructuredCommunication } from '../redux/communicationBillSlice';
import { setSelectedClientId } from '../redux/customerSlice'; 
import { setInvoiceReference } from '../redux/invoiceReferenceSlice'; 
import { clearFileSelectorData } from '../redux/fileSelectorSlice'; 
import { setDiscountPercentage } from '../redux/discountPercentageSlice'; 
import { setEmissionDate } from '../redux/invoiceDateSlice'; 

import { Navigate, Link } from 'react-router-dom'; 

import './BillCreation.css';

const BillCreation = () => {
  const dispatch = useDispatch();

  const selectedClientId = useSelector(state => state.customers.selectedClientId);
  const duration = useSelector(state => state.durationSelector.duration);
  const lineDetails = useSelector(state => state.lineDetails);
  const totalTVA = useSelector(state => state.total.totalTVA); 
  const totalDetailLine = useSelector(state => state.total.totalDetailLine);
  const discountPercentage = useSelector(state => state.discountPercentage);
  const communication = useSelector(state => state.communicationBill.communication); 
  const fileId = useSelector(state => state.fileSelector.fileId); 
  const structuredCommunication = useSelector(state => state.communicationBill.structuredCommunication);
  const [invoiceNumber, setInvoiceNumber] = useState(null);
  const currentDateRef = useRef(new Date());
  const [dueDate, setDueDate] = useState(addDaysToDate("Paiement immédiat"));
  const [savedSuccessfully, setSavedSuccessfully] = useState(false); 

  useEffect(() => {
    dispatch(setInvoiceReference(''));
    dispatch(setEmissionDate(new Date().toISOString()));
    dispatch(resetDurationSelector());
    dispatch(clearFileSelectorData());
    dispatch(setSelectedClientId(''));
    dispatch(setLineDetails([]));
    dispatch(updateCommunication('')); 
    dispatch(updateStructuredCommunication(''));
    dispatch(setDiscountPercentage(0));
  }, [dispatch]);




  // Mettre à jour le dernier numéro de facture lors du montage du composant
  useEffect(() => {
    const fetchData = async () => {
      await updateLastInvoiceNumber(setInvoiceNumber);
    };
    fetchData();
  }, []);

  // Mettre à jour la date d'échéance à chaque fois que la durée est modifiée
  useEffect(() => {
    const updatedDueDate = addDaysToDate(duration);
    setDueDate(updatedDueDate);
  }, [duration]);

  useEffect(() => {
    // Mettre à jour la structuredCommunication lorsque selectedClientId change
    if (selectedClientId !== '') {
      // Nettoyer le numéro client
      const cleanedClientNumber = cleanClientNumber(selectedClientId);
      // Générer la structuredCommunication avec le numéro client nettoyé
      const newStructuredCommunication = generateStructuredCommunication(cleanedClientNumber, invoiceNumber);
      dispatch(updateStructuredCommunication(newStructuredCommunication));
    }
  }, [selectedClientId, invoiceNumber, dispatch]);

  const generateInvoiceNumber = () => {
    const currentYear = new Date().getFullYear();
    const formattedInvoiceNumber = `F${currentYear}-${invoiceNumber.toString().padStart(4, '0')}`;
    return formattedInvoiceNumber;
  };

  const handleSaveButtonClick = async () => {

    // Vérifiez si dueDate est défini
    if (!dueDate) {
      alert("Veuillez sélectionner une date d'échéance avant de sauvegarder." + dueDate );
      return;
    }

    // Vérifier si un client est sélectionné
    if (!selectedClientId) {
      alert("Veuillez sélectionner un client avant de sauvegarder.");
      return;
    }

    // Vérifier s'il y a au moins une ligne de détail
    if (lineDetails.length === 0) {
      alert("Veuillez ajouter au moins une ligne de détail avant de sauvegarder.");
      return;
    }

    // Vérifier si au moins un produit est sélectionné
    if (lineDetails.every(item => !item.référence)) {
      alert("Veuillez sélectionner au moins un produit avant de sauvegarder.");
      return;
    }

    // Générer le numéro de facture au format FYYYY-XXXX
    const formattedInvoiceNumber = generateInvoiceNumber();

    // Convertir la date d'échéance en format adapté à Django
    const dueDateString = dueDate.toISOString().split('T')[0];

    // Convertir la date de facturation en format adapté à Django
    const invoiceDateString = currentDateRef.current.toISOString().split('T')[0];

    // Convertir les données numériques en types appropriés
    const total_amount_exc_vat_decimal = parseFloat(totalDetailLine).toFixed(2);
    const total_amount_vat_decimal = parseFloat(totalTVA).toFixed(2);
    const discount_total_decimal = (parseFloat(discountPercentage) / 100).toFixed(2);

    // Créer l'objet invoiceData pour enregistrement
    const invoiceData = {
      customer_id: selectedClientId,
      invoice_number: formattedInvoiceNumber, 
      invoice_date: invoiceDateString,
      due_date: dueDateString,
      total_amount_exc_vat: parseFloat(total_amount_exc_vat_decimal),
      total_amount_vat: parseFloat(total_amount_vat_decimal),
      discount_total: parseFloat(discount_total_decimal),
      flag_accounting: "En cours",
      communication: communication,
      structured_communication: structuredCommunication,
      uploaded_file: fileId,
      invoice_items: lineDetails.map(item => ({
        lineDetail_id: item.id,
        item_id: item.référence,
        quantity: parseFloat(item.quantity).toFixed(2),
        price: parseFloat(item.unitPrice).toFixed(2),
        purchase_price: parseFloat(item.purchasePrice).toFixed(2),
        discount: parseFloat(item.remisePercentage).toFixed(2),
        vat_value: (parseFloat(item.vat.match(/\d+/)[0]) / 100).toFixed(2),
        vat_type_id: item.vat_type_id 
      }))
    };

    console.log('Invoice Data:', invoiceData);

    try {
      await saveInvoiceToDatabase(invoiceData); 

      // Réinitialisez les valeurs
      dispatch(setInvoiceReference(''));
      dispatch(setDuration(''));
      dispatch(clearFileSelectorData());
      dispatch(setSelectedClientId(''));
      dispatch(setLineDetails([]));
      dispatch(updateCommunication('')); 
      dispatch(updateStructuredCommunication(''));
      dispatch(setDiscountPercentage(0));

      // Afficher un message de succès
      alert('La facture a été sauvegardée avec succès.');

      // Mettre savedSuccessfully à true pour déclencher la redirection
      setSavedSuccessfully(true);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde de la facture :', error);
    } 
  };

  if (savedSuccessfully) {
    return <Navigate to="/facture" />;
  }

  return (
    <div className='page-disposition'>
      <div>
        <TitleBanner></TitleBanner>
      </div>
      <div>
        <Menu></Menu>
      </div>
      <div>
        <SectionBannerBillCreation></SectionBannerBillCreation>
      </div>
      <div className='page-disposition2'>
        <div className='agencement1'>
          <div>
            <InvoiceInformationForm></InvoiceInformationForm>
          </div>
          <div>
            <InvoiceDetailsForm></InvoiceDetailsForm>
          </div>
        </div>
        <div className='button-disposition'>
          <button className='button-save' onClick={handleSaveButtonClick}>SAUVEGARDER</button>
          <button className='button-cancel'>
            <Link to="/" className='button-cancel-link'>ANNULER</Link>
          </button>
        </div>
      </div>
    </div>
  );
};

export default BillCreation;
