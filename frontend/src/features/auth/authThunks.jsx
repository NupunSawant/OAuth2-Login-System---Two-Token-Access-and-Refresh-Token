import { createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../api/apiClient";
import { setToken, clearToken } from "../../utils/tokenStorage";

// LOGIN
export const loginThunk = createAsyncThunk(
	"auth/login",
	async ({ email, password }, thunkAPI) => {
		try {
			const { data } = await apiClient.post("/login", { email, password });

			const accessToken = data.accessToken || data.token;
			if (accessToken) setToken(accessToken);

			return {
				user: data.user || data,
				accessToken: accessToken || null,
			};
		} catch (err) {
			return thunkAPI.rejectWithValue(
				err?.response?.data?.message || "Login failed",
			);
		}
	},
);

// REGISTER
export const registerThunk = createAsyncThunk(
	"auth/register",
	async ({ name, email, password, role }, thunkAPI) => {
		try {
			const { data } = await apiClient.post("/register", {
				name,
				email,
				password,
				role,
			});

			const accessToken = data.accessToken || data.token;
			if (accessToken) setToken(accessToken);

			return {
				user: data.user || data,
				accessToken: accessToken || null,
			};
		} catch (err) {
			return thunkAPI.rejectWithValue(
				err?.response?.data?.message || "Registration Failed",
			);
		}
	},
);

// ME
export const meThunk = createAsyncThunk("auth/me", async (_, thunkAPI) => {
	try {
		const { data } = await apiClient.get("/me");
		return data;
	} catch (err) {
		return thunkAPI.rejectWithValue(
			err?.response?.data?.message || "Session expired",
		);
	}
});

// LOGOUT
export const logoutThunk = createAsyncThunk(
	"auth/logout",
	async (_, thunkAPI) => {
		try {
			await apiClient.post("/logout");
			clearToken();
			return true;
		} catch (err) {
			clearToken();
			return thunkAPI.rejectWithValue(
				err?.response?.data?.message || "Logout failed",
			);
		}
	},
);
