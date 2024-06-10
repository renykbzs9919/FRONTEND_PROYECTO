import { useState, useEffect } from 'react';
import api from '../../services/api';
import Swal from 'sweetalert2';
import UserRegister from './UserRegister';
import UserUpdate from './UserUpdate';

const User = () => {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null); // Estado para almacenar el usuario que se está editando

  useEffect(() => {
    fetchUsers();
  }, [currentPage]); // Actualizar la lista de usuarios cuando cambia la página

  const fetchUsers = async () => {
    try {
      const response = await api.get(`/users?page=${currentPage}&limit=${usersPerPage}`);
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleDelete = async (userId) => {
    const confirmation = await Swal.fire({
      icon: 'question',
      title: '¿Estás seguro de que quieres eliminar?',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });
  
    if (confirmation.isConfirmed) {
      try {
        await api.delete(`/users/${userId}`);
        fetchUsers(); // Actualizar la lista después de eliminar un cliente
        Swal.fire({
          icon: 'success',
          title: 'Usuario eliminado exitosamente'
        });
      } catch (error) {
        console.log(error)
        console.error('Error deleting user:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error al eliminar usuario',
          text: error.response.data.message
        });
      }
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setShowRegisterModal(true);
  };

  const handleModalClose = () => {
    setShowRegisterModal(false);
    setEditingUser(null);
  };

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(users.length / usersPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="max-w-4xl w-full bg-white shadow-lg rounded-lg px-8 py-6">
        <h2 className="text-3xl font-semibold text-center mb-8">Gestión de Usuarios</h2>
        <div className="mb-4">
          <button onClick={() => setShowRegisterModal(true)} className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md focus:outline-none focus:ring focus:ring-blue-200">
            Registrar Usuario
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
                {editingUser ? (
                  <UserUpdate userId={editingUser._id} fetchUsers={fetchUsers} closeModal={handleModalClose} />
                ) : (
                  <UserRegister fetchUsers={fetchUsers} closeModal={handleModalClose} />
                )}
              </div>
            </div>
          </div>
        )}
        <div className="overflow-x-auto">
          <h3 className="text-xl font-semibold mb-4">Usuarios</h3>
          <table className="w-full">
            <thead>
              <tr>
                <th className="px-4 py-2">Nombre de Usuario</th>
                <th className="px-4 py-2">Correo Electrónico</th>
                <th className="px-4 py-2">Número de Teléfono</th>
                <th className="px-4 py-2">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user._id}>
                  <td className="border px-4 py-2">{user.username}</td>
                  <td className="border px-4 py-2">{user.email}</td>
                  <td className="border px-4 py-2">{user.phoneNumber}</td>
                  <td className="border px-4 py-2">
                    <button onClick={() => handleEdit(user)} className="text-blue-600 font-semibold mr-2">Editar</button>
                    <button onClick={() => handleDelete(user._id)} className="text-red-600 font-semibold">Eliminar</button>
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

export default User;
