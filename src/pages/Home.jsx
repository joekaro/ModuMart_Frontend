import Navbar from "../components/Navbar";
import Products from "./Products";

const Home = () => {
  return (
    <>

      {/* 🏠 Hero Banner Section */}
      <section
        className="hero-banner d-flex align-items-center justify-content-center text-center text-white"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1556745753-b2904692b3cd?auto=format&fit=crop&w=1600&q=80')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: "60vh",
          position: "relative",
        }}
      >
        <div
          style={{
            background: "rgba(0, 0, 0, 0.5)",
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "0 1rem",
          }}
        >
          <h1 className="fw-bold mb-3 display-5 display-md-4 display-sm-6">
            Welcome to ModuMart
          </h1>
          <p
            className="lead mb-4"
            style={{
              fontSize: "clamp(0.9rem, 2.5vw, 1.25rem)",
              maxWidth: "600px",
            }}
          >
            Discover quality products, unbeatable prices, and a seamless shopping experience.
          </p>
          <a
            href="#products"
            className="btn btn-light fw-semibold px-4 py-2"
            style={{
              fontSize: "clamp(0.85rem, 2.2vw, 1rem)",
            }}
          >
            Shop Now
          </a>
        </div>
      </section>

      {/* 💬 About Section */}
      <section className="container text-center my-5 px-3">
        <h2 className="fw-bold mb-3">Why Shop With Us?</h2>
        <p className="text-muted mb-5" style={{ fontSize: "0.95rem" }}>
          ModuMart brings together top-quality products across all categories, ensuring reliability,
          affordability, and fast delivery right to your doorstep.
        </p>

        <div className="row g-4">
          <div className="col-12 col-md-4">
            <i className="bi bi-truck fs-1 text-dark mb-3"></i>
            <h5>Fast Delivery</h5>
            <p className="text-muted small">
              Get your orders delivered quickly and safely, wherever you are.
            </p>
          </div>
          <div className="col-12 col-md-4">
            <i className="bi bi-shield-check fs-1 text-dark mb-3"></i>
            <h5>Trusted Quality</h5>
            <p className="text-muted small">
              We ensure each product meets our strict quality standards.
            </p>
          </div>
          <div className="col-12 col-md-4">
            <i className="bi bi-wallet2 fs-1 text-dark mb-3"></i>
            <h5>Affordable Prices</h5>
            <p className="text-muted small">
              Enjoy great value for money with unbeatable deals every day.
            </p>
          </div>
        </div>
      </section>

      {/* 🛍 Products Section */}
      <section id="products" className="container my-5">
        <h2 className="text-center mb-4">Our Latest Products</h2>
        <Products />
      </section>
    </>
  );
};

export default Home;
