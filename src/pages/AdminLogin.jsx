import { useState, useEffect, useRef } from "react";
import axios from "../utils/axios";
import { useNavigate } from "react-router-dom";

function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const logoutTimerRef = useRef(null);

  const clearLogoutTimer = () => {
    if (logoutTimerRef.current) {
      clearTimeout(logoutTimerRef.current);
      logoutTimerRef.current = null;
    }
  };

  const doLogout = (message) => {
    clearLogoutTimer();
    localStorage.removeItem("adminInfo");
    delete axios.defaults.headers.common["Authorization"];
    if (message) alert(message);
    navigate("/admin/login");
  };

  useEffect(() => {
    const adminInfo = localStorage.getItem("adminInfo");
    if (adminInfo) {
      try {
        const parsed = JSON.parse(adminInfo);
        if (parsed?.token) {
          axios.defaults.headers.common["Authorization"] = `Bearer ${parsed.token}`;
          if (parsed.expiryAt) {
            const remaining = parsed.expiryAt - Date.now();
            if (remaining <= 0) {
              doLogout("Session expired. Please log in again.");
            } else {
              clearLogoutTimer();
              logoutTimerRef.current = setTimeout(() => {
                doLogout("Session expired. Please log in again.");
              }, remaining);
            }
          }
        }
      } catch (err) {
        console.error("Error parsing admin info:", err);
      }
    }

    return () => clearLogoutTimer();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // 🚫 Clear any existing user session before admin login
      localStorage.removeItem("userInfo");

      const { data } = await axios.post("/users/login", { email, password });

      if (!data.isAdmin) {
        setError("Access denied. You are not an admin.");
        setLoading(false);
        return;
      }

      const now = Date.now();
      const oneHour = 60 * 60 * 1000;
      const expiryAt = now + oneHour;

      const adminInfo = { ...data, loginTime: now, expiryAt };
      localStorage.setItem("adminInfo", JSON.stringify(adminInfo));

      axios.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;

      clearLogoutTimer();
      logoutTimerRef.current = setTimeout(() => {
        doLogout("Session expired. Please log in again.");
      }, oneHour);

      navigate("/admin/dashboard");
    } catch (err) {
      console.error("Admin login error:", err);
      setError(err.response?.data?.message || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="d-flex align-items-center justify-content-center vh-100"
      style={{
        background: "linear-gradient(135deg, #007bff 0%, #6610f2 100%)",
        padding: "1rem",
      }}
    >
      <div
        className="card shadow-lg border-0"
        style={{
          width: "100%",
          maxWidth: "400px",
          borderRadius: "1rem",
          overflow: "hidden",
        }}
      >
        <div className="card-body p-4">
          <h4 className="text-center fw-bold mb-4 text-primary">Admin Login</h4>

          {error && <div className="alert alert-danger">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label fw-semibold">Email Address</label>
              <input
                type="email"
                className="form-control form-control-lg"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold">Password</label>
              <input
                type="password"
                className="form-control form-control-lg"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary w-100 py-2 mt-2 fw-semibold"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                  ></span>
                  Signing in...
                </>
              ) : (
                "Login"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;
