import { SecondActionType } from "../action-types";

interface SecondAction {
  type: SecondActionType.ADD_SECOND;
  payload: {
    street: string,
    city: string,
    state: string,
    zip: string,
    country: string,
    current_school: string,
  };
}

interface ClearSecondAction {
  type: SecondActionType.CLEAR_SECOND;
}

export type SecondActionAll = SecondAction | ClearSecondAction;