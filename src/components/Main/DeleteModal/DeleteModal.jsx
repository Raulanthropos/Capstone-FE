import { Modal, Button, Toast } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import React from "react";

const DeleteModal = ({ showModal, setShowModal, user }) => {
    const navigate = useNavigate();
  const handleClose = () => setShowModal(false);

const handleDelete = async () => {
    try {
      console.log("This is the user id", user._id);
      await Promise.all([
        fetch(`https://capstone-be-production-6735.up.railway.app/users/${user._id}`, {
          method: "DELETE",
        }),
        new Promise((resolve) => setTimeout(resolve, 200)), // wait for 200ms to ensure delete operation has completed
      ]);

      setTimeout(() => {
        alert(`${user.name} was deleted successfully. Click "OK" to redirect to the home page...`); // close the alert after 2s
        navigate("/");
      }, 500);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Modal show={showModal} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Delete {user.name}'s profile</Modal.Title>
      </Modal.Header>
      <Modal.Body>Are you sure you want to delete this profile?</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
        <Button variant="danger" onClick={handleDelete}>
          Delete
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DeleteModal;
