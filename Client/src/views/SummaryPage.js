import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import CommunityNavBar from "../components/CommunityNavBar";
import { faChalkboardTeacher, faUser } from "@fortawesome/free-solid-svg-icons";

const SummaryPage = () => {
    return ( <div>
        <CommunityNavBar />
        <div className="container mx-auto">
            <div className="flex justify-center">
                <div className="">
                    <FontAwesomeIcon icon={faChalkboardTeacher} />
                </div>
                <div className="">
                    <FontAwesomeIcon icon={faUser} />
                </div>
            </div>
        </div>
    </div> );
}
 
export default SummaryPage;