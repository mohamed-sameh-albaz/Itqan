import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import CommunityNavBar from "../components/CommunityNavBar";
import { faChalkboardTeacher, faUser } from "@fortawesome/free-solid-svg-icons";
import { Card, CardBody, Button, CardHeader, Input, Option, Popover, PopoverContent, PopoverHandler, Select, Typography } from "@material-tailwind/react";
import { PieChart, Pie, Sector, Cell, ResponsiveContainer, Legend, BarChart, Bar, YAxis, XAxis, Line, LineChart, Tooltip } from 'recharts';
import { requestAPI, useAPI } from "../hooks/useAPI";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { yearsToDays } from "date-fns";


const DetailedPage = () => {
    const parms = useParams ();
    const user = JSON.parse(localStorage.getItem('user'));
    const statsMapping = new Map([
        ["users_stats", "Number of joined Users last year"],
        ["groups_stats", "Number of created Groups last year"],
        ["finished_contests_stats", "Number of finished Contests last year"],
        ["submissions_stats", "Number of submissions last year"],
        ["teams_stats", "Number of created Teams last year"],
        ["posts_stats", "Number of created Posts last year"],
        ["reactions_stats", "Number of created Reactions last year"],
        ["comments_stats", "Number of created Comments last year"],
    ]);

    const ParticipateRate = [
    { name: 'Participated', value: 0.5 },
    { name: "Didn't Participate", value: 0.2 },
    ];
    
    const [groups, loadingGroups] = useAPI('/communities/groups', 'get', {params: {community_name: parms.name, userId:user.id}});
    const [contests, setContests] = useState([]);
    const [loadingContest, setLoadingContests] = useState(true);

    const [selectedGroup, setSelectedGroup] = useState(-1);
    const [selectedContest, setSelectedContest] = useState(-1);


    useEffect(() => {
        async function refreshContestsList() {
            setLoadingContests(true);
            setSelectedContest(-1);
            console.log(selectedGroup);
            const {data, status} = await requestAPI('/contests/status', 'get', {
                params: {community_name: (selectedGroup==-1? parms.name: null), group_id: (selectedGroup==-1?null: selectedGroup),status:'finished'}});
            setContests(data.data.contests);
    
            console.log(contests);
            setLoadingContests(false);
        }
        refreshContestsList();
    }, [selectedGroup]);

    useEffect(() => {
        refreshAcceptance();

    }, [selectedContest, selectedGroup]);
      
    const [acceptance_rate, loadingAcceptance, refreshAcceptance] = useAPI('/stats/acceptance-rate', 'get',
        {params:{
        year: 2024,
        communityName:  ((selectedGroup ==-1 && selectedContest==-1)? parms.name: null),
        groupId:        ((selectedGroup !=-1 && selectedContest==-1)? selectedGroup : null), 
        contestId:      (selectedContest!=-1)? selectedContest : null ,
        }})

    const [participate_rate, loadingparticipate, refreshparticipate] = useAPI('/stats/participation-rate', 'get',
        {params:{
        year: 2024,
        communityName:  ((selectedGroup ==-1 && selectedContest==-1)? parms.name: null),
        groupId:        ((selectedGroup !=-1 && selectedContest==-1)? selectedGroup : null), 
        contestId:      (selectedContest!=-1)? selectedContest : null ,
        }})
    
    const [year, setYear] = useState(2024);

    const [statsResponse, isStatsLoading, refreshStats] = useAPI('/stats/detailed-report', 'get', {params:{
        communityName: parms.name,
        year: year  
        }})
    return ( <div>
        <CommunityNavBar />
        <Typography variant="h5" className="text-left mx-3 mt-3">{parms.name}'s detailed report </Typography>
        <div className=" container mx-auto">
            <div className="flex gap-4 items-center">
            <Typography variant="lead" color="gray">Selected year: </Typography>
            <input className="border border-gray-800 p-1 m-4" type="number" min="1900" max="2099" step="1" value={year} onChange={(e)=>setYear(e.target.value)} />
            <Button variant='solid' style={{backgroundColor:'var(--primary-color)'}} onClick={()=>{refreshStats();}}>Show</Button>
            </div>

            {isStatsLoading? <></> 
            :
            <div className="flex flex-col gap-3">
                {Object.entries(statsResponse.data).map(([key, value]) => (
                    <Card key={key} className="w-full h-96 border border-gray-600">
                        <Typography variant="h6">{statsMapping.get(key) || key}</Typography>
                        <ResponsiveContainer className="pr-5" width="100%" height="100%">
                            <LineChart width={'100%'} height={'100%'} data={value}>
                                <Line dataKey="value" name={"Count"} fill="#8884d8" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                            </LineChart>
                        </ResponsiveContainer>
                    </Card>
                ))}
            </div>
           }

            <Card className="w-full h-96 border border-gray-600 mt-4" >
                <CardBody>
                <Typography color="gray">
                    Community Stats
                </Typography>
                <div className="flex gap-4">
                    <select value={selectedGroup} onChange={(e) => {console.log(e.target.value); setSelectedGroup(e.target.value)}}>
                        <option value={-1}>ALL</option>
                        {(loadingGroups? [] : groups.data.groups).map((x) => <option value={x.id} >{x.title}</option>)}
                    </select>
                    <select disabled={loadingContest} value={selectedContest} onChange={(e) => {console.log(e); setSelectedContest(e.target.value)}}>
                        <option value={-1}>ALL</option>
                        
                        {contests.map((i) => <option value={i.id} key={i.id}>{i.name}</option>)}
                    </select>
                </div>
                <div className="flex gap-4 mt-4">
                <Card className="w-52 h-52 bg" shadow="lg">
                    <Typography className="font-bold">Success Rate</Typography>
                    <CardBody className="w-full h-full p-0 m-0">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie data={loadingAcceptance? [] : [
    { name: 'Success', value: acceptance_rate.data.acceptance_rate.accepted_count },
    { name: 'Failure', value: acceptance_rate.data.acceptance_rate.rejected_count },
    ]} dataKey="value" cx="50%" cy="50%"  fill="#82ca9d" label>
                                <Cell key="Participated" fill="#00C49F" />
                                <Cell key="Didn't Participate" fill="#FF8042" />
                            </Pie>
                            <Legend layout="vertical"/>
                        </PieChart>
                    </ResponsiveContainer>
                    </CardBody>
                </Card>

                <Card className="w-52 h-52 bg" shadow="lg">
                    <Typography className="font-bold">Single Contest Participate Rate</Typography>
                    <CardBody className="w-full h-full p-0 m-0">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie data={loadingparticipate? [] : [
    { name: 'Participated', value: participate_rate.data.participatied_count.participatied_count },
    { name: "Didn't Participate", value: participate_rate.data.participatied_count.non_participatied_count },
    ]} dataKey="value" cx="50%" cy="50%"  fill="#82ca9d" label>
                                <Cell key="Participated" fill="#00C49F" />
                                <Cell key="Didn't Participate" fill="#FF8042" />
                            </Pie>
                            <Legend layout="vertical"/>
                        </PieChart>
                    </ResponsiveContainer>
                    </CardBody>
                </Card>

                </div>

                </CardBody>

            </Card>
            
        </div>
    </div> );
}
 
export default DetailedPage;