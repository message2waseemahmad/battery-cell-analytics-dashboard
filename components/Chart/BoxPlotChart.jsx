'use client';
/**
 * BoxPlotChart
 * ------------------------------------------------------------------
 * Renders a box plot summarizing the distribution of battery cell
 * values for each cycle using Apache ECharts.
 *
 * Props:
 *   data
 *   testIds
 *   xField
 *   yField
 *   yLabel
 *   height
 */

import { useEffect, useRef } from 'react';
import * as echarts from 'echarts/core';
import { BoxplotChart, ScatterChart } from 'echarts/charts';
import {
    GridComponent,
    TooltipComponent,
} from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';

// Register only the pieces we need (tree-shakeable)
echarts.use([
    BoxplotChart,
    ScatterChart,
    GridComponent,
    TooltipComponent,
    CanvasRenderer,
]);

// Calculates the median of a sorted numeric array.

function median(values) {
    const middle = Math.floor(values.length / 2);

    if (values.length % 2 === 0) {
        return (values[middle - 1] + values[middle]) / 2;
    }

    return values[middle];
}

// Accepts the same public API as LineChart so the Widget
// can switch between both chart types without changing props.
export default function BoxPlotChart({ data = [], testIds = [], xField, yField, yLabel, height = 300 }) {
    const containerRef = useRef(null);
    const instanceRef = useRef(null);

    // Build or update chart whenever data or config changes
    useEffect(() => {
        if (!containerRef.current) return;

        if (!instanceRef.current) {
            instanceRef.current = echarts.init(containerRef.current);
        }

        const instance = instanceRef.current;

        // Group all KPI measurements by cycle so we can calculate
        // the statistical summary for each cycle across all cells.
        const byCycle = {};
        for (const row of data) {
            const cycle = row[xField];

            if (!byCycle[cycle]) {
                byCycle[cycle] = [];
            }

            byCycle[cycle].push(row);

        }

        // Prepare chart categories (cycle numbers) and
        // the five-number summary required for each box plot.
        const boxData = [];
        const categories = [];
        const outlierData = [];


        for (const cycle in byCycle) {

            // Extract and sort KPI values for the current cycle.
            const values = byCycle[cycle]
                .map(row => row[yField])
                .sort((a, b) => a - b);

            categories.push(cycle);
            const cycleIndex = categories.length - 1;

            // Calculate the five-number summary for this cycle.


            const medianValue = median(values);

            // Split the sorted values into lower and upper halves
            // to calculate the first and third quartiles.

            const middle = Math.floor(values.length / 2);

            const lowerHalf = values.slice(0, middle);
            const upperHalf = values.slice(values.length % 2 ? middle + 1 : middle);

            const q1 = median(lowerHalf);
            const q3 = median(upperHalf);

            // Calculate the Interquartile Range (IQR)
            const iqr = q3 - q1;

            // Calculate whisker limits
            const lowerLimit = q1 - (1.5 * iqr);
            const upperLimit = q3 + (1.5 * iqr);

            // Find lower and upper whiskers using the 1.5 × IQR rule.
            const lowerWhisker =
                values.find(v => v >= lowerLimit) ?? values[0];

            const upperWhisker =
                values
                    .slice()
                    .reverse()
                    .find(v => v <= upperLimit) ?? values[values.length - 1];

            // Collect outliers
            values.forEach(value => {
                if (value < lowerLimit || value > upperLimit) {
                    outlierData.push([
                        cycleIndex,
                        value
                    ]);
                }
            });

            // Store the values in the format expected by the ECharts boxplot series.
            boxData.push([
                lowerWhisker,
                q1,
                medianValue,
                q3,
                upperWhisker
            ]);

        }

        // Render the box plot using the calculated statistics.
        instance.setOption({

            backgroundColor: '#FFFFFF',

            grid: {
                top: 40,
                right: 24,
                bottom: 56,
                left: 64,
                containLabel: true,
            },

            toolbox: {
                right: 8,
                feature: {
                    saveAsImage: { title: 'Save' },
                    dataZoom: { title: { zoom: 'Zoom', back: 'Reset' } }
                }
            },

            dataZoom: [
                { type: 'inside', xAxisIndex: 0 },
                { type: 'slider', xAxisIndex: 0, bottom: 4, height: 18 },
            ],

            tooltip: {
                trigger: 'item',
                backgroundColor: '#fff',
                borderColor: '#ddd',
                borderWidth: 1,
                textStyle: {
                    color: '#333',

                },


                formatter: (params) => {

                    if (!params.data) return '';
                    if (params.seriesType === 'scatter') {
                        return `
<b>Cycle: ${categories[params.data[0]]}</b><br/>
Outlier: ${Number(params.data[1]).toFixed(3)}
`;
                    }
                    const value = params.data;

                    return `
<b>Cycle: ${categories[params.dataIndex]}</b><br/><br/>
<b>${yLabel}</b><br/><br/>

Lower Whisker: ${Number(value[0]).toFixed(3)}<br/>
Q1: ${Number(value[1]).toFixed(3)}<br/>
Median: ${Number(value[2]).toFixed(3)}<br/>
Q3: ${Number(value[3]).toFixed(3)}<br/>
Upper Whisker: ${Number(value[4]).toFixed(3)}
`;
                }
            },

            xAxis: {
                type: 'category',
                data: categories,
                name: 'Cycle',
                boundaryGap: true,
                nameLocation: 'middle',
                nameGap: 30,
                axisTick: {
                    alignWithLabel: true
                },
                axisLine: {
                    lineStyle: {
                        color: '#999'
                    }
                }
            },

            yAxis: {
                type: 'value',
                name: yLabel,
                scale: true,
                splitLine: {
                    lineStyle: {
                        color: '#f2f2f2'
                    }
                }
            },
            // Render the box plot together with any detected outliers.
            series: [
                {
                    type: 'boxplot',
                    data: boxData,
                    boxWidth: ['40%', '70%'],
                    itemStyle: {
                        color: 'rgba(108,33,202,0.25)',
                        borderColor: '#6C21CA',
                        borderWidth: 2,

                    },
                    emphasis: {
                        itemStyle: {
                            borderColor: '#6C21CA',
                            borderWidth: 3,
                            color: 'rgba(108,33,202,0.35)'
                        }
                    }
                },
                {
                    type: 'scatter',
                    data: outlierData,
                    symbolSize: 6
                }
            ],
        });
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
