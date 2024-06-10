import { useState, useEffect } from 'react';
import api from '../../services/api';
import Swal from 'sweetalert2';

const ProductUpdate = ({ fetchProducts, productId, closeModal }) => {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    imgURL: '',
    quantity: ''
  });

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await api.get(`/products/${productId}`);
        const productData = response.data;
        setFormData({
          name: productData.name,
          category: productData.category,
          price: productData.price,
          imgURL: productData.imgURL,
          quantity: productData.quantity
        });
      } catch (error) {
        console.error('Error fetching product for update:', error);
      }
    };
    
    fetchProduct();
  }, [productId]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.put(`/products/${productId}`, formData);
      fetchProducts(); // Actualizar la lista de productos después de editar uno
      closeModal(); // Cerrar el modal de edición después de editar
      Swal.fire({
        icon: 'success',
        title: 'Producto actualizado exitosamente'
      });
    } catch (error) {
      console.error('Error updating product:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error al actualizar producto',
        text: error.response.data.message
      });
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold mb-4 text-center">Editar Producto</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-700 font-medium mb-2">Nombre</label>
          <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500" required />
        </div>
        <div className="mb-4">
          <label htmlFor="category" className="block text-gray-700 font-medium mb-2">Categoría</label>
          <select id="category" name="category" value={formData.category} onChange={handleChange} className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500" required>
            <option value="">Selecciona una categoría</option>
            <option value="Producto Agranel">Producto Agranel</option>
            <option value="Producto Sachet">Producto Sachet</option>
            <option value="Producto Especial">Producto Especial</option>
          </select>
        </div>
        <div className="mb-4">
          <label htmlFor="price" className="block text-gray-700 font-medium mb-2">Precio</label>
          <input type="number" id="price" name="price" value={formData.price} onChange={handleChange} className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500" required />
        </div>
        <div className="mb-4">
          <label htmlFor="quantity" className="block text-gray-700 font-medium mb-2">Cantidad</label>
          <input type="number" id="quantity" name="quantity" value={formData.quantity} onChange={handleChange} className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500" required />
        </div>
        <div className="mb-6">
          <button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md focus:outline-none focus:ring focus:ring-blue-200">Guardar Cambios</button>
        </div>
      </form>
      <div className="mb-4">
        <button onClick={closeModal} className="w-full bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-md focus:outline-none focus:ring focus:ring-gray-200">Cerrar</button>
      </div>
    </div>
  );
}

export default ProductUpdate;
