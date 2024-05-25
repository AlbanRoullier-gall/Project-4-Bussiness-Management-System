import React from 'react';
import { BrowserRouter as Router,Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard.jsx';
import BillList from './pages/BillList.jsx';
import BillCreation from './pages/BillCreation.jsx';
import BillUpdate from './pages/BillUpdate.jsx';




const App = () => {
  return (
      <Router>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/facture" element={<BillList />} />
          <Route path="/creationfacture" element={<BillCreation />} />
          <Route path="/modificationfacture/:id" element={<BillUpdate />} />
        </Routes>
      </Router>
  );
};

export default App;
