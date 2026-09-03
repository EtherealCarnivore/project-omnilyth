/**
 * FeedbackButton - User feedback submission to GitHub Issues
 *
 * Allows users to submit bugs, UI issues, suggestions, and feature requests
 * without needing a GitHub account. Submissions are proxied through
 * serverless function and created as GitHub issues.
 */

import { useState, useEffect, useRef, useId } from 'react';
import { createPortal } from 'react-dom';
import { feedbackUrl } from '../utils/proxyUrl';

const FEEDBACK_TYPES = [
  { value: 'bug', label: 'Bug Report', emoji: '🐛', description: 'Something isn\'t working' },
  { value: 'ui', label: 'UI Issue', emoji: '🎨', description: 'Visual or design problem' },
  { value: 'suggestion', label: 'Suggestion', emoji: '💡', description: 'Idea for improvement' },
  { value: 'feature', label: 'Feature Request', emoji: '✨', description: 'New feature idea' },
];

export default function FeedbackButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [type, setType] = useState('bug');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState(null); // null | 'success' | 'error'
  const [errorMessage, setErrorMessage] = useState('');
  const titleId = useId();
  const triggerRef = useRef(null);

  const handleOpen = () => {
    setIsOpen(true);
    setStatus(null);
    setErrorMessage('');
  };

  // Esc closes; focus returns to the trigger. On a phone the on-screen keyboard
  // covers the lower half of this dialog, so the panel is also height-capped to
  // the *visual* viewport (dvh) below and scrolls independently.
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => {
      if (e.key === 'Escape' && !submitting) handleClose();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      triggerRef.current?.focus();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, submitting]);

  const handleClose = () => {
    if (submitting) return;
    setIsOpen(false);
    // Reset form after close animation
    setTimeout(() => {
      setType('bug');
      setTitle('');
      setDescription('');
      setStatus(null);
      setErrorMessage('');
    }, 300);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate
    if (!title.trim() || !description.trim()) {
      setStatus('error');
      setErrorMessage('Please fill in all fields');
      return;
    }

    setSubmitting(true);
    setStatus(null);
    setErrorMessage('');

    try {
      // Get current page URL and user agent
      const url = window.location.href;
      const userAgent = navigator.userAgent;

      const response = await fetch(feedbackUrl(), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type,
          title: title.trim(),
          description: description.trim(),
          url,
          userAgent,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit feedback');
      }

      // Success!
      setStatus('success');

      // Auto-close after 2 seconds
      setTimeout(() => {
        handleClose();
      }, 2000);

    } catch (error) {
      console.error('Feedback submission error:', error);
      setStatus('error');
      setErrorMessage(error.message || 'Failed to submit. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const selectedType = FEEDBACK_TYPES.find(t => t.value === type);

  return (
    <>
      {/* Feedback Button in Topbar */}
      <button
        ref={triggerRef}
        onClick={handleOpen}
        className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.08] transition-colors"
        title="Send Feedback"
        aria-label="Send feedback"
        aria-haspopup="dialog"
        aria-expanded={isOpen}
      >
        <svg aria-hidden="true" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
        </svg>
      </button>

      {/* Modal - Using Portal */}
      {isOpen && createPortal(
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md"
          onClick={handleClose}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className="glass-card rounded-xl p-4 sm:p-6 max-w-lg w-full space-y-4 max-h-[90dvh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between">
              <h3 id={titleId} className="text-xl font-bold text-zinc-100">Send Feedback</h3>
              <button
                onClick={handleClose}
                disabled={submitting}
                className="inline-flex min-h-11 min-w-11 items-center justify-center text-zinc-400 hover:text-white transition-colors disabled:opacity-50"
                aria-label="Close"
              >
                <svg aria-hidden="true" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Type Selector */}
              <div className="space-y-2">
                {/* Not a <label>: there is no single control to label. A named
                    group + aria-pressed on each option is the correct mapping
                    for a button-based single-select (4.1.2). */}
                <span id="feedback-type-label" className="block text-sm font-medium text-zinc-300">
                  Feedback Type <span className="text-red-400" aria-hidden="true">*</span>
                  <span className="sr-only">(required)</span>
                </span>
                <div className="grid grid-cols-2 gap-2" role="group" aria-labelledby="feedback-type-label">
                  {FEEDBACK_TYPES.map(({ value, label, emoji, description }) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setType(value)}
                      aria-pressed={type === value}
                      className={`p-3 rounded-lg border text-left transition-all ${
                        type === value
                          ? 'bg-sky-500/10 border-sky-400/30 ring-1 ring-sky-400/30'
                          : 'bg-zinc-900/60 border-white/[0.08] hover:border-white/[0.15]'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-lg" aria-hidden="true">{emoji}</span>
                        <span className="text-sm font-medium text-zinc-100">{label}</span>
                      </div>
                      <p className="text-xs text-zinc-400">{description}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Title Input */}
              <div className="space-y-2">
                <label htmlFor="feedback-title" className="text-sm font-medium text-zinc-300">
                  Title <span className="text-red-400">*</span>
                </label>
                <input
                  id="feedback-title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  maxLength={200}
                  placeholder={`Brief ${selectedType.label.toLowerCase()} description`}
                  disabled={submitting}
                  className="calc-input w-full text-left"
                  style={{ minHeight: '44px', fontSize: 'max(16px, 1rem)' }}
                />
                <div className="text-xs text-zinc-500 text-right">
                  {title.length}/200 characters
                </div>
              </div>

              {/* Description Textarea */}
              <div className="space-y-2">
                <label htmlFor="feedback-description" className="text-sm font-medium text-zinc-300">
                  Description <span className="text-red-400">*</span>
                </label>
                <textarea
                  id="feedback-description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  maxLength={5000}
                  rows={6}
                  placeholder="Detailed description... (steps to reproduce for bugs, specific suggestions for improvements)"
                  disabled={submitting}
                  className="calc-input w-full text-left resize-none"
                  style={{ fontSize: 'max(16px, 1rem)' }}
                />
                <div className="text-xs text-zinc-500 text-right">
                  {description.length}/5000 characters
                </div>
              </div>

              {/* Status Messages */}
              {status === 'success' && (
                <div role="status" aria-live="polite" className="flex items-center gap-2 text-green-400 bg-green-400/10 rounded-lg p-3 border border-green-400/20">
                  <svg aria-hidden="true" className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-sm font-medium">Feedback submitted successfully! Thank you.</span>
                </div>
              )}

              {status === 'error' && (
                <div role="alert" aria-live="assertive" className="flex items-center gap-2 text-red-400 bg-red-400/10 rounded-lg p-3 border border-red-400/20">
                  <svg aria-hidden="true" className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-sm">{errorMessage}</span>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting || !title.trim() || !description.trim()}
                aria-busy={submitting}
                className="w-full min-h-11 py-3 rounded-lg bg-sky-500/20 border border-sky-400/30 text-sky-400 font-medium hover:bg-sky-500/30 hover:border-sky-400/40 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg aria-hidden="true" className="motion-safe:animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Submitting...
                  </span>
                ) : (
                  `Submit ${selectedType.label}`
                )}
              </button>
            </form>

            {/* Info Footer */}
            <div className="pt-3 border-t border-white/5">
              <p className="text-xs text-zinc-500 text-center">
                Your feedback will be submitted as a GitHub issue. No account required.
              </p>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
