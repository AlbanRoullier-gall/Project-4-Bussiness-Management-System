import React from 'react';
import './ProductList.css'; 

const ProductList = ({ filteredItems, selectedProductInfo, handleProductSelection }) => {
  return (
    <div className="list-container2">
      {filteredItems.map(({ item_number, product_description, supplier_number, price, vat_type, purchase_price }) => (
        <div
          className={`row ${item_number === selectedProductInfo?.selectedNumberProduct ? 'selected' : ''}`}
          key={item_number}
          onClick={() => handleProductSelection({
            product_description,
            item_number,
            supplier_number,
            price,
            vat_type,
            purchase_price,
          })}
        >
          <div className="Nom produit">{product_description}</div>
          <div className="Reference produit">{item_number}</div>
          <div className="N° fournisseur">{supplier_number || ''}</div>
        </div>
      ))}
    </div>
  );
};

export default ProductList;
