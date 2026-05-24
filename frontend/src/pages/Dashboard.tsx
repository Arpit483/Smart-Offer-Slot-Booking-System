import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { Icon } from '../components/ui/Icon';
import type { DashboardSummary, RecentBooking } from '../types';

export default function Dashboard() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string>('');

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const response = await api.get('/dashboard/summary');
        setSummary(response.data);
        setLoadError('');
      } catch (error: unknown) {
        console.error("Failed to fetch dashboard summary", error);
        const err = error as { response?: { data?: { message?: string } } };
        setLoadError(err.response?.data?.message || 'Failed to load dashboard. Please refresh the page.');
        setSummary(null);
      } finally {
        setLoading(false);
      }
    };
    fetchSummary();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-on-surface-variant">
        <Icon name="progress_activity" size={40} className="animate-spin text-primary" />
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center p-8 bg-surface rounded neo-border neo-shadow max-w-md">
          <Icon name="error" size={48} className="text-on-surface-variant mx-auto mb-4" />
          <h2 className="font-display-hero text-headline-lg text-on-surface uppercase tracking-tight mb-4">Error Loading Dashboard</h2>
          <p className="font-body-md text-on-surface-variant font-bold uppercase tracking-widest mb-6">{loadError}</p>
          <button onClick={() => window.location.reload()} className="w-full px-6 py-3 bg-primary text-on-primary font-label-bold uppercase tracking-widest rounded neo-border hover:-translate-y-1 hover:neo-shadow transition-all">Refresh Page</button>
        </div>
      </div>
    );
  }

  const recentBookings = summary?.recentBookings || [];

  return (
    <div className="space-y-12 animate-in fade-in duration-300 pb-12 bg-background min-h-screen">
      
      <div className="flex justify-between items-end mt-2">
        <div>
          <h1 className="font-display-hero text-headline-xl uppercase tracking-tight text-on-background">
            Overview
          </h1>
          <p className="mt-2 font-body-md text-on-surface-variant font-bold uppercase tracking-widest">
            Real-time business metrics and booking status.
          </p>
        </div>
        <Link to="/admin/offers/create">
          <button className="px-6 py-3 bg-primary text-on-primary font-bold uppercase tracking-widest rounded neo-border neo-shadow hover:-translate-y-1 hover:neo-shadow-hover transition-all flex items-center gap-2">
            <Icon name="add" className="w-5 h-5" /> Create Offer
          </button>
        </Link>
      </div>

      {/* CORE METRICS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        
        {/* Total Offers */}
        <div className="bg-surface p-6 rounded neo-border neo-shadow flex flex-col justify-between h-36">
          <div className="text-on-surface-variant font-label-bold tracking-widest uppercase flex items-center gap-2">
            <Icon name="local_offer" size={18} /> Total Offers
          </div>
          <div className="font-display-hero text-display-sm text-on-surface mt-2">{summary?.totalOffers || 0}</div>
        </div>

        {/* Active Offers */}
        <div className="bg-primary p-6 rounded neo-border neo-shadow flex flex-col justify-between h-36">
          <div className="text-on-primary font-label-bold tracking-widest uppercase flex items-center gap-2">
            <Icon name="check_circle" size={18} /> Active Offers
          </div>
          <div className="font-display-hero text-display-sm text-on-primary mt-2">{summary?.activeOffers || 0}</div>
        </div>

        {/* Total Bookings */}
        <div className="bg-secondary p-6 rounded neo-border neo-shadow flex flex-col justify-between h-36">
          <div className="text-on-secondary font-label-bold tracking-widest uppercase flex items-center gap-2">
            <Icon name="book_online" size={18} /> Total Bookings
          </div>
          <div className="font-display-hero text-display-sm text-on-secondary mt-2">{summary?.totalBookings || 0}</div>
        </div>

        {/* Conversion Rate */}
        <div className="bg-tertiary p-6 rounded neo-border neo-shadow flex flex-col justify-between h-36">
          <div className="text-on-tertiary font-label-bold tracking-widest uppercase flex items-center gap-2">
            <Icon name="trending_up" size={18} /> Conversion Rate
          </div>
          <div className="font-display-hero text-display-sm text-on-tertiary mt-2">
            {summary?.conversionRate ? summary.conversionRate.toFixed(1) : '0'}%
          </div>
        </div>

      </div>

      {/* CAPACITY & ACTION PANELS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* CAPACITY STATS */}
        <div className="lg:col-span-2 bg-surface rounded neo-border neo-shadow p-8 flex flex-col">
          <div className="flex justify-between items-center mb-10 border-b-[3px] border-on-surface pb-4">
            <h3 className="font-display-hero text-headline-lg font-bold tracking-wide uppercase text-on-surface">Slot Capacity Utilization</h3>
          </div>
          
          <div className="flex-1 grid grid-cols-3 gap-8 items-center mt-4">
            <div className="text-center p-6 bg-surface-container-low rounded neo-border">
              <div className="font-display-hero text-headline-xl text-on-surface mb-2">{summary?.totalCapacity || 0}</div>
              <div className="font-label-bold text-on-surface-variant uppercase tracking-widest">Total Seats</div>
            </div>
            <div className="text-center p-6 bg-primary-container text-on-primary-container rounded neo-border neo-shadow">
              <div className="font-display-hero text-headline-xl mb-2">{summary?.totalBooked || 0}</div>
              <div className="font-label-bold uppercase tracking-widest">Booked Seats</div>
            </div>
            <div className="text-center p-6 bg-secondary-container text-on-secondary-container rounded neo-border neo-shadow">
              <div className="font-display-hero text-headline-xl mb-2">{summary?.totalAvailable || 0}</div>
              <div className="font-label-bold uppercase tracking-widest">Available Seats</div>
            </div>
          </div>
        </div>

        {/* RIGHT PANELS */}
        <div className="flex flex-col gap-8">
          
          {/* NEEDS ATTENTION */}
          <div className="bg-error text-on-error rounded neo-border neo-shadow p-6 flex flex-col justify-between flex-1 min-h-[180px]">
            <div>
              <h3 className="font-display-hero text-headline-md font-bold uppercase tracking-tight">Needs Attention</h3>
              <p className="font-body-md font-bold mt-2 leading-relaxed">
                Review your pending bookings to ensure customer slots are confirmed.
              </p>
            </div>
            <Link to="/admin/bookings" className="mt-6">
              <button className="bg-surface text-on-surface font-bold px-6 py-3 rounded neo-border hover:neo-shadow transition-all w-max uppercase tracking-widest text-sm">
                Manage Bookings
              </button>
            </Link>
          </div>

          {/* QUICK ACTION */}
          <div className="bg-surface-variant text-on-surface-variant rounded neo-border neo-shadow p-6 flex flex-col justify-between flex-1 min-h-[160px]">
            <Icon name="storefront" className="w-8 h-8 text-primary" />
            <div className="mt-4 flex justify-between items-end">
              <div className="font-label-bold uppercase tracking-widest">Storefront Profile</div>
              <Link to="/admin/business">
                <button className="bg-primary text-on-primary font-bold px-4 py-2 rounded neo-border hover:neo-shadow transition-all uppercase tracking-widest text-xs">
                  Edit Profile
                </button>
              </Link>
            </div>
          </div>

        </div>
      </div>

      {/* RECENT BOOKINGS TABLE */}
      <div className="bg-surface rounded-lg neo-border neo-shadow overflow-hidden">
        <div className="bg-surface-container-low text-on-surface p-6 border-b-[3px] border-on-surface flex justify-between items-center">
          <h3 className="font-display-hero text-headline-md font-bold tracking-wide uppercase text-on-surface">Recent Bookings</h3>
          <Link to="/admin/bookings" className="font-label-bold uppercase tracking-widest text-primary hover:text-primary-container transition-colors">
            View All →
          </Link>
        </div>
        
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead className="bg-surface-variant font-label-bold uppercase tracking-widest text-on-surface-variant border-b-[3px] border-on-surface">
              <tr>
                <th className="p-4 border-r-[3px] border-on-surface">Customer</th>
                <th className="p-4 border-r-[3px] border-on-surface">Reference</th>
                <th className="p-4 border-r-[3px] border-on-surface">People</th>
                <th className="p-4 border-r-[3px] border-on-surface">Status</th>
                <th className="p-4">Action</th>
              </tr>
            </thead>
            <tbody className="font-body-md font-bold text-on-surface">
              {recentBookings.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-on-surface-variant">No recent bookings.</td>
                </tr>
              ) : (
                recentBookings.map((booking: RecentBooking, idx: number) => {
                  return (
                    <tr key={idx} className="border-b-[3px] border-on-surface h-[72px] hover:bg-surface-variant transition-colors">
                      <td className="p-4 border-r-[3px] border-on-surface">{booking.customerName}</td>
                      <td className="p-4 border-r-[3px] border-on-surface font-mono text-sm">{booking.bookingReference}</td>
                      <td className="p-4 border-r-[3px] border-on-surface">{booking.numberOfPeople}</td>
                      <td className="p-4 border-r-[3px] border-on-surface">
                        <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded text-[10px] uppercase tracking-widest font-black neo-border ${
                          booking.status === 'Confirmed' ? 'bg-secondary-container text-on-secondary-container' :
                          booking.status === 'Cancelled' ? 'bg-error text-on-error' :
                          booking.status === 'Completed' ? 'bg-tertiary-container text-on-tertiary-container' :
                          'bg-surface-variant text-on-surface-variant'
                        }`}>
                          {booking.status}
                        </div>
                      </td>
                      <td className="p-4">
                        <Link to="/admin/bookings" className="text-primary hover:text-primary-container uppercase tracking-widest text-xs border-b-2 border-primary pb-0.5 transition-colors">Review</Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
