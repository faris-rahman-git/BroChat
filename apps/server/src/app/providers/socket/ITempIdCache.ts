export interface ITempIdCache {
  isCached(tempId: string): boolean;
  add(tempId: string): void;
  remove(tempId: string): void;
}
