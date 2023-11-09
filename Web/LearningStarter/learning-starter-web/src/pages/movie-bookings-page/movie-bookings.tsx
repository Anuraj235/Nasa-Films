import React, { useEffect, useState } from "react";
import { ApiResponse, MovieGetDto} from "../../constants/types";
import api from "../../config/axios";
import { showNotification } from "@mantine/notifications";
import { Rating, NumberInput, Image, Button } from '@mantine/core';
import { useNavigate, useParams } from "react-router-dom";
import { routes } from "../../routes";

export const MovieBookingPage = () => {
    const [movie, setMovies] = useState<MovieGetDto>();
    const { id } = useParams(); 
    const navigate = useNavigate();

    const [ticketCount, setTicketCount] = useState(0);
    const handleTicketChange = (value) => {
    setTicketCount(value);
    };

    useEffect(() => {
        fetchMovie();

        async function fetchMovie() {
                const response = await api.get<ApiResponse<MovieGetDto>>(`/api/movies/${id}`);

                if (response.data.hasErrors) {
                    showNotification({ message: "Error fetching products." });
                }

                if (response.data.data) {
                    setMovies(response.data.data);
                }
        }
    }, [id]);

      

    return (
        <>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap' }}>

            {movie && (
                <div style={{ margin: '20px', padding: '20px', textAlign: 'center'}}>
                    <h2 style={{ margin: '1px 0' }}>{movie.title}</h2>
                    <div style={{ margin: '3px 0', textAlign: 'center' }}>
                        <Rating value={movie.rating} style={{ margin: '0 auto' }} />
                        <p style={{ margin: '10px 0', textAlign: 'center' }}><strong>Description:</strong> {movie.description}</p>
                    </div>
                    <div style={{ margin: '20px'}}><Image src={movie.imageUrl} radius="md" h={150} w={200} fit="contain" alt="small Image" /></div>
                </div>
                
            )}
            <div>
            <NumberInput
                style={{ marginTop: '100px' }}
                variant="filled"
                radius="xs"
                label="Tickets:"
                withAsterisk
                description="Enter the number of tickets you want to purchase"
                placeholder="Input placeholder"
                value={ticketCount}
                onChange={handleTicketChange}
            />
                
            <p style={{ margin: '12px 0', textAlign:"center"}}>Estimated Amount: $ {ticketCount * 5}</p>
            <div style={{textAlign: "center"}}>
                <Button variant="light" radius="md" 
                    onClick={() =>{
                        navigate(
                            routes.showtimelisting
                        );
                    }}>Book now</Button></div>
            </div>
        </div>
        
        </>
    );
};