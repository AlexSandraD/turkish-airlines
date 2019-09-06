import { combineReducers } from "redux";
import tickets from "./ticketsReducer";
// import filter from "./filterReducer";

export default combineReducers({
  tickets,
  // filter
});