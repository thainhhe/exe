// /redux/reducers/Account.reducer.ts

import { ApiLoginAdmin } from "../actions/types";

const initialState: ApiLoginAdmin | null = null; // Adjust initial state as necessary

const AccountReducer = (state = initialState, action: { type: string; payload: ApiLoginAdmin }) => {
    // console.log("AccountReducer", state, action.payload);
    switch (action.type) {
        case "NEW_ACCOUNT":
            return { ...action.payload }; // Update state based on the payload
        default:
            return state;
    }
};

export default AccountReducer;
