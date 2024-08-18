import React, { useEffect, useState } from "react";
import axios from "axios";
import { Product } from "../types/Product";

const ProductsTable: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [newProduct, setNewProduct] = useState<Product>({ id: "", title: "", price: 0 });

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [searchQuery, products]);

  const fetchProducts = () => {
    axios.get("http://localhost:3000/products").then((response) => {
      setProducts(response.data);
      setFilteredProducts(response.data);
    });
  };

  const filterProducts = () => {
    const lowercasedQuery = searchQuery.toLowerCase();
    const filtered = products.filter((product) =>
      product.title.toLowerCase().includes(lowercasedQuery)
    );
    setFilteredProducts(filtered);
  };

  const handleEditClick = (product: Product) => {
    setCurrentProduct(product);
    setShowEditModal(true);
  };

  const handleDeleteClick = (id: string) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      axios.delete(`http://localhost:3000/products/${id}`).then(() => {
        fetchProducts(); // Refresh the list after deletion
      });
    }
  };

  const handleEditSave = () => {
    if (currentProduct) {
      axios
        .put(`http://localhost:3000/products/${currentProduct.id}`, currentProduct)
        .then(() => {
          fetchProducts();
          setShowEditModal(false);
        });
    }
  };

  const handleAddClick = () => {
    setShowAddModal(true);
  };

  const handleAddSave = () => {
    axios.post("http://localhost:3000/products", newProduct).then(() => {
      fetchProducts();
      setShowAddModal(false);
    });
  };

  return (
    <div className="p-8">
      <h2 className="text-2xl font-semibold mb-4">Products</h2>

      {/* Search Input */}
      <div className="mb-4">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search products..."
          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
        />
      </div>

      {/* Add Product Button */}
      <button
        onClick={handleAddClick}
        className="mb-4 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
      >
        Add Product
      </button>

      {/* Products Table */}
      <table className="min-w-full table-auto border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="px-4 py-2 border border-gray-300">Title</th>
            <th className="px-4 py-2 border border-gray-300">Price</th>
            <th className="px-4 py-2 border border-gray-300">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredProducts.map((product) => (
            <tr key={product.id} className="bg-white hover:bg-gray-100">
              <td className="px-4 py-2 border border-gray-300">{product.title}</td>
              <td className="px-4 py-2 border border-gray-300">${product.price.toFixed(2)}</td>
              <td className="px-4 py-2 border border-gray-300">
                <button
                  onClick={() => handleEditClick(product)}
                  className="mr-2 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteClick(product.id)}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <h3 className="text-xl font-semibold mb-4">Edit Product</h3>
            {currentProduct && (
              <div>
                <label className="block text-sm font-medium mb-2">Title</label>
                <input
                  type="text"
                  value={currentProduct.title}
                  onChange={(e) =>
                    setCurrentProduct({ ...currentProduct, title: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                />
                <label className="block text-sm font-medium mt-4 mb-2">Price</label>
                <input
                  type="number"
                  value={currentProduct.price}
                  onChange={(e) =>
                    setCurrentProduct({
                      ...currentProduct,
                      price: parseFloat(e.target.value),
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                />
              </div>
            )}
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowEditModal(false)}
                className="mr-2 bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleEditSave}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <h3 className="text-xl font-semibold mb-4">Add Product</h3>
            <div>
              <label className="block text-sm font-medium mb-2">Title</label>
              <input
                type="text"
                value={newProduct.title}
                onChange={(e) => setNewProduct({ ...newProduct, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              />
              <label className="block text-sm font-medium mt-4 mb-2">Price</label>
              <input
                type="number"
                value={newProduct.price}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, price: parseFloat(e.target.value) })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              />
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowAddModal(false)}
                className="mr-2 bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleAddSave}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
              >
                Add Product
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsTable;
