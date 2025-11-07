import { useEffect, useState } from "react";
import { ChevronDown, ChevronUp, Search, Loader2 } from "lucide-react";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [expanded, setExpanded] = useState({});
  const [searchPrevious, setSearchPrevious] = useState({});
  const [searchPending, setSearchPending] = useState({});
  const [loading, setLoading] = useState(true);

  // 🧠 Fetch real data from backend
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("http://localhost:3000/users", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const data = await res.json();
        setUsers(data);
      } catch (err) {
        console.error("Error fetching users:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const toggleExpand = (userId, section) => {
    setExpanded((prev) => ({
      ...prev,
      [userId]: {
        ...prev[userId],
        [section]: !prev[userId]?.[section],
      },
    }));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[80vh]">
        <Loader2 className="animate-spin text-gray-600" size={40} />
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">User Information</h2>

      {users.length === 0 ? (
        <p className="text-gray-500 text-center">No users found.</p>
      ) : (
        <div className="space-y-6">
          {users.map((u) => {
            const filteredPrevious = u.previousOrders.filter(
              (o) =>
                o.orderId
                  ?.toLowerCase()
                  .includes((searchPrevious[u._id] || "").toLowerCase()) ||
                o.products.some((p) =>
                  p.name
                    .toLowerCase()
                    .includes((searchPrevious[u._id] || "").toLowerCase())
                )
            );

            const filteredPending = u.pendingOrders.filter(
              (o) =>
                o.orderId
                  ?.toLowerCase()
                  .includes((searchPending[u._id] || "").toLowerCase()) ||
                o.products.some((p) =>
                  p.name
                    .toLowerCase()
                    .includes((searchPending[u._id] || "").toLowerCase())
                )
            );

            return (
              <div
                key={u._id}
                className="bg-white shadow-xl rounded-xl p-6 border border-gray-200 hover:shadow-2xl transition"
              >
                {/* 🧑 Basic Info */}
                <div className="mb-4">
                  <p className="text-xl font-semibold text-gray-800">{u.name}</p>
                  <p className="text-gray-600">{u.email}</p>
                  <p className="text-sm text-gray-500">
                    Joined: {new Date(u.createdAt).toLocaleDateString()}
                  </p>
                </div>

                {/* 🛒 Cart */}
                {u.cart?.length > 0 && (
                  <div className="mb-4">
                    <h3 className="text-lg font-bold mb-2 text-gray-700">
                      Cart Items
                    </h3>
                    <div className="space-y-2">
                      {u.cart.map((item) => (
                        <div
                          key={item.id}
                          className="flex justify-between bg-gray-100 p-3 rounded-lg"
                        >
                          <span>
                            {item.name} × {item.qty}
                          </span>
                          <span>₹{item.price}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* ✅ Previous Orders */}
                <div className="mb-4">
                  <button
                    className="flex justify-between w-full items-center bg-blue-600 text-white px-4 py-2 rounded-lg"
                    onClick={() => toggleExpand(u._id, "previous")}
                  >
                    <span>Previous Orders</span>
                    {expanded[u._id]?.previous ? <ChevronUp /> : <ChevronDown />}
                  </button>

                  {expanded[u._id]?.previous && (
                    <div className="mt-3 space-y-4">
                      {/* 🔍 Search */}
                      <div className="flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-2 border border-gray-300">
                        <Search className="text-gray-500" size={18} />
                        <input
                          type="text"
                          placeholder="Search by Order ID or Product"
                          value={searchPrevious[u._id] || ""}
                          onChange={(e) =>
                            setSearchPrevious((prev) => ({
                              ...prev,
                              [u._id]: e.target.value,
                            }))
                          }
                          className="w-full bg-transparent outline-none"
                        />
                      </div>

                      {filteredPrevious.length === 0 ? (
                        <p className="text-gray-500 text-sm">
                          No previous orders found.
                        </p>
                      ) : (
                        filteredPrevious.map((order) => (
                          <div
                            key={order.orderId}
                            className="border rounded-lg p-4 bg-gray-50"
                          >
                            <p className="font-semibold mb-2">
                              Order #{order.orderId} - {order.date}
                            </p>
                            <div className="space-y-2">
                              {order.products.map((p, idx) => (
                                <div
                                  key={idx}
                                  className="flex justify-between bg-white shadow-sm p-2 rounded-md"
                                >
                                  <span>
                                    {p.name} × {p.qty}
                                  </span>
                                  <span>₹{p.price}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>

                {/* 🟡 Pending Orders */}
                <div>
                  <button
                    className="flex justify-between w-full items-center bg-yellow-600 text-white px-4 py-2 rounded-lg"
                    onClick={() => toggleExpand(u._id, "pending")}
                  >
                    <span>Pending Orders</span>
                    {expanded[u._id]?.pending ? <ChevronUp /> : <ChevronDown />}
                  </button>

                  {expanded[u._id]?.pending && (
                    <div className="mt-3 space-y-4">
                      {/* 🔍 Search */}
                      <div className="flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-2 border border-gray-300">
                        <Search className="text-gray-500" size={18} />
                        <input
                          type="text"
                          placeholder="Search by Order ID or Product"
                          value={searchPending[u._id] || ""}
                          onChange={(e) =>
                            setSearchPending((prev) => ({
                              ...prev,
                              [u._id]: e.target.value,
                            }))
                          }
                          className="w-full bg-transparent outline-none"
                        />
                      </div>

                      {filteredPending.length === 0 ? (
                        <p className="text-gray-500 text-sm">
                          No pending orders found.
                        </p>
                      ) : (
                        filteredPending.map((order) => (
                          <div
                            key={order.orderId}
                            className="border rounded-lg p-4 bg-gray-50"
                          >
                            <p className="font-semibold mb-2">
                              Order #{order.orderId} - {order.date}
                            </p>
                            <div className="space-y-2">
                              {order.products.map((p, idx) => (
                                <div
                                  key={idx}
                                  className="flex justify-between bg-white shadow-sm p-2 rounded-md"
                                >
                                  <span>
                                    {p.name} × {p.qty}
                                  </span>
                                  <span>₹{p.price}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
