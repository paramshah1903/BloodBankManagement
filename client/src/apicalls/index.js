import axios from "axios";

// We define a function called axiosInstance. This function will be used to create and handle HTTP requests using Axios.

export const axiosInstance = async (method, endpoint, payload) => {
  try {
    const response = await axios({
      method,
      url: endpoint,
      data: payload,
      headers: {
        authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      // The use of "Bearer" in the authorization header is a standard convention in token-based authentication schemes, particularly in the context of web applications and APIs. The "Bearer" keyword indicates the type of authentication scheme being used for the request.
      // By using the "Bearer" keyword in the authorization header, the server can understand how to handle the token being sent in the request. It tells the server that the provided token is of type "Bearer," and the server should treat it accordingly for authentication and authorization purposes.
    });

    return response.data;
    // If the request is successful, we return the response.data, which contains the data returned by the server.
  } catch (error) {
    return error;
  }
};

// export const axiosInstance = async (method, endpoint, payload) => {: Export an async function called axiosInstance. The function takes three parameters
// method: The HTTP method (e.g., "GET", "POST", "PUT", "DELETE") that will be used for the request.
// endpoint: The URL endpoint to which the request will be made.
// payload: The data that will be sent along with the request. This parameter is optional and may not be required for some HTTP methods like "GET".

// try {: The function starts with a try block to handle the asynchronous operation.
// const response = await axios({ ... });: Inside the try block, the function uses Axios to make the actual HTTP request. It uses the provided method, endpoint, and payload to form the request configuration object. The await keyword ensures that the function waits for the Axios request to complete and returns the response.
// return response.data;: If the request is successful, the function returns the data property from the Axios response object. This contains the response data returned by the server.
