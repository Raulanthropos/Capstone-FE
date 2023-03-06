import React, { useEffect, useRef } from "react";
import { Jumbotron } from "react-bootstrap";
import Footer from "../Footer/Footer";
import Stats from "../Stats/Stats";
import Questions from "../Questions/Questions";

const Home = () => {
  const videoRef = useRef(null);

  useEffect(() => {
    videoRef.current.currentTime = 1.5;
    videoRef.current.play();
  }, []);

  return (
    <>
      <div style={{ position: "relative" }}>
        <Jumbotron
          style={{
            backgroundImage: `url(${process.env.PUBLIC_URL}/images/chios.jpg)`,
            backgroundSize: "100% 100%",
            backgroundRepeat: "no-repeat",
            color: "#FFFFFF",
            zIndex: 1,
            marginBottom: 0,
          }}
        >
          <h1>Adopt a dog today!</h1>
          <p>
            Find your perfect furry friend and give them a forever home. You'll be
            rewarded with unconditional love and endless cuddles.
          </p>
          <p>Register now to start your adoption journey.</p>
        </Jumbotron>
        <div
          style={{
            position: "relative",
            width: "100%",
            height: "0",
            paddingTop: "56.25%", // 16:9 aspect ratio
          }}
        >
          <video
            ref={videoRef}
            src={process.env.PUBLIC_URL + "videos/woofpaysgif.mp4"}
            type="video/mp4"
            autoPlay
            loop
            muted
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
            preload="auto"
          />
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
