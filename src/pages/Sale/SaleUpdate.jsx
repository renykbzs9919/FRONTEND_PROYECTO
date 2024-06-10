import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import Swal from 'sweetalert2';

const SaleUpdate = ({ fetchSales, saleId, closeModal }) => {
  const [saleData, setSaleData] = useState({
    client: '',
    clientName: '',
    products: [{ product: '', quantity: 1 }],
    totalPaid: '',
    saleDate: '',
  });
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchSaleData();
    fetchProducts();
  }, []);

  const fetchSaleData = async () => {
    try {
      const response = await api.get(`/sales/${saleId}`);
      const { client, products, totalPaid, saleDate } = response.data;
      const formattedDate = new Date(saleDate).toISOString().slice(0, 10);

      // Fetch client details
      const clientResponse = await api.get(`/clients/${client}`);
      const clientName = clientResponse.data.nombre;

      setSaleData({ client, clientName, products, totalPaid, saleDate: formattedDate });
    } catch (error) {
      console.error('Error fetching sale data:', error);
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

  const handleChange = (e, index) => {
    const { name, value } = e.target;
    if (name === 'product' || name === 'quantity') {
      const updatedProducts = [...saleData.products];
      updatedProducts[index][name] = value;
      setSaleData(prevState => ({ ...prevState, products: updatedProducts }));
    } else {
      setSaleData(prevState => ({ ...prevState, [name]: value }));
    }
  };

  const handleAddProduct = () => {
    setSaleData(prevState => ({
      ...prevState,
      products: [...prevState.products, { product: '', quantity: 1 }],
    }));
  };

  const handleRemoveProduct = (index) => {
    const updatedProducts = [...saleData.products];
    updatedProducts.splice(index, 1);
    setSaleData(prevState => ({ ...prevState, products: updatedProducts }));
  };

  const calculateTotalPrice = () => {
    let totalPrice = 0;
    saleData.products.forEach(product => {
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
      const { client, products, totalPaid, saleDate } = saleData;
      const requestBody = { client, products, totalPaid, saleDate };
      await api.put(`/sales/${saleId}`, requestBody);
      fetchSales();
      closeModal();
      Swal.fire({
        icon: 'success',
        title: 'Venta actualizada exitosamente',
      });
    } catch (error) {
      console.error('Error submitting form:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error al actualizar venta',
        text: error.response.data.message
      });
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold mb-4 text-center">Actualizar Venta</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="client" className="block text-gray-700 font-medium mb-2">Cliente</label>
          <input
            id="client"
            name="clientName"
            value={saleData.clientName}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
            disabled
          />
        </div>
        {saleData.products.map((product, index) => (
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
              {saleData.products.length > 1 && (
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
            value={saleData.totalPaid}
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
            value={saleData.saleDate}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Detalle de la Venta</label>
          {saleData.products.map((product, index) => (
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
            <span>${saleData.totalPaid}</span>
          </div>
          <div className="flex justify-between font-semibold">
            <span>Saldo Pendiente:</span>
            <span>${calculateTotalPrice() - saleData.totalPaid}</span>
          </div>
        </div>
        <button type="submit" className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
          Actualizar Venta
        </button>
        <div className="mb-4">
          <button onClick={closeModal} className="w-full bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-md focus:outline-none focus:ring focus:ring-gray-200">Cerrar</button>
        </div>
      </form>
    </div>
  );
};

export default SaleUpdate;
