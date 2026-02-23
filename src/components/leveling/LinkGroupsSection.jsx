/**
 * LinkGroupsSection
 * Renders all link groups from PoB import in a responsive grid.
 * Designed to be used as tab content (no wrapper card, no collapse toggle).
 */
import { useLevelingPlan } from '../../contexts/LevelingPlanContext';
import LinkGroupCard from './LinkGroupCard';

export default function LinkGroupsSection() {
  const { linkGroups } = useLevelingPlan();

  if (!linkGroups || linkGroups.length === 0) {
    return (
      <div className="glass-card rounded-xl p-8 text-center">
        <svg className="w-10 h-10 text-zinc-600 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m9.86-2.54a4.5 4.5 0 00-1.242-7.244l-4.5-4.5a4.5 4.5 0 00-6.364 6.364L4.34 8.342" />
        </svg>
        <p className="text-zinc-400 text-sm">No link groups yet</p>
        <p className="text-xs text-zinc-600 mt-1">Import a PoB build to see gem link setups</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
      {linkGroups.map(group => (
        <LinkGroupCard key={group.id} group={group} />
      ))}
    </div>
  );
}
