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
