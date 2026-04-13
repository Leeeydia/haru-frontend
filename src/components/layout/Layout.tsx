import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import MobileNav from './MobileNav';

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-surface font-body text-on-surface">
      <Header />
      <main className="flex-1 pt-20 pb-16 md:pb-0">
        <Outlet />
      </main>
      <Footer />
      <MobileNav />
    </div>
  );
}
