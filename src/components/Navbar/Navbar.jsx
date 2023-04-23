import React from "react";
import { Navbar, Nav, NavDropdown } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./Navbar.css";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {useState} from "react";
import { logoutUser } from "../../redux/actions/profileAction";

const NavBar = () => {
  const user = useSelector((state) => state.loadedProfile.currentUser);
  const updatedUser = useSelector(state => state.loadedProfile.updatedUser);
  const accessToken = useSelector((state) => state.loadedProfile.accessToken);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [showDropdown, setShowDropdown] = useState(false);

  const handleMouseEnter = () => {
    setShowDropdown(true);
  };

  const handleMouseLeave = () => {
    setShowDropdown(false);
  };

  return (
    <Navbar
      style={{
        background:
          "linear-gradient(to right, #C48F65 0%, #FFC3A0 50%, #F6B352 100%)", zIndex: 99
      }}
      expand="lg"
    >
<Navbar.Brand>
  <Link to="/">
    <img
      src="https://raw.githubusercontent.com/Raulanthropos/Capstone-FE/main/public/images/logo.PNG"
      alt="logo"
      className="logo"
      style={{ width: "100px", height: "30px", borderRadius: "5px" }}
    />
  </Link>
</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav"/>
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="ml-auto">
          <Nav.Link>
            <Link to="/" style={{ color: "#333333" }}>
              Home
            </Link>
          </Nav.Link>
          <Nav.Link>
            <Link to={`/main`} style={{ color: "#333333" }}>
              Main
            </Link>
          </Nav.Link>
          <Nav.Link>
            <Link to={`/stories`} style={{ color: "#333333" }}>
              Stories
            </Link>
          </Nav.Link>
          {!user ? (
            <Nav.Link>
              <Link to="/register" style={{ color: "#333333" }}>
                Register
              </Link>
            </Nav.Link>
          ) : (
            ""
          )}
          {!user ? (
            <Link to="/login" style={{ color: "#333333", height: "17px", padding: "9px" }}>Login</Link>) : (
            <NavDropdown
              title={
                user && (
                  <img
                    src={updatedUser?._id === user?._id ? updatedUser?.picture : user?.picture}
                    alt="user_pic"
                    style={{
                      width: "30px",
                      height: "30px",
                      borderRadius: "50%",
                      marginRight: "10px",
                    }}
                  />
                )
              }
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              alignRight
              style={{ right: 0, left: "auto" }}
              show={showDropdown}
            >
              {user && (
                <>
                  <NavDropdown.Item
                    onClick={() => {
                      navigate("/users/me");
                    }}
                  >
                    Settings
                  </NavDropdown.Item>
                  <NavDropdown.Item
                    onClick={() => {
                      dispatch(logoutUser(accessToken));
                      navigate("/");
                    }}
                  >
                    Logout
                  </NavDropdown.Item>
                </>
              )}
            </NavDropdown>
          )}
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default NavBar;
