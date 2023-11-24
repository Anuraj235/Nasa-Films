import React, { useEffect, useState } from 'react';
import { ApiResponse, ReviewGetDto } from '../../constants/types';
import api from '../../config/axios';
import { showNotification } from '@mantine/notifications';
import { Header, Space, Table, Loader, Modal, Text, Button, Flex, Pagination, Rating, Container, Card, Title, Group } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { routes } from '../../routes';

const PAGE_SIZE = 5;

const ReviewListing = () => {
  const [reviews, setReviews] = useState<ReviewGetDto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isModalOpen, setModalOpen] = useState<boolean>(false);
  const [selectedReviewId, setSelectedReviewId] = useState<number | null>(null);
  const [activePage, setActivePage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await api.get<ApiResponse<ReviewGetDto[]>>('/api/reviews');
        if (response.data.data) {
          setReviews(response.data.data);
          setTotalPages(Math.ceil(response.data.data.length / PAGE_SIZE));
        }
      } catch (error) {
        showNotification({ message: 'Error Fetching Reviews.', color: 'red' });
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [activePage]);

  const handleUpdate = (id) => {
    navigate(routes.reviewUpdate.replace(':id', id));
  }

  const handleCreate = () => {
    navigate(routes.reviewCreate);
  }

  const handleDelete = (reviewId: number) => {
    setSelectedReviewId(reviewId);
    setModalOpen(true);
  };

  const deleteReview = async () => {
    if (selectedReviewId) {
      try {
        await api.delete(`/api/reviews/${selectedReviewId}`);
        showNotification({ message: 'Review deleted successfully', color: 'green' });
        setReviews(currentReviews => currentReviews.filter(review => review.id !== selectedReviewId));
        setTotalPages(prev => prev - 1);
        setModalOpen(false);
      } catch (error) {
        showNotification({ message: 'Error deleting review', color: 'red' });
      }
    }
  };

  const indexOfLastReview = activePage * PAGE_SIZE;
  const indexOfFirstReview = indexOfLastReview - PAGE_SIZE;
  const currentReviews = reviews.slice(indexOfFirstReview, indexOfLastReview);

  return (
    <Container size="xs">
      <Container style={{ marginTop: '2rem', marginBottom: '2rem' }}>
        <Button onClick={handleCreate} variant="outline">
          Create Review
        </Button>
      </Container>

      {loading ? (
        <Loader />
      ) : (
        <>
          {currentReviews.map((review, index) => (
            <Card key={review.id} shadow="sm" style={{ marginBottom: '1rem' }}>
              <Title order={3}>{review.user.firstName} {review.user.lastName}</Title>
              <text>
                {review.theater.theaterName} - {review.theaterReview}
              </text>
              <Group position="right">
                <Rating value={review.rating} />
                <Button onClick={() => handleUpdate(review.id)}>
                  Update
                </Button>
                <Button color="red" onClick={() => handleDelete(review.id)}>
                  Delete
                </Button>
              </Group>
            </Card>
          ))}
        </>
      )}

      <Pagination page={activePage} onChange={setActivePage} total={totalPages} />

      <Modal
        opened={isModalOpen}
        onClose={() => setModalOpen(false)}
        title="Confirm Deletion"
      >
        <Text>Are you sure you want to delete this review?</Text>
        <Flex
          direction={{ base: 'column', sm: 'row' }}
          gap={{ base: 'sm', sm: 'lg' }}
          justify={{ sm: 'center' }}
        >
          <Button color="red" onClick={deleteReview}>
            Delete
          </Button>
          <Button color="gray" onClick={() => setModalOpen(false)}>
            Cancel
          </Button>
        </Flex>
      </Modal>
    </Container>
  );
};

export default ReviewListing;