import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const EditProfileModal = ({ show, handleClose, user, setUser }) => {
  const [name, setName] = useState(user.name);
  const [surname, setSurname] = useState(user.surname);
  const [email, setEmail] = useState(user.email);
  const [description, setDescription] = useState(user.description);
  const [picture, setPicture] = useState(user.picture);

  const handleSaveChanges = async () => {
    try {
      const response = await fetch(`http://localhost:3001/users/${user._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          name,
          surname,
          email,
          description,
          picture
        })
      });

      if (response.ok) {
        const updatedUser = await response.json();
        setUser(updatedUser);
        handleClose();
      } else {
        console.log('Error updating user');
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Edit profile</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="formName">
            <Form.Label>Name</Form.Label>
            <Form.Control type="text" placeholder="Enter name" value={name} onChange={(e) => setName(e.target.value)} />
          </Form.Group>
          <Form.Group controlId="formSurname">
            <Form.Label>Surname</Form.Label>
            <Form.Control type="text" placeholder="Enter surname" value={surname} onChange={(e) => setSurname(e.target.value)} />
          </Form.Group>
          <Form.Group controlId="formEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control type="email" placeholder="Enter email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </Form.Group>
          <Form.Group controlId="formDescription">
            <Form.Label>Description</Form.Label>
            <Form.Control as="textarea" rows={3} placeholder="Enter description" value={description} onChange={(e) => setDescription(e.target.value)} />
          </Form.Group>
          <Form.Group controlId="formPicture">
            <Form.Label>Picture URL</Form.Label>
            <Form.Control type="text" placeholder="Enter picture URL" value={picture} onChange={(e) => setPicture(e.target.value)} />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>Cancel</Button>
        <Button variant="primary" onClick={handleSaveChanges}>Save changes</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EditProfileModal;