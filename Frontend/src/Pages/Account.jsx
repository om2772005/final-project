// AccountSettings.jsx
import { useEffect, useState } from "react";
import axios from "axios";

export default function AccountSettings() {
  const [user, setUser] = useState({
    name: "",
    email: "",
    cart: [],
    pendingOrders: [],
    deliveredOrders: [],
  });
  const [editing, setEditing] = useState(false);
  const [passwords, setPasswords] = useState({ current: "", new: "", confirm: "" });
  const [loading, setLoading] = useState(false);

  // Fetch user info
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("/api/user/me");
        // fallback to empty arrays to prevent undefined errors
        setUser({
          ...res.data,
          cart: res.data.cart || [],
          pendingOrders: res.data.pendingOrders || [],
          deliveredOrders: res.data.deliveredOrders || [],
        });
      } catch (err) {
        console.error(err);
        alert("Failed to fetch user data");
      }
    };
    fetchUser();
  }, []);

  // Save profile edits
  const handleSave = async () => {
    setLoading(true);
    try {
      await axios.put("/api/user/update", { name: user.name });
      alert("Profile updated!");
      setEditing(false);
    } catch (err) {
      console.error(err);
      alert("Failed to update profile.");
    }
    setLoading(false);
  };

  // Change password
  const handleChangePassword = async () => {
    if (passwords.new !== passwords.confirm) return alert("Passwords do not match!");
    setLoading(true);
    try {
      await axios.post("/api/user/change-password", passwords);
      alert("Password changed!");
      setPasswords({ current: "", new: "", confirm: "" });
    } catch (err) {
      console.error(err);
      alert("Failed to change password.");
    }
    setLoading(false);
  };

  // Delete account
  const handleDeleteAccount = async () => {
    if (!window.confirm("Are you sure you want to delete your account?")) return;
    setLoading(true);
    try {
      await axios.delete("/api/user/delete");
      alert("Account deleted. Redirecting to login...");
      window.location.href = "/login";
    } catch (err) {
      console.error(err);
      alert("Failed to delete account.");
    }
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-4xl font-bold text-center text-gradient mb-6">Account Settings</h1>

      {/* Profile Card */}
      <section className="bg-gradient-to-r from-purple-100 to-pink-100 shadow-lg p-6 rounded-xl">
        <h2 className="text-2xl font-semibold mb-4">Profile</h2>
        <div className="mb-4">
          <label className="block font-medium mb-1">Name</label>
          <input
            type="text"
            value={user.name}
            disabled={!editing}
            onChange={e => setUser({ ...user, name: e.target.value })}
            className="border px-3 py-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
        </div>
        <div className="mb-4">
          <label className="block font-medium mb-1">Email</label>
          <input
            type="email"
            value={user.email}
            disabled
            className="border px-3 py-2 rounded w-full bg-gray-100"
          />
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="bg-white p-4 rounded shadow hover:shadow-lg transition">
            <p className="text-gray-500">Cart Items</p>
            <p className="text-xl font-bold">{user.cart.length}</p>
          </div>
          <div className="bg-white p-4 rounded shadow hover:shadow-lg transition">
            <p className="text-gray-500">Pending Orders</p>
            <p className="text-xl font-bold">{user.pendingOrders.length}</p>
          </div>
          <div className="bg-white p-4 rounded shadow hover:shadow-lg transition">
            <p className="text-gray-500">Delivered Orders</p>
            <p className="text-xl font-bold">{user.deliveredOrders.length}</p>
          </div>
        </div>

        {!editing ? (
          <button
            onClick={() => setEditing(true)}
            className="bg-purple-500 text-white px-6 py-2 rounded hover:bg-purple-600 transition"
          >
            Edit Profile
          </button>
        ) : (
          <button
            onClick={handleSave}
            disabled={loading}
            className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 transition"
          >
            {loading ? "Saving..." : "Save Profile"}
          </button>
        )}
      </section>

      {/* Change Password Card */}
      <section className="bg-white shadow-lg p-6 rounded-xl">
        <h2 className="text-2xl font-semibold mb-4">Change Password</h2>
        <div className="space-y-2">
          <input
            type="password"
            placeholder="Current Password"
            value={passwords.current}
            onChange={e => setPasswords({ ...passwords, current: e.target.value })}
            className="border px-3 py-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
          <input
            type="password"
            placeholder="New Password"
            value={passwords.new}
            onChange={e => setPasswords({ ...passwords, new: e.target.value })}
            className="border px-3 py-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
          <input
            type="password"
            placeholder="Confirm New Password"
            value={passwords.confirm}
            onChange={e => setPasswords({ ...passwords, confirm: e.target.value })}
            className="border px-3 py-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
          <button
            onClick={handleChangePassword}
            disabled={loading}
            className="bg-yellow-500 text-white px-6 py-2 rounded hover:bg-yellow-600 transition mt-2"
          >
            {loading ? "Updating..." : "Change Password"}
          </button>
        </div>
      </section>

      {/* Danger Zone */}
      <section className="bg-red-100 shadow-lg p-6 rounded-xl">
        <h2 className="text-2xl font-semibold mb-4 text-red-700">Danger Zone</h2>
        <button
          onClick={handleDeleteAccount}
          disabled={loading}
          className="bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600 transition"
        >
          Delete Account
        </button>
      </section>
    </div>
  );
}
