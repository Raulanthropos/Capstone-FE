//Create a new component that will be called Stories. This component is about stories of dogs that were up for adoption, and got adopted by loving families. I have pictures, and I want them to be displayed as big cards, taking up the majority of each screen, carousel style (using react-bootstrap). The photo with the dog and the family should be displayed on top and have a fixed width and height, a title underneath, and a paragraph. Buttons should be there left and right, to switch from one story to another, and a "Back" button on the top left, to get the user back to the main page.
//
import React, { useState, useEffect } from "react";
import { Button, Form, Spinner, Modal } from "react-bootstrap";

const Stories = () => {
    const adoptedDogs = [
        {
            image: "../../../public/images/adopted-dog-1.jpg",
            title: "Buddy",
            story: "Buddy was adopted by a loving family in 2019. He is now a happy dog, and he loves to play with his new family."
        },
        {
            image: "images/adopted-dog-2.jpg",
            title: "Buddy",
            story: "Buddy was adopted by a loving family in 2019. He is now a happy dog, and he loves to play with his new family."
        },
        {
            image: "images/adopted-dog-3.jpg",
            title: "Axel",
            story: "Axel was adopted by a loving woman in 2019. He is now a happy dog, and he loves to play with his new mama."
        }
    ]

    const [currentStory, setCurrentStory] = useState(0);

    const handleNextStory = () => {
        if (currentStory < adoptedDogs.length - 1) {
            setCurrentStory(currentStory + 1);
        } else {
            setCurrentStory(0);
        }
    }

    const handlePreviousStory = () => {
        if (currentStory > 0) {
            setCurrentStory(currentStory - 1);
        } else {
            setCurrentStory(adoptedDogs.length - 1);
        }
    }

    return (
        <div className="stories">
            <div className="story">
                <img src={adoptedDogs[currentStory].image} alt="adopted dog" />
                <h2>{adoptedDogs[currentStory].title}</h2>
                <p>{adoptedDogs[currentStory].story}</p>
            </div>
            <div className="buttons">
                <Button variant="primary" onClick={handlePreviousStory}>Previous</Button>
                <Button variant="primary" onClick={handleNextStory}>Next</Button>
            </div>
        </div>
    )
}

export default Stories;