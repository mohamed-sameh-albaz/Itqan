import { useParams } from 'react-router-dom';
import CommunityNavBar from '../components/CommunityNavBar'
import { useState } from 'react';
import { requestAPI, useAPI } from '../hooks/useAPI';
import '../components/ContestTable.css'
import { Button, IconButton, Input, Typography } from '@material-tailwind/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { set } from 'date-fns';

function ApproveElement({subData, refresh}) {
    const user = JSON.parse(localStorage.getItem('user'));
    const parms = useParams();
    const [mark, setMark] = useState(0);
    const [loading, setLoading] = useState(false);

    async function updateMark(id){
        setLoading(true);
        const {status, data} = await requestAPI('/submissions/written', 'patch', {body:{
            userId: user.id,
            submissionId: subData.id,
            score: mark, // limited from - to 100 as a percentage of correctness
            contestId: parms.contestID
        }});

        if(status > 199 && status < 300){
            setLoading(false);
            refresh();
            return;
        }

        alert('Error: '+ data);
        setLoading(false);
    }

    return (
        <tr>
            <td>
                <div>
                <Typography variant='h6'>{subData.task_title}</Typography>
                <Typography variant='small'>{subData.task_description}</Typography>
                </div>
            </td>

            <td>
                <div>
                {/* <Typography variant='h6'>{data.content}</Typography> */}
                <Typography variant='small'>{subData.content}</Typography>
                </div>
            </td>
        
            <td className='flex w-10 gap-2 justify-left'>
                <Input value={mark} type='number' onChange={(x)=>{
                    if(x.target.value >= 0 && x.target.value <= 100){
                        setMark(parseInt(x.target.value))
                    }
                }}></Input>
                <div>%</div>
                <div>
                <Button loading={loading} style={{backgroundColor:'var(--primary-color)'}} onClick={()=>updateMark(subData.task_id)}>Mark!</Button>
                </div>

            </td>
        </tr>
    );
}

const ApprovePage = () => {
    const parms = useParams();
    
    const [submissions, loadingSubmissions, refreshSubmissions] = useAPI('/submissions/written', 'get', {params:{contestId:parms.contestID}})
    
    return ( <div>
        <CommunityNavBar/>

        <div className='contest-table m-8 '>
        <table>
            <thead>
                <tr>
                    <th>Qustion</th>
                    <th>Answer</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
                {loadingSubmissions? <></> : submissions.data.submissions.map((e)=><ApproveElement subData={e} refresh={refreshSubmissions}/>)}
            </tbody>
        </table> 
        </div>

    </div> );
}
 
export default ApprovePage;