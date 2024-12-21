// Client/src/views/SubmissionsPage.js
import React, { useState, useEffect } from 'react';
import SubmissionCard from '../components/SubmissionCard';
import { requestAPI } from '../hooks/useAPI';
import CommunityNavBar from '../components/CommunityNavBar';

const SubmissionsPage = () => {
  const [submissions, setSubmissions] = useState([{title: "title", content: "content", points: 0, type: "type"}]);

  // useEffect(() => {
  //   const fetchSubmissions = async () => {
  //     const { status, data } = await requestAPI('/submissions', 'get');
  //     if (status > 199 && status < 300) {
  //       setSubmissions(data.submissions);
  //     } else {
  //       console.error('Error fetching submissions');
  //     }
  //   };

  //   fetchSubmissions();
  // }, []);

  return (
    <div>
      <CommunityNavBar />
      <div className="container mx-auto mt-5">
        <h2 className="text-2xl font-bold mb-4">Submitted Questions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {submissions.map((submission, index) => (
            <SubmissionCard key={index} question={submission} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SubmissionsPage;