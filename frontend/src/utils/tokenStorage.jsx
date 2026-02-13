const ACCESS_TOKEN_KEY = "accessToken";

// Get Token from LocalStorage

export const getToken = () => {
	return localStorage.getItem(ACCESS_TOKEN_KEY);
};

// Save Access token to localStorage

export const setToken = (token) => {
	if (!token) return;
	localStorage.setItem(ACCESS_TOKEN_KEY, token);
};

// Remove access Token from localStorage

export const clearToken = () => {
	localStorage.removeItem(ACCESS_TOKEN_KEY);
};
