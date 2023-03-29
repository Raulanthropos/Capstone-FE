import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Spinner } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { updateUser } from '../../../redux/actions/profileAction';

const EditProfileModal = ({ show, handleClose }) => {
  const user = useSelector(state => state.loadedProfile.currentUser);
  const updatedUser = useSelector(state => state.loadedProfile.updatedUser);

  const [name, setName] = useState(updatedUser ? updatedUser.name : user?.name);
  const [surname, setSurname] = useState(updatedUser ? updatedUser.surname : user?.surname);
  const [email, setEmail] = useState(updatedUser ? updatedUser.email : user?.email);
  const [description, setDescription] = useState(updatedUser ? updatedUser.description : user?.description);
  const [picture, setPicture] = useState(updatedUser ? updatedUser.picture : user?.picture);
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();

  const handleSubmit = event => {
    event.preventDefault();
    setIsLoading(true);
    dispatch(updateUser({ _id: user._id, name, surname, email, description, picture }))
      .then(() => {
        setIsLoading(false);
        handleClose();
      })
      .catch(error => {
        setIsLoading(false);
        console.log(error);
      });
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Edit profile</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formName">
            <Form.Label>Name</Form.Label>
            <Form.Control type="text" placeholder="Enter name" value={name} onChange={event => setName(event.target.value)} />
          </Form.Group>
          <Form.Group controlId="formSurname">
            <Form.Label>Surname</Form.Label>
            <Form.Control type="text" placeholder="Enter surname" value={surname} onChange={event => setSurname(event.target.value)} />
          </Form.Group>
          <Form.Group controlId="formEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control type="email" placeholder="Enter email" value={email} onChange={event => setEmail(event.target.value)} />
          </Form.Group>
          <Form.Group controlId="formDescription">
            <Form.Label>Description</Form.Label>
            <Form.Control as="textarea" rows={3} placeholder="Enter description" value={description} onChange={event => setDescription(event.target.value)} />
          </Form.Group>
          <Form.Group controlId="formPicture">
            <Form.Label>Picture URL</Form.Label>
            <Form.Control type="text" placeholder="Enter picture URL" value={picture} onChange={event => setPicture(event.target.value)}/>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>Cancel</Button>
        <Button variant="primary" onClick={handleSubmit}>Save changes</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EditProfileModal;