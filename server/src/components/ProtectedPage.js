import React, { useEffect, useState } from "react";
import { GetCurrentUser } from "../apicalls/users";
import { message } from "antd";
import { useNavigate } from "react-router-dom";
import { getLoggedInUserName } from "../utils/helpers";
import { useDispatch, useSelector } from "react-redux";
import { SetCurrentUser } from "../redux/usersSlice";
import { SetLoading } from "../redux/loadersSlice";

function ProtectedPage({ children }) {
  const dispatch = useDispatch();
  // const [currentUser, setCurrentUser] = useState(null);
  const { currentUser } = useSelector((state) => state.users);

  // useSelector is a hook provided by the react-redux library, which is used in React applications to select and access the state from the Redux store. It allows components to extract specific pieces of state from the Redux store and subscribe to changes in that state
  // The useSelector hook is being used to select the currentUser field from the "users" slice of the Redux store state.
  // The selector function (state) => state.users is passed as an argument to useSelector. It takes the entire Redux state as input and returns the "users" slice of the state. In Redux, the state is organized into different slices, and in this case, "users" is one of those slices.
  // The object destructuring syntax { currentUser } is used to extract the currentUser field from the "users" slice returned by the useSelector hook. The currentUser variable now holds the value of the currentUser field from the "users" slice.

  const navigate = useNavigate();
  const getCurrentUser = async () => {
    try {
      dispatch(SetLoading(true));
      const response = await GetCurrentUser();
      dispatch(SetLoading(false));
      //   console.log("Response from backend:", response);
      console.log("Response from backend:", response.data);
      if (response.success) {
        // console.log("CurrentUser:", currentUser);
        dispatch(SetCurrentUser(response.data));
        message.success(response.message);
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      dispatch(SetLoading(true));
      message.error(error.message);
    }
  };

  useEffect(() => {
    if (localStorage.getItem("token")) {
      getCurrentUser();
    } else {
      navigate("/login");
    }
  }, []);

  return (
    currentUser && (
      <div>
        {currentUser && <h1>Welcome {getLoggedInUserName(currentUser)}</h1>}
        {children}
      </div>
    )
  );
}

export default ProtectedPage;
