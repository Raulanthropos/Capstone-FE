import {
    // SET_ACCESS_TOKEN,
    SET_ACTIVE_CHAT,
    SET_CHATS,
    SET_HISTORY,
    SET_USER_INFO,
    VIEW_PROFILE_IMAGE,
    CLOSE_FULL_PROFILE_IMAGE,
    TOGGLE_PROFILE_IMAGE_OPTIONS,
    SET_ACCESS_TOKEN,
    SET_PROFILE_PICTURE,
    SET_ABOUT,
    SET_DISPLAYNAME,
    LOG_OUT_USER,
    SET_ALL_USERS,
    SET_CHAT_PARTICIPANT,
    SET_ONLINE_USERS
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
    //   case LOG_OUT_USER:
    //     return {
    //       ...state,
  
    //       currentUser: null
    //     }
    //   case SET_ACTIVE_CHAT:
    //     return {
    //       ...state,
    //       activeChat: action.payload
    //     }
    //   case SET_CHATS:
    //     return {
    //       ...state,
    //       chatList: action.payload
    //     }
    //   case VIEW_PROFILE_IMAGE:
    //     return {
    //       ...state,
    //       viewProfileImage: action.payload
    //     }
    //   case CLOSE_FULL_PROFILE_IMAGE:
    //     return {
    //       ...state,
    //       viewProfileImage: action.payload
    //     }
    //   case TOGGLE_PROFILE_IMAGE_OPTIONS:
    //     return {
    //       ...state,
    //       profileImageOptions: action.payload
    //     }
    //   case SET_PROFILE_PICTURE:
    //     return {
    //       ...state,
  
    //       avatar: action.payload,
    //       myProfilePicture: action.payload,
    //       currentUser: {
    //         ...state.currentUser,
    //         avatar: action.payload
    //       }
    //     }
    //   case SET_ABOUT:
    //     return {
    //       ...state,
    //       about: action.payload,
    //       currentUser: {
    //         ...state.currentUser,
    //         about: action.payload
    //       }
    //     }
    //   case SET_DISPLAYNAME:
    //     return {
    //       ...state,
    //       displayName: action.payload,
    //       currentUser: {
    //         ...state.currentUser,
    //         displayName: action.payload
    //       }
    //     }
    //   case SET_ALL_USERS:
    //     return {
    //       ...state,
    //       allUsers: action.payload
    //     }
    //   case SET_CHAT_PARTICIPANT:
    //     return {
    //       ...state,
    //       currentChatParticipant: action.payload
    //     }
    //   case SET_ONLINE_USERS:
    //     return {
    //       ...state,
    //       onlineUsers: action.payload
    //     }
  
      default:
        return state
    }
  }
  
  export default profileReducer
  