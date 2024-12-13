import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap';
import NavigationBar from '../components/MyNavbar';
import Footer from '../components/Footer';
import {requestAPI} from '../hooks/useAPI';
import { useNavigate } from 'react-router-dom';
import { HttpStatusCode } from 'axios';

function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const nav = useNavigate();

  const toggleForm = () => {
    setIsLogin(!isLogin);
  };

  async function login(e) {
    e.preventDefault();

    if(isLogin){
      localStorage.setItem('email', document.getElementById('formBasicEmail').value);
      localStorage.setItem('password', document.getElementById('formBasicPassword').value);
      
      const {data, status} = await requestAPI('/users/login', 'post');
      
      if(status == HttpStatusCode.Ok){
        localStorage.setItem('user', JSON.stringify(data.data.user));
        nav('/home');
      }else if (status == HttpStatusCode.Unauthorized) {
        alert("Invalid email or password");
        localStorage.removeItem('email');
        localStorage.removeItem('password');
      } else {
        alert("Something went wrong please try again");
        localStorage.removeItem('email');
        localStorage.removeItem('password');
      }

    }else{
      const firstname = document.getElementById('formFirstName').value;
      const lastname = document.getElementById('formLastName').value;
      const email = document.getElementById('formBasicEmail').value;   
      const password = document.getElementById('formBasicPassword').value;
      const bio = document.getElementById('formBio').value; 

      const {data, status} = await requestAPI('/users', 'post', {body: {firstname, lastname, email, password, bio}});

      if(status > 199 && status < 300){
        localStorage.setItem('user', JSON.stringify(data.data.user));
        localStorage.setItem('email', email);
        localStorage.setItem('password', password);
        nav('/home');
      } else{
        console.log(data)
        alert("Error: "+ data.details[0].error);
        localStorage.removeItem('email');
        localStorage.removeItem('password');
      }
    }
  }

  return (
    <Container fluid className="p-0 container-fluid">
      <NavigationBar />
      <div className="content">
        <Container className="mt-5">
          <Row className="justify-content-md-center">
            <Col md="6">
              <Card className="shadow-lg p-3 mb-5 bg-white rounded">
                <Card.Body>
                  <h2 className="text-center mb-4">{isLogin ? 'Login' : 'Register'}</h2>
                  <Form onSubmit={login}>
                    {!isLogin && (
                      <>
                        <Row>
                          <Col>
                            <Form.Group controlId="formFirstName" className="mb-3 text-start">
                              <Form.Label>First Name</Form.Label>
                              <Form.Control type="text" placeholder="Enter first name" />
                            </Form.Group>
                          </Col>
                          <Col>
                            <Form.Group controlId="formLastName" className="mb-3 text-start">
                              <Form.Label>Last Name</Form.Label>
                              <Form.Control type="text" placeholder="Enter last name" />
                            </Form.Group>
                          </Col>
                        </Row>
                      </>
                    )}
                    <Form.Group controlId="formBasicEmail" className="mb-3 text-start">
                      <Form.Label>Email address</Form.Label>
                      <Form.Control type="email" placeholder="Enter email" />
                    </Form.Group>
                    <Form.Group controlId="formBasicPassword" className="mb-3 text-start">
                      <Form.Label>Password</Form.Label>
                      <Form.Control type="password" placeholder="Password" />
                    </Form.Group>
                    {!isLogin && (
                      <Form.Group controlId="formBio" className="mb-3 text-start">
                        <Form.Label>Bio</Form.Label>
                        <Form.Control as="textarea" rows={3} placeholder="Tell us about yourself" />
                      </Form.Group>
                    )}
                    <Button variant="primary" type="submit" className="w-50 m-3" >
                      {isLogin ? 'Login' : 'Register'}
                    </Button>
                  </Form>
                  <Button variant="link" onClick={toggleForm} className="w-100 text-center">
                    {isLogin ? 'Create an account' : 'Already have an account? Login'}
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
      <Footer />
    </Container>
  );
}

export default Auth;
