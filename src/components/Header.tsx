import { useState } from 'react';
import { GraduationCap, Menu, X } from 'lucide-react';

interface HeaderProps {
  activeSection: string;
  onNavigate: (sectionId: string) => void;
}

export default function Header({ activeSection, onNavigate }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { id: 'about',     label: 'About' },
    { id: 'branches',  label: 'Branches' },
    { id: 'conduct',   label: 'Community' },
  ];

  const handleLinkClick = (id: string) => {
    setIsMobileMenuOpen(false);
    onNavigate(id);
  };

  return (
    <header className="sticky top-2.5 left-0 right-0 z-40 bg-header-stripes border-b-4 border-[#c2410c] select-none shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">

        {/* LOGO */}
        <div
          onClick={() => onNavigate('hero')}
          className="flex items-center space-x-2.5 cursor-pointer group"
        >
          <div className="p-1 bg-[#c2410c] border border-black text-white shadow-[1.5px_1.5px_0px_#000] group-hover:scale-105 transition-transform duration-150">
            <GraduationCap size={18} className="stroke-[2.5]" />
          </div>
          <span className="font-typewriter font-bold text-lg sm:text-xl text-[#c2410c] tracking-wide select-none">
            Campus Circle
          </span>
        </div>

        {/* DESKTOP NAV LINKS */}
        <nav className="hidden md:flex items-center space-x-10 lg:space-x-14">
          {navLinks.map(({ id, label }) => {
            const isActive = activeSection === id;
            return (
              <button
                key={id}
                onClick={() => handleLinkClick(id)}
                className={`relative font-typewriter font-bold text-sm tracking-wider cursor-pointer transition-colors pb-1 outline-none ${
                  isActive
                    ? 'text-[#c2410c]'
                    : 'text-neutral-700 hover:text-[#c2410c]'
                }`}
              >
                {label}
                {isActive && (
                  <span className="absolute left-0 right-0 bottom-[-4px] h-[3px] bg-[#c2410c] rounded-none animate-[pulse_1.5s_infinite]" />
                )}
              </button>
            );
          })}
        </nav>

        {/* JOIN NOW CTA */}
        <div className="hidden md:block">
          <button
            onClick={() => onNavigate('branches')}
            className="px-5 py-2 border-2 border-black bg-[#c2410c] hover:bg-[#a8350a] text-white font-typewriter font-bold text-xs uppercase tracking-widest cursor-pointer transition-all duration-100 active:translate-y-0.5 active:shadow-[1px_1px_0px_#000] shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] rounded-none"
          >
            Join Now
          </button>
        </div>

        {/* MOBILE HAMBURGER */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-1.5 border border-black bg-white hover:bg-neutral-100 cursor-pointer shadow-[1.5px_1.5px_0px_#000] active:translate-y-px outline-none rounded-none text-neutral-800"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={20} className="stroke-[2.5]" /> : <Menu size={20} className="stroke-[2.5]" />}
          </button>
        </div>

      </div>

      {/* MOBILE NAV DRAWER */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-white border-b-2 border-black shadow-lg z-30 bg-header-stripes border-t border-neutral-200">
          <nav className="flex flex-col p-4 space-y-4">
            {navLinks.map(({ id, label }) => {
              const isActive = activeSection === id;
              return (
                <button
                  key={id}
                  onClick={() => handleLinkClick(id)}
                  className={`w-full text-left font-typewriter font-bold text-sm py-2 px-3 border-l-4 transition-all ${
                    isActive
                      ? 'border-[#c2410c] text-[#c2410c] bg-neutral-100/50'
                      : 'border-transparent text-neutral-700 hover:text-[#c2410c] hover:bg-neutral-50/50'
                  }`}
                >
                  {label}
                </button>
              );
            })}
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                onNavigate('branches');
              }}
              className="w-full py-2.5 border-2 border-black bg-[#c2410c] text-white font-typewriter font-bold text-xs uppercase tracking-widest text-center cursor-pointer active:translate-y-px shadow-[2px_2px_0px_#000]"
            >
              Join Now
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}
