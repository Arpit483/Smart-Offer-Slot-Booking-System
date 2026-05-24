import { useState, useEffect, useRef } from 'react';
import { Icon } from '../components/ui/Icon';
import api from '../services/api';

export default function BusinessProfile() {
  const [isSaving, setIsSaving] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [contactName, setContactName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [category, setCategory] = useState('Wellness & Spa');

  // File Upload State
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  // Operating Hours State
  const initialDays = [
    { day: 'Mon', isOpen: true, open: '09:00', close: '20:00' },
    { day: 'Tue', isOpen: false, open: '09:00', close: '20:00' },
    { day: 'Wed', isOpen: true, open: '09:00', close: '20:00' },
    { day: 'Thu', isOpen: true, open: '09:00', close: '20:00' },
    { day: 'Fri', isOpen: true, open: '09:00', close: '22:00' },
    { day: 'Sat', isOpen: true, open: '10:00', close: '22:00' },
    { day: 'Sun', isOpen: false, open: '10:00', close: '18:00' },
  ];
  const [hours, setHours] = useState(initialDays);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/business');
        setName(res.data.name || '');
        setDescription(res.data.description || '');
        setContactName(res.data.contactName || '');
        setPhone(res.data.phone || '');
        setEmail(res.data.email || '');
        setAddress(res.data.address || '');
        setCity(res.data.city || '');
        if (res.data.category) setCategory(res.data.category);
        if (res.data.logo) setLogoPreview(res.data.logo);
      } catch (err) {
        console.error('Failed to load profile', err);
      }
    };
    fetchProfile();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await api.put('/business', {
        name, description, contactName, phone, email, address, city, category
      });
      // In a real app we'd save logo and hours here too
      setTimeout(() => {
        setIsSaving(false);
        alert('Profile saved successfully!');
      }, 500);
    } catch (err) {
      console.error('Failed to save profile', err);
      setIsSaving(false);
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleDay = (index: number) => {
    const newHours = [...hours];
    newHours[index].isOpen = !newHours[index].isOpen;
    setHours(newHours);
  };

  const updateTime = (index: number, field: 'open' | 'close', value: string) => {
    const newHours = [...hours];
    newHours[index][field] = value;
    setHours(newHours);
  };

  return (
    <div className="max-w-max-width w-full mx-auto space-y-8 animate-in fade-in duration-500 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mt-2">
        <div>
          <h1 className="font-display-hero text-headline-xl uppercase tracking-tight text-on-background">
            Business Profile
          </h1>
          <p className="mt-3 font-body-sm text-body-sm font-bold text-on-surface-variant">
            Manage your public storefront details and operational parameters.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <button 
            onClick={() => window.location.reload()}
            className="px-5 py-2.5 bg-surface text-on-surface text-sm font-bold rounded neo-border hover:neo-shadow transition-all uppercase tracking-widest"
          >
            Discard Changes
          </button>
          <button 
            onClick={handleSave} 
            disabled={isSaving}
            className="flex items-center justify-center gap-2 px-6 py-2.5 bg-primary text-on-primary text-sm font-bold rounded neo-border neo-shadow hover:neo-shadow-hover hover:-translate-y-1 transition-all disabled:opacity-70 uppercase tracking-widest"
          >
            {isSaving ? <Icon name="check_circle" className="w-4 h-4 animate-pulse" /> : <Icon name="save" className="w-4 h-4" />}
            {isSaving ? 'Saving...' : 'Save Profile'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Left Column (Main Form) */}
        <div className="xl:col-span-2 space-y-8">
          
          {/* Basic Information Card */}
          <div className="bg-surface rounded-lg neo-border neo-shadow p-8">
            <h2 className="flex items-center gap-2 font-headline-lg text-headline-lg font-bold text-on-surface mb-6 uppercase tracking-tight">
              <Icon name="info" className="w-6 h-6 text-primary" />
              Basic Information
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
              <div className="space-y-2">
                <label className="font-label-xs text-label-xs font-bold text-on-surface-variant uppercase tracking-wider block">Business Name</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full px-4 py-3 bg-surface-container-low neo-border rounded text-sm text-on-surface font-bold focus:outline-none focus:neo-shadow transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="font-label-xs text-label-xs font-bold text-on-surface-variant uppercase tracking-wider block">Business Type / Category</label>
                <select 
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  className="w-full px-4 py-3 bg-surface-container-low neo-border rounded text-sm text-on-surface font-bold focus:outline-none focus:neo-shadow transition-all appearance-none"
                >
                  <option value="Wellness & Spa">Wellness & Spa</option>
                  <option value="Dining & Restaurant">Dining & Restaurant</option>
                  <option value="Activities & Experiences">Activities & Experiences</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              
              <div className="space-y-2 md:col-span-2">
                <label className="font-label-xs text-label-xs font-bold text-on-surface-variant uppercase tracking-wider block">Business Description</label>
                <textarea 
                  rows={4}
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  className="w-full px-4 py-3 bg-surface-container-low neo-border rounded text-sm text-on-surface font-bold focus:outline-none focus:neo-shadow transition-all resize-none"
                />
              </div>

              <div className="space-y-2">
                <label className="font-label-xs text-label-xs font-bold text-on-surface-variant uppercase tracking-wider block">Owner / Contact Name</label>
                <input 
                  type="text" 
                  value={contactName}
                  onChange={e => setContactName(e.target.value)}
                  className="w-full px-4 py-3 bg-surface-container-low neo-border rounded text-sm text-on-surface font-bold focus:outline-none focus:neo-shadow transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="font-label-xs text-label-xs font-bold text-on-surface-variant uppercase tracking-wider block">Contact Phone</label>
                <input 
                  type="tel" 
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="w-full px-4 py-3 bg-surface-container-low neo-border rounded text-sm text-on-surface font-bold focus:outline-none focus:neo-shadow transition-all"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="font-label-xs text-label-xs font-bold text-on-surface-variant uppercase tracking-wider block">Contact Email</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-surface-container-low neo-border rounded text-sm text-on-surface font-bold focus:outline-none focus:neo-shadow transition-all"
                />
              </div>
            </div>
          </div>

          {/* Address & Location Card */}
          <div className="bg-surface rounded-lg neo-border neo-shadow p-8">
            <h2 className="flex items-center gap-2 font-headline-lg text-headline-lg font-bold text-on-surface mb-6 uppercase tracking-tight">
              <Icon name="location_on" className="w-6 h-6 text-primary" />
              Address & Location
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-6">
              <div className="space-y-2 md:col-span-3">
                <label className="font-label-xs text-label-xs font-bold text-on-surface-variant uppercase tracking-wider block">Street Address</label>
                <input 
                  type="text" 
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  className="w-full px-4 py-3 bg-surface-container-low neo-border rounded text-sm text-on-surface font-bold focus:outline-none focus:neo-shadow transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="font-label-xs text-label-xs font-bold text-on-surface-variant uppercase tracking-wider block">City</label>
                <input 
                  type="text" 
                  value={city}
                  onChange={e => setCity(e.target.value)}
                  className="w-full px-4 py-3 bg-surface-container-low neo-border rounded text-sm text-on-surface font-bold focus:outline-none focus:neo-shadow transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="font-label-xs text-label-xs font-bold text-on-surface-variant uppercase tracking-wider block">State/Province</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-3 bg-surface-container-low neo-border rounded text-sm text-on-surface font-bold focus:outline-none focus:neo-shadow transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="font-label-xs text-label-xs font-bold text-on-surface-variant uppercase tracking-wider block">Postal Code</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-3 bg-surface-container-low neo-border rounded text-sm text-on-surface font-bold focus:outline-none focus:neo-shadow transition-all"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (Logo & Hours) */}
        <div className="space-y-8">
          
          {/* Logo Card */}
          <div className="bg-surface rounded-lg neo-border neo-shadow p-8">
            <h2 className="flex items-center gap-2 font-headline-lg text-headline-lg font-bold text-on-surface mb-6 uppercase tracking-tight">
              <Icon name="image" className="w-6 h-6 text-primary" />
              Business Logo
            </h2>
            
            <input 
              type="file" 
              accept="image/*" 
              className="hidden" 
              ref={fileInputRef} 
              onChange={handleLogoUpload} 
            />

            <div 
              onClick={() => fileInputRef.current?.click()}
              className="bg-surface-container-low neo-border border-dashed rounded p-8 flex flex-col items-center justify-center text-center hover:bg-surface-variant transition-colors cursor-pointer group"
            >
              <div className="w-24 h-24 bg-primary neo-border flex items-center justify-center text-4xl font-bold text-on-primary shadow-lg mb-4 group-hover:scale-105 transition-transform overflow-hidden">
                {logoPreview ? (
                  <img src={logoPreview} alt="Logo" className="w-full h-full object-cover" />
                ) : (
                  name ? name.charAt(0).toUpperCase() : 'B'
                )}
              </div>
              <p className="text-sm font-bold text-on-surface flex items-center gap-2 uppercase tracking-widest mt-2">
                <Icon name="upload" className="w-4 h-4" /> {logoPreview ? 'Change Logo' : 'Upload New Logo'}
              </p>
              <p className="text-xs text-on-surface-variant font-bold mt-2">JPG, PNG or SVG. Max 2MB.</p>
            </div>
          </div>

          {/* Operating Hours Card */}
          <div className="bg-surface rounded-lg neo-border neo-shadow p-8">
            <h2 className="flex items-center gap-2 font-headline-lg text-headline-lg font-bold text-on-surface mb-6 uppercase tracking-tight">
              <Icon name="schedule" className="w-6 h-6 text-primary" />
              Operating Hours
            </h2>
            
            <div className="space-y-4">
              {hours.map((dayData, index) => (
                <div key={dayData.day} className="flex items-center justify-between py-2 border-b-2 border-on-surface last:border-b-0">
                  <div className="flex items-center gap-3 w-24">
                    <input 
                      type="checkbox" 
                      checked={dayData.isOpen}
                      onChange={() => toggleDay(index)}
                      className="w-5 h-5 rounded-sm neo-border text-primary focus:ring-primary cursor-pointer"
                    />
                    <span className="text-sm font-bold text-on-surface uppercase tracking-widest">{dayData.day}</span>
                  </div>

                  {!dayData.isOpen ? (
                    <div className="flex-1 flex justify-center">
                      <button onClick={() => toggleDay(index)} className="px-3 py-1 bg-error text-on-error neo-border text-[10px] font-bold uppercase tracking-wider rounded transition-colors">Closed</button>
                    </div>
                  ) : (
                    <div className="flex-1 flex items-center gap-3">
                      <div className="relative flex-1">
                        <input 
                          type="time" 
                          value={dayData.open} 
                          onChange={(e) => updateTime(index, 'open', e.target.value)}
                          className="w-full appearance-none pl-2 pr-2 py-2 bg-surface-container-low neo-border rounded text-xs font-bold text-on-surface focus:outline-none focus:neo-shadow cursor-pointer" 
                        />
                      </div>
                      <span className="text-on-surface font-bold">-</span>
                      <div className="relative flex-1">
                        <input 
                          type="time" 
                          value={dayData.close} 
                          onChange={(e) => updateTime(index, 'close', e.target.value)}
                          className="w-full appearance-none pl-2 pr-2 py-2 bg-surface-container-low neo-border rounded text-xs font-bold text-on-surface focus:outline-none focus:neo-shadow cursor-pointer" 
                        />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
