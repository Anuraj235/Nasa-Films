import { useEffect, useState } from 'react';
import { ApiResponse, TheaterGetDto } from '../../constants/types';
import api from '../../config/axios';
import { showNotification } from '@mantine/notifications';
import { Header, Space, Table, Loader, Modal, Text, Button, Flex,Pagination, Container } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { routes } from '../../routes';

const PAGE_SIZE = 5; 
export const TheaterListing = () => {
  const [theaters, setTheaters] = useState<TheaterGetDto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isModalOpen, setModalOpen] = useState<boolean>(false);
  const [selectedTheaterId, setSelectedTheaterId] = useState<number | null>(null);
  const [activePage, setActivePage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTheaters = async () => {
      try {
        const response = await api.get<ApiResponse<TheaterGetDto[]>>('/api/theaters');
        if (response.data.data) {
          setTheaters(response.data.data);
          setTotalPages(Math.ceil(response.data.data.length / PAGE_SIZE));
        }
      } catch (error) {
        showNotification({ message: 'Error Fetching Theaters.', color: 'red' });
      } finally {
        setLoading(false);
      }
    };

    fetchTheaters();
  }, [activePage]);

  

  const handleUpdate = (id) => {
    navigate(routes.theaterUpdate.replace(':id', id));
  }

  const handleDelete = (theaterId: number) => {
    setSelectedTheaterId(theaterId);
    setModalOpen(true);
  };

  const deleteTheater = async () => {
    if (selectedTheaterId) {
      try {
        await api.delete(`/api/theaters/${selectedTheaterId}`);
        showNotification({ message: 'Theater deleted successfully', color: 'green' });
        setTheaters(currentTheaters => currentTheaters.filter(theater => theater.id !== selectedTheaterId));
        setTotalPages(prev => prev - 1);
        setModalOpen(false);
      } catch (error) {
        showNotification({ message: 'Error deleting theater', color: 'red' });
      }
    }
  };
  const indexOfLastTheater = activePage * PAGE_SIZE;
  const indexOfFirstTheater = indexOfLastTheater - PAGE_SIZE;
  const currentTheaters = theaters.slice(indexOfFirstTheater, indexOfLastTheater);

  return (
    <Container>
      <Header height={60} p="xs" style={{
          backgroundColor: "#090708",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}>
        Theaters
      </Header>
      <Space h="md" />
      {loading ? (
        <Loader />
      ) : (
        <Table withBorder striped>
          <thead>
            <tr>
              <th style={{ color: "#afffff" }}>Theater ID</th>
              <th style={{ color: "#afffff" }}>Theater Name</th>
              <th style={{ color: "#afffff" }}>Address</th>
              <th style={{ color: "#afffff" }}>Email</th>
              <th style={{ color: "#afffff" }}>Phone</th>
              <th style={{ color: "#afffff" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentTheaters.map((theater, index) => (
              <tr key={theater.id}>
                <td>{theater.id}</td>
                <td>{theater.theaterName}</td>
                <td>{theater.address}</td>
                <td>{theater.email}</td>
                <td>{theater.phone}</td>
                <td>
                  <Button color="primary" onClick={() => handleUpdate(theater.id)}>Update</Button>
                </td>
                <td>
                  <Button color="red" onClick={() => handleDelete(theater.id)}>Delete</Button>
                </td>
              </tr>
            ))}
            <Pagination page={activePage} onChange={setActivePage} total={totalPages} />;
          </tbody>
          
        </Table>
      )}
      <Modal
        opened={isModalOpen}
        onClose={() => setModalOpen(false)}
        title="Confirm Deletion"

      >
        <Text>Are you sure you want to delete this theater?</Text>
        <Flex
          direction={{ base: 'column', sm: 'row' }}
          gap={{ base: 'sm', sm: 'lg' }}
          justify={{ sm: 'center' }}
        >
          <Button color="red" onClick={deleteTheater}>Delete</Button>
          <Button color="gray" onClick={() => setModalOpen(false)}>Cancel</Button>
        </Flex>
      </Modal>
    </Container>
  );
};

export default TheaterListing;
