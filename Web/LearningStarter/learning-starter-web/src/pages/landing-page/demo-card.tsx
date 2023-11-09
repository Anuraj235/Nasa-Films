import React from "react";
import { Card, Image, Text } from "@mantine/core";

const DemoCard = ({ title, description, imageSrc, link }) => {
  return (
    <Card shadow="sm" p="lg" component="a" href={link} target="_blank">
      <Card.Section>
        <Image src={imageSrc} height={300} alt="Card Image" />
      </Card.Section>

      <Text weight={500} size="lg" mt="md">
        {title}
      </Text>

      <Text
        mt="xs"
        color="dimmed"
        size="sm"
        style={{
          overflow: "hidden",
          textOverflow: "ellipsis",
          display: "-webkit-box",
          WebkitBoxOrient: "vertical",
          WebkitLineClamp: 5, 
        }}
      >
        {description}
      </Text>
    </Card>
  );
};

export default DemoCard;
