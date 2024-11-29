import React from 'react';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import NavigationBar from '../components/MyNavbar';
import Footer from '../components/Footer';
import backgroundImage from '../assets/home-background.png'; // Adjust the path and filename accordingly

function Landing() {
  return (
    <Container fluid className="p-0">
      <NavigationBar />
      <header
        className="bg-primary text-white text-center py-5"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          height: '80vh',
        }}
      >
        <Container>
          <h1 className="display-4">Welcome to Itqan</h1>
          <p className="lead">
            Enhance your learning through competition and community-driven contests.
          </p>
          <Button variant="light" href="/auth" className="px-4 py-2">
            Get Started
          </Button>
        </Container>
      </header>

      <section className="py-5">
        <Container>
          <Row className="text-center">
            <Col md="4">
              <Card className="mb-4 shadow-sm">
                <Card.Body>
                  <Card.Title>Create Contests</Card.Title>
                  <Card.Text>
                    Challenge your friends and peers by creating custom contests.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md="4">
              <Card className="mb-4 shadow-sm">
                <Card.Body>
                  <Card.Title>Join Communities</Card.Title>
                  <Card.Text>
                    Join communities to participate in group contests and discussions.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md="4">
              <Card className="mb-4 shadow-sm">
                <Card.Body>
                  <Card.Title>Track Progress</Card.Title>
                  <Card.Text>
                    Monitor your progress and see how you rank against others.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      <section className="bg-light py-5">
        <Container>
          <Row className="text-center">
            <Col>
              <h2>What Our Users Say</h2>
              <p className="lead">Hear from our satisfied learners</p>
            </Col>
          </Row>
          <Row className="text-center">
            <Col md="4">
              <Card className="mb-4 shadow-sm">
                <Card.Body>
                  <Card.Text>
                    "Itqan has transformed the way I learn. The competitive aspect keeps me motivated!"
                  </Card.Text>
                  <Card.Footer className="text-muted">- User A</Card.Footer>
                </Card.Body>
              </Card>
            </Col>
            <Col md="4">
              <Card className="mb-4 shadow-sm">
                <Card.Body>
                  <Card.Text>
                    "Joining communities and participating in contests has been a game-changer for me."
                  </Card.Text>
                  <Card.Footer className="text-muted">- User B</Card.Footer>
                </Card.Body>
              </Card>
            </Col>
            <Col md="4">
              <Card className="mb-4 shadow-sm">
                <Card.Body>
                  <Card.Text>
                    "I love tracking my progress and seeing how I rank against others."
                  </Card.Text>
                  <Card.Footer className="text-muted">- User C</Card.Footer>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      <Footer />
    </Container>
  );
}

export default Landing;