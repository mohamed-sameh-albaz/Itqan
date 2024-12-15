import React, { useState } from 'react';
import './PostsPage.css';
import CommunityNavBar from "../components/CommunityNavBar";
import { Avatar, Button, Card, CardBody, Dialog, DialogBody, DialogFooter, DialogHeader, IconButton, Input, Spinner, Typography } from '@material-tailwind/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAdd, faHeart as faHeartSolid, faTimes } from '@fortawesome/free-solid-svg-icons';
import { faHeart as faHeartRegular } from '@fortawesome/free-regular-svg-icons';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { useAPI } from '../hooks/useAPI';

function Comment({photo, name, color, comment}) {
    return (
        <div className='flex flex-row items-center gap-2'>
            <Avatar size='sm' className='border border-gray-700' src={photo} />
            <Card className='border border-gray-500 p-1' variant='small'>
                <Typography variant='small' className='font-bold'>{name}</Typography>
                <Typography variant='small' className='text-xs'>{comment}</Typography>
            </Card>
        </div>)

}

const Post = ({ author, content, images }) => {
    const [liked, setLiked] = useState(false);
    const [openComments, setOpenComments] = useState(false);
    return (
        <>
        <Card className="m-auto mt-4 sm:max-w-2xl text-left border border-gray-400">
        <CardBody>
            <div className='post-header mb-2'>
                <Avatar className='border border-gray-700' src={author.avatar} />
                <Typography className='font-bold' variant='small' style={{color:author.color}}>{author.name}</Typography>
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
            
            <Comment photo={author.avatar} name={author.name} comment={content} />
            <div className='flex justify-end'>
                <Button variant='text' className='text-gray-500' onClick={()=>setOpenComments(true)}>View all comments</Button>
            </div>
            
            <div className='h-1 border-t-2 border-gray-500' />
            <div className='flex gap-4 mt-3 items-center'>
                <Input />
                <IconButton variant='text' className='fas fa-paper-plane'>
                    <FontAwesomeIcon icon={faPaperPlane} color="black" size="2x" className="text-gray-700" />
                </IconButton>
                <IconButton variant='text' className='fas fa-heart'>
                    <FontAwesomeIcon icon={liked? faHeartSolid : faHeartRegular} color="black" size="2x" className="text-gray-700" onClick={()=>setLiked(!liked)}/>
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
                <Comment photo={author.avatar} name={author.name} comment={content} />
                <Comment photo={author.avatar} name={author.name} comment={content} />
                <Comment photo={author.avatar} name={author.name} comment={content} />
                <Comment photo={author.avatar} name={author.name} comment={content} />
                <Comment photo={author.avatar} name={author.name} comment={content} />
                <Comment photo={author.avatar} name={author.name} comment={content} />
                <Comment photo={author.avatar} name={author.name} comment={content} />
                <Comment photo={author.avatar} name={author.name} comment={content} />
                <Comment photo={author.avatar} name={author.name} comment={content} />
                    
                </DialogBody>
            </DialogBody>
        </Dialog>
        </>
    );
};

const PostsPage = () => {
    const [data, loadingData] = useAPI('/posts', 'get', {params:{communityId:1}});

    return ( 
        <div style={{}}>
            <CommunityNavBar />

            {loadingData? <div className='h-screen flex'><Spinner className='m-auto '/></div> : data.data.posts.map((post, index) => 
            <Post 
                author={{ name:(post.fname + " " + post.lname), avatar: post.photo, color: post.color }} 
                content={post.content} 
                images={post.images == null? [] : [...post.images].map((image) => ({src: image, alt: "Post image"}))}
            />)}
            <Button 
                className="absolute bottom-0 right-0 rounded-full" 
                size="lg" 
                style={{backgroundColor: 'var(--primary-color)'}}
                onClick={() => console.log('Add button clicked')}
            >
                <FontAwesomeIcon icon={faAdd} size="2x" />
            </Button>
        </div> 
    );
}
 
export default PostsPage;