/**
 * Shared easing curves. Typed as readonly tuples so they satisfy Framer
 * Motion's `BezierDefinition` (= readonly [number, number, number, number]).
 */
export const EASE = [0.16, 1, 0.3, 1] as const; // expo-out, cinematic
export const EASE_LUXE = [0.22, 1, 0.36, 1] as const; // gentle settle
