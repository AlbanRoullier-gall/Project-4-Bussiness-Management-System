import * as React from 'react';
import TitleBanner from '../components/TitleBanner.jsx'
import Menu from '../components/Menu.jsx'
import SectionBannerBill from '../components/SectionBannerBill.jsx'
import GridBill from '../components/GridBill.jsx'
import './BillList.css';

const BillList = () => {
  return (
    <div className='billContainer'>
      <div>
        <TitleBanner></TitleBanner>
      </div>
      <div>
        <Menu></Menu>
      </div>
      <div>
        <SectionBannerBill></SectionBannerBill>
        <div className='agencement'>
          <GridBill></GridBill>
        </div> 
      </div>
    </div>
  );
};

export default BillList;
