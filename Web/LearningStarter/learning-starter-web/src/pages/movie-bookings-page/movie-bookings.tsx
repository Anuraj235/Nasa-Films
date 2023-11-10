import React, { useEffect, useState } from "react";
import { ApiResponse, MovieGetDto } from "../../constants/types";
import api from "../../config/axios";
import { showNotification } from "@mantine/notifications";
import {
  Rating,
  NumberInput,
  Image,
  Button,
  Container,
  Grid,
  Card,
  Text,
} from "@mantine/core";
import { useNavigate, useParams } from "react-router-dom";
import { routes } from "../../routes";

export const MovieBookingPage = () => {
  const [movie, setMovies] = useState<MovieGetDto>();
  const { id } = useParams();
  const navigate = useNavigate();

  const [ticketCount, setTicketCount] = useState(1);
  const handleTicketChange = (value) => {
    if (value > 0) {
      setTicketCount(value);
    }
  };

  useEffect(() => {
    fetchMovie();

    async function fetchMovie() {
      const response = await api.get<ApiResponse<MovieGetDto>>(
        `/api/movies/${id}`
      );

      if (response.data.hasErrors) {
        showNotification({ message: "Error fetching products." });
      }

      if (response.data.data) {
        console.log("data",response.data.data)
        setMovies(response.data.data);
      }
    }
  }, [id]);

  return (
    <>
      <Container>
        <Grid gutter="md">
          <Grid.Col span={6}>
            {movie && (
              <Card shadow="sm" p="lg">
                <Card.Section>
                  <Image
                    src={movie.imageUrl}
                    alt={movie.title}
                    style={{objectFit:"contain"}}
                  />
                </Card.Section>
              </Card>
            )}
          </Grid.Col>
          <Grid.Col span={6}>
            <Container>
              <Text size="xl" weight={500} mt="md">
                {movie && movie.title}
              </Text>
              <Rating value={movie && movie.rating} />
              <Text mt="xs" color="dimmed" size="sm">
                Description: {movie && movie.description}
              </Text>
              <NumberInput
                style={{ marginTop: "12px" }}
                variant="filled"
                radius="xs"
                label="Tickets:"
                withAsterisk
                placeholder="Enter the number of tickets."
                value={ticketCount}
                onChange={handleTicketChange}
                max={10}
                min={1}
              />

              <p style={{ margin: "12px 0", textAlign: "center" }}>
                Estimated Amount: $ {ticketCount > 0 ? ticketCount * 5 : 0}
              </p>
              <ul>
                {movie && movie.showtimes.map((showtime) => (
                  <li key={showtime.id}>
                    {showtime.startTime} - Available Seats: {showtime.availableSeats}
                  </li>
                ))}
              </ul>
              <Container style={{ textAlign: "center" }}>
                <Button
                  variant="light"
                  radius="md"
                  onClick={() => {
                    navigate(routes.showtimelisting);
                  }}
                >
                  Book now
                </Button>
              </Container>
            </Container>
          </Grid.Col>
        </Grid>
      </Container>
    </>
  );
};
