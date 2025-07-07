// utils/socket/tempIdCache.ts
const recentTempIds = new Set<string>();

export const isTempIdCached = (tempId: string) => recentTempIds.has(tempId);

export const addToTempIdCache = (tempId: string) => {
  if (!tempId) return;
  recentTempIds.add(tempId);
  if (recentTempIds.size > 1000) {
    const first = recentTempIds.values().next().value;
    if (first) recentTempIds.delete(first);
  }
};

export const removeFromTempIdCache = (tempId: string) => {
  recentTempIds.delete(tempId);
};
