import React, { ReactNode, useEffect, useState } from "react";
import { ApiResponse } from "../../constants/types";
import { useAsyncFn } from "react-use";
import { PageWrapper } from "../../components/page-wrapper/page-wrapper";
import { FormErrors, useForm } from "@mantine/form";
import {
  Alert,
  Button,
  Container,
  createStyles,
  Input,
  Text,
} from "@mantine/core";
import api from "../../config/axios";
import { showNotification } from "@mantine/notifications";
import { Link, useLocation } from "react-router-dom";
import Footer from "../../components/page-wrapper/footer";

const baseUrl = process.env.REACT_APP_API_BASE_URL;

type LoginRequest = {
  userName: string;
  password: string;
};

type LoginResponse = ApiResponse<boolean>;

const CenteredBox: React.FC<{ children: ReactNode }> = ({ children }) => {
  const boxStyles: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "40vh", 
    width: "340px", 
    padding: "20px",
    borderRadius: "8px",
    backgroundColor: "transparent", // Transparent background
    border: "2px solid #ffffff",
    margin: "80px auto 0",
  };

  const textContainerStyles: React.CSSProperties = {
    marginBottom: "-10px",
  };

  return (
    <div style={boxStyles}>
      <div style={textContainerStyles}> </div>
      {children}
    </div>
  );
};

export const LoginPage = ({ fetchCurrentUser }: { fetchCurrentUser: () => void }) => {
  const { classes } = useStyles();
  const location = useLocation();
  const [currentPath, setCurrentPath] = useState(location.pathname);
  const form = useForm<LoginRequest>({
    initialValues: {
      userName: "",
      password: "",
    },
    validate: {
      userName: (value) => (value.length <= 0 ? "Username must not be empty" : null),
      password: (value) => (value.length <= 0 ? "Password must not be empty" : null),
    },
  });

  const [, submitLogin] = useAsyncFn(async (values: LoginRequest) => {
    if (baseUrl === undefined) {
      return;
    }

    const response = await api.post<LoginResponse>(`/api/authenticate`, values);
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
      showNotification({ message: "Successfully Logged In!", color: "green" });
      fetchCurrentUser();
    }
  }, []);

  useEffect(() => {
    if (location.pathname !== currentPath) {
      setCurrentPath(location.pathname);
      window.location.reload();
    }
  }, [location, currentPath]);

  return (
    <>
    <PageWrapper>
    <h2 className={classes.title} style={{color:"#fddc9a"}}>Welcome to NASSA Films</h2>
      <CenteredBox>
        {form.errors[""] && (
          <Alert className={classes.generalErrors} color="red">
            <Text>{form.errors[""]}</Text>
          </Alert>
        )}
        <form onSubmit={form.onSubmit(submitLogin)}>
          <Container className={classes.formField} px={0}>
            <Container px={0}>
              <label htmlFor="userName" style={{fontWeight:"bold"}}>Username</label>
            </Container>
            <Input {...form.getInputProps("userName")} />
            <Text c="red">{form.errors["userName"]}</Text>
          </Container>
          <Container className={classes.formField} px={0}>
            <Container px={0}>
              <label htmlFor="password" style={{fontWeight:"bold"}}>Password</label>
            </Container>
            <Input type="password" {...form.getInputProps("password")} />
            <Text c="red">{form.errors["password"]}</Text>
          </Container>

          <Container px={0}>
            <Button className={classes.loginButton} type="submit">
              Login
            </Button>
            <Link to="/registerpage" style={{ color: "#afffff", marginLeft: '2rem' }}>Create a new account</Link>
          </Container>
        </form>
      </CenteredBox>
    </PageWrapper>
    <Footer />
    </>
 
  );
};

const useStyles = createStyles(() => {
  return {
    generalErrors: {
      marginBottom: "8px",
    },

    loginButton: {
      marginTop: "8px",
    },

    formField: {
      marginBottom: "8px",

    },

    title: {
      fontSize: "3rem", // Adjust the font size as needed
      fontWeight: "bold",
      color: "rgba(255, 255, 255, 0.5)", // Adjust color as needed
      textAlign: "center",
      marginBottom: "20px",
    },

    centeredContent: {
      textAlign: "center", // Center the content
    },
  };
});
