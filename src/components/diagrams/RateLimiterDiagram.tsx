import { useState, useEffect, useCallback } from 'react';

const MAX_TOKENS = 10;
const REFILL_RATE = 1; // per second

export default function RateLimiterDiagram() {
  const [tokens, setTokens] = useState(MAX_TOKENS);
  const [requests, setRequests] = useState<{ id: number; allowed: boolean; time: number }[]>([]);
  const [reqCount, setReqCount] = useState(0);

  // Refill tokens
  useEffect(() => {
    const interval = setInterval(() => {
      setTokens((t) => Math.min(MAX_TOKENS, t + REFILL_RATE));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Clean old requests
  useEffect(() => {
    const interval = setInterval(() => {
      setRequests((r) => r.filter((req) => Date.now() - req.time < 3000));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  const sendRequest = useCallback(() => {
    const allowed = tokens > 0;
    if (allowed) setTokens((t) => t - 1);
    setReqCount((c) => c + 1);
    setRequests((r) => [...r.slice(-15), { id: reqCount, allowed, time: Date.now() }]);
  }, [tokens, reqCount]);

  const bucketFill = (tokens / MAX_TOKENS) * 100;

  return (
    <div className="bg-slate-900 rounded-2xl p-8 border border-slate-700">
      <h3 className="text-xl font-bold text-white mb-2 text-center">Rate Limiter — Token Bucket</h3>
      <p className="text-xs text-slate-400 text-center mb-6">Click to send requests • Tokens refill at {REFILL_RATE}/sec</p>

      <div className="flex items-center justify-center gap-8">
        {/* Send button */}
        <div className="text-center">
          <button
            onClick={sendRequest}
            className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white font-bold px-6 py-3 rounded-xl transition-all active:scale-95 shadow-lg shadow-cyan-500/20"
          >
            📤 Send Request
          </button>
          <div className="text-[10px] text-slate-400 mt-2">Click rapidly to exceed limit!</div>
        </div>

        {/* Token Bucket visualization */}
        <div className="text-center">
          <div className="text-xs text-slate-400 mb-2">Token Bucket</div>
          <div className="relative w-20 h-32 border-2 border-slate-500 rounded-b-xl bg-slate-800 overflow-hidden mx-auto">
            {/* Fill level */}
            <div
              className={`absolute bottom-0 left-0 right-0 transition-all duration-300 rounded-b-lg ${
                bucketFill > 50 ? 'bg-gradient-to-t from-cyan-500 to-cyan-400' :
                bucketFill > 20 ? 'bg-gradient-to-t from-yellow-500 to-yellow-400' :
                'bg-gradient-to-t from-red-500 to-red-400'
              }`}
              style={{ height: `${bucketFill}%` }}
            />
            {/* Token count */}
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-lg font-bold text-white drop-shadow-lg">{tokens}</span>
            </div>
          </div>
          <div className="text-[10px] text-slate-400 mt-1">{tokens}/{MAX_TOKENS} tokens</div>
        </div>

        {/* Results */}
        <div className="w-48">
          <div className="text-xs text-slate-400 mb-2">Recent Requests</div>
          <div className="space-y-1 max-h-40 overflow-hidden">
            {requests.slice().reverse().map((req) => (
              <div
                key={req.id + '-' + req.time}
                className={`flex items-center gap-2 text-xs px-2 py-1 rounded transition-all
                  ${req.allowed
                    ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                    : 'bg-red-500/20 text-red-300 border border-red-500/30'}`}
              >
                <span>{req.allowed ? '✅' : '🚫'}</span>
                <span>Request #{req.id + 1}</span>
                <span className="ml-auto text-[10px]">{req.allowed ? '200 OK' : '429 Limited'}</span>
              </div>
            ))}
            {requests.length === 0 && (
              <div className="text-xs text-slate-500 italic">No requests yet</div>
            )}
          </div>
        </div>
      </div>

      {/* Algorithm info */}
      <div className="mt-6 bg-slate-800 rounded-lg p-3 border border-slate-700 grid grid-cols-3 gap-3 text-center">
        <div>
          <div className="text-[10px] text-slate-400">Bucket Size</div>
          <div className="text-sm text-white font-bold">{MAX_TOKENS}</div>
        </div>
        <div>
          <div className="text-[10px] text-slate-400">Refill Rate</div>
          <div className="text-sm text-white font-bold">{REFILL_RATE}/sec</div>
        </div>
        <div>
          <div className="text-[10px] text-slate-400">Burst Allowed</div>
          <div className="text-sm text-white font-bold">{MAX_TOKENS} reqs</div>
        </div>
      </div>
    </div>
  );
}
