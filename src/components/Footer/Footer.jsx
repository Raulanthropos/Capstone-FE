import { Container } from "react-bootstrap";
import { Link } from "react-router-dom";
export default function Footer() {
  return <footer className="site-footer"><Container className="footer-inner">
    <p><strong>Woof Paws</strong><br />Good company. New beginnings.</p>
    <nav className="footer-links" aria-label="Footer"><Link to="/main">Meet the dogs</Link><Link to="/stories">Stories</Link><Link to="/users/me">Your profile</Link></nav>
    <span>Made for a little more love.</span>
  </Container></footer>;
}
