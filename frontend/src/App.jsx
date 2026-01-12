import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import CustomerList from './pages/Customers/CustomerList';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Tarayıcıda localhost:5173/login yazınca bunu göreceksin */}
        <Route path="/login" element={<Login />} />
        
        {/* Tarayıcıda localhost:5173/ yazınca Dashboard'u göreceksin */}
        <Route path="/" element={<Dashboard />} />
        
        {/* Tarayıcıda localhost:5173/customers yazınca listeyi göreceksin */}
        <Route path="/customers" element={<CustomerList />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;