import React from 'react';
import './CommunityCard.css'; // Create a CSS file for the component if needed
import { Button, Card, CardBody, IconButton, Typography } from '@material-tailwind/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';

const CommunityCard = ({onDelete, onEdit, onClick, title, description, buttonText, number,color, bgColor, contestName, timeLeft }) => {
  return (
    <Card  className='w-48 h-48 text-left' style={{backgroundColor: bgColor+'3F' , border: `2px solid ${color}`}}>
      <CardBody className=' flex flex-col h-full justify-between' >
        <div>
        <Typography className='text-base font-bold text-gray-900'>{title}</Typography>
        <Typography className='text-base text-gray-600 overflow-hidden h-14' >{description}</Typography>
        </div>

        <div className='flex-grow'></div>

        <div className='flex justify-between gap-2'>
          <Button variant='filled' className="bg-primary" onClick={onClick}>{buttonText}</Button>
          {onEdit && <IconButton variant='text' onClick={onEdit}>
            <FontAwesomeIcon icon={faEdit} />
          </IconButton>}
          {onDelete && <IconButton variant='text' onClick={onDelete}>
            <FontAwesomeIcon icon={faTrash} color='red' />
          </IconButton>}
        </div>

      </CardBody>
    </Card>
  );
};

export default CommunityCard;