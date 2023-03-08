import React, { Component } from "react";
import { Form, Button, Container, Row, Col, Spinner } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

const Register = () => {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [age, setAge] = useState("");
  const [description, setDescription] = useState("");
  const [picture, setPicture] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [postSuccess, setPostSuccess] = useState(false);

  const navigate = useNavigate();

  const registerUser = async () => {
    try {
      setPostSuccess(false);
      setError(false);
      setLoading(true);

      const newUser = {
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: password,
        age: age,
        description: description,
        picture: picture,
        role: "user",
      };

      const config = {
        method: "POST",
        body: JSON.stringify(newUser),
        headers: new Headers({
          "Content-Type": "application/json",
        }),
      };

      const response = await fetch(
        "http://localhost:3001/users/register",
        config
      );
      console.log("response:", response);
      if (response.ok) {
        setPostSuccess(true);
        navigate("/login");
      } else {
        setError(true);
        console.log("error:");
      }
    } catch (error) {
      setError(true);
    } finally {
      setLoading(false);
      setFirstName("");
      setLastName("");
      setEmail("");
      setPassword("");
      setPassword2("");
      setAge("");
      setDescription("");
      setPicture("");
      infoTimeoutFunc(3000);
    }
  };

  const resetAllState = () => {
    setError(false);
    setPostSuccess(false);
    setLoading(false);
  };

  const infoTimeoutFunc = (time) => {
    const infoTimeout = setTimeout(resetAllState, time);
    return () => clearTimeout(infoTimeout);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("submitting form...");
    if (
      firstName &&
      lastName &&
      email &&
      password &&
      password2 &&
      age &&
      description &&
      picture &&
      !loading &&
      !error &&
      !postSuccess
    ) {
      if (password !== password2) {
        setError(true);
        infoTimeoutFunc(2000);
      } else {
        registerUser();
      }
    } else {
      setError(true);
      infoTimeoutFunc(2000);
    }
  };

  const handlePictureChange = (event) => {
    const file = event.target.files[0];
    setPicture(file);
  };

  return (
    <Container>
      <Row className="justify-content-md-center">
        <Col xs lg="6">
          <h1>Register</h1>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formBasicFirstName">
              <Form.Label>
                First Name<span className="starz">*</span>
              </Form.Label>
              <Form.Control type="text" placeholder={firstName} onChange={(e) => setFirstName(e.target.value)} />
            </Form.Group>
            <Form.Group controlId="formBasicLastName">
              <Form.Label>
                Last Name<span className="starz">*</span>
              </Form.Label>
              <Form.Control type="text" placeholder={lastName} onChange={(e) => setLastName(e.target.value)} />
            </Form.Group>
            <Form.Group controlId="formBasicEmail">
              <Form.Label>
                Email address<span className="starz">*</span>
              </Form.Label>
              <Form.Control type="email" placeholder={email} onChange={(e) => setEmail(e.target.value)} />
              <Form.Text className="text-muted">
                We'll never share your email with anyone else.
              </Form.Text>
            </Form.Group>
            <Form.Group controlId="formBasicPassword">
              <Form.Label>
                Password<span className="starz">*</span>
              </Form.Label>
              <Form.Control type="password" placeholder={password} onChange={(e) => setPassword(e.target.value)} />
            </Form.Group>
            <Form.Group controlId="formBasicPassword">
              <Form.Label>
                {" "}
                Retype password<span className="starz">*</span>
              </Form.Label>
              <Form.Control type="password" placeholder="Password" />
            </Form.Group>
            <Form.Group controlId="formBasicAge">
              <Form.Label>
                Age<span className="starz">*</span>
              </Form.Label>
              <Form.Control type="number" placeholder={age} onChange={(e) => setAge(e.target.value)} />
            </Form.Group>
            <Form.Group controlId="formBasicDescription">
              <Form.Label>
                Description<span className="starz">*</span>
              </Form.Label>
              <Form.Control as="textarea" rows={3} placeholder={description} onChange={(e) => setDescription(e.target.value)} />
            </Form.Group>
            <Form.Group controlId="formBasicPicture">
              <Form.Label>Picture</Form.Label>
              <Form.File
                id="custom-file"
                label={picture ? picture.name : "Choose file"}
                custom
                onChange={handlePictureChange}
              />
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

export default Register;
