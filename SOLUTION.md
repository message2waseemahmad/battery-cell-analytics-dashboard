# Solution

## Task 1 – UX / UI Improvement

### Identified usability issues

While reviewing the dashboard, I identified the following usability issues:

- Only individual cell line charts were available, making it difficult to understand the overall behaviour of a cell group.
- There was no quick way to switch between detailed cell-level data and an aggregated statistical view.
- Comparing degradation trends across multiple cells required visually tracking several overlapping lines.

### Implemented improvement

I added a chart type toggle to each widget, allowing users to switch between:

- **Line Chart** – displays the degradation trend of each individual cell.
- **Box Plot** – displays the statistical distribution of all cells for each cycle.

This provides users with both detailed and aggregated views without changing the existing workflow. The existing Line Chart functionality remains unchanged, while the Box Plot offers a higher-level statistical summary for easier comparison across the cell group.

---

## Task 2 – Cell Group Box Plot

### Implementation

I created a reusable `BoxPlotChart` component that accepts the same public API as the existing `LineChart` component, allowing it to integrate seamlessly with the current widget architecture.

For each cycle, the component:

- Groups all cell measurements by cycle.
- Sorts the KPI values.
- Calculates the median, first quartile (Q1), and third quartile (Q3).
- Calculates the Interquartile Range (IQR).
- Determines the lower and upper whiskers using the standard **1.5 × IQR** rule.
- Detects outliers and renders them as a separate scatter series.

The calculated statistics are rendered as a box plot using Apache ECharts. The implementation follows the standard box plot definition by using the **1.5 × IQR** rule for whisker calculation and rendering values outside the whisker range as outliers.

The existing Line Chart functionality is preserved, allowing users to switch seamlessly between both visualisations using the chart toggle.

The quartile, IQR, whisker, and outlier calculations were manually validated against sample cycle data to ensure the computed statistics matched the expected values.

---

## Design Decisions

- Implemented the statistical calculations directly in JavaScript instead of using the ECharts dataset transform. This keeps the statistical logic explicit, easier to verify and debug, and independent of chart-specific transformations. Given the small size of the mock dataset, the additional abstraction provided by the transform helper was not necessary for this implementation.
- Reused the existing widget structure to minimise changes to the overall application architecture.
- Kept the `BoxPlotChart` component API consistent with the existing `LineChart`, allowing both chart types to be swapped without changing the widget interface.
- Kept the styling consistent with the existing dashboard to provide a familiar user experience.

---

## Trade-offs

The statistical calculations are currently implemented directly inside the `BoxPlotChart` component. Given the scope and time constraints of this take-home assignment, keeping the calculations close to the visualisation made the implementation easier to understand while avoiding unnecessary abstractions.

In a larger production application, I would extract the statistical calculations into a dedicated utility module and add comprehensive unit tests to validate the statistical logic independently of the chart component.

With additional time, I would also:

- Add unit tests covering quartile, whisker, and outlier calculations.
- Improve accessibility, including keyboard navigation and screen-reader support.
- Add configurable styling options for different KPI visualisations.
- Support additional statistical calculation methods if required for different analysis requirements.

---

## Notes

The `BoxPlotChart` component is reusable and supports all KPIs currently available in the dashboard, including:

- Discharge Capacity
- State of Health
- DC Internal Resistance
- Charge Energy
- Discharge Energy
- Coulombic Efficiency

---

## Assumptions

- Each cycle contains measurements for all cells within a cell group.
- The mock dataset contains five cells per cycle, making the statistical calculations lightweight while still demonstrating the required box plot behaviour.