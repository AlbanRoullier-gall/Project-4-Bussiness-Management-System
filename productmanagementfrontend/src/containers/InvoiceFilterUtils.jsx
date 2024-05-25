export const getStatusColor = (flag_accounting) => {
    switch (flag_accounting) {
      case 'En cours':
        return '#FFB100';
      case 'Payée':
        return '#49D83D';
      case 'En comptabilitée':
        return '#173058';
      case 'En retard':
        return '#FF0000';
      default:
        return 'white';
    }
  };
  
export const filterInvoicesByStatus = (invoices, flag_accounting) => {
return invoices.filter((invoice) => invoice.flag_accounting === flag_accounting);
};

export const calculateTotal = (invoices, flag_accounting) => {
const filteredInvoices = filterInvoicesByStatus(invoices, flag_accounting);
const totalAmount = filteredInvoices.reduce(
    (accumulator, invoice) => accumulator + parseFloat(invoice.total_amount_exc_vat),
    0
);
const totalNumber = filteredInvoices.length;
return { totalAmount, totalNumber };
};
