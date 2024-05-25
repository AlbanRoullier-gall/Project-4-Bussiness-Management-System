import React from 'react';
import { Box } from '@mui/system';
import { DataGrid } from '@mui/x-data-grid';
import { Link } from 'react-router-dom';
import useFetchInvoices from '../hooks/useFetchInvoices';
import { getStatusColor, calculateTotal } from '../containers/InvoiceFilterUtils';
import { getInvoiceDetails } from '../services/api';
import { useNavigate } from 'react-router-dom'; 

import './GridBill.css';

const GridBill = () => {
  const navigate = useNavigate(); 

  const handleRowClick = async (params) => {
    try {
      const invoiceDetails = await getInvoiceDetails(params.id);
      navigate(`/modificationfacture/${params.id}`, { state: invoiceDetails }); 
    } catch (error) {
      console.error('Erreur lors de la récupération des détails de la facture : ', error);
    }
  };
  
  const invoices = useFetchInvoices();

  const paidTotal = calculateTotal(invoices, 'Payée');
  const inProgressTotal = calculateTotal(invoices, 'En cours');
  const delayedTotal = calculateTotal(invoices, 'En retard');
  const accountingTotal = calculateTotal(invoices, 'En comptabilitée');


  const columns = [
    { field: 'invoice_number', headerName: 'REFERENCE', width: 160 },
    {
      field: 'customer_name',
      headerName: 'NOM CLIENT',
      sortable: false,
      width: 190,
      valueGetter: (params) => params.row.customer_name || '',
    },
    {
      field: 'customer_number',
      headerName: 'REFERENCE CLIENT',
      type: 'string',
      width: 220,
      editable: true,
    },
    {
      field: 'invoice_date',
      headerName: 'DATE DE CREATION',
      width: 220,
      editable: true,
      type: 'Date',
    },
    {
      field: 'due_date',
      headerName: 'ECHEANCE',
      width: 150,
      editable: true,
      type: 'Date',
    },
    {
      field: 'total_amount_exc_vat',
      headerName: 'MONTANT HTVA',
      width: 180,
      editable: true,
      type: 'number',
      valueFormatter: (params) => `€ ${params.value}`,
    },
    {
      field: 'flag_accounting',
      headerName: 'STATUT',
      headerAlign: 'center',
      width: 140,
      editable: true,
      type: 'string',
      sortable: false,
      renderCell: (params) => (
        <div
          style={{
            backgroundColor: getStatusColor(params.value),
            width: '100%',
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            color: 'white',
          }}
        >
          {params.value}
        </div>
      ),
    },
  ];

  return (
    <div className="data-grid-container">
      <Box sx={{ height: '78vh', overflow: 'auto' }}>
        <DataGrid
          rows={invoices}
          columns={columns}
          pagination
          disableRowSelectionOnClick
          onRowClick={handleRowClick}
        />
      </Box>
      <div className='ExtraInformation'>
        <Link to="/creationfacture"><button className='NewBillButton'>NOUVELLE FACTURE</button></Link>
        <div className='Disposition1'>
          <span>Payée</span>
          <strong className='Price'>€ {paidTotal.totalAmount.toFixed(2)}</strong>
          <span>{paidTotal.totalNumber}</span>
        </div>
        <div className='Disposition2'>
          <span>En cours</span>
          <strong className='Price'>€ {inProgressTotal.totalAmount.toFixed(2)}</strong>
          <span>{inProgressTotal.totalNumber}</span>
        </div>
        <div className='Disposition3'>
          <span>Retard</span>
          <strong className='Price'>€ {delayedTotal.totalAmount.toFixed(2)}</strong>
          <span>{delayedTotal.totalNumber}</span>
        </div>
        <div className='Disposition4'>
          <span>En comptabilitée</span>
          <strong className='Price'>€ {accountingTotal.totalAmount.toFixed(2)}</strong>
          <span>{accountingTotal.totalNumber}</span>
        </div>
      </div>
    </div>
  );
};

export default GridBill;
