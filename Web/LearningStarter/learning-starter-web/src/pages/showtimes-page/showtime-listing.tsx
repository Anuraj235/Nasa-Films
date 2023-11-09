import { useEffect, useState } from "react";
import { ApiResponse, ShowtimesGetDto } from "../../constants/types";
import api from "../../config/axios";
import { showNotification } from "@mantine/notifications";
import { Header, Loader, Space, Table, createStyles } from "@mantine/core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenSquare } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { routes } from "../../routes";



export const ShowtimeListing = () => {
    const [showtimes , setShowtimes]= useState<ShowtimesGetDto[]>();
    const navigate= useNavigate();
   const { classes }= useStyles ();


    useEffect( () =>{
        fetchShowtimes();

        async function  fetchShowtimes(){
            const response = await api.get<ApiResponse<ShowtimesGetDto[]>>("/api/showtimes")
            if (response.data.hasErrors){
                showNotification({message: "Error Fetching Showtimes."});
                 }

                 if(response.data.data){
                    setShowtimes(response.data.data);
                 }
             }
        
      },[]);       
      
              
    
    return  (
        <>
          <Header height={32} >Showtimes</Header>
          <Space h="md"/>
          {showtimes && (           
          
          <Table withBorder striped>
            <thead>
                <tr>
                    <th></th>
                    <th>
                        Starttime
                    </th>
                    <th>
                        AvailableSeats
                    </th>                   
                </tr>
            </thead>
            <tbody>
               
            {showtimes.map((showtime) => {
  return (
    <tr >
      <td>
        <FontAwesomeIcon
        className ={classes.iconButton}
          icon={faPenSquare}
          onClick={() => {
            navigate(routes.showtimeUpdate.replace(":id", `${showtime.id}`));
          }}
        />
      </td>
      <td>{showtime.startTime}</td>
      <td>{showtime.availableSeats}</td>
    </tr>
  );
})}
</tbody>
</Table>
)}
        </>
    );
};

const useStyles = createStyles(() => {

    return{
        iconButton:{
            cursor:"pointer"
        }
    }
})