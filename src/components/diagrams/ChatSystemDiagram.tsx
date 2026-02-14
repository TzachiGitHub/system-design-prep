import { useState, useEffect } from 'react';

const messages = [
  { from: 'Alice', to: 'Bob', text: 'Hey! 👋', color: 'blue' },
  { from: 'Bob', to: 'Alice', text: 'Hi there!', color: 'green' },
  { from: 'Alice', to: 'Bob', text: 'How are you?', color: 'blue' },
];

export default function ChatSystemDiagram() {
  const [msgIdx, setMsgIdx] = useState(0);
  const [showMsg, setShowMsg] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setShowMsg(true);
      setTimeout(() => {
        setShowMsg(false);
        setMsgIdx((prev) => (prev + 1) % messages.length);
      }, 1800);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const msg = messages[msgIdx];

  return (
    <div className="bg-slate-900 rounded-2xl p-8 border border-slate-700">
      <h3 className="text-xl font-bold text-white mb-2 text-center">Chat System Architecture</h3>
      <p className="text-xs text-slate-400 text-center mb-6">WebSocket-based real-time messaging</p>

      <div className="flex items-center justify-between gap-4">
        {/* User A */}
        <div className={`border-2 rounded-xl p-4 text-center transition-all duration-300 flex-shrink-0
          ${showMsg && msg.from === 'Alice' ? 'border-blue-400 bg-blue-500/20 scale-105' : 'border-slate-600 bg-slate-800'}`}>
          <div className="text-2xl">👩</div>
          <div className="text-xs text-white font-medium">Alice</div>
          {showMsg && msg.from === 'Alice' && (
            <div className="text-[10px] text-blue-300 mt-1 animate-pulse">{msg.text}</div>
          )}
        </div>

        {/* Left WS connection */}
        <div className="flex flex-col items-center">
          <div className="text-[9px] text-cyan-400">WebSocket</div>
          <div className={`h-0.5 w-12 transition-colors duration-300 ${showMsg ? 'bg-cyan-400' : 'bg-slate-600'}`} />
        </div>

        {/* Server cluster */}
        <div className="flex flex-col items-center gap-3 flex-shrink-0">
          <div className="border-2 border-cyan-400 bg-cyan-500/15 rounded-xl p-3 text-center">
            <div className="text-lg">🖥️</div>
            <div className="text-xs text-white font-bold">Chat Server</div>
            <div className="text-[10px] text-slate-400">WS Connection Manager</div>
          </div>

          <div className="flex gap-3">
            <div className="border border-red-400 bg-red-500/15 rounded-lg p-2 text-center">
              <div className="text-sm">⚡</div>
              <div className="text-[9px] text-white">Redis Pub/Sub</div>
            </div>
            <div className="border border-amber-400 bg-amber-500/15 rounded-lg p-2 text-center">
              <div className="text-sm">📨</div>
              <div className="text-[9px] text-white">Message Queue</div>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="border border-emerald-400 bg-emerald-500/15 rounded-lg p-2 text-center">
              <div className="text-sm">🗄️</div>
              <div className="text-[9px] text-white">Message DB</div>
            </div>
            <div className="border border-purple-400 bg-purple-500/15 rounded-lg p-2 text-center">
              <div className="text-sm">👥</div>
              <div className="text-[9px] text-white">Presence</div>
            </div>
          </div>
        </div>

        {/* Right WS connection */}
        <div className="flex flex-col items-center">
          <div className="text-[9px] text-cyan-400">WebSocket</div>
          <div className={`h-0.5 w-12 transition-colors duration-300 ${showMsg ? 'bg-cyan-400' : 'bg-slate-600'}`} />
        </div>

        {/* User B */}
        <div className={`border-2 rounded-xl p-4 text-center transition-all duration-300 flex-shrink-0
          ${showMsg && msg.to === 'Bob' ? 'border-green-400 bg-green-500/20 scale-105' : 'border-slate-600 bg-slate-800'}`}>
          <div className="text-2xl">👨</div>
          <div className="text-xs text-white font-medium">Bob</div>
          {showMsg && msg.to === 'Bob' && (
            <div className="text-[10px] text-green-300 mt-1 animate-pulse">{msg.text}</div>
          )}
        </div>
      </div>

      {/* Message flow indicator */}
      {showMsg && (
        <div className="mt-4 text-center">
          <span className="inline-block bg-slate-800 border border-slate-600 rounded-full px-4 py-1 text-xs text-slate-300">
            📩 {msg.from} → {msg.to}: "{msg.text}"
          </span>
        </div>
      )}
    </div>
  );
}
