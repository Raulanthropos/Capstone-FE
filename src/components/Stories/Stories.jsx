import React, { useState } from "react";
import { Carousel, Container, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FaArrowLeft } from 'react-icons/fa';

// const Stories = () => {
//   const [index, setIndex] = useState(0);

//   const adoptedDogs = [
//     {
//       image:
//         "https://raw.githubusercontent.com/Raulanthropos/Capstone-FE/main/public/images/adopted-dog-1.jpeg",
//       title: "Buddy",
//       story:
//         "Buddy was adopted by a loving family in 2019. He is now a happy dog, and he loves to play with his new family.",
//     },
//     {
//       image:
//         "https://raw.githubusercontent.com/Raulanthropos/Capstone-FE/main/public/images/adopted-dog-2.PNG",
//       title: "Max",
//       story:
//         "Darling was adopted by a loving family in 2020. He loves to play fetch and cuddle with his new family.",
//     },
//     {
//       image:
//         "https://raw.githubusercontent.com/Raulanthropos/Capstone-FE/main/public/images/adopted-dog-3.jpeg",
//       title: "Axel",
//       story:
//         "Axel was adopted by a loving woman in 2019. He is now a happy dog, and he loves to play with his new mama.",
//     },
//   ];

//   const handleSelect = (selectedIndex) => {
//     setIndex(selectedIndex);
//   };

//   return (
//     <div className="stories">
//       <Container>
//         <Carousel activeIndex={index} onSelect={handleSelect}>
//           {adoptedDogs.map((dog) => (
//             <Carousel.Item key={dog.title}>
//                 <div className="image-container">
//               <img
//                 className="d-block w-100"
//                 src={dog.image}
//                 alt={dog.title}
//               />
//               </div>
//               <Carousel.Caption>
//                 <h3>{dog.title}</h3>
//                 <p>{dog.story}</p>
//               </Carousel.Caption>
//             </Carousel.Item>
//           ))}
//         </Carousel>
//         <div className="carousel-buttons">
//           <div className="carousel-button-prev" onClick={() => setIndex(index === 0 ? adoptedDogs.length - 1 : index - 1)}>
//             <span>&#8249;</span>
//           </div>
//           <div className="carousel-button-next" onClick={() => setIndex(index === adoptedDogs.length - 1 ? 0 : index + 1)}>
//             <span>&#8250;</span>
//           </div>
//         </div>
//       </Container>
//     </div>
//   );
// };

// export default Stories;

const Stories = () => {
    const adoptedDogs = [
      {
        image:
          "https://raw.githubusercontent.com/Raulanthropos/Capstone-FE/main/public/images/adopted-dog-1.jpeg",
        title: "Buddy",
        story:
          "Buddy was adopted by a loving family in 2019. He is now a happy dog, and he loves to play with his new family.",
      },
      // {
      //   image:
      //     "https://raw.githubusercontent.com/Raulanthropos/Capstone-FE/main/public/images/adopted-dog-2.PNG",
      //   title: "Max",
      //   story:
      //     "Darling was adopted by a loving family in 2020. He loves to play fetch and cuddle with his new family.",
      // },
      {
        image:
          "https://raw.githubusercontent.com/Raulanthropos/Capstone-FE/main/public/images/adopted-dog-3.jpeg",
        title: "Axel",
        story:
          "Axel was adopted by a loving woman in 2019. He is now a happy dog, and he loves to play with his new mama.",
      },
    ];
  
    const [currentStory, setCurrentStory] = useState(0);
  
    const handleNextStory = () => {
      if (currentStory < adoptedDogs.length - 1) {
        setCurrentStory(currentStory + 1);
      } else {
        setCurrentStory(0);
      }
    };
  
    const handlePreviousStory = () => {
      if (currentStory > 0) {
        setCurrentStory(currentStory - 1);
      } else {
        setCurrentStory(adoptedDogs.length - 1);
      }
    };
  
    return (
      <div className="stories">
        <div className="back-button">
          <Link to="/">
            <FaArrowLeft />
            <span>Back</span>
          </Link>
        </div>
        <Container>
          <Carousel
            activeIndex={currentStory}
            onSelect={setCurrentStory}
            interval={null}
          >
            {adoptedDogs.map((dog) => (
              <Carousel.Item key={dog.title}>
                <div className="image-container">
                  <img className="d-block w-100" src={dog.image} alt={dog.title} />
                </div>
                <Carousel.Caption>
                  <h3>{dog.title}</h3>
                  <p>{dog.story}</p>
                </Carousel.Caption>
              </Carousel.Item>
            ))}
          </Carousel>
        </Container>
      </div>
    );
  };
  
  export default Stories;