import TeamEditorBlock from "../components/TeamEditorBlock";
import CommunityNavBar from "../components/CommunityNavBar";
import "./TeamEditor.css"
import { useLocation } from "react-router-dom";
const TeamEditor = () => {
    const location = useLocation();
    const communityName = location.state || {};
    console.log("Community Name", communityName);
    return (

        <div>
            <CommunityNavBar/>
            <TeamEditorBlock />
            <button className="Exit">Exit from your team</button>

         </div>


      );
}
 
export default TeamEditor;