import { useState, useEffect } from 'react';
import api from '../../services/api';
import { jwtDecode } from "jwt-decode";
import Swal from 'sweetalert2';

const SaleRegister = ({closeModal}) => {
  const [clients, setClients] = useState([]);
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    client: '',
    user: '',
    products: [{ product: '', quantity: 1 }], 
    totalPaid: '', 
    saleDate: new Date().toISOString().slice(0, 10), 
  });

  useEffect(() => {
    fetchClients();
    fetchUsers();
    fetchProducts();
    fetchCurrentUser();
  }, []);

  const fetchClients = async () => {
    try {
      const response = await api.get('/clients');
      setClients(response.data);
    } catch (error) {
      console.error('Error fetching clients:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await api.get('/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await api.get('/products');
      setProducts(response.data.productos); 
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const fetchCurrentUser = async () => {
    const storedToken = localStorage.getItem('access_token');
    if (storedToken) {
      const decodedUser = jwtDecode(storedToken);
      setFormData(prevState => ({
        ...prevState,
        user: decodedUser.id
      }));
    }
  };

  const handleChange = (e, index) => {
    const { name, value } = e.target;
    if (name === 'product' || name === 'quantity') {
      const updatedProducts = [...formData.products];
      updatedProducts[index][name] = value;
      setFormData({ ...formData, products: updatedProducts });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleAddProduct = () => {
    setFormData({
      ...formData,
      products: [...formData.products, { product: '', quantity: 1 }],
    });
  };

  const handleRemoveProduct = (index) => {
    const updatedProducts = [...formData.products];
    updatedProducts.splice(index, 1);
    setFormData({ ...formData, products: updatedProducts });
  };

  const calculateTotalPrice = () => {
    let totalPrice = 0;
    formData.products.forEach(product => {
      const selectedProduct = products.find(p => p._id === product.product);
      if (selectedProduct) {
        totalPrice += selectedProduct.price * product.quantity;
      }
    });
    return totalPrice;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { client, user, products, totalPaid, saleDate } = formData;
  
      const requestBody = {
        client,
        user,
        totalPaid,
        saleDate,
        products,
      };
  
      const response = await api.post('/sales', requestBody);
      closeModal();
  
      Swal.fire({
        icon: 'success',
        title: 'Producto creado exitosamente',
        text: response.data.message
      });
    } catch (error) {
      console.error('Error submitting form:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error al crear producto',
        text: error.response.data.message
      });
      
    }
  };
  

  return (
    <div className="p-4 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold mb-4 text-center">Registro de Venta</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="user" className="block text-gray-700 font-medium mb-2">Usuario</label>
          <select
            id="user"
            name="user"
            value={formData.user}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
            required
          >
            <option value="">Seleccione un usuario</option>
            {users.map(user => (
              <option key={user._id} value={user._id}>{user.username}</option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label htmlFor="client" className="block text-gray-700 font-medium mb-2">Cliente</label>
          <select
            id="client"
            name="client"
            value={formData.client}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
            required
          >
            <option value="">Seleccione un cliente</option>
            {clients.map(client => (
              <option key={client._id} value={client._id}>{client.nombre}</option>
            ))}
          </select>
        </div>
        {formData.products.map((product, index) => (
          <div key={index} className="mb-4">
            <label htmlFor={`product${index}`} className="block text-gray-700 font-medium mb-2">Producto {index + 1}</label>
            <div className="flex items-center">
              <select
                id={`product${index}`}
                name="product"
                value={product.product}
                onChange={(e) => handleChange(e, index)}
                className="w-full border border-gray-300 rounded-md py-2 px-3 mr-2 focus:outline-none focus:border-blue-500"
                required
              >
                <option value="">Seleccione un producto</option>
                {products.map(product => (
                  <option key={product._id} value={product._id}>{product.name}</option>
                ))}
              </select>
              <input
                type="number"
                name="quantity"
                value={product.quantity}
                onChange={(e) => handleChange(e, index)}
                className="w-24 border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
                required
              />
              {formData.products.length > 1 && (
                <button type="button" onClick={() => handleRemoveProduct(index)} className="text-red-500 focus:outline-none">
                  Eliminar
                </button>
              )}
            </div>
          </div>
        ))}
        <button type="button" onClick={handleAddProduct} className="mb-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Agregar Producto
        </button>
        <div className="mb-4">
          <label htmlFor="totalPaid" className="block text-gray-700 font-medium mb-2">Monto Pagado</label>
          <input
            id="totalPaid"
            name="totalPaid"
            type="number"
            value={formData.totalPaid}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="saleDate" className="block text-gray-700 font-medium mb-2">Fecha de Venta</label>
          <input
            id="saleDate"
            name="saleDate"
            type="date"
            value={formData.saleDate}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Detalle de la Venta</label>
          {formData.products.map((product, index) => (
            <div key={index} className="flex justify-between mb-2">
              <span>{products.find(p => p._id === product.product)?.name}</span>
              <span>{product.quantity} x ${products.find(p => p._id === product.product)?.price}</span>
            </div>
          ))}
          <hr className="my-2" />
          <div className="flex justify-between font-semibold">
            <span>Total:</span>
            <span>${calculateTotalPrice()}</span>
          </div>
          <div className="flex justify-between font-semibold">
            <span>Monto Pagado:</span>
            <span>${formData.totalPaid}</span>
          </div>
          <div className="flex justify-between font-semibold">
            <span>Saldo Pendiente:</span>
            <span>${calculateTotalPrice() - formData.totalPaid}</span>
          </div>
        </div>
        <button type="submit" className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
          Registrar Venta
        </button>
        <div className="mb-4">
        <button onClick={closeModal} className="w-full bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-md focus:outline-none focus:ring focus:ring-gray-200">Cerrar</button>
      </div>
      </form>

    </div>
  );
};

export default SaleRegister;
