import axiosCustomize from "@/service/axios.customize";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentUser: null,
};

export const LoginUserAPIs = createAsyncThunk(
  "user/login",
  async (userData: any) => {
    const result = await axiosCustomize.post("api/v1/login", userData);
    return result.data
  }
);

export const logoutUserAPIs = createAsyncThunk("user/logout", async () => {
  const result = await axiosCustomize.delete("api/v1/logout");
  return result.data
});

export const updateUserAPIs = createAsyncThunk("user/update", async (userData: any) => {
  return await axiosCustomize.put("/users/update", userData);
});

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(LoginUserAPIs.fulfilled, (state, action) => {
      state.currentUser = action.payload;
    });
    builder.addCase(logoutUserAPIs.fulfilled, (state, action) => {
      state.currentUser = null;
    });
    builder.addCase(updateUserAPIs.fulfilled, (state, action) => {
      state.currentUser = action.payload;
    });
  },
});

export const selectCurrentUser = (state: any) => state.user.currentUser;

export const userReducer = userSlice.reducer;
