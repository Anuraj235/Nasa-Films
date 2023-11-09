import {
  TextInput,
  Button,
  Group,
  Box,
  Select,
  createStyles,
  Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import { useNavigate } from "react-router-dom";
import { routes } from "../../routes";
import api from "../../config/axios";
import {
  ApiResponse,
  MovieCreateDto,
  MovieGetDto,
} from "../../constants/types";

export const MoviesPage = () => {
  const navigate = useNavigate();
  const { classes } = useStyles();
  const genreOptions = [
    { value: "action", label: "Action" },
    { value: "comedy", label: "Comedy" },
    { value: "horror", label: "Horror" },
    { value: "romance", label: "Romance" },
    { value: "animation", label: "Animation" },
    { value: "documentry", label: "Documentry" },
  ];

  const movieForm = useForm<MovieCreateDto>({
    initialValues: {
      title: "",
      releaseDate: new Date(),
      description: "",
      imageUrl: "",
      genre: "",
      duration: 0,
    },
  });

  const handleSubmit = async () => {
    try {
      const response = await api.post<ApiResponse<MovieGetDto>>(
        "/api/movies",
        movieForm.values
      );

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
    <>
      <Title order={2} align="center" style={{ color: "white" }}>
        Add New Movie
      </Title>
      <Box sx={{ maxWidth: 300 }} mx="auto">
        <form onSubmit={movieForm.onSubmit(handleSubmit)}>
          <TextInput
            withAsterisk
            label="Title"
            placeholder="Movie Title"
            {...movieForm.getInputProps("title")}
            className={classes.inputField}
          />

          <TextInput
            withAsterisk
            label="Release Date"
            type="date"
            {...movieForm.getInputProps("releaseDate")}
            className={classes.inputField}
          />

          <TextInput
            withAsterisk
            label="Description"
            placeholder="Movie Description"
            {...movieForm.getInputProps("description")}
            className={classes.inputField}
          />

          <TextInput
            withAsterisk
            label="Image Url"
            placeholder="Enter Image URL"
            {...movieForm.getInputProps("imageUrl")}
            className={classes.inputField}
          />
          <Select
            value={movieForm.values.genre}
            onChange={(value) => movieForm.setFieldValue("genre", value)}
            data={genreOptions}
            placeholder="Select Genre"
            id="genre"
            label="Genre"
            className={classes.inputField}
          />

          <TextInput
            withAsterisk
            label="Duration(In Minutes)"
            placeholder="Movie Duration (minutes)"
            type="number"
            {...movieForm.getInputProps("duration")}
            className={classes.inputField}
          />

          <Group position="center" className={classes.submitButton}>
            <Button
              variant="gradient"
              gradient={{ from: "teal", to: "blue", deg: 60 }}
              type="submit"
            >
              Create Movie
            </Button>
          </Group>
        </form>
      </Box>
    </>
  );
};
const useStyles = createStyles(() => ({
  inputField: {
    mt: "4rem",
    label: {
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
