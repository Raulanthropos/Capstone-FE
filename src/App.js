import "bootstrap/dist/css/bootstrap.css";
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
import AdminAdoptions from "./components/Main/AdminAdoptions/AdminAdoptions";
import User from "./components/Main/User/User";
import Stories from "./components/Stories/Stories";
import Feedback from "./ui/Feedback.jsx";
import InboxProvider from "./inbox/InboxProvider";
import Notifications from "./inbox/Notifications";
import Messages from "./inbox/Messages";
import Footer from "./components/Footer/Footer";
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
    <div className="app-shell">
      <a className="skip-link" href="#main-content">Skip to content</a>
      <BrowserRouter>
        <InboxProvider>
        <NavBar />
        <main id="main-content" className="app-main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/users/me" element={<User />} />
          <Route path="/main/" element={<Main />} />
          <Route path="/admin/adoptions" element={<AdminAdoptions />} />
          <Route path="/main/*" element={<h1>404 Not Found</h1>} />
          <Route path="/stories" element={<Stories />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/messages/:requestId" element={<Messages />} />
          <Route path="*" element={<div className="container page-section"><h1>Page not found.</h1><a href="/">Back to home</a></div>} />
        </Routes>
        </main>
        <Footer />
        </InboxProvider>
      </BrowserRouter>
      <Feedback />
    </div>
  );
}

export default App;
