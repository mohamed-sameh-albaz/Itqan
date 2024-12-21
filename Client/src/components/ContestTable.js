import { Button, IconButton, Typography } from '@material-tailwind/react';
import './ContestTable.css'
import { format, differenceInDays, differenceInHours, differenceInMinutes, differenceInSeconds, isWithinInterval, set } from 'date-fns';
import { useNavigate, useNavigation, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faListCheck, faPeopleGroup, faTrash, faUser } from '@fortawesome/free-solid-svg-icons';
import {ConfirmDialog} from '../dialogs/ConfirmDialog'
import { useState } from 'react';
import { requestAPI, useAPI } from '../hooks/useAPI';
import useRole from '../hooks/useRole';
const calculateTimeLeft = (startDate, endData) => {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endData);

    const days = differenceInDays(end, start);
    if(days > 0) return `${days} days`;
    const hours = differenceInHours(end, start) % 24;
    if(hours > 0) return `${hours} hours`;
    const minutes = differenceInMinutes(end, start) % 60;
    if(minutes > 0) return `${minutes} minutes`;
    const seconds = differenceInSeconds(end, start) % 60;
    if(seconds > 0) return `${seconds} seconds`;


    // if(isDateBetween(now, start, end)) return "Running";

    return "Finished";
  };

const isDateBetween = (date, startDate, endDate) => {
    return isWithinInterval(new Date(date), { start: new Date(startDate), end: new Date(endDate) });
};

const ContestTable = ({contests, refresh}) => {
    const nav = useNavigate();
    const parms = useParams();
    const {roleId} = useRole(parms.name);

    const [selectedContest, setSelectedContest] = useState(null);
    const [selectedContestName, setSelectedContestName] = useState(null);
    const [open, setOpen] = useState(false);
    const deleteContest = async (id) => {
        const {status} = await requestAPI(`/contests/delete/${id}`, 'delete');
        if(status > 199 && status < 300){
            setOpen(false);
            refresh();
            alert("Contest Deleted Successfully");
        }else{
            setOpen(false);
            alert("Failed to delete contest");
        }
    }

    function handleDelete(id, name){
        setSelectedContest(id);
        setSelectedContestName(name);
        setOpen(true);
    }
    return ( 
    <div className='contest-table'>
        <ConfirmDialog title={`Are you sure you want to delete ${selectedContestName}?`} choice1={"Cancle"} choice2={`Yes, delete ${selectedContestName}`} open={open} onClose={()=>setOpen(false)} onConfirm={()=>deleteContest(selectedContest)}/>

        <table>
            
            <thead>
                <tr>
                <th>Name</th>
                <th className='text-center' >Type</th>
                <th>Start Date</th>
                    {/* <th>End Date</th> */}
                    <th>Duration</th>
                    <th>Status</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
                {contests.map((e)=><tr key={e.id}>
                    <td>
                        <div>
                        <Typography variant='h6'>{e.name}</Typography>
                        <Typography variant='small'>{e.description}</Typography>
                        </div>
                    </td>
                    <td className='flex flex-col justify-center items-center'>
                        <FontAwesomeIcon className='m-auto' icon={e.type =='team'? faPeopleGroup : faUser}/>
                        {e.type == 'team'? "Team" : "Individual"}
                    </td>
                    <td>{format(new Date(e.start_date), 'yyyy-MM-dd')}<br/> {format(new Date(e.start_date), 'HH:mm')} </td>
                    {/* <td>{format(new Date(e.end_date), 'yyyy-MM-dd')}<br/> {format(new Date(e.start_date), 'HH:mm')} </td> */}
                    <td>{calculateTimeLeft(e.start_date, e.end_date)}</td>
                    <td>{calculateTimeLeft((new Date()).toUTCString(),e.start_date) + " Left"}</td>
                    <td className='flex gap-2 justify-left'>
                    
                    <Button style={{backgroundColor:'var(--primary-color)'}} onClick={()=>nav(`/community/${parms.name}/group/${e.group_id}/contest/${e.id}/show`)}>Go There</Button>
                    <div>
                    { (roleId == 1 || roleId == 2) && <><IconButton variant='text' onClick={() => handleDelete(e.id, e.name)}>
                        <FontAwesomeIcon color='red'  icon={faTrash}/>
                    </IconButton>
                    <IconButton variant='text' onClick={() => nav(`/community/${parms.name}/group/${e.group_id}/contest/${e.id}/edit`)}>
                        <FontAwesomeIcon icon={faEdit}/>
                    </IconButton>
                    <IconButton variant='text' onClick={() => nav(`/community/${parms.name}/group/${e.group_id}/contest/${e.id}/approve`)}>
                        <FontAwesomeIcon icon={faListCheck}/>
                    </IconButton></>}
                    </div>
                    
                    </td>
                </tr>)}
            </tbody>
        </table>   

        {(contests == null || contests.length == 0)? 
            <div className='h-32 w-full  items-center justify-center flex'>
                <Typography>No Contests yet, Check back later</Typography>
            </div> : <></>}
    </div>);
}
 
export default ContestTable;