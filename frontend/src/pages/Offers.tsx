import { useState, useEffect, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '../components/ui/Icon';
import api from '../services/api';
import type { Offer } from '../types';

const CategoryIcon = ({ category }: { category: string }) => {
  if (category.toLowerCase().includes('food') || category.toLowerCase().includes('restaurant')) {
    return <Icon name="restaurant" className="w-4 h-4 text-primary" />;
  }
  if (category.toLowerCase().includes('wellness') || category.toLowerCase().includes('spa')) {
    return <Icon name="favorite" className="w-4 h-4 text-tertiary" />;
  }
  return <Icon name="local_activity" className="w-4 h-4 text-secondary" />;
};

export default function Offers() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All Categories');
  const [statusFilter, setStatusFilter] = useState('All Statuses');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const res = await api.get('/offers');
        setOffers(res.data);
      } catch (_err) {
        console.error('Failed to load offers', _err);
      } finally {
        setLoading(false);
      }
    };
    fetchOffers();
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownRef]);

  const filteredOffers = useMemo(() => {
    return offers.filter(offer => {
      const matchesSearch = offer.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        offer.description?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = categoryFilter === 'All Categories' || offer.category === categoryFilter;
      const matchesStatus = statusFilter === 'All Statuses' || offer.status === statusFilter;
      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [offers, searchQuery, categoryFilter, statusFilter]);

  const totalPages = Math.ceil(filteredOffers.length / itemsPerPage);
  const paginatedOffers = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredOffers.slice(start, start + itemsPerPage);
  }, [filteredOffers, currentPage, itemsPerPage]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCurrentPage(1);
  }, [searchQuery, categoryFilter, statusFilter]);

  const handleToggleStatus = async (id: number, currentStatus: string) => {
    const newStatus = currentStatus === 'Active' ? 'Paused' : 'Active';
    try {
      await api.put(`/offers/${id}/status`, `"${newStatus}"`, {
        headers: { 'Content-Type': 'application/json' }
      });
      setOffers(offers.map(o => o.id === id ? { ...o, status: newStatus } : o));
      setActiveDropdown(null);
    } catch {
      alert('Failed to update status');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this offer?')) return;
    try {
      await api.delete(`/offers/${id}`);
      setOffers(offers.filter(o => o.id !== id));
      setActiveDropdown(null);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { error?: string } } };
      alert(error.response?.data?.error || 'Failed to delete offer');
    }
  };

  // Get unique categories for the dropdown
  const uniqueCategories = ['All Categories', ...new Set(offers.map(o => o.category).filter(Boolean))];

  return (
    <div className="max-w-max-width w-full mx-auto space-y-8 animate-in fade-in duration-500 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mt-2">
        <h1 className="font-display-hero text-headline-xl uppercase tracking-tight text-on-background">
          Manage Offers
        </h1>
      </div>

      {/* Filters Toolbar */}
      <div className="flex flex-col lg:flex-row justify-between items-center gap-4 p-4 bg-surface rounded-lg neo-border neo-shadow">
        <div className="flex flex-1 w-full gap-4">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Icon name="search" className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
            <input 
              type="text"
              placeholder="Search offers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-surface-container-low neo-border rounded text-sm text-on-surface font-bold placeholder:text-outline focus:outline-none focus:neo-shadow transition-shadow"
            />
          </div>
          
          {/* Category Filter */}
          <div className="relative min-w-[160px] hidden sm:block">
            <select 
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full appearance-none pl-4 pr-10 py-2.5 bg-surface-container-low neo-border rounded text-sm font-bold text-on-surface focus:outline-none focus:neo-shadow cursor-pointer"
            >
              {uniqueCategories.map(cat => <option key={cat as string} value={cat as string}>{cat as string}</option>)}
            </select>
            <Icon name="expand_more" className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant pointer-events-none" />
          </div>

          {/* Status Filter */}
          <div className="relative min-w-[140px] hidden sm:block">
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full appearance-none pl-4 pr-10 py-2.5 bg-surface-container-low neo-border rounded text-sm font-bold text-on-surface focus:outline-none focus:neo-shadow cursor-pointer"
            >
              <option value="All Statuses">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Paused">Paused</option>
              <option value="Draft">Draft</option>
            </select>
            <Icon name="expand_more" className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant pointer-events-none" />
          </div>
        </div>

        <Link to="/admin/offers/create" className="shrink-0 w-full lg:w-auto">
          <button className="w-full lg:w-auto flex items-center justify-center gap-2 px-6 py-2.5 bg-primary text-on-primary text-sm font-bold rounded neo-border neo-shadow hover:-translate-y-1 hover:neo-shadow-hover transition-all uppercase tracking-widest">
            <Icon name="add" className="w-4 h-4 stroke-[3]" /> Create Offer
          </button>
        </Link>
      </div>

      {/* Offers Custom List */}
      <div className="bg-surface rounded-lg neo-border neo-shadow overflow-visible">
        {/* List Header */}
        <div className="grid grid-cols-12 gap-4 px-8 py-4 border-b-[3px] border-on-surface bg-surface-container-low text-xs font-bold text-on-surface uppercase tracking-widest">
          <div className="col-span-5">Offer Details</div>
          <div className="col-span-2 text-center">Category</div>
          <div className="col-span-2 text-right pr-4">Price (Orig / Offer)</div>
          <div className="col-span-2 text-center">Status</div>
          <div className="col-span-1 text-center">Actions</div>
        </div>

        {/* List Items */}
        <div className="divide-y-[3px] divide-on-surface" ref={dropdownRef}>
          {loading ? (
            <div className="p-12 text-center font-bold text-on-surface-variant">Loading your beautiful offers...</div>
          ) : paginatedOffers.length === 0 ? (
            <div className="p-12 text-center font-bold text-on-surface-variant">
              {offers.length === 0 ? "No offers found. Create one to get started!" : "No offers match your search/filters."}
            </div>
          ) : (
            paginatedOffers.map(offer => (
              <div key={offer.id} className="grid grid-cols-12 gap-4 items-center px-8 py-5 hover:bg-surface-variant transition-colors group relative">
                
                {/* Details Column */}
                <div className="col-span-5 flex items-center gap-4">
                  <div className="w-[72px] h-[72px] rounded bg-surface-container-low overflow-hidden neo-border shrink-0 flex items-center justify-center text-on-surface-variant">
                    {offer.category?.includes('Wellness') ? (
                      <img src="https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=200&auto=format&fit=crop" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" alt="" />
                    ) : offer.category?.includes('Dining') ? (
                       <img src="https://images.unsplash.com/photo-1514933651103-005eec06c04b?q=80&w=200&auto=format&fit=crop" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" alt="" />
                    ) : (
                       <div className="w-8 h-8 rounded bg-surface-variant"></div>
                    )}
                  </div>
                  <div className="min-w-0">
                    <Link to={`/admin/offers/${offer.id}/edit`}>
                      <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface truncate group-hover:text-primary transition-colors cursor-pointer uppercase">
                        {offer.title}
                      </h3>
                    </Link>
                    <p className="font-body-sm text-on-surface-variant truncate mt-0.5 font-bold" title={offer.description}>
                      {offer.description?.substring(0, 50)}{offer.description?.length > 50 ? '...' : ''}
                    </p>
                  </div>
                </div>

                {/* Category Column */}
                <div className="col-span-2 flex justify-center">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-surface-container-low neo-border">
                    <CategoryIcon category={offer.category || ''} />
                    <span className="text-[10px] font-bold text-on-surface uppercase tracking-widest">{offer.category}</span>
                  </div>
                </div>

                {/* Price Column */}
                <div className="col-span-2 text-right pr-4">
                  <div className="font-display-hero text-headline-md text-on-surface leading-tight">
                    ${offer.offerPrice}
                  </div>
                  <div className="text-[12px] font-bold text-outline line-through mt-0.5">
                    ${offer.originalPrice}
                  </div>
                </div>

                {/* Status Column */}
                <div className="col-span-2 flex justify-center">
                  <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-[10px] uppercase tracking-widest font-black neo-border ${
                    offer.status === 'Active' 
                      ? 'bg-secondary-container text-on-secondary-container'
                      : offer.status === 'Paused'
                      ? 'bg-tertiary-container text-on-tertiary-container'
                      : 'bg-surface-variant text-on-surface-variant'
                  }`}>
                    {offer.status}
                  </div>
                </div>

                {/* Actions Column */}
                <div className="col-span-1 flex justify-center relative">
                  <button 
                    onClick={() => setActiveDropdown(activeDropdown === offer.id ? null : offer.id)}
                    className="p-2 text-on-surface-variant hover:text-on-surface rounded neo-border bg-surface-container-low hover:neo-shadow transition-all cursor-pointer"
                  >
                    <Icon name="more_vert" className="w-5 h-5" />
                  </button>

                  {/* Dropdown Menu */}
                  {activeDropdown === offer.id && (
                    <div className="absolute right-8 top-10 w-40 bg-surface neo-border shadow-xl rounded overflow-hidden z-50 animate-in zoom-in-95 duration-100">
                      <Link 
                        to={`/admin/offers/${offer.id}/edit`}
                        className="flex items-center gap-2 w-full px-4 py-2.5 text-sm font-bold text-on-surface hover:bg-surface-variant transition-colors uppercase tracking-widest border-b-[3px] border-on-surface"
                      >
                        <Icon name="edit" className="w-4 h-4" /> Edit
                      </Link>
                      <button 
                        onClick={() => handleToggleStatus(offer.id, offer.status)}
                        className="flex items-center gap-2 w-full px-4 py-2.5 text-sm font-bold text-on-surface hover:bg-surface-variant transition-colors text-left uppercase tracking-widest border-b-[3px] border-on-surface"
                      >
                        {offer.status === 'Active' ? (
                          <><Icon name="pause_circle" className="w-4 h-4 text-tertiary" /> Pause</>
                        ) : (
                          <><Icon name="play_circle" className="w-4 h-4 text-secondary" /> Activate</>
                        )}
                      </button>
                      <button 
                        onClick={() => handleDelete(offer.id)}
                        className="flex items-center gap-2 w-full px-4 py-2.5 text-sm font-bold bg-error text-on-error hover:bg-red-600 transition-colors text-left uppercase tracking-widest"
                      >
                        <Icon name="delete" className="w-4 h-4" /> Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Pagination */}
        <div className="px-8 py-4 border-t-[3px] border-on-surface bg-surface-container-low flex items-center justify-between">
          <span className="text-[10px] font-bold text-on-surface uppercase tracking-widest">
            Showing {Math.min(filteredOffers.length, (currentPage - 1) * itemsPerPage + 1)} to {Math.min(filteredOffers.length, currentPage * itemsPerPage)} of {filteredOffers.length} entries
          </span>
          <div className="flex gap-2">
            <button 
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="w-8 h-8 flex items-center justify-center rounded neo-border bg-surface text-on-surface hover:neo-shadow disabled:opacity-50 font-bold"
            >
              &lt;
            </button>
            
            {Array.from({ length: totalPages || 1 }).map((_, i) => (
              <button 
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`w-8 h-8 flex items-center justify-center rounded neo-border font-bold ${
                  currentPage === i + 1 
                    ? 'bg-primary text-on-primary neo-shadow'
                    : 'bg-surface text-on-surface hover:neo-shadow'
                }`}
              >
                {i + 1}
              </button>
            ))}

            <button 
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages || totalPages === 0}
              className="w-8 h-8 flex items-center justify-center rounded neo-border bg-surface text-on-surface hover:neo-shadow disabled:opacity-50 font-bold"
            >
              &gt;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
