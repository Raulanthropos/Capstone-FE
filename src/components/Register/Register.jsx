import React, { Component } from 'react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom'
// import useState from 'react';

const Register = () => {
    // const [state, setState] = useState({});

  const handlePictureChange = (event) => {
    const file = event.target.files[0];
    console.log(file);
  }

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
          <h1>Register</h1>
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
            <Form.Group controlId="formBasicFirstName">
              <Form.Label>First Name<span className="starz">*</span></Form.Label>
              <Form.Control type="text" placeholder="First Name" />
            </Form.Group>
            <Form.Group controlId="formBasicLastName">
              <Form.Label>Last Name<span className="starz">*</span></Form.Label>
              <Form.Control type="text" placeholder="Last Name" />
            </Form.Group>
            <Form.Group controlId="formBasicAge">
              <Form.Label>Age<span className="starz">*</span></Form.Label>
              <Form.Control type="number" placeholder="Age" />
            </Form.Group>
            <Form.Group controlId="formBasicDescription">
              <Form.Label>Description<span className="starz">*</span></Form.Label>
              <Form.Control as="textarea" rows={3} placeholder="Description" />
            </Form.Group>
            <Form.Group controlId="formBasicPicture">
              <Form.Label>Picture</Form.Label>
              <Form.File
                id="custom-file"
                label="Choose file"
                custom
                onChange={handlePictureChange}
              />
            </Form.Group>
            <Button variant="primary" type="submit" onSubmit={handleSubmit}>
              Submit
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}

export default Register;
