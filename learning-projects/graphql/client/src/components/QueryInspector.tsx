// ─────────────────────────────────────────────────────────────────────────────
// QueryInspector.tsx
//
// Shows the raw query that was sent and the raw response received.
// This helps learners connect the code they write to the network traffic.
// ─────────────────────────────────────────────────────────────────────────────

import { useState } from 'react';

type Props = {
  query: string;
  variables?: Record<string, unknown>;
  response?: unknown;
};

export default function QueryInspector({ query, variables, response: _response }: Props) {
  const [tab, setTab] = useState<'query' | 'response'>('query');

  return (
    <div className="border border-gray-700 rounded-lg overflow-hidden mt-4">
      <div className="flex border-b border-gray-700 bg-gray-900">
        <button
          onClick={() => setTab('query')}
          className={`px-4 py-2 text-xs font-medium transition-colors ${
            tab === 'query' ? 'text-indigo-400 border-b-2 border-indigo-400' : 'text-gray-500 hover:text-gray-300'
          }`}
        >
          Query sent
        </button>
        {variables && (
          <button
            onClick={() => setTab('response')}
            className={`px-4 py-2 text-xs font-medium transition-colors ${
              tab === 'response' ? 'text-indigo-400 border-b-2 border-indigo-400' : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            Variables
          </button>
        )}
      </div>
      <pre className="bg-gray-950 p-4 text-xs text-gray-300 overflow-x-auto leading-relaxed max-h-64">
        <code>
          {tab === 'query'
            ? query.trim()
            : JSON.stringify(variables, null, 2)}
        </code>
      </pre>
    </div>
  );
}
