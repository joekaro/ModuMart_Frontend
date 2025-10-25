import React from "react";

const AboutUs = () => {
  return (
    <div className="container py-5">
      {/* Header */}
      <div className="text-center mb-5">
        <h2 className="fw-bold text-primary">About ModuMart</h2>
        <p className="text-muted mt-2">
          Your one-stop shop for quality products and excellent customer service.
        </p>
      </div>

      {/* Who We Are */}
      <div className="row align-items-center mb-5">
        <div className="col-md-6">
          <img
            src="https://images.unsplash.com/photo-1556761175-4b46a572b786"
            alt="About ModuMart"
            className="img-fluid rounded shadow-sm mb-3 mb-md-0"
          />
        </div>
        <div className="col-md-6">
          <h4 className="fw-semibold text-dark">Who We Are</h4>
          <p className="text-muted">
            At <strong>ModuMart</strong>, we believe in simplifying shopping. Our
            platform connects you to quality products across various categories,
            ensuring reliability, affordability, and fast delivery. We focus on
            giving our customers the best online experience through trust and
            convenience.
          </p>
        </div>
      </div>

      {/* Vision & Mission */}
      <div className="row text-center mb-5">
        <div className="col-md-6 mb-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <h5 className="fw-bold text-primary mb-3">Our Vision</h5>
              <p className="text-muted">
                To be Africa’s most customer-centric online marketplace — where
                people can find and discover anything they need with confidence
                and ease.
              </p>
            </div>
          </div>
        </div>

        <div className="col-md-6 mb-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <h5 className="fw-bold text-primary mb-3">Our Mission</h5>
              <p className="text-muted">
                To empower buyers and sellers by providing a seamless, secure,
                and enjoyable e-commerce experience that promotes growth and
                innovation.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div className="bg-light rounded shadow-sm p-4">
        <h5 className="fw-bold text-primary text-center mb-3">Contact Us</h5>
        <p className="text-center text-muted mb-4">
          Have a question, feedback, or partnership inquiry? We’d love to hear
          from you.
        </p>

        <div className="row justify-content-center">
          <div className="col-md-8">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                alert("Thank you for reaching out! We'll get back to you soon.");
              }}
            >
              <div className="mb-3">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Your name"
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  className="form-control"
                  placeholder="you@example.com"
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Message</label>
                <textarea
                  className="form-control"
                  rows="4"
                  placeholder="Write your message..."
                  required
                ></textarea>
              </div>

              <div className="text-center">
                <button type="submit" className="btn btn-primary px-4">
                  Send Message
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="text-center mt-4">
          <small className="text-muted d-block">
            📍 Lagos, Nigeria | 📞 +234-800-MODUMART | ✉️ support@modumart.com
          </small>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
