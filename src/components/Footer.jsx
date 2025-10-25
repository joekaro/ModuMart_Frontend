import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-dark text-light pt-5 pb-3 mt-5">
      <div className="container">
        <div className="row text-center text-md-start">
          {/* About Section */}
          <div className="col-md-4 mb-4">
            <h5 className="fw-bold text-primary">About ModuMart</h5>
            <p className="small">
              ModuMart is your trusted marketplace for high-quality products. We
              deliver reliability, affordability, and great customer service.
            </p>
          </div>

          {/* Quick Links */}
          <div className="col-md-4 mb-4">
            <h5 className="fw-bold text-primary">Quick Links</h5>
            <ul className="list-unstyled small">
              <li>
                <Link to="/" className="text-light text-decoration-none">
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/products"
                  className="text-light text-decoration-none"
                >
                  Shop
                </Link>
              </li>
              <li>
                <Link to="/cart" className="text-light text-decoration-none">
                  Cart
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-light text-decoration-none">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="col-md-4 mb-4">
            <h5 className="fw-bold text-primary">Contact</h5>
            <p className="small mb-1">
              <i className="bi bi-geo-alt-fill text-primary me-2"></i>
              Lagos, Nigeria
            </p>
            <p className="small mb-1">
              <i className="bi bi-envelope-fill text-primary me-2"></i>
              support@modumart.com
            </p>
            <p className="small">
              <i className="bi bi-telephone-fill text-primary me-2"></i>
              +234 901 234 5678
            </p>
          </div>
        </div>

        <hr className="border-secondary" />
        <p className="text-center small mb-0">
          © {new Date().getFullYear()}{" "}
          <span className="fw-bold text-primary">ModuMart</span>. All rights
          reserved.
        </p>
        <p>Developed by JOSEPH OBANOVWE</p>
      </div>
    </footer>
  );
};

export default Footer;
