import React, { useRef } from "react";
import { createStyles, Grid, Text, Container, Title } from "@mantine/core";
import { Carousel } from "@mantine/carousel";
import Autoplay from "embla-carousel-autoplay";

import image1 from "../../assets/theatre1.jpg";
import image2 from "../../assets/theatre2.jpg";
import image3 from "../../assets/theatre3.jpg";
import DemoCard from "./demo-card";
import Footer from "../../components/page-wrapper/footer";

//This is a basic Component, and since it is used inside of
//'../../routes/config.tsx' line 31, that also makes it a page
export const LandingPage = () => {
  const { classes } = useStyles();

  const autoplay = useRef(Autoplay({ delay: 2000 }));

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
        c="dimmed"
        style={{
          textAlign: "center",
          marginTop: "2rem",
          padding: "0.5rem",
          margin: "0 auto",
        }}
      >
        Now Showing
      </Title>

      <Container mt="4rem" mb="8rem">
        <Grid>
          <Grid.Col span={3}>
            <DemoCard
              title="Mission: Impossible – Dead Reckoning"
              description="Ethan Hunt and the IMF team must track down a terrifying new weapon that threatens all of humanity if it falls into the wrong hands. With control of the future and the fate of the world at stake, a deadly race around the globe begins."
              imageSrc="https://upload.wikimedia.org/wikipedia/en/e/ed/Mission-_Impossible_%E2%80%93_Dead_Reckoning_Part_One_poster.jpg"
              link="https://www.youtube.com/watch?v=avz06PDqDbM"
            />
          </Grid.Col>
          <Grid.Col span={3}>
            <DemoCard
              title="Pashupati Prasad 2: Bhasme Don"
              description="After the tragic death of Pashupati Prasad, Bhasme searches for his own identity. While struggling to collect 10 lakh rupees, he is robbed and must get his money back."
              imageSrc="https://m.media-amazon.com/images/M/MV5BYmViNDM3MGMtZDc3MS00YTc0LThjZGItYmIyYTg2ZDFlOGFiXkEyXkFqcGdeQXVyMTM0Mzg0NzYy._V1_.jpg"
              link="https://www.youtube.com/watch?v=RJ-lBeZ1TYc"
            />
          </Grid.Col>
          <Grid.Col span={3}>
            <DemoCard
              title="Baahubali 2: The Conclusion"
              description="When Bhallaladeva conspires against his brother to become the king of Mahishmati, he has him killed by Katappa and imprisons his wife. Years later, his brother's son returns to avenge his father's death."
              imageSrc="https://m.media-amazon.com/images/I/51gxJ6erZGL._AC_UF894,1000_QL80_.jpg"
              link="https://www.youtube.com/watch?v=G62HrubdD6o"
            />
          </Grid.Col>
          <Grid.Col span={3}>
            <DemoCard
              title="AXCN: Ghost in the Shell"
              description="In this Japanese animation, cyborg federal agent Maj. Motoko Kusanagi (Mimi Woods) trails 'The Puppet Master' (Abe Lasser), who illegally hacks into the computerized minds of cyborg-human hybrids. "
              imageSrc="https://s3.us-east-1.amazonaws.com/mt-website-prod-contentbucket-1tg1jr7b5zn9a/images/movie-posters/HO00004216.jpg?w=205&h=307"
              link="https://www.youtube.com/watch?v=HJt0oYvtpLM"
            />
          </Grid.Col>
        </Grid>
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
