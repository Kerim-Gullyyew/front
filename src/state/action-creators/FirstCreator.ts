import { FirstActionType } from "../action-types";
import { FirstActionAll } from "../actions/FirstAction";
import { Dispatch } from "redux";

export const addFirst = (json: {
    full_name: string, email: string,
    phone_number: string | null,
    date_birth: string,
}) => {
    return (dispatch: Dispatch<FirstActionAll>) => {
        dispatch({
            type: FirstActionType.ADD_FIRST,
            payload: json
        })
    };
};

export const clearFirst = () => {
    return (dispatch: Dispatch<FirstActionAll>) => {
        dispatch({
            type: FirstActionType.CLEAR_FIRST,
        })
    };
};