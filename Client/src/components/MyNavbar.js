import React from 'react';
import './HomeNavBar.css'; // Create a CSS file for the component if needed
import { useNavigate } from 'react-router-dom';
import { Button } from '@material-tailwind/react';

const HomeNavBar = ({userName}) => {
  const nav = useNavigate();
  return (
    <nav className="home-navbar p-0 " style={{backgroundColor: 'var(--primary-color)'}}>
      <div className="navbar-main">
        <span>اتـــقــــــــــــــــان</span>
        <div className='flex gap-2'>
          <Button  color='white' className='ml-3' onClick={()=>{nav('/auth')}}>LogIn</Button>
        </div>
      </div>
    </nav>
  );
};

export default HomeNavBar;