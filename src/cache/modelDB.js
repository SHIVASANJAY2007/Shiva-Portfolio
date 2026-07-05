import { createStore, get, set, del, clear } from 'idb-keyval';
import { DATABASE_NAME, STORE_NAME, MODEL_VERSION } from './constants';

let customStore = null;

/**
 * Initializes and returns the custom IndexedDB store.
 * Safe to call on server (SSR).
 */
export function openDatabase() {
  if (typeof window === 'undefined') return null; // SSR safety
  
  if (!customStore) {
    customStore = createStore(DATABASE_NAME, STORE_NAME);
  }
  return customStore;
}

/**
 * Saves a Blob to IndexedDB with the current version.
 * @param {string} key 
 * @param {Blob} blob 
 */
export async function saveBlob(key, blob) {
  const store = openDatabase();
  if (!store) return;
  
  const payload = {
    version: MODEL_VERSION,
    timestamp: Date.now(),
    data: blob
  };
  
  await set(key, payload, store);
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Cache] ✅ Saved Blob to IndexedDB: ${key} (${MODEL_VERSION})`);
  }
}

/**
 * Loads a Blob from IndexedDB. If the version doesn't match, it deletes the old blob and returns null.
 * @param {string} key 
 * @returns {Blob | null}
 */
export async function loadBlob(key) {
  const store = openDatabase();
  if (!store) return null;
  
  const result = await get(key, store);
  if (!result) return null;
  
  if (result.version !== MODEL_VERSION) {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Cache] 🗑️ Model version changed. Deleting old cache for: ${key}`);
    }
    await deleteBlob(key);
    return null; // Force a re-download
  }
  
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Cache] ✅ Read from IndexedDB: ${key}`);
  }
  return result.data;
}

/**
 * Deletes a specific Blob from IndexedDB.
 * @param {string} key 
 */
export async function deleteBlob(key) {
  const store = openDatabase();
  if (!store) return;
  await del(key, store);
}

/**
 * Clears the entire model database store.
 */
export async function clearDatabase() {
  const store = openDatabase();
  if (!store) return;
  await clear(store);
}
