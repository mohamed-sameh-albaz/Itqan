import { useNavigate, useParams } from 'react-router-dom';
import CommunityCard from '../components/CommunityCard'
import CommunityNavBar from '../components/CommunityNavBar';
import ContestTable from '../components/ContestTable';
import './CommunityPage.css'
import {useAPI} from '../hooks/useAPI';
import { useState } from 'react';
import { Avatar, Button, Dialog, DialogBody, DialogFooter, DialogHeader } from '@material-tailwind/react';

const CommunityPage = () => {
    const parms = useParams();

    const nav = useNavigate();
    const [userFinder, setUserFinder] = useState(false);

    const [groups, isLoadingGroups] = useAPI('/communities/groups', 'get', {params: {community_name: parms.name}});
    function handleOpen() {
        setUserFinder(false);
    }
    const [usersResponse, isLoadingUsers] = useAPI('/communities/users', 'get', {params: {community_name: parms.name, page: 1, limit: 10}});

    const contets = [
        {name: "Eco Systems", startDate: "11/28/2024 12: pm", duration: "3 days left",},
        {name: "Eco Systems", startDate: "11/28/2024 12: pm", duration: "3 days left",},
        {name: "Eco Systems", startDate: "11/28/2024 12: pm", duration: "3 days left",},
    ];
    const Header = ['Username', 'Role', 'Email'];
    return ( 
    <div>
        <CommunityNavBar />
        <Button onClick={()=>nav("/contest")}>Create Contest</Button>
        <Button onClick={()=>setUserFinder(true)}>All Users</Button>
        <Dialog open={userFinder} onClose={()=>setUserFinder(false)} >
            <DialogHeader>Members</DialogHeader>
            <DialogBody>
                <table className='mt-4 w-full min-w-max table-auto text-left'>
                    <thead>
                        <tr>
                        {Header.map((x)=>
                        <th className='border-y border-blue-gray-100 bg-blue-gray-50/50 p-4'>{x}</th>)} 
                        </tr>
                    </thead>
                    <tbody>
                        {(isLoadingUsers? [] : usersResponse.data.users).map((x)=>
                            <tr>
                            <td><Avatar src={x.photo}></Avatar></td>
                            <td>{x.fname + " " + x.lname}</td>
                            <td>{x.email}</td>
                            </tr>)}
                    </tbody>
                </table>
            </DialogBody>
            <DialogFooter>
                <Button
                variant="text"
                color="red"
                onClick={handleOpen}
                className="mr-1"
                >
                <span>Cancel</span>
                </Button>
                <Button variant="gradient" color="green" onClick={handleOpen}>
                <span>Confirm</span>
                </Button>
            </DialogFooter>
        </Dialog>
        <div className="content">
            <h3>Upcomming Contests</h3>
            <ContestTable contests={contets} />

            <div className="row">

            
                <div className='groups-section'>
                    <h3>You Groups</h3>
                    <div className="groups-grid">
                        {(isLoadingGroups? [] : groups.data.groups).map((e,index)=><CommunityCard title={e.title}/>)}
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