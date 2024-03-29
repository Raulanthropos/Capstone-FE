import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import NavBar from "./components/Navbar/Navbar";
import Home from './components/Home/Home';
import Register from './components/Register/Register';
import Login from './components/Login/Login';
import Main from './components/Main/MainLoggedInComp/MainLoggedInComp';
import User from './components/Main/User/User';
import Stories from './components/Stories/Stories';
import './App.css';

function App() {

  return (
    <>
      <main className='wrapper'>
        <BrowserRouter>
          <NavBar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/users/me" element={<User />} />
            <Route path="/main/" element={<Main/>} />
            <Route path="/main/*" element={<RouteNotFound />} />
            <Route path="/stories" element={<Stories />} />
          </Routes>
        </BrowserRouter>
      </main>
    </>
  )
}

function RouteNotFound() {
  return <h1>404 Not Found</h1>;
}

export default App;
