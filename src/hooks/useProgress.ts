import { useState, useCallback, useEffect } from 'react';
import type { NodeStatus, UserProgress, ProgressStats, Category } from '../types';
import { roadmapNodes } from '../data/roadmapNodes';

const STORAGE_KEY = 'sd-prep-progress';

function loadProgress(): UserProgress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveProgress(progress: UserProgress) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

export function useProgress() {
  const [progress, setProgress] = useState<UserProgress>(loadProgress);

  useEffect(() => {
    saveProgress(progress);
  }, [progress]);

  const getStatus = useCallback(
    (nodeId: string): NodeStatus => progress[nodeId] ?? 'not-started',
    [progress],
  );

  const setStatus = useCallback((nodeId: string, status: NodeStatus) => {
    setProgress((prev) => ({ ...prev, [nodeId]: status }));
  }, []);

  const resetAll = useCallback(() => {
    setProgress({});
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const getStats = useCallback((): ProgressStats => {
    const byStatus: Record<NodeStatus, number> = {
      locked: 0,
      'not-started': 0,
      'in-progress': 0,
      completed: 0,
    };

    const byCategory: Record<Category, { total: number; completed: number }> = {
      fundamentals: { total: 0, completed: 0 },
      'building-blocks': { total: 0, completed: 0 },
      patterns: { total: 0, completed: 0 },
      problems: { total: 0, completed: 0 },
    };

    for (const node of roadmapNodes) {
      const status = progress[node.id] ?? 'not-started';
      byStatus[status]++;
      byCategory[node.category].total++;
      if (status === 'completed') {
        byCategory[node.category].completed++;
      }
    }

    return { total: roadmapNodes.length, byStatus, byCategory };
  }, [progress]);

  return { progress, getStatus, setStatus, resetAll, getStats };
}
