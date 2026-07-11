import { createSlice } from '@reduxjs/toolkit';

/**
 * workspaceSlice
 * ──────────────────────────────────────────────────────────────────────────────
 * Manages the ordered list of workspaces shown in the sidebar and which one is
 * currently active.
 *
 * The workspace *configuration* (which widgets / KPIs to show) lives in
 * data/workspaces.json and is read directly by the workspace page.
 * This slice only owns navigation state so that UI re-ordering is decoupled
 * from the data layer.
 */

const initialWorkspaces = [
  { id: 1, name: 'NMC622 Aging Study' },
  { id: 2, name: 'Temperature Comparison' },
  { id: 3, name: 'Chemistry Benchmark' },
];

const workspaceSlice = createSlice({
  name: 'workspace',
  initialState: {
    workspaces:        initialWorkspaces,
    activeWorkspaceId: 1,
  },
  reducers: {
    setActiveWorkspace(state, action) {
      state.activeWorkspaceId = action.payload;
    },

    /**
     * reorderWorkspaces
     * Moves the workspace at `fromIndex` to `toIndex`.
     *
     * TODO (Bonus Task): hook this action up to a drag-and-drop interaction
     * in the Menu component.
     *
     * @param action.payload { fromIndex: number, toIndex: number }
     */
    reorderWorkspaces(state, action) {
      const { fromIndex, toIndex } = action.payload;
      const items = [...state.workspaces];
      const [moved] = items.splice(fromIndex, 1);
      items.splice(toIndex, 0, moved);
      state.workspaces = items;
    },
  },
});

export const { setActiveWorkspace, reorderWorkspaces } = workspaceSlice.actions;
export default workspaceSlice.reducer;
