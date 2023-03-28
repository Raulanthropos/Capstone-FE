import { Modal, Button, Toast } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import React from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { deleteUser } from "../../../redux/actions/profileAction";

const DeleteModal = ({ showModal, setShowModal, userId }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleClose = () => setShowModal(false);
  const accessToken = useSelector(state => state.loadedProfile.accessToken);

  const handleDelete = async () => {
    try {
      dispatch(deleteUser(accessToken, userId));
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };
  
  return (
    <Modal show={showModal} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Delete user profile</Modal.Title>
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

