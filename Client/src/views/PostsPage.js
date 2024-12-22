import React, { useEffect, useRef, useState } from 'react';
import './PostsPage.css';
import CommunityNavBar from "../components/CommunityNavBar";
import { Avatar, Button, Card, CardBody, Dialog, DialogBody, DialogFooter, DialogHeader, IconButton, Input, Spinner, Typography } from '@material-tailwind/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAdd, faEdit, faHeart as faHeartSolid, faTimes } from '@fortawesome/free-solid-svg-icons';
import { faHeart as faHeartRegular } from '@fortawesome/free-regular-svg-icons';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { requestAPI, useAPI } from '../hooks/useAPI';
import { useNavigate, useParams } from 'react-router-dom';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import {ConfirmDialog} from '../dialogs/ConfirmDialog'
import { set } from 'date-fns';

function Comment({allowDelete, photo, name, color, comment, onDelete}) {
    const [deleting, setDelete] = useState(false);
    async function handleDelete() {
        setDelete(true);
        await onDelete();
        setDelete(false);
    }
    return (
        <div className='flex flex-row items-center gap-2 justify-between'>
            <div className='flex items-center gap-2'>
            <Avatar size='sm' className='border border-gray-700' src={photo} />
            <Card className='border border-gray-500 p-1' >
                <Typography variant='small' className='font-bold'>{name}</Typography>
                <Typography variant='small' className='text-xs'>{comment}</Typography>
            </Card>
            </div>

            {allowDelete? <IconButton variant='text' className='fas fa-ellipsis-h self-end' onClick={()=>onDelete()}>
                    {deleting? <Spinner/> : <FontAwesomeIcon icon={faTrash} size="lg" className="text-red-400" />}
            </IconButton> : <></>}
        </div>)

}

const Post = ({data, isAdmin, id, author, content, images, topComment, initLike, onDelete}) => {
    const parm = useParams();
    const nav = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));
    const [liked, setLiked] = useState(false);
    const [openComments, setOpenComments] = useState(false);

    const [loadingReaction, setLoadingReaction] = useState(false);
    async function handleReaction() {
        const likeState = liked;
        setLiked(!likeState);
        setLoadingReaction(true);
        const { data, status } = await requestAPI('/posts/like', 'post', {body:{postId:id, userId:user.id, state:!likeState}});
        if(status>=200 && status<300) {
            
        }else{
            setLiked(likeState);
        }
        setLoadingReaction(false);
    }

    useEffect(() => {
        setLiked(initLike);
    }, [])


    const [comments, loadingComments, refreshComment] = useAPI('/posts/comments', 'get', {params:{postId:id}});


    const [commentInput, setCommentInput] = useState('');
    async function handleComment() {
        if(commentInput == '') return;

        const {data,status} = await requestAPI('/posts/comments', 'post', {body:{postId:id, userId:user.id, content:commentInput}});
        setCommentInput('');

        if(status>=200 && status<300) {
            refreshComment();
        }else{
            alert("Something went wrong.");
        }
    }


    //DELETE
    const [deleting , setDeleting] = useState(false);
    async function handleDelete() {
        setDeleting(true);
        await onDelete();
        setDeleting(false);
    }

    async function handleDeleteComment(commentID){
        const {data, status} = await requestAPI(`/posts/comments/${commentID}`, 'delete', {body:{userId:user.id, postId:id}});
        if(status>=200 && status<300) { 
            refreshComment();
        }
    }

    function handlePostEdit(){
        nav(`/community/${encodeURIComponent(parm.name)}/posts/edit/${id}`, {state:data});
    }

    return (
        <>
        <Card className="m-auto mt-4 sm:max-w-2xl text-left border border-gray-400">
        <CardBody>
            <div className='flex justify-between'>
            <div className='post-header mb-2'>
                <Avatar className='border border-gray-700' src={author.avatar} />
                <Typography className='font-bold' variant='small' style={{color:author.color}}>{author.name}</Typography>
            </div>
            <div>
                {
                    author.id == user.id || isAdmin?
                <IconButton variant='text' className='fas fa-ellipsis-h' onClick={()=>handleDelete()}>
                    {deleting? <Spinner/> : <FontAwesomeIcon icon={faTrash} size="lg" className="text-red-400" />}
                </IconButton>
                : <></>
                }
                { author.id == user.id?
                <IconButton variant='text' className='fas fa-ellipsis-h' onClick={handlePostEdit}>
                    <FontAwesomeIcon icon={faEdit} size="lg" className="text-gray-700" />
                </IconButton> : <></>
                }
            </div>

            </div>

            <Typography variant='small'>{content}</Typography>
            <div className='flex overflow-x-auto mt-2 gap-2'>
                {images.map((image, index) => (
                    <img
                    key={index}
                    className="m-auto h-28 w-52 object-cover"
                    src={image.src}
                    alt={image.alt}
                    />
                ))}
            </div>
            
            
            <div className='h-1 border-b-2 m-1 border-gray-500' />

            {topComment == null? <></>:
            <Comment photo={author.avatar} name={author.name} comment={content} />}
            <div className='flex justify-end'>
                <Button variant='text' className='text-gray-500' onClick={()=>setOpenComments(true)}>View all comments</Button>
            </div>
            <div className='h-1 border-t-2 border-gray-500' />

            <div className='flex gap-4 mt-3 items-center'>
                <Input value={commentInput} onChange={(e)=>setCommentInput(e.target.value)}/>
                <IconButton variant='text' className='fas fa-paper-plane' onClick={()=>handleComment()}>
                    <FontAwesomeIcon icon={faPaperPlane} color="black" size="2x" className="text-gray-700" />
                </IconButton>
                <IconButton variant='text' className='fas fa-heart' loading={loadingReaction} onClick={()=>handleReaction()}>
                    <FontAwesomeIcon icon={liked? faHeartSolid : faHeartRegular} color="black" size="2x" className="text-gray-700" />
                </IconButton>
            </div>
            <Typography variant='small' className='text-gray-500'>2 hours ago</Typography>
        </CardBody>
        </Card>
        <Dialog open={openComments} onClose={()=>setOpenComments(false)}>
            <DialogBody className=''>
                <DialogHeader className='flex justify-between p-0'>
                <Typography variant='h5'>Comments</Typography>
                <IconButton variant='text' className='fas fa-times' onClick={() => setOpenComments(false)}>
                    <FontAwesomeIcon icon={faTimes} color="black" size="2x" className="text-gray-700" />
                </IconButton>
                </DialogHeader>
                <DialogBody className='flex  h-96 flex-col gap-2 overflow-y-auto'>
                    {loadingComments? <Spinner/> : (comments.data.comments.length == 0 ? <p>No comments yet, be the first!</p> : comments.data.comments.map((comment, index) => <Comment onDelete={async ()=> handleDeleteComment(comment.comment_id)} allowDelete={isAdmin || comment.user_id == user.id} photo={comment.photo} name={(comment.fname + " " + comment.lname)} comment={comment.content} />))}
                </DialogBody>
            </DialogBody>
        </Dialog>
        </>
    );
};

