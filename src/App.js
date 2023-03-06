import 'bootstrap/dist/css/bootstrap.min.css'
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import BasicExample from './components/Navbar/Navbar';
import Home from './components/Home/Home';
import './App.css';

function App() {
  return (
    <>
    <BasicExample />
    <main className='wrapper'>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </BrowserRouter>
    </main>
      </>
  )
}
export default App;
