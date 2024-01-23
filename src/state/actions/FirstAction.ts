import { FirstActionType } from "../action-types";

interface FirstAction {
  type: FirstActionType.ADD_FIRST;
  payload: {
    full_name: string,
    email: string,
    phone_number: string | null,
    date_birth: string | null,
  };
}
interface ClearFirstAction {
  type: FirstActionType.CLEAR_FIRST;
}


export type FirstActionAll = FirstAction | ClearFirstAction;