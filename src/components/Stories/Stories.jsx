import { Button, Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./Stories.css";

const stories = [
  { name: "Buddy", image: "adopted-dog-1.jpeg", title: "A place to put his paws up.", text: "Buddy's story is about finding his people, settling into a new home and discovering that the quiet moments can be the best ones." },
  { name: "Axel", image: "adopted-dog-3.jpeg", title: "A friend for the long way home.", text: "For Axel, a new beginning means long walks, familiar routines and someone to share the adventure with." },
  { name: "Darling", image: "adopted-dog-2.PNG", title: "One more member of the family.", text: "Darling's story is full of games of fetch, a favourite spot on the sofa and a family ready to make room for her." },
];
export default function Stories() {
  return <Container className="page-section stories-page"><span className="eyebrow">LIFE WITH A LITTLE MORE LOVE</span>
    <h1>Every home has a <em>story.</em></h1><p className="text-muted">Illustrative adoption stories from the original Woof Paws project.</p>
    <div className="story-grid">{stories.map((story) => <article className="story-card" key={story.name}>
      <img src={"/images/" + story.image} alt={story.name} loading="lazy" />
      <div><span className="eyebrow">{story.name}</span><h2>{story.title}</h2><p>{story.text}</p></div>
    </article>)}</div>
    <div className="stories-cta"><h2>Ready for a story of your own?</h2><Button as={Link} to="/main">Meet the dogs ↗</Button></div>
  </Container>;
}
