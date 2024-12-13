import React from 'react';
import './HomeNavBar.css'; // Create a CSS file for the component if needed
import { useNavigate } from 'react-router-dom';

const HomeNavBar = ({userName}) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const nav = useNavigate();
  return (
    <nav className="home-navbar">
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
          onClick={() => nav(`/profile/${user.id}`)}
        />
        <span className="profile-name">Welcome back, {userName}</span>
      </div>
      {/* Other nav items */}
    </nav>
  );
};

export default HomeNavBar;