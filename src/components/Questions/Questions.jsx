import React from 'react';
import Accordion from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons"
import './Questions.css';

function Questions() {
  return (
    <div className="d-flex align-items-center justify-content-center q-container">
      <div className="q-img-container">
  <img src={process.env.PUBLIC_URL + 'images/WhatsApp Image 2023-03-11 at 12.52.09.jpeg'} alt="chios" className='q-img'/>
</div>
    <Accordion className="q-accordion-container">
      <Card>
        <Card.Header style={{backgroundColor: "#C48F65"}}>
          <Accordion.Toggle as={Button} variant="link" eventKey="0" style={{color: "#333333"}}>
            <span>How do I adopt a dog?</span>
            <FontAwesomeIcon
              icon={faChevronDown}
              className="float-right"
            />
          </Accordion.Toggle>
        </Card.Header >
        <Accordion.Collapse eventKey="0">
          <Card.Body>
            To adopt a dog, first browse the available dogs on our website and find one that you are interested in. Then, fill out an adoption application and our team will review it. If your application is approved, we will schedule a meet and greet with the dog and one of our adoption counselors. If everything goes well, you can take the dog home!
          </Card.Body>
        </Accordion.Collapse>
      </Card>
      <Card>
      <Card.Header style={{backgroundColor: "#FFC3A0"}}>
          <Accordion.Toggle as={Button} variant="link" eventKey="1" style={{color: "#333333"}}>
            How can I become a foster family?
            <FontAwesomeIcon
              icon={faChevronDown}
              className="float-right"
            />
          </Accordion.Toggle>
        </Card.Header>
        <Accordion.Collapse eventKey="1">
          <Card.Body>
            To become a foster family, fill out a foster application on our website. Our team will review your application and contact you if there is a need for a foster home that matches your qualifications. As a foster family, you will be responsible for providing a temporary home for a dog in need, including food, shelter, and medical care.
          </Card.Body>
        </Accordion.Collapse>
      </Card>
      <Card>
        <Card.Header style={{backgroundColor: "#F6B352"}}>
          <Accordion.Toggle as={Button} variant="link" eventKey="2" style={{color: "#333333"}}>
            How can I donate to your organization?
            <FontAwesomeIcon
              icon={faChevronDown}
              className="float-right"
            />
          </Accordion.Toggle>
        </Card.Header>
        <Accordion.Collapse eventKey="2">
          <Card.Body>
            We greatly appreciate any donations to support our mission of finding loving homes for dogs in need. You can donate on our website using a credit or debit card, or by sending a check to our mailing address. We also accept in-kind donations of dog food, toys, and other supplies. Thank you for your generosity!
          </Card.Body>
        </Accordion.Collapse>
      </Card>
    </Accordion>
    </div>
  );
}

export default Questions;
