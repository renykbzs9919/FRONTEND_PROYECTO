import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header'; // Importa el componente de encabezado
import Footer from './components/Footer'; // Importa el componente de pie de página
import Login from './pages/Login/Login'; // Importa la vista de login
import Client from './pages/Client/Client'; // Importa la vista de client
import Product from './pages/Product/Product'; // Importa la vista de product
import Ventas from './pages/Sale/Sale'; // Importa la vista de sale
import User from './pages/User/User'; // Importa la vista de user
import Predictions from './pages/Predictions/Predictions'; // Importa la vista de user
import Dashboard from './pages/Dasboard/Dashboard';
// Importa otras vistas según sea necesario

const App = () => {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Header />
        <div className="flex-grow">
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/client" element={<Client />} />
            <Route path="/product" element={<Product />} />
            <Route path="/sale" element={<Ventas />} />
            <Route path="/user" element={<User />} />
            <Route path="/prediction" element={<Predictions />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
