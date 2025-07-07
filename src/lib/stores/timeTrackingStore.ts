import { writable } from 'svelte/store';
import { browser } from '$app/environment';

const LOCAL_STORAGE_KEY = 'active_timer';

export interface TimerData {
	startTime: string;
	text: string;
	project: string;
	url: string;
}

// Function to load state from localStorage
function loadState(): Map<string, TimerData> {
    if (browser) {
        const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                // Reconstruct Map from plain object if necessary
                return new Map(parsed);
            } catch (e) {
                console.error('Error parsing stored active timer:', e);
                return new Map();
            }
        }
    }
    return new Map();
}

// Initialize the store with the loaded state
export const activeTimers = writable<Map<string, TimerData>>(loadState());

// Subscribe to store changes and save to localStorage
activeTimers.subscribe((value) => {
    if (browser) {
        // Convert Map to an array of [key, value] pairs for JSON serialization
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(Array.from(value.entries())));
    }
});