 import React, { useEffect, useState } from "react";
import "./App.css";

export default function App() {
  const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:5000";
const API_URL = `${API_BASE}/api/users`;


  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    city: "",
  });

  const [error, setError] = useState("");

  const fetchUsers = async () => {
    setError("");
    setLoading(true);
    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error(`GET failed: ${res.status}`);
      const data = await res.json();
      setUsers(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(
        "Cannot load users. Check backend is running and CORS is enabled. " +
          (e?.message || "")
      );
    } finally {
      setLoading(false);
    }
  };

  const addUser = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.name.trim() || !form.email.trim() || !form.city.trim()) {
      setError("Please fill Name, Email, City.");
      return;
    }

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(`POST failed: ${res.status} ${text}`);
      }

      setForm({ name: "", email: "", city: "" });
      await fetchUsers();
    } catch (e2) {
      setError(
        "Cannot add user. Check backend POST endpoint and CORS. " +
          (e2?.message || "")
      );
    }
  };

  const deleteUser = async (id) => {
    setError("");
    try {
      const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error(`DELETE failed: ${res.status}`);
      await fetchUsers();
    } catch (e) {
      setError(
        "Cannot delete user. Check backend DELETE endpoint. " +
          (e?.message || "")
      );
    }
  };

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="page">
      <div className="card">
        <h1 className="title">Senthil User App</h1>
        <p className="sub">React Frontend + Spring Boot Backend + MongoDB</p>

        <div className="row">
          <button className="btn" onClick={fetchUsers} disabled={loading}>
            {loading ? "Loading..." : "Load Users"}
          </button>
          <span className="hint">
            Backend: <code>{API_URL}</code>
          </span>
        </div>

        {error && <div className="error">{error}</div>}

        <form className="form" onSubmit={addUser}>
          <h2 className="sectionTitle">Add User</h2>

          <div className="grid">
            <div className="field">
              <label>Name</label>
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Senthil"
              />
            </div>

            <div className="field">
              <label>Email</label>
              <input
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="senthil@gmail.com"
              />
            </div>

            <div className="field">
              <label>City</label>
              <input
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                placeholder="Ayodhya"
              />
            </div>
          </div>

          <button className="btn primary" type="submit">
            Add User
          </button>
        </form>

        <h2 className="sectionTitle">All Users</h2>

        <div className="tableWrap">
          <table className="table">
            <thead>
              <tr>
                <th style={{ width: "28%" }}>ID</th>
                <th style={{ width: "20%" }}>Name</th>
                <th style={{ width: "27%" }}>Email</th>
                <th style={{ width: "15%" }}>City</th>
                <th style={{ width: "10%" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan="5" className="empty">
                    No users found.
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u.id || u._id}>
                    <td className="mono">{u.id || u._id}</td>
                    <td>{u.name}</td>
                    <td>{u.email}</td>
                    <td>{u.city}</td>
                    <td>
                      <button
                        className="btn danger"
                        onClick={() => deleteUser(u.id || u._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <p className="footer">
        If users are not loading: check backend URL + enable CORS.
      </p>
    </div>
  );
}
