import { Button, Container, Flex, Space, TextInput } from "@mantine/core"
import { ApiResponse, UserGetDto, UserCreateUpdateDto } from "../../constants/types";
import { useEffect, useState } from "react";
import api from "../../config/axios";
import { useNavigate, useParams } from "react-router-dom";
import { showNotification } from "@mantine/notifications";
import { FormErrors, useForm } from "@mantine/form";
import { routes } from "../../routes";

export const UserUpdate = () => {
    const [user, setUser] = useState<UserGetDto>();
    const navigate = useNavigate();
    const{id} = useParams();

     const mantineForm = useForm<UserCreateUpdateDto>({
        initialValues: user,
     });

    
    useEffect (() => {
        fetchUser();
        async function fetchUser() {

            const response = await api.get<ApiResponse<UserGetDto>>(
                `/api/user/${id}`
                );
            
            if(response.data.hasErrors) {
                showNotification({message:"Error finding User", color: "red"});
            }

                if(response.data.data){
                   setUser(response.data.data); 
                   mantineForm.setValues(response.data.data)
                   mantineForm.resetDirty();
                
            }
        }
    }, [id]);

    const submitUser = async (values: UserCreateUpdateDto) => {
        const response = await api.put<ApiResponse<UserGetDto>>(
            `/api/user/${id}`, 
            values
            );

        if(response.data.hasErrors) {
            const formErrors: FormErrors = response.data.errors.reduce((prev, curr) => {
                Object.assign(prev, {[curr.property]: curr.message});
                return prev;
            }, {} as FormErrors
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
        };

    return (
        <>
            <Container>
                {user && (
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
                    label="Loayalty"
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
                )}
            </Container>
        </>
    );
};
