import React from 'react';
import { Button, Container, createStyles, Group, Select, TextInput, Title } from "@mantine/core"

import { useForm } from '@mantine/form';
import { useNavigate } from 'react-router-dom';
import { showNotification } from '@mantine/notifications';
import { routes } from '../../routes';
import { ApiResponse, ShowtimesGetDto } from '../../constants/types';
import api from '../../config/axios';

const timeOptions = [
  { value: '09:00 AM', label: '9:00 AM' },
  { value: '12:00 PM', label: '12:00 PM' },
  { value: '3:00 PM', label: '3:00 PM' },
  { value: '6:00 PM', label: '6:00 PM' },
  { value: '9:00 PM', label: '9:00 PM' },
];

export const ShowtimesForm = () => {
  const { classes } = useStyles();
  const navigate = useNavigate();

  const form = useForm({
    initialValues: {
      movieId: '',
      startTime: '',
      theaterID: '',
      availableSeats: '',
    },
  });

  const handleSubmit = async () => {
    try {
      const response = await api.post<ApiResponse<ShowtimesGetDto>>("/api/showtimes", form.values);
      if (response.data.data) {
        console.log( "data",form.values);
        showNotification({ message: "Successfully Created Showtime", color: "green" });
        form.reset();
        navigate(routes.home);
      }
    } catch (error) {
      showNotification({ message: "Error to create Showtime", color: "red" })
    }
    

  }

  return (

    <>
      <Title order={2} align="center" style={{color:'white'}}>Add New ShowTime</Title>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Container style={{ maxWidth: 320, margin: 'auto' }}>

          <TextInput
            mt="md"
            label="Movie Id"
            placeholder="Theater Name"
            {...form.getInputProps('movieId')}
            className={classes.inputField}

          />
          <Select
      label="Select Time"
      placeholder="Pick one"
      data={timeOptions}
      {...form.getInputProps('startTime')}
      className={classes.inputField}
    />
          <TextInput
            mt="md"
            label="Theater ID"
            type="text"
            placeholder="Theater ID"
            {...form.getInputProps('theaterID')}
            className={classes.inputField}

          />
          <TextInput
            mt="md"
            label="Available Seats"
            type='number'
            placeholder="Available Seats"
            {...form.getInputProps('availableSeats')}
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
    mt:'4rem',
    'label': {
      color: "#FFFF",
    },
  },
  submitButton: {
    padding: "12px 0",
    fontSize: "18px",
    fontWeight: "bold",
    transition: "background 0.3s",
  },
}));