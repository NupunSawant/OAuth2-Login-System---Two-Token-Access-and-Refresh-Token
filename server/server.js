	import express from "express";
	import dotenv from "dotenv";
	import cors from "cors";
	import cookieParser from "cookie-parser";
	import connectDB from "./config/db.js";
	import userRoutes from "./routes/userRoutes.js";
	import { notFound, errorHandler } from "./middlewares/errorMiddleware.js";

	dotenv.config();
	connectDB();

	const app = express();

	app.use(express.json());
	app.use(cookieParser());

	app.use(
		cors({
			origin: ["http://localhost:3000","http://localhost:5173"],
			credentials: true,
			methods:['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
			allowedHeaders: ['Content-Type','Authorization']
		}),
	);

	app.get("/", (req, res) => {
	res.send("API running");
	});

	app.use("/api/auth", userRoutes);

	app.use(notFound);
	app.use(errorHandler);


	const PORT = process.env.PORT || 5000;

	app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
