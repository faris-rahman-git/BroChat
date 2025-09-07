const COLORS = [
  '#F44336', // red
  '#673AB7', // deep purple
  '#3F51B5', // indigo
  '#2196F3', // blue
  '#009688', // teal
  '#4CAF50', // green
  '#FFC107', // amber
  '#FF9800', // orange
  '#FF5722', // deep orange
];

export const stringToColor = (str = 'User') => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % COLORS.length;
  return COLORS[index];
};
