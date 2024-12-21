import TeamEditorBlock from "../components/TeamEditorBlock";
import CommunityNavBar from "../components/CommunityNavBar";
import "./TeamEditor.css"
import team_av3 from "../assets/team_av4.jpg"
import { useLocation } from "react-router-dom";
import { requestAPI } from '../hooks/useAPI';
const TeamEditor = () => {
   
    const location = useLocation();
    const communityName = location.state || {};
    console.log("Community Name", communityName);
    async function handleExit(){
      const user=JSON.parse(localStorage.getItem('user'));
      const id = user.id;
      const { status, data } = await requestAPI(
        '/teams',
        'post',
        {
          body: {
            userId: id,
            CommunityName: communityName,
          }
        }
      );
      if (status > 199 && status < 300) {
        alert("You have successfully exited the team");
      } else {
        alert("Error exiting the team")
    }
  }
    return (
      <div>
        <CommunityNavBar />
          <div className="team_pic"> 
            <img src={ team_av3} alt="pho" height="250px" width="300px" />
             </div> 
            
        <div className="TEB">
          <TeamEditorBlock  com_name={communityName}/>
        </div>
        <button className="Exit" onClick={handleExit}>Exit from your team</button>
      </div>
    );
}
 
export default TeamEditor;