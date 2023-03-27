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
    <Container className='backgroundCont'>
      <Row className="d-flex align-items-center justify-content-center" style={{ flexDirection: "column" }}>
        <Col>
          {currentUser.role === "admin" ? <><Button variant="secondary" style={{width: "150px", paddingTop: "15px", marginTop: "10px"}}>Add dog</Button><Button variant="warning" style={{width: "150px", paddingTop: "15px", marginTop: "10px"}}>Edit dog</Button><Button variant="danger" style={{width: "150px", paddingTop: "15px", marginTop: "10px"}}>Delete dog</Button></> : ""}
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
