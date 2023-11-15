
import { Route, Routes as Switch, Navigate } from "react-router-dom";
import { LandingPage } from "../pages/landing-page/landing-page";
import { NotFoundPage } from "../pages/not-found";
import { useUser } from "../authentication/use-auth";
import { UserPage } from "../pages/user-page/user-page";
import { PageWrapper } from "../components/page-wrapper/page-wrapper";
import { routes } from ".";
import {ShowtimesForm} from "../pages/showtimes-page/showtime-create";
import { ShowtimeListing } from "../pages/showtimes-page/showtime-listing";
import { ShowtimeUpdate } from "../pages/showtimes-page/showtime-update";
import { MovieBookingPage } from "../pages/movie-bookings-page/movie-bookings";
import { MoviesPage } from "../pages/movies-page/movies-page";
import { Movies } from "../pages/movies-page/movies-display";
import { TheaterPage } from "../pages/theater-page/theater-page";
import { TheaterListing } from "../pages/theater-page/theater-listing";
import { TheaterUpdate } from "../pages/theater-page/theater-update";
import { UserUpdate } from "../pages/user-page/user-update";
import { UserBooking } from "../pages/movie-bookings-page/user-bookings";


//This is where you will tell React Router what to render when the path matches the route specified.
export const Routes = () => {
  //Calling the useUser() from the use-auth.tsx in order to get user information
  const user = useUser();
  return (
    <>
      {/* The page wrapper is what shows the NavBar at the top, it is around all pages inside of here. */}
      <PageWrapper user={user}>
        <Switch>
          {/* When path === / render LandingPage */}
          <Route path={routes.home} element={<LandingPage />} />
          {/* When path === /iser render UserPage */}
          <Route path={routes.user} element={<UserPage />} />
          <Route path={routes.userUpdate} element={<UserUpdate />} />



          <Route path={routes.showtimecreate} element={<ShowtimesForm />} />
          <Route path={routes.showtimelisting} element={<ShowtimeListing />} />
          <Route path={routes.showtimeUpdate} element={<ShowtimeUpdate />} />


          <Route path={routes.movieBookingPage} element={<MovieBookingPage />} />
          <Route path={routes.userBookings} element={<UserBooking />} />
          
          
          <Route path={routes.addMovie} element={<MoviesPage />} />  
          <Route path={routes.movies} element={<Movies />} /> 

     
          {/* When path === /theater render TheaterPage */}
          <Route path={routes.theater} element={<TheaterPage />} />
          <Route path ={routes.theaterListing} element={<TheaterListing/>}/>
          <Route path={routes.theaterUpdate} element={<TheaterUpdate/>}/>
 
          {/* Going to route "localhost:5001/" will go to homepage */}
          <Route path={routes.root} element={<Navigate to={routes.home} />} />

          {/* This should always come last.  
            If the path has no match, show page not found */}
          <Route path="*" element={<NotFoundPage />} />
        </Switch>
      </PageWrapper>
    </>
  );
};
