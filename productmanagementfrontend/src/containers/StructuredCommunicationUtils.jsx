import { getAllInvoices } from '../services/api'; 

export const fetchLastInvoiceNumber = async () => {
  try {
    const invoices = await getAllInvoices();
    const lastInvoice = invoices[invoices.length - 1];
    return lastInvoice;
  } catch (error) {
    console.error('Error fetching data:', error);
    return null;
  }
};

export const incrementInvoiceNumber = (invoiceNumber) => {
  if (typeof invoiceNumber === 'number') {
    return invoiceNumber + 1;
  }
  return null;
};

export const cleanInvoiceNumber = (invoiceId) => {
  if (invoiceId) {
    const cleanedInvoiceNumber = invoiceId.replace(/F\d{4}/, '');
    const trimmedInvoiceNumber = cleanedInvoiceNumber.replace('-', '');
    const finalInvoiceNumber = trimmedInvoiceNumber.replace(/^0+(?=\d)/, '');
    return parseInt(finalInvoiceNumber);
  }
  return null;
};

export const updateLastInvoiceNumber = async (setLastInvoiceNumber) => {
  try {
    const lastInvoice = await fetchLastInvoiceNumber();
    if (lastInvoice) {
      const finalInvoiceNumber = cleanInvoiceNumber(lastInvoice.id);
      const nextInvoiceNumber = incrementInvoiceNumber(finalInvoiceNumber);
      setLastInvoiceNumber(nextInvoiceNumber);
    }
  } catch (error) {
    console.error('Error updating last invoice number:', error);
  }
};

export const cleanClientNumber = (clientNumber) => {
  if (clientNumber) {
    const cleanedClientNumber = clientNumber.replace('C', '');
    const trimmedClientNumber = cleanedClientNumber.replace('-', '');
    return trimmedClientNumber;
  }
  return null;
};


export const calculateControlDigit = (baseNumber) => {
  // Enlève les deux derniers chiffres
  const baseWithoutLastTwoDigits = Math.floor(baseNumber / 100);
  // Divise par 97
  const divisionResult = Math.floor(baseWithoutLastTwoDigits / 97);
  // Multiplie le résultat par 97
  const multipliedResult = divisionResult * 97;
  // Calcule la différence entre le nombre original et le résultat de la multiplication
  const difference = baseWithoutLastTwoDigits - multipliedResult;
  // Calcule le chiffre de contrôle en soustrayant la différence de 97
  let controlDigit = 97 - difference;

  // Assure que le chiffre de contrôle comporte toujours deux chiffres
  if (controlDigit < 10) {
    controlDigit = '0' + controlDigit; // Ajoute un zéro devant si le chiffre de contrôle est inférieur à 10
  }

  return controlDigit.toString();
};

export const generateStructuredCommunication = (clientNumber, invoiceNumber) => {
  if (clientNumber !== null && invoiceNumber !== null) {
    console.log("Invoice Number:", invoiceNumber); 
    console.log("Customer Number:", clientNumber);

    // Supprimer les zéros au début des nombres
    const cleanedClientNumber = clientNumber.toString().replace(/^0+/, '');
    const cleanedInvoiceNumber = invoiceNumber.toString().replace(/^0+/, '');

    // Concaténer les numéros
    let concatenatedNumber = cleanedClientNumber + cleanedInvoiceNumber;

    // Ajouter des zéros à la fin si la longueur est inférieure à 12 chiffres
    while (concatenatedNumber.length < 12) {
      concatenatedNumber += '0';
    }

    // Tronquer si la longueur dépasse 12 chiffres
    if (concatenatedNumber.length > 12) {
      concatenatedNumber = concatenatedNumber.slice(0, 12);
    }

    const baseNumber = parseInt(concatenatedNumber, 10);
    console.log('baseNumber:', baseNumber);
    const controlDigit = calculateControlDigit(baseNumber);
    console.log('controlDigit:', controlDigit);
    // Créer la structuredCommunication avec le format spécifié
    const structuredCommunication = `+++${concatenatedNumber.slice(0, 3)}/${concatenatedNumber.slice(3, 7)}/${controlDigit.padStart(5, '0')}+++`;

    return structuredCommunication;
  }
  return null;
};
