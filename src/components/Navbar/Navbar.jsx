import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { Link } from "react-router-dom";
// import NavDropdown from 'react-bootstrap/NavDropdown';

function Logo() {
  return (
    <img
      src={process.env.PUBLIC_URL + "/images/logo.png"}
      width="100"
      height="30"
      className="d-inline-block align-top"
      alt="Logo"
    />
  );
}

function BasicExample() {
  return (
    <Navbar
      expand="lg"
      style={{ backgroundColor: "#4976D9", color: "#FFFFFF !important" }}
    >
      <Container>
        <Navbar.Brand href="#home">
          <Logo />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ml-auto">
            <Nav.Link>
              {/* <Link to="/">Home</Link> */}
            </Nav.Link>
            <Nav.Link>
              {/* <Link to="/register">Register</Link> */}
            </Nav.Link>
            {/* <Nav.Link to="/login">Login</Nav.Link> */}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default BasicExample;

/*

import React from "react";
import { Nav, Navbar } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function NavBar() {
  return (
    <Navbar bg="light" expand="lg" className="navber">
      <Navbar.Brand href="#home">Portfolio</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">
          <Nav.Link>
            <Link to="/">Home</Link>
          </Nav.Link>
          <Nav.Link>
            <Link to="/certificates">Certificates</Link>
          </Nav.Link>
          <Nav.Link>
            <Link to="/#contact">Contact me!</Link>
          </Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}

*/