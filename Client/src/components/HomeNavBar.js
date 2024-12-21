import React from 'react';
import './HomeNavBar.css'; // Create a CSS file for the component if needed
import { useNavigate } from 'react-router-dom';
import { Button } from '@material-tailwind/react';

const HomeNavBar = ({userName}) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const nav = useNavigate();
  return (
    <nav className="home-navbar">
      <div className="navbar-main">
        <span>اتـــقــــــــــــــــان</span>
        <div className='flex gap-2'>
        <div className="level-view flex  items-center">
            <div className="level-indecator ">{user.level_name.split(' ')[1]}</div>
            <div className=''>{user.points}</div>
        </div>
          <Button variant='text' color='white' className='ml-3' onClick={()=>{localStorage.removeItem('user'); nav('/')}}>Logout</Button>
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