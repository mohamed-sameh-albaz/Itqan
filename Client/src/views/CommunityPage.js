import { useNavigate, useParams } from 'react-router-dom';
import CommunityCard from '../components/CommunityCard'
import CommunityNavBar from '../components/CommunityNavBar';
import ContestTable from '../components/ContestTable';
import './CommunityPage.css'
import {requestAPI, useAPI} from '../hooks/useAPI';
import { useRef, useState } from 'react';
import { Alert, Avatar, Button, Card, CardBody, Dialog, DialogBody, DialogFooter, DialogHeader, Option, Select, Spinner, Typography } from '@material-tailwind/react';
import CreateGroupDialog from '../dialogs/CreateGroup';

const TeamCard = ({ communityName, userID }) => {
  const nav = useNavigate();
  const [data, loading] = useAPI('/teams', 'get', { params: { community_name: communityName, user_id: userID } });

  const teamData = loading ? null : data.data.team_users;
  return (
    <Card className="flex w-48 text-left h-32" color='white'>
      {loading ? <Spinner className='m-auto' /> : teamData == null ?
        <Button variant='text' className='m-auto' style={{ color: "var(--primary-color)" }} onClick={() => nav("/team/create", { state: communityName })}>Create Team</Button> :
        <CardBody >
          <div className="header flex justify-between">
            <Typography>Algo Allies</Typography>
            <a href=''>Edit</a>
          </div>

          <div className="gap-2 mt-2">
            {teamData.map((x) => <Avatar
              src={teamData.photo}
              alt="Profile" />)}
          </div>
        </CardBody>}
    </Card>);
}

const UserFinderDialog = ({ open, onClose, isLoadingUsers, usersResponse }) => {
    const Header = ['Username', 'Role', 'Email'];
    return (
        <Dialog open={open} onClose={onClose}>
            <DialogHeader>Members</DialogHeader>
            <DialogBody>
                <table className='mt-4 w-full min-w-max table-auto text-left'>
                    <thead>
                        <tr>
                            {Header.map((x) =>
                                <th className='border-y border-blue-gray-100 bg-blue-gray-50/50 p-4'>{x}</th>)}
                        </tr>
                    </thead>
                    <tbody>
                        {(isLoadingUsers ? [] : usersResponse.data.users).map((x) =>
                            <tr>
                                <td className='flex flex-row items-center'> 
                                    <Avatar className='border border-gray-600' src={x.photo}></Avatar>
                                    <Typography>{x.fname + " " + x.lname}</Typography>
                                </td>
                                <td><div className=''>
                                    <Select style={{}} >
                                        <Option>Admin</Option>
                                        <Option>Creator</Option>
                                        <Option>Member</Option>
                                    </Select>
                                    </div>
                                </td>
                                <td>{x.email}</td>
                            </tr>)}
                    </tbody>
                </table>
            </DialogBody>
            <DialogFooter>
                <Button
                    variant="text"
                    color="red"
                    onClick={onClose}
                    className="mr-1"
                >
                    <span>Cancel</span>
                </Button>
                <Button variant="gradient" color="green" onClick={onClose}>
                    <span>Confirm</span>
                </Button>
            </DialogFooter>
        </Dialog>
    );
}

const ConfirmDialog = ({ open, onClose, onConfirm, title, choice1, choice2}) => {
    const [waiting, setWaiting] = useState(false);

    async function handleConfirm(){
        setWaiting(true);
        await onConfirm();
        setWaiting(false);
    }

    return (<Dialog open={open} onClose={onClose}>
        <DialogHeader>{title}</DialogHeader>
        <DialogFooter>
            <Button variant='outlined' onClick={onClose}>{choice1}</Button>
            <Button loading={waiting} variant='filled' onClick={()=>handleConfirm()}>{choice2}</Button>
        </DialogFooter>
        </Dialog>);
}

const CommunityPage = () => {
    const parms = useParams();
    const nav = useNavigate();
    
    const user = JSON.parse(localStorage.getItem('user'));
    const communityName = parms.name;
    const [groupCreator, setgroupCreator] = useState(false);
    const [userFinder, setUserFinder] = useState(false);

    const [confirmJoinGroup, setConfirmJoinGroup] = useState(false);
    const currentGroupId = useRef(null);
    const [alertMessage, setAlertMessage] = useState(null);

    function handleGroupCreator(state) {
        if(!state)
            refreshGroup();

        setgroupCreator(state);
    }

    
    const [groups, isLoadingGroups, refreshGroup] = useAPI('/communities/groups', 'get', {params: {community_name: parms.name, userId:user.id}});
    const [usersResponse, isLoadingUsers] = useAPI('/communities/users', 'get', {params: {community_name: parms.name, page: 1, limit: 10}});

    const [upCommingContestRes, isLoadingUpCommingContestRes] = useAPI('/contests/status', 'get',
        {params:{
            community_name: communityName,
            status: "upcoming"
        }});
    const upCommingContest = upCommingContestRes==null? [] : upCommingContestRes.data.contests;

    function enterGroup(groupName, joined){
        //JOINED remove this later
        joined = true;
        currentGroupId.current = groupName;
        if(joined === true){
            nav(`/community/${communityName}/group/${currentGroupId.current}`);
            return
        }else{
            setConfirmJoinGroup(true);
        }
    }
    
    async function requestJoinGroupByID(group){
        const {data, status} = await requestAPI('/groups/join', 'post', {body: {userId: user.id, groupId: currentGroupId.current}});
        if(status > 199 && status < 300){
            enterGroup(group, true);
        }
        else{
            setAlertMessage("Failed to join Group");
        }
        setConfirmJoinGroup(false);
    }

    const Header = ['Username', 'Role', 'Email'];
    return ( 
    <div>
        <Alert className='fixed w-30 bottom-3 right-3' open={alertMessage != null} onClose={() => setAlertMessage(null)}>{alertMessage}</Alert>
        <CommunityNavBar />
        <Button onClick={()=>setgroupCreator(true)}>Create Contest</Button>
        <Button onClick={()=>setUserFinder(true)}>All Users</Button>
        <CreateGroupDialog communityName={communityName} open={groupCreator} setOpen={handleGroupCreator} setAlert={setAlertMessage} />
        <UserFinderDialog open={userFinder} onClose={() => setUserFinder(false)} isLoadingUsers={isLoadingUsers} usersResponse={usersResponse} />
        <ConfirmDialog open={confirmJoinGroup} onClose={()=>setConfirmJoinGroup(false)} onConfirm={requestJoinGroupByID} title="Are you sure you want to join this group?" choice1="Cancel" choice2="Join" />
        <div className="content">
            <h3>Upcomming Contests</h3>
            <ContestTable contests={upCommingContest} />

            <div className="row">

            
                <div className='groups-section'>
                    <h3>You Groups</h3>
                    <div className="groups-grid">
                        {(isLoadingGroups? [] : groups.data.groups).map((e,index)=>
                        <CommunityCard
                            key={e.title}
                            title={e.title}
                            description={e.description}
                            number={index}
                            buttonText={ (e.joined === true)? "View" : "Join"}
                            color= {null}
                            onClick={()=>enterGroup(e.id, e.joined)}/>
                            )}
                    </div>
                </div>

                <div className="team-section">
                    <h3>Your Team:</h3>
                    <TeamCard communityName={communityName} userID={user.id} />
                </div>
            </div>
        </div>
    </div> );
}
 
export default CommunityPage;