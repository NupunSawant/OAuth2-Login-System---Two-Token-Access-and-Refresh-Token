import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logoutThunk } from "../features/auth/authThunks";

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, loading } = useSelector((state) => state.auth);

  const initials = useMemo(() => {
    if (!user?.name) return "U";
    const parts = user.name.trim().split(/\s+/);
    const a = parts[0]?.[0] || "U";
    const b = parts.length > 1 ? parts[parts.length - 1]?.[0] : "";
    return (a + b).toUpperCase();
  }, [user]);

  const handleLogout = async () => {
    await dispatch(logoutThunk());
    navigate("/login");
  };

  // If user becomes null (auto logout / refresh fail), push to login
  useEffect(() => {
    if (!user && !loading) navigate("/login");
  }, [user, loading, navigate]);

  return (
    <div style={styles.page}>
      {/* Top Bar */}
      <div style={styles.topbar}>
        <div style={styles.brand}>
          <div style={styles.brandDot} />
          <span style={styles.brandText}>Auth Dashboard</span>
        </div>

        <button
          onClick={handleLogout}
          style={{
            ...styles.logoutBtn,
            ...(loading ? styles.btnDisabled : {}),
          }}
          disabled={loading}
        >
          {loading ? (
            <span style={styles.inline}>
              <span style={styles.spinner} /> Logging out…
            </span>
          ) : (
            "Logout"
          )}
        </button>
      </div>

      {/* Main Card */}
      <div style={styles.card}>
        {/* Header */}
        <div style={styles.cardHeader}>
          <div style={styles.avatar}>{initials}</div>

          <div style={styles.headerText}>
            <div style={styles.title}>
              {user ? `Welcome back, ${user.name}` : "Fetching your profile…"}
            </div>
            <div style={styles.subTitle}>
              {user ? "You are successfully authenticated." : "Please wait…"}
            </div>
          </div>

          <div style={styles.statusWrap}>
            <span style={styles.badge}>
              <span style={styles.badgeDot} />
              {loading ? "Syncing" : user ? "Active" : "Idle"}
            </span>
          </div>
        </div>

        {/* Body */}
        <div style={styles.body}>
          {user ? (
            <>
              <div style={styles.grid}>
                <Info
                  label="Email"
                  value={user.email || "—"}
                  icon={<MailIcon />}
                />
                <Info
                  label="Role"
                  value={user.role || "User"}
                  icon={<ShieldIcon />}
                />
                <Info
                  label="User ID"
                  value={user._id || user.id || "—"}
                  icon={<IdIcon />}
                />
                <Info
                  label="Session"
                  value={loading ? "Updating…" : "Valid"}
                  icon={<ClockIcon />}
                />
              </div>

              <div style={styles.actions}>
                <button
                  onClick={() => navigate("/profile")}
                  style={styles.primaryBtn}
                >
                  View Profile
                </button>

                <button
                  onClick={() => navigate("/")}
                  style={styles.secondaryBtn}
                >
                  Refresh Page
                </button>
              </div>

              <div style={styles.tipBox}>
                <div style={styles.tipTitle}>Tip</div>
                <div style={styles.tipText}>
                  If your <b>access token</b> expires, your app can silently call{" "}
                  <b>/refresh</b> using the HttpOnly refresh cookie.
                </div>
              </div>
            </>
          ) : (
            <div style={styles.skeletonWrap}>
              <div style={styles.skeletonLine} />
              <div style={styles.skeletonLine} />
              <div style={styles.skeletonLineShort} />
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div style={styles.footer}>
        <span style={styles.footerText}>
          © {new Date().getFullYear()} • Secure Auth System
        </span>
      </div>
    </div>
  );
};

/* Small info tile */
const Info = ({ label, value, icon }) => {
  return (
    <div style={styles.infoCard}>
      <div style={styles.infoTop}>
        <div style={styles.iconBox}>{icon}</div>
        <div style={styles.infoLabel}>{label}</div>
      </div>
      <div style={styles.infoValue}>{value}</div>
    </div>
  );
};

/* Minimal inline SVG icons (no libs) */
const MailIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path
      d="M4 7.5A2.5 2.5 0 0 1 6.5 5h11A2.5 2.5 0 0 1 20 7.5v9A2.5 2.5 0 0 1 17.5 19h-11A2.5 2.5 0 0 1 4 16.5v-9Z"
      stroke="currentColor"
      strokeWidth="1.7"
    />
    <path
      d="M6.5 7.5 12 12l5.5-4.5"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ShieldIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path
      d="M12 3 20 7v6c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V7l8-4Z"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinejoin="round"
    />
  </svg>
);

const IdIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path
      d="M7 7h10M7 12h6M7 17h10"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
    />
    <path
      d="M5 4h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z"
      stroke="currentColor"
      strokeWidth="1.7"
    />
  </svg>
);

const ClockIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path
      d="M12 7v5l3 2"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
      stroke="currentColor"
      strokeWidth="1.7"
    />
  </svg>
);

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    background:
      "radial-gradient(1200px 600px at 20% 0%, #e9f0ff 0%, transparent 55%), radial-gradient(900px 500px at 90% 10%, #f5eaff 0%, transparent 55%), linear-gradient(180deg, #f7f8fc 0%, #ffffff 45%, #f7f8fc 100%)",
    padding: "22px",
    color: "#111827",
    fontFamily:
      'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial',
  },

  topbar: {
    maxWidth: "980px",
    width: "100%",
    margin: "0 auto 18px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "12px 14px",
    borderRadius: "14px",
    background: "rgba(255,255,255,0.75)",
    border: "1px solid rgba(17,24,39,0.08)",
    backdropFilter: "blur(10px)",
    boxShadow: "0 10px 30px rgba(17,24,39,0.06)",
  },

  brand: { display: "flex", alignItems: "center", gap: "10px" },
  brandDot: {
    width: "10px",
    height: "10px",
    borderRadius: "999px",
    background: "linear-gradient(135deg, #3b82f6, #a855f7)",
    boxShadow: "0 6px 18px rgba(59,130,246,0.35)",
  },
  brandText: { fontWeight: 700, letterSpacing: "0.2px" },

  logoutBtn: {
    border: "1px solid rgba(17,24,39,0.12)",
    background: "white",
    padding: "10px 14px",
    borderRadius: "12px",
    cursor: "pointer",
    fontWeight: 600,
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    boxShadow: "0 10px 22px rgba(17,24,39,0.06)",
  },
  btnDisabled: { opacity: 0.7, cursor: "not-allowed" },

  card: {
    maxWidth: "980px",
    width: "100%",
    margin: "0 auto",
    borderRadius: "18px",
    background: "rgba(255,255,255,0.85)",
    border: "1px solid rgba(17,24,39,0.08)",
    backdropFilter: "blur(10px)",
    boxShadow: "0 18px 45px rgba(17,24,39,0.08)",
    overflow: "hidden",
  },

  cardHeader: {
    display: "grid",
    gridTemplateColumns: "auto 1fr auto",
    gap: "14px",
    padding: "18px",
    borderBottom: "1px solid rgba(17,24,39,0.08)",
    alignItems: "center",
  },

  avatar: {
    width: "54px",
    height: "54px",
    borderRadius: "16px",
    display: "grid",
    placeItems: "center",
    fontWeight: 800,
    color: "#0b1220",
    background:
      "linear-gradient(135deg, rgba(59,130,246,0.20), rgba(168,85,247,0.20))",
    border: "1px solid rgba(59,130,246,0.25)",
  },

  headerText: { display: "flex", flexDirection: "column", gap: "4px" },
  title: { fontSize: "18px", fontWeight: 800 },
  subTitle: { fontSize: "13px", color: "rgba(17,24,39,0.65)" },

  statusWrap: { display: "flex", justifyContent: "flex-end" },
  badge: {
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    padding: "8px 10px",
    borderRadius: "999px",
    border: "1px solid rgba(17,24,39,0.10)",
    background: "rgba(255,255,255,0.9)",
    fontSize: "12px",
    fontWeight: 700,
  },
  badgeDot: {
    width: "8px",
    height: "8px",
    borderRadius: "999px",
    background: "#22c55e",
    boxShadow: "0 0 0 4px rgba(34,197,94,0.15)",
  },

  body: { padding: "18px" },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
    gap: "12px",
  },

  infoCard: {
    borderRadius: "16px",
    padding: "12px",
    border: "1px solid rgba(17,24,39,0.10)",
    background: "rgba(255,255,255,0.9)",
    boxShadow: "0 12px 24px rgba(17,24,39,0.05)",
    minHeight: "86px",
  },
  infoTop: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    marginBottom: "8px",
  },
  iconBox: {
    width: "32px",
    height: "32px",
    borderRadius: "12px",
    display: "grid",
    placeItems: "center",
    color: "#111827",
    background: "rgba(17,24,39,0.05)",
    border: "1px solid rgba(17,24,39,0.08)",
  },
  infoLabel: { fontSize: "12px", color: "rgba(17,24,39,0.65)", fontWeight: 700 },
  infoValue: { fontSize: "13px", fontWeight: 800, wordBreak: "break-word" },

  actions: {
    marginTop: "16px",
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
  },
  primaryBtn: {
    padding: "10px 14px",
    borderRadius: "12px",
    border: "1px solid rgba(59,130,246,0.35)",
    background: "linear-gradient(135deg, rgba(59,130,246,0.18), rgba(168,85,247,0.18))",
    cursor: "pointer",
    fontWeight: 800,
  },
  secondaryBtn: {
    padding: "10px 14px",
    borderRadius: "12px",
    border: "1px solid rgba(17,24,39,0.12)",
    background: "white",
    cursor: "pointer",
    fontWeight: 800,
  },

  tipBox: {
    marginTop: "16px",
    padding: "12px 14px",
    borderRadius: "16px",
    border: "1px solid rgba(17,24,39,0.10)",
    background: "rgba(255,255,255,0.9)",
  },
  tipTitle: { fontWeight: 900, fontSize: "12px", marginBottom: "4px" },
  tipText: { fontSize: "13px", color: "rgba(17,24,39,0.75)", lineHeight: 1.4 },

  skeletonWrap: { padding: "8px" },
  skeletonLine: {
    height: "12px",
    borderRadius: "8px",
    background: "rgba(17,24,39,0.08)",
    marginBottom: "10px",
  },
  skeletonLineShort: {
    height: "12px",
    width: "60%",
    borderRadius: "8px",
    background: "rgba(17,24,39,0.08)",
  },

  inline: { display: "inline-flex", alignItems: "center", gap: "8px" },
  spinner: {
    width: "14px",
    height: "14px",
    borderRadius: "999px",
    border: "2px solid rgba(17,24,39,0.18)",
    borderTop: "2px solid rgba(17,24,39,0.65)",
    animation: "spin 0.8s linear infinite",
  },

  footer: {
    maxWidth: "980px",
    width: "100%",
    margin: "16px auto 0",
    textAlign: "center",
    color: "rgba(17,24,39,0.55)",
    fontSize: "12px",
  },
  footerText: { padding: "8px 0", display: "inline-block" },
};

