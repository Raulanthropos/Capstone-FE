import { Card, Button } from "react-bootstrap";
import { Navigate, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../../../redux/actions/profileAction";
import { FaArrowRight } from "react-icons/fa";
import "./User.css";

const User = () => {
  const user = useSelector((state) => state.loadedProfile.currentUser);
  const isAuthenticated = useSelector((state) => state.loadedProfile.isAuthenticated);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  if (!isAuthenticated || !user) return <Navigate to="/login" replace />;

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  return (
    <Card>
      <Card.Body style={{ display: "flex", justifyContent: "space-between", textAlign: "justify" }}>
        <div>
          <Card.Title>{user.name} {user.surname}</Card.Title>
          <Card.Subtitle className="mb-2 text-muted" style={{ paddingRight: "20px" }}>{user.email}</Card.Subtitle>
          <Card.Text className="cardtext" style={{ paddingRight: "20px" }}>{user.description}</Card.Text>
          <Button className="mr-2 button-stl" style={{ display: "block", marginBottom: "10px" }}
            onClick={() => navigate("/main")}>
            Go to the main page <FaArrowRight />
          </Button>
          <Button variant="primary" className="mr-2" disabled title="Profile editing is temporarily unavailable.">
            Edit Profile
          </Button>
          <Button variant="danger" onClick={handleLogout} className="logout-btn">Logout</Button>
          <Button variant="danger" className="mr-2" disabled title="Profile deletion is temporarily unavailable.">
            Delete Profile
          </Button>
        </div>
        <Card.Img src={user.picture || "/images/ai-generated-user.jpeg"} alt="Profile"
          style={{ width: "250px", height: "250px", borderRadius: "1rem", objectFit: "cover" }}
          className="userpicture" />
      </Card.Body>
    </Card>
  );
};

export default User;
