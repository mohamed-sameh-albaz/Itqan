import TeamEditorBlock from "../components/TeamEditorBlock";
import CommunityNavBar from "../components/CommunityNavBar";
import "./TeamEditor.css"
const TeamEditor = () => {
    return (

        <div>
            <CommunityNavBar/>
            <TeamEditorBlock />
            <button className="Exit">Exit from your team</button>

         </div>


      );
}
 
export default TeamEditor;