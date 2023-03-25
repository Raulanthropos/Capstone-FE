import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Modal } from 'react-bootstrap';
import Sorting from '../Sorting/Sorting';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import "./MainLoggedInComp.css";

const Main = () => {
  const [user, setUser] = useState({});
  const [showModal, setShowModal] = useState(false);
  const { userId } = useParams(); // Get the user ID from the URL params
  const currentUser = useSelector(state => state.loadedProfile.currentUser);
  const isAuthenticated = useSelector(state => state.loadedProfile.isAuthenticated);
  console.log("isAuthenticated", isAuthenticated, "currentUser", currentUser);

  const handleShowModal = () => {
    setShowModal(true);
  }
  
  useEffect(() => {
    const getUser = async () => {
      if (userId) {
        const response = await fetch(`http://localhost:3001/users/${userId}`);
        const loggedInUser = await response.json();
        setUser(loggedInUser);
      }
    };
    getUser();
  }, [userId]);

  const [dogs, setDogs] = useState([]);
  useEffect(() => {
    const getDogs = async () => {
      const response = await fetch('http://localhost:3001/dogs');
      const dogs = await response.json();
      setDogs(dogs);
    };
    getDogs();
  }, []);

  return (
    <>
    {currentUser.role === "admin" ? <Button variant="primary" className="mr-2" style={{width: "100px"}}>Add dog</Button> : ""}
    <Container className='backgroundCont'>
      <Row className="d-flex align-items-center justify-content-center" style={{ flexDirection: "column" }}>
        <Col>
          <h1 style={{ textAlign: "center" }}>Main</h1>
        </Col>
        {isAuthenticated && <h2>Welcome, {currentUser.name}!</h2>}
        <Col xs="auto">
          <Sorting />
        </Col>
      </Row>
    </Container>
    </>
  );
}

export default Main;
