import React, { useEffect, useState } from 'react';
import { Button, Container, createStyles, Group, Rating, Select, TextInput, Title } from "@mantine/core";
import { useForm } from "@mantine/form";
import { ApiResponse, ReviewCreateDto, TheaterGetDto } from "../../constants/types";
import api from "../../config/axios";
import { showNotification } from "@mantine/notifications";
import { useNavigate } from "react-router-dom";
import { routes } from "../../routes";

export const ReviewCreatePage = () => {
  const { classes } = useStyles();
  const navigate = useNavigate();
  const [ratingValue, setRatingValue] = useState(0);
  const [theaters, setTheaters] = useState<TheaterGetDto[]>();
  const [selectedTheaterId, setSelectedTheaterId] = useState<number | null>(null);

  const form = useForm({
    initialValues: {
      theaterReview: '',
      rating: 0,
      theaterId: 0,
      userId: 0,
    },
  });

  const handleSubmit = async () => {
    try {
      const response = await api.post<ApiResponse<ReviewCreateDto>>("/api/reviews", form.values);
      if (response.data.data) {
        showNotification({ message: "Review Created Successfully", color: "green" });
        form.reset();
        navigate(routes.reviewListing);
      }
    } catch (error) {
      showNotification({ message: "Error creating Review", color: "red" });
    }
  }

  useEffect(() => {
    async function fetchTheaters() {
      try {
        const theatersResponse = await api.get<ApiResponse<TheaterGetDto[]>>("/api/theaters");
        if (theatersResponse.data.data) {
          setTheaters(theatersResponse.data.data);
        }
      } catch (error) {
        showNotification({ message: "Error fetching theaters", color: "red" });
      }
    }

    fetchTheaters();
  }, []);

  const handleTheaterSelect = (theaterId: string) => {
    setSelectedTheaterId(Number(theaterId));
    form.setFieldValue('theaterId', Number(theaterId));
  };


  return (
    <>
      <Title order={2} align="center" style={{ color: "#9C7A4B", marginTop: '5rem' }}>Add Review </Title>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Container style={{ maxWidth: 420, margin: 'auto' }}>
          <TextInput
            mt="md"
            label="Theater Review"
            placeholder="Theater Review"
            {...form.getInputProps('theaterReview')}
            className={classes.inputField}
          />
          <p style={{ color: "#9C7A4B", marginBottom: '1px', marginTop: '8px'}}>Rating:</p>
          <Rating
            value={ratingValue}
            size='lg'
            onChange={(newValue) => {
              setRatingValue(newValue);
              form.setFieldValue('rating',newValue);
            }}
            style={{marginBottom: '8px'}}
          />
           <Select
            label="Select Theater"
            placeholder="Choose a theater"
            data={theaters?.map(t => ({ value: t.id.toString(), label: t.theaterName })) || []}
            onChange={handleTheaterSelect}
          />
        
          <TextInput
            mt="md"
            label="User ID"
            placeholder="User ID"
            type="number"
            {...form.getInputProps('userId')}
            className={classes.inputField}
          />
          <Group position="center" className={classes.submitButton}>
            <Button variant="gradient" gradient={{ from: 'teal', to: 'blue', deg: 60 }} type="submit">Submit</Button>
          </Group>
        </Container>
      </form>
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
