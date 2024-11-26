import React from 'react';
import { Container } from 'react-bootstrap';
import './Navbar.css'; // Ensure this import is correct

function Footer() {
  return (
    <footer className="navbar-custom text-white text-center py-2">
      <Container>
        <p className="mb-0">&copy; 2023 Itqan. All rights reserved.</p>
      </Container>
    </footer>
  );
}

export default Footer;