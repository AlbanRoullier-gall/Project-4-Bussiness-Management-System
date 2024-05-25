import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateCommunication, updateStructuredCommunication } from '../redux/communicationBillSlice';
import { cleanClientNumber, generateStructuredCommunication, updateLastInvoiceNumber } from '../containers/StructuredCommunicationUtils'; 
import './Communication.css';

const Communication = () => {
  const dispatch = useDispatch();
  const communication = useSelector((state) => state.communicationBill.communication); 
  const structuredCommunication = useSelector((state) => state.communicationBill.structuredCommunication); 
  const selectedClientId = useSelector(state => state.customers.selectedClientId);
  const [clientNumber, setClientNumber] = useState(null);
  const [invoiceNumber, setInvoiceNumber] = useState(null);
  const [lastInvoiceNumber, setLastInvoiceNumber] = useState(null);

  console.log("communication structurée :" + structuredCommunication)

  const handleCommunicationChange = (e) => {
    const newValue = e.target.value;
    dispatch(updateCommunication(newValue));
  };

  // Mettre à jour le dernier numéro de facture lors du montage du composant
  useEffect(() => {
    const fetchData = async () => {
      await updateLastInvoiceNumber(setLastInvoiceNumber);
    };
    fetchData();
  }, []);

  // Mettre à jour le numéro de facture et le numéro de client lorsqu'ils sont modifiés
  useEffect(() => {
    const cleanedClientNumber = cleanClientNumber(selectedClientId);
    setClientNumber(cleanedClientNumber);
    setInvoiceNumber(lastInvoiceNumber);
  }, [selectedClientId, lastInvoiceNumber]);

  // Générer la communication structurée et la mettre à jour dans Redux
  useEffect(() => {
    if (clientNumber && invoiceNumber && !structuredCommunication ) {
      const newStructuredCommunication = generateStructuredCommunication(clientNumber, invoiceNumber);
      dispatch(updateStructuredCommunication(newStructuredCommunication)); 
    }
  }, [clientNumber, invoiceNumber, dispatch, structuredCommunication]);

  // Réinitialiser les données de communication et de communication structurée lors de la création d'une nouvelle facture
  useEffect(() => {
    if (!selectedClientId && !lastInvoiceNumber) {
      dispatch(updateCommunication('')); 
      dispatch(updateStructuredCommunication('')); 
    }
  }, [selectedClientId, lastInvoiceNumber, dispatch]);

  return (
    <div className='container-communication'>
      <strong className='agencement-communication'>COMMUNICATION</strong>
      <textarea className='input-communication' value={communication} onChange={handleCommunicationChange} />
      {structuredCommunication && (
        <div className='structured-communication'>
          <p>COMMUNICATION STRUCTUREE<br /> {structuredCommunication}</p>
        </div>
      )}
    </div>
  );
};

export default Communication;
