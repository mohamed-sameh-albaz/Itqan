import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import CommunityNavBar from '../components/CommunityNavBar';
import './AddPostPage.css';
import { requestAPI } from "../hooks/useAPI"; 

const AddPostPage = () => {
  const [Title, setTitle] = useState('');
  const [Content, setContent] = useState('');
  const [images, setImages] = useState([]);
  const navigate = useNavigate();
  let user_id = 7;

  async function handleSubmit (e) {
    
    e.preventDefault();
    // Handle form submission logic here
    console.log('Post submitted:', { Title, Content });
    console.log( images.map(image => image.name));
     
    const { status, data } = await
          requestAPI(  
            '/posts',
            'post',
            {
              body: {
                title: Title,
                userId: user_id,
                communityId:2, 
                text: Content,
                images: images.map(image => image.name)
              }
            }
          )
          if (status > 199 && status < 300) {
            console.log("sucssess");
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
      <Container className="mt-5">
        <Row className="justify-content-md-center">
          <Col md="8">
            <Card className="shadow-lg p-3 mb-5 bg-white rounded">
              <Card.Body>
                <h2 className="text-center mb-4">Add New Post</h2>
                <Form onSubmit={handleSubmit}>
                  <Form.Group controlId="formTitle" className="mb-3 text-start">
                    <Form.Label>Title</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter post title"
                      value={Title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                  </Form.Group>
                  <Form.Group
                    controlId="formContent"
                    className="mb-3 text-start"
                  >
                    <Form.Label>Content</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={5}
                      placeholder="Enter post content"
                      value={Content}
                      onChange={(e) => setContent(e.target.value)}
                    />
                  </Form.Group>
                  <Form.Group controlId="formImage" className="mb-3 text-start">
                    <Form.Label>Image</Form.Label>
                    <Form.Control type="file" onChange={handleImageChange} />
                  </Form.Group>
                  <div className="image-preview">
                    {images.map((image, index) => (
                      <img
                        key={index}
                        src={URL.createObjectURL(image)}
                        alt={`preview-${index}`}
                        className="image-thumbnail"
                      />
                    ))}
                  </div>
                  <Button variant="primary" type="submit" className="w-100">
                    Submit
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default AddPostPage;