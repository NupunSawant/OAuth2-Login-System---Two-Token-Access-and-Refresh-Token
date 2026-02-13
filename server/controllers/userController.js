import asyncHandler from "express-async-handler";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import {
	generateAccessToken,
	generateRefreshToken,
} from "../utils/generateToken.js";

// Hashing Refresh Token before saving it
const hashToken = (token) =>
	crypto.createHash("sha256").update(token).digest("hex");

const setRefreshCookie = (res, refreshToken) => {
	res.cookie("refreshToken", refreshToken, {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		sameSite: "strict",
		path: "/api/users/refresh",
		maxAge: 7 * 24 * 60 * 60 * 1000,
	});
};

// @desc    Register user
//@rotue    POST /api/users
//@access   Public
export const registerUser = asyncHandler(async (req, res) => {
	const { name, email, password } = req.body;

	const userExists = await User.findOne({ email });
	if (userExists) {
		res.status(400);
		throw new Error("User Already exists");
	}

	const user = await User.create({ name, email, password });

	const accessToken = generateAccessToken(user._id);
	const refreshToken = generateRefreshToken(user._id);

	user.refreshTokenHash = hashToken(refreshToken);
	await user.save();

	setRefreshCookie(res, refreshToken);

	res.status(201).json({
		_id: user._id,
		name: user.name,
		email: user.email,
		accessToken,
	});
});

// @desc    Auth user & get tokens
// @route   POST /api/users/auth
// @access  Public
export const authUser = asyncHandler(async (req, res) => {
	const { email, password } = req.body;

	const user = await User.findOne({ email });
	if (!user || !(await user.matchPassword(password))) {
		res.status(401);
		throw new Error("Invalid email or Password");
	}

	const accessToken = generateAccessToken(user._id);
	const refreshToken = generateRefreshToken(user._id);

	user.refreshTokenHash = hashToken(refreshToken);
	await user.save();

	setRefreshCookie(res, refreshToken);

	res.json({
		_id: user._id,
		name: user.email,
		email: user.email,
		accessToken,
	});
});

// @desc    Refresh access token using refresh token cookie
// @route   POST /api/users/refresh
// @access  Public (cookie-based)
export const refreshAccessToken = asyncHandler(async (req, res) => {
	const token = req.cookies?.refreshToken;
	if (!token) {
		res.status(401);
		throw new Error("No Refresh Token");
	}

	let decoded;
	try {
		decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
	} catch (err) {
		res.status(401);
		throw new Error("Invalid Refresh Token");
	}

	const user = await User.findById(decoded.id);
	if (!user || !user.refreshTokenHash) {
		res.status(401);
		throw new Error("Refresh token not recognized");
	}

	const incomingHash = hashToken(token);
	if (incomingHash !== user.refreshTokenHash) {
		res.status(401);
		throw new Error("Refresh token mismatch");
	}

	// Rotate refresh token
	const newAccessToken = generateAccessToken(user._id);
	const newRefreshToken = generateRefreshToken(user._id);

	user.refreshTokenHash = hashToken(newRefreshToken);
	await user.save();

	setRefreshCookie(res, newRefreshToken);

	res.json({ accessToken: newAccessToken });
});

// @desc    Logout user (clear cookie + revoke refresh token)
// @route   POST /api/users/logout
// @access  Private-ish (cookie)

export const logoutUser = asyncHandler(async (req, res) => {
	const token = req.cookies?.refreshToken;

	if (token) {
		try {
			const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
			const user = await User.findById(decoded.id);
			if (user) {
				user.refreshTokenHash = null;
				await user.save();
			}
		} catch (e) {}
	}
	res.cookie("refreshToken", "", {
		httpOnly: true,
		expires: new Date(0),
		path: "/api/users/refresh",
	});

	res.json({ message: "Logged Out " });
});

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private (access token)
export const getUserProfile = asyncHandler(async (req, res) => {
	const user = await User.findById(req, user._id).select(
		"-password -refreshTokenHash",
	);
	if (!user) {
		res.status(404);
		throw new Error("User not found");
	}
	res.json(user);
});
