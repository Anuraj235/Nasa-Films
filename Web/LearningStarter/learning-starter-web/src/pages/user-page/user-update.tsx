import { Button, Container, Flex, Group, Space, TextInput, Title, createStyles } from "@mantine/core"
import { ApiResponse, UserGetDto, UserCreateUpdateDto } from "../../constants/types";
import { useEffect, useState } from "react";
import api from "../../config/axios";
import { useNavigate, useParams } from "react-router-dom";
import { showNotification } from "@mantine/notifications";
import { FormErrors, useForm } from "@mantine/form";
import { routes } from "../../routes";
import { DatePicker } from "@mantine/dates";

export const UserUpdate = () => {

    const [user, setUser] = useState<UserGetDto>();
    const navigate = useNavigate();
    const{id} = useParams();
    const { classes } = useStyles();
    const [value, setValue] = useState(new Date());


    const handleDateChange = (newValue: Date | null) => {
        if (newValue) {
          setValue(newValue);
        }
      };

     const mantineForm = useForm({
        initialValues: {
            firstName: '',
            lastName: '',
            userName: '',
            email: '',
            phoneNumber: '',
            dateOfBirth: new Date().toISOString(),
        }

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

    const handleSubmit = async () => {
        try{
        const response = await api.put<ApiResponse<UserGetDto>>(
            `/api/users/${id}`, mantineForm.values);

            if(response.data.data){
               showNotification ({
                message: "User successfully updated",
                color: "green", 
            });
               navigate(routes.user);
            }
        } catch (error) {
            showNotification({ message: "Error creating user", color:"red"})
        }
        };

    return (
            <Container>
                <Title order={2} align="center" style={{color:"#9C7A4B",marginTop:'5rem'}}>Edit your details </Title>
                <form onSubmit={mantineForm.onSubmit(handleSubmit)}>
                    <Container style={{ maxWidth: 420, margin: 'auto' }}>

                    <TextInput
                        mt="md"
                        label="First Name"
                        placeholder="First Name"
                        {...mantineForm.getInputProps('firstName')}
                        className={classes.inputField}

                    />
                    <TextInput
                        mt="md"
                        label="Last Name"
                        placeholder="Last Name"
                        {...mantineForm.getInputProps('lastName')}
                        className={classes.inputField}

                    />
                    <TextInput
                        mt="md"
                        label="User Name"
                        placeholder="User Name"
                        {...mantineForm.getInputProps('userName')}
                        className={classes.inputField}

                    />
                    <p className={classes.inputField} style={{fontSize:"14px", marginBottom:"2px", color:"#9C7A4B"}}>Date of birth</p>
                    <DatePicker value={value} onChange={handleDateChange}/>
                    <TextInput
                        mt="md"
                        label="Email"
                        type="email"
                        placeholder="Email"
                        {...mantineForm.getInputProps('email')}
                        className={classes.inputField}

                    />
                    <TextInput
                        mt="md"
                        label="Phone"
                        type='number'
                        placeholder="Phone Number"
                        {...mantineForm.getInputProps('phone')}
                        className={classes.inputField}

                    />
                    <Group position="center" className={classes.submitButton}>
                        <Button variant="gradient" gradient={{ from: 'teal', to: 'blue', deg: 60 }} type="submit">Submit</Button>
                        <Button
                            type="button"
                            onClick={() => navigate(routes.user)}
                            variant="outline"
                            >
                            Cancel
                        </Button>
                    </Group>

                    </Container>
                </form>
            </Container>
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

function setValue(newValue: Date) {
    throw new Error("Function not implemented.");
}
