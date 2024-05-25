// CustomerList.js
import React from 'react';

const CustomerList = ({ customers, selectedClient, handleClientSelect }) => {
  return (
    <div className="list-container">
      {customers.map((customer) => (
        <div
          className={`row ${selectedClient && selectedClient.customer_number === customer.customer_number ? 'selected' : ''}`}
          key={customer.customer_number}
          onClick={() => handleClientSelect(customer)}
        >
          <div className="client">{customer.customer_name}</div>
          <div className="reference">{customer.customer_number}</div>
          <div className="numéroTVA">{customer.vat_number}</div>
        </div>
      ))}
    </div>
  );
};

export default CustomerList;
