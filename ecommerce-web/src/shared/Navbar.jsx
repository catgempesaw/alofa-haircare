import { useState, useContext, useEffect } from "react";
import { FaUserAlt, FaShoppingCart } from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { CartContext } from "../components/CartContext";
import { AuthContext } from "../components/AuthContext"; // Import AuthContext
import { ClipLoader } from "react-spinners";
import NavbarBG from "../../../public/static/alofa-navbar-white.png";
import CartOverview from "./CartOverview";

const Navbar = () => {
  const [hovered, setHovered] = useState(false);
  const { loading, resetCart } = useContext(CartContext); // Removed unused variables
  const location = useLocation(); // Get the current route
  const navigate = useNavigate(); // For navigation

  const { user, role, signOut } = useContext(AuthContext); // Use 'user' instead of 'token'

  const isAuthPage =
    location.pathname === "/login" || location.pathname === "/signup";
  const isCheckoutPage = location.pathname === "/checkout";
  const isLoggedIn = Boolean(user); // Use 'user' to determine if logged in

  // Check if the current page is `/profile`
  const isProfilePage = location.pathname.startsWith("/profile");

  // Handle logout
  const handleLogout = async () => {
    localStorage.removeItem("auth_token");
    signOut();
    await resetCart();
    // Redirect to home page
    navigate("/");
  };

  useEffect(() => {
    console.log("Current user:", user); // Log 'user' instead of 'token'
    console.log("Current role:", role); // Debugging log to check role value
  }, [user, role]);

  if (loading) {
    return (
      <div className="relative">
        {loading && (
          <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center z-50">
            <ClipLoader size={50} color="#E53E3E" loading={loading} />
          </div>
        )}
      </div>
    );
  }

  return (
    <header
      className={`${
        isCheckoutPage
          ? "w-full z-50 h-16 bg-checkout-gradient shadow-white-3"
          : "fixed top-0 w-full z-50 h-16 bg-white shadow-md"
      }`}
      style={
        isProfilePage
          ? {
              backgroundImage: `url(${NavbarBG})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }
          : {}
      }
    >
      <nav className="container mx-auto flex items-center justify-between px-4 py-2 h-full">
        <div
          className={`flex ${
            isCheckoutPage ? "justify-center w-full" : "justify-center"
          } items-center gap-8`}
        >
          {/* Logo */}
          <a
            href="/"
            className={`${
              isCheckoutPage
                ? "text-white text-3xl font-bold"
                : "bg-gradient-to-b from-alofa-pink via-alofa-pink to-alofa-light-pink bg-clip-text text-transparent text-4xl"
            } font-title mt-2`}
          >
            alofa
          </a>

          {/* Navigation Links - Hidden on Auth Pages */}
          {!isAuthPage && !isCheckoutPage && (
            <div className="text-lg font-body text-alofa-pink sm:flex items-center gap-8 hidden">
              <Link
                to="/"
                className="hover:text-pink-700 items-baseline gap-2 pl-3"
              >
                Home
              </Link>
              <Link
                to="/products"
                className="hover:text-pink-700 flex items-baseline gap-2"
              >
                Products
              </Link>
              <Link
                to="/frequently-asked-questions"
                className="hover:text-pink-700 flex items-baseline gap-2"
              >
                FAQs
              </Link>
            </div>
          )}
        </div>

        {/* Right Section - Cart Icon (if on /checkout) */}
        {isCheckoutPage && (
          <div className="flex items-center justify-start">
            <Link to="/shoppingcart">
              <div className="text-white p-3 rounded-full cursor-pointer">
                <FaShoppingCart size={20} />
              </div>
            </Link>
          </div>
        )}

        {/* Right-side Content */}
        <div className="text-lg text-alofa-pink sm:flex items-center gap-4 hidden">
          {isAuthPage ? (
            // Show Home link on the right only when on login or signup page
            <Link to="/" className="hover:text-pink-700 items-baseline gap-2">
              Home
            </Link>
          ) : (
            // For non-auth pages
            <>
              {isLoggedIn && !isCheckoutPage ? (
                // When user is logged in
                <>
                  <Link
                    to="/profile"
                    className="hover:text-pink-700 flex items-center gap-2"
                  >
                    <FaUserAlt />
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="hover:text-pink-700 flex items-center gap-2"
                  >
                    Logout
                  </button>
                  {/* Shopping Cart Icon */}
                  <div
                    className="relative"
                    onMouseEnter={() => setHovered(true)}
                    onMouseLeave={() => setHovered(false)}
                  >
                    <div className="text-[#FE699F] p-3 rounded-full transition-colors duration-300 hover:delay-700 hover:text-gray-500 cursor-pointer">
                      <FaShoppingCart />
                    </div>
                    <CartOverview hovered={hovered} setHovered={setHovered} />
                  </div>
                </>
              ) : !isCheckoutPage ? (
                // When user is not logged in
                <>
                  <Link
                    to="/login"
                    className="hover:text-pink-700 flex items-center gap-2"
                  >
                    Login
                  </Link>
                  <p>|</p>
                  <Link
                    to="/signup"
                    className="hover:text-pink-700 flex items-center gap-2"
                  >
                    Sign Up
                  </Link>
                  {/* Shopping Cart Icon */}
                  <div
                    className="relative"
                    onMouseEnter={() => setHovered(true)}
                    onMouseLeave={() => setHovered(false)}
                  >
                    <div className="text-[#FE699F] p-3 rounded-full transition-colors duration-300 hover:delay-700 hover:text-gray-500 cursor-pointer">
                      <FaShoppingCart />
                    </div>
                    <CartOverview hovered={hovered} setHovered={setHovered} />
                  </div>
                </>
              ) : null}
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
