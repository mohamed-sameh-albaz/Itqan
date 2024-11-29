import React, { useState } from "react";
import "./HomePage.css"; // Make sure to import the CSS file
import CommunityCard from "../components/CommunityCard"; // Import the new component
import HomeNavBar from "../components/HomeNavBar"; // Import the HomeNavBar component

const HomePage = () => {
  const [viewAll, setViewAll] = useState(false);

  const communities = [
    "Logic Design",
    "Algorithm Design",
    "Numerical Analysis"
  ];

  const AllCommunities = [
    "Logic Design",
    "Algorithm Design",
    "Numerical Analysis",
    "Database Managment System"
  ];

  function toggleAll(){
    setViewAll(!viewAll);
  }

  return (
    <div>
      <HomeNavBar />
      <div className="content">
        <div className="all-btn" onClick={toggleAll}>
          {viewAll ? "My" : "All"}
        </div>
        <h2>Your communities</h2>
        <div className="community-grid">
          <CommunityCard
            title="Community Title"
            number="0"
            contestName="Contest Name"
            timeLeft="Time Left"
          />
          {(viewAll? AllCommunities : communities).map((title, index)=> <CommunityCard
            title={title}
            number={index}
          />)}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
