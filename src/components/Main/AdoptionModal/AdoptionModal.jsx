import React from "react";
import { Modal, Button } from "react-bootstrap";

const ModalComponent = ({ show, handleCloseModal, handleSendEmail }) => {
  return (
    <Modal show={show} onHide={handleCloseModal} backdrop={false}>
      <Modal.Header>
        <Modal.Title>Adoption Request</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Are you sure you want to adopt this dog?</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleCloseModal}>
          Cancel
        </Button>
        <Button variant="success" onClick={handleSendEmail}>
          Yes, I want to adopt!
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalComponent;
