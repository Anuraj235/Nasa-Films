import React, { useEffect, useState } from "react";
import { ApiResponse, ShowtimeGetDto } from "../../constants/types";
import api from "../../config/axios";
import { showNotification } from "@mantine/notifications";
import { Container, Header, Loader, Space, createStyles } from "@mantine/core";
import "./ShowtimeListing.css";
import { faPencil } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { routes } from "../../routes";

export const ShowtimeListing = () => {
  const [showtimes, setShowtimes] = useState<ShowtimeGetDto[]>();
  const navigate = useNavigate();
  const{classes}  = useStyles();

  useEffect(() => {
    async function fetchShowtimes() {
      try {
        const response = await api.get<ApiResponse<ShowtimeGetDto[]>>("/api/showtimes");

        if (response.data.hasErrors) {
          showNotification({ message: "Error fetching showtimes." });
        } else if (response.data.data) {
          setShowtimes(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching showtimes:", error);
      }
    }

    fetchShowtimes();
  }, []);

  return (
    <Container>
      <Header height="32px">Showtimes</Header>
      <Space h="md" />
      {showtimes ? (
        <table>
          <thead>
            <tr>
              <th></th>
              <th>Price</th>
              <th>Available Seats</th>
              <th>Screen</th>
            </tr>
          </thead>
          <tbody>
            {showtimes.map((showtime) => (
              <tr key={showtime.id}>
                <td>
                  <FontAwesomeIcon
                    className={classes.iconButton}
                    icon={faPencil}
                    onClick={() => navigate(
                        routes.showtimeUpdate.replace(":id", `${showtime.id}`)
                    )}
                  />
                </td>
                <td>{showtime.id}</td>
                <td>{showtime.price}</td>
                <td>{showtime.availableseats}</td>
                <td>{showtime.screen}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <Loader />
      )}
    </Container>
  );
};

const useStyles = createStyles(() => {
  return {
    iconButton: {
      cursor: "pointer",
    },
  };
});

export default ShowtimeListing;
