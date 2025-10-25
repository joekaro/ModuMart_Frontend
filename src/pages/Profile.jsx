import React, { useState, useEffect } from "react";
import axiosInstance from "../utils/axios";
import { Container, Row, Col, Card, Form, Button, Spinner, Badge } from "react-bootstrap";

const Profile = () => {
  const storedUser = localStorage.getItem("userInfo");
  const [userInfo, setUserInfo] = useState(storedUser ? JSON.parse(storedUser) : null);
  const [profile, setProfile] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        if (!userInfo || !userInfo._id) {
          setLoading(false);
          return;
        }

        // Fetch user profile
        const userRes = await axiosInstance.get(`/users/profile`);
        setProfile(userRes.data);

        // Fetch user orders
        const orderRes = await axiosInstance.get("/orders/myorders");

        console.log("✅ Orders API response:", orderRes.data);

        // Ensure array
        if (Array.isArray(orderRes.data)) {
          setOrders(orderRes.data);
        } else if (orderRes.data.orders && Array.isArray(orderRes.data.orders)) {
          setOrders(orderRes.data.orders);
        } else {
          setOrders([]);
        }

        setFormData({
          name: userRes.data.name || "",
          email: userRes.data.email || "",
          password: "",
        });
      } catch (error) {
        console.error("❌ Error loading profile:", error.response?.data || error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      if (!userInfo || !userInfo._id) return alert("You must be logged in.");

      setUpdating(true);
      const { data } = await axiosInstance.put(`/users/profile`, formData);
      alert("Profile updated successfully!");
      setProfile(data);
    } catch (error) {
      console.error(error);
      alert("Error updating profile");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  if (!userInfo) {
    return (
      <Container className="text-center mt-5">
        <h5>Please log in to view your profile</h5>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <Row>
        {/* USER INFO */}
        <Col md={4}>
          <Card className="shadow-sm mb-3">
            <Card.Body>
              <h5 className="fw-bold text-center mb-3">User Information</h5>
              {profile ? (
                <>
                  <p><strong>Name:</strong> {profile.name}</p>
                  <p><strong>Email:</strong> {profile.email}</p>
                  <p><strong>Role:</strong> {profile.isAdmin ? "Admin" : "User"}</p>
                </>
              ) : (
                <p className="text-muted">Unable to load user details</p>
              )}
            </Card.Body>
          </Card>
        </Col>

        {/* UPDATE FORM + ORDERS */}
        <Col md={8}>
          <Card className="shadow-sm mb-3 p-3">
            <h5 className="fw-bold mb-3">Update Profile</h5>
            <Form onSubmit={handleUpdate}>
              <Form.Group className="mb-3">
                <Form.Label>Full Name</Form.Label>
                <Form.Control
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Email Address</Form.Label>
                <Form.Control
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>New Password</Form.Label>
                <Form.Control
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Leave blank to keep current password"
                />
              </Form.Group>

              <Button type="submit" variant="primary" disabled={updating}>
                {updating ? "Updating..." : "Update Profile"}
              </Button>
            </Form>
          </Card>

          <Card className="shadow-sm p-3">
            <h5 className="fw-bold mb-3">My Orders</h5>
            {!orders || orders.length === 0 ? (
              <p>No orders yet.</p>
            ) : (
              <div className="table-responsive">
                <table className="table table-striped align-middle text-center">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Total</th>
                      <th>Payment</th>
                      <th>Delivery</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order._id}>
                        <td>{order._id}</td>
                        <td>₦{order.totalPrice?.toLocaleString()}</td>
                        <td>
                          {order.isPaid ? (
                            <Badge bg="success">Paid</Badge>
                          ) : (
                            <Badge bg="warning">Pending</Badge>
                          )}
                        </td>
                        <td>
                          {order.isDelivered ? (
                            <Badge bg="success">Delivered</Badge>
                          ) : (
                            <Badge bg="secondary">Not Delivered</Badge>
                          )}
                        </td>
                        <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Profile;
