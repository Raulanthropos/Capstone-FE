import { Container, Button } from "react-bootstrap";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Sorting from "../Sorting/Sorting";

export default function Main() {
  const { currentUser, isAuthenticated, accessToken } = useSelector((state) => state.loadedProfile);
  return <Container className="page-section dogs-page">
    <span className="eyebrow">GOOD COMPANY IS CLOSER THAN YOU THINK</span>
    <div className="page-heading"><h1>Meet your next companion.</h1>
      {currentUser?.role === "admin" && <Button as={Link} to="/admin/adoptions" variant="outline-dark">Review adoption requests</Button>}</div>
    {!currentUser ? <div className="empty-state"><h2>A new beginning starts with hello.</h2><p>Please login, to get access to this page!</p>
      <Button as={Link} to="/login">Login</Button> <Button as={Link} to="/register" variant="outline-dark">Create an account</Button></div> : <>
      <p className="text-muted">Welcome, {currentUser.name}!</p>
      {isAuthenticated && <Sorting key={accessToken} />}
    </>}
  </Container>;
}
