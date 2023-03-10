import {
    faPaw,
    faHeart,
    faBone,
    faDog,
  } from "@fortawesome/free-solid-svg-icons";
  import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
  import React from "react";
  import "./Stats.css";
  import Col from "react-bootstrap/Col"; // import the Col component
  
  const Stats = () => {
    return (
      <div className="container">
        <div className="row card-container">
          <Col md={3} mb={3} className="bggrey">
            <div className="card text-center bg-trans">
              <div className="card-body kheight" style={{overflow: "hidden", borderRadius: "1rem"}}>
                <FontAwesomeIcon icon={faHeart} size="3x" className="mb-3" />
                <h3 className="card-title">Save a Life</h3>
                <p className="card-text">
                  Adopt a dog and give them a second chance at happiness.
                </p>
              </div>
            </div>
          </Col>
          <Col md={3} mb={3} className="bggrey">
            <div className="card text-center bg-trans">
              <div className="card-body kheight" style={{overflow: "hidden", borderRadius: "1rem"}}>
                <FontAwesomeIcon icon={faDog} size="3x" className="mb-3" />
                <h3 className="card-title">Over 1000 Dogs</h3>
                <p className="card-text">
                  We have over 1000 dogs available for adoption.
                </p>
              </div>
            </div>
          </Col>
          <Col md={3} mb={3} className="bggrey">
            <div className="card text-center bg-trans">
              <div className="card-body kheight" style={{overflow: "hidden", borderRadius: "1rem"}}>
                <FontAwesomeIcon icon={faBone} size="3x" className="mb-3" />
                <h3 className="card-title">Become a Foster Family</h3>
                <p className="card-text">
                  Help us care for dogs in need by providing a temporary home.
                </p>
              </div>
            </div>
          </Col>
          <Col md={3} mb={3} className="bggrey">
            <div className="card text-center bg-trans">
              <div className="card-body kheight" style={{overflow: "hidden", borderRadius: "1rem"}}>
                <FontAwesomeIcon icon={faPaw} size="3x" className="mb-3" />
                <h3 className="card-title">Feed a Dog in Need</h3>
                <p className="card-text">
                  Your donation can provide food for a shelter dog for a week.
                </p>
              </div>
            </div>
          </Col>
        </div>
      </div>
    );
  };
  
  export default Stats;
  