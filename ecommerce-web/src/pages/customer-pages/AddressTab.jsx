import { useState, useEffect } from "react";
import { FaPlus } from "react-icons/fa";
import NewAddressModal from "./customer-modals/NewAddressModal.jsx";
import EditAddressModal from "./customer-modals/EditAddressModal.jsx"; // Import the edit modal
import {
  createShippingAddress,
  getShippingAddressesByCustomerId,
  updateShippingAddress,
  deleteShippingAddress,
} from "../../api/customer.js";
import PropTypes from "prop-types";

const AddressTab = ({ profileData }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [addresses, setAddresses] = useState([
    {
      shipping_address_id: "",
      first_name: "",
      last_name: "",
      address_line: "",
      region: "",
      province: "",
      city: "",
      barangay: "",
      phone_number: "",
      zip_code: "",
    },
  ]);

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const addresses = await getShippingAddressesByCustomerId(
          profileData.customer_id,
        );
        if (addresses.message === "No addresses found for this customer.") {
          setAddresses([]); // Set empty array to show "No addresses found" message
        } else {
          setAddresses(addresses);
        }
      } catch (error) {
        if (error.response && error.response.status === 404) {
          setAddresses([]);
          console.log("No addresses found for this customer.");
        } else {
          console.error("Error fetching addresses:", error);
        }
      }
    };
    fetchAddresses();
  }, [profileData.customer_id]);

  // Function to open the new address modal
  const handleAddNewAddress = () => {
    setIsModalOpen(true);
  };

  // Function to close the new address modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // Function to add a new address
  const handleSaveNewAddress = async (newAddress) => {
    try {
      console.log("Saving new address:", newAddress);
      newAddress.customer_id = profileData.customer_id;
      const savedAddress = await createShippingAddress(newAddress);
      setAddresses((prevAddresses) => [...prevAddresses, savedAddress]);
      setIsModalOpen(false);
      console.log("New address added:", savedAddress);
    } catch (error) {
      console.error("Error saving new address:", error);
      alert("Failed to save address. Please try again.");
    }
  };

  // Function to open the edit address modal
  const handleOpenEditModal = (address) => {
    setSelectedAddress(address);
    setIsEditModalOpen(true);
  };

  // Function to close the edit address modal
  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedAddress(null);
  };

  // Function to save the edited address
  const handleSaveEditedAddress = async (updatedAddress) => {
    try {
      console.log("Saving edited address:", updatedAddress);
      console.log("Address ID:", updatedAddress.shipping_address_id);
      const savedAddress = await updateShippingAddress(
        updatedAddress.shipping_address_id,
        updatedAddress,
      );

      setAddresses((prevAddresses) =>
        prevAddresses.map((address) =>
          address.shipping_address_id === savedAddress.shipping_address_id
            ? savedAddress
            : address,
        ),
      );
      setIsEditModalOpen(false);
    } catch (error) {
      console.error("Error updating address:", error);
    }
  };

  // Function to delete an address
  const handleDeleteAddress = async (addressId) => {
    try {
      await deleteShippingAddress(addressId);
      setAddresses((prevAddresses) =>
        prevAddresses.filter(
          (address) => address.shipping_address_id !== addressId,
        ),
      );
      console.log(`Address with ID ${addressId} deleted.`);
    } catch (error) {
      console.error("Error deleting address:", error);
    }
  };

  return (
    <div className="px-8 py-5 lg:px-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-2">
        <h2 className="bg-gradient-to-b from-alofa-pink via-alofa-pink to-alofa-light-pink bg-clip-text text-transparent font-extrabold text-4xl">
          My Address
        </h2>
        <button
          onClick={handleAddNewAddress}
          className="flex items-center px-4 py-2 font-bold text-white rounded-full focus:outline-none shadow-[0px_4px_4px_rgba(0,0,0,0.25)] bg-gradient-to-b from-[#FE699F] to-[#F8587A] hover:bg-gradient-to-b hover:from-[#F8587A] hover:to-[#FE699F]"
        >
          <FaPlus className="mr-2" />
          Add New Address
        </button>
      </div>
      <p className="text-sm text-gray-500 mb-8">
        Last updated: 16 Oct 2024 22:54
      </p>

      {/* Address List */}
      <div className="space-y-4">
        {addresses.length === 0 ? (
          <p className="text-gray-500">
            No addresses found. Click &ldquo;Add New Address&ldquo; to add one.
          </p>
        ) : (
          addresses.map((address) => (
            <div
              key={address.shipping_address_id}
              className="p-4 bg-white rounded-lg shadow border border-gray-200 flex justify-between items-start"
            >
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  {address.first_name} {address.last_name}
                </h3>
                <span className="text-gray-500">{address.phone_number}</span>
                <p className="text-sm text-gray-500">{address.address_line}</p>
                <p className="text-sm text-gray-500">
                  {address.barangay}, {address.city}, {address.province},{" "}
                  {address.region}, {address.zip_code}
                </p>
              </div>
              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => handleOpenEditModal(address)}
                  className="text-sm text-pink-500 hover:underline focus:outline-none"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() =>
                    handleDeleteAddress(address.shipping_address_id)
                  }
                  className="text-sm text-pink-500 hover:underline focus:outline-none"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* New Address Modal */}
      {isModalOpen && (
        <NewAddressModal
          onClose={handleCloseModal}
          onSave={handleSaveNewAddress}
        />
      )}

      {/* Edit Address Modal */}
      {isEditModalOpen && (
        <EditAddressModal
          address={selectedAddress}
          onClose={handleCloseEditModal}
          onSave={handleSaveEditedAddress}
        />
      )}
    </div>
  );
};

AddressTab.propTypes = {
  profileData: PropTypes.shape({
    customer_id: PropTypes.string.isRequired,
  }).isRequired,
};

export default AddressTab;
