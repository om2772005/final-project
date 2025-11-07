// src/pages/AdminSiteSettings.jsx
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Save, Info, Layers } from "lucide-react";

export default function AdminSiteSettings() {
  const [info, setInfo] = useState({
    siteName: "",
    about: "",
    contactEmail: "",
    contactPhone: "",
    address: "",
    categories: [],
    socialLinks: { facebook: "", instagram: "", twitter: "", linkedin: "" },
  });
  const [newCategory, setNewCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    fetch("http://localhost:3000/site-info")
      .then((res) => res.json())
      .then((data) => setInfo(data))
      .catch((err) => console.error(err));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("socialLinks.")) {
      const key = name.split(".")[1];
      setInfo((prev) => ({
        ...prev,
        socialLinks: { ...prev.socialLinks, [key]: value },
      }));
    } else {
      setInfo((prev) => ({ ...prev, [name]: value }));
    }
  };

  const addCategory = () => {
    if (newCategory.trim() && !info.categories.includes(newCategory.trim())) {
      setInfo((prev) => ({ ...prev, categories: [...prev.categories, newCategory.trim()] }));
      setNewCategory("");
    }
  };

  const removeCategory = (cat) => {
    setInfo((prev) => ({ ...prev, categories: prev.categories.filter((c) => c !== cat) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("http://localhost:3000/site-info", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(info),
      });
      const data = await res.json();
      setInfo(data);
      alert("Site info updated successfully!");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setTimeout(() => setSuccessMsg(""), 3000);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="max-w-4xl mx-auto mt-10 space-y-8"
    >
      <h1 className="text-3xl font-bold text-black mb-6">Admin - Site Settings</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-gradient-to-br from-zinc-900 via-gray-800 to-black p-6 rounded-2xl border border-gray-700 shadow-2xl space-y-6"
      >
        {successMsg && <p className="text-green-400 font-semibold">{successMsg}</p>}

        {/* Site Name & About */}
        <div className="space-y-4">
          <label className="block text-white font-semibold">Site Name</label>
          <input
            type="text"
            name="siteName"
            value={info.siteName}
            onChange={handleChange}
            className="w-full p-2 rounded-lg bg-gray-800 text-white border border-gray-700"
            required
          />

          <label className="block text-white font-semibold">About</label>
          <textarea
            name="about"
            value={info.about}
            onChange={handleChange}
            className="w-full p-2 rounded-lg bg-gray-800 text-white border border-gray-700"
            rows={3}
          />
        </div>

        {/* Contact Info */}
        <div className="space-y-4">
          <label className="block text-white font-semibold">Contact Email</label>
          <input
            type="email"
            name="contactEmail"
            value={info.contactEmail}
            onChange={handleChange}
            className="w-full p-2 rounded-lg bg-gray-800 text-white border border-gray-700"
          />
          <label className="block text-white font-semibold">Contact Phone</label>
          <input
            type="text"
            name="contactPhone"
            value={info.contactPhone}
            onChange={handleChange}
            className="w-full p-2 rounded-lg bg-gray-800 text-white border border-gray-700"
          />
          <label className="block text-white font-semibold">Address</label>
          <input
            type="text"
            name="address"
            value={info.address}
            onChange={handleChange}
            className="w-full p-2 rounded-lg bg-gray-800 text-white border border-gray-700"
          />
        </div>

        {/* Categories */}
        <div className="space-y-2">
          <label className="block text-white font-semibold">Categories</label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              placeholder="Add new category"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              className="flex-1 p-2 rounded-lg bg-gray-800 text-white border border-gray-700"
            />
            <button
              type="button"
              onClick={addCategory}
              className="px-4 py-2 bg-green-600 hover:bg-green-500 rounded-lg font-semibold"
            >
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {info.categories.map((cat, idx) => (
              <span
                key={idx}
                className="bg-gray-700 text-white px-3 py-1 rounded-full flex items-center gap-2"
              >
                {cat}
                <button
                  type="button"
                  onClick={() => removeCategory(cat)}
                  className="text-red-400 font-bold"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Social Links */}
       {/* Social Links */}
<div className="space-y-4">
  <label className="block text-white font-semibold">Social Links</label>
  {Object.keys(info.socialLinks || {}).map((key) => (
    <input
      key={key}
      type="text"
      name={`socialLinks.${key}`}
      placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
      value={info.socialLinks[key] || ""}
      onChange={handleChange}
      className="w-full p-2 rounded-lg bg-gray-800 text-white border border-gray-700"
    />
  ))}
</div>


        {/* Save Button */}
        <button
          type="submit"
          className={`w-full flex items-center justify-center gap-2 px-4 py-2 bg-yellow-600 hover:bg-yellow-500 rounded-lg font-semibold shadow-md ${
            loading ? "opacity-70 cursor-not-allowed" : ""
          }`}
          disabled={loading}
        >
          <Save size={18} /> {loading ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </motion.div>
  );
}
