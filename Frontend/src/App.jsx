import { Routes, Route, useLocation } from 'react-router-dom';
import Home from "./Pages/Home";
import About from "./Pages/About";
import Shop from "./Pages/Shop";
import Deals from "./Pages/Deals";
import Contact from "./Pages/Contact";
import Login from "./Pages/Login";
import Signup from "./Pages/Signup";
import Navbar from "./Components/Navbar";
import ViewProduct from './Pages/View';
import Cart from './Pages/cart';
import AccountSettings from './Pages/Account';
import YourOrders from './Pages/yourorders';

const App = () => {
  const location = useLocation();

  const hideNavbarRoutes = ['/login', '/signup'];

  return (
    <>

      {!hideNavbarRoutes.includes(location.pathname) && <Navbar />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/deals" element={<Deals />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path='/product/:id' element={<ViewProduct/>}/>
        <Route path='/cart' element={<Cart />}/>
        <Route path='/account' element={<AccountSettings />}/>
        <Route path="/orders" element={<YourOrders />} />

      </Routes>
    </>
  );
};

export default App;
