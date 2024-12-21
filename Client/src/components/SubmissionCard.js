// Client/src/components/SubmissionCard.js
import React from 'react';
//import './SubmissionCard.css';
const SubmissionCard = ({ question }) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-4 mb-4">
      <h3 className="text-xl font-bold mb-2">{question.title}</h3>
      <p className="text-gray-700 mb-4">{question.content}</p>
      <div className="flex justify-between items-center">
        <span className="text-gray-500">Points: {question.points}</span>
        <span className="text-gray-500">Type: {question.type}</span>
      </div>
    </div>
  );
};

export default SubmissionCard;