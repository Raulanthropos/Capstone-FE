//Create a new component called register, with the following functionality:
//
//The component will have a state with the following properties: firstName, lastName, email, password, password2, age, description, picture, picturePreview, error, postSuccess, loading. All of them will be initialized with an empty string, except for picturePreview, which will be initialized with null, and error, postSuccess, loading, which will be initialized with false.
//
//The component will have a useEffect hook, which will reset the state of the component to the initial state, after 3 seconds, if the postSuccess state is true.

//The component will have a function called registerUser, which will send a POST request to the backend endpoint 'http://localhost:3001/users/register', with the following body: {firstName, lastName, email, password, age, description, picture}. The function will set the loading state to true, and will set the postSuccess state to true, if the response from the backend is ok. The function will set the error state to true, if the response from the backend is not ok. The function will set the loading state to false, and will reset the state of the component to the initial state, after 3 seconds, if the postSuccess state is true. The function will set the error state to true, and will reset the state of the component to the initial state, after 2 seconds, if the postSuccess state is false.
//
//The component will have a function called handlePicture, which will set the picture state to the file uploaded by the user, and will set the picturePreview state to the preview of the file uploaded by the user.
//
//The component will have a function called handleFirstName, which will set the firstName state to the value of the input field.
//
//The component will have a function called handleLastName, which will set the lastName state to the value of the input field.
//
//The component will have a function called handleEmail, which will set the email state to the value of the input field.
//
//The component will have a function called handlePassword, which will set the password state to the value of the input field.
//
//The component will have a function called handlePassword2, which will set the password2 state to the value of the input field.
//
//The component will have a function called handleAge, which will set the age state to the value of the input field.
//
//The component will have a function called handleDescription, which will set the description state to the value of the input field.
//
//The component will have a function called handleSubmit, which will call the registerUser function, if the password and password2 states are equal.
//
//The component will have a function called handleLogin, which will redirect the user to the login page.
//
//The component will have a function called handleCancel, which will redirect the user to the home page.
//
//The component will have a function called handlePicture, which will set the picture state to the file uploaded by the user, and will set the picturePreview state to the preview of the file uploaded by the user.
//
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Form, Input, Label, Message } from "semantic-ui-react";

const Register = () => {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [password2, setPassword2] = useState("");
    const [age, setAge] = useState("");
    const [description, setDescription] = useState("");
    const [picture, setPicture] = useState("");
    const [picturePreview, setPicturePreview] = useState(null);
    const [error, setError] = useState(false);
    const [postSuccess, setPostSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    
    const navigate = useNavigate();
    
    useEffect(() => {
        if (postSuccess) {
        setTimeout(() => {
            setFirstName("");
            setLastName("");
            setEmail("");
            setPassword("");
            setPassword2("");
            setAge("");
            setDescription("");
            setPicture("");
            setPicturePreview(null);
            setError(false);
            setPostSuccess(false);
            setLoading(false);
        }, 3000);
        }
    }, [postSuccess]);
    
    const registerUser = async () => {
        try {
        setPostSuccess(false);
        setError(false);
        setLoading(true);
    
        const newUser = new FormData();
        newUser.append("name", firstName);
        newUser.append("surname", lastName);
        newUser.append("email", email);
        newUser.append("password", password);
        newUser.append("age", age);
        newUser.append("description", description);
        newUser.append("picture", picture);
        newUser.append("role", "user");
    
        const config = {
            method: "POST",
            "Content-Type": "multipart/form-data",
            body: newUser,
        };
    
        const response = await fetch(
            "http://localhost:3001/users/register",
            config
        );
        console.log("response:", response);
        if (response.ok) {
            setPostSuccess(true);
            navigate("/login");
        } else {
            setError(true);
            console.log("error:");
        }
        } catch (error) {
        setError(true);
        } finally {
        setLoading(false);
        setFirstName("");
        setLastName("");
        setEmail("");
        setPassword("");
        setPassword2("");
        setAge("");
        setDescription("");
        setPicture("");
        setPicturePreview(null);
        }
    };
    
    const handlePicture = (e) => {
        setPicture(e.target.files[0]);
        setPicturePreview(URL.createObjectURL(e.target.files[0]));
    };

return (
    <div className="register">
        <Form
        onSubmit={(e) => {
            e.preventDefault();
            if (password === password2) {
            registerUser();
            }
        }}
        >
        <Form.Field>
            <Label>First Name</Label>
            <Input
            type="text"
            placeholder="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            />
        </Form.Field>
        <Form.Field>
            <Label>Last Name</Label>
            <Input
            type="text"
            placeholder="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            />
        </Form.Field>
        <Form.Field>
            <Label>Email</Label>
            <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            />
        </Form.Field>
        <Form.Field>
            <Label>Password</Label>
            <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            />
        </Form.Field>
        <Form.Field>
            <Label>Confirm Password</Label>
            <Input
            type="password"
            placeholder="Confirm Password"
            value={password2}
            onChange={(e) => setPassword2(e.target.value)}
            />
        </Form.Field>
        <Form.Field>
            <Label>Age</Label>
            <Input
            type="number"
            placeholder="Age"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            />
        </Form.Field>
        <Form.Field>
            <Label>Description</Label>
            <Input
            type="text"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            />
        </Form.Field>
        <Form.Field>
            <Label>Picture</Label>
            <Input
            type="file"
            placeholder="Picture"
            onChange={handlePicture}
            />
        </Form.Field>
        <Button type="submit" loading={loading}>
            Register
        </Button>
        <Button onClick={() => navigate("/login")}>Login</Button>
        <Button onClick={() => navigate("/")}>Cancel</Button>
        </Form>
        {error && (
        <Message negative>
            <Message.Header>Something went wrong</Message.Header>
            <p>Please try again</p>
        </Message>
        )}
        {postSuccess && (
        <Message positive>
            <Message.Header>Success</Message.Header>
            <p>You have successfully registered</p>
        </Message>
        )}
    </div>
);
}
export default Register;