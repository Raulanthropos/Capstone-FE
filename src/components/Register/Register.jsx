import React, { Component } from "react";
import { Form, Button, Container, Row, Col, Spinner } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import "./Register.css";

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
  const [picturePreview, setPicturePreview] = useState(null);

  const navigate = useNavigate();

  const registerUser = async () => {
    try {
      setPostSuccess(false);
      setError(false);
      setLoading(true);

      const newUser = new FormData();
      newUser.append("name", firstName);
      newUser.append("surname", lastName);
      newUser.append("email", email);
      newUser.append("password", password);
      newUser.append("age", age);
      newUser.append("description", description);
      newUser.append("picture", picture);
      newUser.append("role", "user");
      const config = {
        headers: new Headers(),
        method: "POST",
        body: newUser
      };

      const response = await fetch("https://capstone-be-production-6735.up.railway.app/users/register",
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
      setPicturePreview(null);
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
        console.log("You forgot your password,", password, password2)
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
    const selectedPicture = event.target.files[0];
    setPicture(selectedPicture);
    const reader = new FileReader();
    reader.onload = (event) => {
      setPicturePreview(event.target.result);
    };
    reader.readAsDataURL(selectedPicture);
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
              <Form.Control
                type="text"
                placeholder={firstName}
                name="firstName"
                onChange={(e) => setFirstName(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="formBasicLastName">
              <Form.Label>
                Last Name<span className="starz">*</span>
              </Form.Label>
              <Form.Control
                type="text"
                placeholder={lastName}
                name="lastName"
                onChange={(e) => setLastName(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="formBasicEmail">
              <Form.Label>
                Email address<span className="starz">*</span>
              </Form.Label>
              <Form.Control
                type="email"
                placeholder={email}
                name="email"
                onChange={(e) => setEmail(e.target.value)}
              />
              <Form.Text className="text-muted">
                We'll never share your email with anyone else.
              </Form.Text>
            </Form.Group>
            <Form.Group controlId="formBasicPassword">
              <Form.Label>
                Password<span className="starz">*</span>
              </Form.Label>
              <Form.Control
                type="password"
                placeholder={password}
                name="password"
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="formBasicPassword2">
              <Form.Label>
                Retype password<span className="starz">*</span>
              </Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                name="password2"
                onChange={(e) => setPassword2(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="formBasicAge">
              <Form.Label>
                Age<span className="starz">*</span>
              </Form.Label>
              <Form.Control
                type="number"
                placeholder={age}
                name="age"
                onChange={(e) => setAge(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="formBasicDescription">
              <Form.Label>
                Description<span className="starz">*</span>
              </Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder={description}
                name="description"
                onChange={(e) => setDescription(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="formBasicPicture">
              <Form.Label>Picture</Form.Label>
              <Form.File
                id="custom-file"
                label={
                  <div>
                    {picturePreview ? (
                      <img
                        src={picturePreview}
                        alt="Selected file preview"
                        width="25"
                        height="25"
                        style={{ marginTop: "-5px", marginRight: "5px" }}
                      />
                    ) : (
                      "Choose file"
                    )}
                    {picture ? picture.name : ""}
                  </div>
                }
                custom
                name="picture"
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
