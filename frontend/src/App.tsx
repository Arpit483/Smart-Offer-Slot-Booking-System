import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import AdminLayout from './layouts/AdminLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import BusinessProfile from './pages/BusinessProfile';
import Offers from './pages/Offers';
import CreateOffer from './pages/CreateOffer';
import Bookings from './pages/Bookings';
import Slots from './pages/Slots';
import Settings from './pages/Settings';
import LandingPage from './pages/LandingPage';
import Explore from './pages/Explore';
import OfferDetails from './pages/OfferDetails';
import BookingSuccess from './pages/BookingSuccess';
import { NotFoundPage } from './pages/NotFoundPage';

import PageTransition from './components/ui/PageTransition';

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public / Customer Routes */}
        <Route path="/" element={<PageTransition><LandingPage /></PageTransition>} />
        <Route path="/explore" element={<PageTransition><Explore /></PageTransition>} />
        <Route path="/offer/:id" element={<PageTransition><OfferDetails /></PageTransition>} />
        <Route path="/booking-success/:id" element={<PageTransition><BookingSuccess /></PageTransition>} />
        <Route path="/login" element={<PageTransition><Login /></PageTransition>} />

        {/* Admin Routes */}
        <Route path="/admin" element={<PageTransition><AdminLayout /></PageTransition>}>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<PageTransition><Dashboard /></PageTransition>} />
          <Route path="business" element={<PageTransition><BusinessProfile /></PageTransition>} />
          <Route path="offers" element={<PageTransition><Offers /></PageTransition>} />
          <Route path="offers/create" element={<PageTransition><CreateOffer /></PageTransition>} />
          <Route path="offers/:id/edit" element={<PageTransition><CreateOffer /></PageTransition>} />
          <Route path="slots" element={<PageTransition><Slots /></PageTransition>} />
          <Route path="bookings" element={<PageTransition><Bookings /></PageTransition>} />
          <Route path="settings" element={<PageTransition><Settings /></PageTransition>} />
        </Route>

        {/* Catch-all 404 */}
        <Route path="*" element={<PageTransition><NotFoundPage /></PageTransition>} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
