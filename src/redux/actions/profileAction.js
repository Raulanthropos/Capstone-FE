export const SET_USER_INFO = "SET_USER_INFO"
export const SET_CHATS = "SET_CHATS"
export const SET_ACTIVE_CHAT = "SET_ACTIVE_CHAT"
export const SET_HISTORY = "SET_HISTORY"
export const NEW_MESSAGE = "NEW_MESSAGE"
export const VIEW_PROFILE_IMAGE = "VIEW_PROFILE_IMAGE"
export const CLOSE_FULL_PROFILE_IMAGE = "CLOSE_FULL_PROFILE_IMAGE"
export const TOGGLE_PROFILE_IMAGE_OPTIONS = "TOGGLE_PROFILE_IMAGE_OPTIONS"
export const SET_PROFILE_PICTURE = "SET_PROFILE_PICTURE"
export const SET_ABOUT = "SET_ABOUT"
export const SET_DISPLAYNAME = "SET_DISPLAYNAME"
export const LOG_OUT_USER = "LOG_OUT_USER"
export const SET_CHAT_PARTICIPANT = "SET_CHAT_PARTICIPANT"

export const SET_ACCESS_TOKEN = "SET_ACCESS_TOKEN"

export const SET_ALL_USERS = "SET_ALL_USERS"
export const SET_ONLINE_USERS = "SET_ONLINE_USERS"

const baseEndpoint = "http://localhost:3001"

export const setAccessToken = (accessToken) => ({
  type: SET_ACCESS_TOKEN,
  payload: accessToken
})

export const getAccessToken = (loggingInAuthor) => {
  return async (dispatch) => {
    const options = {
      method: "POST",
      body: JSON.stringify(loggingInAuthor),
      headers: {
        "Content-Type": "application/json"
      }
    }
    // console.log("options and userid thereof", options, options.user._id?options.user._id:"No id you goof");
    try {
      console.log("---------inside the getAccessToken action----------")
      const response = await fetch(baseEndpoint + "/users/login", options)
      console.log("response - 1", response)
      if (response.ok) {
        console.log("response", response)
        const tokens = await response.json()
        const accessToken = await tokens.accessToken
        console.log("dispatching accessToken", accessToken)

        if (accessToken) {
          dispatch({
            type: SET_ACCESS_TOKEN,
            payload: accessToken
          })
          localStorage.setItem("accessToken", accessToken)
          try {
            const opts = {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + accessToken
              }
            }
            const userResponse = await fetch(baseEndpoint + "/users/me", opts)
            if (userResponse.ok) {
              const user = await userResponse.json()
              console.log("response of /users/me user", user)
              dispatch({
                type: SET_USER_INFO,
                payload: user
              })
            } else {
              console.log("error getting the user")
            }
          } catch (error) {
            console.log("error in trycatch", error)
          }
        } else {
          console.log("access token not created")
        }
      } else {
        console.log("-------error with getting a response ----------")
      }
    } catch (error) {
      console.log(error)
    }
  }
}

export const logoutUser = () => {
  return (dispatch) => {
    try {
      dispatch({
        type: "LOG_OUT_USER",
        payload: null
      })
      dispatch({
        type: "SET_CHAT_PARTICIPANT",
        payload: null
      })
      localStorage.removeItem("accessToken")
    } catch (error) {
      console.log(error)
    }
  }
}