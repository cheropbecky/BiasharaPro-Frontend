import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function SettingsPage() {
  const navigate = useNavigate();

  const [business, setBusiness] = useState({
    shopName: '',
    ownerName: '',
    location: '',
    currency: 'KES',
    businessType: ''
  });

  const [prefs, setPrefs] = useState({
    language: 'en',
    theme: 'light',
    defaultTax: 0,
    receiptFooter: ''
  });

  const [backupReminderDays, setBackupReminderDays] = useState(7);
  const [syncStatus, setSyncStatus] = useState('Not synced');
  const [lastSyncedAt, setLastSyncedAt] = useState(null);

  useEffect(() => {
    const savedBiz = localStorage.getItem('businessProfile');
    const savedPrefs = localStorage.getItem('appPreferences');
    const savedBackup = localStorage.getItem('backupReminderDays');
    const savedSync = localStorage.getItem('syncStatus');

    if (savedBiz) setBusiness(JSON.parse(savedBiz));
    if (savedPrefs) setPrefs(JSON.parse(savedPrefs));
    if (savedBackup) setBackupReminderDays(Number(savedBackup));
    if (savedSync) setSyncStatus(savedSync);
    const savedLast = localStorage.getItem('lastSyncedAt');
    if (savedLast) setLastSyncedAt(savedLast);
  }, []);

  function saveBusiness(e) {
    e.preventDefault();
    localStorage.setItem('businessProfile', JSON.stringify(business));
    alert('Business profile saved');
  }

  function savePrefs(e) {
    e.preventDefault();
    localStorage.setItem('appPreferences', JSON.stringify(prefs));
    alert('Preferences saved');
  }

  function handleExportCSV() {
    // Simple export of localStorage keys as CSV for demo purposes
    const entries = Object.entries(localStorage).map(([k, v]) => ({ k, v }));
    const csv = ['key,value', ...entries.map(en => `${en.k.replace(/\n/g,' ')},"${String(en.v).replace(/"/g,'""')}"`) ].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'biasharapro-export.csv';
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleExportPDF() {
    // Build a simple HTML document with key local data and open print dialog
    const dataHtml = `
      <html>
        <head><title>BiasharaPro export</title></head>
        <body>
          <h1>BiasharaPro export</h1>
          <pre>${JSON.stringify(Object.fromEntries(Object.entries(localStorage)), null, 2)}</pre>
        </body>
      </html>`;
    const w = window.open('', '_blank');
    if (!w) return alert('Popup blocked — allow popups to export PDF');
    w.document.write(dataHtml);
    w.document.close();
    w.focus();
    // Delay a bit to ensure content rendered before print
    setTimeout(() => w.print(), 300);
  }

  function handleClearCache() {
    if (!confirm('Clear local cache? This will remove local data (except auth).')) return;
    // Preserve possible auth token keys starting with "auth"
    const keep = {};
    for (const k in localStorage) {
      if (k && k.startsWith('auth')) keep[k] = localStorage.getItem(k);
    }
    localStorage.clear();
    Object.entries(keep).forEach(([k, v]) => localStorage.setItem(k, v));
    setSyncStatus('Cleared');
    alert('Local cache cleared');
  }

  function handleSyncNow() {
    // Placeholder: mark as synced and store timestamp
    const ts = new Date().toISOString();
    setSyncStatus('Synced');
    setLastSyncedAt(ts);
    localStorage.setItem('syncStatus', 'Synced');
    localStorage.setItem('lastSyncedAt', ts);
    alert('Sync completed');
  }

  function handleBackupReminderSave() {
    localStorage.setItem('backupReminderDays', String(backupReminderDays));
    alert('Backup reminder saved');
  }

  function handleChangePassword() {
    alert('Change password flow not implemented yet.');
  }

  function handleLogout() {
    // Simple logout: clear auth keys and navigate to auth landing
    for (const k in localStorage) if (k && k.startsWith('auth')) localStorage.removeItem(k);
    navigate('/auth');
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Settings</h1>

      <form className="mb-6" onSubmit={saveBusiness}>
        <h2 className="text-lg font-semibold mb-2">Business profile</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <input value={business.shopName} onChange={e => setBusiness({ ...business, shopName: e.target.value })} placeholder="Shop name" className="p-2 border rounded" />
          <input value={business.ownerName} onChange={e => setBusiness({ ...business, ownerName: e.target.value })} placeholder="Owner name" className="p-2 border rounded" />
          <input value={business.location} onChange={e => setBusiness({ ...business, location: e.target.value })} placeholder="Location" className="p-2 border rounded" />
          <input value={business.businessType} onChange={e => setBusiness({ ...business, businessType: e.target.value })} placeholder="Business type" className="p-2 border rounded" />
          <select value={business.currency} onChange={e => setBusiness({ ...business, currency: e.target.value })} className="p-2 border rounded">
            <option value="KES">KES</option>
            <option value="UGX">UGX</option>
            <option value="TZS">TZS</option>
            <option value="USD">USD</option>
          </select>
        </div>
        <div className="mt-3">
          <button className="px-4 py-2 bg-slate-800 text-white rounded" type="submit">Save business profile</button>
        </div>
      </form>

      <form className="mb-6" onSubmit={savePrefs}>
        <h2 className="text-lg font-semibold mb-2">App preferences</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 items-center">
          <label className="flex items-center gap-2">
            <span className="w-32">Language</span>
            <select value={prefs.language} onChange={e => setPrefs({ ...prefs, language: e.target.value })} className="p-2 border rounded">
              <option value="en">English</option>
              <option value="sw">Swahili</option>
            </select>
          </label>

          <label className="flex items-center gap-2">
            <span className="w-32">Theme</span>
            <select value={prefs.theme} onChange={e => setPrefs({ ...prefs, theme: e.target.value })} className="p-2 border rounded">
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </label>

          <label className="flex items-center gap-2">
            <span className="w-32">Default tax</span>
            <input type="number" value={prefs.defaultTax} onChange={e => setPrefs({ ...prefs, defaultTax: Number(e.target.value) })} className="p-2 border rounded w-full" />
          </label>

          <label className="flex flex-col gap-2 md:col-span-2">
            <span className="w-32">Receipt footer</span>
            <textarea value={prefs.receiptFooter} onChange={e => setPrefs({ ...prefs, receiptFooter: e.target.value })} className="p-2 border rounded w-full" rows={3} placeholder="Thank you for shopping at..." />
          </label>
        </div>
        <div className="mt-3">
          <button className="px-4 py-2 bg-slate-800 text-white rounded" type="submit">Save preferences</button>
        </div>
      </form>

      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Data & sync</h2>
        <div className="flex flex-col md:flex-row gap-3">
          <button onClick={handleExportCSV} className="px-4 py-2 bg-green-600 text-white rounded">Export CSV</button>
          <button onClick={handleExportPDF} className="px-4 py-2 bg-amber-400 text-black rounded">Export PDF</button>
          <button onClick={handleClearCache} className="px-4 py-2 bg-rose-600 text-white rounded">Clear local cache</button>
          <div className="flex items-center gap-2">
            <span className="font-medium">Sync status:</span>
            <span>{syncStatus}</span>
            <button onClick={handleSyncNow} className="px-2 py-1 bg-slate-200 rounded text-sm">Sync now</button>
          </div>
        </div>

        <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
          <label className="flex flex-col">
            <span>Backup reminder (days)</span>
            <input type="number" min={1} value={backupReminderDays} onChange={e => setBackupReminderDays(Number(e.target.value))} className="p-2 border rounded" />
          </label>
          <div>
            <button onClick={handleBackupReminderSave} className="px-4 py-2 bg-slate-800 text-white rounded">Save reminder</button>
          </div>
        </div>
      </div>

      <div className="mb-12">
        <h2 className="text-lg font-semibold mb-2">Account</h2>
        <div className="bg-white p-4 border rounded shadow-sm">
          <div className="mb-3">
            <div className="text-sm text-slate-600">Profile</div>
            <div className="font-medium">{business.ownerName || '—'}</div>
            <div className="text-xs text-slate-500">{business.shopName || '—'}</div>
          </div>
          <div className="flex gap-3">
            <button onClick={handleChangePassword} className="px-4 py-2 bg-amber-400 text-black rounded">Change password</button>
            <button onClick={handleLogout} className="px-4 py-2 bg-red-600 text-white rounded ml-auto">Logout</button>
          </div>
        </div>
      </div>
      {/* Sticky prominent logout at bottom */}
      <div className="h-24" />
      <div className="fixed left-0 right-0 bottom-0 bg-white border-t p-4 flex justify-center">
        <button onClick={handleLogout} className="w-full md:w-1/3 px-6 py-3 bg-red-700 text-white rounded text-lg font-semibold">Logout</button>
      </div>
    </div>
  );
}

export default SettingsPage;
