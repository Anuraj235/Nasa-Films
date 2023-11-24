import {
  Button,
  Container,
  Flex,
  Header,
  NumberInput,
  Space,
  TextInput,
} from "@mantine/core";
import { useEffect, useState } from "react";
import {
  ApiResponse,
  ShowtimesCreateUpdateDto,
  ShowtimesGetDto,
} from "../../constants/types";
import api from "../../config/axios";
import { useNavigate, useParams } from "react-router-dom";
import { showNotification } from "@mantine/notifications";
import { FormErrors, useForm } from "@mantine/form";
import { routes } from "../../routes";

export const ShowtimeUpdate = () => {
  const [Showtime, setShowtimes] = useState<ShowtimesGetDto>();
  const navigate = useNavigate();
  const { id } = useParams();

  const mantineForm = useForm<ShowtimesCreateUpdateDto>({
    initialValues: Showtime,
  });

  useEffect(() => {
    fetchShowtime();

    async function fetchShowtime() {
      const response = await api.get<ApiResponse<ShowtimesGetDto>>(
        `/api/showtimes/${id}`
      );

      if (response.data.hasErrors) {
        showNotification({ message: " Error Finding Showtime", color: "red" });
      }

      if (response.data.data) {
        setShowtimes(response.data.data);
        mantineForm.setValues(response.data.data);
        mantineForm.resetDirty();
      }
    }
  }, [id]);

  const submitShowtime = async (values: ShowtimesCreateUpdateDto) => {
    const response = await api.put<ApiResponse<ShowtimesGetDto>>(
      `/api/showtimes/${id}`,
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
        message: " Showtime successfully updated",
        color: "green",
      });

      navigate(routes.showtimelisting);
    }
  };

  return (
    <Container>
      {Showtime && (
        <form onSubmit={mantineForm.onSubmit(submitShowtime)}>
          <NumberInput
            {...mantineForm.getInputProps("starttime")}
            label="Starttime"
            withAsterisk
          />
          <NumberInput
            {...mantineForm.getInputProps("availableseats")}
            label="AvailableSeats"
            withAsterisk
          />
          <Space h={18} />
          <Flex direction={"row"}>
            <Button type="submit">Submit</Button>
            <Button
              type="button"
              onClick={() => {
                navigate(routes.showtimelisting);
              }}
              variant="outline"
            >
              Cancel
            </Button>
          </Flex>
        </form>
      )}
    </Container>
  );
};
