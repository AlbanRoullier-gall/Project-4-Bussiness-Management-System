import { useState, useEffect } from 'react';
import { getAllItems } from '../services/api';

const useFetchItems = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const fetchedItems = await getAllItems();
        setItems(fetchedItems);
      } catch (error) {
        console.error('Erreur lors de la récupération des produits :', error);
      }
    };

    fetchItems();
  }, []);

  return items;
};

export default useFetchItems;
