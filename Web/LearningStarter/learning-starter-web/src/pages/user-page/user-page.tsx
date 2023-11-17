import {
  Button,
  Container,
  createStyles,
  Flex,
  Header,
  Loader,
  Space,
  Table,
  Title,
} from "@mantine/core";
import { useEffect, useState } from "react";
import { ApiResponse, UserGetDto } from "../../constants/types";
import api from "../../config/axios";
import { showNotification } from "@mantine/notifications";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencil, faPlus } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { routes } from "../../routes";


export const UserPage = () => {
  const navigate = useNavigate();

  const { classes } = useStyles();

  useEffect(() => {
    fetchUser();

    async function fetchUser() {
      const response = await api.get<ApiResponse<UserGetDto[]>>("/api/users");

      console.log("API Response:", response.data);

      if (response.data.hasErrors) {
        showNotification({ message: "Error fetching User." });
      }

      if (response.data.data) {
        setUser(response.data.data);
        console.log("User data:", response.data.data);
      }
    }
  }, []);

  return (
    <Container>
      <Flex direction="row" justify="space-between">
        <Title order={3}> User </Title>
        <Button
          onClick={() => {
            navigate(routes.userCreate);
          }}
        >
          <FontAwesomeIcon icon={faPlus} /> <Space w={8} />
          New User
        </Button>
      </Flex>
      <Space h="md" />
      {user ? (
        <Table withBorder striped>
          <thead>
            <tr>
              <th></th>
              <th> First Name </th>
              <th> Last Name </th>
              <th> User Name </th>
              <th> Email </th>
              <th> Phone Number </th>
              <th> Date of Birth </th>
            </tr>
          </thead>
          <tbody>
            {user?.map((user) => {
              return (
                <tr key={user.id}>
                  <td>
                    <FontAwesomeIcon
                      className={classes.iconButton}
                      icon={faPencil}
                      onClick={() => {
                        navigate(
                          routes.userUpdate.replace(":id", "${useUser.id}")
                        );
                      }}
                    />
                  </td>
                  <td> {user.firstName} </td>
                  <td> {user.lastName} </td>
                  <td> {user.userName} </td>
                  <td> {user.phoneNumber} </td>
                  <td> {user.dateOfBirth} </td>
                  <td> {user.loyalty} </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      ) : (
        <>
          <Loader />
        </>
      )}
    </Container>
  );
};

const useStyles = createStyles(() => {
  return {
    iconButton: {
      cursor: "pointer",
    },


          <Group spacing="xs" className={classes.infoGroup}>
            <Text size="sm" fw={700}>Username: {user.userName}</Text>
            <Text size="sm" fw={700}>Phone: {user.phoneNumber}</Text>
            <Text size="sm" fw={700}>Date of Birth: {new Date(user.dateOfBirth).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            })}</Text>
          </Group>

          <Button
            variant="subtle"
            fullWidth
            onClick={() => navigate(routes.userUpdate.replace(":id", `${user.id}`))}
            className={classes.editButton}
          >
            Edit Profile 
            
          </Button>
          <Button
            variant="gradient"
            fullWidth
            onClick={() => navigate(routes.userBookings)}
            className={classes.editButton}
          >
            My Bookings
            
          </Button>
        </Card>
      ) : (
        <Loader />
      )}
    </Container>
  );
};

const useStyles = createStyles((theme) => ({
  userPageContainer: {
    padding: theme.spacing.xl,
    maxWidth: 540,
    maxHeight: 900,
    margin: 'auto'
  },
  infoGroup: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    padding: theme.spacing.md,
    paddingTop: theme.spacing.xs,
  },
  editButton: {
    marginTop: theme.spacing.md,
  },
}));
