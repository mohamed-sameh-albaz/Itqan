import React, { useState } from 'react';
import { data, useLocation, useNavigate, useParams } from 'react-router-dom';
import CommunityNavBar from '../components/CommunityNavBar';
import './AddPostPage.css';
import { requestAPI } from "../hooks/useAPI"; 
import { set } from 'date-fns';
import { Button } from '@material-tailwind/react';

const AddPostPage = ({editing}) => {
  const location = useLocation();
  const postData = location.state ?? null;

  const [Title, setTitle] = useState(postData == null ? '' : postData.title ?? '');
  const [Content, setContent] = useState(postData == null ? '' : postData.text_content ?? '');
  const [images, setImages] = useState(postData == null ? [] : postData.images ?? []);
  const navigate = useNavigate();
  const parms = useParams();
  const communityName = parms.name;
  const user = JSON.parse(localStorage.getItem('user'));


  const [isSubmitting, setIsSubmitting] = useState(false);


  /*
  {
    "userId": 2,
    "title": "updated post1",
    "postId": 5,
    "text": "Hello World!",
    "images": [
        "url 1",
        "url 2",
        "url 3",
        "dadsads"
    ]
}*/
  async function handleSubmit (e) {
    e.preventDefault();
    if(!editing){
      console.log('Post submitted:', { Title, Content });
      console.log(images.map(image => image.name));
      setIsSubmitting(true);
      const { status, data } = await requestAPI('/posts', 'post', {
        body: {
          title: Title,
          userId: user.id,
          communityName: communityName, 
          text: Content,
          images: images.map(image => image.name)
        }
      });
      if (status > 199 && status < 300) {
        console.log("success");
        alert("Post added successfully");
      } else {
        console.log("error");
        alert("Post failed to add");
      }
      setIsSubmitting(false);
    }else{
      setIsSubmitting(true);
      const { status, data } = await requestAPI('/posts/user', 'put', {
        body: {
          title: Title,
          userId: user.id,
          communityName: communityName, 
          text: Content,
          images: images.map(image => image.name),
          postId: postData.id,
        }
      });
      if(status > 199 && status < 300){
        alert("Post edited successfully");
      }
      else 
        alert("Post failed to edit");
      setIsSubmitting(false);
      }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages((prevImages) => [...prevImages, ...files]);
  };

  return (
    <div>
      <CommunityNavBar />
      <div className="container mx-auto mt-5">
        <div className="flex justify-center">
          <div className="w-full max-w-lg">
            <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
              <h2 className="text-center mb-4 text-2xl font-bold">Add New Post</h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
                    Title
                  </label>
                  <input
                    id="title"
                    type="text"
                    placeholder="Enter post title"
                    value={Title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                </div>
                <div className="mb-4">                  
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="content">
                    Content
                  </label>
                  <textarea
                    id="content"
                    rows={5}
                    placeholder="Enter post content"
                    value={Content}
                    onChange={(e) => setContent(e.target.value)}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  ></textarea>
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="image">
                    Image
                  </label>
                  <input
                    id="image"
                    type="file"
                    onChange={handleImageChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                  {images.map((image, index) => (
                    <img
                      key={index}
                      src={URL.createObjectURL(image)}
                      alt={`preview-${index}`}
                      className="w-16 h-16 object-cover border rounded"
                    />
                  ))}
                </div>
                <div className="flex items-center justify-between">
                  <Button
                    type="submit"
                    loading={isSubmitting}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  >
                    {editing? "Save" : "Submit"}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddPostPage;