'use client';

/**
 * Widget
 * ──────────────────────────────────────────────────────────────────────────────
 * Card container that wraps a single chart/visualisation.
 *
 * Props:
 *   name      – widget title shown in the header
 *   data      – cycle_data rows for all tests that belong to this widget
 *   testIds   – ordered array of test IDs to render
 *   xField    – X-axis data key
 *   yField    – Y-axis data key (KPI)
 *   cellGroup – cell group object from mock_data (for the subtitle)
 */
import { useState } from 'react';
import LineChart from '@/components/Chart/LineChart';
import BoxPlotChart from '@/components/Chart/BoxPlotChart';

const KPI_LABELS = {
  discharge_capacity_Ah:        'Discharge Capacity (Ah)',
  soh_percent:                  'State of Health (%)',
  dcir_mOhm:                    'DC Internal Resistance (mΩ)',
  charge_energy_Wh:             'Charge Energy (Wh)',
  discharge_energy_Wh:          'Discharge Energy (Wh)',
  coulombic_efficiency_percent: 'Coulombic Efficiency (%)',
};

export default function Widget({ name, data, testIds, xField, yField, cellGroup }) {
  const yLabel = KPI_LABELS[yField] ?? yField;
  const [chartType, setChartType] = useState('line');

  return (
    <div className="bg-quaternary rounded-xl border border-gray-medium shadow-sm p-4">
      {/* ── Header ──────────────────────────────────────────────────── */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <h2 className="text-sm font-semibold text-primary leading-tight">{name}</h2>
          {cellGroup && (
            <p className="text-xs text-tertiary mt-0.5">
              {cellGroup.name}
            </p>
          )}
        </div>

        {/* Placeholder for future widget actions (fullscreen, settings…) */}
        <div className="flex rounded-md overflow-hidden border border-gray-300">
          <button
            onClick={() => setChartType('line')}
            className={`px-3 py-1 text-xs transition ${chartType === 'line'
                ? 'bg-primary text-white'
                : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
          >
            Line Chart
          </button>

          <button
            onClick={() => setChartType('box')}
            className={`px-3 py-1 text-xs transition ${chartType === 'box'
                ? 'bg-primary text-white'
                : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
          >
            Box Plot
          </button>

        </div>
      </div>

      {/* ── Chart ───────────────────────────────────────────────────── */}
      {/*
        Switch between the existing Line Chart and the new
        Box Plot view without changing the widget API.
      */}
       {chartType === 'line' ? (
        <LineChart
          data={data}
          testIds={testIds}
          xField={xField}
          yField={yField}
          yLabel={yLabel}
          height={300}
        />
      ) : (
        <BoxPlotChart
          data={data}
          testIds={testIds}
          xField={xField}
          yField={yField}
          yLabel={yLabel}
          height={300}
        />
      )}
    </div>
  );
}

