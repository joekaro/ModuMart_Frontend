import React, { useEffect, useState } from "react";
import axios from "../utils/axios";
import { Form, Button, Spinner, Alert, Card } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";

const AdminEditUser = () => {
  const { id: userId } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const adminInfo = JSON.parse(localStorage.getItem("adminInfo"));
  const token = adminInfo?.token;

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await axios.get(`/users/${userId}`,{
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setName(data.name);
        setEmail(data.email);
        setIsAdmin(data.isAdmin);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch user details.");
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchUser();
    } else {
      setError("Unauthorized access. Please log in again.");
      setLoading(false);
    }
  }, [userId, token]);

  const submitHandler = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      await axios.put(
        `/users/${userId}`,
        { name, email, isAdmin },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSuccess("✅ User updated successfully!");
      setTimeout(() => navigate("/admin/users"), 1500);
    } catch (err) {
      console.error(err);
      setError("❌ Update failed. Please try again.");
    }
  };

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="fw-bold text-primary mb-0">Edit User</h4>
        <Button
          variant="outline-secondary"
          size="sm"
          onClick={() => navigate("/admin/users")}
        >
          ← Back
        </Button>
      </div>

      {loading ? (
        <div className="text-center my-5">
          <Spinner animation="border" />
        </div>
      ) : error ? (
        <Alert variant="danger">{error}</Alert>
      ) : (
        <Card className="shadow-sm border-0">
          <Card.Body>
            {success && <Alert variant="success">{success}</Alert>}

            <Form onSubmit={submitHandler}>
              <Form.Group className="mb-3" controlId="name">
                <Form.Label>Full Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="email">
                <Form.Label>Email Address</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-4" controlId="isAdmin">
                <Form.Check
                  type="checkbox"
                  label="Administrator"
                  checked={isAdmin}
                  onChange={(e) => setIsAdmin(e.target.checked)}
                />
              </Form.Group>

              <div className="d-grid">
                <Button type="submit" variant="primary" size="md">
                  Update User
                </Button>
              </div>
            </Form>
          </Card.Body>
        </Card>
      )}
    </div>
  );
};

export default AdminEditUser;
