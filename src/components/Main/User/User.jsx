import React, { useState, useEffect } from "react";
import { Card, Spinner, Button } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import EditProfileModal from "../EditModal/EditModal";
import DeleteModal from "../DeleteModal/DeleteModal";
import { useNavigate } from "react-router-dom";
import { setAccessToken } from "../../../redux/actions/profileAction";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { logoutUser } from "../../../redux/actions/profileAction";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const User = () => {

  const accessToken = useSelector(state => state.loadedProfile.accessToken);
  const user = useSelector(state => state.loadedProfile.currentUser);
  const [modalShow, setModalShow] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const notifyLoggedOutUser = () => toast("Logged out successfully! Redirecting to the home page...");

  useEffect(() => {
    if (!accessToken) {
      alert("You need to be logged in to view this page!")
      navigate("/");
    } else {
      setAccessToken(accessToken);
    }
  }, []); // Add userId to the dependency array to refetch when it changes

  const handleLogout = () => {
    dispatch(logoutUser(accessToken));
    notifyLoggedOutUser();
    setTimeout(() => {
      navigate('/');
    }, 1000); // Redirect to homepage in 5 seconds
  }

  return (
    <div>
      {user && Object.keys(user).length === 0 && (
        <Spinner animation="border" variant="primary" />
      )}
      {user && Object.keys(user).length > 0 && (
        <Card>
          <Card.Body
            style={{
              display: "flex",
              justifyContent: "space-between",
              textAlign: "justify",
            }}
          >
            <div>
              <Card.Title>
                {user.name} {user.surname}
              </Card.Title>
              <Card.Subtitle className="mb-2 text-muted">
                {user.email}
              </Card.Subtitle>
              <Card.Text className="cardtext" style={{paddingRight: "20px"}}>{user.description}</Card.Text>
              <Card.Text className="cardtext">{user.role}</Card.Text>
              <Button
                variant="primary"
                className="mr-2"
                onClick={() => setModalShow(true)}
              >
                Edit Profile
              </Button>
              <Button variant="danger" className="mr-2" onClick={() => setShowModal(true)}>Delete Profile</Button>
              <DeleteModal showModal={showModal} setShowModal={setShowModal} user={user} />
              <Button variant="danger" onClick={handleLogout}>Logout</Button>
              <ToastContainer />
            </div>
            <Card.Img
              src={user.picture}
              style={{
                width: "250px",
                height: "250px",
                borderRadius: "1rem",
                objectFit: "cover",
              }}
              className="userpicture"
            />
          </Card.Body>
        </Card>
      )}
      <EditProfileModal
        show={modalShow}
        handleClose={() => setModalShow(false)}
        user={user}
      />
    </div>
  );
};

export default User;
