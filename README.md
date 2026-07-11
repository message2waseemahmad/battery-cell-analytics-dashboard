# Frontend Developer Challenge — Cell Analytics Dashboard

Welcome, and thank you for taking the time to complete this challenge.

You will work on a **battery cell test analytics dashboard** — a web application that engineers use to visualise and compare the degradation behaviour of lithium-ion battery cells over hundreds of charge–discharge cycles.

---

## Context

Battery cells from different production batches, chemistries, or test conditions are grouped into **cell groups**. Each group contains several individual cells (called *tests*), and each test produces measurements at regular cycle intervals.

Key measured properties (KPIs):

| Field | Description |
|---|---|
| `discharge_capacity_Ah` | Energy stored per cycle (capacity fade indicates ageing) |
| `soh_percent` | State of Health — capacity relative to initial value (%) |
| `dcir_mOhm` | DC Internal Resistance in milliohms (grows with ageing) |
| `discharge_energy_Wh` | Discharge energy per cycle |
| `charge_energy_Wh` | Charge energy per cycle |
| `coulombic_efficiency_percent` | Ratio of discharge to charge capacity (%) |

The mock dataset (`data/mock_data.json`) contains **4 cell groups × 5 cells × 22 cycle points = 440 data rows** and is fully representative of the data structures you would encounter in the real application.

---

## Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Start the development server
npm run dev

# 3. Open http://localhost:3000
```

The app redirects to the first workspace. Use the left sidebar to switch between workspaces. Each workspace shows several widgets; each widget renders a line chart of the configured KPI for all cells in the group.

> **Note on the data:** `data/mock_data.json` is pre-generated and committed to the repo.
> If you want to regenerate it run `npm run generate-data`.

---

## Tech Stack

| Layer | Library |
|---|---|
| Framework | Next.js 14 (App Router) |
| UI | React 18 + Tailwind CSS |
| Charts | Apache ECharts 5 |
| State | Redux Toolkit |

---

## Your Tasks

> ⏱️ **A note on time — please read this first.**
> We expect this to take **around 3–4 hours of focused work in total**. The per-task times below are **upper limits, not targets** — please don't exceed them, and don't spend evenings or a weekend on this.
>
> A clean, working solution that does the core of each task well is exactly what we want. **An incomplete but thoughtful submission beats an exhaustive one** — deciding what to leave out under a time constraint is part of what we're assessing. If you reach the cap, stop and tell us in your `SOLUTION.md` what you'd have done with more time.

### Task 1 — UX / UI Improvement

**Time cap: ~1 hour (a target of *one* good fix, not a redesign)**

The current UI is functional but was built for speed, not polish. Your job is to **identify real usability problems and fix at least one of them**.

Things to think about (non-exhaustive — feel free to find your own):

- How does the sidebar feel when there are many workspaces?
- Is it clear what each widget is showing at a glance?
- Are there obvious information hierarchy or spacing issues?
- What happens on smaller viewports?

**Deliverables**

1. A short written section in your submission (2–5 bullet points) listing the usability issues you identified and why they matter.
2. An implemented improvement for **at least one** of the issues — code change, not just a description. One well-executed fix is enough; please don't feel you need to address them all.

> There is no single correct answer here. We are interested in *how you think* about interfaces and *whether your code matches* your stated intention.

---

### Task 2 — Cell Group Box Plot Visualisation

**Time cap: ~2–2.5 hours (this is the main focus — spend most of your time here)**

Currently each chart shows one line per individual cell. When a group has many cells, the chart becomes cluttered and it is hard to see the group's typical behaviour or how much the cells vary.

**Build a new chart type — a box-plot view — that aggregates a cell group's data and shows:**

| Element | Definition |
|---|---|
| Centre line / dot | **Median** across all cells in the group at that cycle |
| Box (IQR) | 25th – 75th percentile (interquartile range) |
| Whiskers | Min / max values within 1.5 × IQR of the box edges |
| Outlier dots | Individual data points outside the whisker range |

The X-axis remains **cycle index**; the Y-axis is the selected KPI.

**Concrete requirements**

1. A `BoxPlotChart` component that accepts the same `data`, `testIds`, `xField`, `yField` props as `LineChart` and renders the aggregated view.
   Tip: ECharts has a built-in `boxplot` series type and a `transform` helper — check the ECharts docs.

2. A UI control in the Widget (or on the workspace page) that lets the user switch between the existing *individual lines* view and the new *box plot* view for any widget.

3. At minimum, the "Chemistry Benchmark" workspace should demonstrate the box plot view comparing cell groups side-by-side — either by default or via the toggle.

**You are free to decide:**
- How the toggle / selector looks (button, dropdown, icon…)
- Whether multiple cell groups appear on the same box plot chart
- Whether you build it inside `Widget.jsx` or create a separate component

> **Hint on the data shape for ECharts boxplot:**
> ECharts expects each data point as `[min, Q1, median, Q3, max]`.
> You will need to compute these statistics yourself from the raw `cycle_data` rows grouped by cycle index.

---

## Submission

Please send us:

- A link to your fork / branch, **or** a ZIP of the project
- A short `SOLUTION.md` (or section in this README) that covers:
  - Which UX problem you chose and why
  - Any decisions or trade-offs you made for the box plot implementation
  - Anything you would do differently with more time

---

## Evaluation Criteria

| Area | What we look at |
|---|---|
| **Correctness** | Does the box plot show statistically correct aggregations? |
| **Code quality** | Is the code readable, well-structured, and consistent with the existing patterns? |
| **UX thinking** | Is the identified usability problem real and well-reasoned? |
| **Component design** | Is the new component reusable and does it fit naturally into the existing architecture? |
| **Communication** | Does your SOLUTION.md clearly explain your decisions? |

We are **not** looking for a perfect pixel-perfect redesign or production-grade error handling, nor for you to complete every optional sub-task. A clean, working solution with clear thinking — delivered within the time cap above — beats an over-engineered one.

Good luck — feel free to reach out if anything is unclear.

