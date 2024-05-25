import axios from 'axios';

const BASE_URL = 'http://localhost:8000'; 

export const getAllCustomers = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/api/customers-list/`);
    return response.data;
  } catch (error) {
    throw new Error('Erreur lors de la récupération des clients : ' + error.message);
  }
};

export const getAllPaymentTerms = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/api/payment-terms-list/`);
    return response.data;
  } catch (error) {
    throw new Error('Erreur lors de la récupération des conditions de paiement : ' + error.message);
  }
};

export const getAllVatTypes = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/api/vat_types-list/`);
    return response.data;
  } catch (error) {
    throw new Error('Erreur lors de la récupération des types de TVA : ' + error.message);
  }
};


export const getAllInvoices = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/api/invoices-list/`);
    return response.data.map((invoice) => ({
      id: invoice.invoice_number,
      invoice_number: invoice.invoice_number,
      customer_name: invoice.customer.customer_name,
      customer_number: invoice.customer.customer_number,
      invoice_date: invoice.invoice_date,
      due_date: invoice.due_date,
      total_amount_exc_vat: invoice.total_amount_exc_vat,
      flag_accounting: invoice.flag_accounting,
    }));
  } catch (error) {
    throw new Error('Erreur lors de la récupération des factures : ' + error.message);
  }
};

export const saveInvoiceToDatabase = async (invoiceData) => {
  try {
      const response = await axios.post(`${BASE_URL}/api/save-invoice/`, invoiceData);
      return response.data;
  } catch (error) {
      throw new Error('Erreur lors de la sauvegarde de la facture : ' + error.message);
  }
};

export const updateInvoice = async (invoice_number, updatedData) => {
  try {
    await axios.put(`${BASE_URL}/api/update_invoice/${invoice_number}/`, updatedData);
    console.log('Facture mise à jour avec succès');
  } catch (error) {
    throw new Error('Erreur lors de la mise à jour de la facture : ' + error.message);
  }
};

export const getInvoiceDetails = async (invoiceId) => {
  try {
    const response = await axios.get(`${BASE_URL}/api/invoice/${invoiceId}/`);
    const invoiceDetails = response.data;

    const invoice_date = new Date(invoiceDetails.invoice_date).toISOString();

    return {
      customer_id: invoiceDetails.customer_id,
      invoice_number: invoiceDetails.invoice_number,
      invoice_date: invoice_date, 
      due_date: invoiceDetails.due_date,
      total_amount_exc_vat: invoiceDetails.total_amount_exc_vat,
      total_amount_vat: invoiceDetails.total_amount_vat,
      discount_total: invoiceDetails.discount_total,
      flag_accounting: invoiceDetails.flag_accounting,
      communication: invoiceDetails.communication,
      structured_communication: invoiceDetails.structured_communication,
      uploaded_file_file_url: invoiceDetails.uploaded_file_url,
      uploaded_file_file_id: invoiceDetails.uploaded_file_id,
      invoice_items: invoiceDetails.invoice_items.map((item) => ({
        uuid: item.uuid, 
        item_id: item.item_id,
        quantity: item.quantity,
        price: item.price,
        purchase_price: item.purchase_price,
        discount: item.discount,
        vat_value: item.vat_value,
        vat_type_id: item.vat_type_id,
        supplier_number: item.supplier_number,  
        product_description: item.product_description, 
      })),
    };
  } catch (error) {
    throw new Error('Erreur lors de la récupération des détails de la facture : ' + error.message);
  }
};


export const getAllItems = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/api/items-list/`);
    return response.data;
  } catch (error) {
    throw new Error('Erreur lors de la récupération des produits : ' + error.message);
  }
};

export const uploadFile = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await axios.post(`${BASE_URL}/api/upload-file/`, formData);
    console.log('File uploaded successfully:', response.data);
    return { id: response.data.id, fileURL: response.data.file }; 
  } catch (error) {
    throw new Error('Erreur lors de l\'upload du fichier : ' + error.message);
  }
};

export const deleteFile = async (fileId) => {
  try {
    await axios.delete(`${BASE_URL}/api/delete-file/${fileId}`);
  } catch (error) {
    throw new Error('Erreur lors de la suppression du fichier : ' + error.message);
  }
};