const PostsPage = () => {
    const nav = useNavigate();
    const parm = useParams();
    const user = JSON.parse(localStorage.getItem('user'));
    const [data, loadingData, refreshData] = useAPI('/posts', 'get', {params:{communityName:parm.name, userId:user.id}});

    async function handleDeletePost(id) {
        const {data, status} = await requestAPI('/posts', 'delete', {body:{userId:user.id,  postId:id}});
        if(status>=200 && status<300) {
            refreshData();
        }else{
            alert("Something went wrong");
        }
    }

    const [currentRole, setCurrentRole] = useState(null)
    async function getRole(roles) {
        const {data, status} = await requestAPI('/communities/user', 'get', {params:{userId:user.id}});
        if(data == null) return
        console.log("User is admin in community");
        if(status>=200 && status<300) {
            setCurrentRole( data.data.communities.find((c)=> c.name == parm.name).role_id);
        }else{
            alert("Not authorized");
            nav('/home');
        }
    
    }

    useEffect(()=> {  
        getRole();
    }, []);

    return ( 
        <div style={{}}>
            <CommunityNavBar />


            {loadingData? <div className='h-screen flex'><Spinner className='m-auto '/></div> : 
            data.data.posts.length == 0 ?
            <p>No posts yet</p> :
            (data.data == null? [] : data.data.posts).map((post, index) => 
            <Post 
                data={post}
                id={post.id}
                author={{id:post.user_id, name:(post.fname + " " + post.lname), avatar: post.photo, color: post.color }} 
                content={post.text_content} 
                images={post.images == null? [] : [...post.images].map((image) => ({src: image, alt: "Post image"}))}
                topComment={post.comments == null? null : post.comments[0]}
                initLike={post.liked}
                onDelete={async ()=>handleDeletePost(post.id)}
                isAdmin={currentRole == 1}  
            />)}

            <div className='absolute w-full h-screen'>
                <div className="fixed bottom-2 right-2 rounded-full">
                <Button 
                    
                    size="lg" 
                    style={{backgroundColor: 'var(--primary-color)'} }
                    onClick={() => nav(`/community/${encodeURIComponent(parm.name)}/posts/edit`)}
                >
                    <FontAwesomeIcon icon={faAdd} size="2x" />
                </Button>
                </div>
            </div>
        </div> 
    );
}
 
export default PostsPage;