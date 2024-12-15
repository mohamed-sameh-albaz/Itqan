import { Button, Typography } from '@material-tailwind/react';
import './ContestTable.css'
import { format, differenceInDays, differenceInHours, differenceInMinutes, differenceInSeconds, isWithinInterval } from 'date-fns';

const calculateTimeLeft = (startDate, endData) => {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endData);

    const days = differenceInDays(start, now);
    if(days > 0) return `${days} days`;
    const hours = differenceInHours(start, now) % 24;
    if(hours > 0) return `${hours} hours`;
    const minutes = differenceInMinutes(start, now) % 60;
    if(minutes > 0) return `${minutes} minutes`;
    const seconds = differenceInSeconds(start, now) % 60;
    if(seconds > 0) return `${seconds} seconds`;


    if(isDateBetween(now, start, end)) return "Running";

    return "Finished";
  };

const isDateBetween = (date, startDate, endDate) => {
    return isWithinInterval(new Date(date), { start: new Date(startDate), end: new Date(endDate) });
};

const ContestTable = ({contests}) => {
    
    return ( 
    <div className='contest-table'>

        <table>
            
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Start Date</th>
                    <th>Status</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
                {contests.map((e)=><tr>
                    <td>
                        <div>
                        <Typography variant='h6'>{e.name}</Typography>
                        <Typography variant='small'>{e.description}</Typography>
                        </div>
                    </td>
                    <td>{format(new Date(e.start_date), 'yy-MM-dd')}<br/> {format(new Date(e.start_date), 'HH:mm')} </td>
                    <td>{calculateTimeLeft(e.start_date, e.end_date)}</td>
                    <td><a className=''> <Button style={{backgroundColor:'var(--primary-color)'}}>Go There</Button></a></td>
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