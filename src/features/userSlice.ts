import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

// =============================
// 🔹 User Interface
// =============================
interface UserState {
  name: string;
  email: string;
  profile_image: string;
  token: string | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: UserState = {
  name: "",
  email: "",
  profile_image: "",
  token: localStorage.getItem("token"),
  status: "idle",
  error: null,
};

// =============================
// 🔹 Login API
// =============================
// export const loginUserAsync = createAsyncThunk(
//   "user/loginUser",
//   async (
//     credentials: { email: string; password: string },
//     { rejectWithValue }
//   ) => {
//     try {
//       const res = await axios.post(
//         import.meta.env.VITE_API_BASE_URL+"/login",
//         credentials
//       );
//       console.log(res.data.data.user);
//       const { token, user } = res.data.data; // expecting { token, user: { name, email } }

//       // ✅ Store token locally
//       localStorage.setItem("token", token);

//       return { token, user };
//     } catch (err: any) {
//        return rejectWithValue({
//         message: err.response?.data?.message || "Login failed",
//         errors: err.response?.data?.errors || {},
//       });
//     }
//   }
// );

// =============================
// 🔹 Fetch Logged-In User API
// =============================
export const fetchUserAsync = createAsyncThunk(
  "user/fetchUser",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(import.meta.env.VITE_API_BASE_URL+"/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data.user; // expect { name, email }
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to load user"
      );
    }
  }
);

// =============================
// 🔹 Update User API
// =============================
// export const updateUserAsync = createAsyncThunk(
//   "user/updateUser",
//   async (userData: { name: string; email: string }, { rejectWithValue }) => {
//     try {
//       const token = localStorage.getItem("token");
//       const res = await axios.post(
//         import.meta.env.VITE_API_BASE_URL+"/user-update",
//         userData,
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );
//       return res.data.user; // updated user
//     } catch (err: any) {
//       return rejectWithValue(
//         err.response?.data?.message || "Failed to update user"
//       );
//     }
//   }
// );

// =============================
// 🔹 Slice
// =============================
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
     setUser: (state, action: PayloadAction<{ name: string; email: string; token: string }>) => {
      state.name = action.payload.name;
      state.email = action.payload.email;
      state.profile_image = action.payload.email;
      state.token = action.payload.token;
      localStorage.setItem("token", action.payload.token);
    },

    // ✅ Logout
    logout: (state) => {
      state.name = "";
      state.email = "";
      state.profile_image = "";
      state.token = null;
      localStorage.removeItem("token");
    },
  },

  extraReducers: (builder) => {
    builder
      // ✅ Login
      // .addCase(loginUserAsync.pending, (state) => {
      //   state.status = "loading";
      // })
      // .addCase(loginUserAsync.fulfilled, (state, action) => {
      //   state.status = "succeeded";
      //   state.token = action.payload.token;
      //   state.name = action.payload.user.name;
      //   state.email = action.payload.user.email;
      // })
      // .addCase(loginUserAsync.rejected, (state, action) => {
      //   state.status = "failed";
      //   state.error = action.payload as string;
      // })

      // ✅ Fetch user
      .addCase(fetchUserAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchUserAsync.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.name = action.payload.name;
        state.profile_image = action.payload.profile_image;
        state.email = action.payload.email;
      })
      .addCase(fetchUserAsync.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })

      // ✅ Update user
      // .addCase(updateUserAsync.pending, (state) => {
      //   state.status = "loading";
      // })
      // .addCase(updateUserAsync.fulfilled, (state, action) => {
      //   state.status = "succeeded";
      //   state.name = action.payload.name;
      //   state.email = action.payload.email;
      // })
      // .addCase(updateUserAsync.rejected, (state, action) => {
      //   state.status = "failed";
      //   state.error = action.payload as string;
      // });
  },
});

// =============================
// 🔹 Exports
// =============================
export const { setUser, logout } = userSlice.actions;
export default userSlice.reducer;
