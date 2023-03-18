import {
    SET_USER_INFO,
    SET_ACCESS_TOKEN,
    SET_AUTHENTICATED
  } from "../actions/profileAction"
  
  const initialState = {
    isAuthenticated: false,
    accessToken: localStorage.getItem("accessToken"),
    currentUser: null,
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
      default:
        return state
    }
  }
  
  export default profileReducer
  