import { SecondActionType } from "../action-types";
import { SecondActionAll } from "../actions/SecondAction";
import { Dispatch } from "redux";

export const addSecond = (json: {
    street: string, 
    city: string,
    state: string,
    zip: string,
    country: string,
    current_school: string,
}) => {
    return (dispatch: Dispatch<SecondActionAll>) => {
        dispatch({
            type: SecondActionType.ADD_SECOND,
            payload: json
        })
    };
};

export const clearSecond = () => {
    return (dispatch: Dispatch<SecondActionAll>) => {
        dispatch({
            type: SecondActionType.CLEAR_SECOND,
        })
    };
};