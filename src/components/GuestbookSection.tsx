import React, { useState, useMemo } from 'react';
import { Heart, Send, Check, MessageSquare, Sparkles, User, Users, BookOpen, Lock, Video, Film, Trash2 } from 'lucide-react';
import { EventConfig, GuestbookEntry } from '../types';
import { VideoBlessingRecorder } from './VideoBlessingRecorder';
import { VideoBlessingPlayer } from './VideoBlessingPlayer';
import { deleteVideoFromR2 } from '../utils/r2Client';

interface GuestbookSectionProps {
  config: EventConfig;
  entries: GuestbookEntry[];
  onSubmitEntry: (entry: Omit<GuestbookEntry, 'id'>) => Promise<void> | void;
  onOpenModal?: () => void;
}

export const GuestbookSection: React.FC<GuestbookSectionProps> = ({
  config,
  entries,
  onSubmitEntry,
  onOpenModal
}) => {
  const [name, setName] = useState('');
  const [relationship, setRelationship] = useState('');
  const [message, setMessage] = useState('');
  const [videoUrl, setVideoUrl] = useState<string | undefined>(undefined);
  const [videoDuration, setVideoDuration] = useState<number | undefined>(undefined);
  const [showVideoRecorder, setShowVideoRecorder] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [justPosted, setJustPosted] = useState(false);
  const [filterMode, setFilterMode] = useState<'all' | 'video'>('all');

  // Guarantee unique keys for React rendering
  const uniqueEntries = useMemo(() => {
    const map = new Map<string, GuestbookEntry>();
    for (const item of entries) {
      if (item && item.id) map.set(item.id, item);
    }
    return Array.from(map.values());
  }, [entries]);

  const videoEntriesCount = useMemo(() => {
    return uniqueEntries.filter((e) => Boolean(e.videoUrl)).length;
  }, [uniqueEntries]);

  const displayedEntries = useMemo(() => {
    if (filterMode === 'video') {
      return uniqueEntries.filter((e) => Boolean(e.videoUrl));
    }
    return uniqueEntries;
  }, [uniqueEntries, filterMode]);

  if (config.guestbookEnabled === false) {
    return null;
  }

  const guestbookEyebrow = config.guestbookEyebrow || 'Keepsake Guestbook';
  const guestbookTitle = config.guestbookTitle || 'Wishes & Love';
  const guestbookSubtitle =
    config.guestbookSubtitle ||
    'Leave your blessings, fond memories, and heartfelt congratulations for the newlyweds.';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;

    setIsSubmitting(true);
    try {
      const entryPayload: Omit<GuestbookEntry, 'id'> = {
        name: name.trim(),
        relationship: relationship.trim() || 'Well-Wisher',
        message: message.trim(),
        createdAt: new Date().toISOString(),
        ...(videoUrl && videoUrl.trim() ? { videoUrl: videoUrl.trim() } : {}),
        ...(typeof videoDuration === 'number' && !isNaN(videoDuration) ? { videoDuration } : {}),
      };

      await onSubmitEntry(entryPayload);

      setJustPosted(true);
      setName('');
      setRelationship('');
      setMessage('');
      setVideoUrl(undefined);
      setVideoDuration(undefined);
      setShowVideoRecorder(false);
      setTimeout(() => setJustPosted(false), 4000);
    } catch (err) {
      console.error('Error posting guestbook entry:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="guestbook" className="romantic-stationery-card rounded-3xl p-6 sm:p-12 relative overflow-hidden">
      {/* Delicate Inner Stationery Border */}
      <div className="absolute inset-3 sm:inset-4 border border-[#c5a059]/30 rounded-2xl pointer-events-none" />

      {/* Header Eyebrow & Title */}
      <div className="text-center max-w-xl mx-auto mb-10 relative z-10">
        <div className="inline-flex items-center space-x-2 text-[#3A5A74] text-xs font-serif font-semibold uppercase tracking-[0.25em] mb-1.5">
          <span>❦</span>
          <span>{guestbookEyebrow}</span>
          <span>❦</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-serif text-[#18232c] tracking-wide font-normal">
          {guestbookTitle}
        </h2>
        {guestbookSubtitle && (
          <p className="text-[#475569] font-serif italic text-sm sm:text-base mt-2 leading-relaxed">
            "{guestbookSubtitle}"
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative z-10">
        {/* Left Column: Post Wishes & Love Stationery Form */}
        <div className="lg:col-span-5 bg-[#ffffff] border border-[#c8d7e3] rounded-2xl p-6 sm:p-7 shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b border-[#e2ecf4] pb-3">
            <div className="flex items-center space-x-2 text-[#3A5A74] font-serif font-bold text-xs uppercase tracking-widest">
              <Heart className="w-4 h-4 text-rose-400 fill-rose-100" />
              <span>Sign the Guestbook</span>
            </div>
            <span className="text-[11px] font-serif italic text-[#64748b]">Forever Keepsake</span>
          </div>

          {config.guestbookPostingEnabled === false ? (
            <div className="py-8 text-center space-y-3 bg-[#f7fafc] rounded-xl border border-[#c8d7e3] p-5">
              <div className="w-11 h-11 bg-[#ebf2f7] text-[#3A5A74] rounded-full flex items-center justify-center mx-auto border border-[#c8d7e3] shadow-xs">
                <Lock className="w-5 h-5 text-[#3A5A74]" />
              </div>
              <h4 className="font-serif text-lg text-[#18232c] font-semibold">Guestbook Posting Closed</h4>
              <p className="font-serif italic text-xs text-[#475569] leading-relaxed">
                Guestbook submissions have been closed by the hosts. You are warmly invited to browse all heartfelt blessings and memories posted by loved ones.
              </p>
            </div>
          ) : justPosted ? (
            <div className="py-8 text-center space-y-3 bg-[#f7fafc] rounded-xl border border-emerald-200">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-xs">
                <Check className="w-6 h-6" />
              </div>
              <h4 className="font-serif text-xl text-[#18232c]">Your Blessing Has Been Posted!</h4>
              <p className="font-serif italic text-xs text-[#475569] px-4">
                Thank you for contributing to our wedding memory album. Your words mean the world to us.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-serif font-bold uppercase tracking-wider text-[#3A5A74] mb-1.5 flex items-center space-x-1">
                  <User className="w-3.5 h-3.5 text-[#3A5A74]" />
                  <span>Your Full Name(s) *</span>
                </label>
                <input
                  type="text"
                  id="section-guestbook-name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Jonathan & Grace Miller"
                  className="w-full px-4 py-2.5 rounded-xl border border-[#c8d7e3] bg-[#fbfdfd] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#3A5A74] font-serif text-sm text-[#18232c] placeholder:text-[#94a3b8] transition"
                />
              </div>

              <div>
                <label className="block text-xs font-serif font-bold uppercase tracking-wider text-[#3A5A74] mb-1.5 flex items-center space-x-1">
                  <Users className="w-3.5 h-3.5 text-[#3A5A74]" />
                  <span>Connection or From (Optional)</span>
                </label>
                <input
                  type="text"
                  id="section-guestbook-relationship"
                  value={relationship}
                  onChange={(e) => setRelationship(e.target.value)}
                  placeholder="e.g. Childhood Friend, Aunt & Uncle, Newport"
                  className="w-full px-4 py-2.5 rounded-xl border border-[#c8d7e3] bg-[#fbfdfd] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#3A5A74] font-serif text-sm text-[#18232c] placeholder:text-[#94a3b8] transition"
                />
              </div>

              <div>
                <label className="block text-xs font-serif font-bold uppercase tracking-wider text-[#3A5A74] mb-1.5 flex items-center justify-between">
                  <span className="flex items-center space-x-1">
                    <Heart className="w-3.5 h-3.5 text-rose-400" />
                    <span>Your Wishes & Love *</span>
                  </span>
                  <span className="text-[11px] text-[#94a3b8] font-mono">{message.length} chars</span>
                </label>
                <textarea
                  id="section-guestbook-message"
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Share your warmest prayers, loving advice, or unforgettable memories..."
                  className="w-full px-4 py-2.5 rounded-xl border border-[#c8d7e3] bg-[#fbfdfd] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#3A5A74] font-serif text-sm text-[#18232c] placeholder:text-[#94a3b8] leading-relaxed resize-none transition"
                />
              </div>

              {/* Video Blessing Section */}
              <div>
                {!showVideoRecorder && !videoUrl && (
                  <button
                    type="button"
                    id="section-btn-attach-video"
                    onClick={() => setShowVideoRecorder(true)}
                    className="w-full py-2 px-3.5 rounded-xl border border-dashed border-[#3A5A74]/40 bg-[#f4f8fb] hover:bg-[#e9f2f8] text-[#3A5A74] transition flex items-center justify-between text-xs font-serif font-semibold group shadow-2xs"
                  >
                    <div className="flex items-center space-x-2">
                      <div className="w-5 h-5 rounded-md bg-[#3A5A74] text-white flex items-center justify-center">
                        <Video className="w-3 h-3 text-sky-200" />
                      </div>
                      <span>Add a Video Blessing (Cloudflare R2)</span>
                    </div>
                    <span className="text-[11px] text-[#475569] group-hover:text-[#18232c] underline">
                      + Video
                    </span>
                  </button>
                )}

                {showVideoRecorder && !videoUrl && (
                  <VideoBlessingRecorder
                    onVideoAttached={(url, dur) => {
                      setVideoUrl(url);
                      setVideoDuration(dur);
                      setShowVideoRecorder(false);
                    }}
                    onCancel={() => setShowVideoRecorder(false)}
                  />
                )}

                {videoUrl && (
                  <div className="p-2.5 bg-[#eef6fa] border border-[#b8d5e8] rounded-xl flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-7 h-7 rounded-lg bg-[#3A5A74] text-white flex items-center justify-center">
                        <Film className="w-3.5 h-3.5 text-sky-200" />
                      </div>
                      <div>
                        <span className="text-xs font-serif font-bold text-[#18232c] block">
                          Video Blessing Attached
                        </span>
                        <span className="text-[10px] font-serif text-[#475569]">
                          Stored on Cloudflare R2
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        type="button"
                        onClick={() => {
                          if (videoUrl) {
                            deleteVideoFromR2(videoUrl).catch(() => {});
                          }
                          setShowVideoRecorder(true);
                          setVideoUrl(undefined);
                        }}
                        className="text-xs font-serif text-[#3A5A74] hover:underline"
                      >
                        Change
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (videoUrl) {
                            deleteVideoFromR2(videoUrl).catch(() => {});
                          }
                          setVideoUrl(undefined);
                          setVideoDuration(undefined);
                        }}
                        className="p-1 rounded-lg text-rose-500 hover:bg-rose-50 transition"
                        title="Remove video"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <button
                type="submit"
                id="section-guestbook-submit-btn"
                disabled={isSubmitting || !name.trim() || !message.trim()}
                className="w-full py-3 bg-[#3A5A74] hover:bg-[#274155] disabled:opacity-50 text-white rounded-xl text-xs font-serif font-semibold tracking-wider transition shadow-sm flex items-center justify-center space-x-2 border border-[#4D708E]"
              >
                <Heart className="w-4 h-4 text-rose-300" />
                <span>{isSubmitting ? 'Posting Blessing...' : 'Post Wishes & Love'}</span>
                <Send className="w-3.5 h-3.5 text-sky-200" />
              </button>
            </form>
          )}

          {onOpenModal && (
            <div className="pt-2 border-t border-[#e2ecf4] text-center">
              <button
                type="button"
                id="open-full-guestbook-dialog-btn"
                onClick={onOpenModal}
                className="text-xs font-serif text-[#3A5A74] hover:text-[#274155] underline transition inline-flex items-center space-x-1.5"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Open Expanded Guestbook Modal</span>
              </button>
            </div>
          )}
        </div>

        {/* Right Column: Beautiful Keepsake Wishes Feed */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex flex-wrap items-center justify-between pb-2 border-b border-[#c8d7e3]/60 gap-2">
            <div className="flex items-center space-x-2">
              <MessageSquare className="w-4 h-4 text-[#3A5A74]" />
              <span className="font-serif font-bold text-sm text-[#18232c] tracking-wide">
                Heartfelt Messages & Video Blessings
              </span>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center space-x-1.5">
              <button
                type="button"
                onClick={() => setFilterMode('all')}
                className={`px-2.5 py-1 rounded-full text-xs font-serif font-semibold transition border ${
                  filterMode === 'all'
                    ? 'bg-[#3A5A74] text-white border-[#274155]'
                    : 'bg-white text-[#475569] border-[#c8d7e3] hover:bg-[#ebf2f7]'
                }`}
              >
                All ({uniqueEntries.length})
              </button>
              <button
                type="button"
                onClick={() => setFilterMode('video')}
                className={`px-2.5 py-1 rounded-full text-xs font-serif font-semibold transition border flex items-center space-x-1 ${
                  filterMode === 'video'
                    ? 'bg-[#3A5A74] text-white border-[#274155]'
                    : 'bg-white text-[#475569] border-[#c8d7e3] hover:bg-[#ebf2f7]'
                }`}
              >
                <Film className="w-3 h-3 text-sky-400" />
                <span>Videos ({videoEntriesCount})</span>
              </button>
            </div>
          </div>

          <div className="space-y-4 max-h-[580px] overflow-y-auto pr-1">
            {displayedEntries.length === 0 ? (
              <div className="p-8 text-center bg-white/80 rounded-2xl border border-dashed border-[#c8d7e3] space-y-2">
                <p className="font-serif italic text-sm text-[#64748b]">
                  {filterMode === 'video'
                    ? 'No video blessings recorded yet. Be the first to record a video wish!'
                    : 'Be the first cherished guest to sign our wedding guestbook!'}
                </p>
                {filterMode === 'video' && (
                  <button
                    type="button"
                    onClick={() => {
                      setShowVideoRecorder(true);
                    }}
                    className="mt-2 inline-flex items-center space-x-1.5 px-4 py-1.5 bg-[#3A5A74] text-white rounded-xl text-xs font-serif font-semibold"
                  >
                    <Video className="w-3.5 h-3.5" />
                    <span>Record Video Blessing</span>
                  </button>
                )}
              </div>
            ) : (
              displayedEntries.map((item) => (
                <div
                  key={item.id}
                  className="p-5 bg-[#ffffff] rounded-2xl border border-[#c8d7e3] shadow-xs hover:border-[#3A5A74]/50 transition space-y-2 relative"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-[#3A5A74] text-xs">❦</span>
                      <span className="font-serif font-bold text-sm text-[#18232c]">
                        {item.name}
                      </span>
                      {item.relationship && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-serif font-semibold bg-[#ebf2f7] text-[#3A5A74] border border-[#c8d7e3]">
                          {item.relationship}
                        </span>
                      )}
                      {item.videoUrl && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-serif font-semibold bg-sky-50 text-sky-800 border border-sky-200 flex items-center space-x-1">
                          <Film className="w-2.5 h-2.5 text-sky-600" />
                          <span>Video Blessing</span>
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] font-serif text-[#64748b]">
                      {item.createdAt
                        ? new Date(item.createdAt).toLocaleDateString(undefined, {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })
                        : ''}
                    </span>
                  </div>

                  <p className="font-serif text-[#334155] text-xs sm:text-sm leading-relaxed whitespace-pre-line italic pl-3 border-l-2 border-[#3A5A74]/25">
                    "{item.message}"
                  </p>

                  {/* Video Blessing Player if videoUrl exists */}
                  {item.videoUrl && (
                    <VideoBlessingPlayer
                      videoUrl={item.videoUrl}
                      authorName={item.name}
                      relationship={item.relationship}
                      duration={item.videoDuration}
                    />
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
