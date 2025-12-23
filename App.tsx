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
    </div>
  );
};

export default App;