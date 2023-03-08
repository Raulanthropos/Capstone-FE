import React from "react";
import { Navbar, Nav, NavDropdown } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./Navbar.css";

const NavBar = () => {
  return (
    <Navbar style={{ background: "linear-gradient(to bottom, #F6B352 0%, #FFC3A0 50%, #C48F65 100%)" }} expand="lg">
      <Navbar.Brand href="#home">
        <img
          src="https://raw.githubusercontent.com/Raulanthropos/Capstone-FE/main/public/images/logo.PNG"
          alt="logo"
          className="logo"
          style={{ width: "100px", height: "30px" }}
        />
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="ml-auto" >
          <Nav.Link>
            <Link to="/" style={{color: "#333333"}}>Home</Link>
          </Nav.Link>
          <Nav.Link>
            <Link to="/register" style={{color: "#333333"}}>Register</Link>
          </Nav.Link>
          <Nav.Link>
            <Link to="/login" style={{color: "#333333"}}>Login</Link>
          </Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default NavBar;
