/*
 * GameAwareIndex.jsx — Renders the right home page based on active game.
 *
 * When a user lands on `/` (the index route):
 *  - PoE 1 mode → render <HomePage />, exactly as before dual-game.
 *  - PoE 2 mode → redirect to /poe2 so they see the PoE 2 surface.
 *
 * Why redirect rather than render Poe2HomePage in place? Because the URL
 * matters. A returning PoE 2 user who shares the link they're on should
 * share /poe2, not / — otherwise the recipient (whose game state is their
 * own) can't tell which game the share refers to.
 *
 * Wrapped in a thin component so the redirect logic is reusable / testable
 * without leaking into App.jsx's route table.
 */
import { Navigate } from 'react-router-dom';
import { useGame } from '../contexts/GameContext';
import HomePage from '../pages/HomePage';

export default function GameAwareIndex() {
  const { game } = useGame();
  if (game === 'poe2') return <Navigate to="/poe2" replace />;
  return <HomePage />;
}
