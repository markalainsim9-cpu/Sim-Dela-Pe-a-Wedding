import React from 'react';
import { TimelineItem } from '../types';

interface ScheduleSectionProps {
  timeline: TimelineItem[];
}

export const ScheduleSection: React.FC<ScheduleSectionProps> = ({ timeline }) => {
  return (
    <section id="schedule" className="romantic-stationery-card rounded-3xl p-6 sm:p-12 relative overflow-hidden">
      {/* Delicate Inner Stationery Border */}
      <div className="absolute inset-3 sm:inset-4 border border-[#c5a059]/30 rounded-2xl pointer-events-none"></div>

      <div className="text-center max-w-xl mx-auto mb-10 relative z-10">
        <div className="inline-flex items-center space-x-2 text-[#3A5A74] text-xs font-serif font-semibold uppercase tracking-[0.25em] mb-1.5">
          <span>❦</span>
          <span>Order of the Day</span>
          <span>❦</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-serif text-[#18232c] tracking-wide font-normal">
          Schedule of Celebrations
        </h2>
        <p className="text-[#475569] font-serif italic text-sm sm:text-base mt-2">
          "A timeline of vows, joyous toasts, and dancing under the starlit canopy."
        </p>
      </div>

      <div className="max-w-2xl mx-auto relative border-l border-[#c5a059]/50 ml-4 sm:ml-auto space-y-9 pl-6 sm:pl-9 relative z-10">
        {timeline.map((item) => (
          <div key={item.id} className="relative group">
            <div className="absolute -left-[31px] sm:-left-[43px] top-1 w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-[#3A5A74] ring-4 ring-[#ffffff] shadow-sm transition-transform group-hover:scale-125 border border-sky-200"></div>
            <div className="font-serif font-bold text-xs uppercase text-[#506173] tracking-widest">
              {item.time}
            </div>
            <h3 className="text-xl font-serif text-[#18232c] mt-0.5 font-normal">
              {item.title}
            </h3>
            <p className="text-sm text-[#475569] font-normal mt-1 leading-relaxed font-serif">
              {item.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};
