import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap';
import NavigationBar from '../components/MyNavbar';
import Footer from '../components/Footer';

function Auth() {
  const [isLogin, setIsLogin] = useState(true);

  const toggleForm = () => {
    setIsLogin(!isLogin);
  };

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
                  <Form>
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
                    <Button variant="primary" type="submit" className="w-50 m-3">
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
