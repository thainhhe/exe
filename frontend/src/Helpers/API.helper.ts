import axios, { AxiosResponse } from "axios";
import { ApiResponse } from "../actions/types";
// Axios instance with default options
const axiosInstance = axios.create({
  withCredentials: true, // Send cookies with every request
  // headers: {
  //   "Content-Type": "application/json",
  // },
});

// Define the GET function
export const get = async (url: string): Promise<ApiResponse> => {
  try {
    const response: AxiosResponse<ApiResponse> = await axiosInstance.get(url);
    return response.data;
  } catch (error) {
    console.error("Error in GET request:", error);
    throw error;
  }
};


// Define the POST function
export const post = async (url: string, data: object): Promise<ApiResponse> => {
  console.log("data in api post",data)
  try {
    const response: AxiosResponse<ApiResponse> = await axiosInstance.post(url, data);
    return response.data;
  } catch (error) {
    console.error("Error in POST request:", error);
    throw error;
  }
};

// Define the PATCH function
export const patch = async (url: string, data: object): Promise<ApiResponse> => {
  try {
    const response: AxiosResponse<ApiResponse> = await axiosInstance.patch(url, data);
    return response.data;
  } catch (error) {
    console.error("Error in PATCH request:", error);
    throw error;
  }
};

// Define the DELETE function
export const del = async (url: string): Promise<ApiResponse> => {
  try {
    const response: AxiosResponse<ApiResponse> = await axiosInstance.delete(url);
    return response.data;
  } catch (error) {
    console.error("Error in DELETE request:", error);
    throw error;
  }
};
