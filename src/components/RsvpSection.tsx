import React, { useState } from 'react';
import { Send, HeartHandshake, CheckCircle2, MessageSquare } from 'lucide-react';
import { EventConfig, Guest } from '../types';

interface RsvpSectionProps {
  config: EventConfig;
  onSubmitRsvp: (guestData: Omit<Guest, 'id' | 'createdAt'>) => void;
}

export const RsvpSection: React.FC<RsvpSectionProps> = ({ config, onSubmitRsvp }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [attending, setAttending] = useState<'yes' | 'no'>('yes');
  const [count, setCount] = useState<number>(1);
  const [note, setNote] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    onSubmitRsvp({
      name: name.trim(),
      email: email.trim(),
      attending,
      count: attending === 'yes' ? count : 0,
      song: '',
      note: note.trim(),
      table: '',
      seat: ''
    });

    setSubmitted(true);
  };

  return (
    <section id="rsvp" className="romantic-stationery-card rounded-3xl p-6 sm:p-12 relative overflow-hidden">
      {/* Delicate Inner Stationery Border */}
      <div className="absolute inset-3 sm:inset-4 border border-[#c5a059]/30 rounded-2xl pointer-events-none"></div>

      <div className="text-center max-w-xl mx-auto mb-8 relative z-10">
        <div className="inline-flex items-center space-x-2 text-[#3A5A74] text-xs font-serif font-semibold uppercase tracking-[0.25em] mb-1.5">
          <span>❦</span>
          <span>The Favor of Your Reply</span>
          <span>❦</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-serif text-[#18232c] tracking-wide font-normal">
          Formal Reply Card
        </h2>
        <p className="text-[#475569] font-serif italic text-sm sm:text-base mt-2">
          Kindly respond on or before{' '}
          <span className="font-semibold text-[#3A5A74] not-italic underline decoration-[#c5a059]">
            {config.deadline}
          </span>
        </p>
      </div>

      {submitted ? (
        <div className="p-8 max-w-lg mx-auto text-center space-y-4 bg-[#ffffff] rounded-3xl border border-[#c8d7e3] shadow-lg animate-in fade-in zoom-in-95 relative z-10">
          <div className="w-14 h-14 rounded-full bg-[#ebf2f7] text-[#3A5A74] flex items-center justify-center mx-auto text-2xl border border-[#c5a059]/50 shadow-sm">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h3 className="text-2xl font-serif text-[#18232c] font-normal">
            Thank You, {name}
          </h3>
          <p className="text-xs sm:text-sm text-[#475569] font-serif leading-relaxed">
            {attending === 'yes'
              ? 'Your response has been warmly received and your seat reservation is registered. We look forward to celebrating with you!'
              : 'Thank you for letting us know. You will be held dearly in our hearts.'}
          </p>
          <button
            onClick={() => setSubmitted(false)}
            className="px-6 py-2.5 bg-[#3A5A74] hover:bg-[#274155] text-white rounded-xl text-xs font-serif font-semibold transition border border-[#4D708E]"
          >
            Submit Another RSVP
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6 relative z-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-serif font-bold uppercase tracking-wider text-[#18232c] mb-1">
                Full Name *
              </label>
              <input
                id="rsvp-name-input"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Emily Watson"
                className="w-full px-4 py-3 rounded-2xl bg-[#ffffff] border border-[#c8d7e3] text-xs sm:text-sm outline-none focus:ring-2 focus:ring-[#3A5A74]/20 focus:border-[#3A5A74] text-[#18232c] font-medium placeholder-slate-400 transition"
              />
            </div>
            <div>
              <label className="block text-xs font-serif font-bold uppercase tracking-wider text-[#18232c] mb-1">
                Email Address *
              </label>
              <input
                id="rsvp-email-input"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="emily@example.com"
                className="w-full px-4 py-3 rounded-2xl bg-[#ffffff] border border-[#c8d7e3] text-xs sm:text-sm outline-none focus:ring-2 focus:ring-[#3A5A74]/20 focus:border-[#3A5A74] text-[#18232c] font-medium placeholder-slate-400 transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-serif font-bold uppercase tracking-wider text-[#18232c] mb-2">
              Will you attend? *
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label
                className={`flex items-center justify-center p-3.5 rounded-2xl border cursor-pointer transition font-serif ${
                  attending === 'yes'
                    ? 'border-[#3A5A74] bg-[#ebf2f7] text-[#3A5A74] font-semibold shadow-sm'
                    : 'border-[#c8d7e3] bg-[#ffffff] text-[#475569] hover:bg-[#ebf2f7]'
                }`}
              >
                <input
                  type="radio"
                  name="attending"
                  value="yes"
                  checked={attending === 'yes'}
                  onChange={() => setAttending('yes')}
                  className="hidden"
                />
                <span className="text-xs sm:text-sm">Joyfully Accepts ❦</span>
              </label>
              <label
                className={`flex items-center justify-center p-3.5 rounded-2xl border cursor-pointer transition font-serif ${
                  attending === 'no'
                    ? 'border-[#3A5A74] bg-[#ebf2f7] text-[#3A5A74] font-semibold shadow-sm'
                    : 'border-[#c8d7e3] bg-[#ffffff] text-[#475569] hover:bg-[#ebf2f7]'
                }`}
              >
                <input
                  type="radio"
                  name="attending"
                  value="no"
                  checked={attending === 'no'}
                  onChange={() => setAttending('no')}
                  className="hidden"
                />
                <span className="text-xs sm:text-sm">Regretfully Declines</span>
              </label>
            </div>
          </div>

          {attending === 'yes' && (
            <div className="space-y-4 animate-in fade-in">
              <div>
                <label className="block text-xs font-serif font-bold uppercase tracking-wider text-[#18232c] mb-1">
                  Number of Guests
                </label>
                <select
                  id="rsvp-guest-count"
                  value={count}
                  onChange={(e) => setCount(parseInt(e.target.value, 10))}
                  className="w-full px-4 py-3 rounded-2xl bg-[#ffffff] border border-[#c8d7e3] text-xs sm:text-sm outline-none focus:ring-2 focus:ring-[#3A5A74]/20 focus:border-[#3A5A74] text-[#18232c] font-medium"
                >
                  <option value={1}>1 Guest (Myself)</option>
                  <option value={2}>2 Guests (+1 Plus One)</option>
                  <option value={3}>3 Guests</option>
                  <option value={4}>4 Guests</option>
                </select>
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-serif font-bold uppercase tracking-wider text-[#18232c] mb-1">
              Warm Wishes or Dietary Notes
            </label>
            <div className="relative">
              <textarea
                id="rsvp-message-input"
                rows={3}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Share your heartfelt blessing or dietary requirements..."
                className="w-full pl-10 pr-4 py-3 rounded-2xl bg-[#ffffff] border border-[#c8d7e3] text-xs sm:text-sm outline-none focus:ring-2 focus:ring-[#3A5A74]/20 focus:border-[#3A5A74] text-[#18232c] font-medium placeholder-slate-400 transition"
              />
              <MessageSquare className="w-4 h-4 text-[#3A5A74] absolute left-3.5 top-3.5" />
            </div>
          </div>

          <button
            id="rsvp-submit-btn"
            type="submit"
            className="w-full py-4 bg-[#3A5A74] hover:bg-[#274155] text-white font-serif font-semibold text-sm tracking-widest uppercase rounded-2xl shadow-md transition transform active:scale-98 border border-[#4D708E]"
          >
            Send Formal Response
          </button>
        </form>
      )}
    </section>
  );
};
