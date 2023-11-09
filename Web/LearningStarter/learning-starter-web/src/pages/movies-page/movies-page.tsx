import {
  Container,
  TextInput,
  Button,
  Group,
  Box,
  Select,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { MovieCreateDto, MovieGetDto } from "./types";
import { showNotification } from "@mantine/notifications";
import { useNavigate } from "react-router-dom";
import { routes } from "../../routes";
import api from "../../config/axios";
import { ApiResponse } from "../../constants/types";

export const MoviesPage = () => {
  const navigate = useNavigate();
  const genreOptions = [
    { value: "action", label: "Action" },
    { value: "comedy", label: "Comedy" },
    { value: "horror", label: "Horror" },
    { value: "romance", label: "Romance" },
    { value: "animation", label: "Animation" },
  ];
  const movieForm = useForm<MovieCreateDto>({
    initialValues: {
      title: "",
      releaseDate: new Date(),
      description: "",
      genre: "",
      duration: 0,
    },
  });

  const handleSubmit = async () => {
    try {
      const response = await api.post<ApiResponse<MovieGetDto>>("/api/movies", movieForm.values);

      if (response.status === 201) {
        showNotification({
          message: "Movie created successfully!",
          color: "green",
        });
        movieForm.reset();
        navigate(routes.home);
      } else {
        showNotification({
          message: "Movie creation failed. Please try again.",
          color: "red",
        });
      }
    } catch (error) {
      showNotification({
        message: "An error occurred. Please try again later.",
        color: "red",
      });
    }
  };

  return (
    <Container>
      <Box sx={{ maxWidth: 300 }} mx="auto">
        <form onSubmit={movieForm.onSubmit(handleSubmit)}>
          <TextInput
            withAsterisk
            label="Title"
            placeholder="Movie Title"
            {...movieForm.getInputProps("title")}
          />

          <TextInput
            withAsterisk
            label="Release Date"
            type="date"
            {...movieForm.getInputProps("releaseDate")}
          />

          <TextInput
            withAsterisk
            label="Description"
            placeholder="Movie Description"
            {...movieForm.getInputProps("description")}
          />

          <Select
            value={movieForm.values.genre}
            onChange={(value) => movieForm.setFieldValue("genre", value)}
            data={genreOptions}
            placeholder="Select Genre"
            id="genre"
            label="Genre"
          />

          <TextInput
            withAsterisk
            label="Duration(In Minutes)"
            placeholder="Movie Duration (minutes)"
            type="number"
            {...movieForm.getInputProps("duration")}
          />

          <Group position="right" mt="md">
            <Button type="submit">Create Movie</Button>
          </Group>
        </form>
      </Box>
    </Container>
  );
};