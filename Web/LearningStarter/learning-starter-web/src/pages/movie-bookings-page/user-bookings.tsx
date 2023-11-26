import { useEffect, useState } from "react";
import {
  Grid,
  Card,
  Image,
  Text,
  Button,
  Table,
  Modal,
  Loader,
  Header,
  Space,
} from "@mantine/core";
import { ApiResponse, BookingGetDto } from "../../constants/types";
import api from "../../config/axios";
import { useAuth } from "../../authentication/use-auth";
import { showNotification } from "@mantine/notifications";
import { useNavigate } from "react-router-dom";
import { routes } from "../../routes";

export const UserBooking = () => {
  const [bookings, setBookings] = useState<BookingGetDto[]>();
  const [loading, setLoading] = useState<boolean>(true);
  const [checkoutLoading, setCheckoutLoading] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await api.get<ApiResponse<BookingGetDto[]>>(
          `/api/bookings/${user?.id}`
        );
        if (response.data.data) {
          setBookings(response.data.data);
        }
      } catch (error) {
        showNotification({ message: "Error Fetching Bookings.", color: "red" });
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [user?.id]);

  const totalTenderAmount =
    bookings?.reduce((acc, booking) => acc + booking.tenderAmount, 0) || 0;
  const totalNumberOfTickets =
    bookings?.reduce((acc, booking) => acc + booking.numberOfTickets, 0) || 0;

  const handleCheckout = () => {
    setCheckoutLoading(true);
    setTimeout(() => {
      setCheckoutLoading(false);
      setShowModal(true);
    }, 2000);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    navigate(routes.home);
  };
  return (
    <>
      <Header height={60} p="xs" style={{
          backgroundColor: "#090708",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}>
        <Text weight={700}>My Bookings:</Text>
      </Header>
      <Space h="md" />
      {loading ? (
        <Loader />
      ) : (
        <Grid gutter={20}>
          <Grid.Col span={8}>
            <Table>
              <thead>
                <tr>
                  <th style={{ color: "#afffff" }}>Movie</th>
                  <th style={{ color: "#afffff" }}>Start Time</th>
                  <th style={{ color: "#afffff" }}>Theater</th>
                  <th style={{ color: "#afffff" }}>Number of Tickets</th>
                  <th style={{ color: "#afffff" }}>Tender Amount</th>
                </tr>
              </thead>
              <tbody>
                {bookings &&
                  bookings.map((booking) => (
                    <tr key={booking.id}>
                      <td align="center">
                        <Image
                          src={booking.imageUrl}
                          alt={booking.movieName}
                          height={100}
                          radius="md"
                          fit="contain"
                        />
                         <Text size="sm" color="white" style={{fontWeight:"bold", marginTop:"5px"}}>
                          {booking.movieName}
                        </Text>
                      </td>
                      <td style={{color:"white", fontSize:"16px", alignSelf:"center"}}>{booking.startTime}</td>
                      <td style={{color:"white", fontSize:"16px", alignSelf:"center"}}>{booking.theaterName}</td>
                      <td style={{color:"white", fontSize:"16px", alignSelf:"center"}}>{booking.numberOfTickets}</td>
                      <td style={{color:"white", fontSize:"16px", alignSelf:"center"}}>${booking.tenderAmount}</td>
                    </tr>
                  ))}
              </tbody>
            </Table>
          </Grid.Col>

          <Grid.Col
            span={3}
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <Text weight={700} fz="xl">
              Payment:
            </Text>
            {bookings && bookings.length > 0 && (
              <Card shadow="sm" radius="md" pt={50} pl={30} withBorder>
                <Card.Section>
                  <Text weight={400}>
                    Total Tickets: {totalNumberOfTickets}
                  </Text>
                  <Text weight={400}>Total Amount: ${totalTenderAmount}</Text>
                </Card.Section>

                <Button
                  variant="light"
                  color="blue"
                  fullWidth
                  mt="md"
                  radius="md"
                  onClick={handleCheckout}
                  disabled={checkoutLoading}
                >
                  {checkoutLoading ? <Loader size="xs" /> : "Checkout"}
                </Button>
              </Card>
            )}
          </Grid.Col>
        </Grid>
      )}
      <Modal
        opened={showModal}
        onClose={handleCloseModal}
        title="Payment Information"
        size="auto"
      >
        Currently, we do not accept online payments. Your film reservation is
        confirmed. Kindly make the payment in person.
        <Text weight={500} color="red">Your Pending Amount is: ${totalTenderAmount} </Text>
      </Modal>
    </>
  );
};
