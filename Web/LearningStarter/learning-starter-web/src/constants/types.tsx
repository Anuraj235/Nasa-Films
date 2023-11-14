//This type uses a generic (<T>).  For more information on generics see: https://www.typescriptlang.org/docs/handbook/2/generics.html
//You probably wont need this for the scope of this class :)

import { Key } from "react";

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
    }
  ]
}

export type TheaterGetDto = {
  id: number;
  address: string;
  hallNumbers: number;
  phone: number;
  email: string;
  screen: number;
  reviews: string;
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
  showtimeId: number,
  numberOfTickets: number,
  tenderAmount: number,
  userId: number,
}
