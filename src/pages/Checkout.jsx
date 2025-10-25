// src/pages/Checkout.jsx
import { useState } from "react";
import { useCart } from "../context/cartContext";
import api from "../api/axios";
import { Form, Button, Spinner } from "react-bootstrap";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Checkout = () => {
  const { cart, clearCart } = useCart();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    address: "",
    city: "",
    postalCode: "",
    country: "",
    email: "",
  });
  const [loading, setLoading] = useState(false);

  const adminInfo = JSON.parse(localStorage.getItem("adminInfo") || "null");
  const userInfo = JSON.parse(localStorage.getItem("userInfo") || "null");

  const token = userInfo?.token || adminInfo?.token || null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCheckout = async (e) => {
    e.preventDefault();

    if (!token) {
      toast.warning("Please login to proceed with checkout.");
      navigate("/login");
      return;
    }

    if (cart.length === 0) {
      toast.warning("Your cart is empty!");
      return;
    }

    setLoading(true);
    try {
      // 1️⃣ Create a new order
      const { data: order } = await api.post(
        "/orders",
        {
          orderItems: cart.map((item) => ({
            name: item.name,
            qty: item.quantity,
            image: item.image,
            price: item.price,
            product: item._id,
          })),
          shippingAddress: {
            address: formData.address,
            city: formData.city,
            postalCode: formData.postalCode,
            country: formData.country,
          },
          paymentMethod: "Paystack",
          itemsPrice: cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
          taxPrice: 0,
          shippingPrice: 0,
          totalPrice: cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
          email: formData.email,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // 2️⃣ Initialize Paystack payment
      const { data: paystackInit } = await api.post(
        `/orders/${order._id}/init`,
        { email: formData.email },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (paystackInit?.authorization_url) {
        toast.info("Redirecting to Paystack...");
        window.location.href = paystackInit.authorization_url;
      } else {
        throw new Error("Failed to get Paystack payment link.");
      }

      clearCart();
    } catch (error) {
      console.error("Checkout error:", error.response?.data || error.message);
      toast.error(error.response?.data?.message || "Checkout failed! Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Checkout</h2>
      <Form onSubmit={handleCheckout}>
        <Form.Group className="mb-3">
          <Form.Label>Address</Form.Label>
          <Form.Control
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>City</Form.Label>
          <Form.Control
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Postal Code</Form.Label>
          <Form.Control
            type="text"
            name="postalCode"
            value={formData.postalCode}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Country</Form.Label>
          <Form.Control
            type="text"
            name="country"
            value={formData.country}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Button type="submit" variant="success" disabled={loading}>
          {loading ? <Spinner animation="border" size="sm" /> : "Pay with Paystack"}
        </Button>
      </Form>
    </div>
  );
};

export default Checkout;
