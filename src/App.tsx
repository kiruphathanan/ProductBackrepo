import { Home, Package, Settings, Users, Bell, User } from 'lucide-react';
import ProductList from './components/ProductList/ProductList';
import './index.css';

function App() {
  return (
    <div className="app-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <div className="logo-icon">P</div>
          Productify
        </div>
        <nav className="sidebar-nav">
          <div className="nav-item"><Home size={18} /> Dashboard</div>
          <div className="nav-item active"><Package size={18} /> Products</div>
          <div className="nav-item"><Users size={18} /> Customers</div>
          <div className="nav-item"><Settings size={18} /> Settings</div>
        </nav>
      </aside>

      {/* Main Content Area */}
      <div className="main-wrapper">
        {/* Top Navbar */}
        <header className="top-navbar">
          <h1>Products</h1>
          <div className="user-profile">
            <button className="btn-icon" title="Notifications">
              <Bell size={20} />
            </button>
            <div className="avatar">
              <User size={20} color="var(--text-secondary)" />
            </div>
          </div>
        </header>

        {/* Scrollable Content Container */}
        <main className="main-content">
          <div className="content-container">
            <ProductList />
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
