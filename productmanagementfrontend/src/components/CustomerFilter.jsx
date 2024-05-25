import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import useFetchCustomers from '../hooks/useFetchCustomers';
import { setSelectedClientId } from '../redux/customerSlice';
import CustomerSearch from './CustomerSearch';
import CustomerList from './CustomerList';
import CustomerDetails from './CustomerDetails';
import './CustomerFilter.css';

const CustomerFilter = () => {
  const dispatch = useDispatch();
  const customers = useFetchCustomers();
  const selectedClientIdFromRedux = useSelector(state => state.customers.selectedClientId);
  const [selectedClient, setSelectedClient] = useState(null);
  const [clientSearchTerm, setClientSearchTerm] = useState('');
  const [idSearchTerm, setIdSearchTerm] = useState('');
  const [numéroTVASearchTerm, setNuméroTVASearchTerm] = useState('');

  useEffect(() => {
    if (selectedClientIdFromRedux) {
      const client = customers.find(customer => customer.customer_number === selectedClientIdFromRedux);
      if (client) {
        setSelectedClient(client);
      }
    }
  }, [selectedClientIdFromRedux, customers]);

  const handleClientSearch = (term) => {
    setClientSearchTerm(term);
  };

  const handleIdSearch = (term) => {
    setIdSearchTerm(term);
  };

  const handleNuméroTVASearch = (term) => {
    setNuméroTVASearchTerm(term);
  };

  const handleClientSelect = (customer) => {
    setSelectedClient(customer);
    dispatch(setSelectedClientId(customer.customer_number));
    setClientSearchTerm('');
    setIdSearchTerm('');
    setNuméroTVASearchTerm('');
  };

  const handleModifyClient = () => {
    setSelectedClient(null);
    dispatch(setSelectedClientId(''));
  };

  const filteredCustomers = customers.filter((customer) => {
    return (
      customer.customer_name.toLowerCase().includes(clientSearchTerm.toLowerCase()) &&
      customer.customer_number.toLowerCase().includes(idSearchTerm.toLowerCase()) &&
      customer.vat_number.toLowerCase().includes(numéroTVASearchTerm.toLowerCase())
    );
  });

  return (
    <div className="extramain-container">
      {!selectedClient && (
        <div className="customer-selectionned">
          <button className="button-customer" onClick={() => setSelectedClient(null)}>
            Désigner le client
          </button>
          <CustomerSearch
            searchTerm={clientSearchTerm}
            handleSearchTermChange={handleClientSearch}
            placeholder="Chercher par client"
          />
          <CustomerSearch
            searchTerm={idSearchTerm}
            handleSearchTermChange={handleIdSearch}
            placeholder="Chercher par référence"
          />
          <CustomerSearch
            searchTerm={numéroTVASearchTerm}
            handleSearchTermChange={handleNuméroTVASearch}
            placeholder="Chercher par numéro de TVA"
          />
          <CustomerList
            customers={filteredCustomers}
            selectedClient={selectedClient}
            handleClientSelect={handleClientSelect}
          />
        </div>
      )}
      {selectedClient && (
        <CustomerDetails selectedClient={selectedClient} handleModifyClient={handleModifyClient} />
      )}
    </div>
  );
};

export default CustomerFilter;