// Inject small keyframes (pure JS + no CSS file)
const injectKeyframes = () => {
  const id = "home-ui-keyframes";
  if (document.getElementById(id)) return;
  const style = document.createElement("style");
  style.id = id;
  style.innerHTML = `
    @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
    @media (max-width: 860px) {
      ._grid4 { grid-template-columns: repeat(2, minmax(0, 1fr)) !important; }
    }
    @media (max-width: 520px) {
      ._grid4 { grid-template-columns: 1fr !important; }
    }
  `;
  document.head.appendChild(style);
};

export default function HomeWrapper() {
  useEffect(() => {
    injectKeyframes();
  }, []);

  // Wrap to allow responsive grid class
  return <HomeWithResponsiveGrid />;
}

const HomeWithResponsiveGrid = () => {
  // re-use Home but patch the grid style with a class for media queries
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, loading } = useSelector((state) => state.auth);

  const initials = useMemo(() => {
    if (!user?.name) return "U";
    const parts = user.name.trim().split(/\s+/);
    const a = parts[0]?.[0] || "U";
    const b = parts.length > 1 ? parts[parts.length - 1]?.[0] : "";
    return (a + b).toUpperCase();
  }, [user]);

  const handleLogout = async () => {
    await dispatch(logoutThunk());
    navigate("/login");
  };

  useEffect(() => {
    if (!user && !loading) navigate("/login");
  }, [user, loading, navigate]);

  return (
    <div style={styles.page}>
      <div style={styles.topbar}>
        <div style={styles.brand}>
          <div style={styles.brandDot} />
          <span style={styles.brandText}>Auth Dashboard</span>
        </div>

        <button
          onClick={handleLogout}
          style={{ ...styles.logoutBtn, ...(loading ? styles.btnDisabled : {}) }}
          disabled={loading}
        >
          {loading ? (
            <span style={styles.inline}>
              <span style={styles.spinner} /> Logging out…
            </span>
          ) : (
            "Logout"
          )}
        </button>
      </div>

      <div style={styles.card}>
        <div style={styles.cardHeader}>
          <div style={styles.avatar}>{initials}</div>

          <div style={styles.headerText}>
            <div style={styles.title}>
              {user ? `Welcome back, ${user.name}` : "Fetching your profile…"}
            </div>
            <div style={styles.subTitle}>
              {user ? "You are successfully authenticated." : "Please wait…"}
            </div>
          </div>

          <div style={styles.statusWrap}>
            <span style={styles.badge}>
              <span style={styles.badgeDot} />
              {loading ? "Syncing" : user ? "Active" : "Idle"}
            </span>
          </div>
        </div>

        <div style={styles.body}>
          {user ? (
            <>
              <div style={{ ...styles.grid }} className="_grid4">
                <Info label="Email" value={user.email || "—"} icon={<MailIcon />} />
                <Info label="Role" value={user.role || "User"} icon={<ShieldIcon />} />
                <Info label="User ID" value={user._id || user.id || "—"} icon={<IdIcon />} />
                <Info label="Session" value={loading ? "Updating…" : "Valid"} icon={<ClockIcon />} />
              </div>

              <div style={styles.actions}>
                <button onClick={() => navigate("/profile")} style={styles.primaryBtn}>
                  View Profile
                </button>
                <button onClick={() => navigate("/")} style={styles.secondaryBtn}>
                  Refresh Page
                </button>
              </div>

              <div style={styles.tipBox}>
                <div style={styles.tipTitle}>Tip</div>
                <div style={styles.tipText}>
                  If your <b>access token</b> expires, your app can silently call{" "}
                  <b>/refresh</b> using the HttpOnly refresh cookie.
                </div>
              </div>
            </>
          ) : (
            <div style={styles.skeletonWrap}>
              <div style={styles.skeletonLine} />
              <div style={styles.skeletonLine} />
              <div style={styles.skeletonLineShort} />
            </div>
          )}
        </div>
      </div>

      <div style={styles.footer}>
        <span style={styles.footerText}>
          © {new Date().getFullYear()} • Secure Auth System
        </span>
      </div>
    </div>
  );
};
