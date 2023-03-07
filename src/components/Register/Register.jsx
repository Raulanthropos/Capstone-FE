//Create a new component called Register in the src\components\Register folder. This component will be used to register a new user. The component will be a class component. The component will have a constructor that will initialize the state of the component. The state will have the following properties:
//
//picture: the picture of the user
// password: the password of the user
// email: the email of the user
// firstName: the first name of the user
// lastName: the last name of the user
//description: the description of the user
//age: the age of the user
// The form will have a button with an onSubmit event, that calls the onSubmit function that connects with the backend endpoint and, upon checking that all fields are filled correctly, creates a new user in the database and redirects to the homepage

// Path: src\components\Register\Register.jsx
import React, { Component } from 'react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom'

const Register = () => {

    
    return (
        <Container>
        <Row className="justify-content-md-center">
            <Col xs lg="6">
            <h1>Register</h1>
            <Form>
                <Form.Group controlId="formBasicEmail">
                <Form.Label>Email address</Form.Label>
                <Form.Control type="email" placeholder="Enter email" />
                <Form.Text className="text-muted">
                    We'll never share your email with anyone else.
                </Form.Text>
                </Form.Group>
    
                <Form.Group controlId="formBasicPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" placeholder="Password" />
                </Form.Group>
                <Form.Group controlId="formBasicFirstName">
                <Form.Label>First Name</Form.Label>
                <Form.Control type="text" placeholder="First Name" />
                </Form.Group>
                <Form.Group controlId="formBasicLastName">
                <Form.Label>Last Name</Form.Label>
                <Form.Control type="text" placeholder="Last Name" />
                </Form.Group>
                <Form.Group controlId="formBasicAge">
                <Form.Label>Age</Form.Label>
                <Form.Control type="number" placeholder="Age" />
                </Form.Group>
                <Form.Group controlId="formBasicDescription">
                <Form.Label>Description</Form.Label>
                <Form.Control type="text" placeholder="Description" />
                </Form.Group>
                <Form.Group controlId="formBasicPicture">
                <Form.Label>Picture</Form.Label>
                <Form.Control type="text" placeholder="Picture" />
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

    export default Register;



