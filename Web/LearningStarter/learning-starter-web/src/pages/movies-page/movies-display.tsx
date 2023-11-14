import { useEffect, useState } from 'react';
import { Card, Container, Text, Image, Rating,Grid,Button } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { ApiResponse, MovieGetDto } from '../../constants/types';

import api from '../../config/axios';
import { useNavigate } from 'react-router-dom';
import { routes } from '../../routes';

export const Movies = () => {
  const [movies, setMovies] = useState<MovieGetDto[]>();

  const navigate= useNavigate();

  const handleGetTicket=(id)=>{
    navigate(routes.movieBookingPage.replace(':id', id));
  }

  useEffect(() => {
    fetchMovies();
    async function fetchMovies() {
      const response = await api.get<ApiResponse<MovieGetDto[]>>('/api/movies');
      if (response.data.hasErrors) {
        showNotification({ message: 'Error Fetching Showtimes' });
      }

      if (response.data.data) {
        setMovies(response.data.data);
      }
    }
  }, []);

  return (
        <Container>
          <Grid gutter="lg" >
            {movies && movies.map((movie) => (
              <Grid.Col span={4} key={movie.id}>
                <Card shadow="sm" p="lg" radius="md" withBorder>
                  <Card.Section>
                    <Image src={movie.imageUrl} height={450} alt={movie.title} />
                  </Card.Section>
    
                  <Text size="lg" weight={500} mt="md">
                    {movie.title}
                  </Text>
    
                  <Text mt="xs" color="dimmed">
                    Genre: {movie.genre}
                  </Text>
    
                  <Text color="dimmed" size="sm">
                    Duration: {movie.duration} mins
                  </Text>
    
                  <Rating value={movie.rating} fractions={2} readOnly />
                  <Button 
                  mt='1rem'
                  variant="gradient" 
                  gradient={{ from: '#ed6ea0', to: '#ec8c69', deg: 35 }} 
                  onClick={()=>handleGetTicket(movie.id)}
                  >
                    Get Tickets
                </Button>
                </Card>

              </Grid.Col>
            ))}
          </Grid>
          <Container mt="4rem" style={{ paddingTop: "2rem" }}>
          <Grid>
          <Grid.Col span={12}>
            <Text align="center" size="sm" color="dimmed">
              © 2023 NASSA. All rights reserved.
            </Text>
          </Grid.Col>
        </Grid></Container>
        </Container>
        
      );
    };