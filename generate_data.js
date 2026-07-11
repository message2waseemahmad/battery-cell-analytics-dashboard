// generate_data.js
// Run with: node generate_data.js
// Generates deterministic mock battery cell test data into data/mock_data.json

const fs = require('fs');
const path = require('path');

// Mulberry32 seeded pseudo-random number generator (deterministic, reproducible)
function mulberry32(seed) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// ─── Group definitions ────────────────────────────────────────────────────────
// k  = capacity fade coefficient  (SOH = 1 - k * sqrt(cycle))
// g  = DCIR growth coefficient     (DCIR = R0 * (1 + g * cycle))
const GROUPS = [
  { id: 1, name: 'NMC622 | 25 °C | C/2', chemistry: 'NMC622', temperature_C: 25, c_rate: 'C/2', k: 0.00354, g: 0.0010 },
  { id: 2, name: 'NMC811 | 25 °C | C/2', chemistry: 'NMC811', temperature_C: 25, c_rate: 'C/2', k: 0.00566, g: 0.0015 },
  { id: 3, name: 'NMC622 | 45 °C | C/2', chemistry: 'NMC622', temperature_C: 45, c_rate: 'C/2', k: 0.00849, g: 0.0023 },
  { id: 4, name: 'LFP    | 25 °C | C/2', chemistry: 'LFP',    temperature_C: 25, c_rate: 'C/2', k: 0.00212, g: 0.0006 },
];

const CELLS_PER_GROUP = 5;
const NOMINAL_CAPACITY_AH = 3.0;
const NOMINAL_DCIR_MOHM   = 45.0;
const NOMINAL_VOLTAGE_V   = 3.65; // average discharge voltage

// Cycle indices to record (sparse sampling – matches real-world test cadence)
const CYCLES = [
  1, 5, 10, 20, 30, 40, 50, 60, 70, 80,
  90, 100, 110, 120, 130, 140, 150, 160, 170, 180, 190, 200,
];

// ─── Data generation ─────────────────────────────────────────────────────────
const cell_groups = [];
const tests       = [];
const cycle_data  = [];

let testId = 101;

for (const group of GROUPS) {
  const groupTestIds = [];

  for (let cellIdx = 0; cellIdx < CELLS_PER_GROUP; cellIdx++) {
    const rng = mulberry32(group.id * 1337 + cellIdx * 97 + 42);

    // Per-cell initial parameter scatter
    const C0   = NOMINAL_CAPACITY_AH * (1 + (rng() - 0.5) * 0.04); // ±2 %
    const R0   = NOMINAL_DCIR_MOHM   * (1 + (rng() - 0.5) * 0.10); // ±5 %
    const kC   = group.k * (1 + (rng() - 0.5) * 0.30);             // ±15 % fade rate
    const gC   = group.g * (1 + (rng() - 0.5) * 0.40);             // ±20 % DCIR growth

    groupTestIds.push(testId);
    tests.push({
      id: testId,
      cell_group_id: group.id,
      initial_capacity_Ah: +C0.toFixed(3),
      initial_dcir_mOhm:   +R0.toFixed(1),
    });

    for (const cycle of CYCLES) {
      const nRng = mulberry32(testId * 9973 + cycle * 31);
      const noise = nRng() - 0.5; // uniform [-0.5, 0.5]

      // Capacity (sqrt-of-cycle fade model + small measurement noise)
      const capacity = Math.max(
        C0 * 0.60,
        C0 * (1 - kC * Math.sqrt(cycle)) + noise * 0.005,
      );

      // DCIR (linear growth + small noise)
      const dcir = R0 * (1 + gC * cycle) + noise * 0.6;

      const soh = (capacity / C0) * 100;

      // Coulombic efficiency (converges to ~99.5 % after formation)
      const ce = 99.5 - 0.0008 * cycle + noise * 0.06;

      const dischargeEnergy = capacity * NOMINAL_VOLTAGE_V;
      const chargeEnergy    = dischargeEnergy / (ce / 100);

      cycle_data.push({
        test_id:                         testId,
        cell_group_id:                   group.id,
        cycle_index:                     cycle,
        discharge_capacity_Ah:           +capacity.toFixed(3),
        dcir_mOhm:                       +dcir.toFixed(1),
        soh_percent:                     +soh.toFixed(1),
        discharge_energy_Wh:             +dischargeEnergy.toFixed(3),
        charge_energy_Wh:                +chargeEnergy.toFixed(3),
        coulombic_efficiency_percent:    +ce.toFixed(2),
      });
    }

    testId++;
  }

  cell_groups.push({
    id:            group.id,
    name:          group.name,
    chemistry:     group.chemistry,
    temperature_C: group.temperature_C,
    c_rate:        group.c_rate,
    test_ids:      groupTestIds,
  });
}

// ─── Write output ─────────────────────────────────────────────────────────────
const outputDir  = path.join(__dirname, 'data');
const outputPath = path.join(outputDir, 'mock_data.json');
fs.mkdirSync(outputDir, { recursive: true });
fs.writeFileSync(outputPath, JSON.stringify({ cell_groups, tests, cycle_data }, null, 2));

console.log('✅  Mock data generated:');
console.log(`    Groups:      ${cell_groups.length}`);
console.log(`    Tests:       ${tests.length}`);
console.log(`    Data points: ${cycle_data.length}`);
console.log(`    Output:      ${outputPath}`);
