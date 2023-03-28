import React from "react";
import { useState, useEffect } from "react";
import { Button, Form, Spinner, Modal } from "react-bootstrap";
import { Card } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import "./Sorting.css";
// import { sendEmail } from "../Mail/Mail";

const Sorting = (props) => {
  const [dogs, setDogs] = useState([]);
  const [sort, setSort] = useState("name");
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const user = useSelector(state => state.loadedProfile.currentUser);
  console.log("This is the user", user, "This is the user role", user.role);
  const handleShowModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleSendEmail = () => {
    // sendEmail(process.env.EMAIL);
    setShowModal(false);
  };

  const navigate = useNavigate();

  useEffect(() => {
    const getDogs = async () => {
      const response = await fetch(`https://capstone-be-production-6735.up.railway.app/dogs?sort=${sort}`);
      const dogs = await response.json();
      setDogs(dogs);
      setLoading(false);
    };
    getDogs();
  }, [sort]);

  return (
    <>
      <Form>
        <Form.Group controlId="sortSelect">
          <Form.Label>Sort by:</Form.Label>
          <Form.Control as="select" onChange={(e) => setSort(e.target.value)}>
            <option value="name">Name</option>
            <option value="breed">Breed</option>
            <option value="age">Age</option>
            <option value="weight">Weight</option>
          </Form.Control>
        </Form.Group>
        {/* <Form.Group controlId="sortPreference">
                    <Form.Label>Order:</Form.Label>
                    <Form.Control as="select" onChange={(e) => setSort(e.target.value)}>
                        <option value="asc">Ascending</option>
                        <option value="desc">Descending</option>
                    </Form.Control>
                </Form.Group> */}
        <Button className="button-stl" style={{marginBottom: "16px"}} onClick={() => navigate("/users/me")}>
          Back
        </Button>
      </Form>
      <div className="sortingContainer">
        {loading && <Spinner animation="border" variant="primary" />}
        {dogs.map((dog) => (
          <Card key={dog._id} className="sortingOptions">
            <Card.Body
              style={{
                display: "flex",
                justifyContent: "space-between",
                textAlign: "justify",
              }}
            >
              <div>
                <Card.Title
                  className={`cardtext${sort === "name" ? " sorted" : ""}`}
                >
                  Name: {dog.name}
                </Card.Title>
                <Card.Subtitle
                  className={`cardtext${sort === "breed" ? " sorted" : ""}`}
                >
                  Breed: {dog.breed}
                </Card.Subtitle>
                <Card.Text className={`cardtext${sort === "age" ? " sorted" : ""}`} style={{marginTop: "16px"}}>
                  Age: {dog.age} years old
                </Card.Text>
                <Card.Text
                  className={`cardtext${sort === "weight" ? " sorted" : ""}`}
                >
                  Weight: {dog.weight} kgs
                </Card.Text>
                <Card.Text className="cardtext" style={{ paddingRight: "20px" }}>
                  Description: {dog.description}
                </Card.Text>
                <Card.Text className="cardtext">
                  Gender:{" "}
                  <span
                    className={`gender ${
                      dog.gender === "male" ? "male" : "female"
                    }`} style={{ textShadow: "0px 0px 2px #000000" }}
                  >
                    {dog.gender === "male" ? <>&#9794;</> : <>&#9792;</>}
                  </span>
                </Card.Text>
                <Card.Text className="cardtext" style={{ fontWeight: "100" }}>
                  {dog.isNeutered
                    ? "✔ This dog is neutered!"
                    : "✖ This dog has not been neutered."}
                </Card.Text>
                {user.role==="user" ? <><Button
                  className="mr-2 button-stl" onClick={handleShowModal}
                >
                  I want to adopt h{dog.gender === "male" ? "im" : "er"}!
                  <Modal show={showModal} onHide={handleCloseModal}>
                    <Modal.Header>
                      <Modal.Title>Terms and conditions</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                      <p>
By clicking the "Send email" button, you are made aware that an email will be sent to Woof Paws, with your details, and that you will receive a response promptly.
                      </p>
                    </Modal.Body>
                    <Modal.Footer>
                      <Button variant="secondary" className="button-stl" onClick={handleCloseModal}>
                        Cancel
                      </Button>
                      <Button className="button-stl" onClick={handleSendEmail}>
                        Send email
                      </Button>
                    </Modal.Footer>
                  </Modal>
                </Button></> : ""}
              </div>
              <Card.Img
                src={dog.images[0].url ? dog.images[0].url : ""}
                style={{
                  width: "250px",
                  height: "250px",
                  borderRadius: "1rem",
                  objectFit: "cover",
                }}
                className="dogimages"
              />
            </Card.Body>
          </Card>
        ))}
      </div>
    </>
  );
};

export default Sorting;
