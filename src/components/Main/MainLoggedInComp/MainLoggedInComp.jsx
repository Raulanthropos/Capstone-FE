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
        const response = await fetch(`https://capstone-be-production-6735.up.railway.app/users/${userId}`);
        const loggedInUser = await response.json();
        setUser(loggedInUser);
      }
    };
    getUser();
  }, [userId]);

  const [dogs, setDogs] = useState([]);
  useEffect(() => {
    const getDogs = async () => {
      const response = await fetch("https://capstone-be-production-6735.up.railway.app/dogs");
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
        {!currentUser && <h1 style={{marginTop: "100px", textAlign: "center", paddingBlock: "auto"}}>Please login, to get access to this page!</h1>}
          {currentUser?.role === "admin" ? <><Button variant="primary" style={{width: "150px", paddingTop: "15px", marginTop: "10px", marginLeft: "400px"}}>Add dog</Button><Button variant="secondary" style={{width: "150px", paddingTop: "15px", marginTop: "10px"}}>Edit dog</Button></> : ""}
        </Col>
        {isAuthenticated && <><h2 style={{marginTop: "10px"}}>Welcome, {currentUser?.name}!</h2><Col xs="auto">
          <Sorting />
        </Col></>}
      </Row>
    </Container>
    </>
  );
}

export default Main;
