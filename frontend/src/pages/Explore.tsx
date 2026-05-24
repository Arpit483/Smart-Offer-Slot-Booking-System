import { useEffect, useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import api from '../services/api';
import { Icon } from '../components/ui/Icon';
import ThemeToggle from '../components/ui/ThemeToggle';
import type { Offer } from '../types';
import { motion } from 'framer-motion';
import Tilt from 'react-parallax-tilt';

export default function Explore() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [priceMax, setPriceMax] = useState<number | ''>(5000);
  const [availableOnly, setAvailableOnly] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string>('');
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPublicOffers = async () => {
      try {
        const res = await api.get('/offers/public');
        setOffers(res.data);
        setLoadError('');
      } catch (err: unknown) {
        console.error(err);
        const error = err as { response?: { data?: { message?: string } } };
        setLoadError(error.response?.data?.message || 'Failed to load offers. Please try again.');
        setOffers([]);
      } finally {
        setLoading(false);
      }
    };
    fetchPublicOffers();
  }, []);

  const categories = ['All', 'Restaurant', 'Gym', 'Salon', 'Clinic', 'Coaching', 'Turf', 'Fitness', 'Other'];

  const filteredOffers = useMemo(() => {
    return offers.filter(offer => {
      const matchesSearch = offer.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            offer.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            offer.businessName?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || offer.category === selectedCategory;
      const matchesPrice = !priceMax || offer.offerPrice <= priceMax;

      // In a real app we'd check actual availability from API, here we just use capacity for demo
      const matchesAvailable = !availableOnly || offer.capacity > 0;

      return matchesSearch && matchesCategory && matchesPrice && matchesAvailable;
    });
  }, [offers, searchQuery, selectedCategory, priceMax, availableOnly]);

  const getCategoryColor = (category: string) => {
    if (category.includes('Restaurant') || category.includes('Dining')) return 'bg-primary-container';
    if (category.includes('Gym') || category.includes('Fitness')) return 'bg-[#6C63FF]';
    if (category.includes('Salon') || category.includes('Beauty')) return 'bg-[#FF4D9E]';
    if (category.includes('Clinic') || category.includes('Health')) return 'bg-accent-success';
    if (category.includes('Coaching') || category.includes('Education')) return 'bg-warning';
    if (category.includes('Turf') || category.includes('Sports')) return 'bg-[#22C55E]';
    return 'bg-tertiary';
  };

  const getCategoryIcon = (category: string) => {
    if (category.includes('Restaurant') || category.includes('Dining')) return 'restaurant';
    if (category.includes('Gym') || category.includes('Fitness')) return 'fitness_center';
    if (category.includes('Salon') || category.includes('Beauty')) return 'spa';
    if (category.includes('Clinic') || category.includes('Health')) return 'medical_services';
    if (category.includes('Coaching') || category.includes('Education')) return 'school';
    if (category.includes('Turf') || category.includes('Sports')) return 'sports_soccer';
    return 'local_offer';
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

  return (
    <div className="bg-background text-on-background font-body-base min-h-screen flex flex-col">
      
      {/* TOP NAVBAR */}
      <header className="bg-surface border-b border-outline-variant shadow-sm sticky top-0 z-50 flex justify-between items-center h-16 px-6 w-full">
        <div className="max-w-max-width mx-auto w-full flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2">
            <Icon name="bolt" fill size={28} className="text-primary" />
            <span className="font-headline-2xl text-headline-2xl text-primary">SlotSpark</span>
          </Link>

          <div className="hidden md:block relative w-full max-w-md">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant flex items-center">
              <Icon name="search" size={20} />
            </div>
            <input 
              type="text" 
              placeholder="Search offers, businesses..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-surface-container-low border-none rounded-full focus:ring-2 focus:ring-primary focus:bg-surface transition-colors font-body-sm text-body-sm text-on-surface placeholder-on-surface-variant outline-none"
            />
          </div>

          <div className="flex items-center gap-6">
            <ThemeToggle />
            {isAuthenticated ? (
              <Link to="/admin/dashboard" className="px-6 py-3 bg-secondary text-on-secondary font-label-bold uppercase tracking-widest rounded neo-border neo-shadow hover:-translate-y-1 hover:neo-shadow-hover transition-all">
                Dashboard
              </Link>
            ) : (
              <Link to="/login" className="px-6 py-3 bg-primary text-on-primary font-label-bold uppercase tracking-widest rounded neo-border neo-shadow hover:-translate-y-1 hover:neo-shadow-hover transition-all">
                Partner Login
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="bg-admin-sidebar w-full py-space-12 overflow-hidden relative">
        <motion.div 
          animate={{ y: [0, -10, 0], opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-0 right-1/4 w-64 h-64 bg-primary-container/20 rounded-full blur-3xl"
        />
        <motion.div 
          animate={{ y: [0, 10, 0], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-0 left-1/4 w-96 h-96 bg-[#6C63FF]/20 rounded-full blur-3xl"
        />
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-max-width mx-auto px-gutter-desktop text-center relative z-10"
        >
          <h1 className="font-display-hero text-display-hero text-on-background uppercase tracking-tight">
            Exclusive Deals. Limited Slots.
          </h1>
          <p className="font-body-base text-body-base text-on-surface-variant mt-4 font-bold uppercase tracking-widest">
            Book premium experiences before they're gone.
          </p>

          <div className="flex flex-wrap justify-center gap-3 mt-space-8">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-5 py-2 rounded font-label-bold uppercase tracking-widest transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-primary text-on-primary neo-border neo-shadow'
                    : 'bg-surface text-on-surface hover:bg-surface-variant neo-border'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </motion.div>
      </section>

      {/* MAIN CONTENT */}
      <main className="flex-1 max-w-max-width mx-auto w-full px-gutter-desktop py-space-8 flex gap-space-8">
        
        {/* LEFT FILTER SIDEBAR */}
        <aside className="w-64 flex-shrink-0 hidden lg:block bg-surface rounded-xl border border-border p-space-6 sticky top-20 space-y-space-6 h-fit">
          <h2 className="font-headline-lg text-headline-lg font-bold text-on-surface mb-space-4 uppercase tracking-tight">Filters</h2>

          <div className="border-b-[3px] border-on-surface pb-space-4">
            <h3 className="font-label-bold text-on-surface-variant uppercase tracking-widest mb-3">Category</h3>
            <div className="space-y-2">
              {['Fitness & Wellness', 'Dining & Food', 'Beauty & Spa', 'Entertainment'].map(cat => (
                <label key={cat} className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={selectedCategory === cat || selectedCategory === 'All'} 
                    onChange={() => setSelectedCategory(cat)}
                    className="h-5 w-5 rounded-sm neo-border text-primary cursor-pointer"
                  />
                  <span className="font-body-md text-on-surface font-bold">{cat}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="border-b-[3px] border-on-surface pb-space-4">
            <h3 className="font-label-bold text-on-surface-variant uppercase tracking-widest mb-3">Price Range</h3>
            <div className="space-y-3">
              <input 
                type="range" 
                min="0" 
                max="5000" 
                step="100"
                value={priceMax || 5000}
                onChange={(e) => setPriceMax(Number(e.target.value))}
                className="w-full" 
              />
              <div className="flex justify-between text-on-surface-variant font-label-bold uppercase tracking-widest">
                <span>₹0</span>
                <span>₹{priceMax || '5000'}</span>
              </div>
            </div>
          </div>

          <div className="border-b-[3px] border-on-surface pb-space-4">
            <label className="flex items-center justify-between cursor-pointer">
              <span className="font-body-md text-on-surface font-bold uppercase tracking-widest">Show Available Only</span>
              <div 
                className={`w-11 h-6 rounded-full cursor-pointer transition-colors relative ${availableOnly ? 'bg-primary-container' : 'bg-border'}`}
                onClick={() => setAvailableOnly(!availableOnly)}
              >
                <div className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${availableOnly ? 'translate-x-5' : 'translate-x-0'}`}></div>
              </div>
            </label>
          </div>

          <button 
            onClick={() => { setSearchQuery(''); setSelectedCategory('All'); setPriceMax(5000); setAvailableOnly(false); }}
            className="w-full py-3 bg-surface text-on-surface rounded neo-border hover:neo-shadow transition-all font-label-bold uppercase tracking-widest"
          >
            Reset Filters
          </button>
        </aside>

        {/* RIGHT OFFER GRID */}
        <div className="flex-1 min-w-0">
          
          {/* Results bar */}
          <div className="flex justify-between items-center mb-space-6">
            <span className="font-label-bold text-on-surface-variant uppercase tracking-widest">{filteredOffers.length} offers found</span>
            <select className="bg-surface-container-low neo-border rounded px-4 py-2 font-label-bold text-on-surface uppercase tracking-widest outline-none focus:neo-shadow cursor-pointer">
              <option className="bg-surface text-on-surface">Sort by: Recommended</option>
              <option className="bg-surface text-on-surface">Price: Low to High</option>
              <option className="bg-surface text-on-surface">Price: High to Low</option>
              <option className="bg-surface text-on-surface">Ending Soon</option>
            </select>
          </div>

          {loading ? (
             <div className="flex justify-center py-20">
               <Icon name="progress_activity" size={40} className="animate-spin text-primary" />
             </div>
          ) : loadError ? (
             <div className="text-center py-20 bg-surface rounded-lg neo-border neo-shadow">
               <Icon name="error" size={48} className="text-on-surface-variant mx-auto mb-4" />
               <h3 className="font-headline-lg text-on-surface font-bold uppercase tracking-tight mb-2">Error Loading Offers</h3>
               <p className="font-body-md text-on-surface-variant font-bold">{loadError}</p>
             </div>
          ) : filteredOffers.length === 0 ? (
             <div className="text-center py-20 bg-surface rounded-lg neo-border neo-shadow">
               <Icon name="search_off" size={48} className="text-on-surface-variant mx-auto mb-4" />
               <h3 className="font-headline-lg text-on-surface font-bold uppercase tracking-tight mb-2">No offers found</h3>
               <p className="font-body-md text-on-surface-variant font-bold">Try adjusting your filters to see more results.</p>
             </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-space-6">
              {filteredOffers.map((offer: Offer, index: number) => {
                
                // Demo logic for availability bar
                const slotsLeft = offer.capacity > 0 ? offer.capacity : 0;
                const totalSlots = offer.capacity > 0 ? offer.capacity + 10 : 10;
                const percent = (slotsLeft / totalSlots) * 100;
                const fillClass = percent > 50 ? 'bg-accent-success' : percent > 20 ? 'bg-warning' : 'bg-danger';

                return (
                  <motion.div
                    key={offer.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.05 }}
                    className="h-full"
                  >
                    <Tilt
                      tiltMaxAngleX={4}
                      tiltMaxAngleY={4}
                      glareEnable={true}
                      glareMaxOpacity={0.15}
                      glareColor="#ffffff"
                      glarePosition="all"
                      scale={1.01}
                      transitionSpeed={1000}
                      className="h-full"
                    >
                      <div className="offer-card h-full bg-surface rounded-lg neo-border neo-shadow group-hover:neo-shadow-hover overflow-hidden cursor-pointer flex flex-col group transition-all" onClick={() => navigate(`/offer/${offer.id}`)}>
                    
                    {/* Top colored header bar & Image */}
                    <div className="w-full h-36 overflow-hidden relative">
                      <img src={getCategoryImage(offer.category)} alt={offer.category} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                      <div className={`absolute top-0 left-0 w-full h-1 ${getCategoryColor(offer.category)}`}></div>
                    </div>

                    {/* Card body */}
                    <div className="p-space-4 flex flex-col gap-3 flex-1">
                      
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-1 px-3 py-1 rounded bg-surface-container-low neo-border font-label-xs text-on-surface uppercase tracking-widest font-bold">
                          <Icon name={getCategoryIcon(offer.category)} size={14} />
                          <span>{offer.category}</span>
                        </div>
                        <div className="px-3 py-1 bg-secondary text-on-secondary rounded neo-border font-label-xs uppercase tracking-widest font-bold">
                          {offer.discountPercent.toFixed(0)}% OFF
                        </div>
                      </div>

                      <div className="mt-2">
                        <h3 className="font-headline-lg font-bold text-on-surface line-clamp-2 uppercase tracking-tight">{offer.title}</h3>
                        <p className="font-body-md text-on-surface-variant font-bold">{offer.businessName || 'Premium Partner'}</p>
                      </div>

                      <div className="flex items-center gap-3 mt-2">
                        <span className="line-through text-outline font-body-md font-bold">₹{offer.originalPrice}</span>
                        <span className="font-display-hero text-headline-lg text-primary">₹{offer.offerPrice}</span>
                      </div>

                      <div className="mt-auto pt-4">
                        <div className="flex justify-between items-center mb-2 text-on-surface-variant font-label-bold uppercase tracking-widest">
                          <span>{slotsLeft} of {totalSlots} slots left</span>
                        </div>
                        <div className="h-3 bg-surface-container-low neo-border rounded overflow-hidden mb-4">
                          <div className={`h-full border-r-[3px] border-on-surface transition-all ${fillClass}`} style={{ width: `${percent}%` }}></div>
                        </div>

                        <div className="flex items-center gap-2 text-on-surface-variant font-label-bold uppercase tracking-widest mb-4">
                          <Icon name="schedule" size={18} />
                          <span>Expires soon</span>
                        </div>

                        <button className="w-full py-3 bg-primary text-on-primary font-label-bold uppercase tracking-widest rounded neo-border neo-shadow group-hover:-translate-y-1 group-hover:neo-shadow-hover transition-all flex items-center justify-center gap-2">
                          <Icon name="arrow_forward" size={20} />
                          <span>Book Now</span>
                        </button>
                      </div>

                    </div>
                  </div>
                  </Tilt>
                </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </main>

    </div>
  );
}
