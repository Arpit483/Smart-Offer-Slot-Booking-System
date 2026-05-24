import { useState } from 'react';
import { Navigate, Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Icon } from '../components/ui/Icon';
import ThemeToggle from '../components/ui/ThemeToggle';
import api from '../services/api';

export default function AdminLayout() {
  const { isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const handleGenerateReport = async () => {
    try {
      const response = await api.get('/bookings');
      const bookings = response.data;
      if (!bookings || bookings.length === 0) {
        alert('No data available to generate report.');
        return;
      }
      
      const headers = ['ID', 'Customer Name', 'Offer Title', 'Status', 'Date', 'Time'];
      const csvContent = [
        headers.join(','),
        ...bookings.map((b: any) => [
          b.id,
          `"${b.customerName}"`,
          `"${b.offerTitle}"`,
          b.status,
          b.slotDate ? new Date(b.slotDate).toLocaleDateString() : '',
          b.slotStartTime
        ].join(','))
      ].join('\\n');
      
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `bookings_report_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Failed to generate report:', error);
      alert('Failed to generate report. Please try again.');
    }
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: 'dashboard' },
    { name: 'Offers', path: '/admin/offers', icon: 'local_offer' },
    { name: 'Slots', path: '/admin/slots', icon: 'event_seat' },
    { name: 'Bookings', path: '/admin/bookings', icon: 'confirmation_number' },
    { name: 'Business Profile', path: '/admin/business', icon: 'store' },
    { name: 'Settings', path: '/admin/settings', icon: 'settings' }
  ];

  return (
    <div className="bg-background text-on-background font-body-base antialiased flex h-screen overflow-hidden">
      
      {/* MOBILE BACKDROP */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-10 md:hidden" 
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside className={`fixed md:relative inset-y-0 left-0 bg-surface text-on-surface w-64 h-screen flex flex-col py-6 px-4 flex-shrink-0 z-20 overflow-y-auto neo-border border-l-0 border-t-0 border-b-0 transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <div className="mb-10 px-4">
          <h1 className="font-display-hero text-headline-xl font-bold uppercase tracking-widest">Admin<br/>Panel</h1>
          <p className="text-on-surface-variant text-sm mt-1">Manage Marketplace</p>
        </div>

        <nav className="flex-1 space-y-4">
          {navItems.map((item) => {
            const isActive = location.pathname.startsWith(item.path) && item.path !== '#';
            return (
              <Link 
                key={item.name} 
                to={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={isActive 
                  ? "flex items-center gap-3 px-4 py-3 text-white bg-[#A855F7] font-bold neo-border neo-shadow transition-colors duration-200"
                  : "flex items-center gap-3 px-4 py-3 text-on-surface hover:bg-surface-variant font-bold transition-colors duration-200"
                }
              >
                <Icon name={item.icon} fill={isActive} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="mt-8 mb-4">
          <button onClick={handleGenerateReport} className="w-full bg-[#FFDC58] text-black font-bold py-3 neo-border neo-shadow hover:neo-shadow-hover transition-all">
            Generate Report
          </button>
        </div>

        <div className="mt-auto pt-4 border-t-3 border-on-surface">
          <Link to="/admin/settings" className="w-full flex items-center gap-3 px-4 py-3 text-on-surface hover:bg-surface-variant font-bold transition-colors duration-200">
            <Icon name="help_outline" />
            <span>Help Center</span>
          </Link>
          <button 
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3 text-on-surface hover:bg-surface-variant font-bold transition-colors duration-200"
          >
            <Icon name="logout" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col overflow-y-auto bg-surface-alt relative w-full">
        
        {/* TOPBAR */}
        <header className="h-24 bg-background border-b-0 flex items-center justify-between px-4 md:px-gutter-desktop sticky top-0 z-10 shrink-0">
          <div className="flex items-center gap-4">
            <button 
              className="md:hidden p-2 text-on-background hover:bg-surface-variant rounded neo-border"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Icon name="menu" className="w-6 h-6" />
            </button>
            <div>
              <h2 className="font-display-hero text-xl md:text-3xl font-extrabold text-on-background tracking-tight uppercase">
                SYSTEM OVERVIEW
              </h2>
              <div className="hidden md:flex items-center gap-2 mt-1">
                <div className="w-3 h-3 bg-[#00e6ac] neo-border"></div>
                <span className="text-sm font-bold text-[#00e6ac]">Real-time Data Active</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4 md:gap-6">
            <div className="relative hidden md:block">
              <Icon name="search" className="absolute left-0 top-1/2 -translate-y-1/2 text-on-background" />
              <input type="text" placeholder="Search data..." className="pl-8 pr-4 py-2 bg-transparent border-b-3 border-on-background text-on-background focus:outline-none font-body-sm font-bold placeholder-on-surface-variant w-64" />
            </div>
            <ThemeToggle />
            <Link to="/admin/business" className="w-10 h-10 bg-primary-container flex items-center justify-center text-on-surface font-bold neo-border shadow-[2px_2px_0px_0px_var(--color-shadow)] hover:bg-primary transition-colors cursor-pointer">
              <Icon name="person" />
            </Link>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <main className="flex-1 p-gutter-desktop max-w-max-width mx-auto w-full">
          <Outlet />
        </main>
      </div>

    </div>
  );
}
