import { useState, useEffect } from "react";
import { Alert, Button, Card, Form, Spinner } from "react-bootstrap";
import { apiRequest } from "../../../api/client";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import AdoptionModal from "../AdoptionModal/AdoptionModal";
import useAdoptionRequests from "../AdoptionModal/useAdoptionRequests";
import { notifyError, notifySuccess } from "../../../ui/feedback";
import { useInbox } from "../../../inbox/InboxProvider";
import "./Sorting.css";

const requestLabels = {
  pending: "Pending review",
  approved: "Request approved",
  rejected: "Request declined",
};

const Sorting = () => {
  const { revision } = useInbox();
  const [dogs, setDogs] = useState([]);
  const [error, setError] = useState("");
  const [selectedDog, setSelectedDog] = useState(null);
  const [submissionError, setSubmissionError] = useState("");
  const [sort, setSort] = useState("name");
  const [loading, setLoading] = useState(true);
  const [neuteredOnly, setNeuteredOnly] = useState(false);
  const [dogReload, setDogReload] = useState(0);
  const user = useSelector((state) => state.loadedProfile.currentUser);
  const adoptions = useAdoptionRequests();
  const navigate = useNavigate();

  const handleShowModal = (dog) => {
    setSelectedDog(dog);
    setSubmissionError("");
  };

  const handleCloseModal = () => {
    if (!adoptions.submitting) {
      setSelectedDog(null);
      setSubmissionError("");
    }
  };

  const handleSubmit = async () => {
    if (!selectedDog) return;
    setSubmissionError("");
    try {
      const request = await adoptions.submit(selectedDog._id);
      if (request) {
        setSelectedDog(null);
        notifySuccess("Your adoption request for " + selectedDog.name + " was submitted for review.");
      }
    } catch (error) {
      setSubmissionError(error.message);
      notifyError(error);
      if (error.status === 404 || error.status === 409) {
        setDogReload((previous) => previous + 1);
      }
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    let active = true;
    const getDogs = async () => {
      setLoading(true);
      setError("");
      try {
        const result = await apiRequest("/dogs?sort=" + encodeURIComponent(sort), { signal: controller.signal });
        if (!Array.isArray(result)) throw new Error("Dogs could not be loaded. Please try again.");
        if (active) setDogs(neuteredOnly ? result.filter((dog) => dog.isNeutered) : result);
      } catch (error) {
        if (active) {
          setDogs([]);
          setError(error.status === 503 ? "Dogs are temporarily unavailable. Please try again later." : error.message);
        }
      } finally {
        if (active) setLoading(false);
      }
    };
    getDogs();
    return () => { active = false; controller.abort(); };
  }, [sort, neuteredOnly, dogReload, revision]);

  return (
    <>
      <Form className="dog-filters">
        <Form.Group controlId="sortSelect">
          <Form.Label>Sort by:</Form.Label>
          <Form.Control as="select" value={sort} onChange={(event) => setSort(event.target.value)}>
            <option value="name">Name</option>
            <option value="breed">Breed</option>
            <option value="age">Age</option>
            <option value="weight">Weight</option>
          </Form.Control>
          <Form.Check id="neuteredOnly" type="checkbox" label="Neutered only" checked={neuteredOnly}
            style={{ marginTop: "20px" }} onChange={() => setNeuteredOnly(!neuteredOnly)} />
        </Form.Group>
        <Button className="button-stl" style={{ marginBottom: "16px" }}
          onClick={() => navigate("/users/me")}>Back</Button>
      </Form>
      {error && <Alert variant="warning">{error}</Alert>}
      {adoptions.loading && <p role="status">Loading your adoption requests...</p>}
      {adoptions.error && <Alert variant="warning">
        <p>We could not check your adoption requests. {adoptions.error}</p>
        <Button variant="outline-dark" onClick={adoptions.refresh}>Retry loading requests</Button>
      </Alert>}
      <div className="sortingContainer">
        {loading && <div role="status"><Spinner animation="border" variant="primary" /> Loading dogs...</div>}
        {!loading && !error && dogs.length === 0 && <p>No dogs are currently available.</p>}
        {dogs.map((dog) => (
          <Card key={dog._id} as="article" aria-label={dog.name} className="sortingOptions">
            <Card.Body className="dog-card-layout">
              <div className="dog-card-details">
                <Card.Title className={"cardtext" + (sort === "name" ? " sorted" : "")}>
                  Name: {dog.name}
                </Card.Title>
                <Card.Subtitle className={"cardtext" + (sort === "breed" ? " sorted" : "")}>
                  Breed: {dog.breed}
                </Card.Subtitle>
                <Card.Text className={"cardtext" + (sort === "age" ? " sorted" : "")} style={{ marginTop: "16px" }}>
                  Age: {dog.age} years old
                </Card.Text>
                <Card.Text className={"cardtext" + (sort === "weight" ? " sorted" : "")}>
                  Weight: {dog.weight} kgs
                </Card.Text>
                <Card.Text className="cardtext" style={{ paddingRight: "20px" }}>
                  Description: {dog.description}
                </Card.Text>
                <Card.Text className="cardtext">
                  Gender: <span className={"gender " + dog.gender} >
                    {dog.gender === "male" ? <>&#9794;</> : <>&#9792;</>}
                  </span>
                </Card.Text>
                <Card.Text className="cardtext" style={{ fontWeight: "100" }}>
                  {dog.isNeutered ? "This dog is neutered." : "This dog has not been neutered."}
                </Card.Text>
                {user?.role === "user" && (adoptions.requestsByDog[dog._id] ? (
                  <Card.Text className="cardtext" role="status">
                    {requestLabels[adoptions.requestsByDog[dog._id].status] || "Request submitted"}
                  </Card.Text>
                ) : (
                  <Button className="mr-2 button-stl" onClick={() => handleShowModal(dog)}
                    disabled={adoptions.loading || Boolean(adoptions.error) || adoptions.submitting || loading}>
                    I want to adopt h{dog.gender === "male" ? "im" : "er"}!
                  </Button>
                ))}
                {adoptions.requestsByDog[dog._id] && <Button variant="outline-dark" onClick={() => navigate("/messages/" + adoptions.requestsByDog[dog._id]._id)}>Open conversation</Button>}
              </div>
              <Card.Img src={dog.images[0]?.url || undefined} alt={dog.name}
                className="dogimages" />
            </Card.Body>
          </Card>
        ))}
      </div>
      {selectedDog && <AdoptionModal dog={selectedDog} onClose={handleCloseModal} onSubmit={handleSubmit}
        submitting={adoptions.submitting} error={submissionError}
        canSubmit={!loading && !adoptions.loading && !adoptions.error &&
          !adoptions.requestsByDog[selectedDog._id] && dogs.some((dog) => dog._id === selectedDog._id)} />}
    </>
  );
};

export default Sorting;
