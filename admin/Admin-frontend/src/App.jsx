// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Users from "./pages/Users";
import ViewProducts from "./pages/View";
import Sidebar from "./components/Sidebar";
import Orders from "./pages/Orders";
import AdminSiteSettings from "./pages/Setting";

function App() {
  return (
    <Router>
      <div className="flex h-screen bg-gray-100">
        <Sidebar />
        <div className="flex-1 p-6 overflow-y-auto">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/products" element={<Products />} />
            <Route path="/users" element={<Users />} />
            <Route path='/view-products' element={<ViewProducts />}/>
            <Route path='/orders' element={<Orders />}/>
            <Route path='/settings' element={<AdminSiteSettings/>}/>
            </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
