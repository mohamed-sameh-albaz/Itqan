import { useParams } from "react-router-dom";
import './ProfilePage.css';
import CommunityNavBar from "../components/CommunityNavBar";
const ProfilePage = () => {
    const parm = useParams();

    return ( <div className="profile-page">
        <CommunityNavBar />
        <div className="profile-content">
        <div className="profile-header">
            <img src="https://avatar.iran.liara.run/public/boy" alt="profile" />
            <div className="prodile-description">
                <h3>{parm.name}</h3>
                <span>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</span>
            </div>
        </div>

        <h3>Rewards: </h3>
        <div className="profile-rewards"></div>

        <h3>Communities: </h3>
        <div className="profile-rewards"></div>

        </div>        

    </div> );
}
 
export default ProfilePage;