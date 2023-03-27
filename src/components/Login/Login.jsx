import { useState } from "react";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { getAccessToken } from "../../redux/actions/profileAction";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // const [isLoggedIn, setIsLoggedIn] = useState(false);
  const user = useSelector((state) => state.loadedProfile.currentUser);
  const isAuthenticated = useSelector((state) => state.loadedProfile.isAuthenticated);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      console.log("-------checking the login status", user)
      // setIsLoggedIn(true);
      navigate("/users/me");
    }
    //eslint-disable-next-line
  }, [isAuthenticated]);

  const handleSubmit = async (event) => {
    event.preventDefault()
    const credentialEmail = {
      email: email,
      password: password
    }
    console.log("logging in")
    dispatch(getAccessToken(credentialEmail))
  };
  

  const handleInputEmail = (event) => {
    setEmail(event.target.value);
  };

  const handleInputPassword = (event) => {
    setPassword(event.target.value);
  };

  return (
    <Container>
      <Row className="justify-content-md-center">
        <Col xs lg="6" style={{marginTop: "calc(100vh - 50%)"}}>
          <h1>Login</h1>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formBasicEmail">
              <Form.Label>
                Email address<span className="starz">*</span>
              </Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={handleInputEmail}
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
                placeholder="Password"
                value={password}
                onChange={handleInputPassword}
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

export default Login;
