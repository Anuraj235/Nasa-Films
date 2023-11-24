//This type uses a generic (<T>).  For more information on generics see: https://www.typescriptlang.org/docs/handbook/2/generics.html
//You probably wont need this for the scope of this class :)

import { Key } from "react";
import { Rating } from '@mantine/core';

export type ApiResponse<T> = {
  data: T;
  errors: ApiError[];
  hasErrors: boolean;
};

export type ApiError = {
  property: string;
  message: string;
};

export type AnyObject = {
  [index: string]: any;
};

export type UserGetDto = {
  id: number;
  firstName: string;
  lastName: string;
  userName: string;
  email: string;
  phoneNumber: string;
  dateOfBirth: string;
  loyalty: number;
};

export type UserCreateUpdateDto = {
  id: number;
  firstName: string;
  lastName: string;
  userName: string;
  password: string;
  email: string;
  phoneNumber: string;
  dateOfBirth: Date;
  
};

export type ShowtimesCreateUpdateDto={
  movieID: any;
  startTime: any;
  theaterID: any;
  availableSeats: any; 

};

export type ShowtimesGetDto={
  id:any;
  movieID: any;
  startTime: any;
  theaterID: any;
  availableSeats: any; 

};

export type MovieCreateDto={
  title: string;
  releaseDate: Date;
  description: string;
  genre:null| string;
  duration: number;
  imageUrl:string;
  rating: null | number;
}

export type MovieGetDto ={
  id:number,
  title:string,
  description:string,
  releaseDate: Date,
  duration: number,
  genre:string,
  rating:number,
  imageUrl:string,
  showtimes:[
    {
      id:number,
      startTime:string,
      availableSeats:number,
      theaterID:number
    }
  ]
}

export type TheaterGetDto = {
  theaterName: string;
  id: number;
  address: string;
  hallNumbers: number;
  phone: string;
  email: string;
  screen: [];
  reviews: [];
  showtimes:[
    {
      id:number,
      startTime:string,
      availableSeats:number,
      movieId:number
    }
  ],
};

export type TheaterCreateDto = {
  theaterName: string,
  address: string,
  phone: string,
  email: string,
};

export type BookingCreateDto = {
  showtimeId: number,
  numberOfTickets: number,
  tenderAmount: number,
  userId: number,
};

export type BookingGetDto = {
  id:number,
  movieName:string,
  startTime:string,
  theaterName:string, 
  imageUrl:string,
  numberOfTickets: number,
  tenderAmount: number,
  userId: number,
};

export type Showtime = {
  id: number;
  startTime: string;
  availableSeats: number;
  theaterID: number;
};

export type ReviewGetDto = {
  id: number,
  theaterReview: string,
  rating: number,
  theaterId: number,
  user: {
    firstName: string,
    lastName: string,
  },
  theater: {
    id: number,
    theaterName: string,
    theaterId: number
  }

};

export type ReviewCreateDto = {
  theaterReview: string,
  rating: number,
  theaterId: number,
  userId: number,
};
