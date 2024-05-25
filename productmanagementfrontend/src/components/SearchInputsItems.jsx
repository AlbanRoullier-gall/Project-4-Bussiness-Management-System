import React from 'react';
import './SearchInputsItems.css';

const SearchInputsItems = ({ searchTerms, handleSearchTermChange }) => {
  return (
    <div className='all-search-input'>
      {Object.entries(searchTerms).map(([fieldName, searchTerm]) => (
        <div key={fieldName} className="search-input-container2">
          <input
            type="text"
            className="search-input"
            placeholder={`Chercher ${fieldName === 'productSearchTerm' ? 'un nom' : fieldName === 'numberProductSearchTerm' ? 'une référence' : 'un numéro'} de ${fieldName === 'numberSupplierSearchTerm' ? 'fournisseur' : 'produit'}`}
            value={searchTerm}
            onChange={(e) => handleSearchTermChange(e.target.value, fieldName)}
          />
        </div>
      ))}
    </div>
  );
};

export default SearchInputsItems;
