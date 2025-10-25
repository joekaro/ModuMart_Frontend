import { Link, NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";
import { Badge } from "react-bootstrap";

const Navbar = () => {
  const { cart } = useCart();
  const navigate = useNavigate();
  const [user, setUser] = useState(() =>
    JSON.parse(localStorage.getItem("userInfo"))
  );
  const [expanded, setExpanded] = useState(false);

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    const handleStorageChange = () => {
      const storedUser = JSON.parse(localStorage.getItem("userInfo"));
      setUser(storedUser);
    };

    window.addEventListener("storage", handleStorageChange);
    const interval = setInterval(handleStorageChange, 1000);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  const handleLogout = () => {
    // ✅ Clear both user and admin info to prevent session conflicts
    localStorage.removeItem("userInfo");
    localStorage.removeItem("adminInfo");

    setUser(null);
    navigate("/login");
    window.location.reload(); // optional but ensures full session reset
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top">
      <div className="container">
        <Link
          className="navbar-brand fw-bold"
          to="/"
          onClick={() => setExpanded(false)}
        >
          🛒 ModuMart
        </Link>

        {/* ✅ Mobile Toggle */}
        <button
          className="navbar-toggler"
          type="button"
          onClick={() => setExpanded(!expanded)}
          aria-controls="navbarNav"
          aria-expanded={expanded}
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div
          className={`collapse navbar-collapse ${expanded ? "show" : ""}`}
          id="navbarNav"
        >
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <NavLink
                className="nav-link"
                to="/"
                onClick={() => setExpanded(false)}
              >
                Home
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink
                className="nav-link"
                to="/products"
                onClick={() => setExpanded(false)}
              >
                Products
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                className="nav-link"
                to="/Wishlist"
                onClick={() => setExpanded(false)}
              >
                Wishlist
              </NavLink>
            </li>

            {/* ✅ NEW About Us Link */}
            <li className="nav-item">
              <NavLink
                className="nav-link"
                to="/about"
                onClick={() => setExpanded(false)}
              >
                About Us
              </NavLink>
            </li>

            <li className="nav-item position-relative">
              <NavLink
                className="nav-link"
                to="/cart"
                onClick={() => setExpanded(false)}
              >
                Cart{" "}
                <Badge bg="warning" text="dark" pill>
                  {totalItems}
                </Badge>
              </NavLink>
            </li>

            {user ? (
              <>
                <li className="nav-item">
                  <NavLink
                    className="nav-link"
                    to="/profile"
                    onClick={() => setExpanded(false)}
                  >
                    Profile
                  </NavLink>
                </li>
                <li className="nav-item">
                  <button
                    className="btn btn-link nav-link text-danger"
                    onClick={() => {
                      handleLogout();
                      setExpanded(false);
                    }}
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <li className="nav-item">
                <NavLink
                  className="nav-link"
                  to="/login"
                  onClick={() => setExpanded(false)}
                >
                  Login
                </NavLink>
              </li>
            )}
          </ul>
        </div>
      </div>

      <style>{`
        .navbar {
          z-index: 1030;
        }
        @media (max-width: 768px) {
          .nav-item {
            text-align: center;
          }
          .nav-link {
            padding: 0.7rem 1rem;
          }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
