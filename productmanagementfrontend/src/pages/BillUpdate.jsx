import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import TitleBanner from '../components/TitleBanner.jsx';
import Menu from '../components/Menu.jsx';
import SectionBannerBillModification from '../components/SectionBannerBillModification.jsx';
import InvoiceInformationForm from '../components/InvoiceInformationForm.jsx';
import InvoiceDetailsForm from '../components/InvoiceDetailsForm.jsx';
import { generateStructuredCommunication, cleanInvoiceNumber, cleanClientNumber } from '../containers/StructuredCommunicationUtils'; 
import { getInvoiceDetails, updateInvoice } from '../services/api';
import { setInvoiceReference } from '../redux/invoiceReferenceSlice';
import { setEmissionDate } from '../redux/invoiceDateSlice';
import { setInvoiceDate, setEndDate } from '../redux/durationSelectorSlice';
import { setFileURL, setId } from '../redux/fileSelectorSlice';
import { setSelectedClientId } from '../redux/customerSlice';
import { setInvoiceItems } from '../redux/invoiceItemsSlice';
import { setDiscountPercentage } from '../redux/discountPercentageSlice';
import { updateStructuredCommunication, updateCommunication } from '../redux/communicationBillSlice';
import './BillUpdate.css';

const BillUpdate = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [showPopup, setShowPopup] = useState(false);
  const [selectedFlag, setSelectedFlag] = useState("En cours");
  const [isDisabled, setIsDisabled] = useState(false); 


  useEffect(() => {
    const fetchInvoiceDetails = async () => {
      try {
        const invoiceDetails = await getInvoiceDetails(id);

        dispatch(setInvoiceReference(invoiceDetails.invoice_number));
        dispatch(setSelectedClientId(invoiceDetails.customer_id));
        dispatch(setEmissionDate(invoiceDetails.invoice_date));
        dispatch(setInvoiceDate(invoiceDetails.invoice_date));
        dispatch(setEndDate(invoiceDetails.due_date));
        dispatch(setFileURL(invoiceDetails.uploaded_file_file_url));
        dispatch(setId(invoiceDetails.uploaded_file_file_id));
        dispatch(setInvoiceItems(invoiceDetails.invoice_items));
        dispatch(setDiscountPercentage((invoiceDetails.discount_total * 100)));
        dispatch(updateStructuredCommunication(invoiceDetails.structured_communication));
        dispatch(updateCommunication(invoiceDetails.communication));

        if (invoiceDetails.flag_accounting === "En comptabilitée") {
          alert("La facture est en comptabilité. Vous ne pouvez pas la modifier.");
          setIsDisabled(true); 
          return;
        }

      } catch (error) {
        console.error('Erreur lors de la récupération des détails de la facture : ', error);
        window.location.href = "/";
      }
    };
    fetchInvoiceDetails();
  }, [dispatch, id]);

  const selectedClientId = useSelector(state => state.customers.selectedClientId);
  const invoiceReference = useSelector(state => state.invoiceReference);
  const invoiceDate = useSelector(state => state.durationSelector.invoiceDate);
  const endDate = useSelector(state => state.durationSelector.endDate);
  const totalDetailLine = useSelector(state => state.total.totalDetailLine);
  const totalTVA = useSelector(state => state.total.totalTVA);
  const discountPercentage = useSelector(state => state.discountPercentage);
  const communication = useSelector(state => state.communicationBill.communication);
  const structuredCommunication = useSelector(state => state.communicationBill.structuredCommunication);
  const fileId = useSelector(state => state.fileSelector.fileId);
  const lineDetails = useSelector(state => state.lineDetails);

  useEffect(() => {
    // Vérifier que selectedClientId est mis à jour correctement
    console.log("selectedClientId:", selectedClientId);
    console.log("invoiceReference:", invoiceReference.reference);

    // Mettre à jour la structuredCommunication lorsque selectedClientId change
    if (selectedClientId !== '' && invoiceReference.reference !== null) {
      // Nettoyer le numéro de facture
      const cleanedInvoiceNumber = cleanInvoiceNumber(invoiceReference.reference);
      if (cleanedInvoiceNumber) {
        // Nettoyer le numéro client
        const cleanedClientNumber = cleanClientNumber(selectedClientId);
        if (cleanedClientNumber) {
          // Générer la structuredCommunication avec le numéro de facture et le numéro client nettoyés
          const newStructuredCommunication = generateStructuredCommunication(cleanedClientNumber, cleanedInvoiceNumber);
          console.log("New Structured Communication:", newStructuredCommunication);

          dispatch(updateStructuredCommunication(newStructuredCommunication));
        }
      }
    }
  }, [selectedClientId, invoiceReference, dispatch]);
  
  const handleUpdateButtonClick = async () => {
    const endDateObj = new Date(endDate);
    const invoiceDateObj = new Date(invoiceDate);

    if (isNaN(endDateObj.getTime()) || isNaN(invoiceDateObj.getTime())) {
      alert("Les dates de facturation et d'échéance sont invalides. Veuillez les sélectionner à nouveau.");
      return;
    }

    if (!selectedClientId) {
      alert("Veuillez sélectionner un client avant de modifier.");
      return;
    }

    if (lineDetails.length === 0) {
      alert("Veuillez ajouter au moins une ligne de détail avant de modifier.");
      return;
    }

    if (lineDetails.every(item => !item.référence)) {
      alert("Veuillez sélectionner au moins un produit avant de modifier.");
      return;
    }

    const total_amount_exc_vat_decimal = parseFloat(totalDetailLine).toFixed(2);
    const total_amount_vat_decimal = parseFloat(totalTVA).toFixed(2);
    const discount_total_decimal = (parseFloat(discountPercentage) / 100).toFixed(2);

    const invoiceDateString = invoiceDateObj.toISOString().split('T')[0];
    const dueDateString = endDateObj.toISOString().split('T')[0];

    const updatedInvoiceData = {
      customer_number: selectedClientId,
      invoice_number: invoiceReference.reference,
      invoice_date: invoiceDateString,
      due_date: dueDateString,
      total_amount_exc_vat: parseFloat(total_amount_exc_vat_decimal),
      total_amount_vat: parseFloat(total_amount_vat_decimal),
      discount_total: parseFloat(discount_total_decimal),
      flag_accounting: selectedFlag,
      communication: communication,
      structured_communication: structuredCommunication,
      uploaded_file: fileId,
      invoice_items: lineDetails.map(item => ({
        item_id: item.id,
        item_reference: item.référence,
        quantity: parseFloat(item.quantity).toFixed(2),
        price: parseFloat(item.unitPrice).toFixed(2),
        purchase_price: parseFloat(item.purchasePrice).toFixed(2),
        discount: parseFloat(item.remisePercentage).toFixed(2),
        vat_value: (parseFloat(item.vat.match(/\d+/)[0]) / 100).toFixed(2),
        vat_type_id: item.vat_type_id
      }))
    };

    console.log('Updated Data:', updatedInvoiceData);

    try {
      await updateInvoice(invoiceReference.reference.toString(), updatedInvoiceData);
      alert('La facture a été mise à jour avec succès.');
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la facture :', error);
    }
  };

  const handlePopupButtonClick = () => {
    setShowPopup(true);
  };

  const handlePopupClose = () => {
    setShowPopup(false);
  };

  const handleFlagChange = (e) => {
    setSelectedFlag(e.target.value);
    setIsDisabled(false); 
  };

  const handleSaveFlag = () => {
    setShowPopup(false);
  };

  return (
    <div className='page-disposition'>
      <div>
        <TitleBanner></TitleBanner>
      </div>
      <div>
        <Menu></Menu>
      </div>
      <div>
        <SectionBannerBillModification></SectionBannerBillModification>
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
          <button className='button-modify' onClick={handleUpdateButtonClick} disabled={isDisabled} >MODIFIER</button>         
          <button className='button-modify-status' onClick={handlePopupButtonClick}>MODIFIER LE STATUT</button>
          <button className='button-cancel'>
            <Link to="/" className='button-cancel-link'>ANNULER</Link>
          </button>
        </div>
      </div>
      {showPopup && (
        <div className='popup'>
          <div className='popup-content'>
            <h2>Modifier le statut de la facture</h2>
            <select value={selectedFlag} onChange={handleFlagChange}>
              <option value="Payée">Payée</option>
              <option value="En cours">En cours</option>
              <option value="En retard">En retard</option>
              <option value="En comptabilitée">En comptabilitée</option>
            </select>
            <button className='button-modify' onClick={handleSaveFlag}>Enregistrer</button>
            <button className='button-cancel' onClick={handlePopupClose}>Fermer</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BillUpdate;
