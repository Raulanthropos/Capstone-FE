//Create a new component called Login and add the following code to it.
import React, { Component } from 'react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom'
import { useState } from 'react';

const Login = () => {
    
      const handleSubmit = (event) => {
     event.preventDefault();
     console.log(event.target);
     }
    
     const handleChange = (event) => {
          event.preventDefault();
          console.log(event.target);
     }
    
      return (
     <Container>
        <Row className="justify-content-md-center">
          <Col xs lg="6">
             <h1>Login</h1>
             <Form onChange={handleChange}>
                <Form.Group controlId="formBasicEmail">
                  <Form.Label>Email address<span className="starz">*</span></Form.Label>
                  <Form.Control type="email" placeholder="Enter email" />
                  <Form.Text className="text-muted">
                 We'll never share your email with anyone else.
                  </Form.Text>
                </Form.Group>
    
                <Form.Group controlId="formBasicPassword">
                  <Form.Label>Password<span className="starz">*</span></Form.Label>
                  <Form.Control type="password" placeholder="Password" />
                </Form.Group>
                <Button variant="primary" type="submit">
                  Submit
                </Button>
             </Form>
          </Col>
        </Row>
     </Container>
      );
    }

    export default Login;