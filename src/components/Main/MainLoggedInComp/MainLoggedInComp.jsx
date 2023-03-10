//Create a new component called Main, which will display the main page of our application. It will display a list of dogs for adoption, connected to the backed endpoint 'http:localhost:3001/dogs', and will display dog.name, dog.breed, dog.age, dog.description, dog.image (if it exists), all in a card for each dog, using react bootstrap
//
//The component will have a state with a dogs array, which will be initialized with an empty array. The component will have a useEffect hook, which will fetch the dogs from the backend, and will set the dogs array in the state with the response from the backend. The component will display a spinner while the dogs are being fetched from the backend.
//
//The component will display a list of cards, one for each dog, using the dogs array from the state. Each card will display the dog.name, dog.breed, dog.age, dog.description, dog.image (if it exists), all in a card for each dog, using react bootstrap
//


import React from 'react';
import { useState, useEffect } from 'react';
import { Card, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './MainLoggedInComp.css';

const Main = () => {
    const [dogs, setDogs] = useState([]);
    
    useEffect(() => {
        const getDogs = async () => {
        const response = await fetch('http://localhost:3001/dogs');
        const dogs = await response.json();
        setDogs(dogs);
        };
        getDogs();
    }, []);
    
    return (
        <div>
        <h1>Main</h1>
        {dogs.length === 0 && <Spinner animation="border" variant="primary" />}
        {dogs.map((dog) => (
            <Card key={dog._id}>
            <Card.Body style={{display: "flex", justifyContent: "space-between", textAlign: "justify"}}>
                <div>
                <Card.Title>{dog.name}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">
                {dog.breed}
                </Card.Subtitle>
                <Card.Text className='cardtext'>{dog.description}</Card.Text>
                {console.log(dog.images[0].url  ? dog.images[0].url : "")}
                <Card.Link as={Link} to={`http://localhost:3001/dogs/${dog._id}`}>
                See more
                </Card.Link>
                </div>
                <Card.Img src={dog.images[0].url ? dog.images[0].url : ""} style={{width: "250px", height: "250px", borderRadius: "1rem"}} className="dogimages"/>
            </Card.Body>
            </Card>
        ))}
        </div>
    );
    }

    export default Main;
