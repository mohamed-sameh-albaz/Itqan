import React from 'react';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './MyNavbar.css';
// import 'bootstrap/dist/css/bootstrap.min.css';
function MyNavigationBar() {
  return (
    <Navbar className="navbar-custom" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand as={Link} to="/" className="navbar-brand-custom">Itqan</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/communities" className="nav-link-custom">Communities</Nav.Link>
            <Nav.Link as={Link} to="/posts" className="nav-link-custom">Posts</Nav.Link>
          </Nav>
          <Nav>
            <Button size="sm" variant="light" as={Link} to="/auth" className="navbar-button-custom">Login / Register</Button>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default MyNavigationBar;