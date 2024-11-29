import React from 'react';
import './CommunityCard.css'; // Create a CSS file for the component if needed

const CommunityCard = ({ title, number, contestName, timeLeft }) => {
  return (
    <div className="community-card">
      <div className="card-header">
        <h3>{title}</h3>
        <div className="circle">{number}</div>
      </div>
      <div className="card-body">
        {/* Add any additional content here */}
      </div>
      <div className="card-foot">
        <div className="contest-info">
          <span className="contest-name">{contestName}</span>
          <span className="time-left">{timeLeft}</span>
        </div>
      </div>
    </div>
  );
};

export default CommunityCard;