import { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Music } from 'lucide-react';
import { TRACKS } from '../types';
import { motion, AnimatePresence } from 'motion/react';

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => console.error("SIGNAL_STREAMS_INTERRUPTED", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setIsPlaying(true);
  };

  const handlePrev = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setIsPlaying(true);
  };

  return (
    <div id="media-core" className="cyber-border bg-black p-4 w-full max-w-sm flex flex-col gap-4">
      <div className="flex items-center justify-between text-[10px] text-cyan uppercase mb-1">
         <span>Subsys_A: Media_Emitter</span>
         <span className={isPlaying ? "animate-pulse" : ""}>{isPlaying ? "[CONNECTED]" : "[STANDBY]"}</span>
      </div>

      <div className="relative overflow-hidden aspect-square border-2 border-magenta bg-zinc-900 group">
        <AnimatePresence mode="wait">
          <motion.img
            key={currentTrack.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2, ease: "linear" }}
            src={currentTrack.cover}
            alt={currentTrack.title}
            className="w-full h-full object-cover grayscale contrast-150"
            referrerPolicy="no-referrer"
          />
        </AnimatePresence>
        
        <div className="absolute top-2 left-2 bg-magenta text-black px-1 text-[10px] font-bold">
           ID_{currentTrack.id.padStart(4, '0')}
        </div>

        <div className="absolute inset-0 flex flex-col justify-end p-2 bg-gradient-to-t from-cyan/80 to-transparent">
          <h3 className="text-sm font-black text-black leading-none mb-1 glitch-text" data-text={currentTrack.title.toUpperCase()}>
            {currentTrack.title.toUpperCase()}
          </h3>
          <p className="text-[10px] text-black font-bold opacity-80">{currentTrack.artist.toUpperCase()}</p>
        </div>
      </div>

      <audio
        ref={audioRef}
        src={currentTrack.url}
        onEnded={handleNext}
      />

      <div className="flex flex-col gap-2">
        <div className="w-full h-4 bg-zinc-900 border border-cyan/30 flex items-center p-0.5">
          <motion.div 
            className="h-full bg-cyan"
            initial={{ width: '0%' }}
            animate={isPlaying ? { width: '100%' } : {}}
            transition={{ duration: 180, ease: 'linear' }}
          />
        </div>

        <div className="grid grid-cols-3 gap-2">
          <button 
            onClick={handlePrev}
            className="bg-black border border-cyan text-cyan hover:bg-cyan hover:text-black transition-all p-2 text-center text-xs flex items-center justify-center"
            aria-label="Seek back"
          >
            <SkipBack size={16} />
          </button>
          
          <button 
            onClick={handlePlayPause}
            className="bg-magenta text-black border border-magenta hover:bg-black hover:text-magenta transition-all p-2 font-bold text-xs flex items-center justify-center uppercase"
            aria-label={isPlaying ? 'Halt' : 'Execute'}
          >
            {isPlaying ? <Pause size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" />}
          </button>

          <button 
            onClick={handleNext}
            className="bg-black border border-cyan text-cyan hover:bg-cyan hover:text-black transition-all p-2 text-center text-xs flex items-center justify-center"
            aria-label="Seek forward"
          >
            <SkipForward size={16} />
          </button>
        </div>

        <div className="mt-2 pt-2 border-t border-dashed border-white/20 flex items-center justify-between">
           <div className="flex items-center gap-1 text-[8px] text-white/40 font-mono">
              <Music size={10} />
              <span>SOURCE_FILE: MP3_EXT</span>
           </div>
           <div className="flex items-center gap-2">
              <Volume2 size={10} className="text-magenta" />
              <div className="w-12 h-0.5 bg-white/10">
                 <div className="w-3/4 h-full bg-magenta" />
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
