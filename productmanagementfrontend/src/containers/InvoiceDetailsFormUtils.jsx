export const groupTaxesByPercentage = (items) => {
  const taxGroups = {};

  items.forEach((item) => {
    if (item && item.vat) {
      let vatPercentage = item.vat.replace('%', ''); // Retirer le caractère '%'
      vatPercentage = vatPercentage.trim(); // Supprimer les espaces
      // Vérifier si le pourcentage de TVA est déjà présent
      if (!taxGroups[vatPercentage]) {
        taxGroups[vatPercentage] = [];
      }
      taxGroups[vatPercentage].push(item);
    }
  });

  return taxGroups;
};


// Fonction pour calculer le montant total par groupe de TVA
export const calculateTotalByVATGroup = (items, discountPercentage) => {
  // Regroupe les articles par pourcentage de TVA
  const groupedItems = groupTaxesByPercentage(items, discountPercentage);
  // Initialise un objet pour stocker les totaux par groupe de TVA
  const totals = {};
  // Parcourt chaque groupe de taxe
  Object.keys(groupedItems).forEach((vatPercentage) => {
    // Calcule le total pour le groupe de taxe actuel
    const total = groupedItems[vatPercentage].reduce((acc, item) => {
      // Convertit le prix total de l'article en nombre
      const totalBeforeDiscount = parseFloat(item.totalPrice) || 0; // Utilise € 0 si le prix total n'est pas un nombre
      const discountAmount = (totalBeforeDiscount * discountPercentage) / 100;
      const totalAfterDiscount = totalBeforeDiscount - discountAmount;
      // Ajoute le prix total à l'accumulateur
      return acc + totalAfterDiscount;
    }, 0);
    // Enregistre le total dans le groupe de TVA correspondant
    totals[vatPercentage] = total.toFixed(2);
  });
  // Renvoie les totaux par groupe de TVA
  return totals;
};

// Fonction pour calculer le montant total de la ligne de détail
export const calculateTotalDetailLine = (items) => {
  // Réduit la liste d'articles pour calculer le montant total de la ligne de détail
  return items.reduce((acc, item) => {
    // Ajoute simplement le prix total de chaque article à l'accumulateur
    return acc + (parseFloat(item.totalPrice) || 0); // Utilise € 0 si le prix total n'est pas un nombre
  }, 0); // Initialise l'accumulateur à zéro
};

export const calculateTotalTVA = (totals) => {
  // Réduit les totaux par groupe de TVA pour calculer le montant total de la TVA
  const subtotalSum = Object.keys(totals).reduce((acc, vatPercentage) => {
    // Extrait le pourcentage de TVA de la clé et convertit en décimal
    const match = vatPercentage.match(/\d+/);
    const percentageDecimal = match ? parseFloat(match[0]) / 100 : 0;
    // Convertit le montant de la TVA en nombre
    const vatAmount = parseFloat(totals[vatPercentage]) || 0;
    // Calcule le montant de la TVA pour le groupe de TVA actuel
    const subtotal = percentageDecimal * vatAmount;
    // Ajoute le montant de la TVA à l'accumulateur
    return acc + subtotal;
  }, 0); // Initialise l'accumulateur à zéro
  
  // Formate le montant total de la TVA avec toujours deux chiffres après la virgule
  const formattedTotalTVA = subtotalSum.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1 ');
  
  // Renvoie le montant total de la TVA formaté
  return formattedTotalTVA;
};
