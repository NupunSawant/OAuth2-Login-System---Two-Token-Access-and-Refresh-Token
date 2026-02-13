import { createSlice } from "@reduxjs/toolkit";
import { getToken } from "../../utils/tokenStorage";
import { loginThunk, logoutThunk, meThunk, registerThunk } from "./authThunks";

const initialState = {
	user: null,
	accessToken: getToken(),
	loading: false,
	error: null,
	initialized: false,
};

const authSlice = createSlice({
	name: "auth",
	initialState,
	reducers: {
		setAccessToken: (state, action) => {
			state.accessToken = action.payload;
		},
		setUser: (state, action) => {
			state.user = action.payload;
		},

		clearError: (state) => {
			state.error = null;
		},

		clearAuth: (state) => {
			state.user = null;
			state.accessToken = null;
			state.loading = false;
			state.error = null;
			state.initialized = true;
		},
	},

	extraReducers: (builder) => {
		// Login

		builder
			.addCase(loginThunk.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(loginThunk.fulfilled, (state, action) => {
				state.loading = false;
				state.error = null;
				state.user = action.payload.user;
				state.accessToken = action.payload.accessToken || state.accessToken;
			})
			.addCase(loginThunk.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload || "Login Failed";
			});

		// Register

		builder
			.addCase(registerThunk.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(registerThunk.fulfilled, (state, action) => {
				state.loading = false;
				state.error = null;
				state.user = action.payload.user;
				state.accessToken = action.payload.accessToken || state.accessToken;
			})
			.addCase(registerThunk.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload || "Registration failed";
			});

		// Me (Restore Session)
		builder
		.addCase(meThunk.pending, (state) => {
			state.loading = true;
			state.error = null;
		})
		.addCase(meThunk.fulfilled, (state, action) => {
			state.loading = false;         
			state.error = null;
			state.user = action.payload;    
			state.initialized = true;
		})
		.addCase(meThunk.rejected, (state, action) => {
			state.loading = false;          
			state.error = action.payload || "Session expired";
			state.user = null;            
			state.initialized = true;
		});


		// Logout
		builder
			.addCase(logoutThunk.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(logoutThunk.fulfilled, (state) => {
				state.loading = false;
				state.error = null;
				state.user = null;
				state.accessToken = null;
			})
			.addCase(logoutThunk.rejected, (state, action) => {
				state.loading = false;
				state.user = null;
				state.accessToken = null;
				state.error = action.payload || null;
			});
	},
});

export const { setAccessToken, setUser, clearError, clearAuth } =
	authSlice.actions;

export default authSlice.reducer;
