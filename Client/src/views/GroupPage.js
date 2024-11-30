import CommunityNavBar from '../components/CommunityNavBar'
import ContestTable from '../components/ContestTable';

import './GroupPage.css'
const GroupPage = () => {
    const contets = [
        {name: "Eco Systems", startDate: "11/28/2024 12: pm", duration: "3 days left",},
        {name: "Eco Systems", startDate: "11/28/2024 12: pm", duration: "3 days left",},
        {name: "Eco Systems", startDate: "11/28/2024 12: pm", duration: "3 days left",},
    ];

    return ( <div>
        <CommunityNavBar/>

        <div className="content">
            <h3>Upcomming Contests:</h3>
            <ContestTable contests={contets}/>
            <div className="past-section">
                <h3>Past Contests:</h3>
                <ContestTable contests={contets}/>
            </div>

        </div>

    </div> );
}
 
export default GroupPage;