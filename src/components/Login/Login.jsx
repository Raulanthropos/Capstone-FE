import { useEffect, useState } from "react";
import { Alert, Form, Button, Container } from "react-bootstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getAccessToken } from "../../redux/actions/profileAction";
import { notifyError, notifySuccess } from "../../ui/feedback";

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
      notifySuccess("You are now logged in.");
    } catch (error) {
      setError(error.message);
      notifyError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="auth-page">
      <aside className="auth-intro"><span className="eyebrow">WELCOME BACK</span><h2>A familiar face.<br />A new <em>beginning.</em></h2><p>Your next chapter is waiting. Pick up where you left off.</p><img src="/images/adopted-dog-3.jpeg" alt="A dog relaxing at home" /></aside>
        <div className="auth-form">
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
          <p className="auth-alternate">New here? <Link to="/register">Create an account</Link></p>
        </div>
    </Container>
  );
};

export default Login;
