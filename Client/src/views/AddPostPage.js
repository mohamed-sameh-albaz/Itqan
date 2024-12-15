import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CommunityNavBar from '../components/CommunityNavBar';
import './AddPostPage.css';
import { requestAPI } from "../hooks/useAPI"; 

const AddPostPage = () => {
  const [Title, setTitle] = useState('');
  const [Content, setContent] = useState('');
  const [images, setImages] = useState([]);
  const navigate = useNavigate();
  let user_id = 3;

  async function handleSubmit (e) {
    e.preventDefault();
    console.log('Post submitted:', { Title, Content });
    console.log(images.map(image => image.name));
     
    const { status, data } = await requestAPI('/posts', 'post', {
      body: {
        title: Title,
        userId: user_id,
        communityId: 2, 
        text: Content,
        images: images.map(image => image.name)
      }
    });
    if (status > 199 && status < 300) {
      console.log("success");
    } else {
      console.log("error");
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
                  <button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  >
                    Submit
                  </button>
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