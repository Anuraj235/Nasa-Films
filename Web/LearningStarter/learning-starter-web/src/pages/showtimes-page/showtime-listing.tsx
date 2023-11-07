import { Container, TextInput, Button, Group } from "@mantine/core";
import api from "../../config/axios";
import { useEffect, useState } from "react";
import { ShowtimeCreateDto } from "../../constants/types";

const ShowtimesForm: React.FC = () => {
  const [formData, setFormData] = useState({
    movieID: '',
    startTime: '',
    theaterID: '',
    availableSeats: '',
  });

  const handleInputChange = (name: string, value: string) => {
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault(); 
    try {
      console.log(formData);
      const response = await api.post('/api/showtimes', formData);
      if (response.status === 201) {
        console.log('Showtime created successfully!');
      } else {
        console.error('Failed to create showtime');
      }
    } catch (error) {
      console.error('An error occurred while creating showtime', error);
    }
  };

  return (
    <Container>
      <h2>Add Showtime</h2>
      <form onSubmit={handleSubmit}>
        <TextInput
          label="Movie ID"
          value={formData.movieID}
          onChange={(event) => handleInputChange('movieID', event.currentTarget.value)}
        />

        <TextInput
          label="Start Time"
          type="datetime-local"
          value={formData.startTime}
          onChange={(event) => handleInputChange('startTime', event.currentTarget.value)}
        />

        <TextInput
          label="Theater ID"
          value={formData.theaterID}
          onChange={(event) => handleInputChange('theaterID', event.currentTarget.value)}
        />

        <TextInput
          label="Available Seats"
          type="number"
          value={formData.availableSeats}
          onChange={(event) => handleInputChange('availableSeats', event.currentTarget.value)}
        />

        <Group position="right" mt="md">
          <Button type="submit">
            Add Showtime
          </Button>
        </Group>
      </form>
    </Container>
  );
};

export default ShowtimesForm;
