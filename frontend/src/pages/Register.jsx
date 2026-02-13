import React, { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { registerThunk } from "../features/auth/authThunks";
import { clearError } from "../features/auth/authSlice";

const Register = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const { user, loading, error } = useSelector((state) => state.auth);

	const [showPass, setShowPass] = useState(false);
	const [showConfirm, setShowConfirm] = useState(false);

	const [touched, setTouched] = useState({
		name: false,
		email: false,
		password: false,
		confirm: false,
	});

	const [formData, setFormData] = useState({
		name: "",
		email: "",
		password: "",
		confirmPassword: "",
		role: "student",
	});

	const { name, email, password, confirmPassword, role } = formData;

	const nameValid = useMemo(() => name.trim().length >= 2, [name]);

	const emailValid = useMemo(() => {
		if (!email) return false;
		return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
	}, [email]);

	const passValid = useMemo(() => password.length >= 6, [password]);

	const confirmValid = useMemo(
		() => confirmPassword.length >= 6 && confirmPassword === password,
		[confirmPassword, password],
	);

	const canSubmit =
		nameValid && emailValid && passValid && confirmValid && !loading;

	const handleChange = (e) => {
		setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
	};

	const setRole = (r) => setFormData((p) => ({ ...p, role: r }));

	const handleSubmit = (e) => {
		e.preventDefault();
		dispatch(registerThunk({ name, email, password, role }));
	};

	// Registration Successful
	useEffect(() => {
		if (user) navigate("/home");
	}, [user, navigate]);

	// Clear error when leaving page
	useEffect(() => {
		return () => dispatch(clearError());
	}, [dispatch]);

	// Inject tiny keyframes (no CSS file needed)
	useEffect(() => {
		const id = "register-ui-keyframes";
		if (document.getElementById(id)) return;
		const style = document.createElement("style");
		style.id = id;
		style.innerHTML = `
      @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      @keyframes pop { 0% { transform: translateY(4px); opacity: 0; } 100% { transform: translateY(0); opacity: 1; } }
      @media (max-width: 860px) { ._grid2 { grid-template-columns: 1fr !important; } }
    `;
		document.head.appendChild(style);
	}, []);

	return (
		<div style={styles.page}>
			<div style={styles.shell} className='_grid2'>
				{/* Left side */}
				<div style={styles.left}>
					<div style={styles.logoRow}>
						<div style={styles.logoDot} />
						<div>
							<div style={styles.brand}>Secure Auth</div>
							<div style={styles.tagline}>
								Create your account (student / teacher)
							</div>
						</div>
					</div>

					<div style={styles.featureBox}>
						<div style={styles.featureTitle}>Why register?</div>
						<ul style={styles.ul}>
							<li style={styles.li}>Access protected dashboard</li>
							<li style={styles.li}>Role-based UI ready</li>
							<li style={styles.li}>Refresh-token session handling</li>
						</ul>
					</div>

					<div style={styles.noteBox}>
						<div style={styles.noteTitle}>Password rule</div>
						<div style={styles.noteText}>Minimum 6 characters.</div>
					</div>
				</div>

				{/* Right side - form */}
				<div style={styles.card}>
					<div style={styles.cardHeader}>
						<div style={styles.h1}>Create account</div>
						<div style={styles.h2}>Fill your details to continue</div>
					</div>

					{error && (
						<div style={styles.errorBox} role='alert'>
							<div style={styles.errorTitle}>Registration failed</div>
							<div style={styles.errorText}>{error}</div>
						</div>
					)}

					<form onSubmit={handleSubmit} style={styles.form}>
						{/* Name */}
						<label style={styles.label}>
							Name
							<div
								style={{
									...styles.inputWrap,
									...(touched.name && !nameValid ? styles.inputWrapBad : {}),
								}}
							>
								<span style={styles.icon}>
									<UserIcon />
								</span>
								<input
									style={styles.input}
									type='text'
									name='name'
									placeholder='Your full name'
									value={name}
									onChange={handleChange}
									onBlur={() => setTouched((p) => ({ ...p, name: true }))}
									autoComplete='name'
									required
								/>
							</div>
							{touched.name && !nameValid && (
								<div style={styles.helpBad}>
									Name must be at least 2 characters.
								</div>
							)}
						</label>

						{/* Email */}
						<label style={styles.label}>
							Email
							<div
								style={{
									...styles.inputWrap,
									...(touched.email && !emailValid ? styles.inputWrapBad : {}),
								}}
							>
								<span style={styles.icon}>
									<MailIcon />
								</span>
								<input
									style={styles.input}
									type='email'
									name='email'
									placeholder='you@example.com'
									value={email}
									onChange={handleChange}
									onBlur={() => setTouched((p) => ({ ...p, email: true }))}
									autoComplete='email'
									required
								/>
							</div>
							{touched.email && !emailValid && (
								<div style={styles.helpBad}>Enter a valid email address.</div>
							)}
						</label>

						{/* Role pills */}
						<div style={styles.roleBlock}>
							<div style={styles.roleLabel}>Role</div>
							<div style={styles.roleRow}>
								<button
									type='button'
									onClick={() => setRole("student")}
									style={{
										...styles.rolePill,
										...(role === "student" ? styles.rolePillActive : {}),
									}}
								>
									Student
								</button>
								<button
									type='button'
									onClick={() => setRole("teacher")}
									style={{
										...styles.rolePill,
										...(role === "teacher" ? styles.rolePillActive : {}),
									}}
								>
									Teacher
								</button>
							</div>
							<input type='hidden' name='role' value={role} readOnly />
						</div>

						{/* Password */}
						<label style={styles.label}>
							Password
							<div
								style={{
									...styles.inputWrap,
									...(touched.password && !passValid
										? styles.inputWrapBad
										: {}),
								}}
							>
								<span style={styles.icon}>
									<LockIcon />
								</span>
								<input
									style={styles.input}
									type={showPass ? "text" : "password"}
									name='password'
									placeholder='••••••••'
									value={password}
									onChange={handleChange}
									onBlur={() => setTouched((p) => ({ ...p, password: true }))}
									autoComplete='new-password'
									required
								/>
								<button
									type='button'
									onClick={() => setShowPass((s) => !s)}
									style={styles.eyeBtn}
									aria-label={showPass ? "Hide password" : "Show password"}
								>
									{showPass ? <EyeOffIcon /> : <EyeIcon />}
								</button>
							</div>
							{touched.password && !passValid && (
								<div style={styles.helpBad}>
									Password must be at least 6 characters.
								</div>
							)}
						</label>

						{/* Confirm */}
						<label style={styles.label}>
							Confirm Password
							<div
								style={{
									...styles.inputWrap,
									...(touched.confirm && !confirmValid
										? styles.inputWrapBad
										: {}),
								}}
							>
								<span style={styles.icon}>
									<LockIcon />
								</span>
								<input
									style={styles.input}
									type={showConfirm ? "text" : "password"}
									name='confirmPassword'
									placeholder='••••••••'
									value={confirmPassword}
									onChange={handleChange}
									onBlur={() => setTouched((p) => ({ ...p, confirm: true }))}
									autoComplete='new-password'
									required
								/>
								<button
									type='button'
									onClick={() => setShowConfirm((s) => !s)}
									style={styles.eyeBtn}
									aria-label={
										showConfirm
											? "Hide confirm password"
											: "Show confirm password"
									}
								>
									{showConfirm ? <EyeOffIcon /> : <EyeIcon />}
								</button>
							</div>
							{touched.confirm && !confirmValid && (
								<div style={styles.helpBad}>Passwords must match.</div>
							)}
						</label>

						<button
							type='submit'
							disabled={!canSubmit}
							style={{
								...styles.submitBtn,
								...(!canSubmit ? styles.btnDisabled : {}),
							}}
						>
							{loading ? (
								<span style={styles.inline}>
									<span style={styles.spinner} /> Registering…
								</span>
							) : (
								"Register"
							)}
						</button>

						<div style={styles.bottomRow}>
							<span style={styles.smallText}>
								Already have an account?{" "}
								<Link to='/login' style={styles.link}>
									Login
								</Link>
							</span>

							<button
								type='button'
								onClick={() => navigate("/login")}
								style={styles.ghostBtn}
							>
								Back
							</button>
						</div>
					</form>

					<div style={styles.footerNote}>
						By creating an account, you’ll stay logged in via refresh cookie.
					</div>
				</div>
			</div>
		</div>
	);
};

