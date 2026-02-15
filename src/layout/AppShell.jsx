import { useState, Suspense } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import modules from '../modules/registry';

export default function AppShell() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const currentModule = modules.find(m => m.route === location.pathname);
  const isFullWidth = currentModule?.fullWidth;

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0">
        <Topbar onMenuClick={() => setSidebarOpen(prev => !prev)} />

        <main className={`flex-1 ${isFullWidth ? '' : 'overflow-y-auto'}`}>
          <div className={isFullWidth ? 'h-full px-4 sm:px-6 py-6 sm:py-8' : 'max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8'}>
            <Suspense
              fallback={
                <div className="flex items-center justify-center py-20">
                  <div className="w-6 h-6 border-2 border-sky-400/30 border-t-sky-400 rounded-full animate-spin" />
                </div>
              }
            >
              <Outlet />
            </Suspense>
          </div>
        </main>
      </div>
    </div>
  );
}
