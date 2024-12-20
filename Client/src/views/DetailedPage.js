import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import CommunityNavBar from "../components/CommunityNavBar";
import { faChalkboardTeacher, faUser } from "@fortawesome/free-solid-svg-icons";
import { Card, CardBody, CardHeader, Option, Select, Typography } from "@material-tailwind/react";
import { PieChart, Pie, Sector, Cell, ResponsiveContainer, Legend } from 'recharts';

const DetailedPage = () => {
      const succsesRate = [
        { name: 'Success', value: 0.5 },
        { name: 'Failure', value: 0.2 },
      ];

      const ParticipateRate = [
        { name: 'Participated', value: 0.5 },
        { name: "Didn't Participate", value: 0.2 },
      ];
      
    return ( <div>
        <CommunityNavBar />
        <div className=" container mx-auto">
            <Card className="w-full h-96 border border-gray-600" >
                <CardBody>
                <Typography color="gray">
                    Community Stats
                </Typography>
                <div className="flex gap-4">
                    <Select>
                        {Array.from({ length: 8 }, (_, i) => i + 3).map((i) => <Option key={i}>Community {i}</Option>)}
                    </Select>
                    <Select>
                        {Array.from({ length: 8 }, (_, i) => i + 3).map((i) => <Option key={i}>Contest {i}</Option>)}
                    </Select>
                </div>
                <div className="flex gap-4 mt-4">
                <Card className="w-52 h-52 bg" shadow="lg">
                    <Typography className="font-bold">Success Rate</Typography>
                    <CardBody className="w-full h-full p-0 m-0">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie data={succsesRate} dataKey="value" cx="50%" cy="50%"  fill="#82ca9d" label>
                                <Cell key="Participated" fill="#00C49F" />
                                <Cell key="Didn't Participate" fill="#FF8042" />
                            </Pie>
                            <Legend layout="vertical"/>
                        </PieChart>
                    </ResponsiveContainer>
                    </CardBody>
                </Card>

                <Card className="w-52 h-52 " shadow="lg">
                    <Typography className="font-bold">Participation Rate</Typography>
                    <CardBody className="w-full h-full p-0 m-0">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie data={ParticipateRate} dataKey="value" cx="50%" cy="50%"  fill="#82ca9d" label>
                                <Cell key="Success" fill="#00C49F" />
                                <Cell key="Failure" fill="#FF8042" />
                            </Pie>
                            <Legend />
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