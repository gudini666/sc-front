const isBrowser = typeof window !== 'undefined';

export const storage = {
  get: (key: string): string | null => {
    if (!isBrowser) {
      console.log('Not in browser environment');
      return null;
    }
    try {
      const value = localStorage.getItem(key);
      console.log(`Getting ${key} from localStorage:`, value);
      return value;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return null;
    }
  },

  set: (key: string, value: string): void => {
    if (!isBrowser) {
      console.log('Not in browser environment');
      return;
    }
    try {
      console.log(`Setting ${key} in localStorage:`, value);
      localStorage.setItem(key, value);
    } catch (error) {
      console.error('Error writing to localStorage:', error);
    }
  },

  remove: (key: string): void => {
    if (!isBrowser) {
      console.log('Not in browser environment');
      return;
    }
    try {
      console.log(`Removing ${key} from localStorage`);
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing from localStorage:', error);
    }
  }
}; 