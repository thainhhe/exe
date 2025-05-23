// /redux/actions/AccountAction.ts

import { ApiLoginAdmin } from "./types";


export const accountActions = (payload: ApiLoginAdmin) => {
    console.log(payload);
    return {
        type: "NEW_ACCOUNT" as const,
        payload: payload,
    };
};
