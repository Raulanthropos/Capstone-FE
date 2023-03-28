import React from "react";
import { Navbar, Nav, NavDropdown, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./Navbar.css";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../../redux/actions/profileAction";

const NavBar = () => {

  const user = useSelector(state => state.loadedProfile.currentUser);
  const accessToken = useSelector(state => state.loadedProfile.accessToken);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  return (
    <Navbar style={{ background: "linear-gradient(to right, #C48F65 0%, #FFC3A0 50%, #F6B352 100%)" }} expand="lg">
      <Navbar.Brand href="#home">
        <img
          src="https://raw.githubusercontent.com/Raulanthropos/Capstone-FE/main/public/images/logo.PNG"
          alt="logo"
          className="logo"
          style={{ width: "100px", height: "30px", borderRadius: "5px" }}
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
          <Link to={`/main`} style={{color: "#333333"}}>Main</Link>
          </Nav.Link>
          <Nav.Link>
          <Link to={`/stories`} style={{color: "#333333"}}>Stories</Link>
          </Nav.Link>
          <Nav.Link>
  {!user ? (
    <Link to="/login" style={{ color: "#333333" }}>
      Login
    </Link>
  ) : (
    <div>
      <Button
        style={{
          padding: "0",
          fontWeight: "900",
          color: "red",
          background: "transparent",
          border: "none"
        }}
        onClick={() => {
          dispatch(logoutUser(accessToken));
          navigate('/');
        }}
      >
        <img src={user.picture} alt="user_pic"   style={{
      width: "30px",
      height: "30px",
      borderRadius: "50%",
    }}></img> {" "}{" "}{" "}
        Logout
      </Button>
    </div>
  )}
</Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default NavBar;
