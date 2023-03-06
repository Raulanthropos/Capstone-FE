//Create a new component called Home, which will be the landing page for the app. Add a video gif to the Home component.
// import React from "react";
// import { Jumbotron, Button } from "react-bootstrap";
// import { Link } from "react-router-dom";
// import ReactPlayer from "react-player";

// const Home = () => (
//   <>
//     <Jumbotron
//       style={{
//         backgroundImage: `url(${process.env.PUBLIC_URL}/images/chios.jpg)`,
//         backgroundSize: "100% 100%",
//         backgroundRepeat: "no-repeat",
//         color: "#FFFFFF"
//       }}
//     >
//       <h1>Adopt a dog today!</h1>
//       <p>
//         Find your perfect furry friend and give them a forever home. You'll be
//         rewarded with unconditional love and endless cuddles.
//       </p>
//       <p>Register now to start your adoption journey.</p>
//     </Jumbotron>
//     <ReactPlayer
//       url={process.env.PUBLIC_URL + "videos/woofpaysgif.mp4"}
//       type="video/mp4"
//       playing
//       loop
//       muted
//       playsinline
//       width="100%"
//       height="100%"
//       style={{
//         position: "fixed",
//         top: 0,
//         left: 0,
//         zIndex: -1,
//       }}
//       preload="auto"
//     />
//   </>
// );

// export default Home;

//Skip the first second of the video playing
import React, { useEffect, useRef } from "react";
import { Jumbotron } from "react-bootstrap";

const Home = () => {
  const videoRef = useRef(null);

  useEffect(() => {
    videoRef.current.currentTime = 1.5;
    videoRef.current.play();
  }, []);

  return (
    <>
      <Jumbotron
        style={{
          backgroundImage: `url(${process.env.PUBLIC_URL}/images/chios.jpg)`,
          backgroundSize: "100% 100%",
          backgroundRepeat: "no-repeat",
        }}
      >
        <h1>Adopt a dog today!</h1>
        <p>
          Find your perfect furry friend and give them a forever home. You'll be
          rewarded with unconditional love and endless cuddles.
        </p>
        <p>Register now to start your adoption journey.</p>
      </Jumbotron>
      <video
        ref={videoRef}
        src={process.env.PUBLIC_URL + "videos/woofpaysgif.mp4"}
        type="video/mp4"
        autoPlay
        loop
        muted
        playsInline
        width="100%"
        height="100%"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          zIndex: -1,
        }}
        preload="auto"
      />
    </>
  );
};

export default Home;


