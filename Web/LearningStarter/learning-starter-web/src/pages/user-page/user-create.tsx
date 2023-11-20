import { FormErrors, useForm } from "@mantine/form";
import {
  ApiResponse,
  UserCreateUpdateDto,
  UserGetDto,
} from "../../constants/types";
import {
  Button,
  Container,
  Flex,
  Space,
} from "@mantine/core";
import { routes } from "../../routes";
import api from "../../config/axios";
import { useNavigate } from "react-router-dom";
import { showNotification } from "@mantine/notifications";
import { UserFormFields, UserFormProvider, useUserForm} from "../User/user-form-fields";
import { useEffect, useState } from "react";

export const UserCreate = () => {
  const [userOptions, setUserOptions] = useState<UserCreateUpdateDto[]>();

  useEffect(() => {
    getUserOptions();
    async function getUserOptions() {
      const response = await api.get<ApiResponse<UserGetDto[]>>(
        "/api/users/options"
      );

      if (response.data.hasErrors) {
        showNotification({ message: "Error getting options.", color: "red" });
        return;
      }
      setUserOptions(response.data.data);
      return;
    }
  });

  const navigate = useNavigate();
  const mantineForm = useUserForm({

    initialValues: {
      id: 1,
      firstName: "",
      lastName: "",
      userName: "",
      email: "",
      phoneNumber: "",
      dateOfBirth: new Date(),
      
    },
  });

  const submitUser = async (values: UserGetDto) => {
    const response = await api.post<ApiResponse<UserCreateUpdateDto>>(
      "/api/users",
      values
    );

    if (response.data.hasErrors) {
      const formErrors: FormErrors = response.data.errors.reduce(
        (prev, curr) => {
          Object.assign(prev, { [curr.property]: curr.message });
          return prev;
        },
        {} as FormErrors
      );
      mantineForm.setErrors(formErrors);
    }
    if (response.data.data) {
      showNotification({
        message: "User successfully updated",
        color: "green",
      });
      navigate(routes.user);
    }
  };

  return (
    <UserFormProvider form={mantineForm}>
      <Container>
        <div>
          <form onSubmit={mantineForm.onSubmit(submitUser)}>
            <UserFormFields />

            <Space h={18} />
            <Flex direction={"row"}>
              <Button type="submit">Submit</Button>
              <Button
                type="button"
                onClick={() => {
                  navigate(routes.user);
                }}
                variant="outline"
              >
                Cancel
              </Button>
            </Flex>
          </form>
        </div>
      </Container>
    </UserFormProvider>
  );
};