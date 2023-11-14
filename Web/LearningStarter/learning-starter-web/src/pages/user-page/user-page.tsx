import React from 'react';
import {
  Container,
  createStyles,
  Card,
  Avatar,
  Text,
  Group,
  Button,
  Loader,
  useMantineTheme
} from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { routes } from '../../routes';
import { useAuth } from '../../authentication/use-auth';

export const UserPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const theme = useMantineTheme();
  const { classes } = useStyles();

  return (
    <Container className={classes.userPageContainer}>
      {user ? (
        <Card shadow="sm" radius="md" style={{ maxWidth: 640 }}>
          <Card.Section
            style={{
              background: theme.colors.gray[0],
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              position: 'relative',
              paddingTop: theme.spacing.xl,
            }}
          >
            <Avatar
              size={120}
              radius={120}
              style={{
                border: `3px solid blue`,
                marginTop: theme.spacing.xl * 2,
              }}
            >
              {user.firstName[0]}
            </Avatar>

            <Text size="xl" weight={700} style={{ marginTop: theme.spacing.sm }}>
              {user.firstName + ' ' + user.lastName}
            </Text>
            <Text color="dimmed">{user.email}</Text>
          </Card.Section>

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
