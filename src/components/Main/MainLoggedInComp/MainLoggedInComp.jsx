import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import './MainLoggedInComp.css';
import Sorting from '../Sorting/Sorting';

const Main = () => {
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
          <Row className="d-flex align-items-center justify-content-center" style={{flexDirection: "column"}}>
            <Col>
              <h1 style={{textAlign: "center"}}>Main</h1>
            </Col>
            <Col xs="auto">
              <Sorting />
            </Col>
          </Row>
        </Container>
      );
    }

    export default Main;
