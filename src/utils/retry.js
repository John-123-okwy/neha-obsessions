// Retries an async function with increasing delay between attempts.
// onAttempt is called before each retry so the UI can show progress.
export async function retryAsync(fn, { retries = 4, delayMs = 2000, onAttempt } = {}) {
  let lastError;
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;
      onAttempt?.(attempt, err);
      if (attempt < retries) {
        await new Promise((resolve) => setTimeout(resolve, delayMs * attempt));
      }
    }
  }
  throw lastError;
}