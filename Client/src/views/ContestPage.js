import CommunityNavBar from "../components/CommunityNavBar";
import ContestScreen from "../components/ContestScreen";
import "./ContestPage.css";
const ContestPage = () => {
    return (
      <div>
            <CommunityNavBar />
            <ContestScreen/>
        <div className="keep">
             Keep Going
        </div>
        <button className="submitt">Submit</button>
        
      </div>
    );
    
}
 
export default ContestPage;