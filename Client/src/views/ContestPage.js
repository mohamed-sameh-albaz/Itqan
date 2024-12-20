import React, { useState,useEffect } from 'react';
import { useParams } from 'react-router-dom';
import CommunityNavBar from '../components/CommunityNavBar';
import ContestScreen from '../components/ContestScreen';
import './ContestPage.css';
import { requestAPI } from '../hooks/useAPI'; 
const ContestPage = (props) => {
  

  const my_user = JSON.parse(localStorage.getItem('user'));
  

  const parms= useParams();
  let user_ID = my_user.id;
  console.log(user_ID);
  let group_ID = parms.groupID;
  let mode=props.MODE;
  
  const [user, setUser] = useState("leader");

  let buttonText = "Submit";
  let form_write = "";

  if (user === "leader") {
    buttonText = "Save";
    form_write = "";
  }
  else {
    buttonText = "Submit";
    form_write = "readOnly";
  }

  const fetchUserRole = async () => {
    const { status, data } = await requestAPI(`/roles/user-role?userId=${user_ID}&communityName=${parms.name}`, 'get');  
    if (status > 199 && status < 300) {
      setUser(data.data.role.name);
      console.log(data.data.role.name);
    } else {
      console.error("Error fetching user role");
    }
  };

  useEffect(() => {

    fetchUserRole();
   
    const fetchContest = async () => {
      const { status, data } = await requestAPI(`/contests/${parms.contestID}`, 'get');
      if (status > 199 && status < 300) {
        setFormData({
          difficulty: data.data.contest.difficulty,
          type: data.data.contest.type,
          name: data.data.contest.name,
          description: data.data.contest.description,
          start_date: data.data.contest.start_date,
          end_date: data.data.contest.end_date
        });
        console.log(data.data.contest.start_date);
      } else {
        console.error("Error fetching contest details");
      }
    };

    if (mode !== "create") {
      setContestID(parms.contestID);
      fetchContest();
     console.log(parms.contestID);
    }
  }, [parms.contestID, mode]);

  

  const [send_now, setSendNow] = useState("false"); 
  const [contestID, setContestID] = useState(0); 
  
  const [formData, setFormData] = useState({
    difficulty: '',
    type: '',
    name: '',
    description: '',
    start_date: '',
    end_date: ''
  });



  async function handleClick () {

    if(user === "leader" &&mode === "create") {
    const {status, data} = await
    requestAPI(
      '/contests',
      'post',
      {
        body: {
            description: formData.description,
            type: formData.type,
            difficulty: formData.difficulty,
            name: formData.name,
            start_date: formData.start_date,
            end_date: formData.end_date,
            status: "active",
            group_id: group_ID
          } 
      }
    )
  
    if (status > 199 && status < 300) {
    console.log("sucssess");
    }
    else {
      console.log("error");
    }
  
    setContestID(data.data.contest.id);
   
  }
  else if (user==="leader" && mode === "edit") {
   
    const {status, data} = await
    requestAPI(
      `/contests/edit/${contestID}`,
      'put',
      {
        body: {
            description: formData.description,
            type: formData.type,
            difficulty: formData.difficulty,
            name: formData.name,
            start_date: formData.start_date,
            end_date: formData.end_date,
            status: "active",
            group_id: group_ID
          } 
      }
    )
  
    if (status > 199 && status < 300) {
    console.log("sucssess");
    }
    else {
      console.log("error");
    }
  }
  else if (user === "member" && mode === "submit") {
     console.log("submit");

  }
  setSendNow("true");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    
    }));
      console.log(name, value);
  };


  return (
    <div className="contest-page">
      <CommunityNavBar />

      <div>
        <form className="contest-form">
          <div className="form-group">
            <label>Name:</label>
            <input
              readOnly={form_write}
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Description:</label>
            <textarea
              readOnly={form_write}
              name="description"
              value={formData.description}
              onChange={handleChange}
            ></textarea>
          </div>
          <div className="form-group">
            <label>Difficulty:</label>
            <select
              name="difficulty"
              value={formData.difficulty}
              onChange={handleChange}
              disabled={form_write === "readOnly"}
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
          <div className="form-group">
            <label>Type:</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              disabled={form_write === "readOnly"}
            >
              <option value="single">Single</option>
              <option value="team">Team</option>
            </select>
          </div>
          <div className="form-group">
            <label>Start Date:</label>
            <input
              readOnly={form_write}
              type="datetime-local"
              name="start_date"
              value={formData.start_date}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>End Date:</label>
            <input
              readOnly={form_write}
              type="datetime-local"
              name="end_date"
              value={formData.end_date}
              onChange={handleChange}
            />
          </div>
          {/* <button type="submit">Submit</button> */}
        </form>
      </div>
      <div className="keep">Keep Going</div>

      <ContestScreen user={user} sendnow={send_now} contestid={contestID} Mode={mode} />

      <button className="submitt" onClick={handleClick} form-data={formData}>
        {buttonText}
      </button>
    </div>
  );
}

export default ContestPage;