// //Create a new component called Login and add the following code to it.
// import React, { Component } from 'react';
// import { Form, Button, Container, Row, Col } from 'react-bootstrap';
// import { Link } from 'react-router-dom'
// import { useState } from 'react';

// const Login = () => {
    
//       const handleSubmit = (event) => {
//      event.preventDefault();
//      console.log(event.target);
//      }
    
//      const handleChange = (event) => {
//           event.preventDefault();
//           console.log(event.target);
//      }
    
//       return (
//      <Container>
//         <Row className="justify-content-md-center">
//           <Col xs lg="6">
//              <h1>Login</h1>
//              <Form onChange={handleChange}>
//                 <Form.Group controlId="formBasicEmail">
//                   <Form.Label>Email address<span className="starz">*</span></Form.Label>
//                   <Form.Control type="email" placeholder="Enter email" />
//                   <Form.Text className="text-muted">
//                  We'll never share your email with anyone else.
//                   </Form.Text>
//                 </Form.Group>
    
//                 <Form.Group controlId="formBasicPassword">
//                   <Form.Label>Password<span className="starz">*</span></Form.Label>
//                   <Form.Control type="password" placeholder="Password" />
//                 </Form.Group>
//                 <Button variant="primary" type="submit">
//                   Submit
//                 </Button>
//              </Form>
//           </Col>
//         </Row>
//      </Container>
//       );
//     }

//     export default Login;

import React, { useState } from 'react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch('http://localhost:3001/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });
      if (response.ok) {
        const data = await response.json();
        // Do something with the response data, such as redirect to a new page or display a success message.
        navigate('/user');
      } else {
        // Handle error response from the server.
        console.log("error:");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleChangeEmail = (event) => {
    setEmail(event.target.value);
  };

  const handleChangePassword = (event) => {
    setPassword(event.target.value);
  };

  return (
    <Container>
      <Row className="justify-content-md-center">
        <Col xs lg="6">
          <h1>Login</h1>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formBasicEmail">
              <Form.Label>Email address<span className="starz">*</span></Form.Label>
              <Form.Control type="email" placeholder="Enter email" value={email} onChange={handleChangeEmail} />
              <Form.Text className="text-muted">
                We'll never share your email with anyone else.
              </Form.Text>
            </Form.Group>

            <Form.Group controlId="formBasicPassword">
              <Form.Label>Password<span className="starz">*</span></Form.Label>
              <Form.Control type="password" placeholder="Password" value={password} onChange={handleChangePassword} />
            </Form.Group>
            <Button variant="primary" type="submit">
              Submit
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;