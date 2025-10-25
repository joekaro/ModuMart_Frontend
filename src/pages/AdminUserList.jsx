import { useEffect, useState } from "react";
import axios from "../utils/axios";

function AdminUserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("/users");
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();

    // ✅ Re-fetch when page/tab becomes active
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        fetchUsers();
      }
    };

    window.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      window.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  const deleteUser = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await axios.delete(`/users/${id}`);
        setUsers((prev) => prev.filter((user) => user._id !== id));
      } catch (error) {
        console.error("Error deleting user:", error);
      }
    }
  };

  return (
    <div className="card shadow-sm border-0">
      <div className="card-body">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-3 text-center text-md-start">
          <h4 className="fw-bold text-primary mb-3 mb-md-0">Users</h4>
        </div>

        {loading ? (
          <div className="text-center py-4">
            <div className="spinner-border text-primary" role="status"></div>
          </div>
        ) : users.length === 0 ? (
          <p className="text-muted text-center">No users found.</p>
        ) : (
          <div style={{ overflowX: "auto", width: "100%" }}>
            <div style={{ minWidth: "700px" }}>
              <table className="table table-striped table-hover align-middle text-nowrap mb-0">
                <thead className="table-primary">
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th className="text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user, index) => (
                    <tr key={user._id}>
                      <td>{index + 1}</td>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>
                        {user.isAdmin ? (
                          <span className="badge bg-success">Admin</span>
                        ) : (
                          <span className="badge bg-secondary">User</span>
                        )}
                      </td>
                      <td className="text-center">
                        <div className="d-flex flex-wrap justify-content-center gap-2">
                          <a
                            href={`/admin/edit-user/${user._id}`}
                            className="btn btn-sm btn-outline-primary"
                          >
                            Edit
                          </a>
                          <button
                            onClick={() => deleteUser(user._id)}
                            className="btn btn-sm btn-outline-danger"
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

export default AdminUserList;
