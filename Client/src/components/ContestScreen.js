
import React, { useState, useEffect } from "react";
import "./ContestScreen.css"
import { requestAPI } from "../hooks/useAPI"; 
import { button } from "@material-tailwind/react";
const ContestScreen = (props) =>
{ 
  let s="                                                                                Lets Go Now";
  const [activeIndex, setActiveIndex] = useState(0); // Track the clicked button index
  const [buttons, addQuestion] = useState([{ Qn: 'Question', type: '', title: 'Are You Ready', content: s,points:0,photo : '', choices: ['', '', '', ''], correctAnswer: '' }]);  
  let allow_read = "";
  let user = props.user;

  
    
     const handleClick = (index) => {
       setActiveIndex(index);
  }; 
  
  if (user === "leader") {
    allow_read = "";
  }
  else { 
    allow_read = "readonly";
  }

 const [Content, setContent] = useState("");
  const [choices, setChoices] = useState(["", "", "", ""]);
  const [Title, setTitle] = useState(""); 
  const [Points, setPoints] = useState(1);
  const [CorrectAnswer, setCorrectAnswer] = useState("");
  const [Photo, setPhoto] = useState("");

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
  }

 const handlePhotoChange = (e) => {
   const newButtons = [...buttons];
   newButtons[activeIndex].photo = e.target.files[0];
   addQuestion(newButtons);
 };


  const addquesM = () => {
    const char = String.fromCharCode(buttons.length + 64);
    const newitem = { Qn:char ,type:"mcq",title:Title,content:Content,points:Points,photo:"", choices:["","","",""],correctAnswer:""};
    addQuestion((prevButtons) => [...prevButtons, newitem]);
  };
  const addquesW = () => {
    
     const char = String.fromCharCode(buttons.length + 64);
     const newitem = {Qn:char,type:"written",title:Title, content:Content,points:Points,photo:"",choices:["","","",""],correctAnswer:""};  
     addQuestion((prevButtons) => [...prevButtons, newitem]);
    
  };

 
  
  useEffect(() => {
     if (props.sendnow==="true") {
       buttons.map((label,index) => {
         if (index > 0) {
           handleeClick(index);
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
          image: "http://example.com/image.png",
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

        {buttons[activeIndex].type === "mcq" && user === "leader" && (
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

        {buttons[activeIndex].type === "written" && user === "student" && (
          <div className="ANS">
            <label htmlFor="ans" className="Ans">
              Answer :
            </label>
            <textarea type="text" className="ans" rows="5" />
          </div>
        )}

        {buttons[activeIndex].type === "mcq" && user === "student" && (
          <div className="msq">
            {[1, 2, 3, 4].map((num) => (
              <div key={num} className="msq-choice">
                <input
                  type="radio"
                  id={`msq-choice${num}`}
                  name="msq-choice"
                  value={`choice${num}`}
                />
                <label htmlFor={`msq-choice${num}`} className="msq-label">
                  Choice {num}
                </label>
              </div>
            ))}
          </div>
        )}
      </div>
      {user === "leader" && (
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
            <input
              value={buttons[activeIndex].correctAnswer}
              type="text"
              id="correct-answer"
              onChange={handleanswerchange}
              className="correct-answer-field"
            />
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
        </div>
      )}
    </div>
  );
}
 
export default ContestScreen;




