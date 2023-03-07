import React from "react";
import { Navbar, Nav, NavDropdown } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./Navbar.css";

const NavBar = () => {
  return (
    <Navbar style={{backgroundColor: "#4976D9"}} expand="lg">
      <Navbar.Brand href="#home">
        <img
          // src={`${process.env.PUBLIC_URL}/images/logo.png`}
          src="https://raw.githubusercontent.com/Raulanthropos/Capstone-FE/main/public/images/logo.PNG"
          alt="logo"
          className="logo"
          style={{width: "100px", height: "30px"}}
        />
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="ml-auto">
          <Nav.Link to="/">
            Home
          </Nav.Link>
          <Nav.Link to="/register">
            Register
          </Nav.Link>
          <Nav.Link to="/login">
            Login
          </Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}

export default NavBar;