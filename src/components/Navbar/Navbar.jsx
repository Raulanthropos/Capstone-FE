import { useState } from "react";
import { Navbar, Nav, NavDropdown } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../../redux/actions/profileAction";
import Avatar from "../Avatar/Avatar";
import { notifyLogout } from "../../ui/feedback";
import { FaPaw, FaRegBell, FaRegCommentDots } from "react-icons/fa";
import { useInbox } from "../../inbox/InboxProvider";
import "./Navbar.css";

const NavBar = () => {
  const user = useSelector((state) => state.loadedProfile.currentUser);
  const updatedUser = useSelector((state) => state.loadedProfile.updatedUser);
  const { unread, summaryError } = useInbox();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const closeMenus = () => { setExpanded(false); setShowDropdown(false); };
  const avatarUser = updatedUser?._id === user?._id ? { ...user, ...updatedUser } : user;

  return (
    <Navbar className="site-navbar" expand="lg" expanded={expanded} onToggle={setExpanded}>
      <Navbar.Brand as={Link} to="/" onClick={closeMenus}>
        <FaPaw aria-hidden="true" /> <span>woof paws<span className="brand-dot">.</span></span>
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" aria-expanded={expanded} />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="ml-auto">
          <Nav.Link as={Link} to="/" onClick={closeMenus}>Home</Nav.Link>
          <Nav.Link as={Link} to="/main" onClick={closeMenus}>Meet the dogs</Nav.Link>
          <Nav.Link as={Link} to="/stories" onClick={closeMenus}>Stories</Nav.Link>
          {user && <>
            <Nav.Link as={Link} to="/messages" onClick={closeMenus}><FaRegCommentDots aria-hidden="true" /> Messages</Nav.Link>
            <Nav.Link as={Link} to="/notifications" onClick={closeMenus} aria-label={"Notifications" + (unread ? ", " + unread + " unread" : "")}
              title={summaryError || "Your notifications"}><FaRegBell aria-hidden="true" /> Updates
              {unread > 0 && <span className="notification-count">{unread > 99 ? "99+" : unread}</span>}
              {summaryError && <span aria-label="Notifications unavailable">!</span>}
            </Nav.Link>
          </>}
          {!user ? <>
            <Nav.Link as={Link} to="/register" onClick={closeMenus}>Register</Nav.Link>
            <Nav.Link as={Link} to="/login" onClick={closeMenus}>Login</Nav.Link>
          </> : (
            <NavDropdown id="account-menu" title={<Avatar user={avatarUser} label="Account menu" />}
              alignRight show={showDropdown} onToggle={setShowDropdown}>
              <NavDropdown.Item as={Link} to="/users/me" onClick={closeMenus}>Settings</NavDropdown.Item>
              <NavDropdown.Item onClick={() => {
                closeMenus();
                dispatch(logoutUser());
                notifyLogout();
                navigate("/");
              }}>Logout</NavDropdown.Item>
            </NavDropdown>
          )}
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default NavBar;
