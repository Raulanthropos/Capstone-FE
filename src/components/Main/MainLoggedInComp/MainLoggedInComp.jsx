import { Container, Row, Col, Button } from "react-bootstrap";
import { useSelector } from "react-redux";
import Sorting from "../Sorting/Sorting";
import "./MainLoggedInComp.css";

const Main = () => {
  const currentUser = useSelector((state) => state.loadedProfile.currentUser);
  const isAuthenticated = useSelector((state) => state.loadedProfile.isAuthenticated);

  return (
    <Container className="backgroundCont">
      <Row className="d-flex align-items-center justify-content-center" style={{ flexDirection: "column" }}>
        <Col>
          {!currentUser && <h1 style={{ marginTop: "100px", textAlign: "center" }}>Please login, to get access to this page!</h1>}
          {currentUser?.role === "admin" && <>
            <Button variant="primary" disabled>Add dog</Button>
            <Button variant="secondary" disabled>Edit dog</Button>
          </>}
        </Col>
        {isAuthenticated && <>
          <h2 style={{ marginTop: "10px" }}>Welcome, {currentUser?.name}!</h2>
          <Col xs="auto"><Sorting /></Col>
        </>}
      </Row>
    </Container>
  );
};

export default Main;
