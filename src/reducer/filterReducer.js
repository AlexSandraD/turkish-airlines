// import { ADD_FILTER, REMOVE_FILTER } from "../action/index";

// const initialState = {
//   filter: []
// };

// export default function ticketsReducer(state = initialState, action) {
//   switch (action.type) {
//     case ADD_FILTER:
//       return Object.assign({}, state, {
//         filter: [...state.filter, action.filterType]
//       });

//     case REMOVE_FILTER:
//       const newFilter = state.filter.filter(item => item !== action.filterType);
//       return {
//         filter: newFilter
//       };

//     default:
//       return state;
//   }
// }
