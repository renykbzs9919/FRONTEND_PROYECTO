import { Link } from 'react-router-dom'; // Si estás usando React Router

const handleLogout = () => {
  // Eliminar el token del localStorage
  localStorage.removeItem('access_token');
  // Redireccionar a /login
  window.location.href = '/'; 
};

const Header = () => {
  return (
    <header className="bg-gray-800 py-4">
      <nav className="container mx-auto">
        <ul className="flex justify-between items-center">
          <li>
            <Link to="/login" className="text-white text-lg font-bold">Login</Link>
          </li>
          <li>
            <Link to="/logout" className="text-white text-lg font-bold" onClick={handleLogout}>
              Cerrar Sesión
            </Link>
          </li>
          <li>
            <Link to="/dashboard" className="text-white text-lg font-bold ml-4">Dashboard</Link>
          </li>
          <li>
            <Link to="/client" className="text-white text-lg font-bold ml-4">Cliente</Link>
          </li>
          <li>
            <Link to="/product" className="text-white text-lg font-bold ml-4">Productos</Link>
          </li>
          <li>
            <Link to="/sale" className="text-white text-lg font-bold ml-4">Ventas</Link>
          </li>
          <li>
            <Link to="/user" className="text-white text-lg font-bold ml-4">Usuarios</Link>
          </li>
          <li>
            <Link to="/prediction" className="text-white text-lg font-bold ml-4">Predicciones</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;
