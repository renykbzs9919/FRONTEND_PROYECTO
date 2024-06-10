import { useState, useEffect } from 'react';
import api from '../../services/api';
import Swal from 'sweetalert2';
import ClientRegister from './ClientRegister';
import ClientUpdate from './ClientUpdate'; // Importar el componente ClientUpdate

const Client = () => {
  const [clients, setClients] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [clientsPerPage] = useState(10);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [editingClient, setEditingClient] = useState(null); // Estado para almacenar el cliente que se está editando

  useEffect(() => {
    fetchClients();
  }, [currentPage]); // Actualizar la lista de clientes cuando cambia la página

  const fetchClients = async () => {
    try {
      const response = await api.get(`/clients?page=${currentPage}&limit=${clientsPerPage}`);
      setClients(response.data);
    } catch (error) {
      console.error('Error fetching clients:', error);
    }
  };

  const handleDelete = async (clientId) => {
    const confirmation = await Swal.fire({
      icon: 'question',
      title: '¿Estás seguro de que quieres eliminar este cliente?',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });
  
    if (confirmation.isConfirmed) {
      try {
        await api.delete(`/clients/${clientId}`);
        fetchClients(); // Actualizar la lista después de eliminar un cliente
        Swal.fire({
          icon: 'success',
          title: 'Cliente eliminado exitosamente'
        });
      } catch (error) {
        console.error('Error deleting client:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error al eliminar cliente',
          text: error.response.data.message
        });
      }
    }
  };
  

  const handleEdit = (client) => {
    setEditingClient(client);
    setShowRegisterModal(true);
  };

  const handleModalClose = () => {
    setShowRegisterModal(false);
    setEditingClient(null);
  };

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(clients.length / clientsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="max-w-4xl w-full bg-white shadow-lg rounded-lg px-8 py-6">
        <h2 className="text-3xl font-semibold text-center mb-8">Gestión de Clientes</h2>
        <div className="mb-4">
          <button onClick={() => setShowRegisterModal(true)} className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md focus:outline-none focus:ring focus:ring-blue-200">
            Registrar Cliente
          </button>
        </div>
        {showRegisterModal && (
          <div className="fixed z-10 inset-0 overflow-y-auto">
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
              </div>
              <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
              <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                {editingClient ? (
                  <ClientUpdate fetchClients={fetchClients} clientId={editingClient._id} closeModal={handleModalClose} />
                ) : (
                  <ClientRegister fetchClients={fetchClients} closeModal={handleModalClose} />
                )}
              </div>
            </div>
          </div>
        )}
        <div className="overflow-x-auto">
          <h3 className="text-xl font-semibold mb-4">Clientes</h3>
          <table className="w-full">
            <thead>
              <tr>
                <th className="px-4 py-2">Nombre</th>
                <th className="px-4 py-2">Celular</th>
                <th className="px-4 py-2">Ubicación Puesto</th>
                <th className="px-4 py-2">Ciudad</th>
                <th className="px-4 py-2">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {clients.map(client => (
                <tr key={client._id}>
                  <td className="border px-4 py-2">{client.nombre}</td>
                  <td className="border px-4 py-2">{client.celular}</td>
                  <td className="border px-4 py-2">{client.ubicacion_puesto}</td>
                  <td className="border px-4 py-2">{client.ciudad}</td>
                  <td className="border px-4 py-2">
                    <button onClick={() => handleEdit(client)} className="text-blue-600 font-semibold mr-2">Editar</button>
                    <button onClick={() => handleDelete(client._id)} className="text-red-600 font-semibold">Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex justify-center mt-4">
          <ul className="flex">
            {pageNumbers.map(number => (
              <li key={number} className="mx-1">
                <button onClick={() => paginate(number)} className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md focus:outline-none focus:ring focus:ring-blue-200">
                  {number}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Client;
