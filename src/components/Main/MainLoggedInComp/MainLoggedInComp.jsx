import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Sorting from '../Sorting/Sorting';
import { useParams } from 'react-router-dom';

const Main = (props) => {
  const { userId } = props;

  const [user, setUser] = useState({});
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
    <Container className='backgroundCont'>
      <Row className="d-flex align-items-center justify-content-center" style={{ flexDirection: "column" }}>
        <Col>
          <h1 style={{ textAlign: "center" }}>Main</h1>
        </Col>
        {user.name && <h2>Welcome, {user.name}!</h2>}
        <Col xs="auto">
          <Sorting />
        </Col>
      </Row>
    </Container>
  );
}

export default Main;
