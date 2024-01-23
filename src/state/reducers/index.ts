import { combineReducers } from "redux";
import FirstReducer from "./FirstReducers";
import SecondReducer from "./SecondReducer";
import ThirdReducer from "./ThirdReducer";
import FourthReducer from "./FourthReducer";

const reducers = combineReducers({
  first: FirstReducer,
  second: SecondReducer,
  third: ThirdReducer,
  fourth: FourthReducer,
});

export default reducers;

export type RootState = ReturnType<typeof reducers>;