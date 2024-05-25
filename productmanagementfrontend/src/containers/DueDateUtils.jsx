export const addDaysToDate = (duration) => {
  const currentDate = new Date(); // Obtenez la date actuelle

  switch (duration) {
    case 'Paiement immédiat':
      return currentDate; // Pas de jours ajoutés pour un paiement immédiat
    case 'Paiement à 8 jours':
      return new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 8);
    case 'Paiement à 30 jours':
      return new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 30);
    case 'Paiement à 60 jours':
      return new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 60);
    case 'Paiement à 90 jours':
      return new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 90);
    default:
      return currentDate; // Retourne la date actuelle par défaut si la durée est inconnue
  }
};

// Importez cette fonction pour calculer la date de fin en fonction de la durée sélectionnée
export const calculateEndDate = (invoiceDate, duration) => {
  // Convertissez la chaîne de caractères de la date de facturation en objet Date
  const invoiceDateObj = new Date(invoiceDate);

  // Vérifiez si la conversion de la date de facturation a réussi
  if (isNaN(invoiceDateObj.getTime())) {
    return null; // Retournez null si la date de facturation est invalide
  }

  // Clonez la date de facturation pour éviter de modifier l'objet original
  const endDateObj = new Date(invoiceDateObj);

  // Obtenez le nombre de jours à ajouter en fonction de la durée sélectionnée
  let daysToAdd;
  switch (duration) {
    case "Paiement immédiat":
      daysToAdd = 0; // Pas de jours à ajouter pour un paiement immédiat
      break;
    case "Paiement à 8 jours":
      daysToAdd = 8;
      break;
    case "Paiement à 30 jours":
      daysToAdd = 30;
      break;
    case "Paiement à 60 jours":
      daysToAdd = 60;
      break;
    case "Paiement à 90 jours":
      daysToAdd = 90;
      break;
    default:
      return null; // Retournez null si la durée est inconnue
  }

  // Ajoutez le nombre de jours à la date de facturation pour obtenir la date de fin
  endDateObj.setDate(endDateObj.getDate() + daysToAdd);
  return endDateObj;
};
