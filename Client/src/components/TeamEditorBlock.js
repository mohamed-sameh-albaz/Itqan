import "./TeamEditorBlock.css"
import React, { useState } from "react";
import { requestAPI } from '../hooks/useAPI'; 
const TeamEditorBlock = (props) => {


  const user=JSON.parse(localStorage.getItem('user'));
 
  let id = user.id;
  let name_com=props.com_name;

  const handlechange1 = (e) => { 
    setTeamName( e.target.value );
  };
  const handlechange2 = (e) => {
    setTeamMate1(e.target.value); 
  }
  const handlechange3 = (e) => {  
    setTeamMate2(e.target.value);
  }
  
  async function handleCreateTeam(){
    console.log(id);
    console.log(name_com);
    console.log("Team name: ", teamName);
    console.log("Team mate1: ", teamMate1);
    console.log("Team mate2: ", teamMate2);
    // Send the data to the server
    const { status, data } = await
      requestAPI(
          '/teams/new',
          'post',
        {
          body: {
            userId: id,
            name: teamName,
            photo: "test Photo",
            communityName: name_com,
            teamUsers: [
             teamMate1,
              teamMate2
            ]
          }
        }
    )
 if (status > 199 && status < 300) {
    console.log("sucssess");
   alert("Team created successfully");
   data.data.message.forEach((mes,index)=>{
  alert(`for Team mate${index+1} : ${mes.msg}`); 
  });
  }
    else {
      console.log("error");
      alert("Error creating team");
      if(typeof(data.message)==="string"){
        alert(data.message);
      }
      else{
        data.message.forEach((mes,index)=>{
        alert(`for Team mate${index+1} : ${mes.msg}`); 
        });
    }

  }
}
   const [teamName, setTeamName] = useState("");
   const [teamMate1, setTeamMate1] = useState("");
   const [teamMate2, setTeamMate2] = useState("");
  

    return (
      <div>
        <div className="TE_all">
          <div className="des">
            create your team : You can create a team with 2 or 3 members
          </div>
          <div className="TeamName">
            <label htmlFor="name" className="lbl">
              Team name :
            </label>
            <input onChange={handlechange1} type="text" className="name" />
          </div>

          <div className="TeamMate">
            <label htmlFor="TMname" className="lbl">
              Team mate1 :
            </label>
            <input onChange={ handlechange2} type="text" className="TMname" />
          </div>
          <div className="TeamMate">
            <label htmlFor="TMname2" className="lbl2">
              Team mate2 :
            </label>
            <input onChange={handlechange3} type="text" className="TMname2" />
            </div>
          <button onClick={handleCreateTeam}  className="send">Create The Team</button>
        </div>
      </div>
    );
}
 
export default TeamEditorBlock;