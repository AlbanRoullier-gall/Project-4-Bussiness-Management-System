import * as React from 'react';
import TitleBanner from '../components/TitleBanner.jsx'
import Menu from '../components/Menu.jsx'
import SectionBannerBoard from '../components/SectionBannerBoard.jsx'
import Graph1 from '../components/Graph1.jsx'
import Graph2 from '../components/Graph2.jsx'
import DividerVertical from '../components/DividerVertical.jsx'

import './DashBoard.css';

const Dashboard = () => {
  return (
    <div className='dashBoardContainer'>
      <div>
        <TitleBanner/>
      </div>
      <div>
        <Menu/>
        <SectionBannerBoard/>
      </div>
      <div className='GraphPositioning'>
        <Graph1/>
        <DividerVertical length="50rem" />
        <Graph2/>
      </div>
    </div>
  );
};

export default Dashboard;
