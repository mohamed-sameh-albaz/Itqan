
import React, { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';

import "./ContestScreen.css"
import { requestAPI ,useAPI} from "../hooks/useAPI"; 
import { button } from "@material-tailwind/react";
const ContestScreen = (props) =>
{ 
  let s="                                                                                Lets Go Now";
  const [activeIndex, setActiveIndex] = useState(0); // Track the clicked button index
  const [buttons, addQuestion] = useState([{ Qn: 'Question', type: '', title: 'Are You Ready', content: s,points:0,photo : '', choices: ['', '', '', ''], correctAnswer: '',id:0,ans:'' }]); // Array of buttons
  let allow_read = "";
  let user = props.user;
  let mymode = props.Mode;
  

  const my_user = JSON.parse(localStorage.getItem('user'));
  
  const UserID= my_user.id;

  const parms= useParams();
  let ContestID=parms.contestID;
  let GroupID=parms.groupID;

  console.log(ContestID,GroupID);

  const [buttons_len, setButtonsLen] = useState(0);

  if (user === "leader" || user === "admin") {
    allow_read = "";
  }
  else { 
    allow_read = "readOnly";
  }
  

  useEffect(() => {
   
    const fetchTasksforedit = async () => {
      const { status, data } = await requestAPI(`/contests/${props.contestid}/tasks?editing=${true}`, "get");
      if (status > 199 && status < 300) {
        console.log(data.status);
       const newButtons = (data.data.tasks).map((task, index) => ({
          Qn: String.fromCharCode(97 + index),
          type: task.type,
          title: task.title,
          content: task.description,
          points: task.points,
          photo: task.image,
          choices: [task.a,task.b,task.c,task.d],
         correctAnswer: task.correctAnswer,
          ans: "",
         id: task.id
        }));
        addQuestion(prevButtons=>[...prevButtons,...newButtons]);
        setButtonsLen((newButtons.length)+1);
      } else {
        console.error("Error fetching tasks");
      }
    };

    const fetchTasksforsubmit = async () => {

      const { status, data } = await requestAPI(`/contests/${props.contestid}/tasks?editing=${false}`, "get");
      if (status > 199 && status < 300) {
        console.log(data.status);
       const newButtons = (data.data.tasks).map((task, index) => ({
          Qn: String.fromCharCode(97 + index),
          type: task.type,
          title: task.title,
          content: task.description,
          points: task.points,
          photo: task.image,
          choices: [task.a,task.b,task.c,task.d],
          ans: "",
         id: task.id
        }));
        addQuestion(prevButtons=>[...prevButtons,...newButtons]);
        setButtonsLen((newButtons.length)+1);
      } else {
        console.log("Error fetching tasks");
      }
    };

    if(mymode==="edit")
   {
   console.log(props.contestid);
    fetchTasksforedit();  
}
else if(mymode==="submit")
{
  console.log(props.contestid);
  fetchTasksforsubmit();
}
  }, [props.contestid]);
    
     const handleClick = (index) => {
       setActiveIndex(index);
  }; 
  
 



  const [Content, setContent] = useState("");
  const [choices, setChoices] = useState(["", "", "", ""]);
  const [Title, setTitle] = useState(""); 
  const [Points, setPoints] = useState(1);
  const [CorrectAnswer, setCorrectAnswer] = useState("");
  const [Photo, setPhoto] = useState("");
  const [Ans, setAns] = useState("");

  const handlechoiceschange = (index) => (e) => {
    const newButtons = [...buttons];
    newButtons[activeIndex].choices[index] = e.target.value; 
    addQuestion(newButtons);

  }
  const handletitlechange = (e) => {
    const newButtons = [...buttons];
    newButtons[activeIndex].title = e.target.value;
    addQuestion(newButtons);
  }

  const handlecontentchange = (e) => { 
    const newButtons = [...buttons];
    newButtons[activeIndex].content = e.target.value;
    addQuestion(newButtons);
  }

  const handlepointschange = (e) => {
    const newButtons = [...buttons];
    newButtons[activeIndex].points = e.target.value;
    addQuestion(newButtons);
  }

  const handleanswerchange = (e) => {
    const newButtons = [...buttons];
    newButtons[activeIndex].correctAnswer = e.target.value;
    addQuestion(newButtons);
    console.log(buttons[activeIndex].correctAnswer);
  }

 const handlePhotoChange = (e) => {
   const newButtons = [...buttons];
   newButtons[activeIndex].photo = e.target.files[0];
   addQuestion(newButtons);
 };


  const addquesM = () => {
    const char = String.fromCharCode(buttons.length + 64);
    const newitem = { Qn:char ,type:"mcq",title:Title,content:Content,points:Points,photo:"", choices:["","","",""],correctAnswer:"",id:0,ans:Ans};
    addQuestion((prevButtons) => [...prevButtons, newitem]);
  };
  const addquesW = () => {
    
     const char = String.fromCharCode(buttons.length + 64);
     const newitem = {Qn:char,type:"written",title:Title, content:Content,points:Points,photo:"",choices:["","","",""],correctAnswer:"",id:0,ans:Ans};  
     addQuestion((prevButtons) => [...prevButtons, newitem]);
    
  };

  const handleAnsChanged = (e) => {
    const newButtons = [...buttons];
    newButtons[activeIndex].ans = e.target.value;
    addQuestion(newButtons);
  };
 
  const handleTaskDelete = (index) => {
    if(index>0)
    {
      const newButtons = [...buttons];
      newButtons.splice(index, 1);
      if (activeIndex === newButtons.length) {
        setActiveIndex(newButtons.length - 1);
      }
      for (let i = index; i < newButtons.length; i++) {
        console.log(i, newButtons.length);
        newButtons[i].Qn = String.fromCharCode(65 + i-1);
      }

      addQuestion(newButtons);
    }
  };


  
  
  useEffect(() => {
     if (props.sendnow==="true" && (props.user==="leader"||props.user==="admin") && mymode==="create") {
       buttons.map((label,index) => {
         if (index > 0) {
           handleeClick(index);
         }
       });
     }
    else if (props.sendnow==="true" && props.user==="member") {
    console.log("submit");
    buttons.map((label,index) => {
      if (index > 0&&buttons[index].type==="written") {
        handleeClickSubmit(index);
      }
    });
    }

    else if (props.sendnow==="true" && (props.user==="leader"||props.user==="admin") && mymode==="edit") {
      buttons.map((label,index) => {
        if (index > 0) {
          handleeClickedit(index);
        }
      });
    }
   }, [props.sendnow]);

  async function handleeClick(index) {
       console.log(props.contestid,buttons[index].title);
       const { status, data } = await requestAPI("/contests/task", "post", {
        body: {
          contest_id: props.contestid,
          description: buttons[index].content,
          title: buttons[index].title,
          points: buttons[index].points,
          type: buttons[index].type,
          image: buttons[index].photo,
          mcqData: {
            A: buttons[index].choices[0],
            B: buttons[index].choices[1],
            C: buttons[index].choices[2],
            D: buttons[index].choices[3],
            right_answer: buttons[index].correctAnswer,
          }
        }
      });
      if (status > 199 && status < 300) {
        console.log("sucssess");
      } else {
        console.log("error");
      }
  };
  
async function handleeClickedit(index) {
  console.log(buttons_len);
  if(index<buttons_len)
  {
  console.log(props.contestid,buttons[index].title);
  const { status, data } = await requestAPI(`/contests/task/edit/${buttons[index].id}`, "put", {
    body: {
      description: buttons[index].content,
      title: buttons[index].title,
      points: buttons[index].points,
      type: buttons[index].type,
      image: buttons[index].photo,
      mcqData: {
        A: buttons[index].choices[0],
        B: buttons[index].choices[1],
        C: buttons[index].choices[2],
        D: buttons[index].choices[3],
        right_answer: buttons[index].correctAnswer,
      }
    }
  });
  if (status > 199 && status < 300) {
    console.log("sucssess");
  } else {
    console.log("error");
  }
}
else
{
  console.log("new task");
  const { status, data } = await requestAPI("/contests/task", "post", {
    body: {
      contest_id: props.contestid,
      description: buttons[index].content,
      title: buttons[index].title,
      points: buttons[index].points,
      type: buttons[index].type,
      image: buttons[index].photo,
      mcqData: {
        A: buttons[index].choices[0],
        B: buttons[index].choices[1],
        C: buttons[index].choices[2],
        D: buttons[index].choices[3],
        right_answer: buttons[index].correctAnswer,
      }
    }
  });
  if (status > 199 && status < 300) {
    console.log("sucssess");
  } else {
    console.log("error");
  }
}
}
  
async function handleeClickSubmit(index){
  console.log(buttons[index].id,props.contestid,UserID,buttons[index].ans);
  const { status, data } = await requestAPI("/submissions/", "post", {
    body: {
     taskId: buttons[index].id,
     contestId: parseInt(props.contestid,10),
     userId: UserID,
     content: buttons[index].ans,
      }
    }
  );
  if (status > 199 && status < 300) {
    console.log("sucssess");
    alert("Answers submitted successfully");
  } else {
    console.log("error");
    alert("Error submitting answers");
  }

}

  return (
    <div className="CS_all">
      <div className="Qlist">
        {buttons.map((label, index) => (
          <button
            key={index}
            className={`my-button ${
              index === activeIndex
                ? "active"
                : index === activeIndex - 1
                ? "above-active"
                : index === activeIndex + 1
                ? "down-active"
                : "inactive"
            }
                ${index === 0 ? "first-button" : "not-first"}
                ${index === 1 ? "second-button" : "not-second"}
                ${
                  index === Number(buttons.length - 1)
                    ? "last-button"
                    : "not-last"
                }
                  `}
            onClick={() => handleClick(index)}
          >
            {label.Qn}
          </button>
        ))}
      </div>

      <div className="Qinf">
        <div className="Ques">
          <div className="Title">
            <label htmlFor="title" className="LABEL">
              Title :
            </label>
            <input
              type="text"
              value={buttons[activeIndex].title}
              readOnly={allow_read}
              onChange={handletitlechange}
              className="title"
            />
          </div>
          <textarea
            type="text"
            value={buttons[activeIndex].content}
            readOnly={allow_read}
            onChange={handlecontentchange}
            className="content"
          />
        </div>

        {buttons[activeIndex].type === "mcq" && (user === "leader"||user==="admin") && (
          <div className="choices">
            {[1, 2, 3, 4].map((num) => (
              <div key={num} className="choice-input">
                <label htmlFor={`choice${num}`} className="choice-label">
                  Choice {num}:
                </label>
                <input
                  value={buttons[activeIndex].choices[num - 1]}
                  onChange={handlechoiceschange(num - 1)}
                  type="text"
                  id={`choice${num}`}
                  className="choice-field"
                />
              </div>
            ))}
          </div>
        )}

        {buttons[activeIndex].type === "written" && user === "member" && (
          <div className="ANS">
            <label htmlFor="ans" className="Ans">
              Answer :
            </label>
            <textarea
             type="text"
             onChange={handleAnsChanged}
             value={buttons[activeIndex].ans}
             className="ans" 
             />
          </div>
        )}

        {buttons[activeIndex].type === "mcq" && user === "member" && (
          <div className="msq">
            {[1, 2, 3, 4].map((num) => (
              <div key={num} className="msq-choice">
                <input
                  type="radio"
                  id={`msq-choice${num}`}
                  name="msq-choice"
                  value={String.fromCharCode(65 + num - 1)} // A, B, C, D
                checked={buttons[activeIndex]?.ans === String.fromCharCode(65 + num - 1)}
                onChange={(e) => {
                  const newButtons = [...buttons];
                  newButtons[activeIndex].ans = e.target.value;
                  addQuestion(newButtons);
                  console.log(buttons[activeIndex].ans);

                }}
                  // value={`msq-choice${num}`}
                  // onChange={handleAnsChanged}
                />
                <label htmlFor={`msq-choice${num}`} className="msq-label">
                  {buttons[activeIndex].choices[num - 1]}
                </label>
              </div>
            ))}
          </div>
        )}
      </div>
      {(user === "leader"||user==="admin" )&& (
        <div className="forLeader">
          <button className="addQM" onClick={() => addquesM()}>
            add Question MCQ
          </button>
          <button className="addQW" onClick={() => addquesW()}>
            add Question written
          </button>
            <div className="correct-answer">
              <label htmlFor="correct-answer" className="correct-answer-label">
                Correct Answer:
              </label>
              <select
                onChange={handleanswerchange}
                className="correct-answer-field"
                value={buttons[activeIndex].correctAnswer}
              >
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="C">C</option>
                <option value="D">D</option>
              </select>
            </div>

          <div className="points">
            <label htmlFor="points" className="points-label">
              Points:
            </label>
            <input
              value={buttons[activeIndex].points}
              type="text"
              id="points"
              onChange={handlepointschange}
              className="points-field"
            />
          </div>
          <div className="photo">
            <label htmlFor="photo" className="photo-label">
              Add Photo:
            </label>
            <input
              type="file"
              id="photo"
              onChange={handlePhotoChange}
              className="photo-field"
            />
          </div>
          <button className="deleteTask" onClick={() => handleTaskDelete(activeIndex)}>
            Delete Task
            </button>
        </div>
      )}
    </div>
  );
}
 
export default ContestScreen;




