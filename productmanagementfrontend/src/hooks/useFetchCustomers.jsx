import { useEffect, useState } from 'react';
import { getAllCustomers } from '../services/api';

const useFetchCustomers = () => {
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAllCustomers();
        setCustomers(data);
      } catch (error) {
        console.error('Erreur lors de la récupération des clients :', error);
      }
    };

    fetchData();
  }, []);

  return customers;
};

export default useFetchCustomers;
