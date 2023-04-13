import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Modal } from 'react-bootstrap';
import Sorting from '../Sorting/Sorting';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import "./MainLoggedInComp.css";

const Main = () => {
  const [user, setUser] = useState({});
  const { userId } = useParams(); // Get the user ID from the URL params
  const currentUser = useSelector(state => state.loadedProfile.currentUser);
  const updatedUser = useSelector(state => state.loadedProfile.updatedUser);
  const isAuthenticated = useSelector(state => state.loadedProfile.isAuthenticated);
  console.log("currentUser", currentUser);
  
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

  return (
    <>
    <Container className='backgroundCont'>
      <Row className="d-flex align-items-center justify-content-center" style={{ flexDirection: "column" }}>
        <Col>
        {!currentUser && <h1 style={{marginTop: "100px", textAlign: "center", paddingBlock: "auto"}}>Please login, to get access to this page!</h1>}
          {currentUser?.role === "admin" ? <><Button variant="primary" style={{width: "150px", paddingTop: "15px", marginTop: "10px", marginLeft: "400px"}}>Add dog</Button><Button variant="secondary" style={{width: "150px", paddingTop: "15px", marginTop: "10px"}}>Edit dog</Button></> : ""}
        </Col>
        {isAuthenticated && <><h2 style={{marginTop: "10px"}}>Welcome, {updatedUser?._id === currentUser?._id ? updatedUser?.name : currentUser?.name}!</h2><Col xs="auto">
          <Sorting />
        </Col></>}
      </Row>
    </Container>
    </>
  );
}

export default Main;
