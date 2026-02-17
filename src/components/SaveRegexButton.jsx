/**
 * SaveRegexButton Component
 *
 * Reusable button for saving regex patterns to the library.
 * Uses React Portal to prevent modal clipping by parent containers.
 */

import { useState } from 'react';
import { createPortal } from 'react-dom';
import { useRegexLibrary } from '../hooks/useRegexLibrary';

export default function SaveRegexButton({ pattern, toolId, toolLabel, defaultName, variant = 'default' }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [patternName, setPatternName] = useState('');
  const [saveStatus, setSaveStatus] = useState(null); // null | 'success' | 'error'
  const [errorMessage, setErrorMessage] = useState('');

  const { add, exists, storageInfo } = useRegexLibrary();

  // Auto-generate name on modal open
  const handleOpenModal = () => {
    if (!pattern || pattern.trim() === '') {
      setErrorMessage('No pattern to save');
      setSaveStatus('error');
      return;
    }

    // Generate default name based on tool and timestamp
    const timestamp = new Date().toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
    const autoName = defaultName || `${toolLabel} - ${timestamp}`;

    setPatternName(autoName);
    setSaveStatus(null);
    setErrorMessage('');
    setIsModalOpen(true);
  };

  // Save pattern
  const handleSave = async () => {
    // Validate
    if (!patternName.trim()) {
      setErrorMessage('Pattern name is required');
      setSaveStatus('error');
      return;
    }

    if (patternName.length > 50) {
      setErrorMessage('Pattern name must be 50 characters or less');
      setSaveStatus('error');
      return;
    }

    // Check if pattern already exists
    if (exists(pattern)) {
      setErrorMessage('This pattern is already saved');
      setSaveStatus('error');
      return;
    }

    // Check storage limit
    if (storageInfo.nearLimit) {
      setErrorMessage(`Storage almost full (${storageInfo.percentUsed}%). Consider deleting old patterns.`);
      // Allow save but warn
    }

    // Save
    const result = await add({
      name: patternName.trim(),
      pattern: pattern.trim(),
      tool: toolId,
      toolLabel: toolLabel
    });

    if (result.success) {
      setSaveStatus('success');
      setTimeout(() => {
        setIsModalOpen(false);
        setSaveStatus(null);
      }, 1500);
    } else {
      setSaveStatus('error');
      setErrorMessage(result.message || 'Failed to save pattern');
    }
  };

  // Close modal
  const handleClose = () => {
    setIsModalOpen(false);
    setSaveStatus(null);
    setErrorMessage('');
  };

  // Button styles based on variant
  const buttonClassName = variant === 'compact'
    ? "flex-1 px-3 py-1.5 text-xs font-medium rounded-lg transition-all bg-zinc-900/80 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800"
    : "glass-card px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-poe-gold/10 transition-colors focus:outline-none focus:ring-2 focus:ring-poe-gold/50";

  const buttonStyle = variant === 'compact' ? {} : { minHeight: '44px' };
  const iconClassName = variant === 'compact' ? "w-4 h-4 inline mr-1" : "w-5 h-5";
  const showText = variant === 'default';

  return (
    <>
      {/* Save Button */}
      <button
        onClick={handleOpenModal}
        className={buttonClassName}
        style={buttonStyle}
        aria-label="Save regex pattern"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={iconClassName}
        >
          <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
          <polyline points="17 21 17 13 7 13 7 21" />
          <polyline points="7 3 7 8 15 8" />
        </svg>
        {showText && <span className="font-medium">Save Pattern</span>}
        {!showText && <span>Save</span>}
      </button>

      {/* Save Modal - Using Portal to prevent clipping */}
      {isModalOpen && createPortal(
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md"
          onClick={handleClose}
        >
          <div
            className="glass-card rounded-xl p-6 max-w-md w-full space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-poe-gold">Save Regex Pattern</h3>
              <button
                onClick={handleClose}
                className="text-zinc-400 hover:text-white transition-colors p-1"
                aria-label="Close modal"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-6 h-6"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {/* Tool Label */}
            <div className="text-sm text-zinc-400">
              Tool: <span className="text-white font-medium">{toolLabel}</span>
            </div>

            {/* Pattern Preview */}
            <div className="space-y-1">
              <label className="text-sm text-zinc-400">Pattern:</label>
              <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-3 text-sm font-mono
                            text-white overflow-x-auto max-h-32">
                {pattern}
              </div>
            </div>

            {/* Name Input */}
            <div className="space-y-2">
              <label htmlFor="pattern-name" className="text-sm text-zinc-400">
                Pattern Name: <span className="text-red-500">*</span>
              </label>
              <input
                id="pattern-name"
                type="text"
                value={patternName}
                onChange={(e) => setPatternName(e.target.value)}
                maxLength={50}
                className="w-full bg-zinc-900/50 border border-zinc-800 rounded-lg px-4 py-2 text-white
                         focus:outline-none focus:ring-2 focus:ring-poe-gold/50 focus:border-poe-gold"
                style={{ minHeight: '44px', fontSize: 'max(16px, 1rem)' }}
                placeholder="Enter a name for this pattern"
                autoFocus
              />
              <div className="text-xs text-zinc-400 text-right">
                {patternName.length}/50 characters
              </div>
            </div>

            {/* Status Message */}
            {saveStatus === 'success' && (
              <div className="flex items-center gap-2 text-green-500 bg-green-500/10 rounded-lg p-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-5 h-5 flex-shrink-0"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span className="font-medium">Pattern saved successfully!</span>
              </div>
            )}

            {saveStatus === 'error' && errorMessage && (
              <div className="flex items-start gap-2 text-red-500 bg-red-500/10 rounded-lg p-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-5 h-5 flex-shrink-0 mt-0.5"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="15" y1="9" x2="9" y2="15" />
                  <line x1="9" y1="9" x2="15" y2="15" />
                </svg>
                <span className="text-sm">{errorMessage}</span>
              </div>
            )}

            {/* Storage Info Warning */}
            {storageInfo.nearLimit && saveStatus !== 'error' && (
              <div className="flex items-start gap-2 text-yellow-500 bg-yellow-500/10 rounded-lg p-3 text-sm">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-5 h-5 flex-shrink-0 mt-0.5"
                >
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                  <line x1="12" y1="9" x2="12" y2="13" />
                  <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
                <span>
                  Storage {storageInfo.percentUsed}% full. ~{storageInfo.estimatedSlotsRemaining} patterns remaining.
                </span>
              </div>
            )}

            {/* Action Buttons */}
            {saveStatus !== 'success' && (
              <div className="flex gap-3 pt-2">
                <button
                  onClick={handleClose}
                  className="flex-1 glass-card px-4 py-2 rounded-lg hover:bg-zinc-700/30 transition-colors
                           focus:outline-none focus:ring-2 focus:ring-zinc-500/50"
                  style={{ minHeight: '44px' }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="flex-1 bg-poe-gold hover:bg-poe-gold-bright text-zinc-950 font-bold px-4 py-2
                           rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-poe-gold/50"
                  style={{ minHeight: '44px' }}
                >
                  Save Pattern
                </button>
              </div>
            )}
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
