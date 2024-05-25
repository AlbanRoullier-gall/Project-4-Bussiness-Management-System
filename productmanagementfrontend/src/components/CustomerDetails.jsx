// CustomerDetails.js
import React from 'react';

const CustomerDetails = ({ selectedClient, handleModifyClient }) => {
  return (
    <div className="customer-selectionned">
      <button className="button-customer" onClick={handleModifyClient}>
        Modifier le client
      </button>
      <div className="text-disposition">
        <span>Référence client: {selectedClient.customer_number}</span>
        <span>Nom client: {selectedClient.customer_name}</span>
        <span>N° TVA: {selectedClient.vat_number}</span>
      </div>
    </div>
  );
};

export default CustomerDetails;
