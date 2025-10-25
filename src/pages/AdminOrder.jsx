import { useEffect, useState } from "react";
import axios from "../utils/axios";

function AdminOrder() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("/orders");
      setOrders(data);
    } catch (error) {
      console.error("Error fetching orders:", error.response?.data || error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();

    // ✅ Re-fetch when tab becomes active again
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        fetchOrders();
      }
    };

    window.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      window.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  const handleDelete = async (orderId) => {
    if (!window.confirm("Are you sure you want to delete this order?")) return;
    try {
      await axios.delete(`/orders/${orderId}`);
      setOrders((prev) => prev.filter((o) => o._id !== orderId));
    } catch (error) {
      console.error("Error deleting order:", error);
      alert("Failed to delete order. Check console for details.");
    }
  };

  return (
    <div className="card shadow-sm border-0">
      <div className="card-body">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-3 text-center text-md-start">
          <h4 className="fw-bold text-primary mb-3 mb-md-0">Orders</h4>
        </div>

        {loading ? (
          <div className="text-center py-4">
            <div className="spinner-border text-primary" role="status"></div>
          </div>
        ) : orders.length === 0 ? (
          <p className="text-muted text-center">No orders found.</p>
        ) : (
          <div style={{ overflowX: "auto", width: "100%" }}>
            <div style={{ minWidth: "600px" }}>
              <table className="table table-striped table-hover align-middle text-nowrap mb-0">
                <thead className="table-primary">
                  <tr>
                    <th>#</th>
                    <th>User</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th className="text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order, index) => (
                    <tr key={order._id}>
                      <td>{index + 1}</td>
                      <td>{order.user?.name || "N/A"}</td>
                      <td>₦{order.totalPrice?.toFixed(2)}</td>
                      <td>
                        {order.isDelivered ? (
                          <span className="badge bg-success">Delivered</span>
                        ) : order.isPaid ? (
                          <span className="badge bg-info text-dark">Paid</span>
                        ) : (
                          <span className="badge bg-warning text-dark">Pending</span>
                        )}
                      </td>
                      <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                      <td className="text-center">
                        <div className="d-flex justify-content-center flex-wrap gap-2">
                          <a
                            href={`/admin/order/${order._id}`}
                            className="btn btn-sm btn-outline-primary"
                          >
                            View
                          </a>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleDelete(order._id)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminOrder;
