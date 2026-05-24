import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { Icon } from '../components/ui/Icon';
import type { Booking } from '../types';

export default function BookingSuccess() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const res = await api.get(`/bookings/${id}`);
        setBooking(res.data);
      } catch (err) {
        setError('Unable to load booking details.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchBooking();
  }, [id]);

  const handleCopy = () => {
    if (booking?.bookingReference) {
      navigator.clipboard.writeText(booking.bookingReference);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <Icon name="progress_activity" size={48} className="animate-spin text-primary" />
    </div>
  );

  if (error || !booking) return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="text-center p-8 bg-surface rounded neo-border neo-shadow max-w-md w-full">
        <Icon name="error" size={64} className="text-error mx-auto mb-6" />
        <h2 className="font-display-hero text-headline-lg text-on-surface uppercase tracking-tight mb-4">Booking Not Found</h2>
        <p className="font-body-md text-on-surface-variant font-bold uppercase tracking-widest mb-8">{error || "We couldn't find this booking."}</p>
        <button onClick={() => navigate('/explore')} className="w-full px-6 py-3 bg-primary text-on-primary font-label-bold uppercase tracking-widest rounded neo-border neo-shadow hover:-translate-y-1 hover:neo-shadow-hover transition-all">Browse Deals</button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background text-on-background font-body-base flex flex-col">
      
      {/* PUBLIC NAVBAR */}
      <header className="bg-surface border-b-[3px] border-on-surface sticky top-0 z-50 flex justify-between items-center h-20 px-6 w-full">
        <div className="max-w-max-width mx-auto w-full flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-primary rounded neo-border flex items-center justify-center group-hover:rotate-12 transition-transform">
              <Icon name="bolt" fill size={24} className="text-on-primary" />
            </div>
            <span className="font-display-hero text-headline-lg text-on-surface uppercase tracking-tight">SlotSpark</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link to="/login" className="px-6 py-2.5 rounded bg-secondary text-on-secondary font-label-bold uppercase tracking-widest neo-border hover:neo-shadow hover:-translate-y-1 transition-all">
              Partner Login
            </Link>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col items-center justify-center py-12 px-6">
        
        <div className="w-full max-w-[560px] flex flex-col gap-8">
          
          {/* SUCCESS HEADER */}
          <div className="text-center">
            <div className="w-24 h-24 rounded bg-primary text-on-primary mx-auto mb-6 flex items-center justify-center neo-border neo-shadow transform rotate-3">
              <Icon name="check_circle" size={48} fill />
            </div>
            <h1 className="font-display-hero text-display-md text-on-background uppercase tracking-tight mb-2">Booking Confirmed!</h1>
            <p className="font-label-bold text-on-surface-variant uppercase tracking-widest text-lg">Your slot has been reserved successfully.</p>
          </div>

          {/* BOOKING REFERENCE CARD */}
          <div className="bg-surface rounded border-[3px] border-on-surface p-8 text-center shadow-[8px_8px_0_0_#000] dark:shadow-[8px_8px_0_0_#fff]">
            <p className="font-label-bold text-on-surface-variant uppercase tracking-widest mb-4">BOOKING REFERENCE</p>
            <div className="flex items-center justify-center gap-4">
              <span className="font-mono-code font-bold text-headline-xl text-on-surface bg-surface-container-low px-4 py-2 rounded neo-border">{booking.bookingReference}</span>
              <button 
                onClick={handleCopy} 
                className="w-14 h-14 rounded bg-secondary text-on-secondary hover:neo-shadow hover:-translate-y-1 transition-all flex items-center justify-center neo-border"
              >
                {copied ? (
                  <Icon name="check" size={24} />
                ) : (
                  <Icon name="content_copy" size={24} />
                )}
              </button>
            </div>
            
            <div className="mt-8 mx-auto w-40 h-40 bg-surface-container-low rounded border-[3px] border-on-surface flex items-center justify-center">
              <Icon name="qr_code_2" size={64} className="text-on-surface" />
            </div>
          </div>

          {/* BOOKING DETAILS CARD */}
          <div className="bg-surface rounded border-[3px] border-on-surface overflow-hidden neo-shadow">
            <div className="h-2 w-full bg-primary border-b-[3px] border-on-surface"></div>
            
            <div className="p-8 space-y-6">
              
              <div className="flex items-center gap-6">
                <div className="w-12 h-12 rounded bg-surface-variant border-[3px] border-on-surface flex items-center justify-center flex-shrink-0">
                  <Icon name="calendar_today" size={24} className="text-on-surface" />
                </div>
                <div className="flex-1">
                  <p className="font-label-bold text-on-surface-variant uppercase tracking-widest mb-1">SLOT DATE & TIME</p>
                  <p className="font-headline-sm font-bold text-on-surface uppercase tracking-tight">
                    {new Date(booking.slotDate).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })} · {booking.slotStartTime}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="w-12 h-12 rounded bg-surface-variant border-[3px] border-on-surface flex items-center justify-center flex-shrink-0">
                  <Icon name="storefront" size={24} className="text-on-surface" />
                </div>
                <div className="flex-1">
                  <p className="font-label-bold text-on-surface-variant uppercase tracking-widest mb-1">BUSINESS</p>
                  <p className="font-headline-sm font-bold text-on-surface uppercase tracking-tight">Premium Partner</p>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="w-12 h-12 rounded bg-surface-variant border-[3px] border-on-surface flex items-center justify-center flex-shrink-0">
                  <Icon name="local_offer" size={24} className="text-on-surface" />
                </div>
                <div className="flex-1">
                  <p className="font-label-bold text-on-surface-variant uppercase tracking-widest mb-1">OFFER</p>
                  <p className="font-headline-sm font-bold text-on-surface uppercase tracking-tight">{booking.offerTitle}</p>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="w-12 h-12 rounded bg-surface-variant border-[3px] border-on-surface flex items-center justify-center flex-shrink-0">
                  <Icon name="group" size={24} className="text-on-surface" />
                </div>
                <div className="flex-1">
                  <p className="font-label-bold text-on-surface-variant uppercase tracking-widest mb-1">GUESTS</p>
                  <p className="font-headline-sm font-bold text-on-surface uppercase tracking-tight">{booking.numberOfPeople} people</p>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="w-12 h-12 rounded bg-surface-variant border-[3px] border-on-surface flex items-center justify-center flex-shrink-0">
                  <Icon name="info" size={24} className="text-on-surface" />
                </div>
                <div className="flex-1">
                  <p className="font-label-bold text-on-surface-variant uppercase tracking-widest mb-1">STATUS</p>
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded bg-secondary text-on-secondary font-label-bold uppercase tracking-widest mt-1 border-[3px] border-on-surface">
                    <span className="w-2.5 h-2.5 rounded-full bg-on-secondary border-[2px] border-on-surface"></span>
                    <span>Confirmed</span>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* ACTIONS ROW */}
          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <button 
              onClick={() => navigate('/explore')}
              className="flex-1 py-4 bg-primary text-on-primary rounded font-label-bold uppercase tracking-widest flex items-center justify-center gap-2 neo-border hover:neo-shadow hover:-translate-y-1 transition-all"
            >
              <Icon name="arrow_back" size={20} />
              <span>View All Offers</span>
            </button>
            <button className="flex-1 py-4 bg-surface text-on-surface rounded font-label-bold uppercase tracking-widest flex items-center justify-center gap-2 neo-border hover:neo-shadow hover:-translate-y-1 transition-all">
              <Icon name="share" size={20} />
              <span>Share Booking</span>
            </button>
          </div>

          {/* BOTTOM NOTE */}
          <p className="text-center font-label-bold text-on-surface-variant mt-4 uppercase tracking-widest">
            A confirmation has been sent to your email address.
          </p>

        </div>
      </main>

    </div>
  );
}
