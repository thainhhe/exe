// /redux/actions/AccountAction.ts

import { ApiLoginUser } from "./types";


export const userActions = (payload: ApiLoginUser) => {
    // console.log(payload);
    return {
        type: "NEW_USER" as const,
        payload: payload,
    };
};
