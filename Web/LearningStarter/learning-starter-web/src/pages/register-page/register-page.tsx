import { Container, Alert, createStyles, Input, Button, Text, Title } from "@mantine/core";
import { FormErrors, useForm } from "@mantine/form";
import { PageWrapper } from "../../components/page-wrapper/page-wrapper";
import { DatePicker } from '@mantine/dates';
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import api from "../../config/axios";
import { ApiResponse, UserGetDto } from "../../constants/types";
import { showNotification } from "@mantine/notifications";
import { routes } from "../../routes";


type SignupRequest = {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  phoneNumber: string;
  userName: string;
  password: string;
  email: string;


};
export const RegisterPage = () => {
  const location = useLocation();
  const [currentPath,] = useState(location.pathname);
  const [value, setValue] = useState<Date | null>(null);
  const { classes } = useStyles();
  const navigate=useNavigate();

  const form = useForm<SignupRequest>({
    initialValues: {
      firstName: "",
      lastName: "",
      dateOfBirth: "",
      phoneNumber: "",
      userName: "",
      password: "",
      email: "",
    },
    validate: {
      firstName: (value) =>
        value.length <= 0 ? "Firstname must not be empty" : null,
      lastName: (value) =>
        value.length <= 0 ? "Lastname must not be empty" : null,
      phoneNumber: (value) =>
        value.length <= 0 ? "PhoneNumber must not be empty" : null,
      userName: (value) =>
        value.length <= 0 ? "UserName must not be empty" : null,
      password: (value) =>
        value.length <= 0 ? "Password must not be empty" : null,
      email: (value) =>
        value.length <= 0 ? "Email must not be empty" : null,

    },
  });

  const handleDateChange = (newValue: Date | null) => {
    setValue(newValue);
    form.setFieldValue('dateOfBirth', newValue ? newValue.toISOString() : '');
  };

  const handleRegisterSubmit = async () => {
    const response=await api.post<ApiResponse<UserGetDto>>(`/api/users`,form.values);
    if (response.data.hasErrors) {
      const formErrors: FormErrors = response.data.errors.reduce(
        (prev, curr) => {
          Object.assign(prev, { [curr.property]: curr.message });
          return prev;
        },
        {} as FormErrors
      );
      form.setErrors(formErrors);
    }

    if (response.data.data) {
      showNotification({ message: "Registration Successful!", color: "green" });
      navigate(routes.root);
    }
  }
  useEffect(() => {
    if (location.pathname !== currentPath) {
      window.location.reload();
    }
  }, [location, currentPath]);
  return (
    <PageWrapper>
      <Container>
        <Title ta="center">Register Here</Title>
        <Container px={0}>
          {form.errors[""] && (
            <Alert className={classes.generalErrors} color="red">
              <Text>{form.errors[""]}</Text>
            </Alert>
          )}
          <form onSubmit={form.onSubmit(handleRegisterSubmit)}>
            <Container px={0}>
              <Container className={classes.formField} px={0}>
                <Container px={0}>
                  <label htmlFor="firstName">Firstname</label>
                </Container>
                <Input type="firstName"{...form.getInputProps("firstName")} />
                <Text c="red">{form.errors["firstName"]}</Text>
              </Container>
              <Container className={classes.formField} px={0}>
                <Container px={0}>
                  <label htmlFor="lastName">Lastname</label>
                </Container>
                <Input type="lastName" {...form.getInputProps("lastName")} />
                <Text c="red">{form.errors["lastName"]}</Text>
              </Container>
              <Container className={classes.formField} px={0}>
                <Container px={0}>
                  <label htmlFor="dateOfBirth">Date Of Birth</label>
                </Container>
                <DatePicker value={value} onChange={handleDateChange} />
              </Container>
              <Container className={classes.formField} px={0}>
                <Container px={0}>
                  <label htmlFor="phoneNumber">Phonenumber</label>
                </Container>
                <Input type="phonenNumber" {...form.getInputProps("phoneNumber")} />
                <Text c="red">{form.errors["phoneNumber"]}</Text>
              </Container>
              <Container className={classes.formField} px={0}>
                <Container px={0}>
                  <label htmlFor="userName">Username</label>
                </Container>
                <Input type="UserName" {...form.getInputProps("userName")} />
                <Text c="red">{form.errors["userName"]}</Text>
              </Container>
              <Container className={classes.formField} px={0}>
                <Container px={0}>
                  <label htmlFor="password">Password</label>
                </Container>
                <Input type="password" {...form.getInputProps("password")} />
                <Text c="red">{form.errors["password"]}</Text>
              </Container>
              <Container className={classes.formField} px={0}>
                <Container px={0}>
                  <label htmlFor="email">Email</label>
                </Container>
                <Input type="email" {...form.getInputProps("email")} />
                <Text c="red">{form.errors["email"]}</Text>
              </Container>
              <Container px={0} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Button className={classes.SignupButton} type="submit">
                  Signup
                </Button>
                <Link to='/' style={{ color: '#afffff', marginLeft: '2rem' }}>Click here to Login!</Link>
              </Container>
            </Container>
          </form>
        </Container>
      </Container>
    </PageWrapper>
  );
};

const useStyles = createStyles(() => {
  return {
    generalErrors: {
      marginBottom: "8px",
    },

    SignupButton: {
      marginTop: "8px",
    },

    formField: {
      width: '50%',
      marginBottom: "8px",
    },
  };
});

