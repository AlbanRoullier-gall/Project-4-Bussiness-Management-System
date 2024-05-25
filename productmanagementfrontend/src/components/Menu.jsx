import React, { useState } from 'react';
import MenuItem from './MenuItem';
import { Link } from 'react-router-dom'; 

import './Menu.css';
import { menuItemsData } from './MenuItemsData';

const Menu = () => {
  const [activeMenu, setActiveMenu] = useState(null);

  const handleMenuClick = (menu) => {
    setActiveMenu(menu === activeMenu ? null : menu);
  };

  return (
    <div className='Container-Category'>
      <div className="MenuGroup">
        {menuItemsData.map((menuItem, index) => (
          <MenuItem
            key={index}
            icon={menuItem.icon}
            title={menuItem.title} 
            isActive={menuItem.id === activeMenu}
            onClick={() => handleMenuClick(menuItem.id)}>
            {menuItem.links.map((link, linkIndex) => (
              <Link key={linkIndex} to={link.to} className='option'>{link.label}</Link>
            ))}
          </MenuItem>
        ))}
      </div>
    </div>
  );
};

export default Menu;
