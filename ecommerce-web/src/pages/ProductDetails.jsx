import { useParams } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import { CartContext } from "../components/CartContext";
import { getProductVariationById } from "../api/product.js";
import { ClipLoader } from "react-spinners";
import { toast } from "sonner";

const ProductDetails = () => {
  const { cartItems } = useContext(CartContext);
  const { productId } = useParams();
  const [variation, setVariation] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useContext(CartContext);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  useEffect(() => {
    // console.log("Product ID:", productId);
    const fetchProductAndVariation = async () => {
      try {
        const variationData = await getProductVariationById(productId);
        setVariation(variationData[0]);
      } catch (error) {
        console.error("Error fetching product details:", error);
      }
    };
    fetchProductAndVariation();
  }, [productId]);

  useEffect(() => {
    // console.log("Product Variation Updated:", variation);
  }, [variation]);

  const handleAddToCart = () => {
    // console.log("Adding to cart:", variation);
    // console.log(cartItems);

    if (!variation?.variation_id) {
      console.error("Variation ID is missing.");
      toast.error("Unable to add this product. Variation ID is missing.");
      return;
    }

    if (variation.available_stock <= 0) {
      toast.error(
        "This product cannot be added to the cart because it's out of stock.",
      );
      return;
    }

    // Find the existing cart item
    const existingCartItem = cartItems.find(
      (item) => item.variation_id === variation.variation_id,
    );

    if (existingCartItem) {
      const totalQuantity = existingCartItem.quantity + quantity;

      if (totalQuantity > variation.available_stock) {
        toast.error(
          `Insufficient stock quantity! Available stock is ${variation.available_stock}.` +
            (existingCartItem.quantity > 0
              ? ` You currently have ${existingCartItem.quantity} ${existingCartItem.name} ${existingCartItem.value} in your cart.`
              : ""),
        );
        return;
      }
    }

    setIsAddingToCart(true);
    setTimeout(() => {
      const imageName = variation.image
        ? variation.image.split("/").pop()
        : null;

      addToCart({
        id: variation.variation_id,
        image: imageName
          ? `http://localhost:3001/uploads/${imageName}`
          : `https://via.placeholder.com/150?text=No+Image+Available`,
        name: variation.product_name,
        price: parseFloat(variation.unit_price) || 0,
        variation: variation.value,
        quantity,
        sku: variation.sku,
      });

      setIsAddingToCart(false); // Stop loading
    }, 500); // Adjust delay as necessary
  };

  const handleQuantityChange = (e) => {
    // console.log("Quantity Change:", e.target.value);
    const value = parseInt(e.target.value, 10);

    // Find the existing cart item by variation ID
    const existingCartItem = cartItems?.find(
      (item) => item.variation_id === variation?.variation_id,
    );

    // Calculate the total quantity if the item already exists in the cart
    const totalQuantity = existingCartItem
      ? existingCartItem.quantity + value
      : value;

    // Check if the total quantity exceeds stock quantity
    if (totalQuantity > variation?.available_stock) {
      toast.error(
        `Insufficient stock! Available stock is ${variation.available_stock}.` +
          (existingCartItem?.quantity > 0
            ? ` You currently have ${existingCartItem.quantity} ${existingCartItem.name} ${existingCartItem.value} in your cart.`
            : ""),
      );

      setQuantity(
        variation.available_stock - (existingCartItem?.quantity || 0),
      ); // Adjust the quantity to the remaining stock
      return;
    }

    if (value > variation.available_stock) {
      toast.error("Exceeds available stock!");
      setQuantity(variation.available_stock);
    } else if (!isNaN(value) && value >= 1) {
      setQuantity(value);
    } else if (e.target.value === "") {
      setQuantity("");
    }
  };

  return (
    <div className="min-h-screen bg-[url('../../public/images/body-bg.png')] bg-cover bg-center flex justify-center items-center">
      {/* Centered Content Container */}
      <div className="p-16 max-w-7xl w-full lg:w-4/5 flex flex-col lg:flex-row gap-16">
        {/* Render Product Image and Details only if product is not null */}
        {variation ? (
          <>
            {/* Product Image */}
            <div className="w-full lg:w-1/2 flex justify-center items-center">
              <img
                src={
                  variation && variation.image
                    ? `http://localhost:3001/uploads/${variation.image.split("/").pop()}`
                    : "https://via.placeholder.com/150?text=No+Image+Available"
                }
                alt={variation ? variation.product_name : "Product Image"}
                className="rounded-3xl object-cover h-[550px] w-[450px] shadow-xl border-4 border-white"
              />
            </div>

            {/* Product Details Section */}
            <div className="w-full lg:w-1/2 flex flex-col justify-between relative p-0">
              {/* White Container with Product Details */}
              <div className="bg-white shadow-lg p-10 rounded-3xl h-[450px] flex flex-col">
                <h2 className="gradient-heading text-5xl font-bold font-heading pt-0 mt-0 mb-0 leading-relaxed">
                  {variation.product_name}
                </h2>
                <p className="text-gray-600 italic text-lg mb-3">
                  {variation.value !== "N/A" ? variation.value : ""}
                </p>

                <div className="text-gray-600 mb-4 leading-relaxed text-lg flex-grow overflow-auto max-h-[210px] no-scrollbar">
                  {variation.product_description}
                </div>

                {/* Stock Quantity and Price */}
                <div className="mt-auto flex items-center justify-between text-gray-600 text-lg">
                  <span className="font-medium">
                    In Stock{" "}
                    <span className="text-black font-semibold">
                      {variation.available_stock}
                    </span>
                  </span>
                  <span className="font-medium">
                    Price{" "}
                    <span className="text-alofa-pink-gradient text-2xl font-extrabold">
                      ₱{variation.unit_price}
                    </span>
                  </span>
                </div>
              </div>

              {/* Quantity Selector and Add to Cart Button */}
              <div className="flex items-center space-x-6 mt-1 justify-end">
                <div className="flex items-center bg-white rounded-full px-3 py-2">
                  <button
                    onClick={() => setQuantity(Math.max(quantity - 1, 1))}
                    className="text-white bg-gray-200 hover:bg-gray-300 font-bold text-base px-3 py-1 rounded-full
                    focus:outline-none shadow-md bg-gradient-to-b from-[#FE699F] to-[#F8587A] hover:bg-gradient-to-b 
                    hover:from-[#F8587A] hover:to-[#FE699F]"
                    disabled={quantity <= 1}
                  >
                    -
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={handleQuantityChange}
                    className="text-gray-700 font-semibold text-2xl w-10 text-center border-slate-400 outline-none mx-3"
                    min="1"
                  />
                  <button
                    onClick={() => {
                      const newQuantity = quantity + 1;
                      handleQuantityChange({ target: { value: newQuantity } });
                    }}
                    className="text-white bg-gray-200 hover:bg-gray-300 font-bold text-base px-3 py-1 rounded-full
                    focus:outline-none shadow-md bg-gradient-to-b from-[#FE699F] to-[#F8587A] hover:bg-gradient-to-b 
                    hover:from-[#F8587A] hover:to-[#FE699F]"
                    disabled={quantity >= variation.available_stock}
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  className="font-extrabold text-white text-lg rounded-full 
                  focus:outline-none shadow-[0px_4px_4px_rgba(0,0,0,0.25)] bg-gradient-to-b 
                  from-[#FE699F] to-[#F8587A] hover:bg-gradient-to-b hover:from-[#F8587A] 
                  hover:to-[#FE699F] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  style={{ width: "150px", height: "50px" }}
                  disabled={isAddingToCart}
                >
                  {isAddingToCart ? (
                    <div className="flex items-center justify-center w-full h-full">
                      <ClipLoader
                        size={25}
                        color="#FFFFFF"
                        loading={isAddingToCart}
                      />
                    </div>
                  ) : (
                    "ADD TO CART"
                  )}
                </button>
              </div>
            </div>
          </>
        ) : (
          // Loading state
          <div className="flex justify-center items-center w-full h-[450px]">
            <ClipLoader size={50} color="#F8587A" loading={true} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;
