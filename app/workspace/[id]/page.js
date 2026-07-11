'use client';

import { useParams } from 'next/navigation';
import MainLayout from '@/components/Layout/MainLayout';
import Widget from '@/components/Widget/Widget';
import workspacesData from '@/data/workspaces.json';
import mockData from '@/data/mock_data.json';

export default function WorkspacePage() {
  const params = useParams();
  const workspaceId = parseInt(params.id, 10);

  const workspace = workspacesData.find((w) => w.id === workspaceId);

  if (!workspace) {
    return (
      <MainLayout>
        <div className="p-8">
          <p className="text-tertiary text-sm">Workspace not found.</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="p-6 max-w-6xl">
        {/* Workspace header */}
        <div className="mb-6">
          <h1 className="text-xl font-semibold text-primary">{workspace.name}</h1>
          <p className="text-sm text-tertiary mt-1">{workspace.description}</p>
        </div>

        {/* Widget grid */}
        <div className="flex flex-col gap-5">
          {workspace.widgets.map((widgetConfig) => {
            const group = mockData.cell_groups.find(
              (g) => g.id === widgetConfig.cell_group_id,
            );
            const groupTestIds = group?.test_ids ?? [];
            const widgetData = mockData.cycle_data.filter((d) =>
              groupTestIds.includes(d.test_id),
            );

            return (
              <Widget
                key={widgetConfig.id}
                name={widgetConfig.name}
                data={widgetData}
                testIds={groupTestIds}
                xField="cycle_index"
                yField={widgetConfig.kpi}
                cellGroup={group}
              />
            );
          })}
        </div>
      </div>
    </MainLayout>
  );
}
