import 'bootstrap/dist/css/bootstrap.min.css'
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import NavBar from "./components/Navbar/Navbar";
import Home from './components/Home/Home';
import Register from './components/Register/Register';
import './App.css';

function App() {
  return (
    <>
    <NavBar />
    <main className='wrapper'>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
    </main>
      </>
  )
}
export default App;
