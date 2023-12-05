import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

interface AuthState {
  username: string;
  user_type: string;
  isLoading: boolean;
  error: string | null;
  token: string;
}

const initialState: AuthState = {
  username: "",
  user_type: "",
  isLoading: false,
  error: null,
  token: "",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(signIn.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(signIn.fulfilled, (state, action: PayloadAction<any>) => {
      state.isLoading = false;
      state.token = action.payload;
    });
    builder.addCase(signIn.rejected, (state, action: PayloadAction<any>) => {
      state.isLoading = false;
      state.error = action.payload;
    });
  },
});

export const signIn = createAsyncThunk(
  "auth/signIn",
  async ({ username, password }: { username: string; password: string }) => {
    try {
      const response = await axios.post("http://127.0.0.1:8000/login/user/", {
        username: username,
        password: password,
      });
      const token = response.data.jwt;

      if (token) {
        const parts = token.split(".");

        if (parts.length === 3) {
          try {
            const payload = JSON.parse(atob(parts[1]));
            return payload;
          } catch (error) {
            console.error("Error decoding JWT:", error);
            throw new Error("Invalid JWT format");
          }
        } else {
          console.error("Invalid JWT format");
          throw new Error("Invalid JWT format");
        }
      } else {
        console.error("JWT token not found");
        throw new Error("JWT token not found");
      }
    } catch (error) {
      console.error("Error during sign-in:", error);
      throw error;
    }
  }
);

export const selectUser = (state: { auth: AuthState }) => state.auth;

export default authSlice.reducer;
