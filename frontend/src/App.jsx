import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useDispatch } from "react-redux";
import { meThunk } from "./features/auth/authThunks";
import { getToken } from "./utils/tokenStorage";

import ProtectedRoute from "./routes/ProtectedRoute";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";

function App() {
	const dispatch = useDispatch();

	useEffect(() => {
		const token = getToken();
		if (token) {
			dispatch(meThunk());
		}
	}, [dispatch]);

	return (
		<Router>
			<Routes>
				<Route path='/login' element={<Login />} />
				<Route path='/register' element={<Register />} />

				<Route
					path='/home'
					element={
						<ProtectedRoute>
							<Home />
						</ProtectedRoute>
					}
				/>

				<Route path='*' element={<Login />} />
			</Routes>
		</Router>
	);
}

export default App;
