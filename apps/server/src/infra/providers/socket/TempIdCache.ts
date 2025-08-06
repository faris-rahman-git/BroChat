import { ITempIdCache } from '../../../app/providers/socket/ITempIdCache';

export class TempIdCache implements ITempIdCache {
  private static recentTempIds: Set<string> = new Set();

  isCached(tempId: string): boolean {
    return TempIdCache.recentTempIds.has(tempId);
  }

  add(tempId: string): void {
    if (!tempId) return;
    TempIdCache.recentTempIds.add(tempId);
    if (TempIdCache.recentTempIds.size > 1000) {
      const first = TempIdCache.recentTempIds.values().next().value;
      if (first) TempIdCache.recentTempIds.delete(first);
    }
  }

  remove(tempId: string): void {
    TempIdCache.recentTempIds.delete(tempId);
  }
}
