import { useEffect, useState } from "react";
import axios from "../utils/axios";

function AdminProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch products function (accessible globally in this component)
  const fetchProducts = async () => {
    try {
      const { data } = await axios.get("/products");
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // ✅ Delete product function
  const deleteProduct = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        const adminInfo = localStorage.getItem("adminInfo")
          ? JSON.parse(localStorage.getItem("adminInfo"))
          : null;

        const config = {
          headers: {
            Authorization: adminInfo ? `Bearer ${adminInfo.token}` : "",
          },
        };

        await axios.delete(`/products/${id}`, config);
        alert("✅ Product deleted successfully");

        // ✅ Refresh list after delete
        fetchProducts();
      } catch (error) {
        console.error("Delete error:", error);
        alert("❌ Failed to delete product");
      }
    }
  };

  return (
    <div className="card shadow-sm border-0">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
          <h4 className="fw-bold text-primary mb-0">Products</h4>
          <a href="/admin/add-product" className="btn btn-primary btn-sm">
            + Add Product
          </a>
        </div>

        {loading ? (
          <div className="text-center py-4">
            <div className="spinner-border text-primary" role="status"></div>
          </div>
        ) : products.length === 0 ? (
          <p className="text-muted text-center">No products found.</p>
        ) : (
          <>
            {/* ✅ Desktop Table View */}
            <div className="table-responsive d-none d-md-block">
              <table className="table table-striped table-hover align-middle">
                <thead className="table-primary">
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th className="text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product, index) => (
                    <tr key={product._id}>
                      <td>{index + 1}</td>
                      <td
                        className="text-truncate"
                        style={{ maxWidth: "200px" }}
                      >
                        {product.name}
                      </td>
                      <td>{product.category}</td>
                      <td>₦{product.price}</td>
                      <td>{product.countInStock}</td>
                      <td className="text-center">
                        <a
                          href={`/admin/edit-product/${product._id}`}
                          className="btn btn-sm btn-outline-primary me-2"
                        >
                          Edit
                        </a>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => deleteProduct(product._id)} // ✅ Working delete button
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* ✅ Mobile Card View */}
            <div className="d-block d-md-none">
              {products.map((product, index) => (
                <div
                  key={product._id}
                  className="border rounded p-3 mb-3 bg-light shadow-sm"
                >
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <h6 className="fw-bold text-primary mb-0">
                      {index + 1}. {product.name}
                    </h6>
                    <small className="badge bg-secondary">
                      {product.category}
                    </small>
                  </div>
                  <p className="mb-1">
                    <strong>Price:</strong> ₦{product.price}
                  </p>
                  <p className="mb-2">
                    <strong>Stock:</strong> {product.countInStock}
                  </p>
                  <div className="d-flex justify-content-between">
                    <a
                      href={`/admin/edit-product/${product._id}`}
                      className="btn btn-sm btn-outline-primary w-50 me-2"
                    >
                      Edit
                    </a>
                    <button
                      className="btn btn-danger btn-sm w-50"
                      onClick={() => deleteProduct(product._id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default AdminProductList;
