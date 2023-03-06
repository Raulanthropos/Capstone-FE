//Create a footer component
// //Create a new component called Footer, which will be the footer for the app
import React from "react";
import { Container, Row, Col } from "react-bootstrap";

const Footer = () => (
  <footer style={{backgroundColor: "#233EA4", color: "#FFFFFF"}}>
    <Container>
      <Row className="border-top justify-content-between p-3">
        <Col className="p-0 d-flex justify-content-end" md={3}>
          This site was made by{" Ioannis Psychias"}
          <a
            href="https://www.linkedin.com/in/alexander-lee-1b1b3a1a3/"
            target="_blank"
            rel="noopener noreferrer"
          >
            LinkedIn
          </a>
        </Col>
      </Row>
    </Container>
  </footer>
);

export default Footer;