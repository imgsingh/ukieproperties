// src/app/utils/Common.js

// Named exports
export const getFromLocalStorage = (key) => {
    if (typeof window !== 'undefined') {
        try {
            return localStorage.getItem(key);
        } catch (error) {
            console.error('Error reading from localStorage:', error);
            return null;
        }
    }
    return null;
};

export const setToLocalStorage = (key, value) => {
    if (typeof window !== 'undefined') {
        try {
            localStorage.setItem(key, value);
        } catch (error) {
            console.error('Error writing to localStorage:', error);
        }
    }
};