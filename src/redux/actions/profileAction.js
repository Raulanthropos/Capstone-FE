export const SET_USER_INFO = "SET_USER_INFO"
export const LOG_OUT_USER = "LOG_OUT_USER"
export const SET_ACCESS_TOKEN = "SET_ACCESS_TOKEN"
export const SET_AUTHENTICATED = "SET_AUTHENTICATED"
export const UPDATE_USER = "UPDATE_USER"
export const DELETE_USER = "DELETE_USER"

const baseEndpoint = "https://capstone-be-production-6735.up.railway.app"

export const setAccessToken = (accessToken) => ({
  type: SET_ACCESS_TOKEN,
  payload: accessToken
})

export const getAccessToken = (loggingInUser) => {
  console.log(baseEndpoint)
  return async (dispatch) => {
    const options = {
      method: "POST",
      body: JSON.stringify(loggingInUser),
      headers: {
        "Content-Type": "application/json"
      }
    }
    console.log("options", options)
    try {
      console.log("---------inside the getAccessToken action----------")
      const response = await fetch(baseEndpoint + "/users/login", options)
      if (response.ok) {
        const tokens = await response.json()
        const accessToken = await tokens.accessToken

        if (accessToken) {
          console.log("---------access token created----------")
          dispatch({
            type: SET_ACCESS_TOKEN,
            payload: accessToken
          })
          localStorage.setItem("accessToken", accessToken)
          dispatch({
            type: SET_AUTHENTICATED,
            payload: true
          })
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
        const errorResponse = await response.json()
        console.log("error logging in user", errorResponse.message)
      }
    } catch (error) {
      console.log(error)
    }
  }
}

export const logoutUser = (accessToken) => {

  return async (dispatch) => {
    try {
      const options = {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`
        }
      }
      const response = await fetch(baseEndpoint + "/users/session", options)
      console.log("response within logout", response)
      if (response.ok) {
        console.log("response is ok", response)
        dispatch({
          type: SET_USER_INFO,
          payload: null
        })
        dispatch({
          type: SET_AUTHENTICATED,
          payload: false
        })
        dispatch({
          type: SET_ACCESS_TOKEN,
          payload: null
        })
        localStorage.removeItem("accessToken")
        console.log("logged out successfully")
      } else {
        console.log("error logging out")
      }
    } catch (error) {
      console.log(error)
    }
  }
}

export  const updateUser = (user) => {
  return async (dispatch) => {
    const opts = {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: JSON.stringify({
          name: user.name,
          surname: user.surname,
          email: user.email,
          description: user.description,
          picture: user.picture,
        })
      }
  try {
    const response = await fetch(baseEndpoint + `/users/${user._id}`, opts);

    if (response.ok) {
      const updatedUser = await response.json();
      console.log('updatedUser', updatedUser);
      dispatch({
        type: UPDATE_USER,
        payload: updatedUser
      });
    } else {
      console.log('Error updating user');
    }
  } catch (error) {
    console.log(error);
  }
};
}

export const deleteUser = (accessToken, user) => {
  return async (dispatch) => {
    const options = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`
      }
    }
    try {
      console.log("---------inside delete action----------")
      const response = await fetch(`http://localhost:3001/users/${user._id}`, options)
      if (response.ok) {
        const deletedUser = await response.json()
        console.log("The user was deleted", deletedUser)
        dispatch({
          type: SET_AUTHENTICATED,
          payload: false
        })
        dispatch({
          type: DELETE_USER,
          payload: null
        })
      } else {
        console.log("error deleting user")
      }
    } catch (error) {
      console.log(error)
    }
  }
}

    /* 
    
     try {
      const response = await fetch(baseEndpoint + `/users/me/username`, opts)
      if (response.ok) {
        const updated = await response.json()
        console.log("updatedUsername", updated)
        const userName = updated.username
        dispatch({
          type: UPDATE_USER_USERNAME,
          payload: userName
        })
      }
    } catch (error) {
      console.log(error)
    }
  }
}
    
    */


// export const getAccessToken = (loggingInAuthor) => {
//     return async (dispatch) => {
//       const { email, password } = loggingInAuthor;
//       const options = {
//         method: "POST",
//         body: JSON.stringify({ email, password }),
//         headers: {
//           "Content-Type": "application/json"
//         }
//       }
//       try {
//         console.log("---------inside the getAccessToken action----------")
//         const response = await fetch(baseEndpoint + "/users/login", options)
//         console.log("response - 1", response)
//         if (response.ok) {
//           console.log("response", response)
//           const tokens = await response.json()
//           const accessToken = await tokens.accessToken
//           console.log("dispatching accessToken", accessToken)
  
//           if (accessToken) {
//             dispatch({
//               type: SET_ACCESS_TOKEN,
//               payload: accessToken
//             })
//             localStorage.setItem("accessToken", accessToken)
//             try {
//               const opts = {
//                 method: "GET",
//                 headers: {
//                   "Content-Type": "application/json",
//                   Authorization: "Bearer " + accessToken
//                 }
//               }
//               const userResponse = await fetch(baseEndpoint + "/users/me", opts)
//               if (userResponse.ok) {
//                 const user = await userResponse.json()
//                 console.log("response of /users/me user", user)
//                 dispatch({
//                   type: SET_USER_INFO,
//                   payload: user
//                 })
//                 dispatch({
//                   type: SET_AUTHENTICATED,
//                   payload: true
//                 });
//               } else {
//                 console.log("error getting the user")
//               }
//             } catch (error) {
//               console.log("error in trycatch", error)
//             }
//           } else {
//             console.log("access token not created")
//           }
//         } else {
//           console.log("-------error with getting a response ----------")
//         }
//       } catch (error) {
//         console.log(error)
//       }
//     }
//   }