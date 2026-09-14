import React, { useState } from 'react';
import { 
  Music, 
  Leaf, 
  Heart, 
  Gift, 
  ScrollText,
  Menu,
  X
} from 'lucide-react';
import { EventConfig } from '../types';

interface HeaderProps {
  config: EventConfig;
  isPlayingAudio: boolean;
  onToggleAudio: () => void;
  onOpenHostModal?: () => void;
  onOpenHtmlModal: () => void;
  onOpenGuestbookModal: () => void;
  onOpenGiftModal?: () => void;
  onSelectPreset: (presetKey: string) => void;
  currentPresetKey: string;
  leavesEnabled?: boolean;
  onToggleLeaves?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  config,
  isPlayingAudio,
  onToggleAudio,
  onOpenHostModal,
  onOpenHtmlModal,
  onOpenGuestbookModal,
  onOpenGiftModal,
  onSelectPreset,
  currentPresetKey,
  leavesEnabled = true,
  onToggleLeaves
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-[#ffffff]/95 backdrop-blur-md border-b border-[#c8d7e3] px-3 sm:px-8 py-2.5 sm:py-3 shadow-[0_4px_20px_rgba(45,75,100,0.04)] transition-colors">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2.5 sm:space-x-3">
          <span className="text-xl sm:text-2xl text-[#3A5A74] select-none font-serif">{config.logoIcon}</span>
          <span className="font-serif font-semibold text-base sm:text-lg tracking-widest text-[#18232c] truncate max-w-[140px] sm:max-w-xs">
            {config.logoText}
          </span>
        </div>

        {/* Primary Desktop Navigator: HOME -> RSVP -> INVITATION -> FIND SEAT -> CHURCH -> VENUE -> SCHEDULE -> GUESTBOOK -> GIFT */}
        <nav className="hidden lg:flex items-center space-x-4 xl:space-x-6 text-xs font-serif font-semibold uppercase tracking-widest text-[#475569]">
          <a href="#hero" className="hover:text-[#3A5A74] transition">Home</a>
          <a href="#rsvp" className="hover:text-[#3A5A74] transition">RSVP</a>
          {config.invitationEnabled !== false && (
            <a href="#invitation" className="hover:text-[#3A5A74] transition">Invitation</a>
          )}
          <a href="#seating" className="hover:text-[#3A5A74] transition">Find Seat</a>
          {config.churchEnabled !== false && (
            <a href="#church" className="hover:text-[#3A5A74] transition">Church</a>
          )}
          {config.venueEnabled !== false && (
            <a href="#venue" className="hover:text-[#3A5A74] transition">Venue</a>
          )}
          <a href="#schedule" className="hover:text-[#3A5A74] transition">Schedule</a>
          {config.guestbookEnabled !== false && (
            <a href="#guestbook" className="hover:text-[#3A5A74] transition">Guestbook</a>
          )}
          {config.giftEnabled !== false && (
            <a href="#gift" className="hover:text-[#3A5A74] transition">Gift</a>
          )}
        </nav>

        <div className="flex items-center space-x-1.5 sm:space-x-2.5">
          {/* GIFT Button for quick QR display */}
          {config.giftEnabled !== false && (
            <button
              id="header-gift-btn"
              onClick={onOpenGiftModal || (() => {
                const el = document.getElementById('gift');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              })}
              title="Wedding Gift: Scan or View QR Code"
              className="px-2.5 sm:px-3.5 py-1.5 rounded-full text-xs font-serif font-semibold bg-[#ebf2f7] hover:bg-[#dbe7f0] text-[#3A5A74] flex items-center space-x-1.5 transition border border-[#c8d7e3] shadow-xs cursor-pointer"
            >
              <Gift className="w-3.5 h-3.5 text-[#3A5A74]" />
              <span>GIFT</span>
            </button>
          )}

          {/* Guestbook Button for Wishes & Love */}
          <button
            id="header-guestbook-btn"
            onClick={onOpenGuestbookModal}
            title="Guestbook: Write Wishes & Love"
            className="px-2.5 sm:px-3.5 py-1.5 rounded-full text-xs font-serif font-semibold bg-[#3A5A74] hover:bg-[#274155] text-white flex items-center space-x-1.5 transition border border-[#274155] shadow-xs cursor-pointer"
          >
            <Heart className="w-3.5 h-3.5 text-rose-300 fill-rose-300/40" />
            <span>Guestbook</span>
          </button>

          {/* Background Music Button */}
          <button
            id="header-music-btn"
            onClick={onToggleAudio}
            title={isPlayingAudio ? 'Pause Background Music' : 'Play Background Music'}
            className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center transition shadow-sm border ${
              isPlayingAudio 
                ? 'bg-[#3A5A74] text-white border-[#274155]' 
                : 'bg-[#ffffff] text-[#3A5A74] border-[#c8d7e3] hover:bg-[#ebf2f7]'
            }`}
          >
            <Music className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isPlayingAudio ? 'animate-pulse' : ''}`} />
          </button>

