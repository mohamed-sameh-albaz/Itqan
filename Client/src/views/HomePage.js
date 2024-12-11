import React, { useState } from "react";
import "./HomePage.css"; // Make sure to import the CSS file
import CommunityCard from "../components/CommunityCard"; // Import the new component
import HomeNavBar from "../components/HomeNavBar"; // Import the HomeNavBar component
import useAPI from "../hooks/useAPI";

const HomePage = () => {
  const [viewAll, setViewAll] = useState(false);

  const [allCommunities, isAllCommunitiyLoading] = useAPI('/communities', 'get');
  const [userCommunities, isUserCommunitiyLoading] = useAPI('/communities/user', 'get', {params: {userId: 1}});
  //TODO: Only start loading when all is clicked

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
          {(viewAll? (isAllCommunitiyLoading? [] : allCommunities.communities ?? []) : (isUserCommunitiyLoading? [] : userCommunities.userCommunities ?? [])).map((community, index)=> <CommunityCard
          key={index}
            title={community.name}
            number={index}
          />)}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
