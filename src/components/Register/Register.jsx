import { useState } from "react";
import { Alert, Form, Button, Container } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { apiRequest } from "../../api/client";
import { notifyError, notifySuccess } from "../../ui/feedback";
import "./Register.css";

const emptyForm = { name: "", surname: "", email: "", password: "", password2: "", age: "", description: "" };

const Register = () => {
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const change = (event) => setForm({ ...form, [event.target.name]: event.target.value });

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (loading) return;
    setError("");
    if (form.password !== form.password2) {
      setError("Passwords do not match.");
      notifyError("Passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      const body = new FormData();
      for (const field of ["name", "surname", "email", "password", "age", "description"]) {
        body.append(field, form[field]);
      }
      await apiRequest("/users/register", { method: "POST", body });
      notifySuccess("Account created. You can now log in.");
      navigate("/login");
    } catch (error) {
      setError(error.message);
      notifyError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="auth-page">
      <aside className="auth-intro"><span className="eyebrow">MAKE ROOM FOR A LITTLE MORE LOVE</span><h2>Good company.<br />Great <em>beginnings.</em></h2><p>Tell us a little about yourself. We will help you take the next step.</p><img src="/images/adopted-dog-1.jpeg" alt="A dog ready for a new beginning" /></aside>
        <div className="auth-form">
          <h1>Register</h1>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="registerName">
              <Form.Label>First Name<span className="starz">*</span></Form.Label>
              <Form.Control name="name" autoComplete="given-name" required maxLength={100}
                value={form.name} onChange={change} />
            </Form.Group>
            <Form.Group controlId="registerSurname">
              <Form.Label>Last Name<span className="starz">*</span></Form.Label>
              <Form.Control name="surname" autoComplete="family-name" required maxLength={100}
                value={form.surname} onChange={change} />
            </Form.Group>
            <Form.Group controlId="registerEmail">
              <Form.Label>Email address<span className="starz">*</span></Form.Label>
              <Form.Control name="email" type="email" autoComplete="email" required maxLength={254}
                value={form.email} onChange={change} />
            </Form.Group>
            <Form.Group controlId="registerPassword">
              <Form.Label>Password<span className="starz">*</span></Form.Label>
              <Form.Control name="password" type="password" autoComplete="new-password" required minLength={8}
                value={form.password} onChange={change} />
              <Form.Text>Use at least 8 characters.</Form.Text>
            </Form.Group>
            <Form.Group controlId="registerPassword2">
              <Form.Label>Retype password<span className="starz">*</span></Form.Label>
              <Form.Control name="password2" type="password" autoComplete="new-password" required minLength={8}
                value={form.password2} onChange={change} />
            </Form.Group>
            <Form.Group controlId="registerAge">
              <Form.Label>Age<span className="starz">*</span></Form.Label>
              <Form.Control name="age" type="number" required min={0} max={130} step={1}
                value={form.age} onChange={change} />
            </Form.Group>
            <Form.Group controlId="registerDescription">
              <Form.Label>Description<span className="starz">*</span></Form.Label>
              <Form.Control name="description" as="textarea" rows={3} required maxLength={5000}
                value={form.description} onChange={change} />
            </Form.Group>
            <Button variant="primary" type="submit" disabled={loading}>
              {loading ? "Creating account..." : "Register"}
            </Button>
          </Form>
          <p className="auth-alternate">Already part of the pack? <Link to="/login">Login</Link></p>
        </div>
    </Container>
  );
};

export default Register;