/* Icons (no libs) */
const UserIcon = () => (
	<svg width='18' height='18' viewBox='0 0 24 24' fill='none'>
		<path
			d='M20 21a8 8 0 1 0-16 0'
			stroke='currentColor'
			strokeWidth='1.7'
			strokeLinecap='round'
		/>
		<path
			d='M12 12a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9Z'
			stroke='currentColor'
			strokeWidth='1.7'
		/>
	</svg>
);

const MailIcon = () => (
	<svg width='18' height='18' viewBox='0 0 24 24' fill='none'>
		<path
			d='M4 7.5A2.5 2.5 0 0 1 6.5 5h11A2.5 2.5 0 0 1 20 7.5v9A2.5 2.5 0 0 1 17.5 19h-11A2.5 2.5 0 0 1 4 16.5v-9Z'
			stroke='currentColor'
			strokeWidth='1.7'
		/>
		<path
			d='M6.5 7.5 12 12l5.5-4.5'
			stroke='currentColor'
			strokeWidth='1.7'
			strokeLinecap='round'
			strokeLinejoin='round'
		/>
	</svg>
);

const LockIcon = () => (
	<svg width='18' height='18' viewBox='0 0 24 24' fill='none'>
		<path
			d='M7 11V8.5A5 5 0 0 1 12 3.5a5 5 0 0 1 5 5V11'
			stroke='currentColor'
			strokeWidth='1.7'
			strokeLinecap='round'
		/>
		<path
			d='M6.5 11h11A2.5 2.5 0 0 1 20 13.5v5A2.5 2.5 0 0 1 17.5 21h-11A2.5 2.5 0 0 1 4 18.5v-5A2.5 2.5 0 0 1 6.5 11Z'
			stroke='currentColor'
			strokeWidth='1.7'
		/>
	</svg>
);

