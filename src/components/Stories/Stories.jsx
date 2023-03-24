//Create a new component that will be called Stories. This component is about stories of dogs that were up for adoption, and got adopted by loving families. I have pictures, and I want them to be displayed as big cards, taking up the majority of each screen, carousel style (using react-bootstrap). The photo with the dog and the family should be displayed on top and have a fixed width and height, a title underneath, and a paragraph. Buttons should be there left and right, to switch from one story to another, and a "Back" button on the top left, to get the user back to the main page.
//
// import React, { useState, useEffect } from "react";
// import { Button, Form, Spinner, Modal } from "react-bootstrap";
// import "./Stories.css"

// const Stories = () => {
//     const adoptedDogs = [
//         {
//             image: "https://raw.githubusercontent.com/Raulanthropos/Capstone-FE/main/public/images/adopted-dog-1.jpeg",
//             title: "Buddy",
//             story: "Buddy was adopted by a loving family in 2019. He is now a happy dog, and he loves to play with his new family."
//         },
//         {
//             image: "https://raw.githubusercontent.com/Raulanthropos/Capstone-FE/main/public/images/adopted-dog-2.jpeg",
//             title: "Buddy",
//             story: "Buddy was adopted by a loving family in 2019. He is now a happy dog, and he loves to play with his new family."
//         },
//         {
//             image: "https://raw.githubusercontent.com/Raulanthropos/Capstone-FE/main/public/images/adopted-dog-3.jpeg",
//             title: "Axel",
//             story: "Axel was adopted by a loving woman in 2019. He is now a happy dog, and he loves to play with his new mama."
//         }
//     ]

//     const [currentStory, setCurrentStory] = useState(0);

//     const handleNextStory = () => {
//         if (currentStory < adoptedDogs.length - 1) {
//             setCurrentStory(currentStory + 1);
//         } else {
//             setCurrentStory(0);
//         }
//     }

//     const handlePreviousStory = () => {
//         if (currentStory > 0) {
//             setCurrentStory(currentStory - 1);
//         } else {
//             setCurrentStory(adoptedDogs.length - 1);
//         }
//     }

//     return (
//         <div className="stories">
//             <div className="story">
//                 <img className="story-image" src={adoptedDogs[currentStory].image} alt="adopted dog" />
//                 <h2 className="story-title">{adoptedDogs[currentStory].title}</h2>
//                 <p className="story-text">{adoptedDogs[currentStory].story}</p>
//             </div>
//             <div className="buttons">
//                 <Button className="previous-button" variant="primary" onClick={handlePreviousStory}>Previous</Button>
//                 <Button className="next-button" variant="primary" onClick={handleNextStory}>Next</Button>
//             </div>
//         </div>
//     )
    
// }

// export default Stories;

import React, { useState } from "react";
import { Carousel, Container } from "react-bootstrap";

const Stories = () => {
  const [index, setIndex] = useState(0);

  const adoptedDogs = [
    {
      image:
        "https://raw.githubusercontent.com/Raulanthropos/Capstone-FE/main/public/images/adopted-dog-1.jpeg",
      title: "Buddy",
      story:
        "Buddy was adopted by a loving family in 2019. He is now a happy dog, and he loves to play with his new family.",
    },
    {
      image:
        "https://raw.githubusercontent.com/Raulanthropos/Capstone-FE/main/public/images/adopted-dog-2.jpeg",
      title: "Max",
      story:
        "Max was adopted by a loving family in 2020. He loves to play fetch and cuddle with his new family.",
    },
    {
      image:
        "https://raw.githubusercontent.com/Raulanthropos/Capstone-FE/main/public/images/adopted-dog-3.jpeg",
      title: "Axel",
      story:
        "Axel was adopted by a loving woman in 2019. He is now a happy dog, and he loves to play with his new mama.",
    },
  ];

  const handleSelect = (selectedIndex) => {
    setIndex(selectedIndex);
  };

  return (
    <div className="stories">
      <Container>
        <Carousel activeIndex={index} onSelect={handleSelect}>
          {adoptedDogs.map((dog) => (
            <Carousel.Item key={dog.title}>
              <img
                className="d-block w-100"
                src={dog.image}
                alt={dog.title}
              />
              <Carousel.Caption>
                <h3>{dog.title}</h3>
                <p>{dog.story}</p>
              </Carousel.Caption>
            </Carousel.Item>
          ))}
        </Carousel>
        <div className="carousel-buttons">
          <div className="carousel-button-prev" onClick={() => setIndex(index === 0 ? adoptedDogs.length - 1 : index - 1)}>
            <span>&#8249;</span>
          </div>
          <div className="carousel-button-next" onClick={() => setIndex(index === adoptedDogs.length - 1 ? 0 : index + 1)}>
            <span>&#8250;</span>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Stories;
