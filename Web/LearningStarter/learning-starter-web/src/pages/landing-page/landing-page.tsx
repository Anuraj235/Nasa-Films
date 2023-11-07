import React, { useState } from "react";
import { Container, createStyles, Text } from "@mantine/core";

export const LandingPage = () => {
  const { classes } = useStyles();

  const [currentSlide, setCurrentSlide] = useState(0);

  const handleNextSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide + 1) % totalSlides);
  };

  const handlePrevSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide - 1 + totalSlides) % totalSlides);
  };

  return (
    <Container className={classes.homePageContainer}>
      <Text size="lg">NASSA FILMS</Text>

      <div className={classes.sliderContainer}>
        <button onClick={handlePrevSlide}>Previous</button>
        <div className={classes.slider}>
          {slides.map((slide, index) => (
            <div
              key={index}
              className={`${classes.slide} ${
                index === currentSlide ? classes.activeSlide : ""
              }`}
            >
                 <img
                src={`public/src/assets/${slide}`}
                alt={`Slide ${index + 1}`}
              />
            </div>
          ))}
        </div>
        <button onClick={handleNextSlide}>Next</button>
      </div>
    </Container>
  );
};

const totalSlides = 3; 
const slides = ["theatre1.jpg", "theatre2.jpg", "theatre3.jpg"]; 
const useStyles = createStyles(() => {
  return {
    homePageContainer: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    },
    sliderContainer: {
      width: "100%",
      maxWidth: "600px", 
      position: "relative",
      margin: "20px 0",
    },
    slider: {
      display: "flex",
      transition: "transform 0.5s ease-in-out",
    },
    slide: {
      minWidth: "100%",
      boxSizing: "border-box",
      overflow: "hidden",
    },
    activeSlide: {
      transform: "translateX(0)",
    },
  };
});
