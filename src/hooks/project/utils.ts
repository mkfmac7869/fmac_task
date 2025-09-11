
// Helper function to generate consistent colors based on project name
export const getColorForProject = (name: string) => {
  const colors = ['purple', 'blue', 'green', 'orange', 'pink', 'teal', 'red'];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
};
