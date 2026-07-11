'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSelector } from 'react-redux';

export default function Menu() {
  const pathname = usePathname();
  const workspaces = useSelector((state) => state.workspace.workspaces);

  return (
    <aside className="w-60 h-screen bg-primary flex flex-col shrink-0">
      {/* ── Logo / Header ──────────────────────────────────────────── */}
      <div className="px-4 py-5 border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-unique-2 rounded-md flex items-center justify-center shrink-0">
            <span className="text-white text-xs font-bold select-none">CA</span>
          </div>
          <span className="text-quaternary font-semibold text-sm leading-tight">
            Cell Analytics
          </span>
        </div>
      </div>

      {/* ── Workspace List ─────────────────────────────────────────── */}
      <div className="flex-1 p-3 overflow-y-auto">
        <p className="text-white/40 text-xs uppercase tracking-wider mb-2 px-2">
          Workspaces
        </p>

        {/*
          TODO (Task 1 / UX improvement):
          Consider how this list could be improved as the number of
          workspaces grows.

          TODO (Bonus Task):
          Implement drag-and-drop reordering. The Redux slice already
          exposes a `reorderWorkspaces` action you can use to persist
          the new order.
        */}
        <nav className="flex flex-col gap-1">
          {workspaces.map((workspace) => {
            const isActive = pathname === `/workspace/${workspace.id}`;
            return (
              <Link
                key={workspace.id}
                href={`/workspace/${workspace.id}`}
                className={[
                  'flex items-center px-3 py-2 rounded-lg text-sm transition-colors duration-150',
                  isActive
                    ? 'bg-unique-2 text-white font-medium'
                    : 'text-white/70 hover:bg-white/10 hover:text-white',
                ].join(' ')}
              >
                {workspace.name}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* ── Footer ─────────────────────────────────────────────────── */}
      <div className="px-4 py-3 border-t border-white/10">
        <p className="text-white/30 text-xs">Cell Analytics · Challenge v1.0</p>
      </div>
    </aside>
  );
}
