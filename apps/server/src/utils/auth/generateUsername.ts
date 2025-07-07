export function generateUsername(name: string): string {
  const base = name.trim().toLowerCase().replace(/\s+/g, '_');
  const randomNum = Math.floor(Math.random() * 10000);
  return `${base}_${randomNum}`;
}
