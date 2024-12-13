import React from 'react';
import './CommunityCard.css'; // Create a CSS file for the component if needed
import { Button, Card, Typography } from '@material-tailwind/react';

const CommunityCard = ({ onClick, title, description, buttonText, number,color, contestName, timeLeft }) => {
  return (
    <Card className='w-48 h-48 text-left' style={{border: `1px solid ${color}`}}>
      <Card.Body className=' flex flex-col h-full' >
        <Typography className='text-base font-bold text-gray-900'>{title}</Typography>
        <Typography className='text-base text-gray-600'>{description}</Typography>
        <div className='flex-grow'></div>
        <Button variant='filled' className="bg-primary" onClick={onClick}>{buttonText}</Button>
      </Card.Body>
    </Card>
  );
};

export default CommunityCard;