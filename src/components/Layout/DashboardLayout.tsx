// Layout.tsx
import { Outlet } from 'react-router-dom';

import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from './SideBar';
import Navbar from './Navbar';
import Footer from './Footer';

const Layout = () => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className='overflow-x-hidden flex flex-col h-screen'>
        {/* Navbar - Fixed at top */}
        <Navbar />

        {/* Main content with scroll */}
        <main className='flex-1 overflow-y-auto'>
          <div className='p-6'>
            <Outlet />
          </div>
        </main>
        
        {/* Footer */}
        <Footer />
      </SidebarInset>
    </SidebarProvider>
  );
};

export default Layout;
