import { Card, Button, Container } from "react-bootstrap";
import { Navigate, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../../../redux/actions/profileAction";
import { FaArrowRight } from "react-icons/fa";
import Avatar from "../../Avatar/Avatar";
import { notifyLogout } from "../../../ui/feedback";
import "./User.css";

const User = () => {
  const user = useSelector((state) => state.loadedProfile.currentUser);
  const isAuthenticated = useSelector((state) => state.loadedProfile.isAuthenticated);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  if (!isAuthenticated || !user) return <Navigate to="/login" replace />;

  const handleLogout = () => {
    dispatch(logoutUser());
    notifyLogout();
  };

  return (
    <Container className="profile-page page-section">
      <span className="eyebrow">YOUR LITTLE CORNER OF WOOF PAWS</span>
      <h1>Your profile.</h1>
      <Card className="profile-card">
        <Card.Body className="profile-layout">
          <Avatar user={user} label="Profile" className="profile-avatar" />
          <div className="profile-details">
            <Card.Title as="h2">{user.name} {user.surname}</Card.Title>
            <Card.Subtitle className="mb-3 text-muted profile-email">{user.email}</Card.Subtitle>
            <Card.Text className="profile-description">{user.description}</Card.Text>
            <div className="profile-primary-action">
              <Button className="button-stl" onClick={() => navigate("/main")}>
                Go to the main page <FaArrowRight aria-hidden="true" />
              </Button>
            </div>
            <div className="profile-actions" role="group" aria-label="Profile actions">
              {user.role === "admin" && <Button variant="success"
                onClick={() => navigate("/admin/adoptions")}>Review adoption requests</Button>}
              <Button variant="primary" disabled title="Profile editing is temporarily unavailable.">
                Edit Profile
              </Button>
              <Button variant="outline-dark" onClick={() => navigate("/messages")}>Messages</Button>
              <Button variant="outline-danger" onClick={handleLogout}>Logout</Button>
              <Button variant="danger" disabled title="Profile deletion is temporarily unavailable.">
                Delete Profile
              </Button>
            </div>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default User;
