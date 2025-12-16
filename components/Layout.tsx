import React from 'react';
import { ViewState, User } from '../types';
import { Button } from './UI';
import { 
  Home, 
  Feather, 
  Music, 
  Image as ImageIcon, 
  User as UserIcon, 
  Menu, 
  X,
  Plus
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  currentView: ViewState;
  setView: (view: ViewState) => void;
  user?: User;
  onOpenCreate: () => void;
}

const NavItem: React.FC<{ 
  icon: React.ReactNode; 
  label: string; 
  active: boolean; 
  onClick: () => void 
}> = ({ icon, label, active, onClick }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${active ? 'bg-primary-pink/20 text-soft-charcoal font-medium' : 'text-soft-text hover:bg-soft-beige/50'}`}
  >
    {React.cloneElement(icon as React.ReactElement, { size: 20, strokeWidth: active ? 2.5 : 2 })}
    <span>{label}</span>
  </button>
);

export const Layout: React.FC<LayoutProps> = ({ children, currentView, setView, user, onOpenCreate }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  // Close mobile menu when view changes
  React.useEffect(() => {
    setMobileMenuOpen(false);
  }, [currentView]);

  return (
    <div className="min-h-screen flex bg-warm-white">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 w-full z-40 bg-warm-white/90 backdrop-blur border-b border-soft-beige px-6 py-4 flex justify-between items-center">
        <span className="font-serif text-xl font-medium">Resonance</span>
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 text-soft-charcoal">
          {mobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside className={`
        fixed lg:sticky top-0 h-screen w-64 bg-warm-white border-r border-soft-beige/60 p-6 z-30
        transition-transform duration-300 ease-in-out
        ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex flex-col h-full">
          <div className="mb-10 px-4 hidden lg:block">
            <h1 className="font-serif text-2xl tracking-wide text-soft-charcoal">Resonance</h1>
            <p className="text-xs text-soft-text mt-1">A psycho-creative space</p>
          </div>

          <nav className="flex-1 space-y-2">
            <NavItem 
              icon={<Home />} 
              label="Home" 
              active={currentView === ViewState.DASHBOARD} 
              onClick={() => setView(ViewState.DASHBOARD)} 
            />
            <NavItem 
              icon={<Feather />} 
              label="Community Feed" 
              active={currentView === ViewState.FEED} 
              onClick={() => setView(ViewState.FEED)} 
            />
            
            <div className="pt-6 pb-2 px-4 text-xs font-semibold text-soft-text uppercase tracking-wider">Spaces</div>
            
            <NavItem 
              icon={<ImageIcon />} 
              label="Art Space" 
              active={currentView === ViewState.SPACE_ART} 
              onClick={() => setView(ViewState.SPACE_ART)} 
            />
            <NavItem 
              icon={<Music />} 
              label="Sound Space" 
              active={currentView === ViewState.SPACE_MUSIC} 
              onClick={() => setView(ViewState.SPACE_MUSIC)} 
            />
             <NavItem 
              icon={<Feather />} 
              label="Writing Space" 
              active={currentView === ViewState.SPACE_WRITING} 
              onClick={() => setView(ViewState.SPACE_WRITING)} 
            />
          </nav>

          <div className="pt-6 border-t border-soft-beige space-y-4">
             <Button variant="primary" className="w-full flex justify-center items-center gap-2 shadow-lg shadow-primary-pink/20" onClick={onOpenCreate}>
                <Plus size={18} />
                <span>Express</span>
             </Button>

            <button 
              onClick={() => setView(ViewState.PROFILE)}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-soft-beige/50 transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-soft-rose/30 flex items-center justify-center text-soft-charcoal text-sm font-serif">
                {user?.name.charAt(0)}
              </div>
              <div className="text-left">
                <div className="text-sm font-medium text-soft-charcoal">{user?.name}</div>
                <div className="text-xs text-soft-text">View Profile</div>
              </div>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 pt-20 lg:pt-0">
        <div className="max-w-4xl mx-auto p-6 md:p-10 lg:p-12 pb-24">
          {children}
        </div>
      </main>
    </div>
  );
};