const EyeIcon = () => (
	<svg width='18' height='18' viewBox='0 0 24 24' fill='none'>
		<path
			d='M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z'
			stroke='currentColor'
			strokeWidth='1.7'
			strokeLinejoin='round'
		/>
		<path
			d='M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z'
			stroke='currentColor'
			strokeWidth='1.7'
		/>
	</svg>
);

const EyeOffIcon = () => (
	<svg width='18' height='18' viewBox='0 0 24 24' fill='none'>
		<path
			d='M3 4.5 21 19.5'
			stroke='currentColor'
			strokeWidth='1.7'
			strokeLinecap='round'
		/>
		<path
			d='M6.5 6.8C4 8.7 2 12 2 12s3.5 7 10 7c2.1 0 3.9-.6 5.4-1.4'
			stroke='currentColor'
			strokeWidth='1.7'
			strokeLinecap='round'
		/>
		<path
			d='M9.2 5.4A10.7 10.7 0 0 1 12 5c6.5 0 10 7 10 7a17.8 17.8 0 0 1-3 4.3'
			stroke='currentColor'
			strokeWidth='1.7'
			strokeLinecap='round'
		/>
	</svg>
);

const styles = {
	page: {
		minHeight: "100vh",
		display: "grid",
		placeItems: "center",
		padding: "22px",
		background:
			"radial-gradient(1200px 600px at 15% 10%, #e9f0ff 0%, transparent 55%), radial-gradient(900px 500px at 90% 10%, #f5eaff 0%, transparent 55%), linear-gradient(180deg, #f7f8fc 0%, #ffffff 45%, #f7f8fc 100%)",
		fontFamily:
			'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial',
		color: "#111827",
	},

	shell: {
		width: "100%",
		maxWidth: "980px",
		display: "grid",
		gridTemplateColumns: "1fr 1fr",
		gap: "16px",
		alignItems: "stretch",
	},

	left: {
		borderRadius: "18px",
		padding: "22px",
		border: "1px solid rgba(17,24,39,0.08)",
		background: "rgba(255,255,255,0.65)",
		backdropFilter: "blur(10px)",
		boxShadow: "0 18px 45px rgba(17,24,39,0.06)",
		display: "flex",
		flexDirection: "column",
		justifyContent: "space-between",
	},

	logoRow: { display: "flex", alignItems: "center", gap: "12px" },
	logoDot: {
		width: "12px",
		height: "12px",
		borderRadius: "999px",
		background: "linear-gradient(135deg, #3b82f6, #a855f7)",
		boxShadow: "0 8px 18px rgba(59,130,246,0.35)",
	},
	brand: { fontSize: "18px", fontWeight: 900, letterSpacing: "0.2px" },
	tagline: { marginTop: "2px", fontSize: "13px", color: "rgba(17,24,39,0.65)" },

	featureBox: {
		marginTop: "18px",
		borderRadius: "16px",
		padding: "14px",
		border: "1px solid rgba(17,24,39,0.10)",
		background: "rgba(255,255,255,0.85)",
	},
	featureTitle: { fontSize: "12px", fontWeight: 900, marginBottom: "8px" },
	ul: { margin: 0, paddingLeft: "18px", color: "rgba(17,24,39,0.75)" },
	li: { marginBottom: "6px", fontSize: "13px" },

	noteBox: {
		marginTop: "14px",
		borderRadius: "16px",
		padding: "14px",
		border: "1px solid rgba(17,24,39,0.10)",
		background: "rgba(255,255,255,0.85)",
	},
	noteTitle: { fontSize: "12px", fontWeight: 900, marginBottom: "6px" },
	noteText: { fontSize: "13px", color: "rgba(17,24,39,0.75)" },

	card: {
		borderRadius: "18px",
		padding: "22px",
		border: "1px solid rgba(17,24,39,0.08)",
		background: "rgba(255,255,255,0.85)",
		backdropFilter: "blur(10px)",
		boxShadow: "0 18px 45px rgba(17,24,39,0.08)",
		overflow: "hidden",
		animation: "pop 220ms ease-out",
	},

	cardHeader: { marginBottom: "14px" },
	h1: { fontSize: "22px", fontWeight: 900 },
	h2: { fontSize: "13px", color: "rgba(17,24,39,0.65)", marginTop: "4px" },

	errorBox: {
		borderRadius: "14px",
		border: "1px solid rgba(239, 68, 68, 0.25)",
		background: "rgba(239, 68, 68, 0.08)",
		padding: "12px 12px",
		marginBottom: "14px",
	},
	errorTitle: { fontWeight: 900, fontSize: "12px", marginBottom: "4px" },
	errorText: { fontSize: "13px", color: "rgba(17,24,39,0.85)" },

	form: { display: "flex", flexDirection: "column", gap: "12px" },
	label: { fontSize: "12px", fontWeight: 800, textAlign: "left" },

	inputWrap: {
		marginTop: "6px",
		display: "flex",
		alignItems: "center",
		gap: "10px",
		padding: "10px 12px",
		borderRadius: "14px",
		border: "1px solid rgba(17,24,39,0.12)",
		background: "rgba(255,255,255,0.95)",
		boxShadow: "0 10px 22px rgba(17,24,39,0.05)",
	},
	inputWrapBad: {
		border: "1px solid rgba(239, 68, 68, 0.35)",
		boxShadow: "0 10px 22px rgba(239, 68, 68, 0.08)",
	},

	icon: { display: "grid", placeItems: "center", color: "rgba(17,24,39,0.65)" },
	input: {
		flex: 1,
		border: "none",
		outline: "none",
		fontSize: "14px",
		background: "transparent",
	},

	eyeBtn: {
		border: "none",
		background: "transparent",
		cursor: "pointer",
		color: "rgba(17,24,39,0.65)",
		display: "grid",
		placeItems: "center",
		padding: "4px",
		borderRadius: "10px",
	},

	helpBad: {
		marginTop: "6px",
		fontSize: "12px",
		color: "rgba(239, 68, 68, 0.95)",
	},

	roleBlock: { marginTop: "4px" },
	roleLabel: { fontSize: "12px", fontWeight: 900, marginBottom: "6px" },
	roleRow: { display: "flex", gap: "10px" },
	rolePill: {
		flex: 1,
		padding: "10px 12px",
		borderRadius: "14px",
		border: "1px solid rgba(17,24,39,0.12)",
		background: "rgba(255,255,255,0.95)",
		cursor: "pointer",
		fontWeight: 900,
	},
	rolePillActive: {
		border: "1px solid rgba(59,130,246,0.35)",
		background:
			"linear-gradient(135deg, rgba(59,130,246,0.18), rgba(168,85,247,0.18))",
	},

	submitBtn: {
		marginTop: "2px",
		padding: "12px 14px",
		borderRadius: "14px",
		border: "1px solid rgba(59,130,246,0.35)",
		background:
			"linear-gradient(135deg, rgba(59,130,246,0.20), rgba(168,85,247,0.20))",
		cursor: "pointer",
		fontWeight: 900,
		fontSize: "14px",
		boxShadow: "0 18px 30px rgba(17,24,39,0.08)",
	},
	btnDisabled: { opacity: 0.6, cursor: "not-allowed" },

	inline: {
		display: "inline-flex",
		alignItems: "center",
		gap: "10px",
		justifyContent: "center",
	},
	spinner: {
		width: "14px",
		height: "14px",
		borderRadius: "999px",
		border: "2px solid rgba(17,24,39,0.18)",
		borderTop: "2px solid rgba(17,24,39,0.65)",
		animation: "spin 0.8s linear infinite",
	},

	bottomRow: {
		marginTop: "8px",
		display: "flex",
		justifyContent: "space-between",
		alignItems: "center",
		gap: "12px",
	},
	smallText: { fontSize: "13px", color: "rgba(17,24,39,0.75)" },
	link: { fontWeight: 900, color: "#1f2937", textDecoration: "none" },

	ghostBtn: {
		border: "1px solid rgba(17,24,39,0.12)",
		background: "white",
		padding: "8px 10px",
		borderRadius: "12px",
		cursor: "pointer",
		fontWeight: 800,
	},

	footerNote: {
		marginTop: "14px",
		fontSize: "12px",
		color: "rgba(17,24,39,0.55)",
	},
};

export default Register;
