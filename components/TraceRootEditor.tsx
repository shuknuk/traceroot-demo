import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Terminal, 
  Play, 
  AlertCircle, 
  CheckCircle2, 
  Cpu, 
  X, 
  FileCode2, 
  MoreHorizontal,
  Bug,
  Sparkles
} from 'lucide-react';

// --- Types & Constants ---

type EditorState = 'BROKEN' | 'ANALYZING' | 'PATCHING' | 'RESOLVED';

interface TerminalLog {
  id: string;
  type: 'error' | 'info' | 'success' | 'system';
  message: string;
  timestamp: string;
}

const CODE_PRE_BUG = [
  { num: 1, content: `import { db } from '@/lib/database';` },
  { num: 2, content: `import { logger } from '@/utils/logger';` },
  { num: 3, content: `` },
  { num: 4, content: `export async function getUserProfile(id: string) {` },
  { num: 5, content: `  logger.info(\`Fetching user \${id}\`);` },
];

const CODE_POST_BUG = [
  { num: 7, content: `  return data;` },
  { num: 8, content: `}` },
];

const BUGGY_LINE = "  const data = db.fetch(id);";
const FIXED_LINE = "  const data = await db.fetch(id);";

// --- Helper Components ---

const SyntaxHighlight = ({ code }: { code: string }) => {
  // Very basic simulated syntax highlighting for the demo
  const parts = code.split(/(\s+|[(){}.=,;`'])/);
  
  return (
    <span>
      {parts.map((part, i) => {
        if (['import', 'from', 'export', 'async', 'function', 'const', 'return', 'await'].includes(part)) 
          return <span key={i} className="text-purple-400">{part}</span>;
        if (['db', 'logger', 'console'].includes(part)) 
          return <span key={i} className="text-yellow-300">{part}</span>;
        if (['fetch', 'info', 'getUserProfile'].includes(part)) 
          return <span key={i} className="text-blue-400">{part}</span>;
        if (part.startsWith("'") || part.startsWith("`")) 
          return <span key={i} className="text-green-400">{part}</span>;
        if (['{', '}', '(', ')', ';', '.'].includes(part)) 
          return <span key={i} className="text-neutral-500">{part}</span>;
        return <span key={i} className="text-neutral-300">{part}</span>;
      })}
    </span>
  );
};

// --- Main Component ---

