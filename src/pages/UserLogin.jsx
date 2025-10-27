import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import axios from "../utils/axios";
import axiosInstance from "../utils/axios";

function UserLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect to previous route or home
  const redirect = location.state?.from?.pathname || "/";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // 🚫 Clear any existing admin session to avoid token mix-up
      localStorage.removeItem("adminInfo");
       localStorage.removeItem("userInfo");

      const { data } = await axiosInstance.post("/users/login", { email, password });

      // ✅ Save user data to localStorage
      localStorage.setItem("userInfo", JSON.stringify(data));

      // ✅ Redirect to intended page or home
      navigate(redirect);
    } catch (err) {
      console.error("Login error:", err);
      setError(err.response?.data?.message || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container d-flex align-items-center justify-content-center vh-100">
      <div className="card shadow-sm p-4 w-100" style={{ maxWidth: "400px" }}>
        <h4 className="text-center fw-bold mb-3 text-primary">User Login</h4>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary w-100"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>

        <div className="mt-3 text-center">
          <small>
            Don’t have an account?{" "}
            <Link to="/register" className="text-decoration-none fw-semibold">
              Register
            </Link>
          </small>
        </div>
      </div>
    </div>
  );
}

export default UserLogin;
