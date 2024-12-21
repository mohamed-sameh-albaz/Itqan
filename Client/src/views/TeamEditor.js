import TeamEditorBlock from "../components/TeamEditorBlock";
import CommunityNavBar from "../components/CommunityNavBar";
import "./TeamEditor.css"
import team_av3 from "../assets/team_av4.jpg"
import { useLocation } from "react-router-dom";
const TeamEditor = () => {
   
    const location = useLocation();
    const communityName = location.state || {};
    console.log("Community Name", communityName);
    return (
      <div>
        <CommunityNavBar />
          <div className="team_pic"> 
            <img src={ team_av3} alt="pho" height="250px" width="300px" />
             </div> 
            
        <div className="TEB">
          <TeamEditorBlock  com_name={communityName}/>
        </div>
        <button className="Exit">Exit from your team</button>
      </div>
    );
}
 
export default TeamEditor;