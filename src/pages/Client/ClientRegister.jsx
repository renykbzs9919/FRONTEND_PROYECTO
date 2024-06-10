import { useState } from 'react';
import api from '../../services/api';
import Swal from 'sweetalert2';

const ClientRegister = ({ fetchClients, closeModal }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    celular: '',
    ubicacion_puesto: '',
    ciudad: ''
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
      const response = await api.post('/clients', formData);
      fetchClients(); // Actualizar la lista de clientes después de agregar uno nuevo
      closeModal();
      setFormData({
        nombre: '',
        celular: '',
        ubicacion_puesto: '',
        ciudad: ''
      });
      Swal.fire({
        icon: 'success',
        title: 'Cliente creado exitosamente',
        text: response.data.message
      });
    } catch (error) {
      console.error('Error creating client:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error al crear cliente',
        text: error.response.data.message
      });
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold mb-4 text-center">Registro de Cliente</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="nombre" className="block text-gray-700 font-medium mb-2">Nombre</label>
          <input type="text" id="nombre" name="nombre" value={formData.nombre} onChange={handleChange} className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500" required />
        </div>
        <div className="mb-4">
          <label htmlFor="celular" className="block text-gray-700 font-medium mb-2">Celular</label>
          <input type="text" id="celular" name="celular" value={formData.celular} onChange={handleChange} className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500" required />
        </div>
        <div className="mb-4">
          <label htmlFor="ubicacion_puesto" className="block text-gray-700 font-medium mb-2">Ubicación Puesto</label>
          <input type="text" id="ubicacion_puesto" name="ubicacion_puesto" value={formData.ubicacion_puesto} onChange={handleChange} className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500" required />
        </div>
        <div className="mb-4">
          <label htmlFor="ciudad" className="block text-gray-700 font-medium mb-2">Ciudad</label>
          <input type="text" id="ciudad" name="ciudad" value={formData.ciudad} onChange={handleChange} className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500" required />
        </div>
        <div className="mb-6">
          <button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md focus:outline-none focus:ring focus:ring-blue-200">Agregar Cliente</button>
        </div>
      </form>
      <div className="mb-4">
        <button onClick={closeModal} className="w-full bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-md focus:outline-none focus:ring focus:ring-gray-200">Cerrar</button>
      </div>
    </div>
  );
}

export default ClientRegister;
