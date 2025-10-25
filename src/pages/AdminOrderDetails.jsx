import React, { useEffect, useState } from "react";
import axios from "../utils/axios";
import { useParams, useNavigate } from "react-router-dom";
import { Spinner } from "react-bootstrap";

const AdminOrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updating, setUpdating] = useState(false);

  // ✅ Fetch order
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const adminInfo = localStorage.getItem("adminInfo")
          ? JSON.parse(localStorage.getItem("adminInfo"))
          : null;

        const config = {
          headers: {
            Authorization: adminInfo ? `Bearer ${adminInfo.token}` : "",
          },
        };

        const { data } = await axios.get(`/orders/${id}`, config);
        setOrder(data);
      } catch (err) {
        console.error("Error fetching order:", err.response?.data || err.message);
        setError(err.response?.data?.message || "Failed to fetch order details.");
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  // ✅ Mark as Paid
  const markAsPaid = async () => {
    if (!window.confirm("Confirm marking this order as Paid?")) return;
    try {
      setUpdating(true);
      const adminInfo = JSON.parse(localStorage.getItem("adminInfo"));
      await axios.put(`/orders/${id}/pay`, {}, {
        headers: { Authorization: `Bearer ${adminInfo.token}` },
      });
      setOrder((prev) => ({ ...prev, isPaid: true }));
    } catch (err) {
      console.error("Error marking paid:", err);
      alert("Failed to mark as paid.");
    } finally {
      setUpdating(false);
    }
  };

  // ✅ Mark as Delivered
  const markAsDelivered = async () => {
    if (!window.confirm("Confirm marking this order as Delivered?")) return;
    try {
      setUpdating(true);
      const adminInfo = JSON.parse(localStorage.getItem("adminInfo"));
      await axios.put(`/orders/${id}/deliver`, {}, {
        headers: { Authorization: `Bearer ${adminInfo.token}` },
      });
      setOrder((prev) => ({ ...prev, isDelivered: true }));
    } catch (err) {
      console.error("Error marking delivered:", err);
      alert("Failed to mark as delivered.");
    } finally {
      setUpdating(false);
    }
  };

  if (loading)
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "60vh" }}>
        <Spinner animation="border" variant="primary" />
      </div>
    );

  if (error)
    return <div className="alert alert-danger text-center my-4">{error}</div>;

  return (
    <div className="card shadow-sm border-0">
      <div className="card-body">
        {/* Back Button */}
        <button
          className="btn btn-outline-secondary mb-3"
          onClick={() => navigate("/admin/orders")}
        >
          ← Back to Orders
        </button>

        <h4 className="fw-bold text-primary mb-4 text-center text-md-start">
          Order Details
        </h4>

        {order ? (
          <>
            <div className="row">
              {/* Order Info */}
              <div className="col-12 col-md-6 mb-4">
                <div className="border rounded p-3 bg-light h-100">
                  <h6 className="fw-bold mb-3">Order Info</h6>
                  <p><strong>Order ID:</strong> {order._id}</p>
                  <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleString()}</p>
                  <p>
                    <strong>Status:</strong>{" "}
                    {order.isDelivered ? (
                      <span className="badge bg-success">Delivered</span>
                    ) : order.isPaid ? (
                      <span className="badge bg-info text-dark">Paid</span>
                    ) : (
                      <span className="badge bg-warning text-dark">Pending</span>
                    )}
                  </p>
                  <p><strong>Total:</strong> ₦{order.totalPrice?.toLocaleString()}</p>

                  {/* ✅ Action Buttons */}
                  <div className="mt-3 d-flex flex-wrap gap-2">
                    {!order.isPaid && (
                      <button
                        onClick={markAsPaid}
                        disabled={updating}
                        className="btn btn-sm btn-outline-info"
                      >
                        {updating ? "Updating..." : "Mark as Paid"}
                      </button>
                    )}
                    {order.isPaid && !order.isDelivered && (
                      <button
                        onClick={markAsDelivered}
                        disabled={updating}
                        className="btn btn-sm btn-outline-success"
                      >
                        {updating ? "Updating..." : "Mark as Delivered"}
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Customer Info */}
              <div className="col-12 col-md-6 mb-4">
                <div className="border rounded p-3 bg-light h-100">
                  <h6 className="fw-bold mb-3">Customer Info</h6>
                  <p><strong>Name:</strong> {order.user?.name || "N/A"}</p>
                  <p><strong>Email:</strong> {order.user?.email || "N/A"}</p>
                  <p>
                    <strong>Address:</strong>{" "}
                    {order.shippingAddress
                      ? `${order.shippingAddress.address}, ${order.shippingAddress.city}`
                      : "N/A"}
                  </p>
                </div>
              </div>
            </div>

            {/* Ordered Items */}
            <div className="mt-3">
              <h6 className="fw-bold mb-3">Ordered Items</h6>
              {order.orderItems?.length > 0 ? (
                <div className="table-responsive">
                  <table className="table table-striped align-middle text-nowrap">
                    <thead className="table-primary">
                      <tr>
                        <th>Product</th>
                        <th>Qty</th>
                        <th>Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      {order.orderItems.map((item, index) => (
                        <tr key={index}>
                          <td>{item.name}</td>
                          <td>{item.qty}</td>
                          <td>₦{item.price.toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-muted">No items found in this order.</p>
              )}
            </div>
          </>
        ) : (
          <p className="text-muted text-center">No order details available.</p>
        )}
      </div>
    </div>
  );
};

export default AdminOrderDetail;
