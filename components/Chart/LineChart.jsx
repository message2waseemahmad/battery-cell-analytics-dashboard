'use client';

/**
 * LineChart
 * ──────────────────────────────────────────────────────────────────────────────
 * Renders one time-series line per test cell using Apache ECharts.
 *
 * Props:
 *   data      – array of cycle_data rows (from mock_data.json)
 *   testIds   – ordered array of test IDs to render (one line each)
 *   xField    – key to use as X value (e.g. "cycle_index")
 *   yField    – key to use as Y value (e.g. "discharge_capacity_Ah")
 *   yLabel    – human-readable Y-axis label
 *   height    – chart height in px (default 300)
 */

import { useEffect, useRef } from 'react';
import * as echarts from 'echarts/core';
import { LineChart as EchartsLineChart } from 'echarts/charts';
import {
  GridComponent,
  TooltipComponent,
  LegendComponent,
  ToolboxComponent,
  DataZoomComponent,
} from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';

// Register only the pieces we need (tree-shakeable)
echarts.use([
  EchartsLineChart,
  GridComponent,
  TooltipComponent,
  LegendComponent,
  ToolboxComponent,
  DataZoomComponent,
  CanvasRenderer,
]);

// Matches the chart color palette used in production
const SERIES_COLORS = [
  '#6C21CA', '#2CA02C', '#FF7F0E', '#1F77B4', '#D62728',
  '#8C564B', '#E377C2', '#7F7F7F', '#BCBD22', '#17BECF',
];

export default function LineChart({ data = [], testIds = [], xField, yField, yLabel, height = 300 }) {
  const containerRef = useRef(null);
  const instanceRef  = useRef(null);

  // Build / update chart whenever data or config changes
  useEffect(() => {
    if (!containerRef.current) return;

    if (!instanceRef.current) {
      instanceRef.current = echarts.init(containerRef.current);
    }

    const instance = instanceRef.current;

    // Group rows by test_id
    const byTest = {};
    for (const row of data) {
      if (!byTest[row.test_id]) byTest[row.test_id] = [];
      byTest[row.test_id].push(row);
    }

    const series = testIds.map((id, idx) => {
      const rows = (byTest[id] ?? []).sort((a, b) => a[xField] - b[xField]);
      return {
        name:      `Cell ${id}`,
        type:      'line',
        smooth:    true,
        data:      rows.map((r) => [r[xField], r[yField]]),
        lineStyle: { width: 2, color: SERIES_COLORS[idx % SERIES_COLORS.length] },
        itemStyle: { color: SERIES_COLORS[idx % SERIES_COLORS.length] },
        symbol:    'circle',
        symbolSize: 4,
      };
    });

    instance.setOption(
      {
        backgroundColor: '#FFFFFF',
        grid: { top: 40, right: 24, bottom: 56, left: 64, containLabel: true },
        tooltip: {
          trigger:     'axis',
          axisPointer: { type: 'cross', crossStyle: { color: '#B7C0C6' } },
          textStyle:   { fontSize: 12 },
        },
        legend: {
          top:       8,
          textStyle: { color: '#626262', fontSize: 11 },
        },
        toolbox: {
          right: 8,
          feature: {
            saveAsImage: { title: 'Save' },
            dataZoom:    { title: { zoom: 'Zoom', back: 'Reset' } },
          },
        },
        dataZoom: [
          { type: 'inside', xAxisIndex: 0 },
          { type: 'slider', xAxisIndex: 0, bottom: 4, height: 18 },
        ],
        xAxis: {
          type:          'value',
          name:          'Cycle',
          nameLocation:  'middle',
          nameGap:       28,
          nameTextStyle: { color: '#626262', fontSize: 12 },
          axisLabel:     { color: '#626262', fontSize: 11 },
          splitLine:     { lineStyle: { color: '#F5F5F5' } },
        },
        yAxis: {
          type:          'value',
          name:          yLabel ?? yField,
          nameLocation:  'middle',
          nameGap:       52,
          nameTextStyle: { color: '#626262', fontSize: 12 },
          axisLabel:     { color: '#626262', fontSize: 11 },
          splitLine:     { lineStyle: { color: '#F5F5F5' } },
        },
        series,
      },
      true, // notMerge – replace the whole config on each update
    );
  }, [data, testIds, xField, yField, yLabel]);

  // Handle window resize and cleanup
  useEffect(() => {
    const onResize = () => instanceRef.current?.resize();
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
      instanceRef.current?.dispose();
      instanceRef.current = null;
    };
  }, []);

  return <div ref={containerRef} style={{ width: '100%', height }} />;
}
