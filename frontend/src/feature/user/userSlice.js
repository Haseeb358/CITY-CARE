import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
const apiUrl = import.meta.env.VITE_API_URL;
const userRoute = import.meta.env.VITE_API_USER_ROUTE;

let registerUser = createAsyncThunk(
    "user/registerUser",
    async(useRouteLoaderData, thunkApi)=>{
        try {

            let link = `${apiUrl}${userRoute}/register`
            let response = await axios.post(link, useRouteLoaderData,
            );
            return response.data;

            
        } catch (error) {
            return thunkApi.rejectWithValue(error.response?.data || "An error occurred while registering the user.");
            
        }
    }
)

let loginUser = createAsyncThunk(
    "user/loginUser",
    async(useRouteLoaderData, thunkApi)=>{
        try {
            let link = `${apiUrl}${userRoute}/login-user`
            let response = await axios.post(link, useRouteLoaderData, { 
                headers: {
                    "Content-Type": "application/json"
                },
                withCredentials: true, // Include cookies in the request
                
             });
             console.log("Login response: ", response.data);
            return response.data;   
        } catch (error) {
            return thunkApi.rejectWithValue(error.response?.data || "An error occurred while logging in the user.");
        }
    }
)


let initialState = {
  user: null,
  loading: false,
  error: null,
  success: false,
  isAuthenticated: false,
  checkUserLoading:true,
};

let userSlice = createSlice({
  name: "user",
  initialState,
    reducers: {
    removeError(state){
         state.error = null; 

    },
    removeSuccess(state){
        state.success = false;
    },
    setUser(state,action){
        state.user = action.payload;
        state.isAuthenticated = true;
        state.checkUserLoading = false;
    },
    logout(state){
        state.user = null;
        state.isAuthenticated = false;
        state.checkUserLoading = false;
    },   

    },
     extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, actions) => {
        console.log("ac---------: ", actions);

        state.loading = false;
        state.error = null;
        state.user = actions.payload?.data || null;
        state.success = actions.payload?.success;
        state.isAuthenticated = false;
      })
      .addCase(registerUser.rejected, (state, actions) => {
        console.log("ac: ", actions);

        state.loading = false;
        state.error = actions.payload.message || "Some this went Wrong";
      });

    // Login
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, actions) => {
        state.loading = false;
        state.error = null;
        state.user = actions.payload?.data || null;
        state.success = actions.payload?.success;
        state.isAuthenticated = true;
        console.log("ss: ", state.isAuthenticated);
      })
      .addCase(loginUser.rejected, (state, actions) => {
        console.log("ac: ", actions);

        state.loading = false;
        state.error = actions.payload.message || "Some this went Wrong";
      });
  },
});

export const { removeError, removeSuccess, setAuthenticated,setUser,logout } = userSlice.actions;
export { registerUser, loginUser };
export default userSlice.reducer;