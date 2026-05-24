import { useState } from 'react';
import { Icon } from '../components/ui/Icon';

export default function Settings() {
  const [activeTab, setActiveTab] = useState('notifications');

  return (
    <div className="max-w-max-width w-full mx-auto space-y-8 animate-in fade-in duration-500 pb-12 mt-2">
      <h1 className="font-display-hero text-headline-xl text-on-background uppercase tracking-tight">
        Settings
      </h1>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Settings Sidebar */}
        <div className="w-full md:w-64 shrink-0 space-y-4">
          {[
            { id: 'general', name: 'General', icon: 'tune' },
            { id: 'notifications', name: 'Notifications', icon: 'notifications' },
            { id: 'security', name: 'Security', icon: 'security' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-4 font-label-bold uppercase tracking-widest rounded neo-border transition-all ${
                activeTab === tab.id
                  ? 'bg-primary text-on-primary neo-shadow'
                  : 'bg-surface text-on-surface hover:neo-shadow hover:-translate-y-1'
              }`}
            >
              <Icon name={tab.icon} size={20} />
              {tab.name}
            </button>
          ))}
        </div>

        {/* Settings Content */}
        <div className="flex-1 bg-surface rounded-lg neo-border neo-shadow p-8 min-h-[400px]">
          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <h2 className="font-display-hero text-headline-lg text-on-surface mb-8 pb-4 border-b-[3px] border-on-surface uppercase tracking-wide flex items-center gap-3">
                <Icon name="notifications" className="text-primary" />
                Notification Preferences
              </h2>
              
              <div className="space-y-6">
                {[
                  { title: 'New Bookings', desc: 'Receive alerts when a customer books a new slot.' },
                  { title: 'Cancellations', desc: 'Get notified if a booking is cancelled.' },
                  { title: 'Daily Summary', desc: 'Receive a daily email summarizing your bookings.' }
                ].map((item, i) => (
                  <div key={i} className="flex items-start justify-between p-6 rounded bg-surface-container-low neo-border">
                    <div>
                      <div className="font-headline-sm font-bold text-on-surface uppercase tracking-tight">{item.title}</div>
                      <div className="text-sm font-bold text-on-surface-variant mt-2">{item.desc}</div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer mt-1">
                      <input type="checkbox" className="sr-only peer" defaultChecked={i !== 2} />
                      <div className="w-12 h-6 bg-surface border-[3px] border-on-surface peer-focus:outline-none rounded peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[3px] after:left-[3px] after:bg-on-surface after:border-on-surface after:border-[3px] after:rounded after:h-[18px] after:w-[18px] after:transition-all peer-checked:bg-secondary"></div>
                    </label>
                  </div>
                ))}
              </div>
              
              <div className="pt-8 mt-8 border-t-[3px] border-on-surface flex justify-end">
                <button className="px-8 py-3 bg-primary text-on-primary font-label-bold uppercase tracking-widest rounded neo-border neo-shadow hover:-translate-y-1 hover:neo-shadow-hover transition-all">
                  Save Preferences
                </button>
              </div>
            </div>
          )}

          {activeTab === 'general' && (
            <div className="space-y-6">
              <h2 className="font-display-hero text-headline-lg text-on-surface mb-8 pb-4 border-b-[3px] border-on-surface uppercase tracking-wide flex items-center gap-3">
                <Icon name="tune" className="text-primary" />
                General Settings
              </h2>
              <div className="space-y-6">
                <div>
                  <label className="block font-label-bold text-on-surface-variant uppercase tracking-widest mb-2">Company Name</label>
                  <input type="text" defaultValue="The Artisan Grill" className="w-full px-4 py-3 bg-surface-container-low neo-border rounded font-bold text-on-surface focus:outline-none focus:neo-shadow transition-shadow" />
                </div>
                <div>
                  <label className="block font-label-bold text-on-surface-variant uppercase tracking-widest mb-2">Support Email</label>
                  <input type="email" defaultValue="hello@artisangrill.com" className="w-full px-4 py-3 bg-surface-container-low neo-border rounded font-bold text-on-surface focus:outline-none focus:neo-shadow transition-shadow" />
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block font-label-bold text-on-surface-variant uppercase tracking-widest mb-2">Currency</label>
                    <select className="w-full px-4 py-3 bg-surface-container-low neo-border rounded font-bold text-on-surface focus:outline-none focus:neo-shadow transition-shadow appearance-none cursor-pointer">
                      <option>USD ($)</option>
                      <option>EUR (€)</option>
                      <option>GBP (£)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-label-bold text-on-surface-variant uppercase tracking-widest mb-2">Timezone</label>
                    <select className="w-full px-4 py-3 bg-surface-container-low neo-border rounded font-bold text-on-surface focus:outline-none focus:neo-shadow transition-shadow appearance-none cursor-pointer">
                      <option>America/New_York</option>
                      <option>America/Los_Angeles</option>
                      <option>Europe/London</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="pt-8 mt-8 border-t-[3px] border-on-surface flex justify-end">
                <button className="px-8 py-3 bg-primary text-on-primary font-label-bold uppercase tracking-widest rounded neo-border neo-shadow hover:-translate-y-1 hover:neo-shadow-hover transition-all">
                  Save Settings
                </button>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-6">
              <h2 className="font-display-hero text-headline-lg text-on-surface mb-8 pb-4 border-b-[3px] border-on-surface uppercase tracking-wide flex items-center gap-3">
                <Icon name="security" className="text-primary" />
                Security
              </h2>
              <div className="space-y-6">
                <div>
                  <label className="block font-label-bold text-on-surface-variant uppercase tracking-widest mb-2">Current Password</label>
                  <input type="password" placeholder="••••••••" className="w-full px-4 py-3 bg-surface-container-low neo-border rounded font-bold text-on-surface focus:outline-none focus:neo-shadow transition-shadow" />
                </div>
                <div>
                  <label className="block font-label-bold text-on-surface-variant uppercase tracking-widest mb-2">New Password</label>
                  <input type="password" placeholder="••••••••" className="w-full px-4 py-3 bg-surface-container-low neo-border rounded font-bold text-on-surface focus:outline-none focus:neo-shadow transition-shadow" />
                </div>
                <div className="flex items-center justify-between p-6 mt-8 rounded bg-surface-container-low neo-border">
                  <div>
                    <div className="font-headline-sm font-bold text-on-surface uppercase tracking-tight">Two-Factor Authentication</div>
                    <div className="text-sm font-bold text-on-surface-variant mt-2">Add an extra layer of security to your account.</div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer mt-1">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-12 h-6 bg-surface border-[3px] border-on-surface peer-focus:outline-none rounded peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[3px] after:left-[3px] after:bg-on-surface after:border-on-surface after:border-[3px] after:rounded after:h-[18px] after:w-[18px] after:transition-all peer-checked:bg-secondary"></div>
                  </label>
                </div>
              </div>
              <div className="pt-8 mt-8 border-t-[3px] border-on-surface flex justify-end">
                <button className="px-8 py-3 bg-primary text-on-primary font-label-bold uppercase tracking-widest rounded neo-border neo-shadow hover:-translate-y-1 hover:neo-shadow-hover transition-all">
                  Update Password
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
