import { FormErrors, useForm } from "@mantine/form"
import { ApiResponse, UserCreateUpdateDto, UserGetDto } from "../../constants/types"
import { Button, Container, Flex, Space, TextInput } from "@mantine/core";
import { routes } from "../../routes";
import api from "../../config/axios";
import { useNavigate } from "react-router-dom";
import { showNotification } from "@mantine/notifications";

export const UserCreate = () => {
    const navigate = useNavigate();
    const mantineForm = useForm<UserCreateUpdateDto>({
        initialValues: {
            
                firstName: "",
                lastName: "",
                userName: "",
                email: "",
                phoneNumber: "",
                dateOfBirth: "",
                loyalty: 0
                
        },
    });

    const submitUser = async (values: UserCreateUpdateDto) => {
        const response = await api.post<ApiResponse<UserGetDto>>("/api/user", values);

        if(response.data.hasErrors) {
            const formErrors: FormErrors = response.data.errors.reduce((prev, curr) => {
                Object.assign(prev, {[curr.property]: curr.message});
                return prev;
            }, 
            {} as FormErrors
            );
            mantineForm.setErrors(formErrors);
        }
            if(response.data.data){
               showNotification ({
                message: "User successfully updated",
                color: "green",
            });
               navigate(routes.user);
            }
    }

    return  (<Container>
        <form onSubmit={mantineForm.onSubmit(submitUser)}>
        <TextInput 

                    {...mantineForm.getInputProps("firstName")}
                    label="First Name"
                    withAsterisk
                    />
                    <TextInput
                    {...mantineForm.getInputProps("lastName")}
                    label="Last Name"
                    withAsterisk/>
                    <TextInput
                    {...mantineForm.getInputProps("userName")}
                    label="Username"
                    withAsterisk/>
                    <TextInput
                    {...mantineForm.getInputProps("email")}
                    label="Email"
                    withAsterisk/>
                    <TextInput
                    {...mantineForm.getInputProps("dateOfBirth")}
                    label="Date Of Birth"
                    withAsterisk/>
                    <TextInput
                    {...mantineForm.getInputProps("loyalty")}
                    label="Loyalty"
                    withAsterisk/>

                    <Space h={18} />
                        <Flex direction={"row"}>
                        <Button type="submit">Submit</Button>
                        <Button type="button" onClick={() => { 
                        navigate (routes.user);
                    }} 
                    variant="outline"
                >
                Cancel
                </Button>
            </Flex> 
        </form>
     </Container>);

};
