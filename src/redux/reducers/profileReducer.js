import {
  SET_USER_INFO, SET_ACCESS_TOKEN, SET_AUTHENTICATED, UPDATE_USER,
  DELETE_USER, LOG_OUT_USER, LOGIN_SUCCESS,
} from "../actions/profileAction";

const initialState = {
  isAuthenticated: false,
  accessToken: null,
  currentUser: null,
  updatedUser: null,
};

export default function profileReducer(state = initialState, action) {
  switch (action.type) {
    case LOGIN_SUCCESS:
      return {
        ...initialState,
        isAuthenticated: true,
        accessToken: action.payload.accessToken,
        currentUser: action.payload.user,
      };
    case LOG_OUT_USER:
    case DELETE_USER:
      return { ...initialState };
    case SET_USER_INFO:
      return { ...state, currentUser: action.payload };
    case SET_ACCESS_TOKEN:
      return { ...state, accessToken: action.payload };
    case SET_AUTHENTICATED:
      return { ...state, isAuthenticated: action.payload };
    case UPDATE_USER:
      return { ...state, currentUser: action.payload, updatedUser: action.payload };
    default:
      return state;
  }
}
