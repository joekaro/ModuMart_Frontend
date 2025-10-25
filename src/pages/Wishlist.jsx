import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Wishlist = () => {
  const [wishlist, setWishlist] = useState(() => {
    const saved = localStorage.getItem("wishlist");
    return saved ? JSON.parse(saved) : [];
  });

  // ✅ Remove item safely regardless of structure
  const removeFromWishlist = (id) => {
    const updated = wishlist.filter(
      (item) => item._id !== id && item?.product?._id !== id
    );
    setWishlist(updated);
    localStorage.setItem("wishlist", JSON.stringify(updated));
  };

  useEffect(() => {
    document.title = "My Wishlist";
  }, []);

  return (
    <div className="container my-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="fw-bold text-primary mb-0">My Wishlist ❤️</h4>
        <Link to="/products" className="btn btn-outline-secondary btn-sm">
          ← Back to Products
        </Link>
      </div>

      {wishlist.length === 0 ? (
        <p className="text-center text-muted mt-4">
          Your wishlist is empty. Browse products to add favorites!
        </p>
      ) : (
        <div className="row">
          {wishlist.map((item) => {
            // 🧩 Normalize product data
            const product = item._id ? item : item.product || {};

            return (
              <div className="col-6 col-md-3 mb-4" key={product._id}>
                <div className="card h-100 shadow-sm">
                  <img
                    src={product.image || "/placeholder.jpg"}
                    className="card-img-top"
                    alt={product.name || "Unnamed Product"}
                    style={{
                      height: "180px",
                      objectFit: "cover",
                    }}
                  />

                  <div className="card-body text-center">
                    <h6 className="fw-semibold text-truncate">
                      {product.name || "Unnamed Product"}
                    </h6>
                    <p
                      className="text-muted small text-truncate"
                      style={{ height: "35px" }}
                    >
                      {product.description || "No description available."}
                    </p>
                    <p className="fw-bold mb-2">
                      ₦{(product.price || 0).toLocaleString()}
                    </p>

                    <div className="d-flex gap-2">
                      <Link
                        to={`/product/${product._id}`}
                        className="btn btn-dark btn-sm w-50"
                      >
                        View
                      </Link>
                      <button
                        className="btn btn-outline-danger btn-sm w-50"
                        onClick={() => removeFromWishlist(product._id)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
