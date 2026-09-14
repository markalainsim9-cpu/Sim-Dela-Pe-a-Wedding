import React, { useState } from 'react';
import { Search, Map, Ticket, AlertCircle, Send, Users } from 'lucide-react';
import { Guest } from '../types';

interface SeatingSectionProps {
  guests: Guest[];
  onSelectGuestForPass: (guest: Guest) => void;
  onOpenSeatingPlanModal: () => void;
}

export const SeatingSection: React.FC<SeatingSectionProps> = ({
  guests,
  onSelectGuestForPass,
  onOpenSeatingPlanModal
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchedGuest, setSearchedGuest] = useState<Guest | null>(null);
  const [searchStatus, setSearchStatus] = useState<'idle' | 'found' | 'declined' | 'not_found'>('idle');

  const handleSearch = () => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) {
      setSearchStatus('idle');
      setSearchedGuest(null);
      return;
    }

    const found = guests.find(g => g.name.toLowerCase().includes(q));

    if (found) {
      setSearchedGuest(found);
      if (found.attending === 'yes') {
        setSearchStatus('found');
      } else {
        setSearchStatus('declined');
      }
    } else {
      setSearchedGuest(null);
      setSearchStatus('not_found');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <section id="seating" className="romantic-stationery-card rounded-3xl p-6 sm:p-12 relative overflow-hidden">
      {/* Delicate Inner Stationery Border */}
      <div className="absolute inset-3 sm:inset-4 border border-[#c5a059]/30 rounded-2xl pointer-events-none"></div>

      <div className="text-center max-w-xl mx-auto mb-8 relative z-10">
        <div className="inline-flex items-center space-x-2 text-[#3A5A74] text-xs font-serif font-semibold uppercase tracking-[0.25em] mb-1.5">
          <span>❦</span>
          <span>Table & Place Setting Directory</span>
          <span>❦</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-serif text-[#18232c] tracking-wide font-normal">
          Find Your Seat
        </h2>
        <p className="text-[#475569] text-sm sm:text-base mt-2.5 font-serif italic font-normal">
          "Kindly enter your name below to discover your designated table and seat for our evening celebration."
        </p>
      </div>

      <div className="max-w-lg mx-auto space-y-6 relative z-10">
        {/* Search Bar */}
        <div className="relative flex items-center shadow-sm rounded-2xl overflow-hidden border border-[#c8d7e3] bg-[#ffffff] focus-within:border-[#3A5A74] focus-within:ring-2 focus-within:ring-[#3A5A74]/15 transition">
          <span className="pl-4 pr-1 text-[#3A5A74]">
            <Search className="w-5 h-5 text-[#3A5A74]" />
          </span>
          <input
            id="seat-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Enter your full name (e.g. Emily Watson)..."
            className="w-full py-3.5 sm:py-4 pl-3 pr-28 bg-[#ffffff] text-sm outline-none text-[#18232c] font-medium placeholder-slate-400"
          />
          <button
            id="seat-search-btn"
            onClick={handleSearch}
            className="absolute right-2 px-4 sm:px-5 py-2 sm:py-2.5 bg-[#3A5A74] hover:bg-[#274155] text-white rounded-xl text-xs font-serif font-semibold uppercase tracking-wider shadow-sm transition transform active:scale-95 border border-[#4D708E]"
          >
            Find Seat
          </button>
        </div>

        {/* Quick Help & View Master Seating Plan Link */}
        <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-[#506173] font-serif px-1 gap-2">
          <span>Search by first or last name.</span>
          <button
            id="open-master-seating-plan-btn"
            onClick={onOpenSeatingPlanModal}
            className="text-[#3A5A74] font-semibold hover:underline flex items-center space-x-1.5"
          >
            <Map className="w-4 h-4 text-[#3A5A74]" />
            <span>View Grand Seating Chart</span>
          </button>
        </div>

        {/* Quick Guest Tap Suggestions - Hidden on mobile phones */}
        {guests.some(g => g.attending === 'yes') && (
          <div className="hidden md:flex flex-wrap items-center justify-center gap-1.5 pt-0.5">
            <span className="text-[11px] font-serif italic text-[#506173] mr-1">Quick Select:</span>
            {guests.filter(g => g.attending === 'yes').map(g => (
              <button
                key={g.id}
                onClick={() => {
                  setSearchQuery(g.name);
                  setSearchedGuest(g);
                  setSearchStatus('found');
                }}
                className={`px-2.5 py-1 rounded-full text-xs font-serif transition border ${
                  searchedGuest?.id === g.id
                    ? 'bg-[#3A5A74] text-white border-[#3A5A74] shadow-xs'
                    : 'bg-white/90 hover:bg-[#ebf2f7] text-[#18232c] border-[#c8d7e3]'
                }`}
              >
                {g.name}
              </button>
            ))}
          </div>
        )}

        {/* Search Result Box - Confirmed */}
        {searchStatus === 'found' && searchedGuest && (
          <div className="p-7 rounded-3xl bg-[#ffffff] border border-[#c8d7e3] shadow-lg text-center space-y-4 relative overflow-hidden transition-all duration-300 animate-in fade-in">
            <div className="inline-block px-4 py-1 rounded-full bg-[#ebf2f7] text-[#3A5A74] text-[11px] font-serif font-bold uppercase tracking-widest border border-[#c8d7e3]">
              ❦ Confirmed Place Setting ❦
            </div>

            <div>
              <div className="text-xs uppercase tracking-widest text-[#506173] font-serif font-semibold">
                Honoured Guest
              </div>
              <div className="text-3xl font-serif text-[#18232c] mt-1 font-normal">
                {searchedGuest.name}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 py-4 px-6 bg-[#f8fafc] rounded-2xl border border-[#c8d7e3] max-w-xs mx-auto shadow-sm">
              <div className="text-center border-r border-[#c5a059]/40 pr-2">
                <span className="text-[11px] text-[#3A5A74] uppercase font-serif font-bold tracking-wider block">
                  Assigned Table
                </span>
                <span className="text-2xl font-serif text-[#18232c] font-normal">
                  {searchedGuest.table || 'Table 1'}
                </span>
              </div>
              <div className="text-center pl-2">
                <span className="text-[11px] text-[#3A5A74] uppercase font-serif font-bold tracking-wider block">
                  Assigned Seat
                </span>
                <span className="text-2xl font-serif text-[#18232c] font-normal">
                  {searchedGuest.seat || 'Seat 1'}
                </span>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-center space-x-3">
              <button
                id="view-guest-pass-btn"
                onClick={() => onSelectGuestForPass(searchedGuest)}
                className="px-5 py-2.5 bg-[#3A5A74] hover:bg-[#274155] text-white rounded-xl text-xs font-serif font-semibold shadow-sm transition flex items-center space-x-2 border border-[#4D708E]"
              >
                <Ticket className="w-4 h-4 text-sky-100" />
                <span>View Digital Place Card</span>
              </button>
              <button
                onClick={onOpenSeatingPlanModal}
                className="px-5 py-2.5 bg-[#ffffff] hover:bg-[#ebf2f7] text-[#18232c] border border-[#c8d7e3] rounded-xl text-xs font-serif font-semibold transition flex items-center space-x-2 shadow-sm"
              >
                <Users className="w-4 h-4 text-[#3A5A74]" />
                <span>View Ballroom Map</span>
              </button>
            </div>
          </div>
        )}

        {/* Search Result Box - Declined */}
        {searchStatus === 'declined' && searchedGuest && (
          <div className="p-6 rounded-3xl bg-[#ffffff] border border-[#c8d7e3] text-center space-y-3 shadow-md animate-in fade-in">
            <div className="flex items-center justify-center space-x-2 text-[#3A5A74] font-serif font-semibold text-sm">
              <AlertCircle className="w-5 h-5 text-[#3A5A74]" />
              <span>RSVP Status: Regretfully Declined</span>
            </div>
            <p className="text-sm text-[#475569] leading-relaxed font-serif">
              We found a record for "{searchedGuest.name}", but attendance was marked as declined. Would you like to update your response?
            </p>
            <div className="pt-2 flex items-center justify-center space-x-3">
              <a
                href="#rsvp"
                className="inline-flex items-center space-x-1.5 px-5 py-2.5 bg-[#3A5A74] hover:bg-[#274155] text-white rounded-xl text-xs font-serif font-semibold transition shadow-sm border border-[#4D708E]"
              >
                <Send className="w-3.5 h-3.5 text-sky-100" />
                <span>Update RSVP Response</span>
              </a>
            </div>
          </div>
        )}

        {/* Search Result Box - Not Found */}
        {searchStatus === 'not_found' && (
          <div className="p-6 rounded-3xl bg-[#ffffff] border border-[#c8d7e3] text-center space-y-3 shadow-md animate-in fade-in">
            <div className="flex items-center justify-center space-x-2 text-[#3A5A74] font-serif font-semibold text-sm">
              <AlertCircle className="w-5 h-5 text-[#3A5A74]" />
              <span>Guest Not Yet Listed</span>
            </div>
            <p className="text-sm text-[#475569] leading-relaxed font-serif">
              We couldn't find a seat reservation for "{searchQuery}". Please check spelling or submit your reply card below.
            </p>
            <div className="pt-2 flex items-center justify-center space-x-3">
              <a
                href="#rsvp"
                className="inline-flex items-center space-x-1.5 px-5 py-2.5 bg-[#3A5A74] hover:bg-[#274155] text-white rounded-xl text-xs font-serif font-semibold transition shadow-sm border border-[#4D708E]"
              >
                <Send className="w-3.5 h-3.5 text-sky-100" />
                <span>Submit RSVP Card</span>
              </a>
              <button
                onClick={onOpenSeatingPlanModal}
                className="px-5 py-2.5 bg-[#ffffff] text-[#18232c] border border-[#c8d7e3] rounded-xl text-xs font-serif font-semibold transition hover:bg-[#ebf2f7]"
              >
                Browse All Tables
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