          {/* Falling Leaves Animation Toggle Button */}
          {onToggleLeaves && (
            <button
              id="header-leaves-btn"
              onClick={onToggleLeaves}
              title={leavesEnabled ? 'Pause Falling Wedding Leaves & Petals' : 'Enable Falling Wedding Leaves & Petals'}
              className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center transition shadow-sm border ${
                leavesEnabled 
                  ? 'bg-[#3A5A74] text-white border-[#274155]' 
                  : 'bg-[#ffffff] text-[#475569] border-[#c8d7e3] hover:bg-[#ebf2f7]'
              }`}
            >
              <Leaf className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${leavesEnabled ? 'opacity-100' : 'opacity-40'}`} />
            </button>
          )}

          {/* Mobile Menu Navigator Toggle Button */}
          <button
            id="header-mobile-menu-btn"
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            title="Toggle Navigator Menu"
            aria-label="Toggle Navigator Menu"
            className="lg:hidden w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center transition shadow-xs border bg-[#ebf2f7] hover:bg-[#dbe7f0] text-[#3A5A74] border-[#c8d7e3] cursor-pointer"
          >
            {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigator: HOME -> RSVP -> INVITATION -> FIND SEAT -> CHURCH -> VENUE -> SCHEDULE -> GUESTBOOK -> GIFT */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-[#c8d7e3] mt-2.5 pt-3 pb-2 animate-in slide-in-from-top-2 duration-200">
          <nav className="flex flex-col space-y-1 font-serif text-xs font-semibold uppercase tracking-widest text-[#475569]">
            <a
              href="#hero"
              onClick={() => setIsMobileMenuOpen(false)}
              className="py-2 px-3 rounded-xl hover:bg-[#ebf2f7] hover:text-[#3A5A74] transition flex items-center justify-between"
            >
              <span>Home</span>
              <span className="text-[#94a3b8] text-[10px]">❦</span>
            </a>
            <a
              href="#rsvp"
              onClick={() => setIsMobileMenuOpen(false)}
              className="py-2 px-3 rounded-xl hover:bg-[#ebf2f7] text-[#3A5A74] font-bold transition flex items-center justify-between bg-[#ebf2f7]/50"
            >
              <span>RSVP</span>
              <span className="text-[#3A5A74] text-[10px]">❦</span>
            </a>
            {config.invitationEnabled !== false && (
              <a
                href="#invitation"
                onClick={() => setIsMobileMenuOpen(false)}
                className="py-2 px-3 rounded-xl hover:bg-[#ebf2f7] hover:text-[#3A5A74] transition flex items-center justify-between"
              >
                <span>Invitation</span>
                <span className="text-[#94a3b8] text-[10px]">❦</span>
              </a>
            )}
            <a
              href="#seating"
              onClick={() => setIsMobileMenuOpen(false)}
              className="py-2 px-3 rounded-xl hover:bg-[#ebf2f7] hover:text-[#3A5A74] transition flex items-center justify-between"
            >
              <span>Find Seat</span>
              <span className="text-[#94a3b8] text-[10px]">❦</span>
            </a>
            {config.churchEnabled !== false && (
              <a
                href="#church"
                onClick={() => setIsMobileMenuOpen(false)}
                className="py-2 px-3 rounded-xl hover:bg-[#ebf2f7] hover:text-[#3A5A74] transition flex items-center justify-between"
              >
                <span>Church</span>
                <span className="text-[#94a3b8] text-[10px]">❦</span>
              </a>
            )}
            {config.venueEnabled !== false && (
              <a
                href="#venue"
                onClick={() => setIsMobileMenuOpen(false)}
                className="py-2 px-3 rounded-xl hover:bg-[#ebf2f7] hover:text-[#3A5A74] transition flex items-center justify-between"
              >
                <span>Venue</span>
                <span className="text-[#94a3b8] text-[10px]">❦</span>
              </a>
            )}
            <a
              href="#schedule"
              onClick={() => setIsMobileMenuOpen(false)}
              className="py-2 px-3 rounded-xl hover:bg-[#ebf2f7] hover:text-[#3A5A74] transition flex items-center justify-between"
            >
              <span>Schedule</span>
              <span className="text-[#94a3b8] text-[10px]">❦</span>
            </a>
            {config.guestbookEnabled !== false && (
              <a
                href="#guestbook"
                onClick={() => setIsMobileMenuOpen(false)}
                className="py-2 px-3 rounded-xl hover:bg-[#ebf2f7] hover:text-[#3A5A74] transition flex items-center justify-between"
              >
                <span>Guestbook</span>
                <span className="text-[#94a3b8] text-[10px]">❦</span>
              </a>
            )}
            {config.giftEnabled !== false && (
              <a
                href="#gift"
                onClick={() => setIsMobileMenuOpen(false)}
                className="py-2 px-3 rounded-xl hover:bg-[#ebf2f7] hover:text-[#3A5A74] transition flex items-center justify-between"
              >
                <span>Gift</span>
                <span className="text-[#94a3b8] text-[10px]">❦</span>
              </a>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};
