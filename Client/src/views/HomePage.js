import React, { useEffect, useState } from "react";
import "./HomePage.css"; // Make sure to import the CSS file
import CommunityCard from "../components/CommunityCard"; // Import the new component
import HomeNavBar from "../components/HomeNavBar"; // Import the HomeNavBar component
import {requestAPI, useAPI} from "../hooks/useAPI";
import { useNavigate } from "react-router-dom";
import { Button, ButtonGroup, Card, Dialog, DialogBody, DialogFooter, DialogHeader, Input, Spinner, Typography } from "@material-tailwind/react";
import {faAdd} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
const HomePage = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  const nav = useNavigate();
  const [viewAll, setViewAll] = useState(false);

  const [allCommunities, isAllCommunitiyLoading] = useAPI('/communities', 'get', {params: {userId: user.id}});
  const [userCommunities, isUserCommunitiyLoading] = useAPI('/communities/user', 'get', {params: {userId: user.id}});
  console.log(allCommunities, " ", userCommunities);
  useEffect(() => {
    localStorage.getItem("user") ?? nav("/auth#login");
  }, [])

  function toggleAll(){
    setViewAll(!viewAll);
  }

  function onCommunityClicked(name, role){
    const joined = role != null;
    if(joined){
      nav(`/community/${name}`, {state: {role: "Participant"}});
    }else{
      setIsJoinConfirmDialogOpen(true);
      setSelectedCommunityName(name);
    }
  }

  async function joinCommunity(name){
    setLoadingJoinCommunity(true);
    const {response, status} = await requestAPI('/communities/join', 'post',  {  body:{
      userId: user.id,
      communityName: name,
      roleId: 3 //1 = Admin, 2 = Leader, 3 = Participant
    }})
    if(status > 199 && status < 300){
      nav(`/community/${name}`);
    }else{
      alert("Failed to join community");
    }
    setLoadingJoinCommunity(false);
  }

  console.log(allCommunities, " ", userCommunities);
  const [isJoinConfirmDialogOpen, setIsJoinConfirmDialogOpen] = useState(false);
  const [selectedCommunityName, setSelectedCommunityName] = useState(null);
  const [loadingJoinCommunity, setLoadingJoinCommunity] = useState(false);

  const colors = ['#BE181B', '#4807E0', '#3DB741', '#E5A226', '#DBD827', '#BF2794', '#B2084C', '#1AB8C0']
  const [isCreateComDialogOpen, setIsCreateComDialogOpen] = useState(false);
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const [communityName, setCommunityName] = useState("");
  const [communityDes, setCommunityDes] = useState("");
  const [communityNameError, setCommunityNameError] = useState(false);
  const [waitingForCreateCommunity, setWaitingForCreateCommunity] = useState(false);


  async function createCommunity(){
    setWaitingForCreateCommunity(true);
    const {data, status} = await requestAPI('/communities', 'post', {body: {
      name: communityName,
      color: colors[selectedColorIndex],
      description: "A community for " + communityName,
      userId: user.id
    }})
    setWaitingForCreateCommunity(false);
    
    if(status > 199 && status < 300){
      nav(`/community/${communityName}`);
    }else{
      setCommunityNameError(true);
    }

  }

  return (
    <div>
      <HomeNavBar userName = {user.fname + " " + user.lname}/>
      <Dialog open={isJoinConfirmDialogOpen} onClose={()=>setIsJoinConfirmDialogOpen(false)}>
        <DialogHeader>Are you sure you want to join Logic Design.</DialogHeader>
        <DialogFooter>
          <Button variant="outlined" color="red" onClick={()=>setIsJoinConfirmDialogOpen(false)}>Cancle</Button>
          <div className="w-2"/>
          <Button variant="filled" loading={loadingJoinCommunity} style={{backgroundColor: '#000B58'}} onClick={()=>joinCommunity(selectedCommunityName)}>Yes, Join</Button>
        </DialogFooter>
      </Dialog>

      <Dialog open={isCreateComDialogOpen} onClose={()=>setIsCreateComDialogOpen(false)}>
        <DialogHeader>Create community</DialogHeader>
        <DialogBody>
          <div className="w-auto">
            <Input label="Community name" value={communityName} onChange={(e)=>setCommunityName(e.target.value)} error={communityNameError}/>
          </div>

          <div style={{visibility: communityNameError? "visible" : "hidden"}}>
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
      </div>
      <div className="w-auto pt-3">
            <Input label="Community description" value={communityDes} onChange={(e)=>setCommunityDes(e.target.value)}/>
      </div>
          <Typography className="mt-5 ml-2">Color</Typography>
          <div className="flex flex-row gap-2  ml-3">
          {colors.map((color, index) => <div key={index} className="w-9 h-9 rounded-full" style={{backgroundColor: color, border: selectedColorIndex == index? "3px solid black" : "3px solid white"}} onClick={()=>setSelectedColorIndex(index)}></div>)}
          </div>
        </DialogBody>
        <DialogFooter>
          <Button variant="outlined" color="red" onClick={()=>setIsCreateComDialogOpen(false)}>Cancle</Button>
          <div className="w-2"/>
          <Button variant="filled" loading={waitingForCreateCommunity} style={{backgroundColor: '#000B58'}} onClick={()=>createCommunity()} >Yes, Create</Button>
        </DialogFooter>
      </Dialog>
      <div className="content">
        {/* <div className="all-btn" onClick={toggleAll}>
          {viewAll ? "My" : "All"}
        </div> */}
        <div className="flex flex-row justify-between">
          <h2 className="text-2xl text-left mt-8">{viewAll? "All communities" : "Your communities"}</h2>
          <div>
          <ButtonGroup size="sm" color="primary">
          <Button onClick={()=>setViewAll(false)} className="bg-primary">My</Button>
          <Button onClick={()=>setViewAll(true)} className="bg-primary">All</Button>
          </ButtonGroup>
          </div>

        </div>
        {((viewAll && isAllCommunitiyLoading) || (!viewAll && isUserCommunitiyLoading)) ? <div className=" w-full"><Spinner className="m-auto" /> </div> 
        : 
        <div className="community-grid">
          {(viewAll? allCommunities.data.communities : userCommunities.data.communities).map((community, index)=> 
                                                                    <CommunityCard
                                                                      key={community.name}
                                                                      title={community.name}
                                                                      description={community.description}
                                                                      number={index}
                                                                      buttonText={ (community.role_color === null)? "Join" : "View"}
                                                                      color= {community.role_color}
                                                                      onClick={()=>onCommunityClicked(community.name, community.role_id)}/>
                                                                      )}
      <Card className='w-48 h-48 text-left' variant="filled" shadow="hover" onClick={()=>setIsCreateComDialogOpen(true)} >
        <Card.Body className='cursor-pointer select-none flex flex-col h-full text-center justify-center' >
          <FontAwesomeIcon icon={faAdd} color="black" size="3x" className="text-gray-700"/>
          <Typography className="text-gray-800 font-bold">Create new community</Typography>
        </Card.Body>
      </Card>
        </div>}
      </div>
    </div>
  );
};

export default HomePage;
