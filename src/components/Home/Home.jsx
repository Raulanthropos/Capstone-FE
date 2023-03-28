import Footer from "../Footer/Footer";
import Stats from "../Stats/Stats";
import Questions from "../Questions/Questions";
import {Button} from "react-bootstrap";
import { Link } from "react-router-dom";
import "./Home.css";

const Home = () => {
  return (
    <>
      <div className="home-container"
        style={{
          position: "relative",
          backgroundImage: `url(${process.env.PUBLIC_URL}/images/dog-gif-animation1.gif)`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          height: "100vh",
        }}
      >
        <div className="child-content"
          style={{
            position: "absolute",
            top: "0",
            left: "0",
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            zIndex: "1",
            fontSize: "28px",
          }}
        >
          <h1 style={{ color: "white", textAlign: "center" }}>
            Adopt a dog today!
          </h1>
          <p style={{ color: "white", textAlign: "center" }}>
            Find your perfect furry friend and give them a forever home. You'll
            be rewarded with unconditional love and endless cuddles.
          </p>
          <p style={{ color: "white", textAlign: "center" }}>
            Register now to start your adoption journey.
          </p>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Button
              className="btn btn-primary"
              style={{
                marginRight: "10px",
                backgroundColor: "transparent",
                border: "1px solid white",
              }}
            >
              <Link to="/register" style={{color: "#FFFFFF"}}>Foster</Link>
            </Button>
            <Button
              className="btn btn-primary"
              style={{
                marginLeft: "10px",
                backgroundColor: "transparent",
                border: "1px solid white",
              }}
            >
              <Link to="/stories" style={{color: "#FFFFFF"}}>Stories</Link>
            </Button>
          </div>
        </div>
      </div>
      <div>
        <Stats />
        <Questions />
        <Footer />
      </div>
    </>
  );
};

export default Home;