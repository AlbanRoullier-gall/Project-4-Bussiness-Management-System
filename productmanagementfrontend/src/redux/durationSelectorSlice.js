import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  invoiceDate: null,
  endDate: null,
  calculatedduration: null,
  duration: '',
};

const durationSelectorSlice = createSlice({
  name: 'durationSelector',
  initialState,
  reducers: {
    setInvoiceDate: (state, action) => {
      state.invoiceDate = action.payload;
      if (state.invoiceDate && state.endDate) {
        state.calculatedduration = getPaymentTerm(state.invoiceDate, state.endDate);
      }
    },
    setEndDate: (state, action) => {
      state.endDate = action.payload;
      if (state.invoiceDate && state.endDate) {
        state.calculatedduration = getPaymentTerm(state.invoiceDate, state.endDate);
      }
    },
    setDuration: (state, action) => {
      state.duration = action.payload;
    },
    resetDurationSelector: (state) => {
      // Réinitialiser toutes les valeurs à leur état initial
      state.invoiceDate = initialState.invoiceDate;
      state.endDate = initialState.endDate;
      state.calculatedduration = initialState.calculatedduration;
      state.duration = initialState.duration;
    },
  },
});

export const { setInvoiceDate, setEndDate, setDuration, resetDurationSelector } = durationSelectorSlice.actions;
export default durationSelectorSlice.reducer;

// Fonction getPaymentTerm inchangée
export const getPaymentTerm = (invoiceDate, endDate) => {
  // Convertir les chaînes de caractères en objets Date
  const invoiceDateObj = new Date(invoiceDate);
  const endDateObj = new Date(endDate);

  // Vérifier si la conversion a réussi
  if (isNaN(invoiceDateObj.getTime()) || isNaN(endDateObj.getTime())) {
    return "Dates invalides";
  }

  // Calculer la différence en jours
  const differenceInTime = endDateObj.getTime() - invoiceDateObj.getTime();
  const differenceInDays = Math.ceil(differenceInTime / (1000 * 3600 * 24));

  console.log("Type de invoiceDate:", typeof invoiceDate);
  console.log("Type de endDate:", typeof endDate);
  console.log("Difference in days:", differenceInDays);

  // Conditions pour déterminer la durée de paiement
  if (differenceInDays <= 0) {
    return "Paiement immédiat";
  } else if (differenceInDays <= 8) {
    return "Paiement à 8 jours";
  } else if (differenceInDays <= 30) {
    return "Paiement à 30 jours";
  } else if (differenceInDays <= 60) {
    return "Paiement à 60 jours";
  } else if (differenceInDays <= 90) {
    return "Paiement à 90 jours";
  } else {
    return "Autre terme de paiement";
  }
};
