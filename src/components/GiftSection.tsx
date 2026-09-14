import React, { useState } from 'react';
import { Gift, QrCode, Copy, Check, ExternalLink, Download, Heart, Smartphone, ChevronLeft, ChevronRight, CreditCard, Sparkles } from 'lucide-react';
import { EventConfig, getNormalizedGiftQrList, GiftQrItem } from '../types';

interface GiftSectionProps {
  config: EventConfig;
  onOpenModal?: () => void;
}

export const GiftSection: React.FC<GiftSectionProps> = ({ config }) => {
  const [copied, setCopied] = useState(false);
  const [isQrZoomed, setIsQrZoomed] = useState(false);
  const [selectedQrIndex, setSelectedQrIndex] = useState(0);

  // If gift registry is explicitly disabled, do not render
  if (config.giftEnabled === false) {
    return null;
  }

  const giftEyebrow = config.giftEyebrow || 'Wedding Registry & Blessings';
  const giftTitle = config.giftTitle || 'Monetary Gift & Blessings';
  const giftSubtitle =
    config.giftSubtitle ||
    'Your love, presence, and prayers on our special day are the greatest gifts of all. Should you wish to honor us with a gift, a monetary blessing is warmly appreciated.';

  const qrList: GiftQrItem[] = getNormalizedGiftQrList(config);
  const safeIndex = Math.min(Math.max(0, selectedQrIndex), qrList.length - 1);
  const activeQr = qrList[safeIndex] || qrList[0];

  const bankName = activeQr.bankName || 'GCash / Bank Transfer';
  const accountName = activeQr.accountName || 'Mark Alain Sim & Karla';
  const accountNumber = activeQr.accountNumber || '0917-888-2027';
  const qrImage =
    activeQr.qrImage ||
    'https://images.unsplash.com/photo-1595079672139-545c60e557b7?auto=format&fit=crop&w=600&q=80';
  const notes =
    activeQr.notes ||
    config.giftNotes ||
    'Kindly include your name in the payment reference or message so we can express our deepest gratitude!';

  const handleCopyAccountNumber = () => {
    if (accountNumber && navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(accountNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleDownloadQr = () => {
    if (!qrImage) return;
    const link = document.createElement('a');
    link.href = qrImage;
    link.download = `Wedding-Gift-QR-${bankName.replace(/\s+/g, '-')}-${accountName.replace(/\s+/g, '-')}.png`;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section id="gift" className="romantic-stationery-card rounded-3xl p-6 sm:p-12 relative overflow-hidden">
      {/* Delicate Inner Stationery Border */}
      <div className="absolute inset-3 sm:inset-4 border border-[#c5a059]/30 rounded-2xl pointer-events-none"></div>

      {/* Header Eyebrow & Title */}
      <div className="text-center max-w-xl mx-auto mb-8 relative z-10">
        <div className="inline-flex items-center space-x-2 text-[#3A5A74] text-xs font-serif font-semibold uppercase tracking-[0.25em] mb-1.5">
          <span>❦</span>
          <span>{giftEyebrow}</span>
          <span>❦</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-serif text-[#18232c] tracking-wide font-normal flex items-center justify-center gap-2.5">
          <Gift className="w-6 h-6 sm:w-7 sm:h-7 text-[#3A5A74] shrink-0" />
          <span>{giftTitle}</span>
        </h2>
        {giftSubtitle && (
          <p className="text-[#475569] font-serif italic text-sm sm:text-base mt-2.5 leading-relaxed">
            "{giftSubtitle}"
          </p>
        )}
      </div>

      {/* Multiple QR Provider Switcher Tabs (Rendered when 2 or more QRs are available) */}
      {qrList.length > 1 && (
        <div className="relative z-10 max-w-2xl mx-auto mb-8">
          <div className="text-center mb-2.5">
            <span className="text-xs font-serif font-semibold text-[#3A5A74] uppercase tracking-wider inline-flex items-center gap-1.5">
              <CreditCard className="w-3.5 h-3.5" />
              <span>Select Payment Channel ({qrList.length} Options Available)</span>
            </span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2 p-1.5 bg-[#f0f4f8] rounded-2xl border border-[#c8d7e3]/80">
            {qrList.map((qr, idx) => {
              const isActive = idx === safeIndex;
              return (
                <button
                  key={qr.id || `qr-tab-${idx}`}
                  type="button"
                  id={`gift-tab-btn-${idx}`}
                  onClick={() => {
                    setSelectedQrIndex(idx);
                    setCopied(false);
                  }}
                  className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-serif font-semibold transition-all duration-200 flex items-center space-x-2 cursor-pointer ${
                    isActive
                      ? 'bg-[#3A5A74] text-white shadow-md scale-[1.02] border border-[#274155]'
                      : 'bg-white/80 text-[#475569] hover:bg-white hover:text-[#18232c] border border-transparent'
                  }`}
                >
                  <Smartphone className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-[#3A5A74]'}`} />
                  <span className="truncate max-w-[130px] sm:max-w-[180px]">{qr.bankName || `QR Option ${idx + 1}`}</span>
                  {isActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse ml-0.5"></span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Main Content Grid: QR Display Card + Account Details */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center relative z-10 max-w-3xl mx-auto">
        {/* Left Column: QR Code Showcase Card */}
        <div className="md:col-span-6 flex flex-col items-center">
          <div className="relative group p-4 sm:p-5 bg-white rounded-2xl border-2 border-[#c8d7e3] shadow-md hover:shadow-lg transition duration-300 max-w-xs w-full text-center">
            {/* Corner Decorative Accents for QR Scanner Look */}
            <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-[#3A5A74] rounded-tl pointer-events-none"></div>
            <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-[#3A5A74] rounded-tr pointer-events-none"></div>
            <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-[#3A5A74] rounded-bl pointer-events-none"></div>
            <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-[#3A5A74] rounded-br pointer-events-none"></div>

            {/* Provider Pill & Multiple QR navigation buttons if multiple */}
            <div className="flex items-center justify-between mb-3 px-1">
              {qrList.length > 1 ? (
                <button
                  type="button"
                  id="gift-prev-qr-btn"
                  onClick={() => setSelectedQrIndex((prev) => (prev > 0 ? prev - 1 : qrList.length - 1))}
                  className="w-6 h-6 rounded-full bg-[#ebf2f7] hover:bg-[#dbe7f0] text-[#3A5A74] flex items-center justify-center transition border border-[#c8d7e3] cursor-pointer"
                  title="Previous QR Code"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
              ) : <div className="w-6"></div>}

              <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-serif font-semibold bg-[#ebf2f7] text-[#3A5A74] border border-[#c8d7e3]">
                <Smartphone className="w-3.5 h-3.5 text-[#3A5A74]" />
                <span className="truncate max-w-[140px]">{bankName}</span>
              </div>

              {qrList.length > 1 ? (
                <button
                  type="button"
                  id="gift-next-qr-btn"
                  onClick={() => setSelectedQrIndex((prev) => (prev < qrList.length - 1 ? prev + 1 : 0))}
                  className="w-6 h-6 rounded-full bg-[#ebf2f7] hover:bg-[#dbe7f0] text-[#3A5A74] flex items-center justify-center transition border border-[#c8d7e3] cursor-pointer"
                  title="Next QR Code"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              ) : <div className="w-6"></div>}
            </div>

            {/* QR Image Frame */}
            <div className="relative bg-white rounded-xl p-2 border border-slate-200 overflow-hidden shadow-inner aspect-square flex items-center justify-center">
              <img
                src={qrImage}
                alt={`Gift QR Code - ${bankName}`}
                className="w-full h-full object-contain rounded-lg transition group-hover:scale-[1.02] cursor-pointer"
                onClick={() => setIsQrZoomed(true)}
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src =
                    'https://images.unsplash.com/photo-1595079672139-545c60e557b7?auto=format&fit=crop&w=600&q=80';
                }}
              />
            </div>

            {qrList.length > 1 && (
              <p className="text-[10px] font-serif text-[#3A5A74] font-semibold mt-1.5 tracking-wider uppercase">
                Channel {safeIndex + 1} of {qrList.length}
              </p>
            )}

            <p className="text-[11px] font-serif text-[#506173] mt-1.5 flex items-center justify-center gap-1">
              <QrCode className="w-3.5 h-3.5 text-[#3A5A74]" />
              <span>Point phone camera or banking app to scan</span>
            </p>

            {/* Quick Actions */}
            <div className="flex items-center justify-center gap-2 mt-3 pt-2.5 border-t border-[#e2ecf4]">
              <button
                type="button"
                id="gift-enlarge-btn"
                onClick={() => setIsQrZoomed(true)}
                className="px-2.5 py-1 text-[11px] font-serif font-semibold bg-[#ebf2f7] hover:bg-[#dbe7f0] text-[#3A5A74] rounded-lg transition border border-[#c8d7e3] flex items-center gap-1 cursor-pointer"
                title="Enlarge QR Code"
              >
                <ExternalLink className="w-3 h-3" />
                <span>Enlarge</span>
              </button>

              <button
                type="button"
                id="gift-download-btn"
                onClick={handleDownloadQr}
                className="px-2.5 py-1 text-[11px] font-serif font-semibold bg-[#ebf2f7] hover:bg-[#dbe7f0] text-[#3A5A74] rounded-lg transition border border-[#c8d7e3] flex items-center gap-1 cursor-pointer"
                title="Download QR Code"
              >
                <Download className="w-3 h-3" />
                <span>Save Image</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Account & Registry Information */}
        <div className="md:col-span-6 space-y-4">
          <div className="p-5 sm:p-6 bg-white rounded-2xl border border-[#c8d7e3] shadow-sm space-y-4">
            {/* Account Details Header */}
            <div className="flex items-center justify-between border-b border-[#e2ecf4] pb-3">
              <span className="text-xs font-serif font-bold uppercase tracking-wider text-[#3A5A74] flex items-center gap-1.5">
                <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500/30" />
                <span>Account Information</span>
              </span>
              <span className="text-[11px] font-sans font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                Verified
              </span>
            </div>

            {/* Bank / Provider Name */}
            <div>
              <span className="text-[11px] font-serif uppercase tracking-wider text-[#506173] block mb-0.5">
                Bank / E-Wallet Provider
              </span>
              <p className="font-serif font-bold text-base text-[#18232c]">{bankName}</p>
            </div>

            {/* Account Holder Name */}
            <div>
              <span className="text-[11px] font-serif uppercase tracking-wider text-[#506173] block mb-0.5">
                Account Name
              </span>
              <p className="font-serif font-semibold text-sm sm:text-base text-[#18232c]">{accountName}</p>
            </div>

            {/* Account Number with 1-Click Copy */}
            <div className="p-3 bg-[#f8fafc] rounded-xl border border-[#c8d7e3] flex items-center justify-between gap-3">
              <div>
                <span className="text-[10px] font-serif uppercase tracking-wider text-[#506173] block">
                  Account / Mobile Number
                </span>
                <span className="font-mono font-bold text-sm sm:text-base text-[#3A5A74] tracking-wider select-all">
                  {accountNumber}
                </span>
              </div>
              <button
                type="button"
                id="gift-copy-account-btn"
                onClick={handleCopyAccountNumber}
                className={`px-3 py-1.5 rounded-lg text-xs font-serif font-semibold flex items-center space-x-1.5 transition shadow-xs cursor-pointer ${
                  copied
                    ? 'bg-emerald-600 text-white border border-emerald-700'
                    : 'bg-[#3A5A74] hover:bg-[#274155] text-white border border-[#274155]'
                }`}
                title="Copy account number to clipboard"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>

            {/* Couple's Note */}
            {notes && (
              <div className="p-3 bg-[#ebf2f7]/70 rounded-xl border border-[#c8d7e3]/80 text-xs font-serif text-[#475569] leading-relaxed">
                <span className="font-semibold text-[#18232c] block mb-0.5">Note from the Couple:</span>
                {notes}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Lightbox / Zoom Modal */}
      {isQrZoomed && (
        <div
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setIsQrZoomed(false)}
        >
          <div
            className="bg-white rounded-3xl p-6 max-w-sm w-full text-center space-y-4 shadow-2xl border border-[#c8d7e3]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-2 border-b border-[#e2ecf4]">
              <div className="text-left">
                <h3 className="font-serif font-bold text-base text-[#18232c]">{bankName} QR Code</h3>
                <p className="text-xs text-[#506173] font-serif">{accountName}</p>
              </div>
              <button
                type="button"
                onClick={() => setIsQrZoomed(false)}
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center text-sm font-bold"
              >
                ✕
              </button>
            </div>

            {/* Lightbox multiple selector */}
            {qrList.length > 1 && (
              <div className="flex items-center justify-center gap-1.5 flex-wrap">
                {qrList.map((qr, idx) => (
                  <button
                    key={`zoom-tab-${idx}`}
                    type="button"
                    onClick={() => {
                      setSelectedQrIndex(idx);
                      setCopied(false);
                    }}
                    className={`px-2.5 py-1 text-xs font-serif rounded-lg border transition ${
                      idx === safeIndex
                        ? 'bg-[#3A5A74] text-white border-[#274155]'
                        : 'bg-slate-50 text-slate-600 border-slate-200'
                    }`}
                  >
                    {qr.bankName || `Option ${idx + 1}`}
                  </button>
                ))}
              </div>
            )}

            <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-inner">
              <img
                src={qrImage}
                alt="QR Code"
                className="w-full h-auto object-contain rounded-xl max-h-[340px] mx-auto"
              />
            </div>

            <div className="p-2.5 bg-[#f8fafc] rounded-xl border border-[#c8d7e3] text-xs font-mono font-bold text-[#3A5A74]">
              {accountNumber}
            </div>

            <div className="flex items-center justify-center gap-2 pt-1">
              <button
                type="button"
                onClick={handleCopyAccountNumber}
                className="px-4 py-2 bg-[#3A5A74] hover:bg-[#274155] text-white rounded-xl text-xs font-serif font-semibold flex items-center gap-1.5 shadow-sm"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied!' : 'Copy Number'}</span>
              </button>
              <button
                type="button"
                onClick={handleDownloadQr}
                className="px-4 py-2 bg-[#ebf2f7] hover:bg-[#dbe7f0] text-[#3A5A74] rounded-xl text-xs font-serif font-semibold flex items-center gap-1.5 border border-[#c8d7e3]"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Save Image</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
