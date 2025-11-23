export const loggerInfo = (...args: unknown[]) => {
  console.info("[INFO]", ...args);
};

export const loggerError = (...args: unknown[]) => {
  console.error("[ERROR]", ...args);
};
