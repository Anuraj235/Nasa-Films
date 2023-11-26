import React, { useEffect, useState } from 'react';
import { Button, Card, Container, createStyles, Group, Rating, Select, Textarea, TextInput, Title } from "@mantine/core";
import { useForm } from "@mantine/form";
import { ApiResponse, ReviewCreateDto, TheaterGetDto } from "../../constants/types";
import api from "../../config/axios";
import { showNotification } from "@mantine/notifications";
import { useNavigate } from "react-router-dom";
import { routes } from "../../routes";

// Assuming you have a function to get the authenticated user ID
import { useAuth } from "../../authentication/use-auth";
export const ReviewCreatePage = () => {
  const { classes } = useStyles();
  const navigate = useNavigate();
  const [ratingValue, setRatingValue] = useState(0);
  const [theaters, setTheaters] = useState<TheaterGetDto[]>();
  const [selectedTheaterId, setSelectedTheaterId] = useState<number | null>(null);
  const auth = useAuth();

  const form = useForm({
    initialValues: {
      theaterReview: '',
      rating: 0,
      theaterId: 0,
      userId: auth.user ? auth.user.id : 0,
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
      <Title order={2} align="center" style={{ color: "#fddc9a", marginTop: '5rem', marginBottom:'1rem' }}>Add Review </Title>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Container style={{ maxWidth: 420, margin: 'auto' }}>
        <Card shadow="sm" radius="md" style={{ maxWidth: 640 }}>

          <Textarea
            mt="md"
            label="Theater Review"
            placeholder="Theater Review"
            {...form.getInputProps('theaterReview')}
            className={classes.inputField}
          />
          <p style={{ color: "default", marginBottom: '1px', marginTop: '8px'}}>Rating:</p>
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
        
          <Group position="center" className={classes.submitButton} style={{marginTop:"1rem"}}>
            <Button variant="gradient" gradient={{ from: 'teal', to: 'blue', deg: 60 }} type="submit">Submit</Button>
            <Button
                type="button"
                onClick={() => navigate(routes.reviewListing)}
                variant="outline"
                color="red"
              >
                Cancel
              </Button>
          </Group>
          </Card>
        </Container>
      </form>
    </>
  );
};

const useStyles = createStyles(() => ({
  inputField: {
    'label': {
      color: "default",
    },
  },
  submitButton: {
    padding: "12px 0",
    fontSize: "18px",
    fontWeight: "bold",
    transition: "background 0.3s",
  },
}));
