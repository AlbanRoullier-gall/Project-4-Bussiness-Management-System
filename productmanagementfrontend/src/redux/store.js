// store.js
import { configureStore } from '@reduxjs/toolkit';
import customerReducer from './customerSlice';

import durationSelectorReducer from './durationSelectorSlice.js';
import fileSelectorReducer from './fileSelectorSlice';
import supplierInfoReducer from './supplierInfoSlice';

import lineDetailsReducer from './lineDetailsSlice'; 


import discountPercentageReducer from './discountPercentageSlice.js';

import communicationBillReducer from './communicationBillSlice'; 
import signatureReducer from './signatureSlice'; 


import totalReducer from './totalSlice';

import invoiceReferenceReducer from './invoiceReferenceSlice'; 

import invoiceDateReducer from './invoiceDateSlice'; 
import invoiceItemsReducer from './invoiceItemsSlice';
const store = configureStore({
  reducer: {
    customers: customerReducer,
    durationSelector: durationSelectorReducer,
    fileSelector: fileSelectorReducer,
    supplierInfo: supplierInfoReducer,
    lineDetails: lineDetailsReducer,
    discountPercentage: discountPercentageReducer,
    communicationBill: communicationBillReducer,
    signature: signatureReducer,
    total: totalReducer,
    invoiceReference: invoiceReferenceReducer, 
    invoiceDate: invoiceDateReducer,
    invoiceItems: invoiceItemsReducer, 

  },
});

export default store;