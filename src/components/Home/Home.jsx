import { Button, Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { FaArrowRight, FaPaw } from "react-icons/fa";
import "./Home.css";

const steps = [
  ["01", "Find your kind of companion.", "Meet the dogs, get to know their personalities and imagine your everyday life together."],
  ["02", "Tell us a little about you.", "Create a profile and send an adoption request. Our team reviews each application with care."],
  ["03", "Start a conversation.", "Ask questions, receive updates and talk through the next steps with the adoption team."],
];
export default function Home() {
  const user = useSelector((state) => state.loadedProfile.currentUser);
  return <>
    <Container className="home-hero">
      <div className="hero-copy">
        <span className="hero-pill"><FaPaw aria-hidden="true" /> A new beginning, together</span>
        <h1>Small paws.<br />Big <em>love.</em><br />Your next chapter.</h1>
        <p>A companion for the ordinary days and the extraordinary ones. Find a dog. Make a connection. Give love a place to call home.</p>
        <div className="hero-actions"><Button as={Link} to="/main">Meet the dogs <FaArrowRight aria-hidden="true" /></Button>
          <a href="#how-it-works">How it works ↗</a></div>
        <p className="hero-footnote">Thoughtful matches. Real conversations. A little more love.</p>
      </div>
      <div className="hero-photo"><img src="/images/charlesdeluvio-K4mSJ7kc0As-unsplash-dog_4.jpg" alt="A small black dog looking up with bright, curious eyes" fetchpriority="high" />
        <div className="hero-note"><span className="note-icon"><FaPaw aria-hidden="true" /></span><div><strong>A home changes everything.</strong><span>And sometimes, so do four little paws.</span></div></div>
      </div>
    </Container>
    <section className="home-process" id="how-it-works"><Container>
      <div className="section-heading"><span className="eyebrow">GOOD THINGS START WITH A CONNECTION</span><h2>A little less searching.<br />A little more <em>belonging.</em></h2>
        <p>One place to meet your companion and take the next steps, at your own pace.</p></div>
      <div className="process-grid">{steps.map(([number, title, body]) => <article key={number}><span className="step-number">{number}</span><h3>{title}</h3><p>{body}</p></article>)}</div>
    </Container></section>
    <Container className="home-story"><img src="/images/adopted-dog-3.jpeg" alt="A dog enjoying a quiet moment at home" loading="lazy" />
      <div><span className="eyebrow">ROOM FOR ONE MORE</span><h2>The best part of your day could have <em>four paws.</em></h2>
        <p>A walk around the block. A familiar face at the door. A friend for all the in-between moments. Every connection begins with getting to know each other.</p>
        <Button as={Link} to="/stories" variant="outline-dark">Explore the stories ↗</Button></div>
    </Container>
    <section className="home-faq"><Container><div className="section-heading"><span className="eyebrow">A FEW THINGS YOU MIGHT BE WONDERING</span><h2>Before you say <em>hello.</em></h2></div>
      <details><summary>How do I apply to adopt a dog?</summary><p>Create an account, open the dogs page and select the dog you would like to adopt. Confirm your request and the team will review it.</p></details>
      <details><summary>Does submitting a request confirm an adoption?</summary><p>No. Each request is reviewed by an administrator. You will receive an in-app notification when a decision is made.</p></details>
      <details><summary>Can I talk to someone about my request?</summary><p>Yes. Each adoption request has a private conversation with the applicant and the admin team. Open Messages after submitting your request.</p></details>
    </Container></section>
    <Container className="home-cta"><span className="eyebrow">YOUR NEXT CHAPTER STARTS HERE</span><h2>Make room for a little <em>more love.</em></h2>
      <Button as={Link} to={user ? "/main" : "/register"}>{user ? "Meet the dogs" : "Find your companion"} <FaArrowRight aria-hidden="true" /></Button></Container>
  </>;
}
