import React, { Fragment, useState, useEffect, useContext } from "react";
import ProductTable from "./ProductTable";
import EditProductModal from "./EditProductModal";
import ConfirmModal from "../../shared/ConfirmModal";
import FilterProductsAndVariationsTable from "../FilterProductsAndVariationsTable";
import { toast } from "sonner";
import { ClipLoader } from "react-spinners";
import {
  createProductWithVariationAndInventory,
  getAllProducts,
  getCategories,
  getStatus,
  archiveProduct,
  updateProduct,
} from "../../../api/products";
import {
  validateProductForm,
  validateName,
  validateDescription,
  validateStatus,
  validateCategory,
} from "../../../lib/consts/utils/validationUtils";
import { AuthContext } from "../../AuthContext"; // Import AuthContext

const ProductsTab = () => {
  const { role } = useContext(AuthContext); // Access user role from context
  const isEmployee = role === "employee"; // Check if the user is an employee

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [error, setError] = useState(null);
  const [errors, setErrors] = useState({});
  const [originalProductData, setOriginalProductData] = useState(null);

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [sortField, setSortField] = useState("product_id");
  const [sortOrder, setSortOrder] = useState("asc");
  const [showArchived, setShowArchived] = useState(false);

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState("");
  const [additionalNote, setAdditionalNote] = useState("");
  const [confirmAction, setConfirmAction] = useState(null);

  const [productFormData, setProductFormData] = useState({
    product_name: "",
    product_description: "",
    product_status: "",
    product_category: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const productsData = await getAllProducts();
        const categoriesData = await getCategories();

        let statusData = await getStatus();

        // Map to only available and archived statuses
        statusData = statusData.filter(
          (status) =>
            status.description.toLowerCase() === "available" ||
            status.description.toLowerCase() === "archived",
        );
        setProducts(productsData);
        setCategories(categoriesData);
        setStatuses(statusData);
      } catch (err) {
        setError("Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const validateField = (name, value) => {
    let error = "";
    switch (name) {
      case "product_name":
        error = validateName(value);
        break;
      case "description":
        error = validateDescription(value);
        break;
      case "status":
        error = validateStatus(value);
        break;
      case "category":
        error = validateCategory(value);
        break;
      default:
        break;
    }
    setErrors((prevErrors) => ({ ...prevErrors, [name]: error }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProductFormData((prevData) => ({
      ...prevData,
      [name]: value.toString(),
    }));
    validateField(name, value);
  };

  const validateForm = () => {
    const formErrors = validateProductForm(productFormData);
    setErrors(formErrors);
    return !Object.values(formErrors).some((error) => error !== "");
  };

  const isFormModified = () => {
    return (
      productFormData.product_name !== originalProductData?.name ||
      productFormData.product_description !==
        originalProductData?.description ||
      productFormData.product_status !== originalProductData?.status_id ||
      productFormData.product_category !==
        originalProductData?.product_category_id
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!validateForm()) {
      toast.error("Please fill out all required fields correctly.");
      return;
    }

    const {
      product_name,
      product_description,
      product_status,
      product_category,
    } = productFormData;

    const productData = {
      name: product_name,
      description: product_description,
      product_status_id: product_status,
      product_category_id: product_category,
    };

    try {
      let response;
      if (selectedProduct) {
        response = await updateProduct(selectedProduct.product_id, productData);
        // console.log("Product updated successfully:", response);
        toast.success("Product updated successfully");
      } else {
        response = await createProductWithVariationAndInventory(productData);
        // console.log("Product created successfully:", response);
        toast.success("Product created successfully");
      }
      handleCloseModal();
      const productsData = await getAllProducts();
      setProducts(productsData);
    } catch (error) {
      console.error("Error creating/updating product: ", error);
      toast.error("Failed to create/update product");
    } finally {
      setLoading(false);
    }
  };

  const openModal = (product = null) => {
    if (product) {
      setLoading(true);
      setSelectedProduct(product);
      setOriginalProductData(product);
      setProductFormData({
        product_name: product.name || "",
        product_description: product.description || "",
        product_status: product.status_id || "",
        product_category: product.product_category_id || "",
      });
    } else {
      setSelectedProduct(null);
      setOriginalProductData(null);
      setProductFormData({
        product_name: "",
        product_description: "",
        product_status: "",
        product_category: "",
      });
    }
    setShowModal(true);
    setLoading(false);
  };

  const handleArchiveProduct = async (selectedProduct) => {
    if (!selectedProduct) return;

    setConfirmMessage(
      `Are you sure you want to archive ${selectedProduct.name}?`,
    );
    setAdditionalNote(
      "Note: Archiving product also archives its associated variations. ",
    );
    setConfirmAction(() => async () => {
      try {
        setLoading(true);
        const response = await archiveProduct(selectedProduct.product_id);
        const productsData = await getAllProducts();
        // console.log("Product archived successfully:", response);
        toast.success("Product archived successfully");
        setProducts(productsData);
      } catch (error) {
        console.error("Error archiving product: ", error);
        setError("Failed to update product status to Archived");
        toast.error("Failed to archive product");
      } finally {
        setLoading(false);
        setIsConfirmModalOpen(false);
      }
    });
    setIsConfirmModalOpen(true);
  };

  const handleConfirmClose = () => {
    setIsConfirmModalOpen(false);
  };

  const handleConfirm = () => {
    if (confirmAction) {
      confirmAction();
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedProduct(null);
    setProductFormData({
      product_name: "",
      product_description: "",
      product_status: "",
      product_category: "",
    });
    setErrors({});
  };

  const handleColumnSort = (field) => {
    const isAsc = sortField === field && sortOrder === "asc";
    setSortOrder(isAsc ? "desc" : "asc");
    setSortField(field);
  };

  const filteredProducts = products
    .filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(search) ||
        product.description.toLowerCase().includes(search);

      const matchesCategory =
        !selectedCategory ||
        product.product_category_id === parseInt(selectedCategory, 10);

      const matchesStatus = selectedStatus
        ? product.status_id === parseInt(selectedStatus)
        : !showArchived
          ? product.product_status.toLowerCase() !== "archived"
          : true;

      return matchesSearch && matchesCategory && matchesStatus;
    })
    .sort((a, b) => {
      const aField = a[sortField] || "";
      const bField = b[sortField] || "";
      if (sortOrder === "asc") {
        return aField > bField ? 1 : -1;
      } else {
        return aField < bField ? 1 : -1;
      }
    });

  if (error) return <div>{error}</div>;

  return (
    <Fragment>
      <div className="relative">
        <div className="flex flex-col gap-2">
          {/* Filters Section */}
          <FilterProductsAndVariationsTable
            search={search}
            setSearch={setSearch}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            handleCategoryChange={(e) => setSelectedCategory(e.target.value)}
            categories={categories}
            selectedStatus={selectedStatus}
            setSelectedStatus={setSelectedStatus}
            handleStatusChange={(e) => setSelectedStatus(e.target.value)}
            statuses={statuses}
            showArchived={showArchived}
            setShowArchived={setShowArchived}
            handleSearchChange={(e) => setSearch(e.target.value.toLowerCase())}
            isProducts={true}
          />

          {/* Display loading spinner or the ProductTable */}
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <ClipLoader size={50} color="#E53E3E" />
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <p className="text-lg font-semibold text-gray-600">
                  No data available
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  There are currently no records to display.
                </p>
              </div>
            </div>
          ) : (
            <ProductTable
              products={filteredProducts}
              onEdit={openModal}
              onArchive={handleArchiveProduct}
              handleColumnSort={handleColumnSort}
              sortField={sortField}
              sortOrder={sortOrder}
              isEmployee={isEmployee} // Pass role-specific flag here
              loading={loading} // Pass loading state
            />
          )}
        </div>

        {/* Modal for Adding/Editing Product */}
        {showModal && (
          <EditProductModal
            isVisible={showModal}
            onClose={handleCloseModal}
            selectedProduct={selectedProduct}
            handleSubmit={handleSubmit}
            productFormData={productFormData}
            handleInputChange={handleInputChange}
            categories={categories}
            statuses={statuses}
            errors={errors}
            isFormModified={isFormModified}
          />
        )}
        <ConfirmModal
          isOpen={isConfirmModalOpen}
          onClose={() => setIsConfirmModalOpen(false)}
          onConfirm={handleConfirm}
          message={confirmMessage}
          additionalNote={additionalNote}
        />
      </div>
    </Fragment>
  );
};

export default ProductsTab;
