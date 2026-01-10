import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AllUsers.css";

const AllUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get("https://travel-backend-83lh.onrender.com/admin/all-users");
        setUsers(res.data.users || []); // assuming backend sends { users: [...] }
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) {
    return <p>Loading users...</p>;
  }

  return (
    <div className="all-users-container">
      <h2>All Registered Users</h2>
      {users.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <table className="users-table">
          <thead>
            <tr>
              <th>Username</th>
              <th>Phone</th>
              <th>Role</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u, i) => (
              <tr key={i}>
                <td>{u.username}</td>
                <td>{u.phone_no}</td>
                <td>{u.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AllUsers;
