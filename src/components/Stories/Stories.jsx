import React, { useState } from "react";
import { Carousel, Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FaArrowLeft } from 'react-icons/fa';

const Stories = () => {
    const adoptedDogs = [
      {
        image:
          "https://raw.githubusercontent.com/Raulanthropos/Capstone-FE/main/public/images/adopted-dog-1.jpeg",
        title: "Buddy",
        story:
          "Buddy was adopted by an amazing couple in 2022. He now calls them his new parents, and loves to chill with them in their new place.",
      },
      {
        image:
          "https://raw.githubusercontent.com/Raulanthropos/Capstone-FE/main/public/images/adopted-dog-3.jpeg",
        title: "Axel",
        story:
          "Axel was adopted by a loving woman in 2019. He is now a happy dog, and he loves to go on long walks with his new mama.",
      },
      {
        image:
          "https://raw.githubusercontent.com/Raulanthropos/Capstone-FE/main/public/images/adopted-dog-2.PNG",
        title: "Darling",
        story:
          "Darling was adopted by a caring family in 2020. She loves to play fetch and cuddle with her new family.",
      },
    ];
  
    const [currentStory, setCurrentStory] = useState(0);
  
    return (
      <div className="stories">
        <div className="back-button button-stl">
          <Link to="/" style={{textDecoration: "none"}}>
            <FaArrowLeft /> {" "}
            <span className="pdtop">Back</span>
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
                <div className="image-container" style={{height: "86vh"}}>
                  <img className="d-block w-100" src={dog.image} alt={dog.title} style={{objectFit: "cover", height: "100%"}} />
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