import "./TeamEditorBlock.css"
/*import React, { useState } from "react";*/
const TeamEditorBlock = () => {


    return (
      <div>
        <div className="TE_all">
          <div className="des">
            create your team : hint you can send only 2 invitations
          </div>
          <div className="TeamName">
            <label htmlFor="name" className="lbl">
              Team name :
            </label>
            <input type="text" className="name" />
          </div>

          <div className="TeamMate">
            <label htmlFor="name" className="lbl">
              Team mates :
            </label>
            <input type="text" className="name" />
          </div>
          <button className="send">send invitation</button>
        </div>
      </div>
    );
}
 
export default TeamEditorBlock;