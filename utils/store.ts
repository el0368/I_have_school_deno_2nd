import { signal } from "@preact/signals";

// ============================================================================
// Sovereign Academy Global State Store
// ============================================================================
// Use these signals to share state across Islands without prop-drilling.

// Tracks the current active lesson the student is viewing
export const currentLessonId = signal<string | null>(null);

// Tracks the student's mastery score for the active session
export const sessionScore = signal<number>(0);

// Example global UI toggles
export const isMathKeyboardOpen = signal<boolean>(false);
export const isDarkMode = signal<boolean>(false);
