import React from 'react';
import { X, Ticket, Sparkles, Check, Download } from 'lucide-react';
import { Guest, EventConfig } from '../types';

interface GuestPassModalProps {
  guest: Guest | null;
  config: EventConfig;
  isOpen: boolean;
  onClose: () => void;
}

export const GuestPassModal: React.FC<GuestPassModalProps> = ({
  guest,
  config,
  isOpen,
  onClose
}) => {
  if (!isOpen || !guest) return null;

  const passCode = `PASS-#${Math.abs(guest.name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 10000))}`;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="romantic-stationery-card rounded-3xl max-w-sm w-full p-6 sm:p-7 shadow-2xl relative space-y-4 text-center">
        {/* Delicate Inner Frame */}
        <div className="absolute inset-3 border border-[#c5a059]/40 rounded-2xl pointer-events-none"></div>

        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#3A5A74] hover:text-[#274155] transition z-10"
          title="Close pass"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Wax Seal Monogram */}
        <div className="w-12 h-12 rounded-full wax-seal flex items-center justify-center mx-auto text-sky-100 shadow-md">
          <span className="font-serif italic text-xs font-bold tracking-wider">V&A</span>
        </div>

        <div className="relative z-10">
          <div className="inline-flex items-center space-x-1 px-3 py-0.5 rounded-full bg-[#ebf2f7] text-[#3A5A74] text-[10px] font-serif font-bold uppercase tracking-widest border border-[#c8d7e3]">
            <Sparkles className="w-3 h-3 text-[#c5a059]" />
            <span>Honoured Guest Place Card</span>
          </div>
          <h3 className="text-2xl font-serif text-[#18232c] mt-1 font-normal">
            Digital Admission Pass
          </h3>
        </div>

        <div className="p-4 rounded-2xl bg-[#ffffff] border border-[#c8d7e3] shadow-sm space-y-3 text-xs relative z-10">
          <div>
            <span className="text-[10px] text-[#506173] uppercase font-serif font-bold tracking-widest block">Guest Name</span>
            <span className="font-serif text-[#18232c] text-xl font-normal">{guest.name}</span>
          </div>

          <div className="text-[#3A5A74] text-xs font-serif italic">
            {config.title}
          </div>

          <div className="flex justify-around py-2.5 border-y border-[#c5a059]/40 my-2">
            <div>
              <span className="text-[10px] text-[#506173] uppercase font-serif font-bold tracking-widest block">Table</span>
              <span className="font-serif text-base text-[#18232c] font-semibold">
                {guest.table || 'Table 1'}
              </span>
            </div>
            <div className="h-8 w-px bg-[#c5a059]/30 self-center"></div>
            <div>
              <span className="text-[10px] text-[#506173] uppercase font-serif font-bold tracking-widest block">Seat</span>
              <span className="font-serif text-base text-[#18232c] font-semibold">
                {guest.seat || 'Seat 1'}
              </span>
            </div>
            <div className="h-8 w-px bg-[#c5a059]/30 self-center"></div>
            <div>
              <span className="text-[10px] text-[#506173] uppercase font-serif font-bold tracking-widest block">Party</span>
              <span className="font-serif text-base text-[#18232c] font-semibold">
                {guest.count || 1}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] text-[#475569] font-serif px-1">
            <span className="text-slate-500 italic">Confirmed Reservation</span>
            <span className="font-mono text-[10px] text-[#3A5A74] font-bold">{passCode}</span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 bg-[#3A5A74] hover:bg-[#274155] text-white text-xs font-serif font-semibold tracking-wider rounded-xl transition shadow-sm border border-[#4D708E] relative z-10"
        >
          Done & Close Place Card
        </button>
      </div>
    </div>
  );
};
