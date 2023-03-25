export const SET_USER_INFO = "SET_USER_INFO"
export const LOG_OUT_USER = "LOG_OUT_USER"
export const SET_ACCESS_TOKEN = "SET_ACCESS_TOKEN"
export const SET_AUTHENTICATED = "SET_AUTHENTICATED"

const baseEndpoint = "http://localhost:3001"

export const setAccessToken = (accessToken) => ({
  type: SET_ACCESS_TOKEN,
  payload: accessToken
})

export const getAccessToken = (email, password, userId) => {
  return async (dispatch) => {

    try {
      const response = await fetch(baseEndpoint + "/users/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
        headers: {
          "Content-Type": "application/json"
        }
      });

      if (response.ok) {
        const tokens = await response.json()
        const accessToken = tokens.accessToken

        dispatch(setAccessToken(accessToken))

        localStorage.setItem("accessToken", accessToken)

        const userResponse = await fetch(baseEndpoint + "/users/" + userId, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + accessToken
          }
        });

        if (userResponse.ok) {
          const user = await userResponse.json()
          dispatch({
            type: SET_USER_INFO,
            payload: user
          });

          dispatch({
            type: SET_AUTHENTICATED,
            payload: true
          });
        } else {
          throw new Error("Error getting user info");
        }
      } else {
        throw new Error("Error logging in");
      }
    } catch (error) {
      console.log(error);
    }
  };
};

export const logoutUser = () => {
  return (dispatch) => {
    try {
      dispatch({
        type: "LOG_OUT_USER",
        payload: null
      })
      localStorage.removeItem("accessToken")
    } catch (error) {
      console.log(error)
    }
  }
}






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