const TraceRootEditor: React.FC = () => {
  const [state, setState] = useState<EditorState>('BROKEN');
  const [logs, setLogs] = useState<TerminalLog[]>([
    { id: '1', type: 'system', message: '> Starting dev server...', timestamp: '10:42:01' },
    { id: '2', type: 'info', message: '> Ready on http://localhost:3000', timestamp: '10:42:02' },
    { id: '3', type: 'error', message: 'TypeError: Cannot read properties of undefined (reading "json")', timestamp: '10:42:05' },
    { id: '4', type: 'error', message: '    at getUserProfile (server.ts:6:21)', timestamp: '10:42:05' },
  ]);
  
  const [typedCode, setTypedCode] = useState("");
  const terminalEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll terminal
  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  // State Machine Orchestrator
  useEffect(() => {
    let timeoutId: any;

    const runSequence = async () => {
      // 1. Wait a bit in BROKEN state
      await new Promise(r => setTimeout(r, 1500));
      
      // 2. Transition to ANALYZING
      setState('ANALYZING');
      addLog({ type: 'system', message: '> TraceRoot detected uncaught exception...' });
      
      await new Promise(r => setTimeout(r, 1500));
      addLog({ type: 'info', message: '> Analyzing stack trace & dependency graph...' });
      
      await new Promise(r => setTimeout(r, 1500));
      
      // 3. Transition to PATCHING
      setState('PATCHING');
      addLog({ type: 'system', message: '> Applying heuristic patch: Missing await on Promise' });
      
      // Typing effect logic
      const targetText = FIXED_LINE;
      let currentText = "";
      // Calculate delay per char for a 1s duration approx
      const delayPerChar = 800 / targetText.length; 

      for (let i = 0; i <= targetText.length; i++) {
        setTypedCode(targetText.slice(0, i));
        await new Promise(r => setTimeout(r, delayPerChar));
      }

      await new Promise(r => setTimeout(r, 600));

      // 4. Transition to RESOLVED
      setState('RESOLVED');
      addLog({ type: 'success', message: '> Hot patch applied successfully (24ms)' });
      addLog({ type: 'system', message: '> Server reloaded. No pending issues.' });
    };

    runSequence();

    return () => clearTimeout(timeoutId);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addLog = (log: Omit<TerminalLog, 'id' | 'timestamp'>) => {
    const now = new Date();
    const timeString = `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;
    setLogs(prev => [...prev, { ...log, id: Math.random().toString(36), timestamp: timeString }]);
  };

  const restartDemo = () => {
    window.location.reload();
  };

  return (
    <div className="w-full max-w-4xl shadow-2xl rounded-lg overflow-hidden border border-neutral-800 bg-[#1e1e1e] flex flex-col h-[600px] font-mono relative">
      
      {/* --- Top Bar (Tabs) --- */}
      <div className="h-10 bg-[#181818] border-b border-neutral-800 flex items-center justify-between px-4 select-none">
        <div className="flex items-center space-x-2">
          <div className="flex space-x-2 mr-4">
            <div className="w-3 h-3 rounded-full bg-red-500/80" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
            <div className="w-3 h-3 rounded-full bg-green-500/80" />
          </div>
          
          <div className="flex items-center px-3 py-1.5 bg-[#1e1e1e] text-neutral-300 text-xs rounded-t-md border-t border-x border-neutral-800 relative top-[1px]">
            <FileCode2 size={14} className="mr-2 text-blue-400" />
            server.ts
            <X size={12} className="ml-2 text-neutral-500 hover:text-neutral-300 cursor-pointer" />
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
           {state === 'RESOLVED' && (
             <motion.button
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               onClick={restartDemo}
               className="text-xs text-neutral-500 hover:text-white flex items-center gap-1 bg-neutral-800 px-2 py-1 rounded"
             >
               <Play size={10} /> Replay
             </motion.button>
           )}
           <MoreHorizontal size={16} className="text-neutral-500" />
        </div>
      </div>

      {/* --- Main Content Area (Split View) --- */}
      <div className="flex-1 flex flex-col relative">
        
        {/* Editor Area */}
        <div className="flex-1 p-4 overflow-hidden relative">
          
          {/* Agent Overlay Badge */}
          <AnimatePresence>
            {state !== 'BROKEN' && state !== 'RESOLVED' && (
              <motion.div 
                initial={{ opacity: 0, y: -20, x: '50%' }}
                animate={{ opacity: 1, y: 0, x: '50%' }}
                exit={{ opacity: 0, scale: 0.9, x: '50%' }}
                className="absolute top-4 right-1/2 translate-x-1/2 z-20 flex items-center gap-2 bg-blue-500/10 backdrop-blur-md border border-blue-500/30 text-blue-400 px-3 py-1.5 rounded-full shadow-[0_0_15px_rgba(59,130,246,0.2)]"
              >
                <Cpu size={14} className="animate-pulse" />
                <span className="text-xs font-semibold tracking-wide">
                  {state === 'ANALYZING' ? 'TRACEROOT ANALYZING' : 'APPLYING FIX'}
                </span>
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                </span>
              </motion.div>
            )}
          </AnimatePresence>

           {/* Success Badge */}
           <AnimatePresence>
            {state === 'RESOLVED' && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute top-4 right-8 z-20"
              >
                 <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/20 text-green-400 px-4 py-2 rounded-full shadow-lg">
                    <CheckCircle2 size={16} />
                    <span className="text-xs font-bold">PATCHED</span>
                 </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Line Numbers & Code */}
          <div className="flex flex-col text-sm leading-6">
            
            {/* Top Code */}
            {CODE_PRE_BUG.map((line) => (
              <div key={line.num} className="flex">
                <span className="w-8 text-neutral-600 text-right select-none mr-4">{line.num}</span>
                <div className="flex-1 whitespace-pre">
                   <SyntaxHighlight code={line.content} />
                </div>
              </div>
            ))}

            {/* THE BUGGY / PATCHING AREA */}
            <div className="relative group">
              
              {/* Line 6 Number */}
              <div className="absolute left-0 top-0 w-8 text-neutral-600 text-right select-none h-6">6</div>
              
              <div className="ml-12 relative">
                
                {/* State: BROKEN or ANALYZING - Show Error Line */}
                {(state === 'BROKEN' || state === 'ANALYZING') && (
                  <motion.div 
                    layoutId="code-line"
                    className="flex items-center"
                  >
                    <div className="whitespace-pre text-neutral-100 relative">
                      <SyntaxHighlight code={BUGGY_LINE} />
                      {/* Squiggly red line */}
                      {state === 'BROKEN' && (
                         <motion.div 
                           initial={{ width: 0 }}
                           animate={{ width: '100%' }}
                           transition={{ duration: 0.5, delay: 0.5 }}
                           className="absolute bottom-0 left-0 h-[2px] bg-red-500/50 w-full"
                           style={{ textDecorationStyle: 'wavy', textDecorationLine: 'underline' }}
                         />
                      )}
                    </div>
                    {state === 'BROKEN' && (
                        <motion.span 
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.8 }}
                            className="ml-4 flex items-center gap-1 text-xs text-red-400 bg-red-500/10 px-2 rounded border border-red-500/20"
                        >
                            <Bug size={12} /> Runtime Error
                        </motion.span>
                    )}
                  </motion.div>
                )}

                {/* State: PATCHING - The Animation Magic */}
                {state === 'PATCHING' && (
                  <div className="relative flex flex-col gap-0.5">
                    {/* Old Line Removal */}
                    <motion.div 
                        initial={{ opacity: 1 }}
                        animate={{ opacity: 0.4 }}
                        className="flex w-full bg-red-500/10 border-l-2 border-red-500 pl-2 relative"
                    >
                        <span className="line-through decoration-red-500/50 decoration-2 whitespace-pre text-red-200/70">
                           {BUGGY_LINE}
                        </span>
                    </motion.div>

                    {/* New Line Insertion */}
                    <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="flex w-full bg-green-500/10 border-l-2 border-green-500 pl-2 items-center"
                    >
                        <span className="whitespace-pre text-green-100 font-medium">
                            {/* Typed Code */}
                            <SyntaxHighlight code={typedCode} />
                            {/* Cursor */}
                            <motion.span 
                                animate={{ opacity: [1, 0] }}
                                transition={{ repeat: Infinity, duration: 0.6 }}
                                className="inline-block w-2 h-4 bg-blue-400 align-middle ml-1"
                            />
                        </span>
                    </motion.div>
                  </div>
                )}

                {/* State: RESOLVED - Static Clean Code */}
                {state === 'RESOLVED' && (
                   <motion.div 
                     initial={{ backgroundColor: 'rgba(34, 197, 94, 0.2)' }}
                     animate={{ backgroundColor: 'transparent' }}
                     transition={{ duration: 1 }}
                     className="whitespace-pre relative"
                   >
                     <SyntaxHighlight code={FIXED_LINE} />
                   </motion.div>
                )}

              </div>
            </div>

            {/* Bottom Code */}
            {CODE_POST_BUG.map((line) => (
              <div key={line.num} className="flex">
                <span className="w-8 text-neutral-600 text-right select-none mr-4">{line.num}</span>
                <div className="flex-1 whitespace-pre">
                   <SyntaxHighlight code={line.content} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* --- Terminal (Bottom Pane) --- */}
        <div className="h-48 bg-[#181818] border-t border-neutral-800 flex flex-col text-xs">
           <div className="h-8 flex items-center px-4 border-b border-neutral-800 space-x-4">
              <div className="flex items-center text-neutral-300 gap-2 border-b-2 border-blue-500 h-full px-2 cursor-pointer bg-neutral-800/50">
                <Terminal size={12} />
                <span>TERMINAL</span>
              </div>
              <div className="flex items-center text-neutral-500 gap-2 h-full px-2 cursor-pointer hover:text-neutral-300">
                <AlertCircle size={12} />
                <span>PROBLEMS</span>
                <span className="bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-[9px]">{state === 'RESOLVED' ? '0' : '1'}</span>
              </div>
           </div>
           
           <div className="flex-1 p-4 overflow-y-auto font-mono space-y-2">
              <AnimatePresence initial={false}>
                {logs.map((log) => (
                    <motion.div 
                        key={log.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-start gap-3"
                    >
                        <span className="text-neutral-600 select-none shrink-0">{log.timestamp}</span>
                        <div className={
                            log.type === 'error' ? 'text-red-400' :
                            log.type === 'success' ? 'text-green-400' :
                            log.type === 'system' ? 'text-blue-400 font-semibold' :
                            'text-neutral-300'
                        }>
                            {log.type === 'success' && <Sparkles size={12} className="inline mr-2" />}
                            {log.message}
                        </div>
                    </motion.div>
                ))}
              </AnimatePresence>
              <div ref={terminalEndRef} />
           </div>
        </div>

      </div>
    </div>
  );
};

export default TraceRootEditor;