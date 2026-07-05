import { loadBlob, saveBlob } from './modelDB';
import { MODEL_CACHE_KEY, MODEL_URL } from './constants';

const MAX_RETRIES = 3;
const TIMEOUT_MS = 30000;

/**
 * Downloads a file with progress tracking and abort support.
 */
async function fetchWithProgress(url, onProgress, signal) {
  const response = await fetch(url, { signal });
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const contentLength = response.headers.get('content-length');
  const total = contentLength ? parseInt(contentLength, 10) : 0;
  
  let loaded = 0;
  
  // If the browser doesn't support body streams (very rare), just return the blob directly.
  if (!response.body) {
    const blob = await response.blob();
    if (onProgress) onProgress({ loaded: total, total });
    return blob;
  }

  const reader = response.body.getReader();
  const chunks = [];

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    
    if (value) {
      chunks.push(value);
      loaded += value.length;
      if (onProgress && total) {
        onProgress({ loaded, total });
      }
    }
  }

  return new Blob(chunks, { type: response.headers.get('content-type') || 'application/octet-stream' });
}

/**
 * Fetches the GLB model from the network with retry and timeout logic.
 */
async function fetchModelFromNetwork(onProgress, abortSignal) {
  let attempt = 0;
  
  while (attempt < MAX_RETRIES) {
    try {
      const controller = new AbortController();
      
      // If the parent aborts, abort our internal controller too
      const onParentAbort = () => controller.abort();
      if (abortSignal) abortSignal.addEventListener('abort', onParentAbort);

      // Setup a hard timeout for the fetch
      const timeoutId = setTimeout(() => controller.abort('TIMEOUT'), TIMEOUT_MS);
      
      try {
        if (process.env.NODE_ENV === 'development') {
          console.log(`[Cache] ⏳ Downloading Knight... (Attempt ${attempt + 1})`);
        }
        
        const blob = await fetchWithProgress(MODEL_URL, onProgress, controller.signal);
        
        clearTimeout(timeoutId);
        if (abortSignal) abortSignal.removeEventListener('abort', onParentAbort);
        
        return blob;
      } catch (err) {
        clearTimeout(timeoutId);
        if (abortSignal) abortSignal.removeEventListener('abort', onParentAbort);
        throw err;
      }
      
    } catch (error) {
      // If the user deliberately aborted, or the parent component unmounted, don't retry.
      if (error.name === 'AbortError' && abortSignal && abortSignal.aborted) {
        throw error;
      }
      
      attempt++;
      if (process.env.NODE_ENV === 'development') {
        console.warn(`[Cache] ⚠️ Network fetch failed. Retrying... (${attempt}/${MAX_RETRIES})`, error);
      }
      
      if (attempt >= MAX_RETRIES) {
        throw new Error(`Failed to download model after ${MAX_RETRIES} attempts.`);
      }
      
      // Wait briefly before retrying
      await new Promise(res => setTimeout(res, 1000));
    }
  }
}

/**
 * Master function to load the Blob:
 * 1. Check IndexedDB.
 * 2. If not found, download from network.
 * 3. Store in IndexedDB.
 * 4. Return Blob.
 */
export async function getModelBlob(onProgress, abortSignal) {
  try {
    // 1. Check persistent cache
    const cachedBlob = await loadBlob(MODEL_CACHE_KEY);
    if (cachedBlob) {
      // Immediately set progress to 100% since it's already on disk
      if (onProgress) onProgress({ loaded: cachedBlob.size, total: cachedBlob.size });
      return cachedBlob;
    }

    // 2. Fetch from network
    const downloadedBlob = await fetchModelFromNetwork(onProgress, abortSignal);

    // 3. Save to persistent cache (fire and forget to not block execution)
    saveBlob(MODEL_CACHE_KEY, downloadedBlob).catch(err => {
      console.error("[Cache] Failed to save blob to IndexedDB:", err);
    });

    return downloadedBlob;
  } catch (error) {
    if (error.name !== 'AbortError') {
      console.error("[Cache] ❌ Critical failure loading model blob:", error);
    }
    throw error;
  }
}

/**
 * Safely creates an ObjectURL from a blob.
 */
export function createModelUrl(blob) {
  return URL.createObjectURL(blob);
}

/**
 * Safely revokes an ObjectURL to prevent memory leaks.
 */
export function revokeModelUrl(url) {
  if (url) {
    URL.revokeObjectURL(url);
  }
}
