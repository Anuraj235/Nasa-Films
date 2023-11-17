import { useEffect, useState } from "react";
import { ApiResponse, ShowtimesGetDto } from '../../constants/types';
import { showNotification } from "@mantine/notifications";
import { Header, Space, Table, Loader, Modal, Text, Button, Flex,Pagination } from '@mantine/core';
import { useNavigate } from "react-router-dom";
import { routes } from "../../routes";
import api from "../../config/axios";

const PAGE_SIZE = 5; 
export const ShowtimeListing = () => {
    const [showtimes , setShowtimes]= useState<ShowtimesGetDto[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [isModalOpen, setModalOpen] = useState<boolean>(false);
    const [selectedShowtimeId, setSelectedShowtimeId] = useState<number | null>(null);
    const [activePage, setActivePage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const navigate = useNavigate();   

    useEffect( () =>{
        const fetchShowtimes = async () => {
          try {
            const response = await api.get<ApiResponse<ShowtimesGetDto[]>>('/api/showtimes');
            if (response.data.data) {
              setShowtimes(response.data.data);
              setTotalPages(Math.ceil(response.data.data.length / PAGE_SIZE));
            }
          } catch (error) {
            showNotification({ message: 'Error Fetching Showtimes.', color: 'red' });
          } finally {
            setLoading(false);
          }
             };
             fetchShowtimes();

      },[activePage]);       
      
      const handleUpdate = (id) => {
        navigate(routes.showtimeUpdate.replace(':id', id));
      }
    
      const handleDelete = (showtimeId: number) => {
        setSelectedShowtimeId(showtimeId);
        setModalOpen(true);
      };
    
      const deleteShowtime = async () => {
        if (selectedShowtimeId) {
          try {
            await api.delete(`/api/theaters/${selectedShowtimeId}`);
            showNotification({ message: 'Theater deleted successfully', color: 'green' });
            setShowtimes(currentShowtimes => currentShowtimes.filter(showtime => showtime.id !== selectedShowtimeId));
            setTotalPages(prev => prev - 1);
            setModalOpen(false);
          } catch (error) {
            showNotification({ message: 'Error deleting Showtime', color: 'red' });
          }
        }
      };
      const indexOfLastShowtime = activePage * PAGE_SIZE;
      const indexOfFirstShowtime = indexOfLastShowtime - PAGE_SIZE;
      const currentShowtimes = showtimes.slice(indexOfFirstShowtime, indexOfLastShowtime);
              
    
    return  (
        <>
          <Header height={60} p="xs">
            Showtimes
            </Header>
          <Space h="md"/>
          {loading ? (
            <Loader/>
          ) : (
            <Table withBorder striped>
            <thead>
                <tr>
                  <th>Showtime ID</th>
                  <th>Theater ID</th>
                  <th>Start Time</th>
                  <th>Actions</th>           
               </tr>
            </thead>
            <tbody>
               
              {currentShowtimes.map((showtime) => (
                <tr key={showtime.id}>
                <td>{showtime.id}</td>
                <td>{showtime.theaterID}</td>
                <td>{showtime.startTime}</td>
                <td>
                  <Button color="primary" onClick={() => handleUpdate(showtime.id)}>Update</Button>
                </td>
                <td>
                  <Button color="red" onClick={() => handleDelete(showtime.id)}>Delete</Button>
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
        <Text>Are you sure you want to delete this showtime?</Text>
        <Flex
          direction={{ base: 'column', sm: 'row' }}
          gap={{ base: 'sm', sm: 'lg' }}
          justify={{ sm: 'center' }}
        >
          <Button color="red" onClick={deleteShowtime}>Delete</Button>
          <Button color="gray" onClick={() => setModalOpen(false)}>Cancel</Button>
        </Flex>
      </Modal>
    </>
  );
};

export default ShowtimeListing;