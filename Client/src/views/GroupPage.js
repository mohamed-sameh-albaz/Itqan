import CommunityNavBar from '../components/CommunityNavBar'
import ContestTable from '../components/ContestTable';
import { Button } from "@material-tailwind/react";

import './GroupPage.css'
import { useAPI } from '../hooks/useAPI';
import { useParams } from 'react-router-dom';
const GroupPage = () => {
    const parms = useParams();
    const communityName = parms.name;
    const groupID = parms.id;

    const contets = [
        {name: "Eco Systems", startDate: "11/28/2024 12: pm", duration: "3 days left",},
        {name: "Eco Systems", startDate: "11/28/2024 12: pm", duration: "3 days left",},
        {name: "Eco Systems", startDate: "11/28/2024 12: pm", duration: "3 days left",},
    ];

    const [upCommingResponse, isLoadingCpmming] = useAPI('/contests/status', 'get',
        {params:{
            community_name: communityName,
            group_id: 5,
            status: "upcoming"
        }});

    const upCommingContest = isLoadingCpmming? [] : upCommingResponse.data.contests;

    const [finishedResponse, isFinishedResponse] = useAPI('/contests/status', 'get',
        {params:{
            community_name: communityName,
            group_id: 5,
            status: "finished"
        }});
    const finishedContest = isFinishedResponse? [] : finishedResponse.data.contests;

    return ( <div>
        <CommunityNavBar/>
        <div className="content">
            <h3>Upcomming Contests:</h3>
            <ContestTable contests={upCommingContest}/>
            <div className="past-section">
                <h3>Past Contests:</h3>
                <ContestTable contests={finishedContest}/>
            </div>

        </div>

    </div> );
}
 
export default GroupPage;