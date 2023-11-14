import { Container, Input } from "@mantine/core"
import { createFormContext } from "@mantine/form";
import { Form } from "react-router-dom";
type UserFormValues = {
    firstName: string;
    lastName: string;
    userName: string;
    email: string;
    phoneNumber: string;
    dateOfBirth: string;
    loyalty: number;
    
}

export const [UserFormProvider, useUserFromContext, useUserForm] = createFormContext<UserFormValues>();

export const UserFormFields = () => {
    const form = useUserFromContext();

    return (
        <>

        <Container px={0}>
            <Container px={0}>
                <label htmlFor="firstName">First Name</label>
            </Container>
            <Input {...form.getInputProps("firstName")} />
        </Container>

       <Container px={0}>
            <Container px={0}>
                <label htmlFor="lastName">Last Name</label>
            </Container>
            <Input {...form.getInputProps("lastName")} />
        </Container>

        <Container px={0}>
            <Container px={0}>
                <label htmlFor="userName">User Name</label>
            </Container>
            <Input {...form.getInputProps("userName")} />
        </Container>

        <Container px={0}>
            <Container px={0}>
                <label htmlFor="email">Email</label>
            </Container>
            <Input {...form.getInputProps("email")} />
        </Container>

        <Container px={0}>
            <Container px={0}>
                <label htmlFor="phoneNumber">Phone Number</label>
            </Container>
            <Input {...form.getInputProps("phoneNumber")} />
        </Container>

        <Container px={0}>
            <Container px={0}>
                <label htmlFor="dateOfBirth">Date Of Birth</label>
            </Container>
            <Input {...form.getInputProps("dateOfBirth")} />
        </Container>

        <Container px={0}>
            <Container px={0}>
                <label htmlFor="loyalty">Loyalty</label>
            </Container>
            <Input {...form.getInputProps("loyalty")} />
        </Container>




        </>
        
        
    )
}