import { SecondActionType } from "../action-types";
import { SecondActionAll } from "../actions/SecondAction";

interface SecondState {
  street: string | null,
  city: string | null,
  state: string | null,
  zip: string | null,
  country: string | null,
  current_school: string | null
}

const initialState = {
  street: null,
  city: null,
  state: null,
  zip: null,
  country: null,
  current_school: null,
};

const SecondReducer = (state: SecondState = initialState, action: SecondActionAll): SecondState => {
  switch (action.type) {
    case SecondActionType.ADD_SECOND:
      return {
        street: action.payload.street,
        city: action.payload.city,
        state: action.payload.state,
        zip: action.payload.zip,
        country: action.payload.country,
        current_school: action.payload.current_school,
      };

    case SecondActionType.CLEAR_SECOND:
      return {
        street: null,
        city: null,
        state: null,
        zip: null,
        country: null,
        current_school: null
      };

    default:
      return state;
  }
};

export default SecondReducer;