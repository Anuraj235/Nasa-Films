import React from "react";
import { Container, Grid, Text, Title, Paper } from "@mantine/core";
import {
  IconBrandFacebook,
  IconBrandInstagram,
  IconBrandX,
  IconBrandYoutube,
} from "@tabler/icons-react";

const Footer = () => {
  return (
    <>
      <Grid style={{ backgroundColor: "#090708" }}>
        <Grid.Col span={6} style={{ textAlign: "left", paddingLeft: "4rem" }}>
          <Title order={6}>Contact:</Title>
          <Text fz="sm">Email: nassa@selu.edu</Text>
          <Text fz="sm">Phone: 9859898989</Text>
        </Grid.Col>
        <Grid.Col
          span={6}
          style={{
            textAlign: "right",
            display: "flex",
            justifyContent: "flex-end",
            paddingRight: "4rem",
          }}
        >
          <IconBrandFacebook name="brand-facebook" size={24} color="blue" />
          <IconBrandX name="brand-X" size={24} color="white" />
          <IconBrandInstagram
            name="brand-instagram"
            size={24}
            color="#e75480"
          />
          <IconBrandYoutube name="brand-youtube" size={24} color="red" />
        </Grid.Col>
        <Container>
          <Text fz="sm" align="center">
            © 2023 NASSA. All rights reserved.
          </Text>
        </Container>
      </Grid>
    </>
  );
};

export default Footer;
