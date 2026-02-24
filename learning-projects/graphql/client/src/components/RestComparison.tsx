// ─────────────────────────────────────────────────────────────────────────────
// RestComparison.tsx
//
// Every lesson page includes this collapsible panel at the bottom.
// It shows:
//  1. The GraphQL query that was sent
//  2. What a REST implementation would have required instead
//
// This is the most important teaching component in the app.
// The comparison happens at the moment you're using the feature — not in
// a separate docs page.
// ─────────────────────────────────────────────────────────────────────────────

import { useState } from 'react';

type RestStep = {
  method: string;
  path: string;
  reason: string;
};

type Props = {
  lesson: string;
  graphqlQuery: string;
  restSteps: RestStep[];
  concept: string;
};

export default function RestComparison({ lesson, graphqlQuery, restSteps, concept }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border border-gray-700 rounded-lg overflow-hidden mt-8">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-5 py-3 bg-gray-900 hover:bg-gray-800 transition-colors text-left"
      >
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold text-indigo-400 uppercase tracking-widest">
            {lesson}
          </span>
          <span className="text-sm text-gray-300">{concept}</span>
        </div>
        <span className="text-gray-500 text-sm">{open ? '▲ hide' : '▼ show'}</span>
      </button>

      {open && (
        <div className="p-5 bg-gray-950 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* GraphQL side */}
          <div>
            <p className="text-xs font-semibold text-green-400 uppercase tracking-widest mb-3">
              GraphQL — {restSteps.length === 1 ? '1 request' : '1 request'}
            </p>
            <pre className="bg-gray-900 rounded-md p-4 text-xs text-gray-300 overflow-x-auto leading-relaxed">
              <code>{graphqlQuery.trim()}</code>
            </pre>
            <p className="text-xs text-gray-500 mt-2">
              1 POST to <code className="text-gray-400">/graphql</code> · returns exactly the fields requested
            </p>
          </div>

          {/* REST side */}
          <div>
            <p className="text-xs font-semibold text-orange-400 uppercase tracking-widest mb-3">
              REST equivalent — {restSteps.length} request{restSteps.length !== 1 ? 's' : ''}
            </p>
            <div className="space-y-2">
              {restSteps.map((step, i) => (
                <div key={i} className="bg-gray-900 rounded-md p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-orange-300">{step.method}</span>
                    <code className="text-xs text-gray-300">{step.path}</code>
                  </div>
                  <p className="text-xs text-gray-500">{step.reason}</p>
                </div>
              ))}
            </div>
            {restSteps.length > 1 && (
              <p className="text-xs text-gray-500 mt-2">
                These requests may need to run sequentially (if later requests depend on earlier results), adding latency.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
