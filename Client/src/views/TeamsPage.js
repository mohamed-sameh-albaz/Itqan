// import React from 'react';
// import CommunityNavBar from '../components/CommunityNavBar';
// import TeamCard from '../components/TeamCard';
// import './TeamsPage.css';

// const TeamsPage = () => {
//   const teams = [
//     {
//       name: 'omda',
//       firstmem: 'gimy',
//       secondmem: 'sameh',
//       thirdmem: 'zoz',
//     },
//     {
//       name: 'omda',
//       firstmem: 'gimy',
//       secondmem: 'sameh',
//       thirdmem: 'zoz',
//     },
//     {
//       name: 'omda',
//       firstmem: 'gimy',
//       secondmem: 'sameh',
//       thirdmem: 'zoz',
//     },
//   ];

//   return (
//     <div>
//       <CommunityNavBar />
//       <div className="container mt-5">
//         {teams.map((team, index) => (
//           <TeamCard key={index} team={team} />
//         ))}
//       </div>
//     </div>
//   );
// };

// export default TeamsPage;



import CommunityNavBar from "../components/CommunityNavBar";
import TeamTable from "../components/TeamTable";
import team_av2 from "../assets/team_av3.jpg"
import "./TeamsPage.css"

const TeamsPage = () => {

  const teams = [
    {
      name: "omda",
      firstmem: "gimy",
      secondmem: "sameh",
      thirdmem: "zoz",
    },
    {
      name: "omda",
      firstmem: "gimy",
      secondmem: "sameh",
      thirdmem: "zoz",
    },
    {
      name: "omda",
      firstmem: "gimy",
      secondmem: "sameh",
      thirdmem: "zoz",
    }
  ];
    

    return (
      <div className="TB_all">
        <CommunityNavBar />
        <div className="team_pic"> 
                <img src={ team_av2} alt="pho" height="250px" width="300px" />
         </div> 
        <div className="teamtable">
          <TeamTable teams={teams} />
        </div>
      </div>
    );
}
 
export default TeamsPage;

