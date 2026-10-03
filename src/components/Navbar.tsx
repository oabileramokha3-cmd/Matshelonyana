import React from 'react';
import { Role } from '../types';
import { Truck, Bell, Shield, Wifi, WifiOff, PlusCircle, UserPlus, Percent } from 'lucide-react';

interface NavbarProps {
  currentRole: Role;
  onSelectRole: (role: Role) => void;
  activeTab: string;
  onSelectTab: (tab: string) => void;
  unreadNotificationsCount: number;
  onOpenNotifications: () => void;
  isOnline: boolean;
  onToggleOnline: () => void;
  pendingOfflineCount: number;
  onOpenNewHaul: () => void;
  onOpenDriverRegister: () => void;
  pendingDriverAppsCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRole,
  onSelectRole,
  activeTab,
  onSelectTab,
  unreadNotificationsCount,
  onOpenNotifications,
  isOnline,
  onToggleOnline,
  pendingOfflineCount,
  onOpenNewHaul,
  onOpenDriverRegister,
  pendingDriverAppsCount,
}) => {
  return (
    <header className="sticky top-0 z-50 w-full bg-slate-950/95 backdrop-blur-md border-b border-slate-800 text-slate-100 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
        
        {/* Zone 1: Brand Wordmark (Single element) */}
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-sky-500 to-sky-700 flex items-center justify-center text-white shadow-md shadow-sky-950/50">
              <Truck className="w-5 h-5" />
            </div>
            <a 
              href="#home" 
              onClick={(e) => { e.preventDefault(); onSelectTab('hauls'); }}
              className="text-lg sm:text-xl font-bold tracking-tight text-white hover:text-sky-300 transition-colors"
            >
              Matshelonyana
            </a>
          </div>

          {/* Botswana Flag Minimal Emblem Accent */}
          <div className="hidden lg:flex items-center h-4 w-7 rounded overflow-hidden shadow-sm border border-slate-700">
            <div className="w-full h-full flex flex-col">
              <div className="bg-[#75aadb] h-[33%] w-full"></div>
              <div className="bg-white h-[9%] w-full"></div>
              <div className="bg-black h-[16%] w-full"></div>
              <div className="bg-white h-[9%] w-full"></div>
              <div className="bg-[#75aadb] h-[33%] w-full"></div>
            </div>
          </div>
        </div>

        {/* Zone 2: Navigation Links (Clean text links with hover styling) */}
        <nav className="hidden lg:flex items-center gap-5 text-sm font-medium text-slate-300">
          <button
            onClick={() => onSelectTab('hauls')}
            className={`transition-colors hover:text-white whitespace-nowrap ${
              activeTab === 'hauls' ? 'text-sky-400 font-semibold border-b-2 border-sky-400 pb-1' : ''
            }`}
          >
            {currentRole === 'driver' ? 'Driver Haul Radar' : currentRole === 'owner' ? 'App Owner Portal' : 'Goods & Hauls'}
          </button>
          
          <button
            onClick={() => onSelectTab('tracking')}
            className={`transition-colors hover:text-white whitespace-nowrap ${
              activeTab === 'tracking' ? 'text-sky-400 font-semibold border-b-2 border-sky-400 pb-1' : ''
            }`}
          >
            Live GPS Tracking
          </button>

          <button
            onClick={() => onSelectTab('ledger')}
            className={`transition-colors hover:text-white whitespace-nowrap ${
              activeTab === 'ledger' ? 'text-sky-400 font-semibold border-b-2 border-sky-400 pb-1' : ''
            }`}
          >
            Digital Ledger
          </button>

          <button
            onClick={() => onSelectTab('analytics')}
            className={`transition-colors hover:text-white whitespace-nowrap ${
              activeTab === 'analytics' ? 'text-sky-400 font-semibold border-b-2 border-sky-400 pb-1' : ''
            }`}
          >
            Fleet Analytics
          </button>
        </nav>

        {/* Zone 3: Primary Actions & Role Switching */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          
          {/* Driver Registration CTA Button */}
          <button
            onClick={onOpenDriverRegister}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-semibold text-sky-300 bg-sky-950/80 hover:bg-sky-900 border border-sky-700/60 rounded-lg shadow-sm transition-all whitespace-nowrap active:scale-95"
            title="Register as a driver with Omang ID and Driver's Licence"
          >
            <UserPlus className="w-3.5 h-3.5 text-sky-400" />
            <span className="hidden sm:inline">Join as Driver</span>
            <span className="sm:hidden">Join</span>
          </button>

          {/* Post New Haul (Only visible when customer) */}
          {currentRole === 'customer' && (
            <button
              onClick={onOpenNewHaul}
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-500 rounded-lg shadow-sm transition-all whitespace-nowrap active:scale-95"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Book Haul</span>
            </button>
          )}

          {/* Offline Sync State Simulator Button */}
          <button
            onClick={onToggleOnline}
            className={`flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs font-medium transition-all ${
              isOnline 
                ? 'bg-slate-900 border border-slate-700 text-slate-300 hover:text-white' 
                : 'bg-amber-950/80 border border-amber-600 text-amber-300 animate-pulse'
            }`}
            title={isOnline ? 'Online. Click to simulate field offline mode.' : 'Offline Mode active.'}
          >
            {isOnline ? (
              <Wifi className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <>
                <WifiOff className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-[10px] font-semibold hidden sm:inline">({pendingOfflineCount})</span>
              </>
            )}
          </button>

          {/* Notification Bell (Push & SMS Alerts) */}
          <button
            onClick={onOpenNotifications}
            className="relative p-2 text-slate-300 hover:text-white hover:bg-slate-900 rounded-lg transition-colors"
            title="Notifications & SMS Alerts"
          >
            <Bell className="w-4 h-4" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-sky-400 rounded-full ring-2 ring-slate-950 animate-ping" />
            )}
          </button>

          {/* Role Switcher (Sender / Driver / App Owner Portal) */}
          <div className="flex items-center p-0.5 bg-slate-900 rounded-lg border border-slate-800 text-xs font-medium">
            <button
              onClick={() => onSelectRole('customer')}
              className={`px-2 sm:px-2.5 py-1 rounded-md transition-colors ${
                currentRole === 'customer'
                  ? 'bg-sky-600 text-white font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Sender
            </button>
            <button
              onClick={() => onSelectRole('driver')}
              className={`px-2 sm:px-2.5 py-1 rounded-md transition-colors ${
                currentRole === 'driver'
                  ? 'bg-sky-600 text-white font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Driver
            </button>
            <button
              onClick={() => onSelectRole('owner')}
              className={`px-2 sm:px-2.5 py-1 rounded-md transition-colors relative ${
                currentRole === 'owner'
                  ? 'bg-sky-600 text-white font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="App Owner Portal (5% Commission & Driver KYC Verifications)"
            >
              <span>App Owner (5%)</span>
              {pendingDriverAppsCount > 0 && (
                <span className="ml-1 px-1 py-0.2 rounded-full bg-amber-500 text-slate-950 font-bold text-[9px]">
                  {pendingDriverAppsCount}
                </span>
              )}
            </button>
          </div>
        </div>

      </div>
    </header>
  );
};
