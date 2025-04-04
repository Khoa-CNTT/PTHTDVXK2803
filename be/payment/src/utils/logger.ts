export const log = (message: string): void => {
  console.log(`[${new Date().toISOString()}] ${message}`);
};
