import React, { useState } from 'react';
import { Play, Pause, Volume2, VolumeX, Music } from 'lucide-react';

interface AudioPlayerDockProps {
  isPlaying: boolean;
  onTogglePlay: () => void;
  volume: number;
  onVolumeChange: (newVol: number) => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

export const AudioPlayerDock: React.FC<AudioPlayerDockProps> = ({
  isPlaying,
  onTogglePlay,
  volume,
  onVolumeChange,
  isMuted,
  onToggleMute
}) => {
  const [isVolumeOpen, setIsVolumeOpen] = useState(false);

  return (
    <div
      className="fixed bottom-4 left-4 z-40 group bg-[#ffffff]/95 backdrop-blur-md px-2 py-1.5 rounded-full shadow-[0_6px_24px_rgba(58,90,116,0.18)] border border-[#c8d7e3] flex items-center space-x-2 text-xs transition-all duration-300 hover:shadow-[0_8px_30px_rgba(58,90,116,0.25)]"
      title="Wedding Background Music Player"
    >
      {/* Play / Pause Toggle Button */}
      <button
        id="audio-dock-play-pause-btn"
        onClick={onTogglePlay}
        className="w-7 h-7 sm:w-7.5 sm:h-7.5 rounded-full bg-[#3A5A74] hover:bg-[#274155] text-white flex items-center justify-center shadow-xs transition hover:scale-105 cursor-pointer shrink-0"
        title={isPlaying ? 'Pause Classical Music' : 'Play Classical Music'}
        aria-label={isPlaying ? 'Pause Audio' : 'Play Audio'}
      >
        {isPlaying ? (
          <Pause className="w-3.5 h-3.5" />
        ) : (
          <Play className="w-3.5 h-3.5 ml-0.5 fill-current" />
        )}
      </button>

      {/* Discrete Animated Equalizer Waves */}
      <div
        className="flex items-center space-x-0.5 h-3.5 px-0.5 cursor-pointer select-none"
        onClick={onTogglePlay}
        title={isPlaying ? 'Music playing' : 'Music paused'}
      >
        <div
          className={`w-0.5 rounded-full bg-[#c5a059] transition-all duration-300 ${
            isPlaying ? 'equalizer-bar' : 'h-1.5 opacity-40'
          }`}
          style={{ maxHeight: '14px' }}
        />
        <div
          className={`w-0.5 rounded-full bg-[#3A5A74] transition-all duration-300 ${
            isPlaying ? 'equalizer-bar' : 'h-2.5 opacity-60'
          }`}
          style={{ maxHeight: '14px' }}
        />
        <div
          className={`w-0.5 rounded-full bg-[#c5a059] transition-all duration-300 ${
            isPlaying ? 'equalizer-bar' : 'h-1 opacity-40'
          }`}
          style={{ maxHeight: '14px' }}
        />
      </div>

      {/* Volume Icon Button & Expandable Slider */}
      <div className="flex items-center pl-1 border-l border-[#c8d7e3]/70">
        <button
          onClick={() => {
            if (isMuted) {
              onToggleMute();
            } else {
              setIsVolumeOpen((prev) => !prev);
            }
          }}
          className="p-1 text-[#3A5A74] hover:text-[#274155] transition rounded-full hover:bg-[#ebf2f7]"
          title={isMuted || volume === 0 ? 'Unmute' : isVolumeOpen ? 'Hide volume slider' : 'Adjust volume'}
          aria-label="Volume settings"
        >
          {isMuted || volume === 0 ? (
            <VolumeX className="w-3.5 h-3.5 text-rose-500/80" />
          ) : (
            <Volume2 className="w-3.5 h-3.5" />
          )}
        </button>

        {/* Expandable Slider on Hover or Tap */}
        <div
          className={`transition-all duration-300 ease-out overflow-hidden flex items-center ${
            isVolumeOpen
              ? 'max-w-[76px] opacity-100 ml-1'
              : 'max-w-0 opacity-0 group-hover:max-w-[76px] group-hover:opacity-100 group-hover:ml-1'
          }`}
        >
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={isMuted ? 0 : volume}
            onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
            className="w-16 h-1 bg-[#c8d7e3] rounded-lg appearance-none cursor-pointer accent-[#3A5A74]"
            title="Adjust volume level"
          />
        </div>
      </div>
    </div>
  );
};
