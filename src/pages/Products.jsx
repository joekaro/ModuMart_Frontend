import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { FaHeart, FaRegHeart } from "react-icons/fa"; // ❤️ Wishlist icons

const Products = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState("default");
  const [wishlist, setWishlist] = useState(() => {
    const saved = localStorage.getItem("wishlist");
    return saved ? JSON.parse(saved) : [];
  });

  const [currentPage, setCurrentPage] = useState(1);

  const productsPerPage = 8; // 🧭 Pagination limit

  // ✅ Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/products");
        setProducts(res.data);
        setFilteredProducts(res.data);
      } catch (err) {
        console.error("Error fetching products:", err);
      }
    };
    fetchProducts();
  }, []);

  // ✅ Filtering, searching, and sorting
  useEffect(() => {
    let updated = [...products];

    if (category !== "all") {
      updated = updated.filter(
        (p) => p.category && p.category.toLowerCase() === category.toLowerCase()
      );
    }

    if (searchTerm.trim()) {
      updated = updated.filter((p) =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (sort === "price-asc") updated.sort((a, b) => a.price - b.price);
    else if (sort === "price-desc") updated.sort((a, b) => b.price - a.price);
    else if (sort === "name-asc")
      updated.sort((a, b) => a.name.localeCompare(b.name));
    else if (sort === "name-desc")
      updated.sort((a, b) => b.name.localeCompare(a.name));

    setFilteredProducts(updated);
    setCurrentPage(1);
  }, [searchTerm, category, sort, products]);

  // ✅ Wishlist toggle
const toggleWishlist = (product) => {
  setWishlist((prev) => {
    const exists = prev.find((item) => item._id === product._id);
    let updated;

    if (exists) {
      updated = prev.filter((item) => item._id !== product._id);
    } else {
      updated = [...prev, product]; // ✅ store full product details
    }

    localStorage.setItem("wishlist", JSON.stringify(updated));
    return updated;
  });
};


  // ✅ Pagination logic
  const indexOfLast = currentPage * productsPerPage;
  const indexOfFirst = indexOfLast - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  return (
    <div className="container my-4">
      {/* 🧭 Filters */}
      <div className="d-flex flex-wrap gap-3 justify-content-center mb-4">
        <input
          type="text"
          className="form-control"
          placeholder="Search products..."
          style={{ maxWidth: "250px" }}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <select
          className="form-select"
          style={{ maxWidth: "200px" }}
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="all">All Categories</option>
          <option value="electronics">Electronics</option>
          <option value="fashion">Fashion</option>
          <option value="home">Home Appliance</option>
          <option value="grocery">Grocery</option>
        </select>

        <select
          className="form-select"
          style={{ maxWidth: "200px" }}
          value={sort}
          onChange={(e) => setSort(e.target.value)}
        >
          <option value="default">Sort By</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="name-asc">Name: A-Z</option>
          <option value="name-desc">Name: Z-A</option>
        </select>
      </div>

      {/* 🛍 Product Grid */}
      {currentProducts.length === 0 ? (
        <p className="text-center text-muted mt-4">No products found.</p>
      ) : (
        <div className="row">
          {currentProducts.map((product) => (
            <div className="col-6 col-md-3 mb-4" key={product._id}>
              <div className="card h-100 shadow-sm position-relative">
                <button
                    className="btn btn-light position-absolute top-0 end-0 m-2 p-2 rounded-circle"
                    onClick={() => toggleWishlist(product)}
                    style={{
                      zIndex: 5,
                      border: "none",
                      boxShadow: "0 0 5px rgba(0,0,0,0.1)",
                    }}
                  >
                    {wishlist.some((item) => item._id === product._id) ? (
                      <FaHeart color="red" />
                    ) : (
                      <FaRegHeart color="gray" />
                    )}
                  </button>


                <Link
                  to={`/product/${product._id}`}
                  className="text-decoration-none text-dark"
                >
                  <img
                    src={product.image}
                    className="card-img-top"
                    alt={product.name}
                    style={{
                      height: "180px",
                      objectFit: "cover",
                    }}
                  />
                  <div className="card-body text-center">
                    <h6 className="fw-semibold text-truncate">
                      {product.name}
                    </h6>
                    <p
                      className="text-muted small text-truncate"
                      style={{ height: "35px" }}
                    >
                      {product.description}
                    </p>
                    <p className="fw-bold mb-2">
                      ₦{product.price.toLocaleString()}
                    </p>
                    <button className="btn btn-dark w-100 btn-sm">
                      View Details
                    </button>
                  </div>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 📄 Pagination */}
      {totalPages > 1 && (
        <div className="d-flex justify-content-center mt-4 gap-2 flex-wrap">
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`btn btn-sm ${
                currentPage === i + 1 ? "btn-primary" : "btn-outline-primary"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Products;
