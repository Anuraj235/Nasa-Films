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

export type UserDto = {
  id: number;
  firstName: string;
  lastName: string;
  userName: string;
};
export type ShowtimesCreateUpdateDto={
  movieID: any;
  startTime: any;
  theaterID: any;
  availableSeats: any; 

}
export type ShowtimesGetDto={
  id:any;
  movieID: any;
  startTime: any;
  theaterID: any;
  availableSeats: any; 

}


