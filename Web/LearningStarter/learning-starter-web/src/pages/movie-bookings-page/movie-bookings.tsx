import React, { useEffect, useState } from "react";
import { ApiResponse, BookingGetDto, MovieGetDto } from "../../constants/types";
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
  createStyles,
} from "@mantine/core";
import { useNavigate, useParams } from "react-router-dom";
import { routes } from "../../routes";
import { useForm } from "@mantine/form";

export const MovieBookingPage = () => {
  const [movie, setMovies] = useState<MovieGetDto>();
  const [selectedShowtime, setSelectedShowtime] = useState<string | null>(null);
  const { id } = useParams();
  const navigate = useNavigate();
  const { classes } = useStyles();


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
        console.log("data", response.data.data);
        setMovies(response.data.data);
      }
    }
  }, [id]);

  const form = useForm({
    initialValues: {
        showtimeId: 0,
        numberOfTickets: 0,
        tenderAmount: 0,
    },
});

const handleSubmit = async () => {
  try {
    const selectedShowtimeId = movie?.showtimes.find((showtime) => showtime.startTime === selectedShowtime)?.id;

    if (selectedShowtimeId) {
      form.setFieldValue('showtimeId', selectedShowtimeId);
      form.setFieldValue('tenderAmount', ticketCount * 5);
      form.setFieldValue('numberOfTickets', ticketCount);
      //form.setFieldValue('userId', 1);

      const response = await api.post<ApiResponse<BookingGetDto>>('/api/bookings', form.values);

      if (response.data.data) {
        showNotification({ message: "Successfully booked tickets", color: "green" });
        form.reset();
        navigate(routes.home);
      }
    } else {
      showNotification({ message: "Please select a showtime", color: "red" });
    }
  } catch (error) {
    showNotification({ message: "Error creating booking", color: "red" });
  }
};

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
                    style={{ objectFit: "contain" }}
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

              <p>Available showtimes:</p>
              <Container>
                {movie &&
                  movie.showtimes.map((showtime) => (
                    <Button
                      key={showtime.id}
                      variant="outline"
                      color={selectedShowtime === showtime.startTime ? "blue" : "gray"}
                      style={{ marginRight: '8px' }}
                      onClick={() => setSelectedShowtime(showtime.startTime)}
                    >
                      {showtime.startTime}
                    </Button>
                  ))}
              </Container>

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

              <Container style={{ textAlign: "center" }}>
                <Button
                  variant="light"
                  radius="md"
                  onClick={handleSubmit}
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

const useStyles = createStyles(() => ({
  inputField: {
    'label': {
      color: "#9C7A4B",
    },
  },
  submitButton: {
    padding: "12px 0",
    fontSize: "18px",
    fontWeight: "bold",
    transition: "background 0.3s",
  },
}));
