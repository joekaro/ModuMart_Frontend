import { useState } from "react";
import axios from "axios";

function AdminAddProduct() {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    category: "",
    countInStock: "",
    description: "",
    image: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const adminInfo = JSON.parse(localStorage.getItem("adminInfo"));
      const token = adminInfo?.token;

      if (!token) {
        setMessage("❌ Not authorized. Please log in again.");
        setLoading(false);
        return;
      }

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      await axios.post("http://localhost:5000/api/products", formData, config);

      setMessage("✅ Product added successfully!");
      setFormData({
        name: "",
        price: "",
        category: "",
        countInStock: "",
        description: "",
        image: "",
      });
    } catch (error) {
      console.error(error);
      setMessage(
        error.response?.data?.message || "❌ Failed to add product. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card shadow-sm border-0">
      <div className="card-body">
        <h4 className="fw-bold text-primary mb-4 text-center text-md-start">
          Add New Product
        </h4>

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
          <div className="row gy-3">
            <div className="col-12 col-md-6">
              <label className="form-label small fw-semibold">
                Product Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="form-control form-control-sm"
                placeholder="Enter product name"
                required
              />
            </div>

            <div className="col-12 col-md-6">
              <label className="form-label small fw-semibold">Category</label>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="form-control form-control-sm"
                placeholder="Enter category"
                required
              />
            </div>

            <div className="col-12 col-md-6">
              <label className="form-label small fw-semibold">Price ($)</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className="form-control form-control-sm"
                placeholder="Enter price"
                required
              />
            </div>

            <div className="col-12 col-md-6">
              <label className="form-label small fw-semibold">
                Stock Quantity
              </label>
              <input
                type="number"
                name="countInStock"
                value={formData.countInStock}
                onChange={handleChange}
                className="form-control form-control-sm"
                placeholder="Enter stock quantity"
                required
              />
            </div>

            <div className="col-12">
              <label className="form-label small fw-semibold">Image URL</label>
              <input
                type="text"
                name="image"
                value={formData.image}
                onChange={handleChange}
                className="form-control form-control-sm"
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div className="col-12">
              <label className="form-label small fw-semibold">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="form-control form-control-sm"
                rows="4"
                placeholder="Write a short product description..."
              ></textarea>
            </div>

            <div className="col-12 text-center text-md-start mt-2">
              <button
                type="submit"
                className="btn btn-primary px-4 py-2 w-100 w-md-auto"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                    ></span>
                    Adding...
                  </>
                ) : (
                  "Add Product"
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AdminAddProduct;
