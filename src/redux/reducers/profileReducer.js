import {
    SET_USER_INFO,
    SET_ACCESS_TOKEN,
  } from "../actions/profileAction"
  
  const initialState = {
    accessToken: null,
    currentUser: null, //contains current logged in user info object
    // activeChat: null, // currently active chat room
    // chatList: [], // list of chats user is a part of
    // allUsers: [], // object array of all users in DB
    // viewProfileImage: false,
    // profileImageOptions: false,
    // currentChatParticipant: null,
    // onlineUsers: []
    // myProfilePicture: null,
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
      default:
        return state
    }
  }
  
  export default profileReducer
  