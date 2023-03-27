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