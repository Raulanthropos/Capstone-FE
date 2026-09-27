import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Spinner } from "react-bootstrap";
import { restoreSession } from "./redux/actions/profileAction";
import NavBar from "./components/Navbar/Navbar";
import Home from "./components/Home/Home";
import Register from "./components/Register/Register";
import Login from "./components/Login/Login";
import Main from "./components/Main/MainLoggedInComp/MainLoggedInComp";
import User from "./components/Main/User/User";
import Stories from "./components/Stories/Stories";
import "./App.css";

function App() {
  const [sessionReady, setSessionReady] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    let active = true;
    dispatch(restoreSession()).finally(() => {
      if (active) setSessionReady(true);
    });
    return () => { active = false; };
  }, [dispatch]);

  if (!sessionReady) {
    return <div role="status" className="text-center mt-5"><Spinner animation="border" /> Loading...</div>;
  }

  return (
    <main className="wrapper">
      <BrowserRouter>
        <NavBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/users/me" element={<User />} />
          <Route path="/main/" element={<Main />} />
          <Route path="/main/*" element={<h1>404 Not Found</h1>} />
          <Route path="/stories" element={<Stories />} />
        </Routes>
      </BrowserRouter>
    </main>
  );
}

export default App;
