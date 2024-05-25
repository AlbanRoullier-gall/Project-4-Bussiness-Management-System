import { useEffect, useState } from 'react';
import { getAllPaymentTerms } from '../services/api';


const useFetchPaymentTerms= () => {
    const [paymentTerms, setPaymentTerms] = useState([]);
  
    useEffect(() => {
      const fetchPaymentTerms = async () => {
        try {
          const data = await getAllPaymentTerms();
          setPaymentTerms(data);
        } catch (error) {
          console.error('Erreur lors de la récupération des conditions de paiement :', error);
        }
      };
  
      fetchPaymentTerms();
    }, []);
  
    return paymentTerms;
  }

  export default useFetchPaymentTerms;