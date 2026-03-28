/**
 * Dispatches a custom event to start the global loading bar.
 */
export const startGlobalLoading = () => {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("start-loading"));
  }
};

/**
 * Dispatches a custom event to stop the global loading bar.
 */
export const stopGlobalLoading = () => {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("stop-loading"));
  }
};
