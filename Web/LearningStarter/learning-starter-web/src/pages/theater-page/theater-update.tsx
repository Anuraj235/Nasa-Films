import { Button, Container, Space, TextInput,Title, Flex, createStyles } from "@mantine/core";
import { useEffect, useState } from "react";
import { ApiResponse, TheaterCreateDto, TheaterGetDto } from "../../constants/types";
import api from "../../config/axios";
import { useNavigate, useParams } from "react-router-dom";
import { showNotification } from "@mantine/notifications";
import { FormErrors, useForm } from "@mantine/form";
import { routes } from "../../routes";

export const TheaterUpdate = () => {
  const [theater, setTheater] = useState<TheaterGetDto | null>(null);
  const navigate = useNavigate();
  const { classes } = useStyles();
  const { id } = useParams<{ id: string }>();

  const mantineForm = useForm<TheaterCreateDto>({
    initialValues: {
      theaterName: '',
      address: '',
      email: '',
      phone: '',
    },
  });

  useEffect(() => {
    const fetchTheater = async () => {
      try {
        const response = await api.get<ApiResponse<TheaterGetDto>>(`/api/theaters/${id}`);
        if (response.data.hasErrors) {
          showNotification({ message: "Error finding theater", color: "red" });
        } else {
          setTheater(response.data.data);
          console.log(response.data.data)
          mantineForm.setValues(response.data.data);
        }
      } catch (error) {
        showNotification({ message: "Error fetching theater data", color: "red" });
      }
    };
    fetchTheater();
  }, [id]);

  const submitTheater = async (values: TheaterCreateDto) => {
    try {
      const response = await api.put<ApiResponse<TheaterGetDto>>(`/api/theaters/${id}`, values);
      if (response.data.hasErrors) {
        const formErrors: FormErrors = response.data.errors.reduce((prev, curr) => ({
          ...prev,
          [curr.property]: curr.message
        }), {});
        mantineForm.setErrors(formErrors);
      } else {
        showNotification({
          message: "Theater successfully updated",
          color: "green",
        });
        navigate(routes.theaterListing);
      }
    } catch (error) {
      showNotification({ message: "Error updating theater", color: "red" });
    }
  };

  return (
    <>
     <Title order={2} align="center" style={{color:"#9C7A4B",marginTop:'5rem'}}>Update Theater </Title>
      {theater && (
        <form onSubmit={mantineForm.onSubmit(submitTheater)}>
          <Container style={{ maxWidth: 420, margin: 'auto',marginTop:'1rem'}}>
            <TextInput
              {...mantineForm.getInputProps('theaterName')}
              label="Theater Name"
              className={classes.inputField}
              withAsterisk
            />
            <TextInput
              {...mantineForm.getInputProps('address')}
              label="Address"
              className={classes.inputField}
              withAsterisk
            />
            <TextInput
              {...mantineForm.getInputProps('email')}
              label="Email"
              className={classes.inputField}
              withAsterisk
            />
            <TextInput
              {...mantineForm.getInputProps('phone')}
              label="Phone Number"
              className={classes.inputField}
              withAsterisk
            />
            <Space h="md" />
            <Flex
              direction={{ base: 'column', sm: 'row' }}
              gap={{ base: 'sm', sm: 'lg' }}
              justify={{ sm: 'center' }}
            >
              <Button type="submit" gradient={{ from: 'teal', to: 'blue', deg: 60 }}>Update Theater</Button>
              <Button
                type="button"
                onClick={() => navigate(routes.theaterListing)}
                variant="outline"
              >
                Cancel
              </Button>
            </Flex>
          </Container>
        </form>
      )}
    </>
  );
};
const useStyles = createStyles(() => ({
  inputField: {
    margin:"1rem",
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
