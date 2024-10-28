import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useContext } from "react";
import { CartProvider } from "./components/CartContext.jsx";
import { AuthProvider, AuthContext } from "./components/AuthContext.jsx"; // Import AuthProvider
import Navbar from "./shared/Navbar.jsx";
import Home from "./pages/Home.jsx";
import Products from "./pages/Products.jsx";
import FAQs from "./pages/FAQs.jsx";
import ShoppingCart from "./pages/ShoppingCart.jsx";
import CartItem from "./components/CartItem.jsx";
import Checkout from "./pages/Checkout.jsx";
import Login from "./pages/Login.jsx";
import SignUp from "./pages/SignUp.jsx";

import "./App.css";
import { Toaster } from "sonner";

const AppContent = () => {
  const { setToken } = useContext(AuthContext); // Use setToken from AuthContext

  return (
    <>
      <Toaster richColors position="top-center" />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/frequently-asked-questions" element={<FAQs />} />
        <Route path="/shoppingcart" element={<ShoppingCart />} />
        <Route path="/cartitem" element={<CartItem />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/login" element={<Login setToken={setToken} />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
    </>
  );
};

const App = () => (
  <AuthProvider>
    {" "}
    {/* AuthProvider should be outside */}
    <CartProvider>
      {" "}
      {/* CartProvider should be inside */}
      <Router>
        <AppContent />
      </Router>
    </CartProvider>
  </AuthProvider>
);

export default App;
