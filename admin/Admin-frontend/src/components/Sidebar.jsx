// src/components/Sidebar.jsx
import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, ListOrdered, Package, Plus, Settings, Users } from "lucide-react";


export default function Sidebar() {
  const location = useLocation();

  const navItems = [
    { name: "Dashboard", path: "/", icon: <LayoutDashboard size={20} /> },
    { name: "Add Product", path: "/products", icon: <Plus size={20} /> },
    { name: "Products", path: "/view-products", icon: <Package size={20} /> },
    { name: "Users", path: "/users", icon: <Users size={20} /> },
    { name: "Orders", path: "/orders", icon: <ListOrdered size={20} /> },
    { name: "Settings", path: "/settings", icon: <Settings size={20} /> },
  ];

  return (
    <div className="h-screen w-64 bg-gradient-to-b from-gray-900 via-gray-800 to-black text-white shadow-2xl flex flex-col">
      {/* Brand */}
      <div className="p-6 border-b border-gray-700">
        <h1 className="text-2xl font-extrabold tracking-wide bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
          Admin Panel
        </h1>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-6 space-y-4">
        {navItems.map((item) => {
          const active = location.pathname === item.path;
          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300
                ${
                  active
                    ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg"
                    : "text-gray-300 hover:bg-gray-800 hover:text-white"
                }
              `}
            >
              {item.icon}
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-6 border-t border-gray-700 text-xs text-gray-400">
        © 2025 Admin Panel
      </div>
    </div>
  );
}
