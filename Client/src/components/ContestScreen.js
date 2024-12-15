
import React, { useState } from "react"
import "./ContestScreen.css"
const ContestScreen = (props) =>
{
  const [activeIndex, setActiveIndex] = useState(0); // Track the clicked button index
  const [buttons, addQuestion] = useState(props.buttons);  
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
  const [Choices, setChoices] = useState(["", "", "", ""]);
  const [Title, setTitle] = useState(""); 


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


//  let buttons = props.buttons//["Question","A", "B", "C", "D", "E", "F", "G", "H"];
  const addquesM = () => {
    const char = String.fromCharCode(buttons.length + 64);
    const newitem = { Qn:char ,type:"msq",title:Title,content:Content,choices:["","","",""],correctAnswer:""};
    addQuestion((prevButtons) => [...prevButtons, newitem]);
  };
  const addquesW = () => {
    
     const char = String.fromCharCode(buttons.length + 64);
     const newitem = {Qn:char,type:"written",title:Title, content:Content,choices:["","","",""],correctAnswer:""};  
     addQuestion((prevButtons) => [...prevButtons, newitem]);
    
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

        {buttons[activeIndex].type === "msq" && user === "leader" && (
          <div className="choices">
            {[1, 2, 3, 4].map((num) => (
              <div key={num} className="choice-input">
                <label htmlFor={`choice${num}`} className="choice-label">
                  Choice {num}:
                </label>
                <input
                  value={buttons[activeIndex].choices[ num  - 1]}
                  onChange={handlechoiceschange( num  - 1)}
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

        {buttons[activeIndex].type === "msq" && user === "student" && (
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
              type="text"
              id="correct-answer"
              onChange={(e) => {
                const newButtons = [...buttons];
                newButtons[activeIndex].correctAnswer = e.target.value;
                addQuestion(newButtons);
              }}
              className="correct-answer-field"
            />
          </div>
        </div>
      )}
    </div>
  );
}
 
export default ContestScreen;




