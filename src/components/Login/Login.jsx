import { useEffect, useState } from "react";
import { Alert, Form, Button, Container, Row, Col } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getAccessToken } from "../../redux/actions/profileAction";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const isAuthenticated = useSelector((state) => state.loadedProfile.isAuthenticated);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (isAuthenticated) navigate("/users/me", { replace: true });
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (loading) return;
    setError("");
    setLoading(true);
    try {
      await dispatch(getAccessToken({ email, password }));
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Row className="justify-content-md-center">
        <Col xs lg="6" style={{ marginTop: "100px" }}>
          <h1>Login</h1>
          {location.state?.message && <Alert variant="warning">{location.state.message}</Alert>}
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="loginEmail">
              <Form.Label>Email address<span className="starz">*</span></Form.Label>
              <Form.Control type="email" autoComplete="email" required maxLength={254}
                value={email} onChange={(event) => setEmail(event.target.value)} />
            </Form.Group>
            <Form.Group controlId="loginPassword">
              <Form.Label>Password<span className="starz">*</span></Form.Label>
              <Form.Control type="password" autoComplete="current-password" required
                value={password} onChange={(event) => setPassword(event.target.value)} />
            </Form.Group>
            <Button variant="primary" type="submit" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
