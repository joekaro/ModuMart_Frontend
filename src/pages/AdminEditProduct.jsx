import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../utils/axios";

function AdminEditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    category: "",
    countInStock: "",
    description: "",
    image: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axios.get(`/products/${id}`);
        setFormData({
          name: data.name || "",
          price: data.price || "",
          category: data.category || "",
          countInStock: data.countInStock || "",
          description: data.description || "",
          image: data.image || "",
        });
      } catch (error) {
        console.error(error);
        setMessage("❌ Failed to load product data.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    try {
      const adminInfo = localStorage.getItem("adminInfo")
        ? JSON.parse(localStorage.getItem("adminInfo"))
        : null;

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: adminInfo ? `Bearer ${adminInfo.token}` : "",
        },
      };

      await axios.put(`/products/${id}`, formData, config);
      setMessage("✅ Product updated successfully!");
      setTimeout(() => navigate("/admin/products"), 1500);
    } catch (error) {
      console.error("Update error:", error);
      setMessage("❌ Failed to update product.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "60vh" }}
      >
        <div className="spinner-border text-primary" role="status"></div>
      </div>
    );
  }

  return (
    <div className="card shadow-sm border-0">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center flex-wrap mb-4">
          <h4 className="fw-bold text-primary mb-2">Edit Product</h4>
          <button
            className="btn btn-outline-secondary btn-sm"
            onClick={() => navigate("/admin/products")}
          >
            ← Back
          </button>
        </div>

        {message && (
          <div
            className={`alert ${
              message.startsWith("✅") ? "alert-success" : "alert-danger"
            }`}
          >
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-12 col-md-6 mb-3">
              <label className="form-label fw-semibold">Product Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>

            <div className="col-12 col-md-6 mb-3">
              <label className="form-label fw-semibold">Category</label>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>

            <div className="col-12 col-md-6 mb-3">
              <label className="form-label fw-semibold">Price (₦)</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>

            <div className="col-12 col-md-6 mb-3">
              <label className="form-label fw-semibold">Stock Quantity</label>
              <input
                type="number"
                name="countInStock"
                value={formData.countInStock}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>

            <div className="col-12 mb-3">
              <label className="form-label fw-semibold">Image URL</label>
              <input
                type="text"
                name="image"
                value={formData.image}
                onChange={handleChange}
                className="form-control"
              />
              {formData.image && (
                <div className="text-center mt-3">
                  <img
                    src={formData.image}
                    alt="Preview"
                    className="img-fluid rounded shadow-sm"
                    style={{ maxHeight: "200px" }}
                  />
                </div>
              )}
            </div>

            <div className="col-12 mb-3">
              <label className="form-label fw-semibold">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="form-control"
                rows="4"
              ></textarea>
            </div>

            <div className="col-12 text-end">
              <button
                type="submit"
                className="btn btn-primary px-4"
                disabled={saving}
              >
                {saving ? "Saving..." : "Update Product"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AdminEditProduct;
