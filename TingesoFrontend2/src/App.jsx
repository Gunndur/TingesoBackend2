import './App.css';
import { BrowserRouter as Router, Route, Routes , Navigate} from 'react-router-dom';
import Navbar from "./components/Navbar";
import NotFound from "./components/NotFound";
import Home from "./components/Home";
import CreateBooking from './components/CreateBooking';
import UpdateBooking from './components/UpdateBooking';
import MostrarReceipt from './components/MostrarReceipt';
import Rack from './components/rack';
import Users from './components/Users';
import CreateUser from './components/CreateUser';
import Reportes from './components/Reportes';
import ReportesFee from './components/ReportesFee';
import ReportesGroup from './components/ReportesGroup';

function App() {
  return (
    <Router>
      <div className="container">
        <Navbar />
        <Routes>
          <Route path="/" element={<Navigate to="/home" />} />
          <Route path="/home" element={<Home />} />
          <Route path="/booking/create" element={<CreateBooking />} />
          <Route path="/booking/edit/:id" element={<UpdateBooking />} />
          <Route path="/receipt/:id" element={<MostrarReceipt />} />
          <Route path="/users" element={<Users />} />
          <Route path="/create/user" element={<CreateUser />} />
          <Route path="/rack" element={<Rack />} />
          <Route path="/reportes" element={<Reportes />} />
          <Route path="/reportes-fee" element={<ReportesFee />} />
          <Route path="/reportes-group" element={<ReportesGroup />} />

          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
