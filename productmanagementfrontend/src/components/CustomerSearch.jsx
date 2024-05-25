// CustomerSearch.js
import React from 'react';

const CustomerSearch = ({ searchTerm, handleSearchTermChange, placeholder }) => {
  return (
    <div className="search-input-container">
      <input
        type="text"
        className="search-input"
        placeholder={placeholder}
        value={searchTerm}
        onChange={(e) => handleSearchTermChange(e.target.value)}
      />
    </div>
  );
};

export default CustomerSearch;
