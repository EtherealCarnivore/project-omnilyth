/*
 * useZoomPan.js — Mouse wheel zoom + drag pan + touch pinch for SVG.
 *
 * Returns a ref to attach to the SVG container and the current transform.
 * Handles all pointer events so the consuming component just renders.
 */

import { useState, useRef, useCallback, useEffect } from 'react';
import { ZOOM_CONFIG as ATLAS_ZOOM_CONFIG } from '../data/atlas/atlasTreeConstants';

export default function useZoomPan(bounds, zoomConfig) {
  const config = zoomConfig || ATLAS_ZOOM_CONFIG;
  const containerRef = useRef(null);
  const [transform, setTransform] = useState({ x: 0, y: 0, scale: config.default });
  const isPanning = useRef(false);
  const didDrag = useRef(false);
  const lastPointer = useRef({ x: 0, y: 0 });
  const startPointer = useRef({ x: 0, y: 0 });
  const lastTouchDist = useRef(null);
  const DRAG_THRESHOLD = 3; // px — below this, treat as click

  // Fit the tree in the viewport
  const fitToView = useCallback(() => {
    if (!containerRef.current || !bounds) return;
    const rect = containerRef.current.getBoundingClientRect();
    const padding = config.fitPadding;

    const scaleX = (rect.width - padding * 2) / bounds.width;
    const scaleY = (rect.height - padding * 2) / bounds.height;
    const scale = Math.min(scaleX, scaleY, config.max);

    const cx = bounds.minX + bounds.width / 2;
    const cy = bounds.minY + bounds.height / 2;

    setTransform({
      x: rect.width / 2 - cx * scale,
      y: rect.height / 2 - cy * scale,
      scale,
    });
  }, [bounds]);

  // Zoom at a specific point
  const zoomAt = useCallback((clientX, clientY, delta) => {
    setTransform(prev => {
      const newScale = Math.min(
        config.max,
        Math.max(config.min, prev.scale * (1 + delta))
      );
      const ratio = newScale / prev.scale;

      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return { ...prev, scale: newScale };

      const px = clientX - rect.left;
      const py = clientY - rect.top;

      return {
        x: px - (px - prev.x) * ratio,
        y: py - (py - prev.y) * ratio,
        scale: newScale,
      };
    });
  }, []);

  // Mouse wheel zoom
  const onWheel = useCallback((e) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -config.step : config.step;
    zoomAt(e.clientX, e.clientY, delta);
  }, [zoomAt]);

  // Pan start — do NOT setPointerCapture so clicks reach child nodes
  const onPointerDown = useCallback((e) => {
    if (e.button !== 0 && e.button !== 1) return; // left or middle click
    isPanning.current = true;
    didDrag.current = false;
    lastPointer.current = { x: e.clientX, y: e.clientY };
    startPointer.current = { x: e.clientX, y: e.clientY };
  }, []);

  // Pan move — only start panning after exceeding drag threshold
  const onPointerMove = useCallback((e) => {
    if (!isPanning.current) return;

    const dx = e.clientX - lastPointer.current.x;
    const dy = e.clientY - lastPointer.current.y;

    // Check if we've moved beyond the drag threshold
    if (!didDrag.current) {
      const totalDx = e.clientX - startPointer.current.x;
      const totalDy = e.clientY - startPointer.current.y;
      if (Math.hypot(totalDx, totalDy) < DRAG_THRESHOLD) return;
      didDrag.current = true;
    }

    lastPointer.current = { x: e.clientX, y: e.clientY };
    setTransform(prev => ({ ...prev, x: prev.x + dx, y: prev.y + dy }));
  }, []);

  // Pan end
  const onPointerUp = useCallback(() => {
    isPanning.current = false;
  }, []);

  // Touch pinch zoom
  const onTouchStart = useCallback((e) => {
    if (e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      lastTouchDist.current = Math.hypot(dx, dy);
    }
  }, []);

  const onTouchMove = useCallback((e) => {
    if (e.touches.length === 2 && lastTouchDist.current !== null) {
      e.preventDefault();
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const dist = Math.hypot(dx, dy);
      const delta = (dist - lastTouchDist.current) / lastTouchDist.current;
      lastTouchDist.current = dist;

      const cx = (e.touches[0].clientX + e.touches[1].clientX) / 2;
      const cy = (e.touches[0].clientY + e.touches[1].clientY) / 2;
      zoomAt(cx, cy, delta);
    }
  }, [zoomAt]);

  const onTouchEnd = useCallback(() => {
    lastTouchDist.current = null;
  }, []);

  // Zoom in/out by step (for keyboard shortcuts and buttons)
  const zoomIn = useCallback(() => {
    setTransform(prev => ({
      ...prev,
      scale: Math.min(config.max, prev.scale * (1 + config.step)),
    }));
  }, []);

  const zoomOut = useCallback(() => {
    setTransform(prev => ({
      ...prev,
      scale: Math.max(config.min, prev.scale * (1 - config.step)),
    }));
  }, []);

  // Pan to a specific world coordinate (for "go to node")
  const panTo = useCallback((worldX, worldY) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setTransform(prev => ({
      ...prev,
      x: rect.width / 2 - worldX * prev.scale,
      y: rect.height / 2 - worldY * prev.scale,
    }));
  }, []);

  // Attach wheel listener with passive: false
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, [onWheel]);

  // Fit on initial load
  useEffect(() => {
    if (bounds) fitToView();
  }, [bounds, fitToView]);

  return {
    containerRef,
    transform,
    handlers: {
      onPointerDown,
      onPointerMove,
      onPointerUp,
      onTouchStart,
      onTouchMove,
      onTouchEnd,
    },
    zoomIn,
    zoomOut,
    fitToView,
    panTo,
  };
}
