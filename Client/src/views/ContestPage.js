import CommunityNavBar from "../components/CommunityNavBar";
import ContestScreen from "../components/ContestScreen";
import React, { useState } from "react";
import "./ContestPage.css";
const ContestPage = () => {

  let s = "Submit";
  let allow_read = "readOnly";
 
  let buttons = ['Question', 'A','B']
  const [buttonText, setButtonText] = useState(s);
  const [TextAllow, setTextAllow] = useState(allow_read);
  const handleClick = () => { 
  setButtonText(s => s === "Submit" ? "Save" : "Submit");
  setTextAllow(allow_read => allow_read === "readOnly" ? "" : "readOnly");
   };
 
    return (
      <div>
        <CommunityNavBar />
        <ContestScreen allow_read={TextAllow} buttons={buttons} />
        <div className="keep">Keep Going</div>
        <button className="submitt" onClick={handleClick}>
          {buttonText}
        </button>
    </div>
    );
    
}
 
export default ContestPage;