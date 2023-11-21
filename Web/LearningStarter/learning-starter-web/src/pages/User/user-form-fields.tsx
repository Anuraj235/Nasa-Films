import { Container, Input } from "@mantine/core"
import { DatePicker } from "@mantine/dates";
import { createFormContext } from "@mantine/form";

type UserFormValues = {
    id: number;
    firstName: string;
    lastName: string;
    userName: string;
    email: string;
    phoneNumber: string;
    dateOfBirth: Date;
    
}

export const [UserFormProvider, useUserFormContext, useUserForm] = createFormContext<UserFormValues>();

export const UserFormFields = () => {
    const form = useUserFormContext();

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
        {/* Use DatePicker component for selecting date */}
        <DatePicker {...form.getInputProps("dateOfBirth")} />
      </Container>
      </>
    );
    
};