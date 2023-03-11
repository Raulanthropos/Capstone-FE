import React, { useState, useEffect } from 'react';
import { Card, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const User = () => {
  const [user, setUser] = useState({});

  useEffect(() => {
    const getUser = async () => {
      const response = await fetch(`http://localhost:3001/users/640b7169eed01caa0df85412`);
      const user = await response.json();
      setUser(user);
    };
    getUser();
  }, []);

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
              <Card.Link as={Link} to={`http://localhost:3001/users/640b7169eed01caa0df85412`}>
                See more
              </Card.Link>
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

