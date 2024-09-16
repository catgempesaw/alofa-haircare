import PropTypes from 'prop-types';

const ProductCard = ({ image, name, price }) => {
  return (
    <div className="relative p-2 rounded-lg">
      {/* Inner card with white background */}
      <div className="bg-white border-4 border-pink-300 rounded-lg shadow-md overflow-hidden flex flex-col justify-between w-56 text-center">
        {/* Square image occupying the whole top */}
        <div className="w-full aspect-square">
          <img src={image} alt={name} className="w-full h-full object-cover" />
        </div>
        <div className="mt-4 flex flex-col items-start px-4">
          <h3 className="text-lg font-medium text-gray-700">{name}</h3>
          <p className="text-xl font-bold text-gray-900 mt-2">₱{price}</p>
        </div>
        <div className="flex justify-end mt-4 px-4 pb-3">
          <button className="font-extrabold bg-alofa-pink text-white py-2 px-4 rounded-full hover:bg-alofa-pink-gradient focus:outline-none shadow-m">
            ADD TO CART
          </button>
        </div>
      </div>
    </div>
  );
};

ProductCard.propTypes = {
  image: PropTypes.string.isRequired, 
  name: PropTypes.string.isRequired,   
  price: PropTypes.number.isRequired,  
};

export default ProductCard;
