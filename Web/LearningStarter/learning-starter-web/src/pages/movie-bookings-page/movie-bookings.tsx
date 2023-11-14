import React, { useEffect, useState } from "react";
import { ApiResponse, BookingGetDto, MovieGetDto, Showtime, TheaterGetDto } from "../../constants/types";
import api from "../../config/axios";
import { showNotification } from "@mantine/notifications";
import {
  Rating,
  NumberInput,
  Image,
  Button,
  Container,
  Select,
  Grid,
  Card,
  Text
} from "@mantine/core";
import { DatePicker } from '@mantine/dates';
import { useNavigate, useParams } from "react-router-dom";
import { routes } from "../../routes";
import { useForm } from "@mantine/form";
import { useAuth } from "../../authentication/use-auth";

export const MovieBookingPage = () => {

  const [movie, setMovies] = useState<MovieGetDto>();
  const [theaters, setTheaters] = useState<TheaterGetDto[]>();
  const [selectedTheaterId, setSelectedTheaterId] = useState<number | null>(null);
  const [availableShowtimes, setAvailableShowtimes] = useState<Showtime[]>([]);
  const [selectedShowtime, setSelectedShowtime] = useState<string | null>(null);
  const [value, setValue] = useState(new Date());
  const [ticketCount, setTicketCount] = useState(1);

  const { user } = useAuth()
  const { id } = useParams();
  const navigate = useNavigate();

  const handleTicketChange = (value) => {
    if (value > 0) {
      setTicketCount(value);
    }
  };
  const handleDateChange = (newValue: Date | null) => {
    if (newValue) {
      setValue(newValue);
    }
  };
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const form = useForm({
    initialValues: {
      showtimeId: 0,
      theaterID: 0,
      numberOfTickets: 0,
      bookingDate: new Date().toISOString(),
      tenderAmount: 0,
      userId: 0,
    },
  });

  const handleBookingSubmit = async () => {
    try {
      const selectedShowtimeObject = movie?.showtimes.find((showtime) => showtime.startTime === selectedShowtime);

      if (selectedShowtimeObject && selectedTheaterId) {
        const updatedFormValues = {
          showtimeId: selectedShowtimeObject.id,
          theaterID: selectedTheaterId,
          bookingDate: value.toISOString(),
          numberofTickets: ticketCount,
          tenderAmount: ticketCount * 5,
          userId: user?.id
        };
        const response = await api.post<ApiResponse<BookingGetDto>>('/api/bookings', updatedFormValues);

        if (response.data.data) {
          showNotification({ message: "Successfully booked tickets", color: "green" });
          form.reset();
          navigate(routes.home);
        }
      } else {
        showNotification({ message: "Please select a showtime and a theater", color: "red" });
      }
    } catch (error) {
      showNotification({ message: "Error creating booking", color: "red" });
    }

  }

  useEffect(() => {
    async function fetchMovieAndTheaters() {
      try {
        const movieResponse = await api.get<ApiResponse<MovieGetDto>>(
          `/api/movies/${id}`
        );

        if (movieResponse.data.hasErrors) {
          showNotification({ message: "Error fetching movie data." });
        } else if (movieResponse.data.data) {
          setMovies(movieResponse.data.data);

          const movieData = movieResponse.data.data;
          const theaterIds = new Set(movieData.showtimes.map(showtime => showtime.theaterID));


          const theatersPromises = Array.from(theaterIds).map(theaterId =>
            api.get<ApiResponse<TheaterGetDto>>(`/api/Theaters/${theaterId}`)
          );

          const theatersResponses = await Promise.all(theatersPromises);
          const availableTheaters = theatersResponses.map(response => response.data.data);
          setTheaters(availableTheaters);

        }
      } catch (error) {
        showNotification({ message: "An error occurred while fetching data." });
      }
    }

    fetchMovieAndTheaters();
  }, [id]);

  const handleTheaterSelect = (theaterId: string) => {
    setSelectedTheaterId(Number(theaterId));
    const filteredShowtimes: Showtime[] = movie?.showtimes.filter(showtime => showtime.theaterID === Number(theaterId)) || [];
    setAvailableShowtimes(filteredShowtimes);
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
              <Text mt="lg" size="sm" fw={500} >
                Select Date:
              </Text>
              <DatePicker value={value} onChange={handleDateChange} minDate={today} />
              <Select
                label="Select Theater"
                placeholder="Choose a theater"
                data={theaters?.map(t => ({ value: t.id.toString(), label: t.theaterName })) || []}
                onChange={handleTheaterSelect}
              />
              {availableShowtimes.length > 0 && (
                <Container>
                  <p>Available showtimes:</p>
                  {availableShowtimes.map((showtime) => (
                    <Button
                      style={{ margin: '0.1rem' }}
                      variant={selectedShowtime === showtime.startTime ? "filled" : "outline"}
                      key={showtime.id}
                      onClick={() => setSelectedShowtime(showtime.startTime)}
                    >
                      {showtime.startTime}
                    </Button>
                  ))}
                </Container>
              )}

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
                  onClick={handleBookingSubmit}
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

