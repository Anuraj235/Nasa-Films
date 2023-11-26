import React, { useEffect, useRef, useState } from "react";
import { createStyles, Grid, Text, Container, Title } from "@mantine/core";
import { Carousel } from "@mantine/carousel";
import Autoplay from "embla-carousel-autoplay";

import image1 from "../../assets/theatre1.jpg";
import image2 from "../../assets/theatre2.jpg";
import image3 from "../../assets/theatre3.jpg";
import DemoCard from "./demo-card";
import Footer from "../../components/page-wrapper/footer";
import { ApiResponse, MovieGetDto } from "../../constants/types";
import api from "../../config/axios";
import { showNotification } from "@mantine/notifications";

//This is a basic Component, and since it is used inside of
//'../../routes/config.tsx' line 31, that also makes it a page
export const LandingPage = () => {
  const { classes } = useStyles();
  const [movies, setMovies] = useState<MovieGetDto[]>();

  const autoplay = useRef(Autoplay({ delay: 2000 }));
  
  useEffect(() => {
    fetchMovies();
    async function fetchMovies() {
      const response = await api.get<ApiResponse<MovieGetDto[]>>('/api/movies');
      if (response.data.hasErrors) {
        showNotification({ message: 'Error Fetching Showtimes' });
      }

      if (response.data.data) {
        setMovies(response.data.data);
      }
    }
  }, []);
  return (
    <>
      <Carousel
        sx={{ maxWidth: 1440, position: "relative" }}
        withIndicators
        height={550}
        plugins={[autoplay.current]}
        onMouseEnter={autoplay.current.stop}
        onMouseLeave={autoplay.current.reset}
      >
        {/* WORKAROUND: Adding stop propagation to stop the error for now */}
        <Carousel.Slide>
          <img
            onClick={(e) => e.stopPropagation()}
            src={image1}
            alt="Slide 1"
            style={{ objectFit: "fill", width: "100%", height: "100%" }}
          />
        </Carousel.Slide>
        <Carousel.Slide>
          <img
            onClick={(e) => e.stopPropagation()}
            src={image2}
            alt="Slide 2"
            style={{ objectFit: "fill", width: "100%", height: "100%" }}
          />
        </Carousel.Slide>
        <Carousel.Slide>
          <img
            onClick={(e) => e.stopPropagation()}
            src={image3}
            alt="Slide 3"
            style={{ objectFit: "fill", width: "100%", height: "100%" }}
          />
        </Carousel.Slide>
      </Carousel>
      <Title
        order={1}
        c="#afffff"
        style={{
          textAlign: "center",
          marginTop: "3rem",
          padding: "0.5rem",
          margin: "0 auto",
        }}
      >
        Now Showing
      </Title>

       <Container mt="3rem" mb="7rem">
       {movies && (
          <Grid>
            {movies.slice(0, 4).map((movie) => (
              <Grid.Col key={movie.id} span={3}>
                <DemoCard
                  title={movie.title}
                  description={movie.description}
                  imageSrc={movie.imageUrl}
                  link={movie.trailerUrl}
                />
              </Grid.Col>
            ))}
          </Grid>
        )}
      </Container>
      <Footer />
    </>
  );
};

const useStyles = createStyles(() => {
  return {
    // Add any additional styles if needed
  };
});
