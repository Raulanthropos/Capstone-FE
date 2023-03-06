import 'bootstrap/dist/css/bootstrap.min.css'
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import BasicExample from './components/Navbar/Navbar';
import FooterComp from './components/Footer/Footer';
import Home from './components/Home/Home';
import Hometest from './components/Hometest';

function App() {
  return (
    <>
    <BasicExample />
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </BrowserRouter>
      {/* <FooterComp /> */}
      </>
  )
}
export default App;
