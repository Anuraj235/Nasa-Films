import React from "react";
import { Container, Text, Grid, Title, Image } from "@mantine/core";
import Ajyol from "../../assets/Ajyol.jpg";
import Anuraj from "../../assets/Anuraj.jpg";
import Nick from "../../assets/Nick.jpg";
import Shreeza from "../../assets/Shreeza.jpg";
import Satyam from "../../assets/Satyam.jpg";
import Footer from "../../components/page-wrapper/footer";

export const AboutusPage = () => {
  const DeveloperCard = ({ name, imageSrc, altText }) => (
    <Grid.Col span={2} style={{ textAlign: "center", margin: "auto" }}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "space-evenly",
        }}
      >
        <Image src={imageSrc} alt={altText} radius={200} height={150} />
        <Text>{name}</Text>
      </div>
    </Grid.Col>
  );

  return (
    <>
      <Container>
        <Container>
          <Title
            order={1}
            c="#afffff"
            style={{
              textAlign: "center",
              marginTop: "2rem",
              padding: "0.5rem",
            }}
          >
            Who We Are
          </Title>
        </Container>

        <Grid>
          <Grid.Col span={12}>
            <Grid>
              <Grid.Col span={6}>
                <Image
                  src="https://imgs.search.brave.com/jOP24srbgNT7n-iFu-lkWP6J62ISXIRrVXUNiVZKyQE/rs:fit:860:0:0/g:ce/aHR0cHM6Ly9pbWFn/ZXMudW5zcGxhc2gu/Y29tL3Bob3RvLTE2/MTY1MzA5NDAzNTUt/MzUxZmFiZDk1MjRi/P2F1dG89Zm9ybWF0/JmZpdD1jcm9wJnE9/ODAmdz0xMDAwJml4/bGliPXJiLTQuMC4z/Jml4aWQ9TTN3eE1q/QTNmREI4TUh4elpX/RnlZMmg4TW54OGJX/OTJhV1Z6ZkdWdWZE/QjhmREI4Zkh3dw"
                  alt="Movie Poster"
                  style={{ width: "100%", height: "auto", maxWidth: "300px" }}
                />
              </Grid.Col>

              <Grid.Col span={6}>
                <Text
                  align="left"
                  size="md"
                  weight={500}
                  mt="lg"
                  style={{ fontFamily: "Times New Roman", marginLeft: "30px" }}
                >
                  Welcome to NASSA, your premier destination for an unparalleled
                  cinematic experience. At NASSA, we are dedicated to
                  transforming your movie-going journey into a memorable and
                  immersive adventure. As avid film enthusiasts ourselves, we
                  understand the magic that happens when the lights dim, the
                  screen comes to life, and captivating stories unfold.
                  Committed to providing the ultimate in entertainment, NASSA
                  brings you a carefully curated selection of the latest
                  blockbusters, timeless classics, and exclusive releases. Our
                  state-of-the-art theaters, coupled with cutting-edge
                  technology, ensure that every frame is a spectacle to behold.
                  Join us at NASSA, where passion meets the silver screen, and
                  let the magic of cinema transport you to new realms.
                </Text>
              </Grid.Col>
            </Grid>
          </Grid.Col>
        </Grid>

        <Container>
          <Title
            order={1}
            c="#afffff"
            style={{
              textAlign: "center",
              marginTop: "2rem",
              padding: "0.5rem",
            }}
          >
            Developers
          </Title>
        </Container>

        <Grid style={{ marginBottom: "5rem" }}>
          <DeveloperCard
            name="Ajyol Dhamala"
            imageSrc={Ajyol}
            altText="Ajyol Dhamala"
          />
          <DeveloperCard
            name="Anuraj Pant"
            imageSrc={Anuraj}
            altText="Anuraj Pant"
          />
          <DeveloperCard
            name="Nicholas Hoang"
            imageSrc={Nick}
            altText="Nicholas Hoang"
          />
          <DeveloperCard
            name="Shreeza Joshi"
            imageSrc={Shreeza}
            altText="Shreeza Joshi"
          />
          <DeveloperCard
            name="Satyam Pathak"
            imageSrc={Satyam}
            altText="Satyam Pathak"
          />
        </Grid>
      </Container>
      <Footer />
    </>
  );
};
