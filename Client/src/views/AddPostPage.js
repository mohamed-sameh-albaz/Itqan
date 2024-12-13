import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import CommunityNavBar from '../components/CommunityNavBar';
import './AddPostPage.css';

const AddPostPage = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log('Post submitted:', { title, content, image });
    // Navigate to the Community page
    navigate('/community');
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
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
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                  </Form.Group>
                  <Form.Group controlId="formContent" className="mb-3 text-start">
                    <Form.Label>Content</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={5}
                      placeholder="Enter post content"
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                    />
                  </Form.Group>
                  <Form.Group controlId="formImage" className="mb-3 text-start">
                    <Form.Label>Image</Form.Label>
                    <Form.Control
                      type="file"
                      onChange={handleImageChange}
                    />
                  </Form.Group>
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