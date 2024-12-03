
import React, { useState } from "react"
import "./ContestScreen.css"
const ContestScreen = () =>
{
     const [activeIndex, setActiveIndex] = useState(null); // Track the clicked button index

     const handleClick = (index) => {
       setActiveIndex(index);
     };
 
  const buttons = ["Question","A", "B", "C", "D", "E", "F", "G", "H"];

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
                <input type="text" readOnly className="title" />
              </div>
              <textarea type="text" readOnly className="content" />
            </div>
            <div className="ANS">
              <label htmlFor="ans" className="Ans">
                Answer :
              </label>
              <textarea type="text" className="ans" rows="5" />
            </div>
          </div>
        </div>
    
    );
}
 
export default ContestScreen;

