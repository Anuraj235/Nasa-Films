import { useEffect, useState } from "react";
import { ApiResponse, ReviewCreateDto, ReviewGetDto } from '../../constants/types';
import { useNavigate, useParams } from "react-router-dom";
import { FormErrors, useForm } from "@mantine/form";
import api from "../../config/axios";
import { showNotification } from "@mantine/notifications";
import ReviewListing from './review-listing';
import { routes } from "../../routes";
import { Button, Container, Flex, Rating, Space, TextInput, Title, createStyles } from "@mantine/core";

export const ReviewUpdate = () => {
    const [review, setReview] = useState<ReviewGetDto | null>(null);
    const navigate = useNavigate();
    const { classes } = useStyles();
    const { id } = useParams<{ id: string}>();
    const [ratingValue, setRatingValue] = useState(0);


    const mantineForm = useForm<ReviewCreateDto>({
        initialValues:{
            theaterReview: '',
            rating: 0,
            theaterId: 0, 
            userId: 0
        },
    });

    useEffect(() => {
        const fetchReview = async () => {
            try {
                const response = await api.get<ApiResponse<ReviewGetDto>>(`/api/reviews/${id}`);
                if (response.data.hasErrors){
                    showNotification({message: "Error finding review", color: "red"});
                    } else {
                        setReview(response.data.data);
                        console.log(response.data.data)
                        mantineForm.setValues({...response.data.data, rating: response.data.data.rating || 0});
                }
                } catch (error) {
                    showNotification({ message: "Error fetching review data", color: "red"});
        }
    };
    fetchReview();
},[id]);

const submitReview = async (values: ReviewCreateDto) => {
    try{
        const updatedValues = { ...values, rating: ratingValue };
        const response = await api.put<ApiResponse<ReviewGetDto>>(`/api/reviews/${id}`, values);
        if (response.data.hasErrors){
            const formErrors: FormErrors = response.data.errors.reduce((prev,curr) => ({
                ...prev,
                [curr.property]: curr.message
            }), {});
            mantineForm.setErrors(formErrors);
        } else {
            showNotification({message: "Successfully updated review!", color: "green"});
            navigate(routes.reviewListing);
        }
    } catch (error){
        showNotification({ message: "Error updating review", color: "red"})
    }
};
return (
    <>
     <Title order={2} align="center" style={{color:"#9C7A4B",marginTop:'5rem'}}>Update Review </Title>
      {review && (
        <form onSubmit={mantineForm.onSubmit(submitReview)}>
          <Container style={{ maxWidth: 420, margin: 'auto',marginTop:'1rem'}}>
            <TextInput
              {...mantineForm.getInputProps('theaterReview')}
              label="Write your review here"
              className={classes.inputField}
              withAsterisk
            />
            <TextInput
              {...mantineForm.getInputProps('theaterId')}
              label="Theater Id"
              className={classes.inputField}
              withAsterisk
            />
            <TextInput
              {...mantineForm.getInputProps('userId')}
              label="User Id"
              className={classes.inputField}
              withAsterisk
            />
            <Rating
                value={ratingValue}
                onChange={(newValue) => setRatingValue(newValue)}
                style={{ marginTop: '1rem' }}
                />

            <Space h="md" />
            <Flex
              direction={{ base: 'column', sm: 'row' }}
              gap={{ base: 'sm', sm: 'lg' }}
              justify={{ sm: 'center' }}
            >
              <Button type="submit" gradient={{ from: 'teal', to: 'blue', deg: 60 }}>Update Theater</Button>
              <Button
                type="button"
                onClick={() => navigate(routes.theaterListing)}
                variant="outline"
              >
                Cancel
              </Button>
            </Flex>
          </Container>
        </form>
      )}
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