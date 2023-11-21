import { useEffect, useState } from "react";
import { ApiResponse, ReviewCreateDto, ReviewGetDto, TheaterGetDto } from '../../constants/types';
import { useNavigate, useParams } from "react-router-dom";
import { FormErrors, useForm } from "@mantine/form";
import api from "../../config/axios";
import { showNotification } from "@mantine/notifications";
import ReviewListing from './review-listing';
import { routes } from "../../routes";
import { Button, Container, Flex, Rating, Select, Space, TextInput, Title, createStyles } from "@mantine/core";

export const ReviewUpdate = () => {
    const [review, setReview] = useState<ReviewGetDto | null>(null);
    const navigate = useNavigate();
    const { classes } = useStyles();
    const { id } = useParams<{ id: string}>();
    const [ratingValue, setRatingValue] = useState(0);
    const [theaters, setTheaters] = useState<TheaterGetDto[]>();
    const [selectedTheaterId, setSelectedTheaterId] = useState<number | null>(null);




    const form = useForm({
        initialValues:{
            theaterReview: '',
            rating: 0,
            theaterId: 0, 
            userId: 0
        },
    });

    useEffect(() => {
      fetchReview();
       async function fetchReview () {
            try {
                const response = await api.get<ApiResponse<ReviewGetDto>>(`/api/reviews/${id}`);
                if (response.data.hasErrors){
                    showNotification({message: "Error finding review", color: "red"});
                    } else {
                        setReview(response.data.data);
                        console.log(response.data.data)
                        form.setValues({...response.data.data, rating: response.data.data.rating || 0});
                        form.resetDirty();

                }
                } catch (error) {
                    showNotification({ message: "Error fetching review data", color: "red"});
        }
    }
},[id]);

const handleSubmit = async () => {
    try{
        const response = await api.put<ApiResponse<ReviewGetDto>>(`/api/reviews/${id}`, form.values);
        if (response.data.hasErrors){
            const formErrors: FormErrors = response.data.errors.reduce((prev,curr) => ({
                ...prev,
                [curr.property]: curr.message
            }), {});
            form.setErrors(formErrors);
        } else {
            showNotification({message: "Successfully updated review!", color: "green"});
            navigate(routes.reviewListing);
        }
    } catch (error){
        showNotification({ message: "Error updating review", color: "red"})
    }
};
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
              <Button type="submit" gradient={{ from: 'teal', to: 'blue', deg: 60 }}>Update Review</Button>
              <Button
                type="button"
                onClick={() => navigate(routes.reviewListing)}
                variant="outline"
              >
                Cancel
              </Button>
            
          </Container>
        </form>
    </>
  );
}
const useStyles = createStyles(() => ({
    inputField: {
      margin:"1rem",
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