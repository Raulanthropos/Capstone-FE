import React, { useState, useEffect } from "react";
import { Card, Spinner, Button } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import EditProfileModal from "../EditModal/EditModal";
import DeleteModal from "../DeleteModal/DeleteModal";
import { useNavigate } from "react-router-dom";
import { setAccessToken } from "../../../redux/actions/profileAction";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { SET_USER_INFO } from "../../../redux/actions/profileAction";
import { logoutUser } from "../../../redux/actions/profileAction";


const User = () => {

  const accessToken = useSelector(state => state.loadedProfile.accessToken);
  const user = useSelector(state => state.loadedProfile.currentUser);
  const [modalShow, setModalShow] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const { userId } = useParams(); // Get the user ID from the URL params
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await fetch("http:localhost:3001/users/me", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + accessToken,
          },
        });
        if (response.ok) {
          const user = await response.json();
          dispatch({
            type: SET_USER_INFO,
            payload: user,
          });
        } else {
          throw new Error("Error getting user info");
        }
      } catch (error) {
        console.log(error);
      }
    };
    getUser();
  }, [accessToken]); // Add userId to the dependency array to refetch when it changes

    const letUser = async () => {  
      await Promise.all([
        fetch(`http://localhost:3001/users/session`, {
          method: "DELETE",
        }),
        new Promise((resolve) => setTimeout(resolve, 2000)), // wait for 200ms to ensure delete operation has completed
      ]);
      navigate("/");
    }

  return (
    <div>
      <h1>{user.name}</h1>
      {Object.keys(user).length === 0 && (
        <Spinner animation="border" variant="primary" />
      )}
      {Object.keys(user).length > 0 && (
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
              <Card.Text className="cardtext">{user.description}</Card.Text>
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
              <Button variant="danger" onClick={() => dispatch(logoutUser())}>Logout</Button>
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
