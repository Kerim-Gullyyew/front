import { FirstActionType } from "../action-types";
import { FirstActionAll } from "../actions/FirstAction";

interface FirstState {
  full_name: string | null,
  email: string | null,
  phone_number: string | null,
  date_birth: string | null
}

const initialState = {
  full_name: null,
  email: null,
  phone_number: null,
  date_birth: null,
};

const FirstReducer = (state: FirstState = initialState, action: FirstActionAll): FirstState => {
  switch (action.type) {
    case FirstActionType.ADD_FIRST:
      return {
        full_name: action.payload.full_name,
        email: action.payload.email,
        phone_number: action.payload.phone_number,
        date_birth: action.payload.date_birth
      };

    case FirstActionType.CLEAR_FIRST:
      return {
        full_name: null,
        email: null,
        phone_number: null,
        date_birth: null
      };

    default:
      return state;
  }
};

export default FirstReducer;