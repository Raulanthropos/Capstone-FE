import React from "react";
import { useState, useEffect } from "react";
import { Button, Form, Spinner, Modal } from "react-bootstrap";
import { Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import AdoptionModal from "../AdoptionModal/AdoptionModal";
import "./Sorting.css";
// import { sendEmail } from "../Mail/Mail";

const Sorting = (props) => {
  const [dogs, setDogs] = useState([]);
  const [dog, setDog] = useState("");
  const [selectedDog, setSelectedDog] = useState(null)
  const [sort, setSort] = useState("name");
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [adoptionRequest, setAdoptionRequest] = useState(false);
  const user = useSelector(state => state.loadedProfile.currentUser);

  const [neuteredOnly, setNeuteredOnly] = useState(false);

  const handleShowModal = (dog) => {
    setSelectedDog(dog);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleSendEmail = () => {
    // sendEmail(user.email);
    setAdoptionRequest(true);
    setShowModal(false);
  };

  const navigate = useNavigate();

  useEffect(() => {
    const getDogs = async () => {
      const response = await fetch(`https://capstone-be-production-6735.up.railway.app/dogs?sort=${sort}`);
      const dogs = await response.json();
      const filteredDogs = neuteredOnly ? dogs.filter(dog => dog.isNeutered) : dogs;
      setDogs(filteredDogs);
      setLoading(false);
    };
    getDogs();
  }, [sort, neuteredOnly]);
  

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
          <Form.Check 
    type="checkbox" 
    label="Neutered only" 
    checked={neuteredOnly} 
    style={{marginTop: "20px"}}
    onChange={() => setNeuteredOnly(!neuteredOnly)}
  />
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
                {user?.role==="user" && adoptionRequest===false && selectedDog === dog._id ? <><Button
                  className="mr-2 button-stl" onClick={handleShowModal}
                >
                  I want to adopt h{dog.gender === "male" ? "im" : "er"}!
                </Button>
                <AdoptionModal
                  show={showModal}
                  handleClose={handleCloseModal}
                  handleSendEmail={handleSendEmail}
                /></> : "✔ You have submitted an adoption request for this dog! Woof Paws will contact you shortly. Thank you."}
              </div>
              <Card.Img
                src={dog.images[0]?.url ? dog.images[0].url : ""}
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
