import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Avatar, Typography } from "@material-tailwind/react";
import '../components/ContestTable.css'
import CommunityNavBar from "../components/CommunityNavBar";
import { useAPI } from "../hooks/useAPI";
import { useParams } from "react-router-dom";
const LeaderBoardPage = () => {
    const parms = useParams();
    const [board, loadingLeader] = useAPI(`/contests/${parms.contestID}/single-leaderboard`)

    return ( 
        <div>
            <CommunityNavBar />
            <div className="p-8">
            <div className="contest-table">
                <table>     
                    <thead>
                        <tr>
                        <th>#</th>
                        <th>Contistant Name</th>
                        <th>Total Score</th>
                        </tr>
                    </thead>
                    <tbody >
                        {!loadingLeader && board.data.leaderboard.map((item, index) => (
                        <tr key={index} style={{backgroundColor: index == 0? '#AF9500': index == 1? '#B4B4B4': index == 2? '#6A3805' : 'white'}}>
                            <th className="p-3">{index+1}</th>
                            <th>
                                <div className="flex justify-start items-center gap-3 p-2">
                                    <Avatar className="" src={item.photo} />
                                    <Typography variant="h6">{item.fname + " " + item.lname}</Typography>
                                </div>
                            </th>
                            <th className="p-3">{item.total_score}</th>
                        </tr>))}
                    </tbody>
                </table>   
            </div>
            </div>

        </div>

     );
}
 
export default LeaderBoardPage;