import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { Icon } from '../components/ui/Icon';
import type { Offer, Slot } from '../types';
import { motion } from 'framer-motion';

export default function OfferDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [offer, setOffer] = useState<Offer | null>(null);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string>('');

  const [customerName, setCustomerName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [numberOfPeople, setNumberOfPeople] = useState(1);
  const [isBooking, setIsBooking] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOfferAndSlots = async () => {
      try {
        const [offerRes, slotsRes] = await Promise.all([
          api.get(`/offers/${id}`),
          api.get(`/offers/${id}/slots`)
        ]);
        setOffer(offerRes.data);
        setSlots(slotsRes.data);
        setLoadError('');
      } catch (err: unknown) {
        console.error(err);
        const error_obj = err as { response?: { data?: { message?: string } } };
        setLoadError(error_obj.response?.data?.message || 'Failed to load offer details. Please try again.');
        setOffer(null);
        setSlots([]);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchOfferAndSlots();
  }, [id]);

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSlot || !offer) return;

    setIsBooking(true);
    setError('');

    try {
      const response = await api.post('/bookings', {
        slotId: selectedSlot.id,
        offerId: offer.id,
        customerName,
        phone,
        email,
        numberOfPeople,
        specialNote: ''
      });
      navigate(`/booking-success/${response.data.id}`);
    } catch (err: unknown) {
      const error_obj = err as { response?: { data?: { message?: string } } };
      setError(error_obj.response?.data?.message || 'Failed to book slot. It might be full.');
    } finally {
      setIsBooking(false);
    }
  };

  const getCategoryImage = (category: string) => {
    if (category.includes('Restaurant') || category.includes('Dining')) return '/images/restaurant.jpg';
    if (category.includes('Gym') || category.includes('Fitness')) return '/images/gym.jpg';
    if (category.includes('Salon') || category.includes('Beauty')) return '/images/salon.jpg';
    if (category.includes('Clinic') || category.includes('Health')) return '/images/clinic.jpg';
    if (category.includes('Coaching') || category.includes('Education')) return '/images/coaching.jpg';
    if (category.includes('Turf') || category.includes('Sports')) return '/images/gym.jpg'; // fallback
    return '/images/spa.jpg'; // fallback
  };

  if (loading) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
       <Icon name="progress_activity" size={48} className="animate-spin text-primary" />
    </div>
  );
  
  if (!offer) return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
       <div className="text-center p-8 bg-surface rounded neo-border neo-shadow max-w-md w-full">
         <Icon name={loadError ? 'error' : 'search_off'} size={64} className="text-on-surface-variant mx-auto mb-6" />
         <h2 className="font-display-hero text-headline-xl text-on-surface uppercase tracking-tight mb-4">
           {loadError ? 'Error Loading Offer' : 'Offer Not Found'}
         </h2>
         <p className="font-body-md text-on-surface-variant font-bold uppercase tracking-widest mb-8">
           {loadError || "The offer you're looking for doesn't exist or has expired."}
         </p>
         <button onClick={() => navigate('/explore')} className="w-full px-6 py-3 bg-primary text-on-primary font-label-bold uppercase tracking-widest rounded neo-border neo-shadow hover:-translate-y-1 hover:neo-shadow-hover transition-all">Back to Explore</button>
       </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background text-on-background font-body-base antialiased flex flex-col">
      
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
      <main className="flex-grow w-full max-w-max-width mx-auto px-6 py-12">
        
        {/* BREADCRUMB */}
        <div className="mb-8 flex items-center gap-3 text-on-surface-variant font-label-bold uppercase tracking-widest text-sm">
          <button onClick={() => navigate(-1)} className="flex items-center gap-1 hover:text-primary transition-colors group">
            <Icon name="arrow_back" size={18} className="group-hover:-translate-x-1 transition-transform" />
            <span>Offers</span>
          </button>
          <span>/</span>
          <span className="text-on-background">{offer.title}</span>
        </div>

        {/* TWO-COLUMN GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* LEFT COLUMN */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-7 xl:col-span-8 flex flex-col gap-8"
          >
            
            {/* Hero image */}
            <div className="w-full aspect-[16/9] md:aspect-[2/1] bg-surface rounded neo-border neo-shadow overflow-hidden relative group">
              <img 
                src={getCategoryImage(offer.category)} 
                alt={offer.title} 
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
              />
              
              <div className="absolute top-4 left-4 flex gap-2">
                <div className="bg-surface text-on-surface px-4 py-2 rounded neo-border flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-secondary animate-pulse neo-border"></span>
                  <span className="font-label-bold uppercase tracking-widest">Active</span>
                </div>
                <div className="bg-primary text-on-primary px-4 py-2 rounded neo-border font-label-bold uppercase tracking-widest">
                  {offer.category}
                </div>
              </div>
            </div>

            {/* Offer info card */}
            <div className="bg-surface p-8 rounded neo-border neo-shadow">
              <h1 className="font-display-hero text-display-md text-on-surface uppercase tracking-tight leading-none mb-6">
                {offer.title}
              </h1>
              <div className="flex flex-wrap items-center gap-x-8 gap-y-4 font-label-bold uppercase tracking-widest text-on-surface-variant">
                {offer.businessName && (
                  <div className="flex items-center gap-2">
                    <Icon name="storefront" size={24} className="text-primary" />
                    <span>{offer.businessName}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Icon name="local_offer" size={24} className="text-primary" />
                  <span>{offer.category}</span>
                </div>
                <div className="flex items-center gap-2 cursor-pointer hover:text-primary transition-colors">
                  <Icon name="location_on" size={24} className="text-primary" />
                  <span>View Address</span>
                </div>
              </div>
            </div>

            {/* About card */}
            <div className="bg-surface p-8 rounded neo-border neo-shadow">
              <h3 className="font-display-hero text-headline-lg text-on-surface mb-6 uppercase tracking-tight">About this Offer</h3>
              <p className="text-on-surface font-body-lg font-bold leading-relaxed">
                {offer.description || 'Exclusive deal available for a limited time. Book your slot now to secure this premium experience before slots run out.'}
              </p>
            </div>

            {/* Terms card */}
            <div className="bg-surface p-8 rounded neo-border neo-shadow">
              <div className="flex items-center gap-3 mb-6">
                <Icon name="info" className="text-primary" size={32} />
                <h3 className="font-display-hero text-headline-lg text-on-surface uppercase tracking-tight">Terms & Conditions</h3>
              </div>
              <ul className="space-y-4 text-on-surface font-body-md font-bold list-disc list-inside marker:text-primary">
                {offer.terms ? (
                   offer.terms.split('\n').filter(Boolean).map((term, i) => <li key={i}>{term}</li>)
                ) : (
                   <>
                     <li>Standard booking terms apply.</li>
                     <li>Please arrive 10 minutes prior to your scheduled slot.</li>
                     <li>Cancellations must be made at least 24 hours in advance.</li>
                     <li>Cannot be combined with other ongoing offers.</li>
                   </>
                )}
              </ul>
            </div>
            
          </motion.div>

          {/* RIGHT COLUMN */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-5 xl:col-span-4 lg:sticky lg:top-[104px]"
          >
            
            <div className="bg-surface rounded neo-border neo-shadow overflow-hidden flex flex-col">
              
              {/* Card header */}
              <div className="p-6 border-b-[3px] border-on-surface bg-surface-container-low flex justify-between items-center">
                <span className="font-label-bold uppercase tracking-widest text-on-surface">Select a Time Slot</span>
                <div className="flex items-center gap-2 text-primary px-3 py-1 bg-surface neo-border rounded">
                  <Icon name="local_fire_department" size={20} fill />
                  <span className="font-label-bold uppercase tracking-widest">FILLING FAST</span>
                </div>
              </div>

              {/* PRICING SECTION */}
              <div className="p-8 border-b-[3px] border-on-surface bg-surface">
                <div className="flex items-end gap-4 mb-4">
                  <span className="font-display-hero text-headline-sm text-outline line-through mb-1">₹{offer.originalPrice}</span>
                  <span className="font-display-hero text-display-md text-primary leading-none">₹{offer.offerPrice}</span>
                </div>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded bg-secondary-container text-on-secondary-container font-label-bold uppercase tracking-widest neo-border">
                  <Icon name="check_circle" size={18} fill />
                  <span>You save ₹{offer.originalPrice - offer.offerPrice} ({offer.discountPercent.toFixed(0)}%)</span>
                </div>
              </div>

              {/* SLOT PICKER GRID */}
              <div className="p-8 pb-4 bg-surface">
                <div className="grid grid-cols-2 gap-4 mb-8" id="slot-grid">
                  {slots.map(slot => {
                    const isFull = slot.availableCount === 0;
                    const isSelected = selectedSlot?.id === slot.id;

                    if (isFull) {
                      return (
                        <div key={slot.id} className="relative w-full h-16 rounded border-[3px] border-on-surface bg-surface-variant opacity-60 cursor-not-allowed flex flex-col items-center justify-center">
                          <span className="font-label-bold uppercase tracking-widest text-on-surface-variant line-through">{slot.startTime}</span>
                          <div className="absolute inset-0 bg-surface/50 backdrop-blur-sm flex items-center justify-center">
                            <span className="font-label-bold uppercase tracking-widest bg-error text-on-error px-2 py-1 rounded">FULL</span>
                          </div>
                        </div>
                      );
                    }

                    if (isSelected) {
                      return (
                        <div key={slot.id} className="relative w-full h-16 rounded border-[3px] border-on-surface bg-primary text-on-primary flex flex-col items-center justify-center shadow-[4px_4px_0_0_#000] dark:shadow-[4px_4px_0_0_#fff] transform -translate-y-1 transition-all cursor-pointer">
                          <Icon name="check_circle" size={16} fill className="absolute top-1 right-1 text-on-primary" />
                          <span className="font-headline-sm font-bold uppercase tracking-widest">{slot.startTime}</span>
                          <span className="text-[10px] font-bold uppercase tracking-widest mt-0.5">Selected</span>
                        </div>
                      );
                    }

                    return (
                      <div key={slot.id} onClick={() => setSelectedSlot(slot)} className="relative w-full h-16 rounded border-[3px] border-on-surface bg-surface hover:bg-surface-variant hover:shadow-[4px_4px_0_0_#000] dark:hover:shadow-[4px_4px_0_0_#fff] hover:-translate-y-1 transition-all flex flex-col items-center justify-center cursor-pointer">
                        <span className="font-headline-sm font-bold text-on-surface uppercase tracking-widest">{slot.startTime}</span>
                        <span className="text-[10px] font-bold text-secondary uppercase tracking-widest mt-0.5">Available</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Booking form combined with PEOPLE COUNT & BOOK BUTTON */}
              <form onSubmit={handleBooking} className="bg-surface">
                
                {error && (
                  <div className="mx-8 mb-6 bg-error text-on-error rounded p-4 font-label-bold uppercase tracking-widest flex items-center gap-3 neo-border">
                    <Icon name="error" size={24} />
                    {error}
                  </div>
                )}

                {/* Customer Details fields */}
                <div className="px-8 space-y-4 mb-6">
                  <input 
                    type="text" 
                    required 
                    placeholder="Full Name" 
                    value={customerName} 
                    onChange={e => setCustomerName(e.target.value)}
                    className="w-full px-4 py-4 bg-surface-container-low neo-border rounded font-bold text-on-surface placeholder:text-outline focus:outline-none focus:neo-shadow transition-shadow"
                  />
                  <input 
                    type="email" 
                    required 
                    placeholder="Email Address" 
                    value={email} 
                    onChange={e => setEmail(e.target.value)}
                    className="w-full px-4 py-4 bg-surface-container-low neo-border rounded font-bold text-on-surface placeholder:text-outline focus:outline-none focus:neo-shadow transition-shadow"
                  />
                  <input 
                    type="tel" 
                    required 
                    placeholder="Phone Number" 
                    value={phone} 
                    onChange={e => setPhone(e.target.value)}
                    className="w-full px-4 py-4 bg-surface-container-low neo-border rounded font-bold text-on-surface placeholder:text-outline focus:outline-none focus:neo-shadow transition-shadow"
                  />
                </div>

                <div className="px-8 pb-8 border-b-[3px] border-on-surface">
                  <div className="font-label-bold text-on-surface uppercase tracking-widest mb-4">Number of People</div>
                  <div className="flex items-center gap-6">
                    <button 
                      type="button"
                      onClick={() => setNumberOfPeople(Math.max(1, numberOfPeople - 1))}
                      className="w-12 h-12 rounded bg-surface-container-low neo-border flex items-center justify-center text-on-surface hover:neo-shadow hover:-translate-y-1 transition-all"
                    >
                      <Icon name="remove" size={24} />
                    </button>
                    <span className="font-display-hero text-headline-xl text-on-surface w-12 text-center">{numberOfPeople}</span>
                    <button
                      type="button"
                      onClick={() => {
                        const maxAllowed = selectedSlot ? selectedSlot.availableCount : (offer?.maxBookingPerCustomer || 10);
                        setNumberOfPeople(Math.min(maxAllowed, numberOfPeople + 1));
                      }}
                      className="w-12 h-12 rounded bg-surface-container-low neo-border flex items-center justify-center text-on-surface hover:neo-shadow hover:-translate-y-1 transition-all"
                    >
                      <Icon name="add" size={24} />
                    </button>
                  </div>
                </div>

                <div className="p-8 bg-surface-alt">
                  <button 
                    type="submit"
                    disabled={!selectedSlot || isBooking}
                    className="w-full py-5 bg-primary text-on-primary rounded font-display-hero text-headline-sm uppercase tracking-wider neo-border hover:neo-shadow-hover hover:-translate-y-1 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none"
                  >
                    {isBooking ? (
                      <Icon name="progress_activity" size={28} className="animate-spin" />
                    ) : (
                      <>
                        <Icon name="calendar_today" size={28} />
                        <span>Book This Slot</span>
                      </>
                    )}
                  </button>
                  <p className="text-center font-label-bold text-on-surface-variant mt-4 uppercase tracking-widest">
                    Free cancellation · Instant confirmation
                  </p>
                </div>

              </form>

            </div>

          </motion.div>

        </div>
      </main>
    </div>
  );
}
