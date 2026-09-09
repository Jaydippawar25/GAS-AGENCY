/**
 * Wrap a promise with a safety timeout so asynchronous Firestore network calls 
 * immediately fall back if Firebase connection hangs.
 */
export const withTimeout = (promise, fallbackValue, timeoutMs = 1200) => {
  let timer;
  const timeoutPromise = new Promise((resolve) => {
    timer = setTimeout(() => {
      resolve(fallbackValue);
    }, timeoutMs);
  });

  return Promise.race([
    promise.then((res) => {
      clearTimeout(timer);
      return res;
    }).catch((err) => {
      clearTimeout(timer);
      console.warn('Promise rejected, returning fallback:', err);
      return fallbackValue;
    }),
    timeoutPromise
  ]);
};
