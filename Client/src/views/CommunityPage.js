import { useNavigate, useParams } from 'react-router-dom';
import CommunityCard from '../components/CommunityCard'
import CommunityNavBar from '../components/CommunityNavBar';
import ContestTable from '../components/ContestTable';
import './CommunityPage.css'
import {requestAPI, useAPI} from '../hooks/useAPI';
import { useEffect, useRef, useState } from 'react';
import { Alert, Avatar, Button, Card, CardBody, Dialog, DialogBody, DialogFooter, DialogHeader, IconButton, Option, Select, Spinner, Typography } from '@material-tailwind/react';
import CreateGroupDialog from '../dialogs/CreateGroup';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAdd, faBan } from '@fortawesome/free-solid-svg-icons';
import useUser from '../hooks/useUser';
import { set } from 'date-fns';
import useRole from '../hooks/useRole';
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

const RoleSelector = ({userID, initRole = 3, roles = []}) => {
    const parms = useParams();

    const {canAdmin} = useRole(parms.name);
    const user = useUser();
    const [selectedRole, setSelectedRole] = useState(initRole);
    const [loading, setLoading] =   useState(false);

    async function handleUpdateRole(roleId) {
        const oldRole = selectedRole;

        setLoading(true);
        setSelectedRole(roleId)
        const {status, data} = await requestAPI('/communities/users/promote','patch', {body:{userId:userID, roleId, communityName: parms.name}});
        if(status > 199 && status < 300){
            console.log("Role updated");
        }else{
            setSelectedRole(oldRole);
        }
        setLoading(false);
    }

    return (
        <div>
            {loading ? <Spinner /> :
        <select 
            value={selectedRole}
            onChange={(e)=>handleUpdateRole(e.target.value)}
            className='font-bold p-2 rounded-full'
            disabled={loading || user.id == userID || !canAdmin}
            style={{
                borderWidth: 1,
                borderStyle:'solid',
                borderColor: roles.find((x)=>x.id==selectedRole)?.color || 'blue',
                backgroundColor: roles.find((x)=>x.id==selectedRole)?.color + '2F' || 'blue',
                outlineColor: roles.find((x)=>x.id==selectedRole)?.color || 'blue'
            }}
            >
        {roles.map((e, index) => 
            <option className='font-bold' key={index} value={e.id} style={{ color: e.color }}>
                {e.name.toUpperCase()}
            </option>)}
        </select>}
        </div>

    )
}

function UserFinderElement({user, roles}) {
    return (
        <tr>
            <td className='flex flex-row items-center gap-3'> 
                <Avatar className='border border-gray-600' src={user.photo}></Avatar>
                <Typography >{user.fname + " " + user.lname}</Typography>
            </td>
            <td><div className=''>
                <RoleSelector userID={user.id} roles={roles} initRole={user.role_id} />
                </div>
            </td>
            <td>{user.email}</td>
            <td>
                <IconButton variant='text'>
                    <FontAwesomeIcon icon={faBan} color='red'/>
                </IconButton>
            </td>
        </tr>
    )
}

const UserFinderDialog = ({ open, onClose}) => {
    const parms = useParams();
    const [usersResponse, isLoadingUsers] = useAPI('/communities/users', 'get', {params: {community_name: parms.name, page: 1, limit: 10}});

    const [roles, setRoles] = useState([]);
    async function getRoles(params) {
        const {data, status} = await requestAPI('/roles', 'get', {params: {page: 1, limit: 10}});

        if(status > 199 && status < 300){
            setRoles(data.data.roles);
        }else{
            console.log("Error loading roles");
        }
    }
    useEffect(()=>{
        getRoles();
    }, [])

    function getRoleById(){

    }

    // const roles = rolesResponse?.data?.roles || [];
    const Header = ['Username', 'Role', 'Email'];
    return (
        <Dialog size='xl' open={open} onClose={onClose}>
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
                            <UserFinderElement user={x} roles={roles} />)}
                    </tbody>
                </table>
            </DialogBody>
            <DialogFooter>
                {/* <Button
                    variant="text"
                    onClick={onClose}
                    className="mr-1"
                >
                    <span>Done</span>
                </Button> */}
                <Button style={{backgroundColor:'var(--primary-color)'}} onClick={onClose}>
                    <span>Done</span>
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

    const [upCommingContestRes, isLoadingUpCommingContestRes, refreshUpcomming] = useAPI('/contests/status', 'get',
        {params:{
            community_name: communityName,
            status: "upcoming",
            limit: 5
        }});
    const upCommingContest = upCommingContestRes==null? [] : upCommingContestRes.data.contests;

    function enterGroup(groupName, joined){
        //JOINED remove this later
        currentGroupId.current = groupName;
        if(joined === true){
            nav(`/community/${communityName}/group/${groupName}`);
            return
        }else{
            setConfirmJoinGroup(true);
        }
    }
    
    async function requestJoinGroupByID(group){
        const {data, status} = await requestAPI('/groups/join', 'post', {body: {userId: user.id, groupId: currentGroupId.current}});
        if(status > 199 && status < 300){
            enterGroup(currentGroupId.current, true);
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
        <Card className='width-full min-h-28 m-8'>
            <CardBody className='gap-3'>
            <Button onClick={()=>setUserFinder(true)}>All Users</Button>
            <Button onClick={()=>setUserFinder(true)}>View Summary Stats</Button>
            <Button onClick={()=>setUserFinder(true)}>View Detailed Stats</Button>
            </CardBody>
        </Card>
        <CreateGroupDialog communityName={communityName} open={groupCreator} setOpen={handleGroupCreator} setAlert={setAlertMessage} />
        <UserFinderDialog open={userFinder} onClose={() => setUserFinder(false)} />
        <ConfirmDialog open={confirmJoinGroup} onClose={()=>setConfirmJoinGroup(false)} onConfirm={requestJoinGroupByID} title="Are you sure you want to join this group?" choice1="Cancel" choice2="Join" />
        <div className="content">
            <h3>Upcomming Contests</h3>
            <ContestTable contests={upCommingContest} refresh={refreshUpcomming} />

            <div className="row">

            
                <div className='groups-section'>
                    <h3>You Groups</h3>
                    <div className="groups-grid">
                        <Card className='w-48 h-48 text-left' variant="filled" shadow="hover" onClick={()=>setgroupCreator(true)} >
                            <Card.Body className='cursor-pointer select-none flex flex-col h-full text-center justify-center' >
                            <FontAwesomeIcon icon={faAdd} color="black" size="3x" className="text-gray-700"/>
                            <Typography className="text-gray-800 font-bold">Create new group</Typography>
                            </Card.Body>
                        </Card>
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
        {/* <div className='absolute w-full h-screen'>
            <div className="fixed bottom-2 right-2 rounded-full">
            <Button 
                size="lg" 
                style={{backgroundColor: 'var(--primary-color)'} }
                onClick={()=>setgroupCreator(true)} 
                >
                <FontAwesomeIcon icon={faAdd} size="2x" />
                <Typography variant='small'>Create<br/>Group</Typography>
            </Button>
            </div>
        </div> */}

    </div> );
}
 
export default CommunityPage;