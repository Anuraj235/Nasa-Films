import { Button, Container, createStyles, Group, TextInput, Title } from "@mantine/core"
import { useForm } from "@mantine/form";
import { ApiResponse, TheaterGetDto } from "../../constants/types";
import api from "../../config/axios";
import { showNotification } from "@mantine/notifications";
import { useNavigate } from "react-router-dom";
import { routes } from "../../routes";


export const TheaterPage = () => {
  const { classes } = useStyles();
  const navigate = useNavigate();

  const form = useForm({
    initialValues: {
      theaterName: '',
      address: '',
      email: '',
      phone: '',
    },
  });

  const handleSubmit = async () => {
    try {
      const response = await api.post<ApiResponse<TheaterGetDto>>("/api/theaters", form.values);
      if (response.data.data) {
        showNotification({ message: "Successfully Created Theater", color: "green" });
        form.reset();
        navigate(routes.home);
      }
    } catch (error) {
      showNotification({ message: "Error to create Theater", color: "red" })
    }

  }

  return (

    <>
      <Title order={2} align="center" style={{color:"#9C7A4B"}}>Add Theater </Title>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Container style={{ maxWidth: 320, margin: 'auto' }}>

          <TextInput
            mt="md"
            label="Theater Name"
            placeholder="Theater Name"
            {...form.getInputProps('theaterName')}
            className={classes.inputField}

          />
          <TextInput
            mt="md"
            label="Address"
            placeholder="Address"
            {...form.getInputProps('address')}
            className={classes.inputField}

          />
          <TextInput
            mt="md"
            label="Email"
            type="email"
            placeholder="Email"
            {...form.getInputProps('email')}
            className={classes.inputField}

          />
          <TextInput
            mt="md"
            label="Phone"
            type='number'
            placeholder="Phone Number"
            {...form.getInputProps('phone')}
            className={classes.inputField}

          />
          <Group position="center" className={classes.submitButton}>
            <Button variant="gradient" gradient={{ from: 'teal', to: 'blue', deg: 60 }} type="submit">Submit</Button>
          </Group>

        </Container>
      </form>
    </>

  );
};
const useStyles = createStyles(() => ({
  inputField: {
    'label': {
      color: "#9C7A4B",
    },
  },
  submitButton: {
    padding: "12px 0",
    fontSize: "18px",
    fontWeight: "bold",
    transition: "background 0.3s",
  },
}));
