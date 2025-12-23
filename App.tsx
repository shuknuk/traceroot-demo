import React from 'react';
import TraceRootEditor from './components/TraceRootEditor';

const App: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-neutral-950 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(59,130,246,0.15),rgba(255,255,255,0))]">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-white mb-2 flex items-center justify-center gap-3">
          <span className="text-blue-500 font-mono text-4xl">~/</span> TraceRoot
        </h1>
        <p className="text-neutral-400 max-w-md mx-auto">
          AI-powered autonomous debugging. Watch the agent detect, analyze, and patch bugs in real-time.
        </p>
      </div>

      <TraceRootEditor />

      <div className="mt-8 text-xs text-neutral-600 font-mono">
        <span className="bg-neutral-900 px-2 py-1 rounded border border-neutral-800">CMD + SHIFT + P</span> to trigger manual scan
      </div>

      <footer className="absolute bottom-0 left-0 right-0 border-t border-neutral-800 bg-neutral-950/50 backdrop-blur">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between text-xs text-neutral-500">
          <div>Made by <a href="https://linkedin.com/in/kinshukgoel2/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 transition-colors">Kinshuk Goel</a></div>
          <a href="https://github.com/shuknuk/traceroot-demo" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 transition-colors">View Source</a>
        </div>
      </footer>
    </div>
  );
};

export default App;