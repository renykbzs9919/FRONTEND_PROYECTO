import { useState } from 'react';
import { isAuthenticated, setToken } from '../../utils/auth';
import api from '../../services/api';
import Swal from 'sweetalert2';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/login', {
        email,
        password
      });
      if (response.data.token) {
        setToken(response.data.token);
        window.location.href = '/user '; // Redirigir a la página de dashboard después del inicio de sesión
      } else {
        console.log('Inicio de sesión fallido');
      }
    } catch (error) {
      console.error('Error al iniciar sesión:', error.response.data.message);
      Swal.fire({
        icon: 'error',
        title: 'Error al iniciar sesión',
        text: error.response.data.message
      });
    }
  }

  // Si el usuario ya está autenticado, redirigirlo al dashboard
  if (isAuthenticated()) {
    window.location.href = '/user';
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg px-8 py-6">
        <h2 className="text-3xl font-semibold text-center mb-8">Inicio de Sesión</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 font-medium mb-2">Correo electrónico</label>
            <input type="email" id="email" className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500" required onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-700 font-medium mb-2">Contraseña</label>
            <input type="password" id="password" className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500" required onChange={(e) => setPassword(e.target.value)} />
          </div>
          <div className="mb-6">
            <button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md focus:outline-none focus:ring focus:ring-blue-200">Iniciar Sesión</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
