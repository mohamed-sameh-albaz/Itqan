import React from 'react';
import { Card } from 'react-bootstrap';
import './TeamCard.css';

const TeamCard = ({ team }) => {
  return (
    <Card className="mb-3">
      <Card.Body>
        <Card.Title>{team.name}</Card.Title>
        <Card.Text>
          <strong>Members:</strong>
          <ul>
            <li>{team.firstmem}</li>
            <li>{team.secondmem}</li>
            <li>{team.thirdmem}</li>
          </ul>
        </Card.Text>
      </Card.Body>
    </Card>
  );
};

export default TeamCard;