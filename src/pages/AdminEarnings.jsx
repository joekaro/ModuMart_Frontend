import React, { useEffect, useState } from "react";
import axios from "../utils/axios";
import {
  Spinner,
  Alert,
  Card,
  Row,
  Col,
} from "react-bootstrap";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function AdminEarnings() {
  const [stats, setStats] = useState(null);
  const [topProducts, setTopProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [containerReady, setContainerReady] = useState(false);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const [earningsRes, productsRes] = await Promise.all([
          axios.get("/orders/earnings"),
          axios.get("/orders/top-products"),
        ]);

        setStats(earningsRes.data);
        setTopProducts(productsRes.data);
      } catch (err) {
        setError("Failed to load analytics data.");
      } finally {
        setLoading(false);
        // Small delay to ensure chart container has dimensions
        setTimeout(() => setContainerReady(true), 100);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading)
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" />
      </div>
    );

  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <div className="container py-3">
      <h3 className="fw-bold text-primary mb-3">Analytics Overview</h3>

      {/* === Summary Cards === */}
      <Row className="g-3">
        {[
          {
            label: "Total Revenue",
            value: `₦${stats.totalRevenue?.toLocaleString()}`,
            color: "text-success",
          },
          {
            label: "Total Orders",
            value: stats.totalOrders,
            color: "text-primary",
          },
          {
            label: "Paid Orders",
            value: stats.paidOrders,
            color: "text-info",
          },
        ].map((item, idx) => (
          <Col key={idx} xs={12} sm={6} lg={4}>
            <Card className="shadow-sm border-0 h-100">
              <Card.Body className="d-flex flex-column justify-content-center text-center">
                <h6 className="text-muted">{item.label}</h6>
                <h3 className={`fw-bold ${item.color}`}>{item.value}</h3>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* === Recent Earnings Chart === */}
      {stats.recentEarnings && stats.recentEarnings.length > 0 && (
        <Card className="shadow-sm border-0 mt-4">
          <Card.Body>
            <h5 className="fw-semibold mb-3 text-center text-md-start">
              Recent 7 Days Earnings
            </h5>
            <div style={{ width: "100%", height: "300px" }}>
              {containerReady && (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={stats.recentEarnings.map((d) => ({
                      date: new Date(d.date).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                      }),
                      total: d.total,
                    }))}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip formatter={(val) => `₦${val.toLocaleString()}`} />
                    <Bar dataKey="total" fill="#0d6efd" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </Card.Body>
        </Card>
      )}

      {/* === Top Products === */}
      {topProducts && topProducts.length > 0 && (
        <Card className="shadow-sm border-0 mt-4">
          <Card.Body>
            <h5 className="fw-semibold mb-3 text-center text-md-start">
              Top 5 Selling Products
            </h5>

            <div className="table-responsive">
              <table className="table table-striped align-middle text-nowrap mb-0">
                <thead className="table-primary">
                  <tr>
                    <th>#</th>
                    <th>Product</th>
                    <th>Units Sold</th>
                    <th>Total Revenue (₦)</th>
                  </tr>
                </thead>
                <tbody>
                  {topProducts.map((p, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td className="d-flex align-items-center gap-2">
                        {p.image && (
                          <img
                            src={p.image}
                            alt={p._id}
                            width="40"
                            height="40"
                            className="rounded"
                          />
                        )}
                        <span>{p._id}</span>
                      </td>
                      <td>{p.totalSold}</td>
                      <td>{p.totalRevenue.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card.Body>
        </Card>
      )}
    </div>
  );
}

export default AdminEarnings;
