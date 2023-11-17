import { Button, Container, Flex, Space, TextInput } from "@mantine/core"
import { ApiResponse, UserGetDto, UserCreateUpdateDto, OptionItemDto } from "../../constants/types";
import { useEffect, useState } from "react";
import api from "../../config/axios";
import { useNavigate, useParams } from "react-router-dom";
import { showNotification } from "@mantine/notifications";
import { FormErrors, useForm } from "@mantine/form";
import { routes } from "../../routes";
import { UserFormProvider, useUserForm } from "../User/user-form-fields";

export const UserUpdate = () => {

    const [user, setUser] = useState<UserGetDto>();
    const navigate = useNavigate();
    const{id} = useParams();

     const mantineForm = useUserForm({
        initialValues: user,

     });

    
    useEffect (() => {
        fetchUser();
        async function fetchUser() {

            const response = await api.get<ApiResponse<UserGetDto>>(
                `/api/users/${id}`
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
            `/api/users/${id}`, 
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
        <UserFormProvider form={mantineForm}>
            <Container>
                {user && (
                <form onSubmit={mantineForm.onSubmit(submitUser)}>
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
        </UserFormProvider>
    );
};
