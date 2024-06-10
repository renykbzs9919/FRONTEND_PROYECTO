import { useState } from 'react';
import api from '../../services/api';
import Swal from 'sweetalert2';

const ProductRegister = ({ fetchProducts, closeModal }) => {
  const [formData, setFormData] = useState({
    name: '',
    category: '', 
    price: '',
    imgURL: '',
    quantity: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/products', formData);
      fetchProducts();
      closeModal();
      setFormData({
        name: '',
        category: '',
        price: '',
        imgURL: '',
        quantity: ''
      });
      Swal.fire({
        icon: 'success',
        title: 'Producto creado exitosamente',
        text: response.data.message
      });
    } catch (error) {
      console.error('Error creating product:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error al crear producto',
        text: error.response.data.message
      });
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold mb-4 text-center">Registro de Producto</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-700 font-medium mb-2">Nombre</label>
          <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500" required />
        </div>
        <div className="mb-4">
          <label htmlFor="category" className="block text-gray-700 font-medium mb-2">Categoría</label>
          <select id="category" name="category" value={formData.category} onChange={handleChange} className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500" required>
            <option value="">Seleccione una categoría</option>
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
          <button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md focus:outline-none focus:ring focus:ring-blue-200">Agregar Producto</button>
        </div>
      </form>
      <div className="mb-4">
        <button onClick={closeModal} className="w-full bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-md focus:outline-none focus:ring focus:ring-gray-200">Cerrar</button>
      </div>
    </div>
  );
}

export default ProductRegister;
