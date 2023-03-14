//Create a new sorting component that will be used to sort the list of dogs by name, breed, and age. This component will be used in the MainLoggedInComp component. This component will be navigated to by clicking the Sort button in the MainLoggedInComp component. The sorting component will have a dropdown menu that will allow the user to select the sorting criteria. The sorting component will also have a button that will allow the user to sort the list of dogs by the selected criteria. The sorting component will also have a button that will allow the user to return to the MainLoggedInComp component. The fetching of dogs in made in the MainLoggedInComp, therefore this component only handles the sorting UI elements, and functionality added, by adding '?sort=' to the initial backend url, with the sorting criteria. The sorting criteria will be passed to the sorting component as props. The sorting component will be a functional component, and will use the useState and useEffect hooks. The sorting component will be styled using Bootstrap.

import React from 'react';
import { useState, useEffect } from 'react';
import { Button, Form, Spinner } from 'react-bootstrap';
import {Card} from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import './Sorting.css';

const Sorting = (props) => {
    const [dogs, setDogs] = useState([]);
    const [sort, setSort] = useState('name');
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    useEffect(() => {
        const getDogs = async () => {
            const response = await fetch(`http://localhost:3001/dogs?sort=${sort}`);
            const dogs = await response.json();
            setDogs(dogs);
            setLoading(false);
        };
        getDogs();
    }, [sort]);

    return (
        <div>
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
                <Button variant="primary" onClick={() => navigate('/')}>
                    Back
                </Button>
            </Form>
            {loading && <Spinner animation="border" variant="primary" />}
            {dogs.map((dog) => (
            <Card key={dog._id}>
            <Card.Body style={{display: "flex", justifyContent: "space-between", textAlign: "justify"}}>
                <div>
                <Card.Title className={`cardtext${sort === 'name' ? ' sorted' : ''}`}>{dog.name}</Card.Title>
                <Card.Subtitle className={`cardtext${sort === 'breed' ? ' sorted' : ''}`}>
                {dog.breed}
                </Card.Subtitle>
                <Card.Text className={`cardtext${sort === 'age' ? ' sorted' : ''}`}>{dog.age} years old</Card.Text>
                <Card.Text className={`cardtext${sort === 'weight' ? ' sorted' : ''}`}>{dog.weight} kgs</Card.Text>
                <Card.Text className='cardtext'>{dog.description}</Card.Text>
                <Card.Link as={Link} to={`http://localhost:3001/dogs/${dog._id}`}>
                See more
                </Card.Link>
                </div>
                <Card.Img src={dog.images[0].url ? dog.images[0].url : ""} style={{width: "250px", height: "250px", borderRadius: "1rem", objectFit: "cover"}} className="dogimages"/>
            </Card.Body>
            </Card>
        ))}
        </div>
    );
}

export default Sorting;