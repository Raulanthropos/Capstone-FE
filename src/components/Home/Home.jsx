// import React, { useEffect, useRef } from "react";
// import { Jumbotron } from "react-bootstrap";
// import Footer from "../Footer/Footer";
// import Stats from "../Stats/Stats";
// import Questions from "../Questions/Questions";
// import { ImageAlt } from "react-bootstrap-icons";
// import "./Home.css";

// const Home = () => {

//   return (
//     <>
//       <div style={{ position: "relative" }}>
//         <Jumbotron>
//           <h1>Adopt a dog today!</h1>
//           <p>
//             Find your perfect furry friend and give them a forever home. You'll
//             be rewarded with unconditional love and endless cuddles.
//           </p>
//           <p>Register now to start your adoption journey.</p>
//         </Jumbotron>
//         <div
//           style={{
//             height: "400px",
//             overflow: "hidden",
//             backgroundImage: `url(${process.env.PUBLIC_URL}/videos/funny-animals-cute.gif)`,
//             backgroundRepeat: "no-repeat",
//             width: "100%",
//             backgroundSize: "100% 100%",
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//           }}
//         >
//           <div
//             style={{
//               display: "flex",
//               zIndex: "2",
//               alignItems: "center",
//               justifyContent: "center",
//               flexDirection: "column",
//             }}
//           >
//             <h2 style={{ color: "white" }}>
//               You can assist our pledge by fostering one of our dogs, or
//               donating to our cause
//             </h2>
//             <div style={{ display: "flex", justifyContent: "center" }}>
//               <button
//                 className="btn btn-primary"
//                 style={{ marginRight: "10px", backgroundColor: "transparent", border: "1px solid white"}}
//               >
//                 Foster
//               </button>
//               <button
//                 className="btn btn-primary"
//                 style={{ marginLeft: "10px", backgroundColor: "transparent", border: "1px solid white" }}
//               >
//                 Donate
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//       <div>
//         <Stats />
//         <Questions />
//         <Footer />
//       </div>
//     </>
//   );
// };

// export default Home;

import React from "react";
import { Jumbotron } from "react-bootstrap";
import Footer from "../Footer/Footer";
import Stats from "../Stats/Stats";
import Questions from "../Questions/Questions";
import { ImageAlt } from "react-bootstrap-icons";
import "./Home.css";

const Home = () => {
  return (
    <>
      <div
        style={{
          position: "relative",
          backgroundImage: `url(${process.env.PUBLIC_URL}/videos/funny-animals-cute.gif)`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          height: "100vh",
        }}
      >
        <div
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
            <button
              className="btn btn-primary"
              style={{
                marginRight: "10px",
                backgroundColor: "transparent",
                border: "1px solid white",
              }}
            >
              Foster
            </button>
            <button
              className="btn btn-primary"
              style={{
                marginLeft: "10px",
                backgroundColor: "transparent",
                border: "1px solid white",
              }}
            >
              Donate
            </button>
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