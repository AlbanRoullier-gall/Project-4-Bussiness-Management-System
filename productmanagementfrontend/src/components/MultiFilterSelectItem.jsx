import React, { useState, useEffect } from 'react';
import useFetchItems from '../hooks/useFetchItems';
import ItemSelectionButton from './ItemSelectionButton';
import SearchInputsItems from './SearchInputsItems';
import ProductList from './ProductList';
import SelectedProductDisplay from './SelectedProductDisplay';
import { filterItems } from '../containers/ItemsFilterSearchUtils'; 
import './MultiFilterSelectItem.css';

const MultiFilterSelectItem = ({ onSelect, item_id }) => {
  const items = useFetchItems();

  const [isButtonClicked, setIsButtonClicked] = useState(false);
  const [isChooseButtonDisabled, setChooseButtonDisabled] = useState(false);
  const [searchTerms, setSearchTerms] = useState({
    productSearchTerm: '',
    numberProductSearchTerm: '',
    numberSupplierSearchTerm: '',
  });
  const [selectedProductInfo, setSelectedProductInfo] = useState(null); 

  useEffect(() => {
    if (item_id && items) {
      const foundProduct = items.find(item => item.item_number === item_id);
      if (foundProduct) {
        setSelectedProductInfo(foundProduct);
      }
    }
  }, [item_id, items]);

  const handleProductSelection = (selectedItem) => {
    onSelect({
      ...selectedItem,
    });
    setIsButtonClicked(false);
    setChooseButtonDisabled(false);
  };

  const handleSearchTermChange = (term, field) => {
    setSearchTerms({
      ...searchTerms,
      [field]: term,
    });
  };

  const filteredItems = filterItems(items, searchTerms); 
  
  return (
    <div className='extramain-container'>
      {!selectedProductInfo && !isButtonClicked && (
        <ItemSelectionButton onClick={() => setIsButtonClicked(true)} disabled={isChooseButtonDisabled} />
      )}

      {isButtonClicked && (
        <div className='container-proposition-product'>
          <ItemSelectionButton onClick={() => setIsButtonClicked(false)} disabled={isChooseButtonDisabled} />
          <SearchInputsItems searchTerms={searchTerms} handleSearchTermChange={handleSearchTermChange} />
          <ProductList filteredItems={filteredItems} selectedProductInfo={selectedProductInfo} handleProductSelection={handleProductSelection} />
        </div>
      )}

      {selectedProductInfo && !isButtonClicked && (
        <SelectedProductDisplay selectedProductInfo={selectedProductInfo} setIsButtonClicked={setIsButtonClicked} />
      )}
    </div>
  );
};

export default MultiFilterSelectItem;
