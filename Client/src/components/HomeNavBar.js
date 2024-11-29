import React from 'react';
import './HomeNavBar.css'; // Create a CSS file for the component if needed

const HomeNavBar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-main">
        <span>اتـــقــــــــــــــــان</span>
        <div className="level-view">
          <div className="level-indecator">3</div>
          1200
        </div>
      </div>
      <div className="profile-container">
        <img
          src="https://avatar.iran.liara.run/public/boy"
          alt="Profile"
          className="profile-pic"
        />
        <span className="profile-name">Welcome back, John Doe</span>
      </div>
      {/* Other nav items */}
    </nav>
  );
};

export default HomeNavBar;