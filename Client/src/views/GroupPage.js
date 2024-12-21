import CommunityNavBar from '../components/CommunityNavBar'
import ContestTable from '../components/ContestTable';
import { Button, Typography } from "@material-tailwind/react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAdd } from '@fortawesome/free-solid-svg-icons';
import './GroupPage.css'
import { useAPI } from '../hooks/useAPI';
import { useNavigate, useParams } from 'react-router-dom';
import useRole from '../hooks/useRole';
const GroupPage = () => {
    const parms = useParams();
    const nav = useNavigate();
    const communityName = parms.name;
    const groupID = parms.id;
    const {roleId} = useRole(parms.name)

    const [upCommingResponse, isLoadingCpmming, refreshUpcomming] = useAPI('/contests/status', 'get',
        {params:{
            group_id: groupID,
            status: "upcoming"
        }});

    const upCommingContest = isLoadingCpmming? [] : upCommingResponse.data.contests;

    const [finishedResponse, isFinishedResponse, refreshFinished] = useAPI('/contests/status', 'get',
        {params:{
            group_id: groupID,
            status: "finished"
        }});
    const finishedContest = isFinishedResponse? [] : finishedResponse.data.contests;

    return ( <div>
        <CommunityNavBar/>
        <div className="content">
            <h3>Upcomming Contests:</h3>
            <ContestTable contests={upCommingContest} refresh={refreshUpcomming}/>
            <div className="past-section">
                <h3>Past Contests:</h3>
                <ContestTable contests={finishedContest} refresh={refreshFinished}/>
            </div>

        </div>
        {(roleId == 2 || roleId == 1) && <div className='absolute w-full h-screen'>
            <div className="fixed bottom-2 right-2 rounded-full">
            <Button
                size="lg" 
                style={{backgroundColor: 'var(--primary-color)'} }
                onClick={()=>nav('create')} 
                >
                <FontAwesomeIcon icon={faAdd} size="2x" />
                <Typography variant='small'>Create<br/>Contest</Typography>
            </Button>
            </div>
        </div>}

    </div> );
}
 
export default GroupPage;