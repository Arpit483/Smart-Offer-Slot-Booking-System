import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';
import { useToast } from '../hooks/useToast';
import { Icon } from '../components/ui/Icon';

export default function CreateOffer() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { success, error } = useToast();
  const isEditing = !!id;

  const [loading, setLoading] = useState(false);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Fitness');
  const [originalPrice, setOriginalPrice] = useState('');
  const [offerPrice, setOfferPrice] = useState('');
  const [terms, setTerms] = useState('');

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('17:00');
  const [capacity, setCapacity] = useState('5');
  const [maxBookingPerCustomer, setMaxBookingPerCustomer] = useState('1');

  useEffect(() => {
    if (isEditing) {
      const fetchOffer = async () => {
        try {
          const res = await api.get(`/offers/${id}`);
          const o = res.data;
          setTitle(o.title);
          setDescription(o.description);
          setCategory(o.category);
          setOriginalPrice(o.originalPrice);
          setOfferPrice(o.offerPrice);
          setTerms(o.terms);
          const startDateStr = typeof o.startDate === 'string' ? o.startDate.split('T')[0] : o.startDate;
          const endDateStr = typeof o.endDate === 'string' ? o.endDate.split('T')[0] : o.endDate;
          setStartDate(startDateStr);
          setEndDate(endDateStr);
          setStartTime(o.startTime);
          setEndTime(o.endTime);
          setCapacity(o.capacity);
          setMaxBookingPerCustomer(o.maxBookingPerCustomer);
        } catch {
          error('Failed to load offer details');
          navigate('/admin/offers');
        }
      };
      fetchOffer();
    }
  }, [id, navigate, error, isEditing]);

  const handleSave = async (status: 'Draft' | 'Active') => {
    try {
      setLoading(true);
      const payload = {
        title,
        description,
        category,
        originalPrice: parseFloat(originalPrice),
        offerPrice: parseFloat(offerPrice),
        startDate: `${startDate}T00:00:00Z`,
        endDate: `${endDate}T00:00:00Z`,
        startTime,
        endTime,
        capacity: parseInt(capacity, 10),
        maxBookingPerCustomer: parseInt(maxBookingPerCustomer, 10),
        terms,
        status
      };

      if (isEditing) {
        await api.put(`/offers/${id}`, payload);
        success('Offer updated successfully');
      } else {
        await api.post('/offers', payload);
        success('Offer created successfully');
      }
      navigate('/admin/offers');
    } catch (err: unknown) {
      const error_obj = err as { response?: { data?: { message?: string } } };
      error(error_obj.response?.data?.message || (isEditing ? 'Failed to update offer' : 'Failed to create offer'));
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="font-body-base pb-space-12 animate-in fade-in duration-300">
      
      {/* TOPBAR */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-space-8 sticky top-0 bg-background z-10 py-6 border-b-[3px] border-on-surface">
        <div>
          <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-on-surface-variant font-label-bold uppercase tracking-widest hover:text-primary mb-2 transition-colors">
            <Icon name="arrow_back" size={20} /> Back
          </button>
          <h1 className="font-display-hero text-headline-xl text-on-background uppercase tracking-tight">
            {isEditing ? 'Edit Offer' : 'Create New Offer'}
          </h1>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={() => handleSave('Draft')}
            disabled={loading}
            className="px-6 py-3 bg-surface text-on-surface rounded neo-border hover:neo-shadow transition-all font-label-bold uppercase tracking-widest disabled:opacity-50"
          >
            Save as Draft
          </button>
          <button 
            onClick={() => handleSave('Active')}
            disabled={loading || !title || !originalPrice || !offerPrice || !startDate || !endDate}
            className="px-8 py-3 bg-primary text-on-primary rounded neo-border neo-shadow hover:-translate-y-1 hover:neo-shadow-hover transition-all font-label-bold uppercase tracking-widest disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:neo-shadow flex items-center justify-center gap-2"
          >
            {loading ? <Icon name="progress_activity" className="animate-spin" /> : 'Publish Offer'}
          </button>
        </div>
      </div>

      <div className="max-w-[800px] space-y-8">
        
        {/* SECTION 1: Offer Details */}
        <section className="bg-surface rounded-lg neo-border neo-shadow p-8">
          <div className="flex items-center gap-4 mb-8 pb-4 border-b-[3px] border-on-surface">
            <div className="w-12 h-12 rounded bg-primary text-on-primary neo-border flex items-center justify-center font-display-hero text-headline-md">
              1
            </div>
            <h2 className="font-display-hero text-headline-lg text-on-surface uppercase tracking-wide">Offer Details</h2>
          </div>

          <div className="space-y-6">
            <div>
              <label className="font-label-bold text-on-surface-variant uppercase tracking-widest block mb-2">Offer Title *</label>
              <input 
                type="text" 
                placeholder="e.g., Signature Spa Treatment" 
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="w-full px-4 py-3 bg-surface-container-low neo-border rounded font-bold text-on-surface placeholder:text-outline focus:outline-none focus:neo-shadow transition-shadow"
              />
            </div>
            
            <div>
              <label className="font-label-bold text-on-surface-variant uppercase tracking-widest block mb-2">Description</label>
              <textarea 
                placeholder="Describe what's included..." 
                rows={4}
                value={description}
                onChange={e => setDescription(e.target.value)}
                className="w-full px-4 py-3 bg-surface-container-low neo-border rounded font-bold text-on-surface placeholder:text-outline focus:outline-none focus:neo-shadow transition-shadow resize-none"
              ></textarea>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="font-label-bold text-on-surface-variant uppercase tracking-widest block mb-2">Category *</label>
                <div className="relative">
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                    className="w-full px-4 py-3 bg-surface-container-low neo-border rounded font-bold text-on-surface focus:outline-none focus:neo-shadow transition-shadow appearance-none cursor-pointer"
                  >
                    <option>Restaurant</option>
                    <option>Gym</option>
                    <option>Salon</option>
                    <option>Clinic</option>
                    <option>Coaching</option>
                    <option>Turf</option>
                    <option>Fitness</option>
                    <option>Other</option>
                  </select>
                  <Icon name="expand_more" className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t-[3px] border-on-surface">
              <div>
                <label className="font-label-bold text-on-surface-variant uppercase tracking-widest block mb-2">Original Price (₹) *</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <span className="text-on-surface-variant font-display-hero text-headline-sm mt-1">₹</span>
                  </div>
                  <input 
                    type="number" 
                    placeholder="0.00" 
                    value={originalPrice}
                    onChange={e => setOriginalPrice(e.target.value)}
                    className="w-full px-4 py-3 pl-10 bg-surface-container-low neo-border rounded font-bold text-on-surface placeholder:text-outline focus:outline-none focus:neo-shadow transition-shadow"
                  />
                </div>
              </div>
              <div>
                <label className="font-label-bold text-on-surface-variant uppercase tracking-widest block mb-2">Offer Price (₹) *</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <span className="text-on-surface-variant font-display-hero text-headline-sm mt-1">₹</span>
                  </div>
                  <input 
                    type="number" 
                    placeholder="0.00" 
                    value={offerPrice}
                    onChange={e => setOfferPrice(e.target.value)}
                    className="w-full px-4 py-3 pl-10 bg-primary-container neo-border rounded font-bold text-on-primary-container placeholder:text-outline focus:outline-none focus:neo-shadow transition-shadow shadow-[4px_4px_0_0_rgba(255,107,53,0.3)] dark:shadow-[4px_4px_0_0_rgba(255,107,53,0.5)]"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 2: Slot Schedule */}
        <section className="bg-surface rounded-lg neo-border neo-shadow p-8">
          <div className="flex items-center justify-between mb-8 pb-4 border-b-[3px] border-on-surface">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded bg-primary text-on-primary neo-border flex items-center justify-center font-display-hero text-headline-md">
                2
              </div>
              <h2 className="font-display-hero text-headline-lg text-on-surface uppercase tracking-wide">Slot Schedule</h2>
            </div>
          </div>

          <div className="p-4 bg-secondary-container rounded neo-border mb-8">
             <div className="flex items-start gap-3">
                <Icon name="info" className="text-on-secondary-container mt-0.5" />
                <p className="font-body-md font-bold text-on-secondary-container">
                  Slots will be automatically generated for every day between your start and end date, using the daily times and capacity specified below.
                </p>
             </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
             <div>
               <label className="font-label-bold text-on-surface-variant uppercase tracking-widest block mb-2">Start Date *</label>
               <input 
                 type="date" 
                 value={startDate}
                 onChange={e => setStartDate(e.target.value)}
                 className="w-full px-4 py-3 bg-surface-container-low neo-border rounded font-bold text-on-surface focus:outline-none focus:neo-shadow transition-shadow"
               />
             </div>
             <div>
               <label className="font-label-bold text-on-surface-variant uppercase tracking-widest block mb-2">End Date *</label>
               <input 
                 type="date" 
                 value={endDate}
                 onChange={e => setEndDate(e.target.value)}
                 className="w-full px-4 py-3 bg-surface-container-low neo-border rounded font-bold text-on-surface focus:outline-none focus:neo-shadow transition-shadow"
               />
             </div>
             <div>
               <label className="font-label-bold text-on-surface-variant uppercase tracking-widest block mb-2">Daily Start Time *</label>
               <input 
                 type="time" 
                 value={startTime}
                 onChange={e => setStartTime(e.target.value)}
                 className="w-full px-4 py-3 bg-surface-container-low neo-border rounded font-bold text-on-surface focus:outline-none focus:neo-shadow transition-shadow"
               />
             </div>
             <div>
               <label className="font-label-bold text-on-surface-variant uppercase tracking-widest block mb-2">Daily End Time *</label>
               <input 
                 type="time" 
                 value={endTime}
                 onChange={e => setEndTime(e.target.value)}
                 className="w-full px-4 py-3 bg-surface-container-low neo-border rounded font-bold text-on-surface focus:outline-none focus:neo-shadow transition-shadow"
               />
             </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6 border-t-[3px] border-on-surface">
             <div>
               <label className="font-label-bold text-on-surface-variant uppercase tracking-widest block mb-2">Capacity Per Slot</label>
               <input 
                 type="number" 
                 min="1"
                 value={capacity}
                 onChange={e => setCapacity(e.target.value)}
                 className="w-full px-4 py-3 bg-surface-container-low neo-border rounded font-bold text-on-surface focus:outline-none focus:neo-shadow transition-shadow"
               />
             </div>
             <div>
               <label className="font-label-bold text-on-surface-variant uppercase tracking-widest block mb-2">Max Bookings per Customer</label>
               <input 
                 type="number" 
                 min="1"
                 value={maxBookingPerCustomer}
                 onChange={e => setMaxBookingPerCustomer(e.target.value)}
                 className="w-full px-4 py-3 bg-surface-container-low neo-border rounded font-bold text-on-surface focus:outline-none focus:neo-shadow transition-shadow"
               />
             </div>
          </div>

        </section>

        {/* SECTION 3: Terms & Conditions */}
        <section className="bg-surface rounded-lg neo-border neo-shadow p-8">
          <div className="flex items-center gap-4 mb-8 pb-4 border-b-[3px] border-on-surface">
            <div className="w-12 h-12 rounded bg-primary text-on-primary neo-border flex items-center justify-center font-display-hero text-headline-md">
              3
            </div>
            <h2 className="font-display-hero text-headline-lg text-on-surface uppercase tracking-wide">Terms & Conditions</h2>
          </div>

          <div>
            <label className="font-label-bold text-on-surface-variant uppercase tracking-widest block mb-2">Important Information for Customers</label>
            <textarea 
              placeholder="e.g., Non-refundable, Valid for 1 person only. Must arrive 15 minutes prior to slot time." 
              rows={4}
              value={terms}
              onChange={e => setTerms(e.target.value)}
              className="w-full px-4 py-3 bg-surface-container-low neo-border rounded font-bold text-on-surface placeholder:text-outline focus:outline-none focus:neo-shadow transition-shadow resize-none"
            ></textarea>
            <p className="font-body-md text-on-surface-variant font-bold mt-2">These terms will be displayed on the offer details page and in the booking confirmation email.</p>
          </div>
        </section>

      </div>
    </div>
  );
}
