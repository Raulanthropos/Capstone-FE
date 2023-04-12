import React, { useState, useEffect } from "react";
import { Card, Spinner, Button } from "react-bootstrap";
import EditProfileModal from "../EditModal/EditModal";
import DeleteModal from "../DeleteModal/DeleteModal";
import { useNavigate } from "react-router-dom";
import { setAccessToken } from "../../../redux/actions/profileAction";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { logoutUser } from "../../../redux/actions/profileAction";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaArrowRight } from 'react-icons/fa';


const User = () => {

  const accessToken = useSelector(state => state.loadedProfile.accessToken);
  const user = useSelector(state => state.loadedProfile.currentUser);
  const updatedUser = useSelector(state => state.loadedProfile.updatedUser);
  const [modalShow, setModalShow] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const notifyLoggedOutUser = () => toast("Redirecting to the home page...");
  const notifyLoggedInUser = () => toast("You have successfully logged in!");

  useEffect(() => {
    if (!accessToken) {
      alert("You need to be logged in to view this page!")
      navigate("/");
    } else {
      setAccessToken(accessToken);
        notifyLoggedInUser();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Add userId to the dependency array to refetch when it changes

  const handleLogout = () => {
    dispatch(logoutUser(accessToken));
    notifyLoggedOutUser();
    setTimeout(() => {
      navigate('/');
    }, 2000); // Redirect to homepage in 2 seconds
  }

  return (
    <div>
      {user && Object.keys(user).length === 0 && (
        <Spinner animation="border" variant="primary" />
      )}
      {user && Object.keys(user).length > 0 && (
        <>
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
                {updatedUser?._id === user?._id ? updatedUser?.name : user?.name} {updatedUser?._id === user?._id ? updatedUser?.surname : user?.surname}
              </Card.Title>
              <Card.Subtitle className="mb-2 text-muted">
                {updatedUser?._id === user?._id ? updatedUser?.email : user?.email}
              </Card.Subtitle>
              <Card.Text className="cardtext" style={{paddingRight: "20px"}}>{updatedUser?._id === user?._id ? updatedUser?.description : user?.description}</Card.Text>
              <Button
                className="mr-2 button-stl" style={{display: "block", marginBottom: "10px"}}
                onClick={() => navigate("/main")}
              >
                Go to the main page {" "}<FaArrowRight />
              </Button>
              <Button
                variant="primary"
                className="mr-2"
                onClick={() => setModalShow(true)}
              >
                Edit Profile
              </Button>
              <Button variant="danger" className="mr-2" onClick={() => setShowModal(true)}>Delete Profile</Button>
              <DeleteModal showModal={showModal} setShowModal={setShowModal} user={user} userId={user._id} />
              <Button variant="danger" onClick={handleLogout}>Logout</Button>
              <ToastContainer />
            </div>
            <Card.Img
              src={updatedUser?._id === user?._id ? updatedUser?.picture : user?.picture}
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
        </>
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
