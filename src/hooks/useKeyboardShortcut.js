/**
 * useKeyboardShortcut
 * Custom hook for registering global keyboard shortcuts
 * Handles modifier keys (Ctrl, Cmd, Shift, Alt)
 */

import { useEffect } from 'react';

export function useKeyboardShortcut({
  key,
  ctrl = false,
  meta = false, // Cmd on Mac
  shift = false,
  alt = false,
  callback,
  enabled = true,
  preventDefault = true
}) {
  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (event) => {
      // Check modifier keys
      const ctrlPressed = ctrl && (event.ctrlKey || event.metaKey);
      const metaPressed = meta && event.metaKey;
      const shiftPressed = shift && event.shiftKey;
      const altPressed = alt && event.altKey;

      // Check if the key matches
      const keyMatches = event.key.toLowerCase() === key.toLowerCase();

      // All required modifiers must be pressed
      const modifiersMatch =
        (!ctrl || ctrlPressed) &&
        (!meta || metaPressed) &&
        (!shift || shiftPressed) &&
        (!alt || altPressed);

      if (keyMatches && modifiersMatch) {
        if (preventDefault) {
          event.preventDefault();
        }
        callback(event);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [key, ctrl, meta, shift, alt, callback, enabled, preventDefault]);
}

/**
 * Preset shortcut hooks for common patterns
 */

/**
 * Ctrl+G (or Cmd+G on Mac) - Global search
 */
export function useGlobalSearch(callback, enabled = true) {
  useKeyboardShortcut({
    key: 'g',
    ctrl: true,
    callback,
    enabled
  });
}

/**
 * Escape key - Close modals
 */
export function useEscapeKey(callback, enabled = true) {
  useKeyboardShortcut({
    key: 'Escape',
    callback,
    enabled,
    preventDefault: false // Let other handlers also process Escape
  });
}

/**
 * Ctrl+K (or Cmd+K on Mac) - Command palette style
 */
export function useCommandPalette(callback, enabled = true) {
  useKeyboardShortcut({
    key: 'k',
    ctrl: true,
    callback,
    enabled
  });
}

/**
 * Slash (/) - Quick search (like GitHub)
 */
export function useSlashSearch(callback, enabled = true) {
  useKeyboardShortcut({
    key: '/',
    callback,
    enabled,
    // Don't trigger if user is typing in an input
    preventDefault: false
  });

  // Additional check to avoid triggering in input fields
  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (event) => {
      // Ignore if user is typing in input/textarea
      const isInputField =
        event.target.tagName === 'INPUT' ||
        event.target.tagName === 'TEXTAREA' ||
        event.target.isContentEditable;

      if (!isInputField && event.key === '/') {
        event.preventDefault();
        callback(event);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [callback, enabled]);
}
