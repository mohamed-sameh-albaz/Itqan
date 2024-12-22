import { useParams } from "react-router-dom";
import './ProfilePage.css';
import CommunityNavBar from "../components/CommunityNavBar";
import { Button, Dialog, DialogHeader, IconButton, Typography, Spinner, Card } from "@material-tailwind/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { useEffect, useState } from "react";
import { HttpStatusCode } from "axios";
import { requestAPI, useAPI } from "../hooks/useAPI";
import { faClose, faEdit, faKey } from "@fortawesome/free-solid-svg-icons";

import '../assets/badge.png';
const UpdatePasswordDialog = ({open, onClose}) => {
    const parm = useParams();

    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');

    const [waitingForUpdate, setWaitingForUpdate] = useState(false);

    const validatePassword = () => {
        // Add logic to validate password
        const isValid = newPassword === confirmNewPassword && newPassword.length >= 8;
        return isValid;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setWaitingForUpdate(true);
        
        const userResponse = await requestAPI('/users', 'get', {params: {userId: parm.id}});
    
        if(userResponse.status != HttpStatusCode.Ok){
            alert('Something went wrong');
            setWaitingForUpdate(false);
            return
        }
        const user = userResponse.data.data.user;
        user.userId = user.id;
        user.password = newPassword;
        user.firstname = user.fname;
        user.lastname = user.lname;
        const {status, data} = await requestAPI('/users/edit', 'put', {body: user} );

        if(status == HttpStatusCode.Ok){
            alert('Password updated successfully');
            onClose();
            setWaitingForUpdate(false);
            return
        }

        setWaitingForUpdate(false);
        alert('Something went wrong. Update failed');
    };
    return ( 
        <Dialog size="sm" open={open} onClose={onClose}>
            <DialogHeader className="flex justify-between items-center">
                <Typography variant="h6" className="mb-4">Update Password</Typography>
                <IconButton variant="text" onClick={onClose}>
                    <FontAwesomeIcon size="2x" icon={faClose} />
                </IconButton>
            </DialogHeader>
            <form className="p-4" onSubmit={handleSubmit}>
                <input 
                    value={currentPassword}
                    onChange={(e)=>setCurrentPassword(e.target.value)}
                    type="password" 
                    placeholder="Current Password" 
                    className="border border-gray-300 rounded-lg p-2 mb-4 w-full"
                />
                <input 
                    value={newPassword}
                    onChange={(e)=>setNewPassword(e.target.value)}
                    type="password" 
                    placeholder="New Password" 
                    className="border border-gray-300 rounded-lg p-2 mb-4 w-full"
                />
                <input 
                    value={confirmNewPassword}
                    onChange={(e)=>setConfirmNewPassword(e.target.value)}
                    type="password" 
                    placeholder="Confirm New Password" 
                    className="border border-gray-300 rounded-lg p-2 mb-4 w-full"
                />
                <Button loading={waitingForUpdate} type="submit" fullWidth style={{backgroundColor: '#000B58'}}>Update</Button>
            </form>
        </Dialog> 
    );
}
 
