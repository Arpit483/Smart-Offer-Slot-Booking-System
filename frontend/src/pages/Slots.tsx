import { useState, useEffect } from 'react';
import { Icon } from '../components/ui/Icon';
import api from '../services/api';
import type { Offer, Slot } from '../types';

export default function Slots() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [selectedOfferId, setSelectedOfferId] = useState<number | null>(null);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const res = await api.get('/offers');
        setOffers(res.data);
      } catch (err) {
        console.error('Failed to load offers', err);
      }
    };
    fetchOffers();
  }, []);

  // Fetch slots when an offer is selected
  useEffect(() => {
    if (!selectedOfferId) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSlots([]);
      return;
    }
    const fetchSlots = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/slots/offer/${selectedOfferId}`);
        setSlots(res.data);
      } catch (err) {
        console.error('Failed to load slots', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSlots();
  }, [selectedOfferId]);

  return (
    <div className="max-w-max-width w-full mx-auto space-y-8 animate-in fade-in duration-500 pb-12 mt-2">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="font-display-hero text-headline-xl text-on-background uppercase tracking-tight">
            Manage Slots
          </h1>
          <p className="text-on-surface-variant mt-2 font-label-bold uppercase tracking-widest">
            Select an offer to view and manage its available time slots.
          </p>
        </div>
      </div>

      <div className="bg-surface rounded-lg neo-border neo-shadow p-8">
        
        {/* Offer Selector */}
        <div className="max-w-md mb-8">
          <label className="block text-on-surface-variant font-label-bold uppercase tracking-widest mb-2">
            Select Offer
          </label>
          <div className="relative">
            <select
              value={selectedOfferId || ''}
              onChange={(e) => setSelectedOfferId(Number(e.target.value) || null)}
              className="w-full appearance-none pl-4 pr-10 py-3 bg-surface-container-low neo-border rounded font-bold text-on-surface focus:outline-none focus:neo-shadow cursor-pointer transition-shadow"
            >
              <option value="">-- Choose an Offer --</option>
              {offers.map((offer) => (
                <option key={offer.id} value={offer.id}>
                  {offer.title} ({offer.status})
                </option>
              ))}
            </select>
            <Icon name="expand_more" className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none" />
          </div>
        </div>

        {/* Slots Data Grid */}
        {!selectedOfferId ? (
          <div className="text-center py-16 border-[3px] border-dashed border-on-surface rounded bg-surface-container-low">
            <Icon name="event_seat" size={48} className="text-on-surface-variant mb-4 mx-auto" />
            <p className="text-on-surface-variant font-bold uppercase tracking-widest">Please select an offer to view its slots.</p>
          </div>
        ) : loading ? (
          <div className="text-center py-16">
            <Icon name="progress_activity" className="animate-spin text-primary mx-auto" size={40} />
          </div>
        ) : slots.length === 0 ? (
          <div className="text-center py-16 border-[3px] border-dashed border-on-surface rounded bg-surface-container-low">
            <p className="text-on-surface-variant font-bold uppercase tracking-widest">No slots found for this offer.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b-[3px] border-on-surface bg-surface-variant text-on-surface-variant">
                  <th className="py-4 px-4 font-label-bold uppercase tracking-widest border-r-[3px] border-on-surface">Date</th>
                  <th className="py-4 px-4 font-label-bold uppercase tracking-widest border-r-[3px] border-on-surface">Time</th>
                  <th className="py-4 px-4 font-label-bold uppercase tracking-widest border-r-[3px] border-on-surface">Capacity</th>
                  <th className="py-4 px-4 font-label-bold uppercase tracking-widest">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y-[3px] divide-on-surface">
                {slots.map((slot) => {
                  const dateStr = new Date(slot.slotDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                  return (
                    <tr key={slot.id} className="hover:bg-surface-variant transition-colors group">
                      <td className="py-4 px-4 font-bold text-on-surface border-r-[3px] border-on-surface uppercase tracking-widest">{dateStr}</td>
                      <td className="py-4 px-4 text-on-surface border-r-[3px] border-on-surface">
                        <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded bg-surface-container-low neo-border font-bold uppercase tracking-widest text-xs">
                          <Icon name="schedule" size={16} className="text-primary" />
                          {slot.startTime?.substring(0, 5)} - {slot.endTime?.substring(0, 5)}
                        </span>
                      </td>
                      <td className="py-4 px-4 border-r-[3px] border-on-surface">
                        <div className="text-sm font-bold text-on-surface uppercase tracking-widest mb-2">
                          {slot.capacity - slot.bookedCount} / {slot.capacity} left
                        </div>
                        <div className="w-32 h-3 bg-surface-container-low neo-border rounded overflow-hidden">
                          <div 
                            className="h-full bg-primary border-r-[3px] border-on-surface"
                            style={{ width: `${(slot.bookedCount / slot.capacity) * 100}%` }}
                          />
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded text-[10px] uppercase tracking-widest font-black neo-border ${
                          slot.status === 'Available' ? 'bg-secondary text-on-secondary' :
                          slot.status === 'Full' ? 'bg-error text-on-error' :
                          'bg-surface-container-low text-on-surface'
                        }`}>
                          {slot.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
