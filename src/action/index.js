export const FETCH_TICKETS_BEGIN   = 'FETCH_TICKETS_BEGIN';
export const FETCH_TICKETS_SUCCESS = 'FETCH_TICKETS_SUCCESS';
export const FETCH_TICKETS_ERROR = 'FETCH_TICKETS_ERROR';


export const fetchTicketsBegin = () => ({
  type: FETCH_TICKETS_BEGIN
});

export const fetchTicketsSuccess = tickets => ({
  type: FETCH_TICKETS_SUCCESS,
  payload: { tickets }
});

export const fetchTicketsError = error => ({
  type: FETCH_TICKETS_ERROR,
  payload: { error }
});

export function fetchTickets() {
  return dispatch => {
    dispatch(fetchTicketsBegin());
    return fetch("tickets.json")
      .then(handleErrors)
      .then(res => res.json())
      .then(json => {
        dispatch(fetchTicketsSuccess(json.tickets));
        return json.tickets;
      })
      .catch(error => dispatch(fetchTicketsError(error)));
  };
}

function handleErrors(response) {
  if (!response.ok) {
    throw Error(response.statusText);
  }
  return response;
}
