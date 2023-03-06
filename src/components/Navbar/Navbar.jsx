import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
// import NavDropdown from 'react-bootstrap/NavDropdown';

function Logo() {
  return (
    <img
      src={process.env.PUBLIC_URL + "/images/logo.png"}
      width="100"
      height="30"
      className="d-inline-block align-top"
      alt="Logo"
    />
  );
}

function BasicExample() {
  return (
    <Navbar expand="lg" style={{backgroundColor: "#4976D9", color: "#FFFFFF !important"}}>
      <Container>
        <Navbar.Brand href="#home">
          <Logo />
</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ml-auto">
            <Nav.Link href="#home">Home</Nav.Link>
            <Nav.Link href="#register">Register</Nav.Link>
            <Nav.Link href="#login">Login</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default BasicExample;