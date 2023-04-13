import {
    SET_USER_INFO,
    SET_ACCESS_TOKEN,
    SET_AUTHENTICATED,
    UPDATE_USER,
    DELETE_USER,
    LOG_OUT_USER,
    ADOPTION_ADDED,
    ADOPTION_ADD_ERROR,
    SET_ADOPTION_REQUEST,
  } from "../actions/profileAction"
  
// Define the initial state for the reducer

  const initialState = {
    isAuthenticated: false,
    accessToken: localStorage.getItem("accessToken"),
    currentUser: null,
    updatedUser: null,
    adoptionRequest: false,
  }
  
  const profileReducer = (state = initialState, action) => {
    switch (action.type) {
      case SET_ACCESS_TOKEN: // add a new case to handle setting the accessToken
        return {
          ...state,
          accessToken: action.payload
        }
      case SET_USER_INFO:
        return {
          ...state,
          currentUser: action.payload
        }
        case SET_AUTHENTICATED:
          return {
            ...state,
            isAuthenticated: action.payload
          }
        case UPDATE_USER:
          return {
            ...state,
            updatedUser: action.payload
          }
          case ADOPTION_ADDED:
          return {
            ...state,
            currentUser: action.payload
          }
          case ADOPTION_ADD_ERROR:
          return {
            ...state,
            currentUser: action.payload
          }
          case SET_ADOPTION_REQUEST:
      return {
        ...state,
        adoptionRequest: action.payload,
      };
          case DELETE_USER:
            return {
              ...state,
              currentUser: action.payload
            }
      default:
        return state
    }
  }
  
  export default profileReducer
  