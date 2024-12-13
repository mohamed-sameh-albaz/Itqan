import { useParams } from 'react-router-dom';
import CommunityCard from '../components/CommunityCard'
import CommunityNavBar from '../components/CommunityNavBar';
import ContestTable from '../components/ContestTable';
import './CommunityPage.css'
import {useAPI} from '../hooks/useAPI';

const CommunityPage = () => {
    const parms = useParams();

    const [groups, isLoadingGroups] = useAPI('/communities/groups', 'get', {params: {community_name: parms.name}});

    // const groups = [
    //     "Logic Design",
    //     "Algorithm Design",
    //     "Numerical Analysis",
    //     "Logic Design",
    //     "Algorithm Design",
    //     "Numerical Analysis"
    //   ];

    const contets = [
        {name: "Eco Systems", startDate: "11/28/2024 12: pm", duration: "3 days left",},
        {name: "Eco Systems", startDate: "11/28/2024 12: pm", duration: "3 days left",},
        {name: "Eco Systems", startDate: "11/28/2024 12: pm", duration: "3 days left",},
    ];

    return ( 
    <div>
        <CommunityNavBar />
        <div className="content">
            <h3>Upcomming Contests</h3>
            <ContestTable contests={contets} />

            <div className="row">

            
                <div className='groups-section'>
                    <h3>You Groups</h3>
                    <div className="groups-grid">
                        {(isLoadingGroups? [] : groups.groups).map((e,index)=><CommunityCard title={e.title}/>)}
                    </div>
                </div>

                <div className="team-section">
                    <h3>Your Team:</h3>
                    <div className="team-card">
                        <div className="header">
                            <span>Algo Allies</span>
                            <a href=''>Edit</a>
                        </div>

                        <div className="members">
                        <img
                        src="https://avatar.iran.liara.run/public"
                        alt="Profile"/>
                        <img
                        src="https://avatar.iran.liara.run/public"
                        alt="Profile"/>
                        <img
                        src="https://avatar.iran.liara.run/public"
                        alt="Profile"/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div> );
}
 
export default CommunityPage;