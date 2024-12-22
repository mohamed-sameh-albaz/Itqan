import { Button, Dialog, DialogBody, DialogFooter, DialogHeader, Input, Typography } from "@material-tailwind/react";
import { useEffect, useState } from "react";

import { Alert } from "@material-tailwind/react";
import { requestAPI } from "../hooks/useAPI";
 
function Icon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-6 w-6"
    >
      <path
        fillRule="evenodd"
        d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
        clipRule="evenodd"
      />
    </svg>
  );
}
 
const InputError = ({ error }) => {
    return ( <div style={{visibility: error? "visible" : "hidden"}}>
        <Typography
          variant="small"
          color='red'
          className="mt-2 flex items-center gap-1 font-normal">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="-mt-px h-4 w-4"
        >
        <path
          fillRule="evenodd"
          d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 01.67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 11-.671-1.34l.041-.022zM12 9a.75.75 0 100-1.5.75.75 0 000 1.5z"
          clipRule="evenodd"
        />
      </svg>
      Use at least 8 characters, one uppercase, one lowercase and one number.
    </Typography>
    </div> );
}
 

const CreateGroupDialog = ({groupId, refresh, communityName, open, setOpen, setAlert}) => {
    const [name, setName] = useState(groupId == null ? "" : groupId.title);
    const [nameError, setNameError] = useState(false);
    const [description, setDescription] = useState(groupId == null ? "" : groupId.description);
    const [descriptionError, setDescriptionError] = useState(false);

    const [waitingForCreateGroup, setWaitingForCreateCommunity] = useState(false);

    useEffect(()=>{
      setName(groupId == null ? "" : groupId.title);
      setDescription(groupId == null ? "" : groupId.description);
    }, [groupId]);

    async function createGroup() {
        if(name.length < 1){
            setNameError(true);
            return;
        }

        if(description.length < 1){
            setDescriptionError(true);
            return;
        }

        setWaitingForCreateCommunity(true);
        
        if(groupId == null){
        
          const {data, status} = await requestAPI('/groups', 'post', {body: {description, title: name, photo: "https://example.com/photo.jpg", community_name: communityName}});
      
          if(status > 199 && status < 300){
            refresh();

              setAlert(`${name} group created successfully`);

          }
          else{
              setAlert("Failed to create group");
          }

        }else{
          const {data, status} = await requestAPI(`/groups/${groupId.id}`, 'put', {body: {description, title: name, photo: "https://example.com/photo.jpg", community_name: communityName}});
      
          if(status > 199 && status < 300){
            refresh();
              setAlert(`${name} group updated successfully`);
          }
          else{
              setAlert("Failed to update group");
          }
        }
        setWaitingForCreateCommunity(false)
        setOpen();

    }

    return ( <Dialog open={open} onClose={()=>setOpen()}>
    <DialogHeader>Create group</DialogHeader>
    <DialogBody>
        <div className="w-auto">
            <Input label="Name" value={name} onChange={(e)=>setName(e.target.value)} error={nameError}/>
        </div>
        <InputError error={nameError} />
        <div className="w-auto">
            <Input label="Description" value={description} onChange={(e)=>setDescription(e.target.value)} error={descriptionError}/>
        </div>
        <InputError error={descriptionError} />
    </DialogBody>
    <DialogFooter>
      <Button variant="outlined" color="red" onClick={()=>setOpen()}>Cancle</Button>
      <div className="w-2"/>
      <Button variant="filled" loading={waitingForCreateGroup} style={{backgroundColor: '#000B58'}} onClick={()=>createGroup()} >Yes, Create</Button>
    </DialogFooter>
  </Dialog> );
}
 
export default CreateGroupDialog;