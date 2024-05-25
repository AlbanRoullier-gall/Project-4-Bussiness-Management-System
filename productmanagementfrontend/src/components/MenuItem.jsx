import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './MenuItem.css';

const MenuItem = ({ icon, title, isActive, onClick, children }) => (
  <div className={`DropdownItem ${isActive ? 'active' : ''}`}>
    <button className="button" onClick={onClick}>
      <div className="icon">
        <FontAwesomeIcon icon={icon} />
      </div>
      <div className="title">
        <span>{title}</span>
      </div>
    </button>
    {isActive && (
      <div className="menu">
        {children}
      </div>
    )}
  </div>
);

export default MenuItem;
