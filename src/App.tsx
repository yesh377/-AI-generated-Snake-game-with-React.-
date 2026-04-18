import { Gamepad2, Headphones, Activity, AlertTriangle, Cpu } from 'lucide-react';
import MusicPlayer from './components/MusicPlayer';
import SnakeGame from './components/SnakeGame';
import { motion } from 'motion/react';

export default function App() {
  return (
    <div className="min-h-screen relative flex flex-col items-center justify-center p-4 md:p-8 overflow-hidden bg-black text-white">
      {/* Background Overlays */}
      <div className="noise-overlay" />
      <div className="scanline" />

      {/* Header Overlay */}
      <motion.header 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed top-0 left-0 w-full p-4 flex items-center justify-between z-40 bg-black/60 border-b-2 border-magenta"
      >
        <div className="flex items-center gap-4">
          <div className="bg-magenta p-1">
            <Cpu size={20} className="text-black" />
          </div>
          <h1 className="text-lg font-black tracking-widest uppercase glitch-text" data-text="NEURAL_SNAKE.VOX">
            NEURAL_SNAKE.<span className="text-cyan">VOX</span>
          </h1>
        </div>

        <div className="hidden md:flex items-center gap-8 text-[8px] font-bold uppercase tracking-widest text-cyan">
          <span className="flex items-center gap-2">
            [SYS_STATE: UNSTABLE]
          </span>
          <span className="flex items-center gap-2 text-magenta">
            CORE_LOAD: 89.2%
          </span>
        </div>
      </motion.header>

      {/* Left Vertical Info Rail */}
      <div className="fixed left-4 top-1/2 -translate-y-1/2 hidden xl:flex flex-col gap-12 text-[8px] font-bold uppercase tracking-[0.5em] text-white/20 [writing-mode:vertical-rl] opacity-50">
         <span>TRANSMISSION_ID: 0x99A_ERROR</span>
         <span>ENCRYPTION: 1024-BIT_GEN</span>
         <span>SIGNAL_STRENGTH: NOMINAL</span>
      </div>

      {/* Main Grid Interface */}
      <main className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-[300px_1fr_300px] gap-8 items-start z-10 pt-16">
        
        {/* Module 01: Telemetry */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="hidden lg:flex flex-col gap-6"
        >
          <div className="cyber-border bg-black/40 p-4">
            <div className="flex items-center gap-2 text-magenta mb-4">
               <Activity size={16} />
               <span className="text-[10px] font-bold uppercase">Telemetry_01</span>
            </div>
            <p className="text-white/40 text-[9px] leading-tight mb-4 font-mono">
              // ANALYZING_USER_INPUT_VECTORS //
              // FREQUENCY_SYNC_ENGAGED //
              // NEURAL_LINK_ESTABLISHED //
            </p>
            <div className="space-y-3">
               <div className="flex justify-between text-[8px] mb-1">
                  <span>SYNC_RATE</span>
                  <span className="text-cyan">99.9%</span>
               </div>
               <div className="w-full h-1 bg-zinc-900 border border-cyan/20">
                  <motion.div 
                    className="h-full bg-cyan" 
                    initial={{ width: '0%' }}
                    animate={{ width: '99%' }}
                    transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse" }}
                  />
               </div>
            </div>
          </div>

          <div className="bg-magenta/5 border border-magenta/20 p-4 flex flex-col gap-2">
             <AlertTriangle size={14} className="text-magenta animate-bounce" />
             <span className="text-[8px] font-bold text-magenta leading-none uppercase">Warning: Sector_7 Breach Detected</span>
             <span className="text-[7px] text-white/30 font-mono">Attempting automated patch... [FAILED]</span>
          </div>
        </motion.div>

        {/* Module 02: Core Game Axis */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center"
        >
           <div className="mb-4 flex items-center gap-2 text-cyan/40">
              <Gamepad2 size={14} />
              <span className="text-[9px] font-bold uppercase tracking-[0.3em]">EXECUTE_SNAKE_PROTOCOL</span>
           </div>
           <SnakeGame />
        </motion.div>

        {/* Module 03: Audio Extraction */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex flex-col items-center lg:items-end gap-6"
        >
          <div className="mb-4 hidden lg:flex items-center gap-2 text-magenta/40">
              <span className="text-[9px] font-bold uppercase tracking-[0.3em]">AUDIO_DECODER_M03</span>
              <Headphones size={14} />
           </div>
          <MusicPlayer />
          
          <div className="hidden lg:block w-full">
             <div className="cyber-border bg-black/40 p-3">
                <div className="text-[8px] font-black uppercase text-cyan mb-2">Network_Nodes</div>
                <div className="space-y-1">
                   {[1,2,3].map(i => (
                     <div key={i} className="flex items-center justify-between font-mono text-[7px] text-white/20">
                        <span>NODE_{400 + i}:</span>
                        <span className="text-green-500/50">ACTIVE</span>
                     </div>
                   ))}
                </div>
             </div>
          </div>
        </motion.div>
      </main>

      {/* Right Vertical Branding */}
      <div className="fixed right-4 bottom-4 hidden md:block text-[40px] font-black text-white/5 uppercase leading-none select-none glitch-text" data-text="0xVOID">
        0xVOID
      </div>

      {/* Bottom Status Bar */}
      <footer className="fixed bottom-0 left-0 w-full py-1 px-4 bg-magenta flex justify-between items-center z-40 text-black font-black text-[8px] uppercase tracking-widest">
         <div className="flex gap-4">
            <span>[STATIC: {Math.random().toString(16).slice(2, 8)}]</span>
            <span>USER: AGENT_SYSTEM</span>
         </div>
         <div className="flex gap-4">
            <span className="animate-pulse">SYSTEM_STABLE: FALSE</span>
            <span>CLOCK: {new Date().toLocaleTimeString()}</span>
         </div>
      </footer>
    </div>
  );
}
