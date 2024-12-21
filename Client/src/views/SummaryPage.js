import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import CommunityNavBar from "../components/CommunityNavBar";
import { faChalkboardTeacher, faUser } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import axios from "axios";
import { useAPI } from "../hooks/useAPI";
import { useParams } from "react-router-dom";
import { Typography } from "@material-tailwind/react";

const SummaryPage = () => { 
    const parms = useParams ();
    const [data, loading] = useAPI('/stats/summary-report', 'get', {params: {communityName:parms.name}});
    const statsMapping = new Map([
        ["total_users", "Number of joined Users last year"],
        ["groups_stats", "Number of created Groups last year"],
        ["finished_contests_stats", "Number of finished Contests last year"],
        ["submissions_stats", "Number of submissions last year"],
        ["teams_stats", "Number of created Teams last year"],
        ["posts_stats", "Number of created Posts last year"],
        ["reactions_stats", "Number of created Reactions last year"],
        ["comments_stats", "Number of created Comments last year"],
    ]);
    return (
        <div>
            <CommunityNavBar />
            
            <Typography variant="h5" className="text-left m-8">{parms.name}'s Summary </Typography>
            <table className="m-8 text-left min-w-full bg-white border border-black">
                <thead>
                    <tr>
                        <th className="px-4 py-2 border border-black bg-gray-100 text-left text-sm font-semibold text-gray-600">Statistic</th>
                        <th className="px-4 py-2 border border-black bg-gray-100 text-left text-sm font-semibold text-gray-600">Value</th>
                    </tr>
                </thead>
                <tbody>
                    {loading ? <></> :
                    Object.entries(data.data.stats).map(([key, value]) => (
                    <tr key={key}>
                        <td className="px-4 py-2 border border-black">{key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' ')}</td>
                        <td className="px-4 py-2 border border-black"><FontAwesomeIcon icon={null} /> {value}</td>
                    </tr>))}
                </tbody>
            </table>
        </div>
    );
}
 
export default SummaryPage;