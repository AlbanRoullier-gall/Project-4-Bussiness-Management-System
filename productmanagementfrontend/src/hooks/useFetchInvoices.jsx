// useFetchInvoices.js
import { useEffect, useState } from 'react';
import { getAllInvoices } from '../services/api';

const useFetchInvoices = () => {
  const [invoices, setInvoices] = useState([]);

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const invoicesData = await getAllInvoices();
        setInvoices(invoicesData);
        console.log(invoicesData);
      } catch (error) {
        console.error('Error fetching invoices:', error);
      }
    };

    fetchInvoices();
  }, []);

  return invoices;
};

export default useFetchInvoices;
