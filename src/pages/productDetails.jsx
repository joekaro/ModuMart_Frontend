import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../utils/axios"; // ✅ use your existing axios instance
import { Spinner, Button, Form } from "react-bootstrap";
import { useCart } from "../context/CartContext";
import { toast } from "react-toastify";

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const { addToCart } = useCart();

  // ✅ Get logged in user info from localStorage
  const userInfo = localStorage.getItem("userInfo")
    ? JSON.parse(localStorage.getItem("userInfo"))
    : null;

  // ✅ Fetch single product details
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axiosInstance.get(`/products/${id}`);
        setProduct(data);
      } catch (err) {
        console.error("Error fetching product:", err);
        toast.error("Failed to load product details");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    addToCart(product);
    toast.success("✅ Added to cart successfully!");
  };

  // ✅ Handle Review Submission
  const submitReview = async (e) => {
    e.preventDefault();
    if (!rating || !comment) {
      toast.error("Please select a rating and write a comment.");
      return;
    }

    try {
      setSubmitting(true);
      await axiosInstance.post(
        `/products/${id}/reviews`,
        { rating, comment },
        {
          headers: {
            Authorization: `Bearer ${userInfo?.token}`,
          },
        }
      );

      toast.success("✅ Review added successfully!");
      setComment("");
      setRating(0);

      // Refresh product after review
      const { data } = await axiosInstance.get(`/products/${id}`);
      setProduct(data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Spinner animation="border" className="d-block mx-auto mt-5" />;
  if (!product) return <p className="text-danger text-center mt-4">Product not found.</p>;

  return (
    <div className="container my-5">
      <div className="row align-items-center">
        {/* Product Image */}
        <div className="col-md-6 text-center mb-4">
          <img
            src={product.image}
            alt={product.name}
            className="img-fluid rounded shadow-sm"
            style={{ maxHeight: "400px", objectFit: "contain" }}
          />
        </div>

        {/* Product Details */}
        <div className="col-md-6">
          <h2>{product.name}</h2>
          <p className="text-muted">{product.category}</p>

          {/* ⭐ Rating */}
          <div className="mb-2">
            <span className="text-warning">
              {"★".repeat(Math.round(product.rating || 0))}
              {"☆".repeat(5 - Math.round(product.rating || 0))}
            </span>
            <span className="ms-2">({product.numReviews} reviews)</span>
          </div>

          <p>{product.description}</p>
          <h4 className="fw-bold text-dark mb-3">₦{product.price.toLocaleString()}</h4>

          <Button variant="dark" onClick={handleAddToCart} className="w-100 mb-3">
            Add to Cart
          </Button>
        </div>
      </div>

      {/* 📝 Reviews Section */}
      <div className="mt-5">
        <h4 className="mb-4">Customer Reviews</h4>

        {product.reviews && product.reviews.length > 0 ? (
          product.reviews.map((review) => (
            <div key={review._id} className="border rounded p-3 mb-3 bg-light">
              <strong>{review.name}</strong>
              <div className="text-warning">
                {"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}
              </div>
              <p className="mb-1">{review.comment}</p>
          <small className="text-muted">
            {review.createdAt ? (() => {
                  const now = new Date();
                  const created = new Date(review.createdAt);
                  const diffMs = now - created;
                  const diffMins = Math.floor(diffMs / (1000 * 60));
                  const diffHours = Math.floor(diffMins / 60);
                  const diffDays = Math.floor(diffHours / 24);

                  if (diffMins < 1) return "Just now";
                  if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? "s" : ""} ago`;
                  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
                  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;

                  return created.toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  });
                })()
              : "Date not available"}
        </small>


            </div>
          ))
        ) : (
          <p>No reviews yet. Be the first to review!</p>
        )}

        {/* Review Form (Only logged in users) */}
        {userInfo ? (
          <div className="mt-4">
            <h5>Write a Review</h5>
            <Form onSubmit={submitReview}>
              <Form.Group className="mb-3">
                <Form.Label>Rating</Form.Label>
                <Form.Select
                  value={rating}
                  onChange={(e) => setRating(Number(e.target.value))}
                  required
                >
                  <option value="">Select...</option>
                  <option value="1">⭐ 1 - Poor</option>
                  <option value="2">⭐⭐ 2 - Fair</option>
                  <option value="3">⭐⭐⭐ 3 - Good</option>
                  <option value="4">⭐⭐⭐⭐ 4 - Very Good</option>
                  <option value="5">⭐⭐⭐⭐⭐ 5 - Excellent</option>
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Comment</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Write your review..."
                  required
                />
              </Form.Group>

              <Button type="submit" variant="primary" disabled={submitting}>
                {submitting ? "Submitting..." : "Submit Review"}
              </Button>
            </Form>
          </div>
        ) : (
          <p className="text-muted mt-3">
            <em>Please login to write a review.</em>
          </p>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;
