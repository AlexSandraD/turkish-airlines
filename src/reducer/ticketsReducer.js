import {
  FETCH_TICKETS_BEGIN,
  FETCH_TICKETS_SUCCESS,
  FETCH_TICKETS_ERROR
} from '../action/index';

const initialState = {
  tickets: [],
  loading: false,
  error: null
};

export default function ticketsReducer(state = initialState, action) {
  switch(action.type) {
    case FETCH_TICKETS_BEGIN:
      return {
        ...state,
        loading: true,
        error: null
      };

    case FETCH_TICKETS_SUCCESS:
      return {
        ...state,
        loading: false,
        tickets: action.payload.tickets
      };

    case FETCH_TICKETS_ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload.error,
        tickets: []
      };

    default:
      return state;
  }
}