import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetails from "./pages/productDetails";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import NotFound from "./pages/NotFound";
import UserLogin from "./pages/UserLogin";
import UserRegister from "./pages/UserRegister";
import PaymentSuccess from "./pages/PaymentSuccess";
import Profile from "./pages/Profile";
import AboutUs from "./pages/AboutUs";
import Wishlist from "./pages/Wishlist";

// Admin
import AdminLayout from "./layouts/AdminLayout";
import AdminDashboard from "./pages/AdminDashboard";
import AdminProductList from "./pages/AdminProductList";
import AdminAddProduct from "./pages/AdminAddProduct";
import AdminEditProduct from "./pages/AdminEditProduct";
import AdminUserList from "./pages/AdminUserList";
import AdminEditUser from "./pages/AdminEditUser";
import AdminOrder from "./pages/AdminOrder";
import AdminLogin from "./pages/AdminLogin";
import AdminOrderDetail from "./pages/AdminOrderDetails";
import AdminEarnings from "./pages/AdminEarnings";

// ✅ Protected routes
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute"; // 👈 NEW

function App() {
  return (
    <Router>
      <Routes>
        {/* ✅ Public Routes with Navbar */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/login" element={<UserLogin />} />
          <Route path="/register" element={<UserRegister />} />
          <Route path="/payment-success" element={<PaymentSuccess />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/about" element={<AboutUs />} />
        </Route>

        {/* ✅ Admin Login (public) */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* ✅ Admin Protected Routes */}
        <Route path="/admin" element={ <AdminRoute><AdminLayout /></AdminRoute>}>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="products" element={<AdminProductList />} />
          <Route path="add-product" element={<AdminAddProduct />} />
          <Route path="edit-product/:id" element={<AdminEditProduct />} />
          <Route path="users" element={<AdminUserList />} />
          <Route path="edit-user/:id" element={<AdminEditUser />} />
          <Route path="orders" element={<AdminOrder />} />
          <Route path="order/:id" element={<AdminOrderDetail />} />
          <Route path="earnings" element={<AdminEarnings />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
