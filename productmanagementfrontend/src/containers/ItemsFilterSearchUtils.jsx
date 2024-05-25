export const filterItems = (items, searchTerms) => {
  return items.filter((item) => {
    const { product_description, item_id, item_number, supplier_number } = item;
    const { productSearchTerm, numberProductSearchTerm, numberSupplierSearchTerm } = searchTerms;

    const productDescriptionMatch = product_description.toLowerCase().includes(productSearchTerm.toLowerCase());
    let numberProductMatch = item_number.toLowerCase().includes(numberProductSearchTerm.toLowerCase());
    
    if (item_id) {
      numberProductMatch = item_id.toLowerCase().includes(numberProductSearchTerm.toLowerCase());
    }

    const numberSupplierMatch = supplier_number && supplier_number.toLowerCase().includes(numberSupplierSearchTerm.toLowerCase());

    return productDescriptionMatch && numberProductMatch && numberSupplierMatch;
  });
};
