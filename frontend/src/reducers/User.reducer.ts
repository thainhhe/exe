

import { ApiLoginUser } from "../actions/types";


// const initialState = {};
const initialState: ApiLoginUser | null = null; // Adjust initial state as necessary
const UserReducer = (state = initialState, action: { type: string; payload: ApiLoginUser }) => {
    // console.log("state",state)
    // console.log("UserReducer", state, action.payload);
  switch (action.type) {
    case "NEW_USER":
      return { ...action.payload };
    default:
      return state;
  }
};

export default UserReducer;
