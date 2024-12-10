
import React, { useState } from "react"
import "./ContestScreen.css"
const ContestScreen = (props) =>
{
  const [activeIndex, setActiveIndex] = useState(null); // Track the clicked button index
  const [buttons, addQuestion] = useState(props.buttons);  
  let allow_read = props.allow_read;
     let user = "leader";
     const handleClick = (index) => {
       setActiveIndex(index);
     }; 

//  let buttons = props.buttons//["Question","A", "B", "C", "D", "E", "F", "G", "H"];
  const addques = () => {
    const char = String.fromCharCode(buttons.length+64);
    addQuestion((prevButtons)=>[...prevButtons,char])
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
                ${index === Number(buttons.length-1) ? "last-button" : "not-last"}
                  `}
                onClick={() => handleClick(index)}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="Qinf">
            <div className="Ques">
              <div className="Title">
                <label htmlFor="title" className="LABEL">
                  Title :
                </label>
              <input type="text" readOnly={allow_read} className="title" />
              </div>
            <textarea type="text" readOnly={allow_read} className="content" />
            </div>
            <div className="ANS">
              <label htmlFor="ans" className="Ans">
                Answer :
              </label>
              <textarea type="text" className="ans" rows="5" />
            </div>
        </div>
        {user === "leader" &&
          <div className="forLeader">
        <button className="addQ" onClick={()=>addques()}>add Question</button>
        
        </div>}
        </div>
    
    );
}
 
export default ContestScreen;

