"use client";
import React, { useState } from 'react';
import { Sun, Moon, Bell, LogOut, Save } from 'lucide-react';

const Settings = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);

  return (
    <div className="max-w-xl py-6">
      <header className="mb-0">
        <h1 className="text-3xl font-bold text-neutral-900">Settings</h1>
        <p className="text-neutral-500 mt-1 mb-8">Manage your dashboard preferences.</p>
      </header>

      <div className="divide-y divide-neutral-100">
        {/* Theme Item */}
        <div className="py-5 flex items-center justify-between">
          <div>
            <p className="font-medium text-neutral-800">Dark Mode</p>
            <p className="text-xs text-neutral-500 mt-0.5">Adjust the interface color theme</p>
          </div>
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${isDarkMode ? 'bg-neutral-900' : 'bg-neutral-200'}`}
          >
            <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${isDarkMode ? 'translate-x-5' : 'translate-x-0.5'}`} />
          </button>
        </div>

        {/* Notifications Item */}
        <div className="py-5 flex items-center justify-between">
          <div>
            <p className="font-medium text-neutral-800">Order Alerts</p>
            <p className="text-xs text-neutral-500 mt-0.5">Notifications for new customer orders</p>
          </div>
          <button
            onClick={() => setNotifications(!notifications)}
            className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${notifications ? 'bg-green-600' : 'bg-neutral-200'}`}
          >
            <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${notifications ? 'translate-x-5' : 'translate-x-0.5'}`} />
          </button>
        </div>

        {/* Account Item */}
        <div className="py-5 flex items-center justify-between">
          <div>
            <p className="font-medium text-neutral-800">Admin Account</p>
            <p className="text-xs text-neutral-500 mt-0.5">admin@anzatex.com</p>
          </div>
          <button className="text-xs font-semibold text-neutral-400 hover:text-red-500 transition tracking-tight uppercase">
            Sign Out
          </button>
        </div>
      </div>

      <div className="mt-8">
        <button className="inline-flex items-center gap-2 px-6 py-2 bg-neutral-900 text-white text-sm font-medium rounded-md hover:bg-neutral-800 transition active:scale-95 shadow-sm">
          <Save size={14} />
          Save Settings
        </button>
      </div>
    </div>
  );
};

export default Settings;