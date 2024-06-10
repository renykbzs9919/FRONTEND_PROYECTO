import { useState, useEffect } from 'react';
import api from '../../services/api';
import Swal from 'sweetalert2';
import SaleRegister from './SaleRegister';
import SaleUpdate from './SaleUpdate';

const Sale = () => {
  const [sales, setSales] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [salesPerPage] = useState(10);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [editingSale, setEditingSale] = useState(null); // Estado para almacenar la venta que se está editando

  useEffect(() => {
    fetchSales();
  }, [currentPage]); // Actualizar la lista de ventas cuando cambia la página

  const fetchSales = async () => {
    try {
      const response = await api.get(`/sales?page=${currentPage}&limit=${salesPerPage}`);
      setSales(response.data);
    } catch (error) {
      console.error('Error fetching sales:', error);
    }
  };

  const handleDelete = async (saleId) => {
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
        await api.delete(`/sales/${saleId}`);
        fetchSales(); // Actualizar la lista después de eliminar un cliente
        Swal.fire({
          icon: 'success',
          title: 'Venta eliminado exitosamente'
        });
      } catch (error) {
        console.error('Error deleting client:', error);
        Swal.fire({
          icon: 'error',  
          title: 'Error al eliminar venta',
          text: error.response.data.message
        });
      }
    }
  };

  const handleEdit = (sale) => {
    setEditingSale(sale);
    setShowRegisterModal(true);
  };

  const handleModalClose = () => {
    setShowRegisterModal(false);
    setEditingSale(null);
  };

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(sales.length / salesPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="max-w-7xl w-full bg-white shadow-lg rounded-lg px-8 py-6">
        <h2 className="text-3xl font-semibold text-center mb-8">Gestión de Ventas</h2>
        <div className="mb-4">
          <button onClick={() => setShowRegisterModal(true)} className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md focus:outline-none focus:ring focus:ring-blue-200">
            Registrar Venta
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
                {editingSale ? (
                  <SaleUpdate fetchSales={fetchSales} saleId={editingSale._id} closeModal={handleModalClose} />
                ) : (
                  <SaleRegister fetchSales={fetchSales} closeModal={handleModalClose} />
                )}
              </div>
            </div>
          </div>
        )}
        <div className="overflow-x-auto">
          <h3 className="text-xl font-semibold mb-4">Ventas</h3>
          <div className="min-w-full overflow-hidden overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha de Venta</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vendedor</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total de la Venta</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">A Cuenta</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Saldo</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sales.map(sale => (
                  <tr key={sale._id} className="hover:bg-gray-100">
                    <td className="px-4 py-2 whitespace-nowrap">{new Date(sale.saleDate).toLocaleString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</td>
                    <td className="px-4 py-2 whitespace-nowrap">{sale.user.username}</td>
                    <td className="px-4 py-2 whitespace-nowrap">{sale.client.nombre}</td>
                    <td className="px-4 py-2 whitespace-nowrap">{sale.totalSalePrice} .Bs</td>
                    <td className="px-4 py-2 whitespace-nowrap">{sale.totalPaid} .Bs</td>
                    <td className="px-4 py-2 whitespace-nowrap">{sale.amountDue} .Bs</td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      <button onClick={() => handleEdit(sale)} className="text-blue-600 font-semibold mr-2">Editar</button>
                      <button onClick={() => handleDelete(sale._id)} className="text-red-600 font-semibold">Eliminar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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

export default Sale;
