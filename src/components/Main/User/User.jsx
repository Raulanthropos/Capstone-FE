import React, { useState, useEffect } from 'react';
import { Card, Spinner } from 'react-bootstrap';
import { Link, useParams } from 'react-router-dom';

const User = () => {
  const [user, setUser] = useState({});
  const { userId } = useParams(); // Get the user ID from the URL params

  useEffect(() => {
    const getUser = async () => {
      const response = await fetch(`http://localhost:3001/users/${userId}`);
      const loggedInUser = await response.json();
      setUser(loggedInUser);
    };
    getUser();
  }, [userId]); // Add userId to the dependency array to refetch when it changes

  return (
    <div>
      <h1>User</h1>
      {Object.keys(user).length === 0 && <Spinner animation="border" variant="primary" />}
      {Object.keys(user).length > 0 && (
        <Card>
          <Card.Body style={{ display: 'flex', justifyContent: 'space-between', textAlign: 'justify' }}>
            <div>
              <Card.Title>{user.name} {user.surname}</Card.Title>
              <Card.Subtitle className="mb-2 text-muted">{user.email}</Card.Subtitle>
              <Card.Text className='cardtext'>{user.description}</Card.Text>
            </div>
              <Card.Img
                src={user.picture}
                style={{ width: '250px', height: '250px', borderRadius: '1rem', objectFit: 'cover' }}
                className="userpicture"
              />
            }
          </Card.Body>
        </Card>
      )}
    </div>
  );
};

export default User;
