import React, { useState, useEffect } from "react";
import { Card, Spinner, Button } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import EditProfileModal from "../EditModal/EditModal";

const User = () => {
  const [user, setUser] = useState({});
  const [modalShow, setModalShow] = useState(false);
  const { userId } = useParams(); // Get the user ID from the URL params

  useEffect(() => {
    const getUser = async () => {
      const response = await fetch(`http://localhost:3001/users/${userId}`);
      const loggedInUser = await response.json();
      setUser(loggedInUser);
    };
    getUser();
  }, [userId]); // Add userId to the dependency array to refetch when it changes

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
              <Button
                variant="primary"
                className="mr-2"
                onClick={() => setModalShow(true)}
              >
                Edit Profile
              </Button>
              <Button variant="danger">Delete Profile</Button>
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
        setUser={setUser}
      />
    </div>
  );
};

export default User;