const ProfilePage = () => {
    const parm = useParams();
    
    //Profile INFO
    const lorm = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
    const [photo, setPhoto] = useState(parm.name)
    const [firstName, setFirstName] = useState(parm.name)
    const [secondName, setSecondName] = useState(parm.name)
    const [email, setEmail] = useState(parm.name)
    const name = firstName + ' ' + secondName;
    const [bio, setBio] = useState(lorm)

    const [level, setLevel] = useState();
    const [point, setPoint] = useState();
    //Edit Profile
    const [allowEdit, setAllowEdit] = useState(false);
    const [waitingForSave, setWaitingForSave] = useState(false);
    const handleSave = async () => {
        setWaitingForSave(true);
        const {status, data} = await requestAPI('/users/edit', 'put', {body: {userId: parm.id, firstname: firstName, lastname: secondName, bio, email}});
        if(status == HttpStatusCode.Ok){
            alert('Profile updated successfully');
        }else{
            alert('Failed to update profile');
            window.location.reload();
        }
        setAllowEdit(false);
        setWaitingForSave(false);
    }

    //Change Password
    const [changePasswordDialog, setChangePasswordDialog] = useState(false);

    const [loadingProfile, setLoadingProfile] = useState(true);
    //Initial Profile Request
    async function requestProfile(){
        setLoadingProfile(true);
        const {status, data} = await requestAPI('/users', 'get', {params: {userId: parm.id}});
        if(status == HttpStatusCode.Ok){
            setFirstName(data.data.user.fname);
            setSecondName(data.data.user.lname);
            setBio(data.data.user.bio);
            setEmail(data.data.user.email);
            setPhoto(data.data.user.photo);
            setLoadingProfile(false);
            setPoint(data.data.user.points);
            setLevel(data.data.user.level_name);
        }
    }

    // const [loadingRewards, setLoadingRewards] = useState(true);
    const [rewards, loadingRewards, refreshRewards] =  useAPI('/rewards', 'get', {params: {page:1, limit: 10, userId: parm.id}});
    // async function requestRewards(){
    //     setLoadingRewards(true);

    //     const {status, data} = await requestAPI('/rewards?page=1&limit=10&userId=6', 'get', {params: {page:1, limit: 10, userId: parm.id}});

    //     setLoadingRewards(false);
    // }


    useEffect(() => {
        requestProfile();
    }, [])

    return ( 
        <div className="profile-page">
            <CommunityNavBar />
            <div className="profile-content max-w-4xl m-auto  h-48">
                <div className="profile-header w-full h-full">
                {loadingProfile? <Spinner className="m-auto"/> : <>
                    <div className="w-40">
                    <img className="aspect-square" src={photo??"https://avatar.iran.liara.run/public/boy"} alt="profile" />
                    <div className="flex justify-items-center items-center">
                    <div className="mt-2 border border-gray-800 w-28 text-center rounded">
                        {level}: {point}
                    </div>
                    </div>
                    </div>
                    <form className="profile-description w-full p-3">
                        {allowEdit? 
                        <div className="flex">
                        <input 
                            value={firstName} 
                            className="border border-gray-600 w-fit rounded-lg p-1 text-xl text-gray-800"
                            onChange={allowEdit ? (e) => setFirstName(e.target.value) : null} 
                        />
                        <input 
                            value={secondName} 
                            className="border border-gray-600 rounded-lg p-1 text-xl text-gray-800"
                            onChange={allowEdit ? (e) => setSecondName(e.target.value) : null} 
                        />
                        </div> :
                        <Typography variant="h5" className="font-normal" style={{fontFamily: 'Lalezar'}}>{name}</Typography>}
                        <textarea 
                            style={{width: '100%', resize: 'none'}} 
                            disabled={!allowEdit}
                            value={bio} 
                            className="w-full h-full text-gray-700" 
                            onChange={allowEdit ? (e) => setBio(e.target.value) : null}
                        />
                    </form>

                    <div className="flex flex-col gap-2">
                        <IconButton
                            onClick={()=>setAllowEdit(!allowEdit)}
                            style={{backgroundColor: '--var(--primary-color)'}}>
                            <FontAwesomeIcon icon={!allowEdit? faEdit : faClose} />
                        </IconButton>
                        <IconButton
                            onClick={()=>setChangePasswordDialog(true)}
                            style={{backgroundColor: '--var(--primary-color)'}}>
                            <FontAwesomeIcon icon={faKey} />
                        </IconButton>
                    </div>
                    </>}
                </div>
                {allowEdit? <Button fullWidth onClick={handleSave} loading={waitingForSave} style={{backgroundColor: '#000B58'}}>Save</Button> : null}

                <h3>Rewards: </h3>
                <div className="p-2 profile-rewards flex flex-wrap gap-2 w-full min-h-52 justify-start">
                {loadingRewards? <Spinner className="m-auto"/> : rewards.data.rewards.map((reward, index) =>
                    <div className="w-24" key={index}>
                    <Card className="m-3 aspect-square overflow-clip" variant="filled" shadow="hover">  
                            <img src={reward.image?? require('../assets/badge.png')} alt="default badge" className="w-full h-full object-cover" />
                    </Card>
                    <Typography variant="small" style={{fontFamily: 'Lalezar'}} className="text-center w-full text-gray-800">{reward.name}</Typography>
                    </div>
                )}

                </div>
{/* 
                <h3>Communities: </h3>
                <div className="profile-rewards"></div> */}
            </div>     
            <UpdatePasswordDialog open={changePasswordDialog} onClose={()=>setChangePasswordDialog(false)}/>
        </div>
    );
}
 
export default ProfilePage;