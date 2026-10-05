/**
 * ==========================================================================
 * MOHACADEMY ADVANCED MULTI-ENGINE PHYSICS SIMULATION ROUTER
 * High-Fidelity Graphical Emulation Core Engine
 * ==========================================================================
 */

let globalExperimentBlueprint = null;

// ==========================================
// UNIFIED STATE MANAGEMENT MATRIX
// ==========================================
let geometryState = { angle: 30, height: 4.0 };

let piState = {
    currentTool: 'rule', readings: { d: 0, c: 0 },
    objects: {
        cylinder: { name: "Small Metallic Cylinder", d: 4.8, c: 15.08, size: 70 },
        petri: { name: "Petri Dish (Plastic)", d: 9.0, c: 28.27, size: 120 },
        beaker: { name: "Glass Beaker (250ml)", d: 7.2, c: 22.62, size: 100 },
        pulley: { name: "Large Industrial Pulley", d: 15.4, c: 48.38, size: 180 },
        jar: { name: "Specimen Jar (Large)", d: 11.2, c: 35.19, size: 150 },
        clock: { name: "Wall Clock Face", d: 20.0, c: 62.83, size: 220 },
        weight: { name: "Standard 1kg Brass Weight", d: 5.8, c: 18.22, size: 85 }
    }
};

let densityState = { emptyMass: 45.2, liquidDensity: 0.85, volume: 0, currentScaleReading: 45.2, animFrameId: null };

let nailState = { baseNailMass: 2.45, variance: 0.15, nailsOnScale: [], animFrameId: null };

let pendulumState = { length: 50, angle: 0.15, omega: 0, phase: 0, isOscillating: false, swRunning: false, swTime: 0, swLastTime: 0, animId: null };

let inclinedPlaneState = { h: 15, ballX: 60, ballY: 0, isRolling: false, rollingTime: 0, totalRollDuration: 0, animId: null };

let cantileverState = { l: 20, deflection: 0, floorBaseline: 100 };

let hookeState = { mass: 0, pointerY: 5.2 };

let thermalState = {
    engineMode: 'cooling_water', // 'cooling_ice', 'heating_candle', 'wax_melting'
    temp: 80.0,
    ambient: 25.0,
    timeMins: 0,
    timerRunning: false,
    lastTick: 0,
    k_constant: 0.08, // Rate of cooling/heating
    waxLatentBuffer: 100, // Simulates the plateau delay during phase change
    isHeating: false,
    animId: null
};

let solidDensityState = {
    objects: [
        { id: 1, m: 39.3, v: 5, w: 16, h: 16 },
        { id: 2, m: 78.5, v: 10, w: 22, h: 22 },
        { id: 3, m: 117.8, v: 15, w: 26, h: 26 },
        { id: 4, m: 157.0, v: 20, w: 30, h: 30 },
        { id: 5, m: 196.3, v: 25, w: 34, h: 34 }
    ],
    activeIdx: 0,
    phase: 'idle', // idle, scale, water
    baseV1: 45,
    currentV: 45,
    scaleReading: 0.0,
    animY: 0,
    animX: 0,
    animFrameId: null
};

let relDensityState = {
    activeStone: 0,
    stones: [ {id: 1, w: 0.50, d: 2.5}, {id: 2, w: 0.80, d: 2.7}, {id: 3, w: 1.20, d: 2.4}, {id: 4, w: 1.50, d: 2.6}, {id: 5, w: 2.00, d: 2.8} ],
    medium: 'air', // air, water, oil
    animY: 0,
    animFrameId: null
};

let rubberBandState = { mass: 0, clampY: 100, stretch: 0, baseLength: 10, animFrameId: null };

let oscState = { // Shared state for M3:03 Cantilever & M4:04 Spring
    type: 'cantilever', 
    mass: 0.1, 
    k: 35.0, // Stiffness constant
    effectiveMass: 0.05, 
    phase: 0, 
    omega: 0, 
    isOscillating: false, 
    amplitude: 0,
    swRunning: false, 
    swTime: 0, 
    swLastTime: 0, 
    animId: null
};

// NEW VOL 2 STATES (M6:06, M7:07, M8:08, SW1:09)
let momentsState = { massM: 100, x: 30, mass_m: 50, l: 30, angle: 0, animId: null };

let concurrentState = { mass: 0, l0: 10.0, l1: 15.0, l2: 10.0, beta: 90, animId: null };

let pulleyState = { massB: 235, massA: 200, h: 40, yPos: 0, isMoving: false, time: 0, totalTime: 0, animId: null };

let soundState = { 
    freq: 256, 
    tubeL: 10.0, 
    isRinging: false, 
    audioCtx: null, 
    oscillator: null, 
    gainNode: null, 
    animId: null,
    v: 34300, // Speed of sound cm/s
    endCorrection: 1.5 // cm
};
// NEW VOL 2 MAINSTREAMS (LATENT HEAT & OPTICS)
let vaporState = { 
    mass: 650.5, 
    power: 1000, 
    time: 0, 
    isBoiling: false, 
    latentHeat: 2260, // J/g
    bubbles: [],
    lastTick: 0,
    animId: null 
};

let opticsState = {
    focalLength: 15.0, // Fixed physical property of the virtual lens
    u: 25.0, 
    v: 50.0, 
    animId: null
};
// NEW STATE VARIABLES FOR H1-10, H3-12, LW4-16
let calState = { massBlock: 50, massWater: 150, tempBlock: 100, tempWater: 25, isTransferred: false, mixTemp: 25, animX: 80, animY: 280, animId: null };

let heatFlowState = { tempHot: 75.0, tempCold: 25.0, timeMins: 0, timerRunning: false, lastTick: 0, k_inner: 0.15, k_outer: 0.02, animId: null };

let parallaxState = { focalLength: 15.0, u: 20.0, v_pin: 40.0, headPos: 0, animId: null };
// NEW VOL 2 (ELEC, MAG, RADIO) STATES
let resState = { length: 50.0, d: 0.28, rho: 4.9e-5, r: 0 };
let emfState = { junctions: 0, e0: 3.15, r: 5.0, resValue: 10.0 };
let capState = { v: 0, v0: 3.0, c: 1500e-6, r: 500e3, phase: 'idle', time: 0, lastTick: 0, animId: null };
let fluxState = { x: 20, theta: 0 };
let inertiaState = { n: 5, s: 0, magnetX: 350, snapped: false, criticalS: 0, animId: null };
let buretteState = { vLeft: 50.0, time: 0, isFlowing: false, lastTick: 0, lambda: 0.015, animId: null };
let cubesState = { N: 250, t: 0, removed: 0, cubesData: [], isTossing: false, tossTimer: 0, animId: null };
// NEW STATION STATES
let stationDiametersState = {
    activeTool: 'idle', // 'idle', 'balance', 'vernier', 'micrometer'
    trueMass: 32.5, // g
    trueDiameter: 1.98, // cm
    displayValue: 0.0,
    unit: "",
    animId: null
};
// BATCH 1 STATION STATES
let st4State = { activeSol: 'idle', animId: null }; // Electrolysis
let st7State = { phase: 'idle', trueMass: 85.5, trueVol: 10.8, dispVol: 0, animY: 50, animId: null }; // Overflow Can
let st8State = { activeBox: 'A', magnetDist: 150, animId: null }; // Magnetic Boxes (A: Ferro, B: Repel, C: Non-mag)
let st9State = { pinHeight: 15.0, focalLength: 20.0, animId: null }; // Lens & Mirror
let st10State = { fanOn: false, t1: 25.0, t2: 25.0, timeMins: 0, lastTick: 0, animId: null }; // Evaporation
// BATCH 2 STATION STATES
let st12State = { radiusMm: 0.5, animId: null }; // Capillary Tube
let st13State = { volA: 0, volB: 0, densityA: 1.0, densityB: 0.85, animId: null }; // U-Tube Density
let st14State = { isOn: false, time: 0, temp: 25.0, lastTick: 0, power: 50, mass: 500, animId: null }; // Elec Calorimetry
let st16State = { location: 'air', targetSize: 30, currentSize: 30, animId: null }; // Thermo Balloon
let st17State = { activeBox: 'none', current: 0.00, animId: null }; // Blackbox Circuits
// BATCH 3 STATION STATES
let st18State = { phase: 'idle', sandMass: 45.5, cylH: 10.2, cylD: 3.5, scaleVal: 0, animId: null }; // Sand Density
let st19State = { activeResistor: 'none', reading: 0, animId: null }; // Ohmmeter
let st21State = { phase: 'idle', time: 0, voltage: 0, lastTick: 0, animId: null }; // Build Capacitor
let st22State = { activeBox: 'none', current: 0.00, animId: null }; // Blackbox Series/Parallel
// UPPER SIXTH (VOL 2) STATION STATES
let stV2_1State = { tubeL: 15.0, freq: 256, isRinging: false, audioCtx: null, oscillator: null, gainNode: null, v: 34300, endCorrection: 1.5, animId: null }; 
let stV2_2State = { activeBox: 'none', current: 0.00, animId: null }; 
let stV2_3State = { load: 'none', trueUnknown: 78.5, animY: 0, animId: null }; 
let stV2_4State = { activeTool: 'idle', trueMass: 4.25, trueL: 85.0, trueD: 0.56, displayVal: '---', unit: '', animId: null }; 
let stV2_5State = { activeBox: 'none', isConnected: false, time: 0, current: 0, lastTick: 0, animId: null };
// BATCH 4 STATION STATES (VOL 2)
let stV2_6State = { mass: 0, l: 95.0, b: 2.5, d: 0.5, animY: 0, animId: null }; // Young's Modulus
let stV2_7State = { phase: 'warm', temp: 35.0, vol: 150, iceAdded: 0, animId: null }; // Latent Heat Ice
let stV2_8State = { inFlame: false, current: 0.0, temp: 25, animId: null }; // Thermocouple
let stV2_9State = { compassX: 225, theta: 0, animId: null }; // Mag Compass
let stV2_10State = { activeComp: 'none', isCovered: false, current: 0.0, animId: null }; // LDR/Thermistor
// BATCH 5 STATION STATES (SET 4 & 5)
let st4_1State = { vol: 0, radius: 1.25, animId: null }; // Pipe Diam
let st4_2State = { isCharging: false, time: 0, voltage: 0, lastTick: 0, animId: null }; // Cap Energy
let st4_3State = { activeBox: 'none', angle: 45, animId: null }; // Earth Magnetic
let st5_1State = { isClosed: false, E: 3.1, r: 1.5, R: 10, animId: null }; // Internal Res
let st5_2State = { tool: 'idle', trueM: 45.2, trueD1: 4.0, trueD2: 5.0, disp: '---', unit: '', animId: null }; // Torus
let st5_3State = { comp: 'none', env: 'normal', current: 0, animId: null }; // Component ID
// ==========================================
// INITIALIZATION & BLUEPRINT MOUNTING
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    if (id) loadLabBlueprint(id);
    else document.getElementById('dynamic-instructions-container').innerHTML = "<p style='color:#ef4444; font-weight:bold; padding:15px;'>Execution Terminated: Missing active parameter validation reference link.</p>";
});

function getFallbackBlueprint(code) {
    // Map the GCE codes directly to their visual engines
    let engine = "simple_pendulum"; // Default failsafe
    let title = "Physics Experiment: " + code;
    
    if (code === 'M2:05') engine = "average_mass_nails";
    else if (code === 'M2:06A') engine = "simple_pendulum";
    else if (code === 'M2:06B') engine = "inclined_plane";
    else if (code === 'M2:07') engine = "loaded_cantilever";
    else if (code === 'M2:08') engine = "hookes_law";
    else if (code === 'M2:09') engine = "thermal_cooling_ice";
    else if (code === 'H2:01') engine = "thermal_cooling_water";
    else if (code === 'H2:03') engine = "thermal_heating_candle";
    else if (code === 'H2:04') engine = "thermal_wax_melting";
    else if (code === 'H1:10') engine = "calorimetry_mixture";
    else if (code === 'H3:12') engine = "heat_flow_boundary";
    else if (code === 'LW4:16') engine = "optical_parallax";
    else if (code === 'M6:06') engine = "principle_of_moments";
    else if (code === 'M7:07') engine = "concurrent_forces";
    else if (code === 'M8:08') engine = "simple_pulley";
    else if (code === 'SW1:09') engine = "sound_resonance";
    else if (code === 'B1:25') engine = "mag_flux";
    else if (code === 'B2:26') engine = "mag_inertia";
    else if (code === 'E1:20') engine = "elec_resistivity";
    else if (code === 'E3:22') engine = "elec_emf";
    else if (code === 'EL2:24') engine = "elec_capacitor";
    else if (code === 'R1:27') engine = "radio_burette";
    else if (code === 'R2:28') engine = "radio_cubes";
    else if (code.startsWith('ST')) engine = "station_diameters"; // Generic station fallback

    return {
        title: title,
        instructions: [
            "Follow the standard procedures outlined in your MohAcademy practical manual.",
            "Adjust the sliders or buttons in the control panel to manipulate the apparatus.",
            "Record your readings carefully in the data table provided.",
            "Use the GCE graph paper tab to plot your results if required."
        ],
        simulationSettings: {
            engineType: engine
        }
    };
}

async function loadLabBlueprint(code) {
    try {
        const res = await fetch(`/api/labs/${code}`);
        if (!res.ok) throw new Error("Experiment not found in database.");
        globalExperimentBlueprint = await res.json();
        setupLabWorkspace();
    } catch (err) {
        console.warn("Database fetch failed, overriding with Local Router:", err.message);
        globalExperimentBlueprint = getFallbackBlueprint(code);
        setupLabWorkspace();
    }
}

function setupLabWorkspace() {
    const manualBox = document.getElementById('dynamic-instructions-container');
    manualBox.innerHTML = `<h3>${globalExperimentBlueprint.title}</h3>`;
    globalExperimentBlueprint.instructions.forEach((step, idx) => {
        manualBox.innerHTML += `
            <div style="display:flex; gap:12px; margin-bottom:14px; align-items:flex-start;">
                <span style="background:var(--sim-accent); color:#0f172a; font-weight:800; padding:2px 8px; border-radius:4px; font-size:0.85rem; flex-shrink:0;">${idx+1}</span>
                <p style="margin:0; color:#cbd5e1; font-size:0.9rem; line-height:1.5;">${step}</p>
            </div>
        `;
    });

    const engine = globalExperimentBlueprint.simulationSettings?.engineType;
    let structure = globalExperimentBlueprint.tableStructure;

    // HARD OVERRIDE FAILSAFE (FLATTENED AND FIXED)
    if (!structure || structure.length === 0 || (engine === 'circular_constant' && structure[0].key === 'h')) {
        if (engine === "circular_constant" || engine === "vernier_caliper") {
            structure = [ { key: "object", label: "Container", type: "text" }, { key: "d", label: "Diameter, d / cm", type: "number", step: "0.01" }, { key: "c", label: "Circumference, C / cm", type: "number", step: "0.1" } ];
        } else if (engine === "liquid_density") {
            structure = [ { key: "v", label: "Volume, V / cm³", type: "number", step: "1" }, { key: "m1", label: "Mass M1 / g", type: "number", step: "0.1" }, { key: "m2", label: "Mass M2 / g", type: "number", step: "0.1" }, { key: "m", label: "Mass m / g", type: "number", step: "0.1" } ];
        } else if (engine === "average_mass_nails") {
            structure = [ { key: "n", label: "Number of nails, n", type: "number", step: "1" }, { key: "m", label: "Total Mass, m / g", type: "number", step: "0.1" } ];
        } else if (engine === "simple_pendulum") {
            structure = [ { key: "l", label: "L / cm", type: "number", step: "0.1" }, { key: "t1", label: "t1 / s", type: "number", step: "0.01" }, { key: "t2", label: "t2 / s", type: "number", step: "0.01" }, { key: "tav", label: "t_av / s", type: "number", step: "0.01" }, { key: "tperiod", label: "T / s", type: "number", step: "0.01" }, { key: "tsq", label: "T² / s²", type: "number", step: "0.01" } ];
        } else if (engine === "inclined_plane") {
            structure = [ { key: "h", label: "h / cm", type: "number", step: "0.1" }, { key: "t", label: "Time, t / s", type: "number", step: "0.01" }, { key: "tsq", label: "t² / s²", type: "number", step: "0.01" } ];
        } else if (engine === "loaded_cantilever") {
            structure = [ { key: "l", label: "L / cm", type: "number", step: "1" }, { key: "h", label: "Height, h / cm", type: "number", step: "0.1" } ];
        } else if (engine === "hookes_law") {
            structure = [ { key: "m", label: "Mass, m / g", type: "number", step: "1" }, { key: "w", label: "Weight, w / N", type: "number", step: "0.01" }, { key: "ptr", label: "Pointer / cm", type: "number", step: "0.1" }, { key: "e", label: "Extension, e / cm", type: "number", step: "0.1" } ];
        } else if (engine === "solid_density") {
            structure = [ { key: "m", label: "Mass, m / g", type: "number", step: "0.1" }, { key: "v1", label: "Volume V1 / cm³", type: "number", step: "1" }, { key: "v2", label: "Volume V2 / cm³", type: "number", step: "1" }, { key: "v", label: "Volume V / cm³", type: "number", step: "1" } ];
        } else if (engine === "relative_density") {
            structure = [ { key: "w1", label: "W1 (Air) / N", type: "number", step: "0.01" }, { key: "w2", label: "W2 (Water) / N", type: "number", step: "0.01" }, { key: "w3", label: "W3 (Oil) / N", type: "number", step: "0.01" }, { key: "u", label: "Loss U / N", type: "number", step: "0.01" }, { key: "v", label: "Loss V / N", type: "number", step: "0.01" } ];
        } else if (engine === "rubber_elasticity") {
            structure = [ { key: "m", label: "Mass / g", type: "number", step: "50" }, { key: "w", label: "Weight W / N", type: "number", step: "0.01" }, { key: "l", label: "Length l / cm", type: "number", step: "0.1" }, { key: "e", label: "Ext (l-d) / m", type: "number", step: "0.001" } ];
        } else if (engine === "cantilever_oscillation" || engine === "spring_oscillation") {
            structure = [ { key: "m", label: "Mass m / kg", type: "number", step: "0.01" }, { key: "t10", label: "Time (10) / s", type: "number", step: "0.01" }, { key: "t", label: "Period T / s", type: "number", step: "0.01" }, { key: "logm", label: "log10(m)", type: "number", step: "0.001" }, { key: "logt2", label: "log10(T²)", type: "number", step: "0.001" } ];
        } else if (engine === "principle_of_moments") {
            structure = [ { key: "m", label: "Mass m / g", type: "number" }, { key: "l", label: "Distance l / cm", type: "number" }, { key: "inv_l", label: "1/l / cm⁻¹", type: "number" } ];
        } else if (engine === "concurrent_forces") {
            structure = [ { key: "m", label: "Mass m / kg", type: "number" }, { key: "l2", label: "Length L2 / cm", type: "number" }, { key: "beta", label: "Angle β / °", type: "number" }, { key: "t", label: "Tension T / N", type: "number" }, { key: "y", label: "T*cos(β/2)", type: "number" } ];
        } else if (engine === "simple_pulley") {
            structure = [ { key: "h", label: "Distance h / cm", type: "number" }, { key: "t", label: "Time t / s", type: "number" }, { key: "t2", label: "t² / s²", type: "number" } ];
        } else if (engine === "sound_resonance") {
            structure = [ { key: "f", label: "Freq f / Hz", type: "number" }, { key: "inv_f", label: "1/f / s", type: "number" }, { key: "l", label: "Length L / cm", type: "number" } ];
        } else if (engine === "latent_vaporization") {
            structure = [ { key: "mi", label: "Initial mi / g", type: "number" }, { key: "mf", label: "Final mf / g", type: "number" }, { key: "m", label: "Mass m / kg", type: "number" }, { key: "t", label: "Time t / s", type: "number" }, { key: "pt", label: "Energy Pt / J", type: "number" } ];
        } else if (engine === "optical_bench") {
            structure = [ { key: "u", label: "Object u / cm", type: "number", step: "0.1" }, { key: "v", label: "Image v / cm", type: "number", step: "0.1" }, { key: "mag", label: "Mag (m = v/u)", type: "number", step: "0.01" } ];    
        } else if (engine === "calorimetry_mixture") {
            structure = [ { key: "ms", label: "Mass ms / g", type: "number", step: "0.1" }, { key: "mw", label: "Mass mw / g", type: "number", step: "0.1" }, { key: "theta1", label: "Cold θ1 / °C", type: "number", step: "0.1" }, { key: "theta3", label: "Mix θ3 / °C", type: "number", step: "0.1" }, { key: "dt_cold", label: "(θ3 - θ1)", type: "number", step: "0.1" }, { key: "dt_hot", label: "(100 - θ3)", type: "number", step: "0.1" } ];
        } else if (engine === "heat_flow_boundary") {
            structure = [ { key: "t", label: "Time t / min", type: "number", step: "1" }, { key: "theta1", label: "Hot θ1 / °C", type: "number", step: "0.5" }, { key: "theta2", label: "Cold θ2 / °C", type: "number", step: "0.5" } ];
        } else if (engine === "optical_parallax") {
            structure = [ { key: "u", label: "Object u / cm", type: "number", step: "0.1" }, { key: "v", label: "Image v / cm", type: "number", step: "0.1" }, { key: "uv", label: "uv / cm²", type: "number", step: "1" }, { key: "u_plus_v", label: "(u+v) / cm", type: "number", step: "0.1" } ];
        } else if (engine === "elec_resistivity") {
            structure = [ { key: "l", label: "Length l / cm", type: "number" }, { key: "r", label: "Resistance R / Ω", type: "number" } ];
        } else if (engine === "elec_emf") {
            structure = [ { key: "i", label: "Current I / A", type: "number" }, { key: "v", label: "Voltage V / V", type: "number" } ];
        } else if (engine === "elec_capacitor") {
            structure = [ { key: "t", label: "Time t / s", type: "number" }, { key: "v", label: "Voltage V / V", type: "number" } ];
        } else if (engine === "mag_flux") {
            structure = [ { key: "x", label: "Distance x / cm", type: "number" }, { key: "theta", label: "Angle θ / °", type: "number" } ];
        } else if (engine === "mag_inertia") {
            structure = [ { key: "n", label: "Pins n", type: "number" }, { key: "inv_n", label: "1/n", type: "number" }, { key: "s", label: "Distance s / cm", type: "number" } ];
        } else if (engine === "radio_burette") {
            structure = [ { key: "t", label: "Time t / s", type: "number" }, { key: "v", label: "Vol Flown V / cm³", type: "number" }, { key: "v1", label: "Vol Left V1 / cm³", type: "number" } ];
        } else if (engine === "radio_cubes") {
            structure = [ { key: "t", label: "Toss t", type: "number" }, { key: "rem", label: "Removed", type: "number" }, { key: "n", label: "Remaining N", type: "number" } ];    
        } else if (engine && engine.startsWith("thermal_")) {
            if (engine === "thermal_heating_candle") {
                structure = [ { key: "t", label: "Time t/min", type: "number", step: "0.5" }, { key: "theta1", label: "Heat θ1/°C", type: "number", step: "0.5" }, { key: "theta2", label: "Cool θ2/°C", type: "number", step: "0.5" } ];
            } else {
                structure = [ { key: "t", label: "Time t/min", type: "number", step: "1" }, { key: "temp", label: "Temp θ/°C", type: "number", step: "0.5" } ];
            }
        } else {
            structure = [ { key: 'h', label: 'h / cm', type: 'number', step: '0.1' }, { key: 'theta', label: 'θ / °', type: 'number', step: '1' }, { key: 'sin', label: 'sin θ', type: 'number', step: '0.001' } ];
        }
    }

    const thead = document.getElementById('table-head-target');
    const tbody = document.getElementById('table-body-target');
    
    let headerHTML = '<tr><th>Reading No.</th>';
    structure.forEach(col => { headerHTML += `<th>${col.label}</th>`; });
    headerHTML += '</tr>';
    thead.innerHTML = headerHTML;

    tbody.innerHTML = '';
    const rows = globalExperimentBlueprint.gradingRubric?.requiredRows || 10;
    for (let i = 1; i <= rows; i++) {
        let rowHTML = `<tr data-row-idx="${i}"><td style="color:var(--sim-muted); font-weight:bold; text-align:center;">${i}</td>`;
        structure.forEach(col => {
            if (col.type === "text") {
                rowHTML += `<td><input type="text" class="sim-input" data-key="${col.key}" style="background:rgba(255,255,255,0.05); text-align:center; border:none; color:#fff; width:100%; font-size:0.8rem;" placeholder="-"></td>`;
            } else {
                rowHTML += `<td><input type="number" step="${col.step || '0.01'}" class="sim-input" data-key="${col.key}" style="background:rgba(255,255,255,0.05); text-align:center; border:none; color:#fff; width:100%;" placeholder="-"></td>`;
            }
        });
        rowHTML += '</tr>';
        tbody.innerHTML += rowHTML;
    }

    if (engine === "circular_constant" || engine === "vernier_caliper") {
        document.getElementById('calc-lbl-formula').innerText = "Slope Intercept Derivation (ΔC / Δd)";
        document.getElementById('calc-lbl-inferences').innerText = "Experimental Inferences & Deductions (Calculate π)";
    } else if (engine === "liquid_density") {
        document.getElementById('calc-lbl-formula').innerText = "Slope Intercept Derivation (ΔV / Δm)";
        document.getElementById('calc-lbl-inferences').innerText = "Experimental Inferences (Calculate Density ρ = 1/S)";
    } else if (engine === "average_mass_nails") {
        document.getElementById('calc-lbl-formula').innerText = "Slope Intercept Derivation (Δm / Δn)";
        document.getElementById('calc-lbl-inferences').innerText = "Significance of S (Average Mass) & Comparison";
    } else if (engine === "simple_pendulum") {
        document.getElementById('calc-lbl-formula').innerText = "Slope Intercept Derivation (ΔT² / ΔL)";
        document.getElementById('calc-lbl-inferences').innerText = "Calculate acceleration due to gravity (g = 4π²/S)";
    } else if (engine === "inclined_plane") {
        document.getElementById('calc-lbl-formula').innerText = "Slope Intercept Derivation (Δh / Δt²)";
        document.getElementById('calc-lbl-inferences').innerText = "Significance of S in relation to acceleration";
    } else if (engine === "loaded_cantilever") {
        document.getElementById('calc-lbl-formula').innerText = "Slope Intercept Derivation (Δh / ΔL)";
        document.getElementById('calc-lbl-inferences').innerText = "Identify the relationship and flexural constants";
    } else if (engine === "hookes_law") {
        document.getElementById('calc-lbl-formula').innerText = "Slope Intercept Derivation (Δw / Δe)";
        document.getElementById('calc-lbl-inferences').innerText = "Verify Hooke's Law and state the spring constant (k)";
    } else if (engine === "solid_density") {
        document.getElementById('calc-lbl-formula').innerText = "Slope Intercept Derivation (Δm / ΔV)";
        document.getElementById('calc-lbl-inferences').innerText = "What physical quantity is given by the slope? (Density)";
    } else if (engine === "relative_density") {
        document.getElementById('calc-lbl-formula').innerText = "Slope Intercept Derivation (ΔV / ΔU)";
        document.getElementById('calc-lbl-inferences').innerText = "What is the physical significance of S? (Relative Density)";
    } else if (engine === "rubber_elasticity") {
        document.getElementById('calc-lbl-formula').innerText = "Slope Intercept Derivation (ΔW / Δe)";
        document.getElementById('calc-lbl-inferences').innerText = "Physical significance of S? (Elastic Constant)";
    } else if (engine === "cantilever_oscillation" || engine === "spring_oscillation") {
        document.getElementById('calc-lbl-formula').innerText = "Intercept and Slope Calculations";
        document.getElementById('calc-lbl-inferences').innerText = "Significance of Intercepts (Effective Mass/Constants)";
    } else if (engine && engine.startsWith("thermal_")) {
        document.getElementById('calc-lbl-formula').innerText = "Tangent Gradient Calculation (Δθ / Δt)";
        document.getElementById('calc-lbl-inferences').innerText = "Thermal Inferences (Rate of Cooling / Melting Point)";
    } else if (engine === "principle_of_moments") {
        document.getElementById('calc-lbl-formula').innerText = "Slope Intercept Derivation (Δm / Δ(1/l))";
        document.getElementById('calc-lbl-inferences').innerText = "Calculate Q = M.x and compare it to ω = Q/S1";
    } else if (engine === "concurrent_forces") {
        document.getElementById('calc-lbl-formula').innerText = "Slope Intercept Derivation (ΔY / ΔX)";
        document.getElementById('calc-lbl-inferences').innerText = "Verify Equilibrium condition from slope";
    } else if (engine === "simple_pulley") {
        document.getElementById('calc-lbl-formula').innerText = "Slope Intercept Derivation (Δh / Δt²)";
        document.getElementById('calc-lbl-inferences').innerText = "Calculate α = 2S/c and its physical significance";
    } else if (engine === "sound_resonance") {
        document.getElementById('calc-lbl-formula').innerText = "Slope Intercept Derivation (ΔL / Δ(1/f))";
        document.getElementById('calc-lbl-inferences').innerText = "Determine the Speed of Sound (v) and End Correction (ε)";
    } else if (engine === "latent_vaporization") {
        document.getElementById('calc-lbl-formula').innerText = "Slope Intercept Derivation (ΔPt / Δm)";
        document.getElementById('calc-lbl-inferences').innerText = "Compare slope S with theoretical Lv (2.26 x 10^6 J/kg)";
    } else if (engine === "optical_bench") {
        document.getElementById('calc-lbl-formula').innerText = "Graphical Analysis / Minimum Turning Point";
        document.getElementById('calc-lbl-inferences').innerText = "Determine the Focal Length (f) and Physical Significance";    
    } else if (engine === "calorimetry_mixture") {
        document.getElementById('calc-lbl-formula').innerText = "Slope Intercept Derivation (Δy / Δx)";
        document.getElementById('calc-lbl-inferences').innerText = "Calculate the specific heat capacity (cs) from the slope.";
    } else if (engine === "heat_flow_boundary") {
        document.getElementById('calc-lbl-formula').innerText = "Tangent Gradient Calculation (Δθ / Δt)";
        document.getElementById('calc-lbl-inferences').innerText = "Calculate respective slopes S1 and S2 at t=3 mins.";
    } else if (engine === "optical_parallax") {
        document.getElementById('calc-lbl-formula').innerText = "Slope Intercept Derivation (Δ(uv) / Δ(u+v))";
        document.getElementById('calc-lbl-inferences').innerText = "Determine the slope (h). How does h compare with f?";    
    } else if (engine === "elec_resistivity") {
        document.getElementById('calc-lbl-formula').innerText = "Slope Intercept Derivation (ΔR / Δl)";
        document.getElementById('calc-lbl-inferences').innerText = "Calculate Resistivity ρ = S * A";
    } else if (engine === "elec_emf") {
        document.getElementById('calc-lbl-formula').innerText = "Slope Intercept Derivation (ΔV / ΔI)";
        document.getElementById('calc-lbl-inferences').innerText = "Determine E0 (Intercept) and Internal Resistance r (Slope)";
    } else if (engine === "elec_capacitor" || engine === "radio_burette" || engine === "radio_cubes") {
        document.getElementById('calc-lbl-formula').innerText = "Half-Life / Time Constant Graphical Analysis";
        document.getElementById('calc-lbl-inferences').innerText = "State the physical significance of the graph's curve";
    } else if (engine.startsWith("mag_")) {
        document.getElementById('calc-lbl-formula').innerText = "Slope Intercept Derivation (ΔY / ΔX)";
        document.getElementById('calc-lbl-inferences').innerText = "Determine K and state precautions taken";    
    } else {
        document.getElementById('calc-lbl-formula').innerText = "Slope Intercept Derivation (Δy / Δx)";
        document.getElementById('calc-lbl-inferences').innerText = "Experimental Inferences & Deductions";
    } 

    // ==========================================
    // STATION UI OVERRIDE (LEAVES MAINSTREAMS UNTOUCHED)
    // ==========================================
    if (engine && engine.startsWith("station")) {
        
        // 1. Hide the table grid, but KEEP the container visible!
        const style = document.createElement('style');
        style.innerHTML = `
            table { display: none !important; }
        `;
        document.head.appendChild(style);

        // 2. Hide the original Calculations Inputs at the bottom of the page
        const calcFormulaInput = document.getElementById('calc-slope-formula');
        if (calcFormulaInput) {
            let currentEl = calcFormulaInput;
            for(let i=0; i<4; i++) { if(currentEl.parentElement) currentEl = currentEl.parentElement; }
            if (currentEl) currentEl.style.display = 'none';
        }

        // 3. Hide Graph/Calc Tabs & original AI Button safely
        const uiElements = document.querySelectorAll('*');
        uiElements.forEach(el => {
            if (el.childNodes.length === 1 && el.childNodes[0].nodeType === 3) {
                let text = el.textContent.trim();
                if (text.includes('Graph Paper') || text.includes('Calculations & Deductions') || text.includes('Request AI Evaluation')) {
                    let wrapper = el.closest('button') || el.closest('li') || el.closest('a') || el;
                    if(wrapper) wrapper.style.display = 'none';
                }
                if (text === 'Raw Data Table') {
                    el.textContent = 'Official Lab Report';
                }
            }
        });

        // 4. Inject Official Lab Report directly below the apparatus viewer!
        const simTarget = document.getElementById('simulation-render-target');
        if (simTarget && !document.getElementById('station-procedure')) {
            const reportHTML = `
                <div style="background: #0d1117; padding: 20px; border-radius: 8px; border: 1px solid #30363d; margin-top: 20px; width: 100%; box-sizing: border-box;">
                    <h3 style="color: var(--sim-accent); font-family: 'Orbitron'; margin-bottom: 15px;"><i class="fas fa-file-signature"></i> OFFICIAL LAB REPORT</h3>
                    
                    <label style="color: #cbd5e1; font-weight: bold; display: block; margin-bottom: 5px;">Procedure</label>
                    <textarea id="station-procedure" rows="4" style="width: 100%; box-sizing: border-box; background: #161b22; color: #fff; border: 1px solid #334155; border-radius: 6px; padding: 10px; margin-bottom: 15px; font-family: 'Poppins';" placeholder="Briefly describe how you used the apparatus..."></textarea>
                    
                    <label style="color: #cbd5e1; font-weight: bold; display: block; margin-bottom: 5px;">Observations / Measurements</label>
                    <textarea id="station-observations" rows="3" style="width: 100%; box-sizing: border-box; background: #161b22; color: #fff; border: 1px solid #334155; border-radius: 6px; padding: 10px; margin-bottom: 15px; font-family: 'Poppins';" placeholder="Record the values you read from the instruments here..."></textarea>
                    
                    <label style="color: #cbd5e1; font-weight: bold; display: block; margin-bottom: 5px;">Calculations</label>
                    <textarea id="station-calculations" rows="4" style="width: 100%; box-sizing: border-box; background: #161b22; color: #fff; border: 1px solid #334155; border-radius: 6px; padding: 10px; margin-bottom: 15px; font-family: 'Poppins';" placeholder="Show your formulas and working here..."></textarea>
                    
                    <label style="color: #cbd5e1; font-weight: bold; display: block; margin-bottom: 5px;">Precautions & Conclusion</label>
                    <textarea id="station-precautions" rows="3" style="width: 100%; box-sizing: border-box; background: #161b22; color: #fff; border: 1px solid #334155; border-radius: 6px; padding: 10px; margin-bottom: 15px; font-family: 'Poppins';" placeholder="State any precautions taken and your final deduced value..."></textarea>
                    
                    <button onclick="submitLabForGrading()" style="background: var(--sim-success); color: white; border: none; padding: 15px 30px; border-radius: 6px; font-weight: bold; font-family: 'Poppins'; cursor: pointer; font-size: 1.1rem; width: 100%; margin-top: 10px;">
                        <i class="fas fa-paper-plane"></i> Submit Station Report to AI
                    </button>
                </div>
            `;
            // This firmly attaches the form right beneath the interactive canvas viewer!
            simTarget.insertAdjacentHTML('afterend', reportHTML);
        }
    }

    if (densityState.animFrameId) cancelAnimationFrame(densityState.animFrameId);
    if (nailState.animFrameId) cancelAnimationFrame(nailState.animFrameId);
    if (pendulumState.animId) cancelAnimationFrame(pendulumState.animId);
    if (inclinedPlaneState.animId) cancelAnimationFrame(inclinedPlaneState.animId);
    if (thermalState && thermalState.animId) cancelAnimationFrame(thermalState.animId);
    if (typeof solidDensityState !== 'undefined' && solidDensityState.animFrameId) cancelAnimationFrame(solidDensityState.animFrameId);
    if (typeof relDensityState !== 'undefined' && relDensityState.animFrameId) cancelAnimationFrame(relDensityState.animFrameId);
    if (typeof oscState !== 'undefined' && oscState.animId) cancelAnimationFrame(oscState.animId);
    if (typeof rubberBandState !== 'undefined' && rubberBandState.animFrameId) cancelAnimationFrame(rubberBandState.animFrameId);

    // EXACT ROUTER EXECUTION
    if (engine === "geometry_board") renderGeometryBoardWorkspace();
    else if (engine === "circular_constant" || engine === "vernier_caliper") renderCircularConstantWorkspace();
    else if (engine === "liquid_density") renderLiquidDensityWorkspace();
    else if (engine === "average_mass_nails") renderNailMassWorkspace();
    else if (engine === "simple_pendulum") renderPendulumWorkspace();
    else if (engine === "inclined_plane") renderInclinedPlaneWorkspace();
    else if (engine === "loaded_cantilever") renderCantileverWorkspace();
    else if (engine === "hookes_law") renderHookesLawWorkspace();
    else if (engine === "solid_density") renderSolidDensityWorkspace();
    else if (engine === "relative_density") renderRelativeDensity();
    else if (engine === "rubber_elasticity") renderRubberElasticity();
    else if (engine === "cantilever_oscillation" || engine === "spring_oscillation") renderOscillationEngine(engine);
    else if (engine === "principle_of_moments") renderMomentsWorkspace();
    else if (engine === "concurrent_forces") renderConcurrentWorkspace();
    else if (engine === "simple_pulley") renderPulleyWorkspace();
    else if (engine === "sound_resonance") renderSoundWorkspace();
    else if (engine === "latent_vaporization") renderVaporizationWorkspace();
    else if (engine === "optical_bench") renderOpticalBenchWorkspace();
    else if (engine === "calorimetry_mixture") renderCalorimetryWorkspace();
    else if (engine === "heat_flow_boundary") renderHeatFlowWorkspace();
    else if (engine === "optical_parallax") renderParallaxWorkspace();
    else if (engine === "elec_resistivity") renderResistivity();
    else if (engine === "elec_emf") renderEMF();
    else if (engine === "elec_capacitor") renderCapacitor();
    else if (engine === "mag_flux") renderMagFlux();
    else if (engine === "mag_inertia") renderMagInertia();
    else if (engine === "radio_burette") renderRadioBurette();
    else if (engine === "radio_cubes") renderRadioCubes();
    else if (engine === "station_diameters") renderStationDiameters();
    else if (engine === "station_electrolysis") renderStation4();
    else if (engine === "station_overflow_density") renderStation7();
    else if (engine === "station_magnetic_boxes") renderStation8();
    else if (engine === "station_lens_mirror") renderStation9();
    else if (engine === "station_evaporation") renderStation10();
    else if (engine === "station_capillary") renderStation12();
    else if (engine === "station_utube") renderStation13();
    else if (engine === "station_elec_calorimetry") renderStation14();
    else if (engine === "station_thermo_balloon") renderStation16();
    else if (engine === "station_blackbox_circuits") renderStation17();
    else if (engine === "station_sand_density") renderStation18();
    else if (engine === "station_ohmmeter_resistors") renderStation19();
    else if (engine === "station_build_capacitor") renderStation21();
    else if (engine === "station_blackbox_series_parallel") renderStation22();
    else if (engine === "station_v2_sound") renderStationV2_1();
    else if (engine === "station_v2_resistor_boxes") renderStationV2_2();
    else if (engine === "station_v2_spring_mass") renderStationV2_3();
    else if (engine === "station_v2_wire_density") renderStationV2_4();
    else if (engine === "station_v2_cap_res_boxes") renderStationV2_5();
    else if (engine === "station_v2_youngs_modulus") renderStationV2_6();
    else if (engine === "station_v2_latent_ice") renderStationV2_7();
    else if (engine === "station_v2_thermoelectric") renderStationV2_8();
    else if (engine === "station_v2_mag_compass") renderStationV2_9();
    else if (engine === "station_v2_thermistor_ldr") renderStationV2_10();
    else if (engine === "station_pipe_diameter") renderStation4_1();
    else if (engine === "station_capacitor_energy") renderStation4_2();
    else if (engine === "station_earth_magnetic") renderStation4_3();
    else if (engine === "station_internal_res") renderStation5_1();
    else if (engine === "station_torus_density") renderStation5_2();
    else if (engine === "station_component_id") renderStation5_3();
    else if (engine && engine.startsWith("thermal_")) {
        thermalState.engineMode = engine;
        renderUnifiedThermalWorkspace();
    }
}

/**
 * ==========================================================================
 * ENGINE: M2:06A SIMPLE PENDULUM CORE WORKSPACE
 * ==========================================================================
 */
function renderPendulumWorkspace() {
    document.getElementById('simulation-render-target').innerHTML = `
        <div class="bench-card" style="width: 100%; max-width: 800px; background:#0d1117; padding:1.5rem; border-radius:12px; border:1px solid #30363d; display:flex; flex-direction:column; gap:15px; box-sizing:border-box;">
            <div style="display:flex; gap:15px; flex-wrap:wrap; width:100%;">
                <div style="flex:1; min-width:220px; background:#161b22; padding:15px; border-radius:8px; border:1px solid #30363d; text-align:center;">
                    <div style="color:#8b949e; font-size:0.75rem; font-family:'Orbitron'; letter-spacing:1px; margin-bottom:5px;">DIGITAL STOPWATCH</div>
                    <div class="lcd-screen" id="sw-lcd" style="font-size:2.5rem; color:#38bdf8; background:#000; padding:10px; border-radius:6px; font-weight:bold; font-family:'Orbitron', sans-serif;">0.00 s</div>
                    <div style="display:flex; gap:5px; margin-top:10px;">
                        <button onclick="togglePendulumStopwatch()" style="flex:1; background:#2563eb; color:white; border:none; padding:10px; border-radius:4px; font-weight:bold; cursor:pointer;">Start / Stop</button>
                        <button onclick="resetPendulumStopwatch()" style="background:#4b5563; color:white; border:none; padding:10px 15px; border-radius:4px; font-weight:bold; cursor:pointer;">Reset</button>
                    </div>
                </div>
                <div style="flex:1; min-width:220px; background:#1e293b; padding:15px; border-radius:8px; border:1px solid #334155;">
                    <label style="color:#fff; font-size:0.85rem; display:block; margin-bottom:8px; font-family:'Poppins';">String Adjustment (L): <span id="lbl-pen-l" style="color:var(--sim-accent); font-weight:bold;">50.0 cm</span></label>
                    <input type="range" id="slider-pen-l" min="20" max="100" value="50" step="1" style="width:100%; cursor:pointer;">
                    <button onclick="displacePendulumBob()" style="width:100%; margin-top:20px; background:var(--emerald); color:white; border:none; padding:12px; border-radius:6px; font-weight:bold; font-family:'Poppins'; cursor:pointer;"><i class="fas fa-play"></i> Displace & Release Bob</button>
                </div>
            </div>
            <div style="background:#fff; border-radius:8px; padding:10px; display:flex; justify-content:center; border:2px solid #0f172a; overflow:hidden;">
                <canvas id="canvas-pendulum" width="500" height="360" style="display:block;"></canvas>
            </div>
            <div style="color: var(--amber); font-size: 0.8rem; text-align: center; font-family: 'Poppins';"><i class="fas fa-exclamation-triangle"></i> Count 20 oscillations manually and log times directly to the table.</div>
        </div>
    `;

    document.getElementById('slider-pen-l').addEventListener('input', (e) => {
        pendulumState.length = parseInt(e.target.value);
        document.getElementById('lbl-pen-l').innerText = `${pendulumState.length.toFixed(1)} cm`;
        pendulumState.isOscillating = false; 
    });

    pendulumLoop();
}

function displacePendulumBob() {
    pendulumState.phase = 0;
    // Calculate precise theoretical omega angular frequency vector (g = 981 cm/s^2)
    pendulumState.omega = Math.sqrt(981.0 / pendulumState.length); 
    pendulumState.angle = 0.15; // Displace roughly 8.5 degrees
    pendulumState.isOscillating = true;
}

function togglePendulumStopwatch() {
    if (pendulumState.swRunning) {
        pendulumState.swRunning = false;
    } else {
        pendulumState.swRunning = true;
        pendulumState.swLastTime = performance.now();
    }
}

function resetPendulumStopwatch() {
    pendulumState.swRunning = false;
    pendulumState.swTime = 0;
    document.getElementById('sw-lcd').innerText = "0.00 s";
}

function pendulumLoop() {
    const canvas = document.getElementById('canvas-pendulum');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0,0, canvas.width, canvas.height);

    const now = performance.now();
    if (pendulumState.swRunning) {
        let dt = (now - pendulumState.swLastTime) / 1000;
        pendulumState.swTime += dt;
        pendulumState.swLastTime = now;
        document.getElementById('sw-lcd').innerText = `${pendulumState.swTime.toFixed(2)} s`;
    }

    let currentAngle = 0;
    if (pendulumState.isOscillating) {
        // Step forward in time (assuming ~60fps)
        pendulumState.phase += 0.016; 
        currentAngle = pendulumState.angle * Math.cos(pendulumState.omega * pendulumState.phase);
    }

    // Render support block layout
    ctx.fillStyle = '#334155'; ctx.fillRect(150, 20, 200, 15);
    ctx.strokeStyle = '#475569'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(250,20); ctx.lineTo(250,35); ctx.stroke();

    // Mapping physical length directly to visual canvas pixels
    let visualLength = 50 + (pendulumState.length * 2.5);
    let bobX = 250 + visualLength * Math.sin(currentAngle);
    let bobY = 35 + visualLength * Math.cos(currentAngle);

    // String
    ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(250,35); ctx.lineTo(bobX, bobY); ctx.stroke();
    
    // Bob
    ctx.beginPath(); ctx.arc(bobX, bobY, 16, 0, Math.PI*2);
    let grad = ctx.createRadialGradient(bobX-5, bobY-5, 3, bobX, bobY, 16);
    grad.addColorStop(0, '#cbd5e1'); grad.addColorStop(1, '#334155');
    ctx.fillStyle = grad; ctx.fill(); ctx.strokeStyle = '#0f172a'; ctx.stroke();

    pendulumState.animId = requestAnimationFrame(pendulumLoop);
}

/**
 * ==========================================================================
 * ENGINE 6: M2:06B INCLINED PLANE COIL RUNNER
 * ==========================================================================
 */
function renderInclinedPlaneWorkspace() {
    document.getElementById('simulation-render-target').innerHTML = `
        <div class="bench-card" style="width: 100%; max-width: 800px; background:#0d1117; padding:1.5rem; border-radius:12px; border:1px solid #30363d; display:flex; flex-direction:column; gap:15px; box-sizing:border-box;">
            <div style="display:flex; gap:15px; flex-wrap:wrap; width:100%;">
                <div style="flex:1; min-width:220px; background:#161b22; padding:15px; border-radius:8px; border:1px solid #30363d; text-align:center;">
                    <div style="color:#8b949e; font-size:0.75rem; font-family:'Orbitron'; letter-spacing:1px; margin-bottom:5px;">MICRO-GATE CHRONOMETER</div>
                    <div class="lcd-screen" id="gate-lcd" style="font-size:2.5rem; color:#10b981; background:#000; padding:10px; border-radius:6px; font-weight:bold; font-family:'Orbitron', sans-serif;">0.00 s</div>
                </div>
                <div style="flex:1; min-width:220px; background:#1e293b; padding:15px; border-radius:8px; border:1px solid #334155;">
                    <label style="color:#fff; font-size:0.85rem; display:block; margin-bottom:8px; font-family:'Poppins';">Block Support Height (h): <span id="lbl-plane-h" style="color:var(--sim-accent); font-weight:bold;">15.0 cm</span></label>
                    <input type="range" id="slider-plane-h" min="5" max="45" value="15" step="1" style="width:100%; cursor:pointer;">
                    <button onclick="releaseInclineBallBearing()" style="width:100%; margin-top:20px; background:var(--cobalt); color:white; border:none; padding:12px; border-radius:6px; font-weight:bold; font-family:'Poppins'; cursor:pointer;"><i class="fas fa-play"></i> Release Ball Bearing</button>
                </div>
            </div>
            <div style="background:#fff; border-radius:8px; padding:10px; display:flex; justify-content:center; border:2px solid #0f172a; overflow:hidden;">
                <canvas id="canvas-plane" width="520" height="300" style="display:block;"></canvas>
            </div>
            <div style="color: var(--amber); font-size: 0.8rem; text-align: center; font-family: 'Poppins';"><i class="fas fa-info-circle"></i> Timer activates automatically. Read t and manually evaluate t² for the table.</div>
        </div>
    `;

    document.getElementById('slider-plane-h').addEventListener('input', (e) => {
        inclinedPlaneState.h = parseInt(e.target.value);
        document.getElementById('lbl-plane-h').innerText = `${inclinedPlaneState.h.toFixed(1)} cm`;
        resetInclinedBallPosition();
    });

    resetInclinedBallPosition();
    inclinedPlaneLoop();
}

function resetInclinedBallPosition() {
    inclinedPlaneState.ballX = 60;
    inclinedPlaneState.isRolling = false;
    document.getElementById('gate-lcd').innerText = "0.00 s";
}

function releaseInclineBallBearing() {
    if (inclinedPlaneState.isRolling) return;
    inclinedPlaneState.ballX = 60;
    inclinedPlaneState.rollingTime = 0;
    
    // Derived from s = 0.5 * a * t² equations where track = 150cm and a = g * sin(theta)
    inclinedPlaneState.totalRollDuration = Math.sqrt((2 * 1.5) / (9.81 * (inclinedPlaneState.h / 150.0)));
    // Add human reaction uncertainty profile buffer
    inclinedPlaneState.totalRollDuration += (Math.random() * 0.04 - 0.02);
    inclinedPlaneState.isRolling = true;
}

function inclinedPlaneLoop() {
    const canvas = document.getElementById('canvas-plane');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0,0, canvas.width, canvas.height);

    const baseLineY = 250;
    const startX = 60;
    const endX = 460;

    // Calculate dynamic slope gradient parameters
    let visualRise = inclinedPlaneState.h * 2.8;
    let peakY = baseLineY - visualRise;

    // Render underlying laboratory table base benchmark
    ctx.strokeStyle = '#334155'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(20, baseLineY); ctx.lineTo(500, baseLineY); ctx.stroke();
    // Render horizontal support bar strut profiles
    ctx.fillStyle = '#64748b'; ctx.fillRect(startX - 15, peakY, 15, visualRise);

    // Render inclined rule profile guide vector
    ctx.strokeStyle = '#b45309'; ctx.lineWidth = 12; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(startX, peakY); ctx.lineTo(endX, baseLineY); ctx.stroke();

    if (inclinedPlaneState.isRolling) {
        inclinedPlaneState.rollingTime += 0.016;
        let progress = inclinedPlaneState.rollingTime / inclinedPlaneState.totalRollDuration;
        // Acceleration means progress is not linear, it's quadratic: s proportional to t^2
        let displacementProgress = Math.pow(progress, 2); 
        
        if (displacementProgress >= 1.0) {
            displacementProgress = 1.0;
            inclinedPlaneState.isRolling = false;
            document.getElementById('gate-lcd').innerText = `${inclinedPlaneState.totalRollDuration.toFixed(2)} s`;
        } else {
            document.getElementById('gate-lcd').innerText = `${inclinedPlaneState.rollingTime.toFixed(2)} s`;
        }
        inclinedPlaneState.ballX = startX + displacementProgress * (endX - startX);
    }

    let currentProgress = (inclinedPlaneState.ballX - startX) / (endX - startX);
    let ballY = peakY + currentProgress * visualRise - 12; // Shift upward relative to radius

    ctx.beginPath(); ctx.arc(inclinedPlaneState.ballX, ballY, 10, 0, Math.PI*2);
    let grad = ctx.createRadialGradient(inclinedPlaneState.ballX-3, ballY-3, 2, inclinedPlaneState.ballX, ballY, 10);
    grad.addColorStop(0, '#f1f5f9'); grad.addColorStop(1, '#64748b');
    ctx.fillStyle = grad; ctx.fill(); ctx.strokeStyle = '#0f172a'; ctx.lineWidth = 1.5; ctx.stroke();

    inclinedPlaneState.animId = requestAnimationFrame(inclinedPlaneLoop);
}

/**
 * ==========================================================================
 * ENGINE 7: M2:07 LOADED CANTILEVER DEFLECTION MONITOR
 * ==========================================================================
 */
function renderCantileverWorkspace() {
    document.getElementById('simulation-render-target').innerHTML = `
        <div class="bench-card" style="width: 100%; max-width: 800px; background:#0d1117; padding:1.5rem; border-radius:12px; border:1px solid #30363d; display:flex; flex-direction:column; gap:15px; box-sizing:border-box;">
            <div style="background:#1e293b; padding:20px; border-radius:8px; border:1px solid #334155; width:100%; box-sizing:border-box;">
                <label style="color:#fff; font-size:0.85rem; display:block; margin-bottom:12px; font-family:'Poppins';">Load Span Offset Link (L): <span id="lbl-cant-l" style="color:var(--sim-accent); font-weight:bold;">20.0 cm</span></label>
                <input type="range" id="slider-cant-l" min="10" max="100" value="20" step="5" style="width:100%; cursor:pointer;">
            </div>
            <div style="background:#fff; border-radius:8px; padding:15px; display:flex; justify-content:center; border:2px solid #0f172a; overflow:auto;">
                <canvas id="canvas-cantilever" width="560" height="320" style="display:block;"></canvas>
            </div>
            <div style="color: var(--amber); font-size: 0.8rem; text-align: center; font-family: 'Poppins';"><i class="fas fa-pencil-alt"></i> Manually read the final clearance height 'h' from the scale and log to table.</div>
        </div>
    `;

    document.getElementById('slider-cant-l').addEventListener('input', (e) => {
        cantileverState.l = parseInt(e.target.value);
        document.getElementById('lbl-cant-l').innerText = `${cantileverState.l.toFixed(1)} cm`;
        drawCantileverSimulation();
    });

    drawCantileverSimulation();
}

function drawCantileverSimulation() {
    const canvas = document.getElementById('canvas-cantilever');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0,0, canvas.width, canvas.height);

    // Deflection is proportional to L^3 for a cantilever, scaled for UI
    let baseDeflection = Math.pow(cantileverState.l / 100, 3) * 65; 
    let jitter = (Math.random() * 0.4 - 0.2);
    let finalDeflection = baseDeflection + jitter;

    // Floor metric tracking
    let groundReadingCm = 85.0 - (finalDeflection / 2.5);
    cantileverState.floorBaseline = groundReadingCm;

    // Draw localized laboratory workbench
    ctx.fillStyle = '#1e293b'; ctx.fillRect(10, 140, 160, 180);
    ctx.fillStyle = '#0f172a'; ctx.fillRect(10, 140, 160, 15);

    // Draw clamping bracket
    ctx.fillStyle = '#64748b'; ctx.fillRect(120, 115, 30, 25);
    ctx.beginPath(); ctx.arc(135, 115, 15, Math.PI, 0); ctx.fillStyle = '#475569'; ctx.fill();

    // Generate accurate cubic flex beam trace
    ctx.strokeStyle = '#b45309'; ctx.lineWidth = 8; ctx.lineCap = "butt"; ctx.beginPath();
    ctx.moveTo(130, 136);
    
    let beamWidthPx = 360;
    let startX = 130;
    for (let x = 0; x <= beamWidthPx; x++) {
        let pct = x / beamWidthPx;
        let yOffset = finalDeflection * (Math.pow(pct, 2) * (3 - 2 * pct));
        ctx.lineTo(startX + x, 136 + yOffset);
    }
    ctx.stroke();

    // Render loading vector weight mass block
    let loadPct = cantileverState.l / 100;
    let weightX = startX + (loadPct * beamWidthPx);
    let weightY = 136 + finalDeflection * (Math.pow(loadPct, 2) * (3 - 2 * loadPct));

    ctx.fillStyle = '#475569'; ctx.fillRect(weightX - 15, weightY - 24, 30, 20);
    ctx.fillStyle = '#f8fafc'; ctx.font = 'bold 10px Poppins'; ctx.textAlign = 'center'; ctx.fillText("200g", weightX, weightY - 10);

    // Draw floor indicator ruler scale boundary
    ctx.strokeStyle = '#334155'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(520, 40); ctx.lineTo(520, 300); ctx.stroke();
    ctx.fillStyle = '#0f172a'; ctx.font = '10px monospace'; ctx.textAlign = 'left';
    for (let h = 40; h <= 100; h += 5) {
        let targetY = 300 - ((h - 40) * 4);
        ctx.beginPath(); ctx.moveTo(520, targetY); ctx.lineTo(510, targetY); ctx.stroke();
        if (h % 10 === 0) ctx.fillText(h.toString(), 526, targetY + 3);
    }

    // Dynamic marker link line to ruler
    let tipY = 136 + finalDeflection;
    ctx.strokeStyle = 'rgba(220,38,38,0.6)'; ctx.setLineDash([4,4]); ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(startX + beamWidthPx, tipY); ctx.lineTo(520, tipY); ctx.stroke(); ctx.setLineDash([]);
    ctx.fillStyle = '#dc2626'; ctx.font = 'bold 12px Arial'; ctx.fillText(`▼ ${groundReadingCm.toFixed(1)} cm`, 420, tipY - 8);
}

/**
 * ==========================================================================
 * ENGINE 8: M2:08 HOOKE'S LAW SPIRAL COIL SPRING
 * ==========================================================================
 */
function renderHookesLawWorkspace() {
    document.getElementById('simulation-render-target').innerHTML = `
        <div class="bench-card" style="width: 100%; max-width: 800px; background:#0d1117; padding:1.5rem; border-radius:12px; border:1px solid #30363d; display:flex; flex-wrap:wrap; gap:20px; box-sizing:border-box;">
            <div style="flex:1; min-width:240px; display:flex; flex-direction:column; gap:12px;">
                <div style="background:#161b22; padding:20px; border-radius:8px; border:1px solid #30363d; text-align:center;">
                    <div style="color:#8b949e; font-size:0.8rem; margin-bottom:8px; font-family:'Poppins';">TOTAL APPLIED MASS</div>
                    <div style="font-size:3rem; font-family:'Orbitron', sans-serif; color:#f59e0b; font-weight:bold;" id="hooke-mass-display">0 g</div>
                </div>
                <div style="display:flex; flex-direction: column; gap:10px; margin-top: 10px;">
                    <button onclick="addHookeMass()" style="background:var(--emerald); color:white; border:none; padding:15px; border-radius:8px; font-weight:bold; font-family:'Poppins'; cursor:pointer;"><i class="fas fa-plus"></i> Add 50g Mass</button>
                    <button onclick="resetHookeMass()" style="background:#ef4444; color:white; border:none; padding:15px; border-radius:8px; font-weight:bold; font-family:'Poppins'; cursor:pointer;">Reset Apparatus</button>
                </div>
                <div style="color: var(--amber); font-size: 0.8rem; text-align: center; margin-top: auto; font-family: 'Poppins';"><i class="fas fa-calculator"></i> Convert mass to weight (W=mg) and log extension manually.</div>
            </div>
            <div style="flex:1.5; min-width:300px; background:#fff; border-radius:8px; padding:15px; display:flex; justify-content:center; border:2px solid #0f172a;">
                <canvas id="canvas-hooke" width="400" height="420" style="display:block;"></canvas>
            </div>
        </div>
    `;

    drawHookeSimulation();
}

function addHookeMass() {
    if (hookeState.mass >= 300) { alert("Maximum elastic limits reached. Avoid damaging the spring."); return; }
    hookeState.mass += 50;
    drawHookeSimulation();
}

function resetHookeMass() {
    hookeState.mass = 0;
    drawHookeSimulation();
}

function drawHookeSimulation() {
    const canvas = document.getElementById('canvas-hooke');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0,0, canvas.width, canvas.height);

    document.getElementById('hooke-mass-display').innerText = `${hookeState.mass} g`;

    // 50g adds roughly 24 pixels of structural extension stretch
    let extensionPx = (hookeState.mass / 50) * 28; 
    let jitter = hookeState.mass > 0 ? (Math.random() * 0.6 - 0.3) : 0;
    let finalExtension = extensionPx + jitter;

    let startY = 40;
    let endY = 140 + finalExtension;

    // Render mechanical stand
    ctx.fillStyle = '#475569'; ctx.fillRect(60, 15, 14, 380); // Vertical rod
    ctx.fillRect(30, 395, 160, 15); // Stand base
    ctx.fillStyle = '#334155'; ctx.fillRect(68, 35, 120, 12); // Cross-arm clamp

    // GENERATE GRAPHICAL SPIRAL COIL WIRE TRACE
    ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 4; ctx.lineJoin = "round"; ctx.beginPath();
    ctx.moveTo(160, startY);
    
    let totalCoilLoops = 20;
    let coilSpanHeight = endY - startY;
    let stepY = coilSpanHeight / totalCoilLoops;

    for (let i = 0; i <= totalCoilLoops; i++) {
        let currentY = startY + (i * stepY);
        let loopOffset = (i === 0 || i === totalCoilLoops) ? 0 : (i % 2 === 0 ? 16 : -16);
        ctx.lineTo(160 + loopOffset, currentY);
    }
    ctx.stroke();

    // Render alignment verification wire marker link pointer (Broom stick pointer)
    ctx.strokeStyle = '#b45309'; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(160, endY); ctx.lineTo(240, endY); ctx.stroke();
    // Pointer tip
    ctx.fillStyle = '#dc2626';
    ctx.beginPath(); ctx.moveTo(240, endY); ctx.lineTo(232, endY - 5); ctx.lineTo(232, endY + 5); ctx.fill();

    // Render hanging weight pan visual interfaces
    ctx.strokeStyle = '#d1d5db'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(160, endY); ctx.lineTo(160, endY + 30); ctx.stroke(); // Loop link
    ctx.fillStyle = '#1e293b'; ctx.fillRect(135, endY + 30, 50, 8); // Tray

    // Stack loaded weights tokens
    let weightTokensCount = hookeState.mass / 50;
    ctx.fillStyle = '#d97706';
    for (let w = 0; w < weightTokensCount; w++) {
        ctx.fillRect(140, (endY + 30) - (w * 10) - 10, 40, 9);
        ctx.fillStyle = '#fef3c7'; ctx.font = '8px Arial'; ctx.textAlign = 'center';
        ctx.fillText("50", 160, (endY + 30) - (w * 10) - 2);
        ctx.fillStyle = '#d97706';
    }

    // Render calibration scale millimeter tracking ticks
    ctx.strokeStyle = '#334155'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(250, 20); ctx.lineTo(250, 390); ctx.stroke();
    ctx.fillStyle = '#0f172a'; ctx.font = '10px monospace'; ctx.textAlign = 'left';
    
    for (let r = 0; h = r * 2, h <= 180; r++) {
        let currentTickY = 30 + (r * 4);
        let isMajor = r % 10 === 0;
        let isMedium = r % 5 === 0 && !isMajor;

        ctx.beginPath(); ctx.moveTo(250, currentTickY);
        ctx.lineTo(250 + (isMajor ? 14 : (isMedium ? 9 : 5)), currentTickY); 
        ctx.lineWidth = isMajor ? 2 : 1;
        ctx.stroke();
        
        if (isMajor) {
            ctx.fillText(`${r} mm`, 268, currentTickY + 4);
        }
    }

    // Baseline physics logic
    let baselinePointerMm = 27.5 + (finalExtension / 4.0);
    hookeState.pointerY = baselinePointerMm;
}

/**
 * ==========================================================================
 * PREVIOUSLY BUILT ENGINES (M2:01, M2:02, M2:03, M2:05)
 * ==========================================================================
 */
function renderCircularConstantWorkspace() {
    const host = document.getElementById('simulation-render-target');
    let optionsHTML = '';
    for (const [key, obj] of Object.entries(piState.objects)) { optionsHTML += `<option value="${key}">${obj.name}</option>`; }

    host.innerHTML = `
        <div class="bench-card" style="width: 100%; max-width: 800px; height: auto; display: flex; flex-direction: column; gap: 1rem; background: #0d1117; padding: 1.5rem; border-radius: 12px; border: 1px solid #30363d; box-sizing: border-box;">
            <div class="bench-blueprint"><div id="object-visual"><div id="string-wrap"></div></div></div>
            <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
                <div style="flex: 1; min-width: 200px;">
                    <label style="color:#8b949e; font-size:0.8rem; display:block; margin-bottom:0.5rem; text-transform: uppercase; letter-spacing: 1px;">Select Apparatus</label>
                    <select id="obj-selector" onchange="resetPiBench()" style="width:100%; padding:10px; background:#161b22; color:#c9d1d9; border:1px solid #30363d; border-radius:6px; font-family:'Poppins';">${optionsHTML}</select>
                </div>
                <div style="flex: 1; min-width: 200px;">
                    <label style="color:#8b949e; font-size:0.8rem; display:block; margin-bottom:0.5rem; text-transform: uppercase; letter-spacing: 1px;">Measurement Precision</label>
                    <div style="display: flex; gap: 5px;">
                        <button id="btn-rule" onclick="setPiTool('rule')" style="flex:1; padding:10px; background:var(--cobalt); color:#fff; border:none; border-radius:6px; cursor:pointer; font-weight:bold;">Metre Rule</button>
                        <button id="btn-caliper" onclick="setPiTool('caliper')" style="flex:1; padding:10px; background:#21262d; color:#c9d1d9; border:1px solid #30363d; border-radius:6px; cursor:pointer; font-weight:bold;">Vernier Caliper</button>
                    </div>
                </div>
            </div>
            <div style="text-align: center; margin-top: auto;">
                <div style="color:#8b949e; font-size:0.8rem; margin-bottom:5px; font-family:'Orbitron', sans-serif; letter-spacing: 2px;">DIGITAL READOUT (cm)</div>
                <div class="lcd-screen" id="lcd-screen">0.00</div>
                <div style="display: flex; gap: 10px; margin-top: 15px;">
                    <button onclick="measurePi('D')" style="flex: 1; background: var(--cobalt); color: white; border: none; padding: 12px; border-radius: 8px; font-weight: bold; cursor: pointer;">Measure Diameter (D)</button>
                    <button onclick="measurePi('C')" style="flex: 1; background: #f59e0b; color: #000; border: none; padding: 12px; border-radius: 8px; font-weight: bold; cursor: pointer;">Wrap & Measure (C)</button>
                </div>
                <button onclick="logPiDataToTable()" style="width: 100%; background: #21262d; color: #c9d1d9; border: 1px solid #30363d; padding: 12px; border-radius: 8px; font-weight: bold; cursor: pointer; margin-top: 10px; transition: background 0.2s;"><i class="fas fa-save"></i> Record in Data Table</button>
            </div>
        </div>
    `;
    resetPiBench();
}

function resetPiBench() {
    const key = document.getElementById('obj-selector').value;
    const visual = document.getElementById('object-visual');
    visual.style.width = piState.objects[key].size + 'px';
    visual.style.height = piState.objects[key].size + 'px';
    document.getElementById('string-wrap').style.opacity = '0';
    document.getElementById('lcd-screen').innerText = '0.00';
    piState.readings = { d: 0, c: 0 };
}

function setPiTool(tool) {
    piState.currentTool = tool;
    document.getElementById('btn-rule').style.background = (tool === 'rule' ? 'var(--cobalt)' : '#21262d');
    document.getElementById('btn-rule').style.color = (tool === 'rule' ? '#fff' : '#c9d1d9');
    document.getElementById('btn-caliper').style.background = (tool === 'caliper' ? 'var(--cobalt)' : '#21262d');
    document.getElementById('btn-caliper').style.color = (tool === 'caliper' ? '#fff' : '#c9d1d9');
}

function measurePi(type) {
    const key = document.getElementById('obj-selector').value;
    let base = type === 'D' ? piState.objects[key].d : piState.objects[key].c;
    let noise = (Math.random() * 0.12) - 0.06;
    let result = (base + noise).toFixed(piState.currentTool === 'caliper' ? 2 : 1);
    
    if (type === 'C') { document.getElementById('string-wrap').style.opacity = '1'; piState.readings.c = result; } 
    else { document.getElementById('string-wrap').style.opacity = '0'; piState.readings.d = result; }
    document.getElementById('lcd-screen').innerText = result;
}

function logPiDataToTable() {
    if (!piState.readings.d || !piState.readings.c) { alert("Please measure both Diameter (D) and Circumference (C) before logging."); return; }
    const key = document.getElementById('obj-selector').value;
    const objName = piState.objects[key].name;
    const rows = document.querySelectorAll('#dynamic-data-table tbody tr');
    let targetedRow = null;
    
    for (let row of rows) {
        const dInput = row.querySelector('input[data-key="d"]');
        if (dInput && (!dInput.value || dInput.value === "-")) { targetedRow = row; break; }
    }
    if (!targetedRow) { alert("Data Matrix Capacity Reached."); return; }
    
    targetedRow.querySelector('input[data-key="object"]').value = objName;
    targetedRow.querySelector('input[data-key="d"]').value = piState.readings.d;
    targetedRow.querySelector('input[data-key="c"]').value = piState.readings.c;
    document.getElementById('lcd-screen').innerText = "RECORDED";
    setTimeout(() => { document.getElementById('lcd-screen').innerText = "0.00"; }, 800);
}

function renderGeometryBoardWorkspace() {
    const host = document.getElementById('simulation-render-target');
    host.innerHTML = `
        <div style="display: flex; width: 100%; max-width: 600px; gap: 15px; margin-bottom: 20px; flex-wrap: wrap;">
            <div style="flex: 1; background:rgba(15,23,42,0.9); padding:15px; border-radius:8px; border:1px solid var(--sim-border);">
                <label style="color:#fff; font-size:0.85rem; font-family:'Poppins'; display:block; margin-bottom:8px;"><i class="fas fa-drafting-compass" style="color:var(--sim-accent);"></i> Protractor Target: <span id="lbl-angle" style="color:var(--sim-accent); font-weight:bold;">30°</span></label>
                <input type="range" id="slider-angle" min="10" max="85" value="30" style="width:100%; cursor:pointer;">
            </div>
            <div style="flex: 1; background:rgba(15,23,42,0.9); padding:15px; border-radius:8px; border:1px solid #2ecc71; display:flex; flex-direction:column; justify-content:center; align-items:flex-end;">
                <span style="color:var(--sim-muted); font-size:0.8rem; display:block; margin-bottom:4px;">Ruler Value Reading (h)</span>
                <span id="lbl-height" style="color:#2ecc71; font-weight:800; font-size:1.5rem; line-height: 1;">4.0 cm</span>
            </div>
        </div>
        <div style="background:#ffffff; border-radius:6px; box-shadow:0 8px 24px rgba(0,0,0,0.4); padding: 10px; width: 100%; max-width: 600px; overflow-x: auto; margin-bottom: 20px;">
            <canvas id="canvas-physics" width="560" height="380" style="display:block; margin:0 auto;"></canvas>
        </div>
        <button onclick="logGeometryStateToTable()" style="background:#2ecc71; color:#fff; font-family:'Poppins'; font-weight:700; border:none; padding:12px 30px; border-radius:30px; cursor:pointer; box-shadow:0 4px 15px rgba(46,204,113,0.3); font-size: 1rem;"><i class="fas fa-edit"></i> Log Current Reading</button>
    `;

    const canvas = document.getElementById('canvas-physics');
    document.getElementById('slider-angle').addEventListener('input', (e) => {
        geometryState.angle = parseInt(e.target.value); updateGeometrySimulation(canvas);
    });
    updateGeometrySimulation(canvas);
}

function updateGeometrySimulation(canvas) {
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0,0, canvas.width, canvas.height);
    const ox = 120, oy = 280, pxScale = 22;
    
    ctx.strokeStyle = '#f1f5f9'; ctx.lineWidth = 1;
    for(let i=0; i<canvas.width; i+=20) { ctx.beginPath(); ctx.moveTo(i,0); ctx.lineTo(i, canvas.height); ctx.stroke(); ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(canvas.width, i); ctx.stroke(); }
    ctx.strokeStyle = '#334155'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(40, oy); ctx.lineTo(520, oy); ctx.stroke();

    const hyp = 8.0, rad = geometryState.angle * (Math.PI / 180);
    const targetX = ox + (hyp * pxScale * Math.cos(rad)), targetY = oy - (hyp * pxScale * Math.sin(rad));

    ctx.strokeStyle = '#2563eb'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(ox, oy); ctx.lineTo(targetX, targetY); ctx.stroke();
    ctx.strokeStyle = '#dc2626'; ctx.lineWidth = 2; ctx.setLineDash([4, 4]); ctx.beginPath(); ctx.moveTo(targetX, targetY); ctx.lineTo(targetX, oy); ctx.stroke(); ctx.setLineDash([]);

    ctx.font = 'bold 13px sans-serif'; ctx.fillStyle = '#0f172a';
    ctx.fillText("A", 20, oy + 5); ctx.fillText("B", 530, oy + 5); ctx.fillText("O", ox - 5, oy + 20); ctx.fillText("Y", targetX + 4, targetY - 6); ctx.fillText("X", targetX - 4, oy + 20);
    ctx.fillStyle = '#dc2626'; ctx.fillText("h", targetX + 8, targetY + (oy - targetY)/2);

    geometryState.height = parseFloat((hyp * Math.sin(rad) + (Math.random() * 0.08 - 0.04)).toFixed(1));
    document.getElementById('lbl-angle').innerText = `${geometryState.angle}°`;
    document.getElementById('lbl-height').innerText = `${geometryState.height.toFixed(1)} cm`;
}

function logGeometryStateToTable() {
    const rows = document.querySelectorAll('#dynamic-data-table tbody tr');
    let targetedRow = null;
    for (let row of rows) {
        const hInput = row.querySelector('input[data-key="h"]');
        if (hInput && (!hInput.value || hInput.value === "-")) { targetedRow = row; break; }
    }
    if (!targetedRow) { alert("Data Matrix Capacity Reached."); return; }
    targetedRow.querySelector('input[data-key="h"]').value = geometryState.height.toFixed(1);
    targetedRow.querySelector('input[data-key="theta"]').value = geometryState.angle;
    targetedRow.querySelector('input[data-key="sin"]').value = Math.sin(geometryState.angle * (Math.PI / 180)).toFixed(3);
}

function renderLiquidDensityWorkspace() {
    const host = document.getElementById('simulation-render-target');
    
    host.innerHTML = `
        <div class="bench-card" style="width: 100%; max-width: 850px; display: flex; flex-wrap: wrap; gap: 20px; background: #0d1117; padding: 1.5rem; border-radius: 12px; border: 1px solid #30363d; box-sizing: border-box;">
            
            <div style="flex: 1; min-width: 250px; display: flex; flex-direction: column; gap: 15px;">
                <div style="background: #161b22; padding: 20px; border-radius: 8px; border: 2px solid #30363d; text-align: center;">
                    <div style="color:#8b949e; font-size:0.85rem; margin-bottom:10px; font-family:'Orbitron', sans-serif; letter-spacing: 2px;">DIGITAL BALANCE (g)</div>
                    <div class="lcd-screen" id="scale-lcd" style="color: #ef4444; font-size: 3rem; background: #000; padding: 15px; border-radius: 6px; text-shadow: 0 0 15px rgba(239, 68, 68, 0.6);">45.2</div>
                </div>

                <div style="background: #1e293b; padding: 20px; border-radius: 8px; border: 1px solid #334155;">
                    <label style="color:#f8fafc; font-size:0.9rem; display:block; margin-bottom:15px; font-family:'Poppins';"><i class="fas fa-tint" style="color: #38bdf8;"></i> Liquid Pour Valve</label>
                    <input type="range" id="volume-slider" min="0" max="100" value="0" step="1" style="width: 100%; cursor: pointer;">
                </div>

                <button onclick="logDensityDataToTable()" style="background: var(--cobalt); color: #fff; border: none; padding: 15px; border-radius: 8px; font-weight: bold; cursor: pointer; transition: background 0.2s; font-family: 'Poppins';">
                    <i class="fas fa-clipboard-check"></i> Log Instruments to Table
                </button>
                <div style="color: var(--amber); font-size: 0.8rem; text-align: center; font-family: 'Poppins';"><i class="fas fa-exclamation-triangle"></i> You must manually calculate the mass 'm' column!</div>
            </div>

            <div style="flex: 2; min-width: 300px; background: #ffffff; border-radius: 8px; padding: 10px; display: flex; justify-content: center; box-shadow: inset 0 0 20px rgba(0,0,0,0.1);">
                <canvas id="canvas-density" width="450" height="420" style="max-width: 100%; height: auto;"></canvas>
            </div>
        </div>
    `;

    const slider = document.getElementById('volume-slider');
    slider.addEventListener('input', (e) => {
        densityState.volume = parseInt(e.target.value);
    });

    if (densityState.animFrameId) cancelAnimationFrame(densityState.animFrameId);
    densityGameLoop();
}

function densityGameLoop() {
    const canvas = document.getElementById('canvas-density');
    if (!canvas) return; 
    
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const baseMass = densityState.emptyMass + (densityState.volume * densityState.liquidDensity);
    const noise = densityState.volume > 0 ? (Math.random() * 0.04 - 0.02) : 0; 
    densityState.currentScaleReading = baseMass + noise;
    
    document.getElementById('scale-lcd').innerText = densityState.currentScaleReading.toFixed(1);

    const cylX = 80; const cylY = 380; const cylW = 60; const pxPerMl = 3; 

    if (densityState.volume > 0) {
        ctx.fillStyle = 'rgba(250, 204, 21, 0.4)';
        let liqHeight = densityState.volume * pxPerMl;
        ctx.fillRect(cylX, cylY - liqHeight, cylW, liqHeight);
        
        ctx.beginPath();
        ctx.ellipse(cylX + (cylW/2), cylY - liqHeight, cylW/2, 6, 0, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(217, 119, 6, 0.6)'; 
        ctx.fill();
    }

    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 3;
    ctx.beginPath(); 
    ctx.moveTo(cylX, 50); ctx.lineTo(cylX, cylY); ctx.lineTo(cylX + cylW, cylY); ctx.lineTo(cylX + cylW, 50);
    ctx.stroke();
    ctx.fillStyle = 'rgba(255,255,255,0.2)'; 
    ctx.fillRect(cylX + 5, 50, 10, cylY - 50);

    ctx.fillStyle = '#0f172a';
    ctx.font = '10px Arial';
    ctx.textAlign = 'right';
    for (let v = 0; v <= 100; v += 5) {
        let yPos = cylY - (v * pxPerMl);
        ctx.beginPath();
        let isMajor = v % 10 === 0;
        ctx.moveTo(cylX + cylW, yPos);
        ctx.lineTo(cylX + cylW - (isMajor ? 12 : 6), yPos);
        ctx.lineWidth = isMajor ? 1.5 : 0.5;
        ctx.stroke();
        if (isMajor && v > 0) {
            ctx.fillText(v, cylX - 5, yPos + 4);
        }
    }

    const lensX = 300; const lensY = 200; const lensR = 90; const zoomFactor = 2.5;

    ctx.strokeStyle = 'rgba(148, 163, 184, 0.3)';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(cylX + cylW, cylY - (densityState.volume * pxPerMl));
    ctx.lineTo(lensX - lensR, lensY);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.beginPath();
    ctx.arc(lensX, lensY, lensR, 0, Math.PI * 2);
    ctx.fillStyle = '#f8fafc';
    ctx.fill();
    ctx.lineWidth = 5;
    ctx.strokeStyle = '#0f172a';
    ctx.stroke();

    ctx.save();
    ctx.beginPath();
    ctx.arc(lensX, lensY, lensR - 2, 0, Math.PI * 2);
    ctx.clip();

    if (densityState.volume > 0) {
        ctx.fillStyle = 'rgba(250, 204, 21, 0.3)';
        ctx.fillRect(lensX - lensR, lensY, lensR * 2, lensR); 
        
        ctx.beginPath();
        ctx.ellipse(lensX, lensY, lensR, 15, 0, 0, Math.PI * 2); 
        ctx.fillStyle = 'rgba(217, 119, 6, 0.7)';
        ctx.fill();
    }

    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'left';
    
    let startV = Math.floor((densityState.volume - 15) / 2) * 2;
    for (let v = startV; v <= densityState.volume + 15; v += 2) {
        let diffMl = v - densityState.volume; 
        let yPosZoomed = lensY - (diffMl * pxPerMl * zoomFactor);
        
        if (yPosZoomed > lensY - lensR && yPosZoomed < lensY + lensR) {
            ctx.beginPath();
            let isMajor = v % 10 === 0;
            ctx.moveTo(lensX - 30, yPosZoomed);
            ctx.lineTo(lensX + (isMajor ? 30 : 10), yPosZoomed);
            ctx.lineWidth = isMajor ? 3 : 1;
            ctx.strokeStyle = '#334155';
            ctx.stroke();
            if (isMajor) {
                ctx.fillText(v, lensX + 40, yPosZoomed + 6);
            }
        }
    }

    ctx.restore(); 
    
    ctx.beginPath();
    ctx.arc(lensX, lensY, lensR, 0, Math.PI * 2);
    let grad = ctx.createLinearGradient(lensX - lensR, lensY - lensR, lensX + lensR, lensY + lensR);
    grad.addColorStop(0, 'rgba(255,255,255,0.4)');
    grad.addColorStop(0.5, 'rgba(255,255,255,0)');
    grad.addColorStop(1, 'rgba(255,255,255,0.1)');
    ctx.fillStyle = grad;
    ctx.fill();

    densityState.animFrameId = requestAnimationFrame(densityGameLoop);
}

function logDensityDataToTable() {
    const rows = document.querySelectorAll('#dynamic-data-table tbody tr');
    let targetedRow = null;
    for (let row of rows) {
        const vInput = row.querySelector('input[data-key="v"]');
        if (vInput && (!vInput.value || vInput.value === "-")) { targetedRow = row; break; }
    }
    if (!targetedRow) { alert("Data Matrix Capacity Reached."); return; }
    
    targetedRow.querySelector('input[data-key="v"]').value = densityState.volume;
    targetedRow.querySelector('input[data-key="m1"]').value = densityState.emptyMass.toFixed(1);
    targetedRow.querySelector('input[data-key="m2"]').value = densityState.currentScaleReading.toFixed(1);
    targetedRow.querySelector('input[data-key="m"]').value = ""; 

    const btn = event.currentTarget;
    const originalText = btn.innerHTML;
    btn.innerHTML = `<i class="fas fa-check"></i> Recorded`;
    btn.style.background = 'var(--emerald)';
    setTimeout(() => { btn.innerHTML = originalText; btn.style.background = 'var(--cobalt)'; }, 1000);
}

function renderNailMassWorkspace() {
    const host = document.getElementById('simulation-render-target');
    
    host.innerHTML = `
        <div class="bench-card" style="width: 100%; max-width: 850px; display: flex; flex-wrap: wrap; gap: 20px; background: #0d1117; padding: 1.5rem; border-radius: 12px; border: 1px solid #30363d; box-sizing: border-box;">
            
            <div style="flex: 1; min-width: 250px; display: flex; flex-direction: column; gap: 15px;">
                <div style="background: #161b22; padding: 20px; border-radius: 8px; border: 2px solid #30363d; text-align: center;">
                    <div style="color:#8b949e; font-size:0.85rem; margin-bottom:10px; font-family:'Orbitron', sans-serif; letter-spacing: 2px;">DIGITAL BALANCE (g)</div>
                    <div class="lcd-screen" id="scale-lcd" style="color: #ef4444; font-size: 3rem; background: #000; padding: 15px; border-radius: 6px; text-shadow: 0 0 15px rgba(239, 68, 68, 0.6);">0.0</div>
                </div>

                <div style="display: flex; flex-direction: column; gap: 10px; background: #1e293b; padding: 15px; border-radius: 8px; border: 1px solid #334155;">
                    <label style="color:#f8fafc; font-size:0.9rem; text-align: center; font-family:'Poppins';">Apparatus Controls</label>
                    <button onclick="simulateAddNails(1)" style="background: var(--cobalt); color: #fff; border: none; padding: 10px; border-radius: 6px; font-weight: bold; cursor: pointer;">Add 1 Nail</button>
                    <button onclick="simulateAddNails(5)" style="background: var(--emerald); color: #fff; border: none; padding: 10px; border-radius: 6px; font-weight: bold; cursor: pointer;">Add 5 Nails</button>
                    <button onclick="clearNailScale()" style="background: #ef4444; color: #fff; border: none; padding: 10px; border-radius: 6px; font-weight: bold; cursor: pointer;">Clear Balance Pan</button>
                </div>

                <button onclick="logNailDataToTable()" style="background: #21262d; color: #c9d1d9; border: 1px solid #30363d; padding: 15px; border-radius: 8px; font-weight: bold; cursor: pointer; transition: background 0.2s; font-family: 'Poppins';">
                    <i class="fas fa-clipboard-check"></i> Record Current Reading
                </button>
            </div>

            <div style="flex: 2; min-width: 300px; background: #ffffff; border-radius: 8px; padding: 10px; display: flex; justify-content: center; position: relative; box-shadow: inset 0 0 20px rgba(0,0,0,0.1);">
                <canvas id="canvas-nails" width="450" height="420" style="max-width: 100%; height: auto;"></canvas>
            </div>
        </div>
    `;

    if (nailState.animFrameId) cancelAnimationFrame(nailState.animFrameId);
    nailGameLoop();
}

function simulateAddNails(count) {
    for (let i = 0; i < count; i++) {
        const massOffset = (Math.random() * nailState.variance * 2) - nailState.variance;
        const actualMass = nailState.baseNailMass + massOffset;

        nailState.nailsOnScale.push({
            mass: actualMass,
            x: 180 + (Math.random() * 90),
            y: -50 - (Math.random() * 50),
            targetY: 340 - (Math.random() * 20),
            angle: Math.random() * Math.PI * 2,
            spin: (Math.random() * 0.2) - 0.1 
        });
    }
}

function clearNailScale() {
    nailState.nailsOnScale = [];
}

function nailGameLoop() {
    const canvas = document.getElementById('canvas-nails');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let totalMass = 0;

    ctx.fillStyle = '#cbd5e1'; ctx.fillRect(80, 360, 290, 40);
    ctx.fillStyle = '#64748b'; ctx.fillRect(190, 340, 70, 20);
    ctx.fillStyle = '#e2e8f0'; ctx.fillRect(150, 330, 150, 10);
    
    nailState.nailsOnScale.forEach(nail => {
        totalMass += nail.mass;

        if (nail.y < nail.targetY) {
            nail.y += 15; 
            nail.angle += nail.spin;
        } else {
            nail.y = nail.targetY; 
        }

        ctx.save();
        ctx.translate(nail.x, nail.y);
        ctx.rotate(nail.angle);
        
        ctx.fillStyle = '#475569'; ctx.fillRect(-2, -15, 4, 30); 
        ctx.fillStyle = '#334155'; ctx.fillRect(-6, -17, 12, 4); 
        
        ctx.beginPath(); ctx.moveTo(-2, 15); ctx.lineTo(2, 15); ctx.lineTo(0, 22); ctx.fill();
        ctx.restore();
    });

    let displayMass = totalMass;
    if (totalMass > 0) displayMass += (Math.random() * 0.04 - 0.02);
    
    document.getElementById('scale-lcd').innerText = displayMass.toFixed(1);

    nailState.animFrameId = requestAnimationFrame(nailGameLoop);
}

function logNailDataToTable() {
    const rows = document.querySelectorAll('#dynamic-data-table tbody tr');
    let targetedRow = null;
    
    for (let row of rows) {
        const nInput = row.querySelector('input[data-key="n"]');
        if (nInput && (!nInput.value || nInput.value === "-")) {
            targetedRow = row;
            break;
        }
    }

    if (!targetedRow) {
        alert("Data Matrix Capacity Reached.");
        return;
    }
    
    const count = nailState.nailsOnScale.length;
    if (count === 0) {
        alert("The balance pan is empty. Add nails before recording.");
        return;
    }

    const currentMassStr = document.getElementById('scale-lcd').innerText;

    targetedRow.querySelector('input[data-key="n"]').value = count;
    targetedRow.querySelector('input[data-key="m"]').value = currentMassStr;

    const btn = event.currentTarget;
    const originalText = btn.innerHTML;
    btn.innerHTML = `<i class="fas fa-check"></i> Recorded`;
    btn.style.background = 'var(--emerald)';
    btn.style.color = '#fff';
    setTimeout(() => { 
        btn.innerHTML = originalText; 
        btn.style.background = '#21262d';
        btn.style.color = '#c9d1d9';
    }, 1000);
}

/**
 * ==========================================================================
 * CONTINUOUS STATE DRAG-TO-STRETCH GRID PLOTTING SHEET ENGINE
 * UPGRADED WITH FREEHAND CURVE SUPPORT
 * ==========================================================================
 */
let graphState = { tool: 'pan', points: [], line: null, tempLine: null, isDrawingLine: false, curves: [], currentCurve: [], isDrawingCurve: false, scaleX: 1.0, scaleY: 1.0 };
const bigSquareSize = 40, minorSquareSize = 4, numBigSquaresX = 18, numBigSquaresY = 22; 
const graphOriginX = 60, graphOriginY = 30 + (numBigSquaresY * bigSquareSize), graphWidth = numBigSquaresX * bigSquareSize, graphHeight = numBigSquaresY * bigSquareSize; 

function setGraphTool(selectedTool) {
    graphState.tool = selectedTool;
    ['pan', 'plot', 'line', 'curve'].forEach(t => {
        const btn = document.getElementById(`tool-${t}`);
        if (btn) { btn.className = 'btn-submit-lab'; btn.style.background = '#e5e7eb'; btn.style.color = '#0f172a'; }
    });
    const activeBtn = document.getElementById(`tool-${selectedTool}`);
    if (activeBtn) { activeBtn.className = 'btn-submit-lab active-tool-btn'; activeBtn.style.background = 'var(--sim-accent)'; }
}

function clearGraph() { graphState.points = []; graphState.line = null; graphState.tempLine = null; graphState.curves = []; graphState.currentCurve = []; graphState.isDrawingLine = false; graphState.isDrawingCurve = false; initStudentGraph(); }

function initStudentGraph() {
    const canvas = document.getElementById('student-graph');
    if (!canvas) return;
    graphState.scaleX = parseFloat(document.getElementById('scale-x').value) || 1.0;
    graphState.scaleY = parseFloat(document.getElementById('scale-y').value) || 1.0;
    redrawGraph(canvas.getContext('2d'));
    if (!canvas.hasAttribute('data-events-bound')) {
        canvas.addEventListener('mousemove', handleGraphMouseMove); canvas.addEventListener('mousedown', handleGraphMouseDown); canvas.addEventListener('mouseup', handleGraphMouseUp);
        canvas.addEventListener('touchmove', handleGraphTouchMove, { passive: false }); canvas.addEventListener('touchstart', handleGraphTouchStart, { passive: false }); canvas.addEventListener('touchend', handleGraphTouchEnd);
        canvas.setAttribute('data-events-bound', 'true');
    }
}

function redrawGraph(ctx) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.lineWidth = 1; ctx.strokeStyle = '#e8f5e9'; 
    for(let x = 0; x <= graphWidth; x += minorSquareSize) { ctx.beginPath(); ctx.moveTo(graphOriginX + x, graphOriginY - graphHeight); ctx.lineTo(graphOriginX + x, graphOriginY); ctx.stroke(); }
    for(let y = 0; y <= graphHeight; y += minorSquareSize) { ctx.beginPath(); ctx.moveTo(graphOriginX, graphOriginY - y); ctx.lineTo(graphOriginX + graphWidth, graphOriginY - y); ctx.stroke(); }
    ctx.strokeStyle = '#a5d6a7';
    for(let x = 0; x <= graphWidth; x += bigSquareSize) { ctx.beginPath(); ctx.moveTo(graphOriginX + x, graphOriginY - graphHeight); ctx.lineTo(graphOriginX + x, graphOriginY); ctx.stroke(); }
    for(let y = 0; y <= graphHeight; y += bigSquareSize) { ctx.beginPath(); ctx.moveTo(graphOriginX, graphOriginY - y); ctx.lineTo(graphOriginX + graphWidth, graphOriginY - y); ctx.stroke(); }

    ctx.lineWidth = 2.5; ctx.strokeStyle = '#0f172a';
    ctx.beginPath(); ctx.moveTo(graphOriginX, graphOriginY - graphHeight); ctx.lineTo(graphOriginX, graphOriginY); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(graphOriginX, graphOriginY); ctx.lineTo(graphOriginX + graphWidth, graphOriginY); ctx.stroke();

    ctx.fillStyle = '#0f172a'; ctx.font = 'bold 11px sans-serif'; ctx.textAlign = 'center';
    for(let i = 0; i <= numBigSquaresX; i += 2) { ctx.fillText((i * graphState.scaleX).toFixed(2), graphOriginX + (i * bigSquareSize), graphOriginY + 18); }
    ctx.textAlign = 'right';
    for(let i = 0; i <= numBigSquaresY; i += 2) { ctx.fillText((i * graphState.scaleY).toFixed(1), graphOriginX - 8, graphOriginY - (i * bigSquareSize) + 4); }

    ctx.strokeStyle = '#dc2626'; ctx.lineWidth = 2;
    graphState.points.forEach(p => {
        let px = graphOriginX + ((p.x / graphState.scaleX) * bigSquareSize), py = graphOriginY - ((p.y / graphState.scaleY) * bigSquareSize);
        ctx.beginPath(); ctx.moveTo(px - 5, py - 5); ctx.lineTo(px + 5, py + 5); ctx.stroke(); ctx.beginPath(); ctx.moveTo(px - 5, py + 5); ctx.lineTo(px + 5, py - 5); ctx.stroke();
    });

    ctx.lineWidth = 2.5; ctx.strokeStyle = '#2563eb';
    if (graphState.isDrawingLine && graphState.tempLine) {
        ctx.strokeStyle = 'rgba(37, 99, 235, 0.5)'; 
        let x1 = graphOriginX + ((graphState.tempLine.x1 / graphState.scaleX) * bigSquareSize), y1 = graphOriginY - ((graphState.tempLine.y1 / graphState.scaleY) * bigSquareSize);
        let x2 = graphOriginX + ((graphState.tempLine.x2 / graphState.scaleX) * bigSquareSize), y2 = graphOriginY - ((graphState.tempLine.y2 / graphState.scaleY) * bigSquareSize);
        ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
    } else if (graphState.line) {
        ctx.strokeStyle = '#2563eb'; 
        let x1 = graphOriginX + ((graphState.line.x1 / graphState.scaleX) * bigSquareSize), y1 = graphOriginY - ((graphState.line.y1 / graphState.scaleY) * bigSquareSize);
        let x2 = graphOriginX + ((graphState.line.x2 / graphState.scaleX) * bigSquareSize), y2 = graphOriginY - ((graphState.line.y2 / graphState.scaleY) * bigSquareSize);
        ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
    }

    // DRAW FREEHAND CURVES
    ctx.strokeStyle = '#10b981'; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.lineWidth = 2.5;
    [...graphState.curves, graphState.currentCurve].forEach(curve => {
        if (!curve || curve.length === 0) return;
        ctx.beginPath();
        curve.forEach((p, idx) => {
            let px = graphOriginX + ((p.x / graphState.scaleX) * bigSquareSize);
            let py = graphOriginY - ((p.y / graphState.scaleY) * bigSquareSize);
            if (idx === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
        });
        ctx.stroke();
    });
}

function getLogicalGraphCoords(e, canvas) {
    const rect = canvas.getBoundingClientRect();
    let clientX = e.clientX, clientY = e.clientY;
    if (e.touches && e.touches.length > 0) { clientX = e.touches[0].clientX; clientY = e.touches[0].clientY; } 
    else if (e.changedTouches && e.changedTouches.length > 0) { clientX = e.changedTouches[0].clientX; clientY = e.changedTouches[0].clientY; }
    let logicX = (((clientX - rect.left) - graphOriginX) / bigSquareSize) * graphState.scaleX;
    let logicY = ((graphOriginY - (clientY - rect.top)) / bigSquareSize) * graphState.scaleY;
    return { x: Math.max(0, Math.min(logicX, numBigSquaresX * graphState.scaleX)), y: Math.max(0, Math.min(logicY, numBigSquaresY * graphState.scaleY)) };
}

function handleGraphMouseMove(e) {
    const canvas = document.getElementById('student-graph'); const coords = getLogicalGraphCoords(e, canvas);
    document.getElementById('live-coordinates').innerText = `Cursor: (X: ${coords.x.toFixed(3)}, Y: ${coords.y.toFixed(2)})`;
    if (graphState.tool === 'line' && graphState.isDrawingLine) { graphState.tempLine.x2 = coords.x; graphState.tempLine.y2 = coords.y; redrawGraph(canvas.getContext('2d')); }
    if (graphState.tool === 'curve' && graphState.isDrawingCurve) { graphState.currentCurve.push(coords); redrawGraph(canvas.getContext('2d')); }
}

function handleGraphMouseDown(e) {
    if (graphState.tool === 'pan') return;
    const canvas = document.getElementById('student-graph'); const coords = getLogicalGraphCoords(e, canvas);
    if (graphState.tool === 'plot') { graphState.points.push(coords); redrawGraph(canvas.getContext('2d')); } 
    else if (graphState.tool === 'line') { graphState.isDrawingLine = true; graphState.tempLine = { x1: coords.x, y1: coords.y, x2: coords.x, y2: coords.y }; }
    else if (graphState.tool === 'curve') { graphState.isDrawingCurve = true; graphState.currentCurve = [coords]; }
}

function handleGraphMouseUp(e) {
    if (graphState.tool === 'line' && graphState.isDrawingLine) { graphState.isDrawingLine = false; graphState.line = { ...graphState.tempLine }; graphState.tempLine = null; redrawGraph(document.getElementById('student-graph').getContext('2d')); }
    if (graphState.tool === 'curve' && graphState.isDrawingCurve) { graphState.isDrawingCurve = false; graphState.curves.push([...graphState.currentCurve]); graphState.currentCurve = []; redrawGraph(document.getElementById('student-graph').getContext('2d')); }
}

function handleGraphTouchStart(e) { if (graphState.tool === 'pan') return; e.preventDefault(); handleGraphMouseDown(e); }
function handleGraphTouchMove(e) { if (graphState.tool === 'pan') return; e.preventDefault(); handleGraphMouseMove(e); }
function handleGraphTouchEnd(e) { handleGraphMouseUp(e); }

document.addEventListener('DOMContentLoaded', () => {
    const graphTabBtn = document.getElementById('btn-tab-graph');
    if (graphTabBtn) graphTabBtn.addEventListener('click', () => setTimeout(initStudentGraph, 120)); 
});

/**
 * ==========================================================================
 * AI GRADING SUBMISSION PROTOCOL
 * Automatically maps dynamic columns and sends payload
 * ==========================================================================
 */
async function submitLabForGrading() {
    const rows = document.querySelectorAll('#dynamic-data-table tbody tr');
    let tableData = [];
    
    rows.forEach(row => {
        let rowData = {};
        const inputs = row.querySelectorAll('.sim-input');
        let hasData = false;
        inputs.forEach(input => {
            rowData[input.dataset.key] = input.value;
            if (input.value && input.value !== "-") hasData = true;
        });
        if (hasData) tableData.push(rowData);
    });

    const payload = {
        tableData: tableData,
        slopeFormula: document.getElementById('calc-slope-formula').value || "None provided",
        slope: document.getElementById('calc-slope-value').value || "0",
        precautions: document.getElementById('calc-precautions').value || "None provided",
        inferences: document.getElementById('calc-inferences').value || "None provided"
    };

    const modal = document.getElementById('ai-modal');
    const content = document.getElementById('ai-feedback-content');
    modal.style.display = 'flex';
    content.innerHTML = `
        <i class="fas fa-circle-notch fa-spin fa-3x" style="color: var(--sim-accent); margin-bottom: 15px;"></i>
        <p>Transmitting data to AI Chief Examiner...</p>
        <p style="font-size: 0.8rem; color: #64748b;">Evaluating experimental accuracy.</p>
    `;

    const experimentCode = new URLSearchParams(window.location.search).get('id');

    try {
        const token = localStorage.getItem('mohacademy_token');
        const response = await fetch(`/api/labs/${experimentCode}/submit`, {
            method: 'POST', 
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
                'x-auth-token': token
            }, 
            body: JSON.stringify(payload)
        });

        if (!response.ok) throw new Error("Evaluation Failed");
        const gradingReport = await response.json();

        content.innerHTML = `
            <div style="font-size: 3rem; font-weight: 800; color: ${gradingReport.score >= 15 ? '#2ecc71' : '#e74c3c'}; margin-bottom: 10px;">
                ${gradingReport.score} <span style="font-size: 1.5rem; color: #64748b;">/ 25</span>
            </div>
            <p style="text-align: left; padding: 15px; background: rgba(0,0,0,0.2); border-radius: 8px;">
                ${gradingReport.feedback}
            </p>
        `;
    } catch (error) {
        console.error(error);
        content.innerHTML = `<p style="color: #ef4444;"><i class="fas fa-exclamation-triangle"></i> Network error. The AI Examiner could not be reached.</p>`;
    }
}
/**
 * ==========================================================================
 * ENGINE 8: UNIFIED THERMAL DYNAMICS WORKBENCH (M2:09, H2:01, H2:03, H2:04)
 * ==========================================================================
 */
function renderUnifiedThermalWorkspace() {
    // Configure initial physics based on the specific experiment requested
    let controlsHTML = "";
    
    if (thermalState.engineMode === "thermal_cooling_ice") {
        thermalState.temp = 25.0; thermalState.ambient = 0.0; thermalState.k_constant = 0.15;
        controlsHTML = `<button onclick="startThermalSim('ice')" style="width:100%; background:#38bdf8; color:#fff; border:none; padding:12px; border-radius:6px; font-weight:bold; cursor:pointer;"><i class="fas fa-snowflake"></i> Add Ice Lumps & Start</button>`;
    } else if (thermalState.engineMode === "thermal_cooling_water") {
        thermalState.temp = 85.0; thermalState.ambient = 25.0; thermalState.k_constant = 0.12;
        controlsHTML = `<button onclick="startThermalSim('water')" style="width:100%; background:#ef4444; color:#fff; border:none; padding:12px; border-radius:6px; font-weight:bold; cursor:pointer;"><i class="fas fa-stopwatch"></i> Start Cooling Timer</button>`;
    } else if (thermalState.engineMode === "thermal_heating_candle") {
        thermalState.temp = 25.0; thermalState.ambient = 25.0; thermalState.k_constant = 0.25;
        controlsHTML = `
            <button onclick="startThermalSim('heat')" style="width:100%; margin-bottom:10px; background:#f59e0b; color:#000; border:none; padding:12px; border-radius:6px; font-weight:bold; cursor:pointer;"><i class="fas fa-fire"></i> Light Candle (Heat)</button>
            <button onclick="startThermalSim('cool')" style="width:100%; background:#3b82f6; color:#fff; border:none; padding:12px; border-radius:6px; font-weight:bold; cursor:pointer;"><i class="fas fa-wind"></i> Extinguish & Cool</button>
        `;
    } else if (thermalState.engineMode === "thermal_wax_melting") {
        thermalState.temp = 88.0; thermalState.ambient = 25.0; thermalState.k_constant = 0.18; thermalState.waxLatentBuffer = 200;
        controlsHTML = `<button onclick="startThermalSim('wax')" style="width:100%; background:#8b5cf6; color:#fff; border:none; padding:12px; border-radius:6px; font-weight:bold; cursor:pointer;"><i class="fas fa-stopwatch"></i> Start Wax Cooling</button>`;
    }

    const host = document.getElementById('simulation-render-target');
    host.innerHTML = `
        <div class="bench-card" style="width: 100%; max-width: 800px; display: flex; flex-wrap: wrap; gap: 20px; background: #0d1117; padding: 1.5rem; border-radius: 12px; border: 1px solid #30363d; box-sizing: border-box;">
            
            <div style="flex: 1; min-width: 250px; display: flex; flex-direction: column; gap: 15px;">
                <div style="background: #161b22; padding: 20px; border-radius: 8px; border: 2px solid #30363d; text-align: center;">
                    <div style="color:#8b949e; font-size:0.8rem; margin-bottom:5px; font-family:'Orbitron'; letter-spacing: 1px;">SIMULATION STOPWATCH (MINS)</div>
                    <div class="lcd-screen" id="thermal-timer-lcd" style="color: #38bdf8; font-size: 2.5rem; background: #000; padding: 10px; border-radius: 6px;">0.00</div>
                    <div style="color:#f59e0b; font-size:0.7rem; margin-top:5px;"><i class="fas fa-forward"></i> Time runs at 10x simulation speed</div>
                </div>

                <div style="background: #161b22; padding: 20px; border-radius: 8px; border: 2px solid #30363d; text-align: center;">
                    <div style="color:#8b949e; font-size:0.8rem; margin-bottom:5px; font-family:'Orbitron'; letter-spacing: 1px;">DIGITAL THERMOMETER</div>
                    <div class="lcd-screen" id="thermal-temp-lcd" style="color: #ef4444; font-size: 2.5rem; background: #000; padding: 10px; border-radius: 6px;">${thermalState.temp.toFixed(1)}°C</div>
                </div>

                <div style="background: #1e293b; padding: 15px; border-radius: 8px; border: 1px solid #334155;">
                    ${controlsHTML}
                </div>
            </div>

            <div style="flex: 1.5; min-width: 300px; background: #ffffff; border-radius: 8px; padding: 15px; display: flex; justify-content: center; position: relative; border: 2px solid #0f172a;">
                <canvas id="canvas-thermal" width="300" height="380" style="max-width: 100%; height: auto;"></canvas>
            </div>
        </div>
    `;

    drawThermalStatic();
}

function startThermalSim(mode) {
    if (mode === 'heat') {
        thermalState.isHeating = true;
        thermalState.ambient = 120.0; // Hot flame target
    } else if (mode === 'cool' && thermalState.engineMode === "thermal_heating_candle") {
        thermalState.isHeating = false;
        thermalState.ambient = 25.0; // Cool back down
    } else {
        thermalState.isHeating = false;
    }
    
    if (!thermalState.timerRunning) {
        thermalState.timerRunning = true;
        thermalState.lastTick = performance.now();
        thermalLoop();
    }
}

function thermalLoop() {
    if (!thermalState.timerRunning) return;

    const now = performance.now();
    // Run time 10x faster (1 real second = 10 simulation seconds)
    const dtReal = (now - thermalState.lastTick) / 1000; 
    const dtSim = dtReal * 10; 
    const dtMins = dtSim / 60;
    
    thermalState.timeMins += dtMins;
    thermalState.lastTick = now;

    // Apply Newton's Law of Cooling Physics: dT/dt = -k(T - T_ambient)
    let deltaTemp = -thermalState.k_constant * (thermalState.temp - thermalState.ambient) * dtMins;

    // Phase Change Physics for Wax Experiment (H2:04)
    if (thermalState.engineMode === "thermal_wax_melting" && thermalState.temp < 61.5 && thermalState.temp > 59.5) {
        if (thermalState.waxLatentBuffer > 0) {
            // Plateau! Release latent heat, stalling the temperature drop
            thermalState.waxLatentBuffer -= (dtSim * 5); 
            deltaTemp = -0.005; // tiny micro-drop to make it look alive
        }
    }

    thermalState.temp += deltaTemp;

    // Add sensor jitter
    let displayTemp = thermalState.temp + (Math.random() * 0.2 - 0.1);
    
    document.getElementById('thermal-timer-lcd').innerText = thermalState.timeMins.toFixed(2);
    document.getElementById('thermal-temp-lcd').innerText = `${displayTemp.toFixed(1)}°C`;

    drawThermalStatic(); // Redraw the visual liquid/thermometer

    thermalState.animId = requestAnimationFrame(thermalLoop);
}

function drawThermalStatic() {
    const canvas = document.getElementById('canvas-thermal');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0,0, canvas.width, canvas.height);

    const centerX = 150;
    
    // Draw Lab Stand
    ctx.fillStyle = '#475569'; ctx.fillRect(40, 20, 12, 340);
    ctx.fillStyle = '#1e293b'; ctx.fillRect(20, 360, 140, 15);
    ctx.fillStyle = '#64748b'; ctx.fillRect(52, 80, 80, 10); // Clamp

    // Draw Beaker / Can
    ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 4;
    ctx.beginPath(); ctx.moveTo(centerX - 60, 160); ctx.lineTo(centerX - 60, 320); 
    ctx.lineTo(centerX + 60, 320); ctx.lineTo(centerX + 60, 160); ctx.stroke();

    // Draw Liquid / Wax
    let liquidColor = 'rgba(56, 189, 248, 0.4)'; // Water
    if (thermalState.engineMode === "thermal_wax_melting") {
        liquidColor = thermalState.temp < 60 ? 'rgba(253, 230, 138, 0.9)' : 'rgba(253, 230, 138, 0.5)'; // Solidifies!
    } else if (thermalState.engineMode === "thermal_heating_candle") {
        liquidColor = 'rgba(156, 163, 175, 0.8)'; // Metal Can (solid)
    }
    
    if (thermalState.engineMode !== "thermal_heating_candle") {
        ctx.fillStyle = liquidColor;
        ctx.fillRect(centerX - 56, 200, 112, 118);
        // Draw Ice if requested
        if (thermalState.engineMode === "thermal_cooling_ice" && thermalState.timerRunning) {
            ctx.fillStyle = 'rgba(255,255,255,0.8)';
            ctx.fillRect(centerX - 30, 210, 20, 20);
            ctx.fillRect(centerX + 10, 230, 25, 15);
        }
    }

    // Draw Thermometer
    ctx.fillStyle = '#f8fafc'; ctx.fillRect(centerX - 4, 60, 8, 220); // Glass tube
    ctx.fillStyle = '#ef4444'; ctx.beginPath(); ctx.arc(centerX, 280, 10, 0, Math.PI*2); ctx.fill(); // Bulb
    
    // Mercury level based on Temp
    let mercuryHeight = (thermalState.temp / 100) * 180; // Scale 100C to 180px
    ctx.fillRect(centerX - 2, 270 - mercuryHeight, 4, mercuryHeight + 10);

    // Draw Candle Flame if heating
    if (thermalState.isHeating) {
        ctx.fillStyle = '#f59e0b';
        ctx.beginPath(); ctx.moveTo(centerX, 330); ctx.quadraticCurveTo(centerX + 15, 360, centerX, 360);
        ctx.quadraticCurveTo(centerX - 15, 360, centerX, 330); ctx.fill();
    }
}

/**
 * ==========================================================================
 * ENGINE 9: E2:03 MEASURING SOLID DENSITY (Animated Displacement Method)
 * ==========================================================================
 */
function renderSolidDensityWorkspace() {
    let optionsHTML = '';
    solidDensityState.objects.forEach((obj, idx) => {
        optionsHTML += `<option value="${idx}">Steel Block ${obj.id}</option>`;
    });

    const host = document.getElementById('simulation-render-target');
    host.innerHTML = `
        <div class="bench-card" style="width: 100%; max-width: 850px; display: flex; flex-wrap: wrap; gap: 20px; background: #0d1117; padding: 1.5rem; border-radius: 12px; border: 1px solid #30363d; box-sizing: border-box;">
            
            <div style="flex: 1; min-width: 250px; display: flex; flex-direction: column; gap: 12px;">
                <div style="background: #161b22; padding: 15px; border-radius: 8px; border: 2px solid #30363d; text-align: center;">
                    <div style="color:#8b949e; font-size:0.8rem; margin-bottom:5px; font-family:'Orbitron'; letter-spacing: 1px;">DIGITAL BALANCE (g)</div>
                    <div class="lcd-screen" id="solid-scale-lcd" style="color: #ef4444; font-size: 2.5rem; background: #000; padding: 10px; border-radius: 6px;">0.00</div>
                </div>

                <div style="background: #1e293b; padding: 15px; border-radius: 8px; border: 1px solid #334155;">
                    <label style="color:#f8fafc; font-size:0.85rem; display:block; margin-bottom:8px; font-family:'Poppins';">Select Object</label>
                    <select id="solid-obj-select" onchange="actSolidChange()" style="width:100%; padding:10px; background:#0f172a; color:#fff; border:1px solid #475569; border-radius:4px; font-family:'Poppins'; margin-bottom:15px;">
                        ${optionsHTML}
                    </select>
                    <button onclick="actSolidScale()" style="width:100%; background:#f59e0b; color:#000; border:none; padding:10px; border-radius:6px; font-weight:bold; font-family:'Poppins'; cursor:pointer; margin-bottom:8px;"><i class="fas fa-weight-hanging"></i> Place on Balance</button>
                    <button onclick="actSolidWater()" style="width:100%; background:#38bdf8; color:#0f172a; border:none; padding:10px; border-radius:6px; font-weight:bold; font-family:'Poppins'; cursor:pointer; margin-bottom:8px;"><i class="fas fa-water"></i> Lower into Water</button>
                    <button onclick="actSolidReset()" style="width:100%; background:#ef4444; color:#fff; border:none; padding:10px; border-radius:6px; font-weight:bold; font-family:'Poppins'; cursor:pointer;"><i class="fas fa-undo"></i> Reset Apparatus</button>
                </div>
            </div>

            <div style="flex: 2; min-width: 300px; background: #ffffff; border-radius: 8px; padding: 10px; display: flex; justify-content: center; position: relative; border: 2px solid #0f172a;">
                <canvas id="canvas-solid-density" width="450" height="420" style="max-width: 100%; height: auto;"></canvas>
            </div>
        </div>
    `;

    actSolidReset();
}

function actSolidChange() {
    solidDensityState.activeIdx = parseInt(document.getElementById('solid-obj-select').value);
    actSolidReset();
}

function actSolidReset() {
    solidDensityState.phase = 'idle';
    solidDensityState.currentV = solidDensityState.baseV1;
    solidDensityState.animX = 50; 
    solidDensityState.animY = 320; 
    document.getElementById('solid-scale-lcd').innerText = "0.00";
    if (solidDensityState.animFrameId) cancelAnimationFrame(solidDensityState.animFrameId);
    solidDensityLoop();
}

function actSolidScale() {
    solidDensityState.phase = 'scale';
    solidDensityState.animX = 130;
    solidDensityState.animY = 150; 
}

function actSolidWater() {
    solidDensityState.phase = 'water';
    solidDensityState.animX = 280;
    solidDensityState.animY = 50; 
}

function solidDensityLoop() {
    const canvas = document.getElementById('canvas-solid-density');
    if (!canvas) return; 
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const obj = solidDensityState.objects[solidDensityState.activeIdx];
    const pxPerMl = 3; 

    let displayMass = 0;

    if (solidDensityState.phase === 'scale') {
        if (solidDensityState.animY < 330 - (obj.h/2)) solidDensityState.animY += 10;
        else {
            solidDensityState.animY = 330 - (obj.h/2);
            displayMass = obj.m + (Math.random() * 0.08 - 0.04);
        }
    } else if (solidDensityState.phase === 'water') {
        if (solidDensityState.animY < 350 - (obj.h/2)) {
            solidDensityState.animY += 3; 
            let liquidLineY = 380 - (solidDensityState.currentV * pxPerMl);
            let objectBottomY = solidDensityState.animY + (obj.h/2);
            
            if (objectBottomY > liquidLineY) {
                let targetV = solidDensityState.baseV1 + obj.v;
                if (solidDensityState.currentV < targetV) {
                    solidDensityState.currentV += 0.5; 
                }
            }
        }
    }

    document.getElementById('solid-scale-lcd').innerText = displayMass.toFixed(2);

    ctx.fillStyle = '#cbd5e1'; ctx.fillRect(40, 360, 180, 40);
    ctx.fillStyle = '#64748b'; ctx.fillRect(110, 340, 40, 20);
    ctx.fillStyle = '#e2e8f0'; ctx.fillRect(80, 330, 100, 10);

    const cylX = 250; const cylY = 380; const cylW = 60;
    
    ctx.fillStyle = 'rgba(56, 189, 248, 0.4)';
    let liqHeight = solidDensityState.currentV * pxPerMl;
    ctx.fillRect(cylX, cylY - liqHeight, cylW, liqHeight);
    
    ctx.beginPath();
    ctx.ellipse(cylX + (cylW/2), cylY - liqHeight, cylW/2, 5, 0, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(14, 165, 233, 0.6)'; 
    ctx.fill();

    ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(cylX, 50); ctx.lineTo(cylX, cylY); ctx.lineTo(cylX + cylW, cylY); ctx.lineTo(cylX + cylW, 50); ctx.stroke();
    
    ctx.fillStyle = '#0f172a'; ctx.font = '10px Arial'; ctx.textAlign = 'right';
    for (let v = 0; v <= 100; v += 5) {
        let yPos = cylY - (v * pxPerMl);
        ctx.beginPath(); let isMajor = v % 10 === 0;
        ctx.moveTo(cylX + cylW, yPos); ctx.lineTo(cylX + cylW - (isMajor ? 12 : 6), yPos);
        ctx.lineWidth = isMajor ? 1.5 : 0.5; ctx.stroke();
        if (isMajor && v > 0) ctx.fillText(v, cylX - 5, yPos + 4);
    }

    if (solidDensityState.phase === 'water') {
        ctx.strokeStyle = '#f8fafc'; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(solidDensityState.animX, 0); ctx.lineTo(solidDensityState.animX, solidDensityState.animY); ctx.stroke();
    }
    
    ctx.fillStyle = '#3f3f46'; 
    ctx.fillRect(solidDensityState.animX - (obj.w/2), solidDensityState.animY - (obj.h/2), obj.w, obj.h);
    ctx.strokeStyle = '#71717a'; ctx.lineWidth = 2;
    ctx.strokeRect(solidDensityState.animX - (obj.w/2) + 2, solidDensityState.animY - (obj.h/2) + 2, obj.w - 4, obj.h - 4);

    const lensX = 390; const lensY = 200; const lensR = 50; const zoomFactor = 2.5;
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.4)'; ctx.lineWidth = 2; ctx.setLineDash([4, 4]); ctx.beginPath();
    ctx.moveTo(cylX + cylW, cylY - (solidDensityState.currentV * pxPerMl)); ctx.lineTo(lensX - lensR, lensY); ctx.stroke(); ctx.setLineDash([]);

    ctx.beginPath(); ctx.arc(lensX, lensY, lensR, 0, Math.PI * 2); ctx.fillStyle = '#f8fafc'; ctx.fill();
    ctx.lineWidth = 4; ctx.strokeStyle = '#0f172a'; ctx.stroke();

    ctx.save(); ctx.beginPath(); ctx.arc(lensX, lensY, lensR - 2, 0, Math.PI * 2); ctx.clip();

    ctx.fillStyle = 'rgba(56, 189, 248, 0.3)';
    ctx.fillRect(lensX - lensR, lensY, lensR * 2, lensR); 
    ctx.beginPath(); ctx.ellipse(lensX, lensY, lensR, 12, 0, 0, Math.PI * 2); 
    ctx.fillStyle = 'rgba(14, 165, 233, 0.6)'; ctx.fill();

    ctx.fillStyle = '#0f172a'; ctx.font = 'bold 14px Arial'; ctx.textAlign = 'left';
    let startV = Math.floor((solidDensityState.currentV - 10) / 2) * 2;
    for (let v = startV; v <= solidDensityState.currentV + 10; v += 2) {
        let diffMl = v - solidDensityState.currentV; 
        let yPosZoomed = lensY - (diffMl * pxPerMl * zoomFactor);
        
        if (yPosZoomed > lensY - lensR && yPosZoomed < lensY + lensR) {
            ctx.beginPath(); let isMajor = v % 10 === 0;
            ctx.moveTo(lensX - 25, yPosZoomed); ctx.lineTo(lensX + (isMajor ? 20 : 5), yPosZoomed);
            ctx.lineWidth = isMajor ? 3 : 1; ctx.strokeStyle = '#334155'; ctx.stroke();
            if (isMajor) ctx.fillText(v, lensX + 25, yPosZoomed + 5);
        }
    }

    ctx.restore(); 
    ctx.beginPath(); ctx.arc(lensX, lensY, lensR, 0, Math.PI * 2);
    let grad = ctx.createLinearGradient(lensX - lensR, lensY - lensR, lensX + lensR, lensY + lensR);
    grad.addColorStop(0, 'rgba(255,255,255,0.4)'); grad.addColorStop(0.5, 'rgba(255,255,255,0)'); grad.addColorStop(1, 'rgba(255,255,255,0.1)');
    ctx.fillStyle = grad; ctx.fill();

    solidDensityState.animFrameId = requestAnimationFrame(solidDensityLoop);
}

/**
 * ==========================================================================
 * ENGINE: M1:01 RELATIVE DENSITY (Buoyancy Simulator)
 * ==========================================================================
 */
function renderRelativeDensity() {
    let opts = '';
    relDensityState.stones.forEach((s, i) => opts += `<option value="${i}">Stone Object ${s.id}</option>`);

    document.getElementById('simulation-render-target').innerHTML = `
        <div class="bench-card" style="width: 100%; max-width: 850px; display: flex; flex-wrap: wrap; gap: 20px; background: #0d1117; padding: 1.5rem; border-radius: 12px; border: 1px solid #30363d; box-sizing: border-box;">
            <div style="flex: 1; min-width: 250px; display: flex; flex-direction: column; gap: 15px;">
                <div style="background: #161b22; padding: 20px; border-radius: 8px; border: 2px solid #30363d; text-align: center;">
                    <div style="color:#8b949e; font-size:0.85rem; margin-bottom:5px; font-family:'Orbitron';">SPRING BALANCE (N)</div>
                    <div class="lcd-screen" id="rd-lcd" style="color: #ef4444; font-size: 2.5rem; background: #000; padding: 10px; border-radius: 6px;">0.00</div>
                </div>
                <div style="background: #1e293b; padding: 15px; border-radius: 8px; border: 1px solid #334155;">
                    <select id="rd-stone-select" onchange="rdChangeStone()" style="width:100%; padding:10px; background:#0f172a; color:#fff; border:1px solid #475569; border-radius:4px; margin-bottom:15px;">${opts}</select>
                    <button onclick="rdSetMedium('air')" style="width:100%; margin-bottom:8px; background:#475569; color:#fff; border:none; padding:10px; border-radius:6px; font-weight:bold; cursor:pointer;">Weigh in Air</button>
                    <button onclick="rdSetMedium('water')" style="width:100%; margin-bottom:8px; background:#38bdf8; color:#0f172a; border:none; padding:10px; border-radius:6px; font-weight:bold; cursor:pointer;">Immerse in Water</button>
                    <button onclick="rdSetMedium('oil')" style="width:100%; background:#facc15; color:#0f172a; border:none; padding:10px; border-radius:6px; font-weight:bold; cursor:pointer;">Immerse in Oil</button>
                </div>
            </div>
            <div style="flex: 2; min-width: 300px; background: #fff; border-radius: 8px; padding: 10px; display: flex; justify-content: center; position: relative; border: 2px solid #0f172a;">
                <canvas id="canvas-rd" width="450" height="420"></canvas>
            </div>
        </div>
    `;
    rdChangeStone();
}

function rdChangeStone() {
    relDensityState.activeStone = parseInt(document.getElementById('rd-stone-select').value);
    rdSetMedium('air');
}

function rdSetMedium(med) {
    relDensityState.medium = med;
    if (med === 'air') relDensityState.animY = 450; // Beaker hidden
    else relDensityState.animY = 450; // Reset beaker to rise up
    if (relDensityState.animFrameId) cancelAnimationFrame(relDensityState.animFrameId);
    rdLoop();
}

function rdLoop() {
    const canvas = document.getElementById('canvas-rd'); if (!canvas) return;
    const ctx = canvas.getContext('2d'); ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const stone = relDensityState.stones[relDensityState.activeStone];
    let apparentWeight = stone.w;

    if (relDensityState.medium === 'water') apparentWeight = stone.w - (stone.w / stone.d * 1.0);
    if (relDensityState.medium === 'oil') apparentWeight = stone.w - (stone.w / stone.d * 0.85); 

    // Animate Beaker sliding up High enough to submerge stone
    if (relDensityState.medium !== 'air') {
        if (relDensityState.animY > 150) relDensityState.animY -= 8;
    } else {
        if (relDensityState.animY < 450) relDensityState.animY += 8;
    }

    // Draw Stand
    ctx.fillStyle = '#475569'; ctx.fillRect(100, 20, 15, 380); 
    ctx.fillRect(60, 400, 150, 15); 
    ctx.fillRect(115, 40, 100, 15); 

    // Draw Spring Balance Scale
    let springExt = 20 + (apparentWeight * 30);
    ctx.fillStyle = '#1e293b'; ctx.fillRect(185, 40, 30, 80); 
    ctx.fillStyle = '#f8fafc'; ctx.fillRect(195, 50, 10, 60); 
    
    // Draw Pull Spring & Hook
    ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 2; 
    ctx.beginPath(); ctx.moveTo(200, 120); ctx.lineTo(200, 120 + springExt); ctx.stroke();
    
    let hookY = 120 + springExt;
    ctx.beginPath(); ctx.arc(200, hookY + 5, 5, -Math.PI/2, Math.PI); ctx.stroke();

    // Draw Connecting String
    let stoneRadius = 15 + (stone.w * 5);
    let stoneY = hookY + 10 + 40; 
    ctx.strokeStyle = '#e2e8f0'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(200, hookY + 10); ctx.lineTo(200, stoneY - stoneRadius); ctx.stroke();

    // Draw Back Wall of Beaker
    if (relDensityState.medium !== 'air' && relDensityState.animY < 400) {
        ctx.fillStyle = 'rgba(255,255,255,0.2)';
        ctx.fillRect(130, relDensityState.animY + 40, 140, 160);
    }

    // Draw The Stone
    ctx.beginPath(); ctx.arc(200, stoneY, stoneRadius, 0, Math.PI*2);
    let grad = ctx.createRadialGradient(200-5, stoneY-5, 2, 200, stoneY, stoneRadius);
    grad.addColorStop(0, '#a1a1aa'); grad.addColorStop(1, '#3f3f46');
    ctx.fillStyle = grad; ctx.fill(); ctx.strokeStyle = '#27272a'; ctx.stroke();

    // Draw Liquid & Front Glass (Overlaps the stone!)
    if (relDensityState.medium !== 'air' && relDensityState.animY < 400) {
        ctx.fillStyle = relDensityState.medium === 'water' ? 'rgba(56, 189, 248, 0.6)' : 'rgba(250, 204, 21, 0.7)';
        ctx.fillRect(132, relDensityState.animY + 60, 136, 140); 
        
        ctx.strokeStyle = '#cbd5e1'; ctx.lineWidth = 4;
        ctx.beginPath(); ctx.moveTo(130, relDensityState.animY); ctx.lineTo(130, relDensityState.animY + 200);
        ctx.lineTo(270, relDensityState.animY + 200); ctx.lineTo(270, relDensityState.animY); ctx.stroke();
    }

    let displayW = apparentWeight + (Math.random() * 0.02 - 0.01);
    document.getElementById('rd-lcd').innerText = displayW.toFixed(2);
    relDensityState.animFrameId = requestAnimationFrame(rdLoop);
}

/**
 * ==========================================================================
 * ENGINE: M2:02B RUBBER BAND ELASTICITY
 * ==========================================================================
 */
/**
 * ==========================================================================
 * ENGINE: M2:02B RUBBER BAND ELASTICITY
 * ==========================================================================
 */
function renderRubberElasticity() {
    document.getElementById('simulation-render-target').innerHTML = `
        <div class="bench-card" style="width: 100%; max-width: 850px; display: flex; flex-wrap: wrap; gap: 20px; background: #0d1117; padding: 1.5rem; border-radius: 12px; border: 1px solid #30363d; box-sizing: border-box;">
            
            <div style="flex: 1; min-width: 250px; display: flex; flex-direction: column; gap: 15px;">
                <div style="background: #161b22; padding: 15px; border-radius: 8px; border: 2px solid #30363d; text-align: center;">
                    <div style="color:#8b949e; font-size:0.8rem; margin-bottom:5px; font-family:'Orbitron'; letter-spacing: 1px;">RULER READING (cm)</div>
                    <div class="lcd-screen" id="rubber-ruler-lcd" style="color: #38bdf8; font-size: 2.5rem; background: #000; padding: 10px; border-radius: 6px;">0.0</div>
                </div>

                <div style="background: #1e293b; padding: 20px; border-radius: 8px; border: 1px solid #334155;">
                    <label style="color:#fff; font-size:0.85rem; display:block; margin-bottom:8px; font-family:'Poppins';"><i class="fas fa-sliders-h"></i> Adjust Clamp Height</label>
                    <input type="range" id="rubber-clamp" min="20" max="180" value="100" step="1" style="width:100%; cursor:pointer;">
                    
                    <div style="margin-top:20px; padding-top:15px; border-top:1px solid #475569;">
                        <label style="color:#fff; font-size:0.85rem; display:block; margin-bottom:8px; font-family:'Poppins';">Added Mass: <span id="lbl-rubber-mass" style="color:#f59e0b; font-weight:bold;">0 g</span></label>
                        <button onclick="addRubberMass(50)" style="width:100%; background:var(--emerald); color:white; border:none; padding:10px; border-radius:6px; font-weight:bold; cursor:pointer; margin-bottom:8px; font-family:'Poppins';"><i class="fas fa-plus"></i> Load 50g Mass</button>
                        <button onclick="addRubberMass(0)" style="width:100%; background:#ef4444; color:white; border:none; padding:10px; border-radius:6px; font-weight:bold; cursor:pointer; font-family:'Poppins';"><i class="fas fa-undo"></i> Reset Load</button>
                    </div>
                </div>
                <div style="color: var(--amber); font-size: 0.8rem; text-align: center; font-family: 'Poppins';"><i class="fas fa-info-circle"></i> Log 'l' from the ruler, convert Mass to Weight (W=mg), and evaluate Extension!</div>
            </div>

            <div style="flex: 2; min-width: 300px; background: #fff; border-radius: 8px; padding: 10px; display: flex; justify-content: center; position: relative; border: 2px solid #0f172a;">
                <canvas id="canvas-rubber" width="450" height="380" style="max-width: 100%; height: auto;"></canvas>
            </div>
        </div>
    `;

    document.getElementById('rubber-clamp').addEventListener('input', (e) => {
        rubberBandState.clampY = parseInt(e.target.value); drawRubberSimulation();
    });
    drawRubberSimulation();
}

// THIS FUNCTION WAS MISSING!
function addRubberMass(amt) {
    if (amt === 0) rubberBandState.mass = 0;
    else if (rubberBandState.mass < 300) rubberBandState.mass += amt;
    document.getElementById('lbl-rubber-mass').innerText = `${rubberBandState.mass} g`;
    drawRubberSimulation();
}

function drawRubberSimulation() {
    const canvas = document.getElementById('canvas-rubber'); if (!canvas) return;
    const ctx = canvas.getContext('2d'); ctx.clearRect(0, 0, canvas.width, canvas.height);

    let loadForce = (rubberBandState.mass / 1000) * 9.81;
    let elasticityK = 45.0; 
    let stretchMeters = loadForce / elasticityK;
    let stretchCm = stretchMeters * 100;
    
    // Stretch physics scaling
    rubberBandState.stretch = rubberBandState.baseLength + (stretchCm * 15.0);

    // Draw Twin Laboratory Stands
    ctx.fillStyle = '#475569'; ctx.fillRect(80, 20, 15, 340); ctx.fillRect(350, 20, 15, 340);
    ctx.fillStyle = '#1e293b'; ctx.fillRect(40, 360, 100, 15); ctx.fillRect(310, 360, 100, 15);
    
    // Draw Adjustable Clamps
    let leftClampY = rubberBandState.clampY;
    let rightClampY = 100;
    ctx.fillStyle = '#334155'; ctx.fillRect(95, leftClampY, 30, 10); ctx.fillRect(320, rightClampY, 30, 10);

    // Draw Vertical Rubber Band Loop
    let loopBottomY = rightClampY + rubberBandState.stretch;
    ctx.strokeStyle = '#eab308'; ctx.lineWidth = rubberBandState.mass > 150 ? 2 : 4; 
    ctx.beginPath(); ctx.ellipse(335, rightClampY + (rubberBandState.stretch/2), 8, rubberBandState.stretch/2, 0, 0, Math.PI*2); ctx.stroke();

    // Draw Wooden Bar
    let barLeftY = leftClampY + 5;
    let barRightY = loopBottomY - 5;
    ctx.strokeStyle = '#b45309'; ctx.lineWidth = 6; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(110, barLeftY); ctx.lineTo(350, barRightY); ctx.stroke();

    // Draw Disposable Cups hanging from the wooden bar
    ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(125, barLeftY); ctx.lineTo(125, barLeftY + 20); ctx.stroke();
    ctx.fillStyle = 'rgba(255,255,255,0.7)'; ctx.beginPath(); ctx.moveTo(115, barLeftY + 20); ctx.lineTo(135, barLeftY + 20); ctx.lineTo(130, barLeftY + 45); ctx.lineTo(120, barLeftY + 45); ctx.fill(); ctx.stroke();
    
    let panX = 310;
    let panY = barRightY;
    ctx.beginPath(); ctx.moveTo(panX, panY); ctx.lineTo(panX, panY + 20); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(panX - 10, panY + 20); ctx.lineTo(panX + 10, panY + 20); ctx.lineTo(panX + 5, panY + 45); ctx.lineTo(panX - 5, panY + 45); ctx.fill(); ctx.stroke();

    // Draw Loaded Masses inside Cup 2
    let massCount = rubberBandState.mass / 50;
    ctx.fillStyle = '#f59e0b';
    for (let i = 0; i < massCount; i++) {
        ctx.fillRect(panX - 4, (panY + 40) - (i * 4), 8, 4);
    }

    // Draw Millimeter Ruler
    ctx.strokeStyle = '#0f172a'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(380, 20); ctx.lineTo(380, 340); ctx.stroke();
    ctx.fillStyle = '#0f172a'; ctx.font = '10px monospace';
    for (let i = 20; i < 340; i += 10) {
        let isMajor = (i - 20) % 50 === 0;
        ctx.beginPath(); ctx.moveTo(380, i); ctx.lineTo(isMajor ? 395 : 388, i); ctx.stroke();
    }

    // Draw Laser tracking to Ruler & Update LCD
    ctx.strokeStyle = 'rgba(239, 68, 68, 0.6)'; ctx.lineWidth = 2; ctx.setLineDash([4,4]);
    ctx.beginPath(); ctx.moveTo(335, loopBottomY); ctx.lineTo(380, loopBottomY); ctx.stroke(); ctx.setLineDash([]);
    ctx.fillStyle = '#ef4444'; ctx.beginPath(); ctx.moveTo(380, loopBottomY); ctx.lineTo(373, loopBottomY - 4); ctx.lineTo(373, loopBottomY + 4); ctx.fill();

    let rulerReadingCm = (loopBottomY - 20) / 3.2;
    document.getElementById('rubber-ruler-lcd').innerText = rulerReadingCm.toFixed(1);
}

/**
 * ==========================================================================
 * ENGINE: M3:03 & M4:04 DYNAMIC OSCILLATION TIMERS
 * ==========================================================================
 */
function renderOscillationEngine(engineType) {
    oscState.type = engineType === 'cantilever_oscillation' ? 'cantilever' : 'spring';
    
    // MASSIVE FIX: Drastically lowered k to make oscillations visually slow and countable (T ~ 1.5s to 2s)
    oscState.k = oscState.type === 'cantilever' ? 12.0 : 3.5; 
    oscState.effectiveMass = oscState.type === 'cantilever' ? 0.12 : 0.05;

    document.getElementById('simulation-render-target').innerHTML = `
        <div class="bench-card" style="width: 100%; max-width: 800px; display: flex; flex-wrap: wrap; gap: 20px; background: #0d1117; padding: 1.5rem; border-radius: 12px; border: 1px solid #30363d; box-sizing: border-box;">
            <div style="flex: 1; min-width: 250px; display: flex; flex-direction: column; gap: 15px;">
                <div style="background: #161b22; padding: 20px; border-radius: 8px; border: 2px solid #30363d; text-align: center;">
                    <div style="color:#8b949e; font-size:0.75rem; font-family:'Orbitron';">DIGITAL STOPWATCH</div>
                    <div class="lcd-screen" id="osc-sw-lcd" style="font-size:2.5rem; color:#38bdf8; background:#000; padding:10px; border-radius:6px; font-weight:bold;">0.00 s</div>
                    <div style="display:flex; gap:5px; margin-top:10px;">
                        <button onclick="toggleOscStopwatch()" style="flex:1; background:#2563eb; color:white; border:none; padding:10px; border-radius:4px; font-weight:bold; cursor:pointer;">Start/Stop</button>
                        <button onclick="resetOscStopwatch()" style="background:#4b5563; color:white; border:none; padding:10px; border-radius:4px; font-weight:bold; cursor:pointer;">Reset</button>
                    </div>
                </div>

                <div style="background: #1e293b; padding: 15px; border-radius: 8px; border: 1px solid #334155;">
                    <label style="color:#fff; font-size:0.85rem; display:block; margin-bottom:8px; font-family:'Poppins';">Load Mass (m): <span id="lbl-osc-m" style="color:#f59e0b; font-weight:bold;">0.10 kg</span></label>
                    <input type="range" id="slider-osc-m" min="5" max="50" value="10" step="5" style="width:100%; cursor:pointer;">
                    <button onclick="triggerOscillation()" style="width:100%; margin-top:15px; background:var(--emerald); color:white; border:none; padding:12px; border-radius:6px; font-weight:bold; cursor:pointer;"><i class="fas fa-hand-pointer"></i> Displace & Release</button>
                </div>
            </div>
            <div style="flex: 1.5; min-width: 300px; background: #fff; border-radius: 8px; padding: 10px; display: flex; justify-content: center; position: relative; border: 2px solid #0f172a;">
                <canvas id="canvas-osc" width="450" height="380"></canvas>
            </div>
        </div>
    `;

    document.getElementById('slider-osc-m').addEventListener('input', (e) => {
        oscState.mass = parseInt(e.target.value) / 100.0; // kg
        document.getElementById('lbl-osc-m').innerText = `${oscState.mass.toFixed(2)} kg`;
        oscState.isOscillating = false;
    });

    if (oscState.animId) cancelAnimationFrame(oscState.animId);
    oscLoop();
}

function triggerOscillation() {
    oscState.phase = 0;
    // Omega = sqrt(k / (m + m_eff))
    let totalMass = oscState.mass + oscState.effectiveMass;
    oscState.omega = Math.sqrt(oscState.k / totalMass); 
    oscState.amplitude = oscState.type === 'cantilever' ? 30 : 60; // Visual pixels
    oscState.isOscillating = true;
}

function toggleOscStopwatch() {
    if (oscState.swRunning) oscState.swRunning = false;
    else { oscState.swRunning = true; oscState.swLastTime = performance.now(); }
}

function resetOscStopwatch() {
    oscState.swRunning = false; oscState.swTime = 0;
    document.getElementById('osc-sw-lcd').innerText = "0.00 s";
}

function oscLoop() {
    const canvas = document.getElementById('canvas-osc'); if (!canvas) return;
    const ctx = canvas.getContext('2d'); ctx.clearRect(0,0, canvas.width, canvas.height);

    const now = performance.now();
    if (oscState.swRunning) {
        let dt = (now - oscState.swLastTime) / 1000;
        oscState.swTime += dt; oscState.swLastTime = now;
        document.getElementById('osc-sw-lcd').innerText = `${oscState.swTime.toFixed(2)} s`;
    }

    let displacement = 0;
    if (oscState.isOscillating) {
        oscState.phase += 0.016; 
        displacement = oscState.amplitude * Math.cos(oscState.omega * oscState.phase);
        // Damping
        oscState.amplitude *= 0.998; 
        if (oscState.amplitude < 0.5) oscState.isOscillating = false;
    }

    // MASSIVE FIX: Decoupled the visual sag from the math so it stays on screen!
    let visualSag = (oscState.mass * 200); 
    let dynamicY = visualSag + displacement;

    if (oscState.type === 'cantilever') {
        ctx.fillStyle = '#1e293b'; ctx.fillRect(20, 150, 80, 150);
        ctx.fillStyle = '#64748b'; ctx.fillRect(90, 130, 20, 20); // Clamp
        
        ctx.strokeStyle = '#b45309'; ctx.lineWidth = 10; ctx.lineCap = "round"; ctx.beginPath();
        ctx.moveTo(100, 140); ctx.lineTo(380, 140 + dynamicY); ctx.stroke(); // Beam

        ctx.fillStyle = '#475569'; ctx.fillRect(365, 140 + dynamicY, 30, 20 + (oscState.mass*100)); // Load
    } else {
        // Helical Spring - Fixed rendering to look tight and realistic!
        ctx.fillStyle = '#475569'; ctx.fillRect(200, 20, 50, 10); // Support
        ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 3; ctx.lineJoin = "round"; ctx.beginPath(); ctx.moveTo(225, 30);
        
        let springEndY = 80 + dynamicY;
        let loops = 25; // Tighter coils
        let step = (springEndY - 30) / loops;
        for (let i = 0; i <= loops; i++) {
            let offset = i % 2 === 0 ? 12 : -12; // Narrower width
            ctx.lineTo(225 + offset, 30 + (i * step));
        }
        ctx.stroke();

        // Draw the Broomstick pointer (from M4-04 instructions)
        ctx.strokeStyle = '#b45309'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(225, springEndY); ctx.lineTo(260, springEndY); ctx.stroke();

        // Draw Scale Pan & Load
        ctx.fillStyle = '#cbd5e1'; ctx.fillRect(210, springEndY, 30, 30 + (oscState.mass*100)); 
    }

    oscState.animId = requestAnimationFrame(oscLoop);
}

/**
 * ==========================================================================
 * ENGINE 10: M6:06 PRINCIPLE OF MOMENTS
 * ==========================================================================
 */
function renderMomentsWorkspace() {
    document.getElementById('simulation-render-target').innerHTML = `
        <div class="bench-card" style="width: 100%; max-width: 850px; display: flex; flex-wrap: wrap; gap: 20px; background: #0d1117; padding: 1.5rem; border-radius: 12px; border: 1px solid #30363d; box-sizing: border-box;">
            <div style="flex: 1; min-width: 200px; display: flex; flex-direction: column; gap: 15px;">
                <div style="background: #1e293b; padding: 20px; border-radius: 8px; border: 1px solid #334155;">
                    <div style="color: var(--emerald); font-size: 0.85rem; font-weight:bold; margin-bottom:15px;">Fixed Mass (M): 100g at x = 30cm</div>
                    
                    <label style="color:#fff; font-size:0.85rem; display:block; margin-bottom:8px; font-family:'Poppins';">Cup B Mass (m): <span id="lbl-mom-m" style="color:var(--sim-accent);">50 g</span></label>
                    <input type="range" id="slider-mom-m" min="50" max="250" value="50" step="10" style="width:100%; cursor:pointer; margin-bottom:15px;">
                    
                    <label style="color:#fff; font-size:0.85rem; display:block; margin-bottom:8px; font-family:'Poppins';">Cup B Distance (l): <span id="lbl-mom-l" style="color:var(--sim-accent);">30.0 cm</span></label>
                    <input type="range" id="slider-mom-l" min="5" max="45" value="30" step="0.5" style="width:100%; cursor:pointer;">
                </div>
                <div style="color: var(--amber); font-size: 0.8rem; text-align: center; font-family: 'Poppins';"><i class="fas fa-balance-scale"></i> Adjust distance 'l' until the bar is completely horizontal (0° tilt).</div>
            </div>
            <!-- FIXED: Changed min-width, added overflow hidden and max-width on canvas -->
            <div style="flex: 2; min-width: 200px; width: 100%; box-sizing: border-box; background: #fff; border-radius: 8px; padding: 10px; display: flex; justify-content: center; position: relative; border: 2px solid #0f172a; overflow: hidden;">
                <canvas id="canvas-moments" width="450" height="380" style="max-width: 100%; height: auto; display: block;"></canvas>
            </div>
        </div>
    `;

    document.getElementById('slider-mom-m').addEventListener('input', (e) => {
        momentsState.mass_m = parseInt(e.target.value);
        document.getElementById('lbl-mom-m').innerText = `${momentsState.mass_m} g`;
    });
    document.getElementById('slider-mom-l').addEventListener('input', (e) => {
        momentsState.l = parseFloat(e.target.value);
        document.getElementById('lbl-mom-l').innerText = `${momentsState.l.toFixed(1)} cm`;
    });

    momentsLoop();
}

function momentsLoop() {
    const canvas = document.getElementById('canvas-moments'); if(!canvas) return;
    const ctx = canvas.getContext('2d'); ctx.clearRect(0,0, canvas.width, canvas.height);

    // Physics Torque Calc
    let torqueLeft = momentsState.massM * momentsState.x;
    let torqueRight = momentsState.mass_m * momentsState.l;
    let netTorque = torqueRight - torqueLeft;
    
    // Convert torque to tilt angle (visual representation)
    let targetAngle = netTorque * 0.0003; 
    // Smooth animation to target angle
    momentsState.angle += (targetAngle - momentsState.angle) * 0.1;

    // Draw Pivot
    const cx = 225, cy = 150;
    ctx.fillStyle = '#475569'; ctx.fillRect(220, 20, 10, 130); // string
    ctx.beginPath(); ctx.arc(cx, cy, 6, 0, Math.PI*2); ctx.fillStyle = '#ef4444'; ctx.fill(); // fulcrum

    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(momentsState.angle);

    // Draw Wooden Bar
    ctx.fillStyle = '#b45309'; ctx.fillRect(-200, -5, 400, 10);
    // Draw Scale marks
    ctx.fillStyle = '#fff';
    for(let i = -180; i <= 180; i += 20) { ctx.fillRect(i, -5, 2, 5); }

    // Draw Left Cup M
    let pxLeft = -(momentsState.x * 4); // 4px per cm
    ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(pxLeft, 5); ctx.lineTo(pxLeft, 60); ctx.stroke();
    ctx.fillStyle = 'rgba(15, 23, 42, 0.8)'; ctx.fillRect(pxLeft-15, 60, 30, 30);
    ctx.fillStyle = '#fff'; ctx.font = '10px Arial'; ctx.fillText('100g', pxLeft-10, 78);

    // Draw Right Cup m
    let pxRight = (momentsState.l * 4);
    ctx.strokeStyle = '#94a3b8'; ctx.beginPath(); ctx.moveTo(pxRight, 5); ctx.lineTo(pxRight, 60); ctx.stroke();
    ctx.fillStyle = 'rgba(56, 189, 248, 0.8)'; ctx.fillRect(pxRight-15, 60, 30, 30);
    ctx.fillStyle = '#0f172a'; ctx.fillText(momentsState.mass_m + 'g', pxRight-10, 78);

    ctx.restore();

    // Tilt Indicator
    ctx.fillStyle = Math.abs(momentsState.angle) < 0.01 ? '#10b981' : '#ef4444';
    ctx.font = 'bold 14px Poppins'; ctx.textAlign = 'center';
    ctx.fillText(Math.abs(momentsState.angle) < 0.01 ? "PERFECTLY BALANCED" : "UNBALANCED", cx, 350);

    momentsState.animId = requestAnimationFrame(momentsLoop);
}

/**
 * ==========================================================================
 * ENGINE 11: M8:08 SIMPLE PULLEY (Atwood Machine)
 * ==========================================================================
 */
function renderPulleyWorkspace() {
    document.getElementById('simulation-render-target').innerHTML = `
        <div class="bench-card" style="width: 100%; max-width: 850px; display: flex; flex-wrap: wrap; gap: 20px; background: #0d1117; padding: 1.5rem; border-radius: 12px; border: 1px solid #30363d; box-sizing: border-box;">
            <div style="flex: 1; min-width: 200px; display: flex; flex-direction: column; gap: 15px;">
                <div style="background: #161b22; padding: 20px; border-radius: 8px; border: 2px solid #30363d; text-align: center;">
                    <div style="color:#8b949e; font-size:0.75rem; font-family:'Orbitron';">AUTO-GATE TIMER (s)</div>
                    <div class="lcd-screen" id="pull-sw-lcd" style="font-size:2.5rem; color:#10b981; background:#000; padding:10px; border-radius:6px; font-weight:bold;">0.00</div>
                </div>
                <div style="background: #1e293b; padding: 15px; border-radius: 8px; border: 1px solid #334155;">
                    <div style="color: var(--emerald); font-size: 0.85rem; font-weight:bold; margin-bottom:15px;">Mass B: Fixed at 235g</div>
                    
                    <label style="color:#fff; font-size:0.85rem; display:block; margin-bottom:8px; font-family:'Poppins';">Added Sand to A: <span id="lbl-pull-m" style="color:var(--sim-accent);">0 g</span></label>
                    <input type="range" id="slider-pull-m" min="0" max="25" value="0" step="5" style="width:100%; cursor:pointer; margin-bottom:15px;">
                    
                    <label style="color:#fff; font-size:0.85rem; display:block; margin-bottom:8px; font-family:'Poppins';">Height (h): <span id="lbl-pull-h" style="color:var(--sim-accent);">40 cm</span></label>
                    <input type="range" id="slider-pull-h" min="30" max="80" value="40" step="5" style="width:100%; cursor:pointer;">
                    
                    <button onclick="triggerPulley()" style="width:100%; margin-top:20px; background:var(--cobalt); color:white; border:none; padding:12px; border-radius:6px; font-weight:bold; cursor:pointer;"><i class="fas fa-play"></i> Release System</button>
                </div>
            </div>
            <!-- FIXED: Changed min-width, added overflow hidden and max-width on canvas -->
            <div style="flex: 2; min-width: 200px; width: 100%; box-sizing: border-box; background: #fff; border-radius: 8px; padding: 10px; display: flex; justify-content: center; position: relative; border: 2px solid #0f172a; overflow: hidden;">
                <canvas id="canvas-pulley" width="450" height="400" style="max-width: 100%; height: auto; display: block;"></canvas>
            </div>
        </div>
    `;

    document.getElementById('slider-pull-m').addEventListener('input', (e) => {
        pulleyState.massA = 200 + parseInt(e.target.value);
        document.getElementById('lbl-pull-m').innerText = `${e.target.value} g`;
        resetPulley();
    });
    document.getElementById('slider-pull-h').addEventListener('input', (e) => {
        pulleyState.h = parseInt(e.target.value);
        document.getElementById('lbl-pull-h').innerText = `${pulleyState.h} cm`;
        resetPulley();
    });

    resetPulley();
    pulleyLoop();
}

function resetPulley() {
    pulleyState.isMoving = false; pulleyState.yPos = 0; pulleyState.time = 0;
    document.getElementById('pull-sw-lcd').innerText = "0.00";
}

function triggerPulley() {
    if (pulleyState.isMoving) return;
    let netForce = (pulleyState.massB - pulleyState.massA) * 9.81;
    let totalMass = pulleyState.massB + pulleyState.massA;
    let acceleration = netForce / totalMass; // cm/s^2 approx
    pulleyState.totalTime = Math.sqrt((2 * pulleyState.h) / acceleration);
    // Reaction buffer
    pulleyState.totalTime += (Math.random() * 0.04 - 0.02);
    pulleyState.isMoving = true;
}

function pulleyLoop() {
    const canvas = document.getElementById('canvas-pulley'); if(!canvas) return;
    const ctx = canvas.getContext('2d'); ctx.clearRect(0,0, canvas.width, canvas.height);

    let maxVisDrop = pulleyState.h * 2.5; 

    if (pulleyState.isMoving) {
        pulleyState.time += 0.016;
        let progress = Math.pow(pulleyState.time / pulleyState.totalTime, 2);
        if (progress >= 1.0) { progress = 1.0; pulleyState.isMoving = false; document.getElementById('pull-sw-lcd').innerText = pulleyState.totalTime.toFixed(2); }
        else { document.getElementById('pull-sw-lcd').innerText = pulleyState.time.toFixed(2); }
        pulleyState.yPos = progress * maxVisDrop;
    }

    // Draw Stand
    ctx.fillStyle = '#475569'; ctx.fillRect(50, 20, 15, 360); ctx.fillRect(20, 380, 400, 20);
    ctx.fillStyle = '#334155'; ctx.fillRect(65, 50, 300, 10);
    
    // Draw Pulleys
    ctx.beginPath(); ctx.arc(120, 65, 15, 0, Math.PI*2); ctx.fillStyle = '#94a3b8'; ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.arc(330, 65, 15, 0, Math.PI*2); ctx.fill(); ctx.stroke();

    // Strings
    let ay = 250 - pulleyState.yPos; // A goes UP
    let by = 150 + pulleyState.yPos; // B goes DOWN
    
    ctx.strokeStyle = '#0f172a'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(105, 65); ctx.lineTo(105, ay); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(135, 65); ctx.lineTo(315, 65); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(345, 65); ctx.lineTo(345, by); ctx.stroke();

    // Masses
    ctx.fillStyle = '#ef4444'; ctx.fillRect(90, ay, 30, 30); // Mass A
    ctx.fillStyle = '#fff'; ctx.font = '10px Arial'; ctx.fillText('A', 100, ay + 20);
    
    ctx.fillStyle = '#3b82f6'; ctx.fillRect(330, by, 30, 30); // Mass B
    ctx.fillStyle = '#fff'; ctx.fillText('B', 340, by + 20);

    // Height marker
    ctx.strokeStyle = '#10b981'; ctx.setLineDash([4,4]);
    ctx.beginPath(); ctx.moveTo(90, 250); ctx.lineTo(380, 250); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(330, 250 + maxVisDrop); ctx.lineTo(380, 250 + maxVisDrop); ctx.stroke(); ctx.setLineDash([]);
    ctx.fillStyle = '#10b981'; ctx.font = 'bold 12px Arial'; ctx.fillText(`h = ${pulleyState.h} cm`, 385, 250 + (maxVisDrop/2));

    pulleyState.animId = requestAnimationFrame(pulleyLoop);
}

/**
 * ==========================================================================
 * ENGINE 12: SW1:09 SPEED OF SOUND IN AIR (WEB AUDIO API RESO-ENGINE)
 * Absolutely the best thing Cameroonian students will see/hear!
 * ==========================================================================
 */
function renderSoundWorkspace() {
    document.getElementById('simulation-render-target').innerHTML = `
        <div class="bench-card" style="width: 100%; max-width: 850px; display: flex; gap: 20px; background: #0d1117; padding: 1.5rem; border-radius: 12px; border: 1px solid #30363d; box-sizing: border-box;">
            <div style="flex: 1; display: flex; flex-direction: column; gap: 15px;">
                <div style="background: #161b22; padding: 20px; border-radius: 8px; border: 2px solid #30363d; text-align: center;">
                    <div style="color:#10b981; font-size:0.9rem; font-weight:bold; margin-bottom:10px;"><i class="fas fa-volume-up"></i> LIVE AUDIO ENABLED</div>
                    <button id="btn-strike-fork" onclick="strikeTuningFork()" style="width:100%; background:#f59e0b; color:#000; border:none; padding:15px; border-radius:8px; font-weight:bold; font-size:1.1rem; cursor:pointer; box-shadow:0 0 15px rgba(245, 158, 11, 0.4);"><i class="fas fa-bolt"></i> Strike Fork & Listen</button>
                </div>
                <div style="background: #1e293b; padding: 15px; border-radius: 8px; border: 1px solid #334155;">
                    <label style="color:#f8fafc; font-size:0.85rem; display:block; margin-bottom:8px; font-family:'Poppins';">Select Tuning Fork (f)</label>
                    <select id="sound-f-select" onchange="changeTuningFork()" style="width:100%; padding:10px; background:#0f172a; color:#fff; border:1px solid #475569; border-radius:4px; margin-bottom:15px;">
                        <option value="256">256 Hz</option>
                        <option value="288">288 Hz</option>
                        <option value="320">320 Hz</option>
                        <option value="384">384 Hz</option>
                        <option value="426">426 Hz</option>
                        <option value="480">480 Hz</option>
                        <option value="512">512 Hz</option>
                    </select>
                    
                    <label style="color:#fff; font-size:0.85rem; display:block; margin-bottom:8px; font-family:'Poppins';">Drag Pipe Length (L): <span id="lbl-sound-l" style="color:var(--sim-accent);">10.0 cm</span></label>
                    <input type="range" id="slider-sound-l" min="5" max="45" value="10" step="0.1" style="width:100%; cursor:pointer;">
                </div>
            </div>
            <div style="flex: 1.5; background: #010409; border-radius: 8px; padding: 10px; display: flex; justify-content: center; position: relative; border: 2px solid #0f172a; overflow:hidden;">
                <canvas id="canvas-sound" width="400" height="400"></canvas>
            </div>
        </div>
    `;

    document.getElementById('slider-sound-l').addEventListener('input', (e) => {
        soundState.tubeL = parseFloat(e.target.value);
        document.getElementById('lbl-sound-l').innerText = `${soundState.tubeL.toFixed(1)} cm`;
        updateSoundVolume();
    });

    changeTuningFork();
    soundLoop();
}

function changeTuningFork() {
    soundState.freq = parseInt(document.getElementById('sound-f-select').value);
    if (soundState.isRinging) {
        stopTuningFork();
        setTimeout(strikeTuningFork, 100);
    }
}

function strikeTuningFork() {
    if (soundState.isRinging) return;
    
    // Web Audio API magic!
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    soundState.audioCtx = new AudioContext();
    soundState.oscillator = soundState.audioCtx.createOscillator();
    soundState.gainNode = soundState.audioCtx.createGain();

    soundState.oscillator.type = 'sine'; // Pure tone
    soundState.oscillator.frequency.value = soundState.freq;
    
    soundState.oscillator.connect(soundState.gainNode);
    soundState.gainNode.connect(soundState.audioCtx.destination);
    
    soundState.gainNode.gain.value = 0.05; // Base low volume
    soundState.oscillator.start();
    
    soundState.isRinging = true;
    document.getElementById('btn-strike-fork').innerHTML = `<i class="fas fa-volume-mute"></i> Stop Sound`;
    document.getElementById('btn-strike-fork').style.background = '#ef4444';
    document.getElementById('btn-strike-fork').onclick = stopTuningFork;
    
    updateSoundVolume();
}

function stopTuningFork() {
    if (soundState.oscillator) {
        soundState.oscillator.stop();
        soundState.audioCtx.close();
    }
    soundState.isRinging = false;
    document.getElementById('btn-strike-fork').innerHTML = `<i class="fas fa-bolt"></i> Strike Fork & Listen`;
    document.getElementById('btn-strike-fork').style.background = '#f59e0b';
    document.getElementById('btn-strike-fork').onclick = strikeTuningFork;
}

function updateSoundVolume() {
    if (!soundState.isRinging) return;
    
    // MATHEMATICAL RESONANCE ENGINE
    // L = (v/4f) - e
    let theoreticalResonanceL = (soundState.v / (4 * soundState.freq)) - soundState.endCorrection;
    
    // Distance from the sweet spot
    let diff = Math.abs(soundState.tubeL - theoreticalResonanceL);
    
    // Gaussian volume amplification curve! It swells loudly ONLY at the exact mm.
    let volumeSwell = 0.05 + 0.85 * Math.exp(-(diff * diff) / 2.0); // sharp peak
    
    soundState.gainNode.gain.setTargetAtTime(volumeSwell, soundState.audioCtx.currentTime, 0.1);
}

function soundLoop() {
    const canvas = document.getElementById('canvas-sound'); if(!canvas) return;
    const ctx = canvas.getContext('2d'); ctx.clearRect(0,0, canvas.width, canvas.height);

    // Draw Water Cylinder
    ctx.fillStyle = 'rgba(56, 189, 248, 0.4)'; ctx.fillRect(140, 150, 120, 240);
    ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 4;
    ctx.beginPath(); ctx.moveTo(140, 50); ctx.lineTo(140, 390); ctx.lineTo(260, 390); ctx.lineTo(260, 50); ctx.stroke();

    // Draw PVC Pipe (Moveable)
    // 1 cm = 6 pixels. Water surface is at Y=150.
    let tubeBottomY = 150 + (50 * 6) - (soundState.tubeL * 6); 
    let tubeTopY = tubeBottomY - (50 * 6); // 50cm pipe
    
    ctx.fillStyle = '#e2e8f0'; ctx.fillRect(175, tubeTopY, 50, 50 * 6);
    ctx.strokeStyle = '#64748b'; ctx.lineWidth = 2; ctx.strokeRect(175, tubeTopY, 50, 50 * 6);

    // Draw Ruler
    ctx.strokeStyle = '#fff'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(320, 150); ctx.lineTo(320, -50); ctx.stroke();
    ctx.fillStyle = '#fff'; ctx.font = '10px monospace';
    for(let i=0; i<=45; i+=5) {
        let ty = 150 - (i*6);
        ctx.beginPath(); ctx.moveTo(320, ty); ctx.lineTo(330, ty); ctx.stroke();
        ctx.fillText(i, 335, ty+3);
    }

    // Dynamic Sound Waves Visualizer!
    if (soundState.isRinging) {
        let theoreticalResonanceL = (soundState.v / (4 * soundState.freq)) - soundState.endCorrection;
        let diff = Math.abs(soundState.tubeL - theoreticalResonanceL);
        
        let isResonating = diff < 2.0; // Close to resonance
        let waveColor = isResonating ? 'rgba(239, 68, 68, ' : 'rgba(56, 189, 248, '; // Turns red and thick!
        
        let time = performance.now() / 1000;
        ctx.lineWidth = isResonating ? 4 : 1;
        
        for (let i = 0; i < 3; i++) {
            let radius = ((time * 50 + (i * 20)) % 60) + 10;
            let alpha = 1 - (radius / 70);
            ctx.strokeStyle = waveColor + alpha + ')';
            ctx.beginPath(); ctx.arc(200, tubeTopY - 20, radius, Math.PI, 0); ctx.stroke();
        }

        // Draw tuning fork vibrating
        ctx.fillStyle = '#94a3b8'; ctx.fillRect(195, tubeTopY - 60, 10, 30);
        let forkVib = Math.sin(time * 50) * 2;
        ctx.beginPath(); ctx.moveTo(195, tubeTopY - 60); ctx.quadraticCurveTo(180+forkVib, tubeTopY-80, 180, tubeTopY-100); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(205, tubeTopY - 60); ctx.quadraticCurveTo(220-forkVib, tubeTopY-80, 220, tubeTopY-100); ctx.stroke();
    }

    soundState.animId = requestAnimationFrame(soundLoop);
}

/**
 * ==========================================================================
 * ENGINE 13: M7:07 CONCURRENT FORCES
 * ==========================================================================
 */
function renderConcurrentWorkspace() {
    document.getElementById('simulation-render-target').innerHTML = `
        <div class="bench-card" style="width: 100%; max-width: 800px; display: flex; flex-wrap: wrap; gap: 20px; background: #0d1117; padding: 1.5rem; border-radius: 12px; border: 1px solid #30363d; box-sizing: border-box;">
            <div style="flex: 1; min-width: 200px; display: flex; flex-direction: column; gap: 15px;">
                <div style="background: #1e293b; padding: 20px; border-radius: 8px; border: 1px solid #334155;">
                    <label style="color:#fff; font-size:0.85rem; display:block; margin-bottom:8px; font-family:'Poppins';">Scale Pan Mass: <span id="lbl-con-m" style="color:var(--sim-accent);">0 g</span></label>
                    <input type="range" id="slider-con-m" min="0" max="300" value="0" step="50" style="width:100%; cursor:pointer;">
                </div>
                <div style="color: var(--amber); font-size: 0.8rem; text-align: center; font-family: 'Poppins';"><i class="fas fa-pencil-ruler"></i> Use visual protractor to measure β.</div>
            </div>
            <!-- FIXED: Changed min-width, added overflow hidden and max-width on canvas -->
            <div style="flex: 2; min-width: 200px; width: 100%; box-sizing: border-box; background: #fff; border-radius: 8px; padding: 10px; display: flex; justify-content: center; position: relative; border: 2px solid #0f172a; overflow: hidden;">
                <canvas id="canvas-concurrent" width="450" height="380" style="max-width: 100%; height: auto; display: block;"></canvas>
            </div>
        </div>
    `;

    document.getElementById('slider-con-m').addEventListener('input', (e) => {
        concurrentState.mass = parseInt(e.target.value);
        document.getElementById('lbl-con-m').innerText = `${concurrentState.mass} g`;
    });

    concurrentLoop();
}

function concurrentLoop() {
    const canvas = document.getElementById('canvas-concurrent'); if(!canvas) return;
    const ctx = canvas.getContext('2d'); ctx.clearRect(0,0, canvas.width, canvas.height);

    // Physics
    let forceY = (concurrentState.mass / 1000) * 9.81; // Load
    // Spring stretches based on Y force component
    concurrentState.l2 = concurrentState.l0 + (forceY * 1.5); 
    // Angle opens up as weight pulls down
    concurrentState.beta = 90 - (forceY * 8); 

    let angleRad = (concurrentState.beta / 2) * (Math.PI / 180);
    let pX = 225, pY = 100 + (concurrentState.l2 * 8);

    // Draw Bar
    ctx.fillStyle = '#b45309'; ctx.fillRect(50, 40, 350, 15);
    
    // Draw Spring and String
    ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 3; 
    let springTopX = pX - (Math.tan(angleRad) * (pY - 40));
    let stringTopX = pX + (Math.tan(angleRad) * (pY - 40));

    // Spring (Left)
    ctx.beginPath(); ctx.moveTo(springTopX, 55); 
    for(let i=0; i<10; i++) { ctx.lineTo(springTopX + ((pX-springTopX)/10)*i + (i%2==0?10:-10), 55 + ((pY-55)/10)*i); }
    ctx.lineTo(pX, pY); ctx.stroke();

    // String (Right)
    ctx.beginPath(); ctx.moveTo(stringTopX, 55); ctx.lineTo(pX, pY); ctx.stroke();

    // Draw Protractor Overlay
    ctx.strokeStyle = 'rgba(239, 68, 68, 0.4)'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(pX, pY, 60, -Math.PI/2 - angleRad, -Math.PI/2 + angleRad); ctx.stroke();
    ctx.fillStyle = '#ef4444'; ctx.font = 'bold 12px Arial'; ctx.fillText(`β = ${concurrentState.beta.toFixed(1)}°`, pX - 25, pY - 70);

    // Load
    ctx.fillStyle = '#334155'; ctx.fillRect(pX - 20, pY, 40, 20 + (concurrentState.mass*0.1));
    ctx.fillStyle = '#fff'; ctx.fillText(concurrentState.mass + 'g', pX - 10, pY + 15);

    concurrentState.animId = requestAnimationFrame(concurrentLoop);
}

/**
 * ==========================================================================
 * ENGINE 14: H2:11 SPECIFIC LATENT HEAT OF VAPORIZATION
 * ==========================================================================
 */
function renderVaporizationWorkspace() {
    document.getElementById('simulation-render-target').innerHTML = `
        <div class="bench-card" style="width: 100%; max-width: 850px; display: flex; flex-wrap: wrap; gap: 20px; background: #0d1117; padding: 1.5rem; border-radius: 12px; border: 1px solid #30363d; box-sizing: border-box;">
            <div style="flex: 1; min-width: 250px; display: flex; flex-direction: column; gap: 15px;">
                <div style="background: #161b22; padding: 20px; border-radius: 8px; border: 2px solid #30363d; text-align: center;">
                    <div style="color:#8b949e; font-size:0.8rem; margin-bottom:5px; font-family:'Orbitron';">TOP PAN BALANCE (g)</div>
                    <div class="lcd-screen" id="vapor-mass-lcd" style="font-size:2.5rem; color:#ef4444; background:#000; padding:10px; border-radius:6px; font-weight:bold;">0.0</div>
                </div>
                <div style="background: #161b22; padding: 20px; border-radius: 8px; border: 2px solid #30363d; text-align: center;">
                    <div style="color:#8b949e; font-size:0.8rem; margin-bottom:5px; font-family:'Orbitron';">STOPWATCH (s)</div>
                    <div class="lcd-screen" id="vapor-time-lcd" style="font-size:2.5rem; color:#38bdf8; background:#000; padding:10px; border-radius:6px; font-weight:bold;">0.0</div>
                </div>
                <div style="background: #1e293b; padding: 15px; border-radius: 8px; border: 1px solid #334155;">
                    <button id="btn-vapor-power" onclick="toggleVaporPower()" style="width:100%; background:var(--emerald); color:white; border:none; padding:12px; border-radius:6px; font-weight:bold; cursor:pointer; font-family:'Poppins';"><i class="fas fa-power-off"></i> Power ON (1000W)</button>
                    <button onclick="resetVapor()" style="width:100%; margin-top:10px; background:#ef4444; color:white; border:none; padding:12px; border-radius:6px; font-weight:bold; cursor:pointer; font-family:'Poppins';"><i class="fas fa-undo"></i> Refill Water & Reset</button>
                </div>
            </div>
            <div style="flex: 1.5; min-width: 300px; background: #fff; border-radius: 8px; padding: 10px; display: flex; justify-content: center; position: relative; border: 2px solid #0f172a; overflow:hidden;">
                <canvas id="canvas-vapor" width="400" height="400" style="max-width: 100%; height: auto; display:block;"></canvas>
            </div>
        </div>
    `;
    resetVapor();
}

function resetVapor() {
    vaporState.isBoiling = false; vaporState.time = 0; vaporState.mass = 650.5; vaporState.bubbles = [];
    document.getElementById('btn-vapor-power').innerHTML = `<i class="fas fa-power-off"></i> Power ON (1000W)`;
    document.getElementById('btn-vapor-power').style.background = 'var(--emerald)';
    document.getElementById('vapor-time-lcd').innerText = "0.0";
    if (vaporState.animId) cancelAnimationFrame(vaporState.animId);
    vaporLoop();
}

function toggleVaporPower() {
    vaporState.isBoiling = !vaporState.isBoiling;
    if (vaporState.isBoiling) {
        vaporState.lastTick = performance.now();
        document.getElementById('btn-vapor-power').innerHTML = `<i class="fas fa-power-off"></i> Power OFF`;
        document.getElementById('btn-vapor-power').style.background = '#f59e0b';
    } else {
        document.getElementById('btn-vapor-power').innerHTML = `<i class="fas fa-power-off"></i> Power ON (1000W)`;
        document.getElementById('btn-vapor-power').style.background = 'var(--emerald)';
    }
}

function vaporLoop() {
    const canvas = document.getElementById('canvas-vapor'); if(!canvas) return;
    const ctx = canvas.getContext('2d'); ctx.clearRect(0,0, canvas.width, canvas.height);

    if (vaporState.isBoiling) {
        const now = performance.now();
        let dt = (now - vaporState.lastTick) / 1000;
        
        // Time accelerates slightly for user experience (1 real sec = 4 sim secs)
        let simDt = dt * 4; 
        vaporState.time += simDt;
        vaporState.lastTick = now;

        // E = Pt = mL_v  ==> m_loss = (P * t) / L_v
        let energyJoules = vaporState.power * simDt;
        let massLossGrams = energyJoules / vaporState.latentHeat;
        vaporState.mass -= massLossGrams;

        // Generate Bubbles
        if (Math.random() < 0.4) {
            vaporState.bubbles.push({ x: 160 + Math.random()*80, y: 310, r: Math.random()*4 + 2, s: Math.random()*2 + 1 });
        }
        document.getElementById('vapor-time-lcd').innerText = vaporState.time.toFixed(1);
    }

    // Display Jitter
    let displayMass = vaporState.mass + (vaporState.isBoiling ? (Math.random()*0.4 - 0.2) : 0);
    document.getElementById('vapor-mass-lcd').innerText = displayMass.toFixed(1);

    // Draw Top Pan Balance
    ctx.fillStyle = '#cbd5e1'; ctx.fillRect(100, 340, 200, 40);
    ctx.fillStyle = '#1e293b'; ctx.fillRect(140, 330, 120, 10); // Pan

    // Draw Plastic Cup & Water
    let waterLevelY = 330 - ((vaporState.mass - 150) * 0.3); // 150g is cup mass
    ctx.fillStyle = 'rgba(56, 189, 248, 0.5)'; ctx.fillRect(150, waterLevelY, 100, 330 - waterLevelY);
    ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 3; 
    ctx.beginPath(); ctx.moveTo(150, 150); ctx.lineTo(150, 330); ctx.lineTo(250, 330); ctx.lineTo(250, 150); ctx.stroke();

    // Draw Heating Coil
    ctx.strokeStyle = '#b45309'; ctx.lineWidth = 6; ctx.beginPath();
    ctx.moveTo(350, 50); ctx.lineTo(200, 50); ctx.lineTo(200, 280); 
    // Coil loops
    for(let i=0; i<4; i++) {
        ctx.lineTo(170, 285 + (i*10)); ctx.lineTo(230, 290 + (i*10));
    }
    ctx.stroke();

    // Animate Bubbles & Steam
    ctx.fillStyle = 'rgba(255,255,255,0.7)';
    for (let i = vaporState.bubbles.length - 1; i >= 0; i--) {
        let b = vaporState.bubbles[i];
        ctx.beginPath(); ctx.arc(b.x, b.y, b.r, 0, Math.PI*2); ctx.fill();
        b.y -= b.s; // Float up
        b.x += Math.sin(b.y / 10); // Wiggle
        if (b.y < waterLevelY) vaporState.bubbles.splice(i, 1); // Pop at surface
    }

    // Draw Steam if boiling
    if (vaporState.isBoiling) {
        ctx.fillStyle = 'rgba(226, 232, 240, 0.4)';
        for(let i=0; i<3; i++) {
            ctx.beginPath(); 
            ctx.arc(200 + Math.sin(performance.now()/300 + i)*20, waterLevelY - 20 - (performance.now()/20 % 50) - (i*15), 15 + i*5, 0, Math.PI*2); 
            ctx.fill();
        }
    }

    vaporState.animId = requestAnimationFrame(vaporLoop);
}

/**
 * ==========================================================================
 * ENGINE 15: OPTICAL BENCH (BLUR-FOCUS SIMULATION)
 * ==========================================================================
 */
function renderOpticalBenchWorkspace() {
    document.getElementById('simulation-render-target').innerHTML = `
        <div class="bench-card" style="width: 100%; max-width: 850px; display: flex; flex-wrap: wrap; gap: 20px; background: #0d1117; padding: 1.5rem; border-radius: 12px; border: 1px solid #30363d; box-sizing: border-box;">
            <div style="flex: 1; min-width: 250px; display: flex; flex-direction: column; gap: 15px;">
                
                <div style="background: #000; padding: 10px; border-radius: 8px; border: 2px solid #38bdf8; position: relative; overflow: hidden; height: 180px; display: flex; justify-content: center; align-items: center;">
                    <div style="position:absolute; top:5px; left:10px; color:#38bdf8; font-family:'Orbitron'; font-size:0.7rem; font-weight:bold;">SCREEN VIEW MONITOR</div>
                    <canvas id="canvas-optics-monitor" width="200" height="150"></canvas>
                </div>

                <div style="background: #1e293b; padding: 20px; border-radius: 8px; border: 1px solid #334155;">
                    <label style="color:#fff; font-size:0.85rem; display:block; margin-bottom:8px; font-family:'Poppins';">Object Distance (u): <span id="lbl-opt-u" style="color:var(--sim-accent);">25.0 cm</span></label>
                    <input type="range" id="slider-opt-u" min="16" max="60" value="25" step="0.5" style="width:100%; cursor:pointer; margin-bottom:15px;">
                    
                    <label style="color:#fff; font-size:0.85rem; display:block; margin-bottom:8px; font-family:'Poppins';">Screen Distance (v): <span id="lbl-opt-v" style="color:var(--sim-accent);">50.0 cm</span></label>
                    <input type="range" id="slider-opt-v" min="15" max="100" value="50" step="0.5" style="width:100%; cursor:pointer;">
                </div>
                <div style="color: var(--emerald); font-size: 0.8rem; text-align: center; font-family: 'Poppins';"><i class="fas fa-eye"></i> Drag the Screen (v) until the monitor image is perfectly sharp!</div>
            </div>

            <div style="flex: 2; min-width: 300px; background: #fff; border-radius: 8px; padding: 10px; display: flex; justify-content: center; position: relative; border: 2px solid #0f172a; overflow:hidden;">
                <canvas id="canvas-optics-bench" width="450" height="380" style="max-width: 100%; height: auto; display:block;"></canvas>
            </div>
        </div>
    `;

    document.getElementById('slider-opt-u').addEventListener('input', (e) => {
        opticsState.u = parseFloat(e.target.value);
        document.getElementById('lbl-opt-u').innerText = `${opticsState.u.toFixed(1)} cm`;
    });
    document.getElementById('slider-opt-v').addEventListener('input', (e) => {
        opticsState.v = parseFloat(e.target.value);
        document.getElementById('lbl-opt-v').innerText = `${opticsState.v.toFixed(1)} cm`;
    });

    opticsLoop();
}

function opticsLoop() {
    const canvasBench = document.getElementById('canvas-optics-bench');
    const canvasMonitor = document.getElementById('canvas-optics-monitor');
    if(!canvasBench || !canvasMonitor) return;
    
    const ctxB = canvasBench.getContext('2d'); ctxB.clearRect(0,0, canvasBench.width, canvasBench.height);
    const ctxM = canvasMonitor.getContext('2d'); ctxM.clearRect(0,0, canvasMonitor.width, canvasMonitor.height);

    // --- MATH: Thin Lens Equation (1/f = 1/u + 1/v) ---
    // Calculate where the true sharp image is physically located
    let exactV = (opticsState.u * opticsState.focalLength) / (opticsState.u - opticsState.focalLength);
    
    // Calculate blur magnitude based on how far the screen is from the exact focal point
    let errorDistance = Math.abs(opticsState.v - exactV);
    let blurPx = errorDistance * 1.5; // Visual blur multiplier

    // Calculate Magnification for the monitor
    let mag = exactV / opticsState.u;

    // ==========================================
    // 1. RENDER TOP-DOWN OPTICAL BENCH
    // ==========================================
    // Draw Ruler Base
    ctxB.fillStyle = '#1e293b'; ctxB.fillRect(20, 300, 410, 20);
    ctxB.fillStyle = '#fff'; ctxB.font = '9px monospace';
    for(let i=0; i<=100; i+=10) {
        let x = 25 + (i * 3.8); // 3.8 pixels per cm
        ctxB.fillRect(x, 300, 2, 5);
        ctxB.fillText(i, x-5, 318);
    }

    let lensX = 25 + (50 * 3.8); // Lens fixed at 50cm mark
    let objX = lensX - (opticsState.u * 3.8);
    let screenX = lensX + (opticsState.v * 3.8);

    // Draw Lens
    ctxB.fillStyle = 'rgba(56, 189, 248, 0.5)';
    ctxB.beginPath(); ctxB.ellipse(lensX, 220, 8, 80, 0, 0, Math.PI*2); ctxB.fill(); ctxB.stroke();
    
    // Draw Object (Light Box)
    ctxB.fillStyle = '#f59e0b'; ctxB.fillRect(objX - 10, 180, 20, 80);
    ctxB.fillStyle = '#0f172a'; ctxB.fillRect(objX - 2, 300, 4, -40);

    // Draw Screen
    ctxB.fillStyle = '#e2e8f0'; ctxB.fillRect(screenX - 2, 120, 5, 180);
    ctxB.fillStyle = '#0f172a'; ctxB.fillRect(screenX - 2, 300, 4, -40);

    // Draw Light Rays
    ctxB.strokeStyle = 'rgba(245, 158, 11, 0.6)'; ctxB.lineWidth = 2;
    let exactScreenX = lensX + (exactV * 3.8);
    
    ctxB.beginPath(); ctxB.moveTo(objX, 220); ctxB.lineTo(lensX, 160); ctxB.lineTo(exactScreenX, 220); ctxB.stroke(); // Top ray
    ctxB.beginPath(); ctxB.moveTo(objX, 220); ctxB.lineTo(lensX, 220); ctxB.lineTo(exactScreenX, 220); ctxB.stroke(); // Center ray
    ctxB.beginPath(); ctxB.moveTo(objX, 220); ctxB.lineTo(lensX, 280); ctxB.lineTo(exactScreenX, 220); ctxB.stroke(); // Bottom ray

    // Labels
    ctxB.fillStyle = '#0f172a'; ctxB.font = 'bold 12px Poppins';
    ctxB.fillText('Object', objX - 15, 160);
    ctxB.fillText('Lens', lensX - 12, 120);
    ctxB.fillText('Screen', screenX - 18, 100);

    // ==========================================
    // 2. RENDER LIVE MONITOR (THE BLUR EFFECT)
    // ==========================================
    ctxM.save();
    // Apply CSS blur filter directly to the canvas context!
    ctxM.filter = `blur(${blurPx}px) brightness(${1 + (1/ (errorDistance+1))})`; 
    
    // Draw an illuminated arrow
    let arrowSize = 40 * mag; // Scales based on physics magnification!
    ctxM.translate(100, 75); // Center
    ctxM.rotate(Math.PI); // Real images are inverted!

    ctxM.strokeStyle = '#facc15'; ctxM.lineWidth = 6; ctxM.lineCap = 'round';
    ctxM.beginPath(); ctxM.moveTo(0, -arrowSize/2); ctxM.lineTo(0, arrowSize/2); ctxM.stroke(); // Shaft
    ctxM.beginPath(); ctxM.moveTo(-15, (arrowSize/2)-15); ctxM.lineTo(0, arrowSize/2); ctxM.lineTo(15, (arrowSize/2)-15); ctxM.stroke(); // Tip
    
    ctxM.restore();

    opticsState.animId = requestAnimationFrame(opticsLoop);
}

/**
 * ==========================================================================
 * ENGINE 16: H1:10 CALORIMETRY (METHOD OF MIXTURES)
 * ==========================================================================
 */
function renderCalorimetryWorkspace() {
    document.getElementById('simulation-render-target').innerHTML = `
        <div class="bench-card" style="width: 100%; max-width: 850px; display: flex; flex-wrap: wrap; gap: 20px; background: #0d1117; padding: 1.5rem; border-radius: 12px; border: 1px solid #30363d; box-sizing: border-box;">
            <div style="flex: 1; min-width: 250px; display: flex; flex-direction: column; gap: 15px;">
                <div style="background: #161b22; padding: 20px; border-radius: 8px; border: 2px solid #30363d; text-align: center;">
                    <div style="color:#8b949e; font-size:0.8rem; margin-bottom:5px; font-family:'Orbitron';">CALORIMETER THERMOMETER</div>
                    <div class="lcd-screen" id="cal-temp-lcd" style="font-size:2.5rem; color:#ef4444; background:#000; padding:10px; border-radius:6px; font-weight:bold;">25.0°C</div>
                </div>
                <div style="background: #1e293b; padding: 15px; border-radius: 8px; border: 1px solid #334155;">
                    <label style="color:#fff; font-size:0.85rem; display:block; margin-bottom:8px; font-family:'Poppins';">Block Mass: <span id="lbl-cal-m" style="color:var(--sim-accent);">50 g</span></label>
                    <input type="range" id="slider-cal-m" min="20" max="150" value="50" step="10" style="width:100%; cursor:pointer; margin-bottom:15px;">
                    <button id="btn-cal-transfer" onclick="triggerCalTransfer()" style="width:100%; background:var(--emerald); color:white; border:none; padding:12px; border-radius:6px; font-weight:bold; cursor:pointer;"><i class="fas fa-random"></i> Transfer Block</button>
                    <button onclick="resetCalorimetry()" style="width:100%; margin-top:10px; background:#ef4444; color:white; border:none; padding:12px; border-radius:6px; font-weight:bold; cursor:pointer;"><i class="fas fa-undo"></i> Reset Setup</button>
                </div>
            </div>
            <div style="flex: 1.5; min-width: 300px; background: #fff; border-radius: 8px; padding: 10px; display: flex; justify-content: center; position: relative; border: 2px solid #0f172a; overflow:hidden;">
                <canvas id="canvas-calorimetry" width="450" height="380" style="max-width: 100%; height: auto; display:block;"></canvas>
            </div>
        </div>
    `;

    document.getElementById('slider-cal-m').addEventListener('input', (e) => {
        if(!calState.isTransferred) calState.massBlock = parseInt(e.target.value);
        document.getElementById('lbl-cal-m').innerText = `${calState.massBlock} g`;
    });

    resetCalorimetry();
}

function resetCalorimetry() {
    calState.isTransferred = false; calState.tempWater = 25.0; calState.tempBlock = 100.0;
    calState.animX = 80; calState.animY = 280;
    document.getElementById('btn-cal-transfer').disabled = false;
    document.getElementById('btn-cal-transfer').style.opacity = '1.0';
    if(calState.animId) cancelAnimationFrame(calState.animId);
    calLoop();
}

function triggerCalTransfer() {
    calState.isTransferred = true;
    document.getElementById('btn-cal-transfer').disabled = true;
    document.getElementById('btn-cal-transfer').style.opacity = '0.5';
    // Physics: m_c * c_w * dT_w = m_b * c_b * dT_b
    // (150 * 4.18 * (Tf - 25)) = (mb * 0.9 * (100 - Tf)) -> Aluminium ~0.9 J/gC
    let num = (calState.massWater * 4.18 * 25) + (calState.massBlock * 0.9 * 100);
    let den = (calState.massWater * 4.18) + (calState.massBlock * 0.9);
    calState.mixTemp = num / den;
}

function calLoop() {
    const canvas = document.getElementById('canvas-calorimetry'); if(!canvas) return;
    const ctx = canvas.getContext('2d'); ctx.clearRect(0,0, canvas.width, canvas.height);

    // Animate Transfer
    if(calState.isTransferred) {
        if(calState.animY > 100 && calState.animX < 320) calState.animY -= 10; // Lift out of boiling water
        else if(calState.animX < 320) calState.animX += 10; // Move over calorimeter
        else if(calState.animY < 280) calState.animY += 10; // Drop in calorimeter
        else {
            // Newton's law approach to final mix temp
            calState.tempWater += (calState.mixTemp - calState.tempWater) * 0.05;
        }
    }

    document.getElementById('cal-temp-lcd').innerText = calState.tempWater.toFixed(1) + "°C";

    // Draw Boiling Beaker
    ctx.fillStyle = 'rgba(239, 68, 68, 0.2)'; ctx.fillRect(40, 200, 100, 120); // Hot water
    ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(40, 150); ctx.lineTo(40, 320); ctx.lineTo(140, 320); ctx.lineTo(140, 150); ctx.stroke();
    
    // Draw Steam
    ctx.fillStyle = 'rgba(203, 213, 225, 0.4)';
    ctx.beginPath(); ctx.arc(90 + Math.sin(performance.now()/200)*10, 140 - (performance.now()/30 % 40), 15, 0, Math.PI*2); ctx.fill();

    // Draw Calorimeter (Copper/Lagged)
    ctx.fillStyle = '#b45309'; ctx.fillRect(270, 160, 100, 160); // Copper cup
    ctx.fillStyle = 'rgba(56, 189, 248, 0.4)'; ctx.fillRect(275, 200, 90, 120); // Cold water
    
    // Draw Calorimeter Thermometer
    ctx.fillStyle = '#fff'; ctx.fillRect(330, 80, 10, 200);
    ctx.fillStyle = '#ef4444'; ctx.fillRect(333, 280 - ((calState.tempWater/100)*150), 4, ((calState.tempWater/100)*150));
    ctx.beginPath(); ctx.arc(335, 285, 8, 0, Math.PI*2); ctx.fill();

    // Draw Metal Block
    ctx.fillStyle = '#3f3f46';
    let blockSize = 20 + (calState.massBlock * 0.15);
    ctx.fillRect(calState.animX - (blockSize/2), calState.animY - (blockSize/2), blockSize, blockSize);
    ctx.strokeStyle = '#e2e8f0'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(calState.animX, calState.animY - (blockSize/2)); ctx.lineTo(calState.animX, calState.animY - 100); ctx.stroke(); // Holding string

    calState.animId = requestAnimationFrame(calLoop);
}

/**
 * ==========================================================================
 * ENGINE 17: H3:12 HEAT FLOW THROUGH A BOUNDARY
 * ==========================================================================
 */
function renderHeatFlowWorkspace() {
    document.getElementById('simulation-render-target').innerHTML = `
        <div class="bench-card" style="width: 100%; max-width: 850px; display: flex; flex-wrap: wrap; gap: 20px; background: #0d1117; padding: 1.5rem; border-radius: 12px; border: 1px solid #30363d; box-sizing: border-box;">
            <div style="flex: 1; min-width: 250px; display: flex; flex-direction: column; gap: 15px;">
                <div style="background: #161b22; padding: 15px; border-radius: 8px; border: 2px solid #30363d; text-align: center;">
                    <div style="color:#ef4444; font-size:0.8rem; font-family:'Orbitron';">THERMOMETER A (HOT)</div>
                    <div class="lcd-screen" id="hf-hot-lcd" style="font-size:2rem; color:#ef4444; background:#000; padding:5px; border-radius:6px;">75.0°C</div>
                    <div style="color:#38bdf8; font-size:0.8rem; font-family:'Orbitron'; margin-top:10px;">THERMOMETER B (COLD)</div>
                    <div class="lcd-screen" id="hf-cold-lcd" style="font-size:2rem; color:#38bdf8; background:#000; padding:5px; border-radius:6px;">25.0°C</div>
                </div>
                <div style="background: #1e293b; padding: 15px; border-radius: 8px; border: 1px solid #334155; text-align:center;">
                    <div style="color:#8b949e; font-size:0.8rem; margin-bottom:5px; font-family:'Orbitron';">TIME (MINS)</div>
                    <div class="lcd-screen" id="hf-time-lcd" style="font-size:2rem; color:#10b981; background:#000; padding:5px; border-radius:6px; margin-bottom:15px;">0.00</div>
                    <button onclick="toggleHeatFlow()" style="width:100%; background:var(--emerald); color:white; border:none; padding:12px; border-radius:6px; font-weight:bold; cursor:pointer;"><i class="fas fa-play"></i> Start Exchange</button>
                </div>
            </div>
            <div style="flex: 1.5; min-width: 300px; background: #fff; border-radius: 8px; padding: 10px; display: flex; justify-content: center; position: relative; border: 2px solid #0f172a; overflow:hidden;">
                <canvas id="canvas-heatflow" width="450" height="380" style="max-width: 100%; height: auto; display:block;"></canvas>
            </div>
        </div>
    `;
    resetHeatFlow();
}

function resetHeatFlow() {
    heatFlowState.tempHot = 75.0; heatFlowState.tempCold = 25.0; heatFlowState.timeMins = 0; heatFlowState.timerRunning = false;
    document.getElementById('hf-hot-lcd').innerText = "75.0°C";
    document.getElementById('hf-cold-lcd').innerText = "25.0°C";
    document.getElementById('hf-time-lcd').innerText = "0.00";
    if(heatFlowState.animId) cancelAnimationFrame(heatFlowState.animId);
    heatFlowLoop();
}

function toggleHeatFlow() {
    heatFlowState.timerRunning = !heatFlowState.timerRunning;
    if(heatFlowState.timerRunning) heatFlowState.lastTick = performance.now();
}

function heatFlowLoop() {
    const canvas = document.getElementById('canvas-heatflow'); if(!canvas) return;
    const ctx = canvas.getContext('2d'); ctx.clearRect(0,0, canvas.width, canvas.height);

    if (heatFlowState.timerRunning) {
        const now = performance.now();
        let dtMins = ((now - heatFlowState.lastTick) / 1000) * 0.1; // 1 real sec = 0.1 sim mins
        heatFlowState.timeMins += dtMins;
        heatFlowState.lastTick = now;

        // Coupled Newton's Cooling
        let exchange = heatFlowState.k_inner * (heatFlowState.tempHot - heatFlowState.tempCold) * dtMins;
        let ambientLoss = heatFlowState.k_outer * (heatFlowState.tempCold - 25.0) * dtMins;

        heatFlowState.tempHot -= exchange;
        heatFlowState.tempCold += exchange - ambientLoss;

        document.getElementById('hf-time-lcd').innerText = heatFlowState.timeMins.toFixed(2);
        document.getElementById('hf-hot-lcd').innerText = heatFlowState.tempHot.toFixed(1) + "°C";
        document.getElementById('hf-cold-lcd').innerText = heatFlowState.tempCold.toFixed(1) + "°C";
    }

    // Draw Outer Beaker (Cold)
    ctx.fillStyle = 'rgba(56, 189, 248, 0.3)'; ctx.fillRect(100, 150, 250, 200);
    ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(100, 80); ctx.lineTo(100, 350); ctx.lineTo(350, 350); ctx.lineTo(350, 80); ctx.stroke();

    // Draw Inner Cup (Hot)
    ctx.fillStyle = 'rgba(239, 68, 68, 0.4)'; ctx.fillRect(175, 180, 100, 150);
    ctx.strokeStyle = '#cbd5e1'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(175, 120); ctx.lineTo(175, 330); ctx.lineTo(275, 330); ctx.lineTo(275, 120); ctx.stroke();

    // Heat gradient arrows
    if(heatFlowState.timerRunning && (heatFlowState.tempHot - heatFlowState.tempCold > 5)) {
        ctx.fillStyle = 'rgba(239, 68, 68, 0.6)'; ctx.font = '20px Arial';
        let arrowOffset = Math.sin(performance.now()/200)*5;
        ctx.fillText('→', 280 + arrowOffset, 250);
        ctx.fillText('←', 150 - arrowOffset, 250);
    }

    // Thermometers
    ctx.fillStyle = '#fff'; ctx.fillRect(200, 40, 10, 250); ctx.fillRect(300, 40, 10, 250); // Glass
    // Thermometer A (Hot)
    ctx.fillStyle = '#ef4444'; ctx.fillRect(203, 290 - (heatFlowState.tempHot*2), 4, heatFlowState.tempHot*2); ctx.beginPath(); ctx.arc(205, 295, 8, 0, Math.PI*2); ctx.fill();
    // Thermometer B (Cold)
    ctx.fillStyle = '#38bdf8'; ctx.fillRect(303, 290 - (heatFlowState.tempCold*2), 4, heatFlowState.tempCold*2); ctx.beginPath(); ctx.arc(305, 295, 8, 0, Math.PI*2); ctx.fill();

    heatFlowState.animId = requestAnimationFrame(heatFlowLoop);
}

/**
 * ==========================================================================
 * ENGINE 18: LW4:16 NO PARALLAX OPTICAL PINS
 * ==========================================================================
 */
function renderParallaxWorkspace() {
    document.getElementById('simulation-render-target').innerHTML = `
        <div class="bench-card" style="width: 100%; max-width: 850px; display: flex; flex-wrap: wrap; gap: 20px; background: #0d1117; padding: 1.5rem; border-radius: 12px; border: 1px solid #30363d; box-sizing: border-box;">
            <div style="flex: 1; min-width: 250px; display: flex; flex-direction: column; gap: 15px;">
                <div style="background: #1e293b; padding: 20px; border-radius: 8px; border: 1px solid #334155;">
                    <label style="color:#fff; font-size:0.85rem; display:block; margin-bottom:8px; font-family:'Poppins';">Object Pin (u): <span id="lbl-par-u" style="color:var(--sim-accent);">20.0 cm</span></label>
                    <input type="range" id="slider-par-u" min="16" max="60" value="20" step="0.5" style="width:100%; cursor:pointer; margin-bottom:15px;">
                    
                    <label style="color:#fff; font-size:0.85rem; display:block; margin-bottom:8px; font-family:'Poppins';">Search Pin (v): <span id="lbl-par-v" style="color:var(--sim-accent);">40.0 cm</span></label>
                    <input type="range" id="slider-par-v" min="15" max="80" value="40" step="0.5" style="width:100%; cursor:pointer;">
                </div>
                
                <div style="background: #161b22; padding: 15px; border-radius: 8px; border: 2px solid #ef4444; text-align:center;">
                    <label style="color:#ef4444; font-size:0.85rem; font-weight:bold; display:block; margin-bottom:8px; font-family:'Poppins';"><i class="fas fa-arrows-alt-h"></i> Move Head to Test Parallax</label>
                    <input type="range" id="slider-par-head" min="-20" max="20" value="0" step="1" style="width:100%; cursor:pointer;">
                </div>
            </div>
            <div style="flex: 2; min-width: 300px; background: #fff; border-radius: 8px; padding: 10px; display: flex; justify-content: center; position: relative; border: 2px solid #0f172a; overflow:hidden;">
                <div style="position:absolute; top:5px; left:10px; color:#0f172a; font-family:'Poppins'; font-weight:bold;">View through Lens</div>
                <canvas id="canvas-parallax" width="450" height="380" style="max-width: 100%; height: auto; display:block;"></canvas>
            </div>
        </div>
    `;

    document.getElementById('slider-par-u').addEventListener('input', (e) => {
        parallaxState.u = parseFloat(e.target.value);
        document.getElementById('lbl-par-u').innerText = `${parallaxState.u.toFixed(1)} cm`;
    });
    document.getElementById('slider-par-v').addEventListener('input', (e) => {
        parallaxState.v_pin = parseFloat(e.target.value);
        document.getElementById('lbl-par-v').innerText = `${parallaxState.v_pin.toFixed(1)} cm`;
    });
    document.getElementById('slider-par-head').addEventListener('input', (e) => {
        parallaxState.headPos = parseInt(e.target.value);
    });

    parallaxLoop();
}

function parallaxLoop() {
    const canvas = document.getElementById('canvas-parallax'); if(!canvas) return;
    const ctx = canvas.getContext('2d'); ctx.clearRect(0,0, canvas.width, canvas.height);

    // Physics Engine: 1/f = 1/u + 1/v
    let exact_v = (parallaxState.u * parallaxState.focalLength) / (parallaxState.u - parallaxState.focalLength);
    
    // Parallax logic: Parallax error shifts objects based on distance and head movement.
    // If exact_v == v_pin, shift is identical (they stay aligned!).
    let imageShift = parallaxState.headPos * (50 / exact_v);
    let pinShift = parallaxState.headPos * (50 / parallaxState.v_pin);

    const cx = 225;

    // Draw Optical Lens Edge
    ctx.fillStyle = 'rgba(56, 189, 248, 0.1)'; ctx.beginPath(); ctx.arc(cx, 190, 150, 0, Math.PI*2); ctx.fill();
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.6)'; ctx.lineWidth=3; ctx.stroke();

    // Draw Inverted Optical Image of Pin O (Blueish)
    let mag = exact_v / parallaxState.u;
    let imgHeight = 60 * mag;
    let imgX = cx + imageShift;
    
    ctx.strokeStyle = '#3b82f6'; ctx.lineWidth = 4; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(imgX, 190); ctx.lineTo(imgX, 190 + imgHeight); ctx.stroke(); // Inverted!
    ctx.beginPath(); ctx.arc(imgX, 190 + imgHeight, 5, 0, Math.PI*2); ctx.fillStyle='#3b82f6'; ctx.fill(); // Pin head

    // Draw Physical Search Pin I (Reddish)
    let pinX = cx + pinShift;
    ctx.strokeStyle = '#ef4444'; ctx.lineWidth = 6;
    ctx.beginPath(); ctx.moveTo(pinX, 190); ctx.lineTo(pinX, 400); ctx.stroke();
    ctx.beginPath(); ctx.arc(pinX, 190, 5, 0, Math.PI*2); ctx.fillStyle='#ef4444'; ctx.fill();

    // Parallax warning text
    if (Math.abs(imageShift - pinShift) > 2 && parallaxState.headPos !== 0) {
        ctx.fillStyle = '#ef4444'; ctx.font = 'bold 16px Poppins'; ctx.textAlign = 'center';
        ctx.fillText("PARALLAX ERROR DETECTED", cx, 30);
    } else if (Math.abs(exact_v - parallaxState.v_pin) < 1.0) {
        ctx.fillStyle = '#10b981'; ctx.font = 'bold 16px Poppins'; ctx.textAlign = 'center';
        ctx.fillText("NO PARALLAX - PERFECTLY ALIGNED", cx, 30);
    }

    parallaxState.animId = requestAnimationFrame(parallaxLoop);
}

/**
 * ==========================================================================
 * ELECTRICITY SUITE (E1-20, E3-22, EL2-24)
 * ==========================================================================
 */
function renderResistivity() {
    document.getElementById('simulation-render-target').innerHTML = `
        <div class="bench-card" style="width:100%; max-width:850px; display:flex; flex-wrap:wrap; gap:20px; background:#0d1117; padding:1.5rem; border-radius:12px; border:1px solid #30363d; box-sizing:border-box;">
            <div style="flex:1; min-width:200px; display:flex; flex-direction:column; gap:15px;">
                <div style="background:#161b22; padding:20px; border-radius:8px; border:2px solid #30363d; text-align:center;">
                    <div style="color:#8b949e; font-size:0.75rem; font-family:'Orbitron';">DIGITAL OHMMETER (Ω)</div>
                    <div class="lcd-screen" id="res-lcd" style="font-size:2.5rem; color:#10b981; background:#000; padding:10px; border-radius:6px; font-weight:bold;">0.00</div>
                </div>
                <div style="background:#1e293b; padding:15px; border-radius:8px; border:1px solid #334155;">
                    <label style="color:#fff; font-size:0.85rem; display:block; margin-bottom:8px;">Micrometer Reading: d = 0.28 mm</label>
                    <label style="color:#fff; font-size:0.85rem; display:block; margin-bottom:8px;">Jockey Position (l): <span id="lbl-res-l" style="color:var(--sim-accent);">50.0 cm</span></label>
                    <input type="range" id="slider-res-l" min="10" max="100" value="50" step="1" style="width:100%; cursor:pointer;">
                </div>
            </div>
            <div style="flex:2; min-width:200px; width:100%; box-sizing:border-box; background:#fff; border-radius:8px; padding:10px; display:flex; justify-content:center; position:relative; border:2px solid #0f172a; overflow:hidden;">
                <canvas id="canvas-res" width="450" height="200" style="max-width:100%; height:auto; display:block;"></canvas>
            </div>
        </div>`;
    document.getElementById('slider-res-l').addEventListener('input', (e) => { resState.length = parseFloat(e.target.value); document.getElementById('lbl-res-l').innerText = `${resState.length.toFixed(1)} cm`; loopRes(); });
    loopRes();
}
function loopRes() {
    const ctx = document.getElementById('canvas-res').getContext('2d'); ctx.clearRect(0,0,450,200);
    let area = Math.PI * Math.pow((resState.d/10/2), 2); // cm^2
    resState.r = (resState.rho * resState.length) / area + (Math.random()*0.1);
    document.getElementById('res-lcd').innerText = resState.r.toFixed(2);
    ctx.fillStyle = '#b45309'; ctx.fillRect(20, 100, 400, 15); // Metre rule
    ctx.fillStyle = '#fff'; for(let i=20; i<=420; i+=4) { ctx.fillRect(i, 100, 1, 4); }
    ctx.strokeStyle = '#64748b'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(20, 95); ctx.lineTo(420, 95); ctx.stroke(); // Wire
    let px = 20 + (resState.length * 4);
    ctx.fillStyle = '#ef4444'; ctx.beginPath(); ctx.moveTo(px, 70); ctx.lineTo(px-5, 95); ctx.lineTo(px+5, 95); ctx.fill(); // Jockey
    ctx.strokeStyle = '#ef4444'; ctx.beginPath(); ctx.moveTo(px, 70); ctx.lineTo(225, 20); ctx.lineTo(20, 20); ctx.lineTo(20, 95); ctx.stroke(); // Wires
    ctx.fillStyle = '#1e293b'; ctx.fillRect(200, 10, 50, 25); ctx.fillStyle='#fff'; ctx.font='10px Arial'; ctx.fillText('METER', 208, 25);
}

function renderEMF() {
    document.getElementById('simulation-render-target').innerHTML = `
        <div class="bench-card" style="width:100%; max-width:850px; display:flex; flex-wrap:wrap; gap:20px; background:#0d1117; padding:1.5rem; border-radius:12px; border:1px solid #30363d; box-sizing:border-box;">
            <div style="flex:1; min-width:200px; display:flex; flex-direction:column; gap:15px;">
                <div style="background:#161b22; padding:15px; border-radius:8px; border:2px solid #30363d; display:flex; gap:10px;">
                    <div style="flex:1; text-align:center;"><div style="color:#8b949e; font-size:0.6rem; font-family:'Orbitron';">VOLTS (V)</div><div class="lcd-screen" id="emf-v" style="font-size:1.8rem; color:#38bdf8; padding:5px;">0.00</div></div>
                    <div style="flex:1; text-align:center;"><div style="color:#8b949e; font-size:0.6rem; font-family:'Orbitron';">AMPS (A)</div><div class="lcd-screen" id="emf-i" style="font-size:1.8rem; color:#ef4444; padding:5px;">0.00</div></div>
                </div>
                <div style="background:#1e293b; padding:15px; border-radius:8px; border:1px solid #334155;">
                    <label style="color:#fff; font-size:0.85rem; display:block; margin-bottom:8px;">Junction Probe (Resistors in Series): <span id="lbl-emf-n" style="color:var(--sim-accent);">0</span></label>
                    <input type="range" id="slider-emf-n" min="0" max="10" value="0" step="1" style="width:100%; cursor:pointer;">
                </div>
            </div>
            <div style="flex:2; min-width:200px; width:100%; box-sizing:border-box; background:#fff; border-radius:8px; padding:10px; display:flex; justify-content:center; position:relative; border:2px solid #0f172a; overflow:hidden;">
                <canvas id="canvas-emf" width="450" height="200" style="max-width:100%; height:auto; display:block;"></canvas>
            </div>
        </div>`;
    document.getElementById('slider-emf-n').addEventListener('input', (e) => { emfState.junctions = parseInt(e.target.value); document.getElementById('lbl-emf-n').innerText = emfState.junctions; loopEMF(); });
    loopEMF();
}
function loopEMF() {
    const ctx = document.getElementById('canvas-emf').getContext('2d'); ctx.clearRect(0,0,450,200);
    let totalR = emfState.junctions === 0 ? Infinity : emfState.junctions * emfState.resValue;
    let current = emfState.junctions === 0 ? 0 : emfState.e0 / (emfState.r + totalR);
    let voltage = emfState.e0 - (current * emfState.r);
    document.getElementById('emf-v').innerText = (voltage + (Math.random()*0.02-0.01)).toFixed(2);
    document.getElementById('emf-i').innerText = (current + (current>0?Math.random()*0.002-0.001:0)).toFixed(3);
    
    ctx.strokeStyle = '#0f172a'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(50, 150); ctx.lineTo(50, 50); ctx.lineTo(400, 50); ctx.stroke(); // Circuit wires
    ctx.fillStyle = '#facc15'; ctx.fillRect(30, 150, 40, 20); ctx.fillStyle='#000'; ctx.fillText('3V', 40, 165); // Battery
    
    for(let i=0; i<10; i++) {
        let rx = 70 + (i*32);
        ctx.fillStyle = '#e2e8f0'; ctx.fillRect(rx, 45, 20, 10); ctx.strokeRect(rx, 45, 20, 10);
        ctx.fillStyle = '#dc2626'; ctx.beginPath(); ctx.arc(rx-2, 50, 3, 0, Math.PI*2); ctx.fill(); // Junction node
    }
    let probeX = emfState.junctions === 0 ? 50 : 70 + (emfState.junctions*32) - 2;
    ctx.strokeStyle = '#ef4444'; ctx.beginPath(); ctx.moveTo(probeX, 50); ctx.lineTo(probeX, 100); ctx.lineTo(250, 150); ctx.stroke(); // Ammeter probe
}

function renderCapacitor() {
    document.getElementById('simulation-render-target').innerHTML = `
        <div class="bench-card" style="width:100%; max-width:850px; display:flex; flex-wrap:wrap; gap:20px; background:#0d1117; padding:1.5rem; border-radius:12px; border:1px solid #30363d; box-sizing:border-box;">
            <div style="flex:1; min-width:200px; display:flex; flex-direction:column; gap:15px;">
                <div style="background:#161b22; padding:15px; border-radius:8px; border:2px solid #30363d; text-align:center;">
                    <div style="color:#8b949e; font-size:0.75rem; font-family:'Orbitron';">VOLTMETER (V)</div>
                    <div class="lcd-screen" id="cap-v" style="font-size:2.5rem; color:#38bdf8; background:#000; padding:10px; border-radius:6px; font-weight:bold;">0.00</div>
                    <div style="color:#8b949e; font-size:0.75rem; font-family:'Orbitron'; margin-top:10px;">TIMER: <span id="cap-t" style="color:#f59e0b;">0 s</span></div>
                </div>
                <div style="background:#1e293b; padding:15px; border-radius:8px; border:1px solid #334155;">
                    <button onclick="capAction('charge')" style="width:100%; margin-bottom:10px; background:#facc15; color:#000; border:none; padding:10px; border-radius:6px; font-weight:bold; cursor:pointer;">Close S to Battery (Charge)</button>
                    <button onclick="capAction('discharge')" style="width:100%; background:var(--emerald); color:#fff; border:none; padding:10px; border-radius:6px; font-weight:bold; cursor:pointer;">Switch S to Resistor (Discharge)</button>
                </div>
            </div>
            <div style="flex:2; min-width:200px; width:100%; box-sizing:border-box; background:#fff; border-radius:8px; padding:10px; display:flex; justify-content:center; position:relative; border:2px solid #0f172a; overflow:hidden;">
                <canvas id="canvas-cap" width="450" height="200" style="max-width:100%; height:auto; display:block;"></canvas>
            </div>
        </div>`;
    capState.phase = 'idle'; if (capState.animId) cancelAnimationFrame(capState.animId); loopCap();
}
function capAction(action) {
    capState.phase = action; capState.lastTick = performance.now();
    if(action==='charge'){ capState.time = 0; capState.v = 3.0; document.getElementById('cap-t').innerText = "0 s"; }
}
function loopCap() {
    const canvas = document.getElementById('canvas-cap'); if(!canvas) return;
    const ctx = canvas.getContext('2d'); ctx.clearRect(0,0, canvas.width, canvas.height);

    if(capState.phase === 'discharge') {
        const now = performance.now(); let dt = (now - capState.lastTick)/1000; capState.time += (dt * 10); // 10x speed
        capState.lastTick = now;
        let tau = capState.r * capState.c; // 750s
        capState.v = capState.v0 * Math.exp(-capState.time / tau);
        document.getElementById('cap-t').innerText = `${Math.floor(capState.time)} s`;
    }
    document.getElementById('cap-v').innerText = (capState.v + (capState.v>0.1?Math.random()*0.02-0.01:0)).toFixed(2);

    // Draw simple circuit diagram
    ctx.strokeStyle = '#0f172a'; ctx.lineWidth = 3; ctx.beginPath(); ctx.strokeRect(100, 50, 250, 100);
    ctx.fillStyle = '#fff'; ctx.fillRect(215, 40, 20, 20); // Break for Capacitor
    ctx.strokeStyle = '#3b82f6'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(215, 40); ctx.lineTo(215, 60); ctx.moveTo(235, 40); ctx.lineTo(235, 60); ctx.stroke(); // Cap plates
    
    // Visual charge bar inside capacitor!
    let chargePct = capState.v / capState.v0;
    ctx.fillStyle = 'rgba(56, 189, 248, 0.5)'; ctx.fillRect(218, 40 + (20*(1-chargePct)), 14, 20*chargePct);

    // Switch representation
    ctx.fillStyle = '#fff'; ctx.fillRect(80, 90, 40, 20);
    ctx.strokeStyle = '#ef4444'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(100, 110); 
    if(capState.phase === 'charge') ctx.lineTo(100, 90); else if(capState.phase==='discharge') ctx.lineTo(120, 100); else ctx.lineTo(80, 100);
    ctx.stroke();

    capState.animId = requestAnimationFrame(loopCap);
}

/**
 * ==========================================================================
 * MAGNETISM SUITE (B1-25, B2-26)
 * ==========================================================================
 */
function renderMagFlux() {
    document.getElementById('simulation-render-target').innerHTML = `
        <div class="bench-card" style="width:100%; max-width:850px; display:flex; flex-wrap:wrap; gap:20px; background:#0d1117; padding:1.5rem; border-radius:12px; border:1px solid #30363d; box-sizing:border-box;">
            <div style="flex:1; min-width:200px; display:flex; flex-direction:column; gap:15px;">
                <div style="background:#1e293b; padding:20px; border-radius:8px; border:1px solid #334155;">
                    <label style="color:#fff; font-size:0.85rem; display:block; margin-bottom:8px;">Distance x: <span id="lbl-flux-x" style="color:var(--sim-accent);">20.0 cm</span></label>
                    <input type="range" id="slider-flux-x" min="10" max="40" value="20" step="1" style="width:100%; cursor:pointer;">
                </div>
            </div>
            <div style="flex:2; min-width:200px; width:100%; box-sizing:border-box; background:#fff; border-radius:8px; padding:10px; display:flex; justify-content:center; position:relative; border:2px solid #0f172a; overflow:hidden;">
                <canvas id="canvas-flux" width="450" height="200" style="max-width:100%; height:auto; display:block;"></canvas>
            </div>
        </div>`;
    document.getElementById('slider-flux-x').addEventListener('input', (e) => { fluxState.x = parseFloat(e.target.value); document.getElementById('lbl-flux-x').innerText = `${fluxState.x.toFixed(1)} cm`; loopFlux(); });
    loopFlux();
}
function loopFlux() {
    const ctx = document.getElementById('canvas-flux').getContext('2d'); ctx.clearRect(0,0,450,200);
    // tan(theta) = B_mag / B_earth. B_mag ~ 1/x^3.
    let k = 50000; let tanTheta = k / Math.pow(fluxState.x, 3);
    fluxState.theta = Math.atan(tanTheta) * (180/Math.PI);
    
    // Draw Grid Paper
    ctx.strokeStyle = '#e2e8f0'; ctx.lineWidth = 1;
    for(let i=0; i<450; i+=20) { ctx.beginPath(); ctx.moveTo(i,0); ctx.lineTo(i,200); ctx.stroke(); ctx.beginPath(); ctx.moveTo(0,i); ctx.lineTo(450,i); ctx.stroke(); }
    
    // Magnet at left (0, 100)
    ctx.fillStyle = '#ef4444'; ctx.fillRect(20, 85, 40, 30); ctx.fillStyle = '#3b82f6'; ctx.fillRect(60, 85, 40, 30);
    ctx.fillStyle='#fff'; ctx.font='bold 14px Arial'; ctx.fillText('N', 30, 105); ctx.fillText('S', 70, 105);

    // Compass
    let px = 100 + (fluxState.x * 5);
    ctx.beginPath(); ctx.arc(px, 100, 20, 0, Math.PI*2); ctx.fillStyle='#f8fafc'; ctx.fill(); ctx.strokeStyle='#0f172a'; ctx.lineWidth=2; ctx.stroke();
    
    // Needle
    ctx.save(); ctx.translate(px, 100); ctx.rotate(-fluxState.theta * Math.PI/180);
    ctx.fillStyle = '#ef4444'; ctx.beginPath(); ctx.moveTo(0,-3); ctx.lineTo(15,0); ctx.lineTo(0,3); ctx.fill();
    ctx.fillStyle = '#94a3b8'; ctx.beginPath(); ctx.moveTo(0,-3); ctx.lineTo(-15,0); ctx.lineTo(0,3); ctx.fill();
    ctx.restore();

    ctx.fillStyle = '#0f172a'; ctx.font='bold 14px Arial'; ctx.fillText(`θ = ${fluxState.theta.toFixed(1)}°`, px - 25, 140);
}

function renderMagInertia() {
    document.getElementById('simulation-render-target').innerHTML = `
        <div class="bench-card" style="width:100%; max-width:850px; display:flex; flex-wrap:wrap; gap:20px; background:#0d1117; padding:1.5rem; border-radius:12px; border:1px solid #30363d; box-sizing:border-box;">
            <div style="flex:1; min-width:200px; display:flex; flex-direction:column; gap:15px;">
                <div style="background:#1e293b; padding:20px; border-radius:8px; border:1px solid #334155;">
                    <label style="color:#fff; font-size:0.85rem; display:block; margin-bottom:8px;">Number of Pins (n): <span id="lbl-inert-n" style="color:var(--sim-accent);">5</span></label>
                    <input type="range" id="slider-inert-n" min="2" max="12" value="5" step="1" style="width:100%; cursor:pointer; margin-bottom:15px;" onchange="resetInertia()">
                    
                    <label style="color:#fff; font-size:0.85rem; display:block; margin-bottom:8px;">Drag Magnet Left: <span id="lbl-inert-x" style="color:var(--emerald);"></span></label>
                    <input type="range" id="slider-inert-x" min="150" max="350" value="350" step="1" style="width:100%; cursor:pointer;">
                </div>
            </div>
            <div style="flex:2; min-width:200px; width:100%; box-sizing:border-box; background:#fff; border-radius:8px; padding:10px; display:flex; justify-content:center; position:relative; border:2px solid #0f172a; overflow:hidden;">
                <canvas id="canvas-inertia" width="450" height="200" style="max-width:100%; height:auto; display:block;"></canvas>
            </div>
        </div>`;
    document.getElementById('slider-inert-n').addEventListener('input', (e) => { inertiaState.n = parseInt(e.target.value); document.getElementById('lbl-inert-n').innerText = inertiaState.n; });
    document.getElementById('slider-inert-x').addEventListener('input', (e) => { inertiaState.magnetX = parseInt(e.target.value); });
    resetInertia(); loopInertia();
}
function resetInertia() { inertiaState.snapped = false; inertiaState.magnetX = 350; document.getElementById('slider-inert-x').value = 350; inertiaState.criticalS = 80 + (200 / inertiaState.n); }
function loopInertia() {
    const canvas = document.getElementById('canvas-inertia'); if(!canvas) return;
    const ctx = canvas.getContext('2d'); ctx.clearRect(0,0,450,200);

    let pinsX = 100;
    let dist = inertiaState.magnetX - pinsX - 40; // 40 is half magnet width
    if (!inertiaState.snapped && dist < inertiaState.criticalS) {
        inertiaState.snapped = true; // SNAP!
        inertiaState.s = (inertiaState.criticalS / 10).toFixed(1); // cm conversion
        document.getElementById('lbl-inert-x').innerText = `SNAPPED at s = ${inertiaState.s} cm!`;
    }

    if (inertiaState.snapped) pinsX = inertiaState.magnetX - 40; // Pins stick to magnet

    // Draw Magnet
    ctx.fillStyle = '#ef4444'; ctx.fillRect(inertiaState.magnetX - 40, 85, 40, 30);
    ctx.fillStyle = '#3b82f6'; ctx.fillRect(inertiaState.magnetX, 85, 40, 30);
    
    // Draw Pins
    ctx.strokeStyle = '#64748b'; ctx.lineWidth = 2;
    for(let i=0; i<inertiaState.n; i++) {
        ctx.beginPath(); ctx.moveTo(pinsX, 90 + (i*2)); ctx.lineTo(pinsX - 15, 90 + (i*2)); ctx.stroke();
    }

    // Ruler
    ctx.strokeStyle = '#0f172a'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(50, 130); ctx.lineTo(400, 130); ctx.stroke();

    if(!inertiaState.snapped) document.getElementById('lbl-inert-x').innerText = `Slide Left...`;
    inertiaState.animId = requestAnimationFrame(loopInertia);
}

/**
 * ==========================================================================
 * RADIOACTIVITY SUITE (R1-27, R2-28)
 * ==========================================================================
 */
function renderRadioCubes() {
    document.getElementById('simulation-render-target').innerHTML = `
        <div class="bench-card" style="width:100%; max-width:850px; display:flex; flex-wrap:wrap; gap:20px; background:#0d1117; padding:1.5rem; border-radius:12px; border:1px solid #30363d; box-sizing:border-box;">
            <div style="flex:1; min-width:200px; display:flex; flex-direction:column; gap:15px;">
                <div style="background:#161b22; padding:15px; border-radius:8px; border:2px solid #30363d; text-align:center;">
                    <div style="color:#8b949e; font-size:0.75rem; font-family:'Orbitron';">REMAINING CUBES (N)</div>
                    <div class="lcd-screen" id="cubes-lcd" style="font-size:2.5rem; color:#10b981; background:#000; padding:10px; border-radius:6px; font-weight:bold;">250</div>
                </div>
                <div style="background:#1e293b; padding:15px; border-radius:8px; border:1px solid #334155;">
                    <button onclick="tossCubes()" id="btn-toss" style="width:100%; background:var(--cobalt); color:white; border:none; padding:12px; border-radius:6px; font-weight:bold; cursor:pointer;"><i class="fas fa-dice"></i> Toss Cubes</button>
                    <div style="color:#fff; margin-top:10px; font-size:0.85rem;">Toss Count (t): <span id="lbl-toss-count">0</span></div>
                    <div style="color:#ef4444; margin-top:5px; font-size:0.85rem;">Removed: <span id="lbl-toss-rem">0</span></div>
                </div>
            </div>
            <div style="flex:2; min-width:200px; width:100%; box-sizing:border-box; background:#fff; border-radius:8px; padding:10px; display:flex; justify-content:center; position:relative; border:2px solid #0f172a; overflow:hidden;">
                <canvas id="canvas-cubes" width="450" height="300" style="max-width:100%; height:auto; display:block;"></canvas>
            </div>
        </div>`;
    
    // Initialize 250 cubes
    cubesState.cubesData = [];
    for(let i=0; i<250; i++) {
        cubesState.cubesData.push({ x: 50 + Math.random()*350, y: 50 + Math.random()*200, vx: 0, vy: 0, decayed: false, alpha: 1 });
    }
    if(cubesState.animId) cancelAnimationFrame(cubesState.animId);
    loopCubes();
}
function tossCubes() {
    if(cubesState.isTossing || cubesState.N <= 0) return;
    cubesState.isTossing = true; cubesState.t++; document.getElementById('lbl-toss-count').innerText = cubesState.t;
    document.getElementById('btn-toss').style.opacity = '0.5';
    
    // Give velocities and calculate decays (1/6 chance)
    let removedThisToss = 0;
    cubesState.cubesData.forEach(c => {
        if(!c.decayed) {
            c.vx = (Math.random() - 0.5) * 10; c.vy = (Math.random() - 0.5) * 10;
            if(Math.random() < 0.166) { c.decayed = true; removedThisToss++; }
        }
    });
    cubesState.removed = removedThisToss;
    cubesState.N -= removedThisToss;
    document.getElementById('lbl-toss-rem').innerText = removedThisToss;
    document.getElementById('cubes-lcd').innerText = cubesState.N;
    
    setTimeout(() => { cubesState.isTossing = false; document.getElementById('btn-toss').style.opacity = '1'; }, 1500);
}
function loopCubes() {
    const canvas = document.getElementById('canvas-cubes'); if(!canvas) return;
    const ctx = canvas.getContext('2d'); ctx.clearRect(0,0, canvas.width, canvas.height);

    cubesState.cubesData.forEach(c => {
        if(c.decayed && c.alpha <= 0) return; // Gone
        
        if(cubesState.isTossing && !c.decayed) {
            c.x += c.vx; c.y += c.vy; c.vx *= 0.9; c.vy *= 0.9; // Friction
            // Bounds
            if(c.x < 10 || c.x > 440) c.vx *= -1; if(c.y < 10 || c.y > 290) c.vy *= -1;
        }

        ctx.fillStyle = c.decayed ? `rgba(239, 68, 68, ${c.alpha})` : '#3b82f6';
        if(c.decayed) c.alpha -= 0.02; // Fade out red
        ctx.fillRect(c.x, c.y, 8, 8);
    });

    cubesState.animId = requestAnimationFrame(loopCubes);
}

function renderRadioBurette() {
    document.getElementById('simulation-render-target').innerHTML = `
        <div class="bench-card" style="width:100%; max-width:850px; display:flex; flex-wrap:wrap; gap:20px; background:#0d1117; padding:1.5rem; border-radius:12px; border:1px solid #30363d; box-sizing:border-box;">
            <div style="flex:1; min-width:200px; display:flex; flex-direction:column; gap:15px;">
                <div style="background:#161b22; padding:15px; border-radius:8px; border:2px solid #30363d; text-align:center;">
                    <div style="color:#8b949e; font-size:0.75rem; font-family:'Orbitron';">STOPWATCH (s)</div>
                    <div class="lcd-screen" id="bur-time-lcd" style="font-size:2.5rem; color:#f59e0b; background:#000; padding:10px; border-radius:6px; font-weight:bold;">0.0</div>
                </div>
                <div style="background:#1e293b; padding:15px; border-radius:8px; border:1px solid #334155;">
                    <button id="btn-bur-tap" onclick="toggleBurette()" style="width:100%; background:var(--emerald); color:white; border:none; padding:12px; border-radius:6px; font-weight:bold; cursor:pointer;"><i class="fas fa-tint"></i> Open Tap</button>
                    <div style="color:#fff; margin-top:15px; font-size:0.85rem;">Volume Left (V1): <span id="lbl-bur-v1" style="color:var(--sim-accent); font-weight:bold;">50.0 cm³</span></div>
                </div>
            </div>
            <div style="flex:2; min-width:200px; width:100%; box-sizing:border-box; background:#fff; border-radius:8px; padding:10px; display:flex; justify-content:center; position:relative; border:2px solid #0f172a; overflow:hidden;">
                <canvas id="canvas-burette" width="450" height="350" style="max-width:100%; height:auto; display:block;"></canvas>
            </div>
        </div>`;
    buretteState.isFlowing = false; buretteState.time = 0; buretteState.vLeft = 50.0;
    if(buretteState.animId) cancelAnimationFrame(buretteState.animId); loopBurette();
}
function toggleBurette() {
    buretteState.isFlowing = !buretteState.isFlowing;
    let btn = document.getElementById('btn-bur-tap');
    if(buretteState.isFlowing) { buretteState.lastTick = performance.now(); btn.innerHTML = "Close Tap"; btn.style.background = '#ef4444'; }
    else { btn.innerHTML = "Open Tap"; btn.style.background = 'var(--emerald)'; }
}
function loopBurette() {
    const canvas = document.getElementById('canvas-burette'); if(!canvas) return;
    const ctx = canvas.getContext('2d'); ctx.clearRect(0,0, canvas.width, canvas.height);

    if (buretteState.isFlowing && buretteState.vLeft > 0) {
        const now = performance.now(); let dt = (now - buretteState.lastTick)/1000;
        buretteState.time += dt * 5; // Sim speed
        buretteState.lastTick = now;
        // Exponential decay of volume (pressure head simulation)
        buretteState.vLeft = 50.0 * Math.exp(-buretteState.lambda * buretteState.time);
        document.getElementById('bur-time-lcd').innerText = buretteState.time.toFixed(1);
        document.getElementById('lbl-bur-v1').innerText = `${buretteState.vLeft.toFixed(1)} cm³`;
    }

    // Draw Burette
    ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(215, 20); ctx.lineTo(215, 250); ctx.lineTo(220, 270); ctx.lineTo(220, 290); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(235, 20); ctx.lineTo(235, 250); ctx.lineTo(230, 270); ctx.lineTo(230, 290); ctx.stroke();
    
    // Tap
    ctx.fillStyle = '#334155'; ctx.fillRect(210, 260, 30, 10);

    // Water inside
    let pxPerVol = 230 / 50;
    let waterY = 250 - (buretteState.vLeft * pxPerVol);
    ctx.fillStyle = 'rgba(56, 189, 248, 0.6)'; ctx.fillRect(217, waterY, 16, 250 - waterY);

    // Drip animation
    if(buretteState.isFlowing && buretteState.vLeft > 1) {
        ctx.beginPath(); ctx.arc(225, 290 + ((performance.now()/2)%40), 3, 0, Math.PI*2); ctx.fill();
    }

    buretteState.animId = requestAnimationFrame(loopBurette);
}

/**
 * ==========================================================================
 * STATION 3: MEASURING DIAMETERS (SANDBOX ENGINE)
 * ==========================================================================
 */
function renderStationDiameters() {
    // Generate slight random variances per session so students can't copy answers
    stationDiametersState.trueMass = 30.0 + (Math.random() * 5.0); 
    stationDiametersState.trueDiameter = 1.90 + (Math.random() * 0.20); 

    document.getElementById('simulation-render-target').innerHTML = `
        <div class="bench-card" style="width: 100%; max-width: 850px; display: flex; flex-wrap: wrap; gap: 20px; background: #0d1117; padding: 1.5rem; border-radius: 12px; border: 1px solid #30363d; box-sizing: border-box;">
            <div style="flex: 1; min-width: 250px; display: flex; flex-direction: column; gap: 15px;">
                
                <div style="background: #161b22; padding: 20px; border-radius: 8px; border: 2px solid #30363d; text-align: center;">
                    <div style="color:#8b949e; font-size:0.8rem; margin-bottom:5px; font-family:'Orbitron';">INSTRUMENT READOUT</div>
                    <div class="lcd-screen" id="station-lcd" style="font-size:2.5rem; color:#10b981; background:#000; padding:10px; border-radius:6px; font-weight:bold;">---</div>
                    <div id="station-unit" style="color:#f59e0b; font-size:1rem; font-weight:bold; margin-top:5px;"></div>
                </div>

                <div style="background: #1e293b; padding: 15px; border-radius: 8px; border: 1px solid #334155;">
                    <label style="color:#fff; font-size:0.9rem; font-weight:bold; display:block; margin-bottom:12px; text-align:center;">Apparatus Sandbox</label>
                    <button onclick="useStationTool('balance')" style="width:100%; margin-bottom:8px; background:#475569; color:#fff; border:none; padding:12px; border-radius:6px; font-weight:bold; cursor:pointer;"><i class="fas fa-weight-hanging"></i> Place on Top Pan Balance</button>
                    <button onclick="useStationTool('vernier')" style="width:100%; margin-bottom:8px; background:#3b82f6; color:#fff; border:none; padding:12px; border-radius:6px; font-weight:bold; cursor:pointer;"><i class="fas fa-ruler"></i> Grip in Vernier Caliper</button>
                    <button onclick="useStationTool('micrometer')" style="width:100%; background:#f59e0b; color:#000; border:none; padding:12px; border-radius:6px; font-weight:bold; cursor:pointer;"><i class="fas fa-tools"></i> Mount in Micrometer</button>
                </div>
            </div>

            <div style="flex: 2; min-width: 300px; width: 100%; box-sizing: border-box; background: #fff; border-radius: 8px; padding: 10px; display: flex; justify-content: center; align-items: center; position: relative; border: 2px solid #0f172a; overflow:hidden;">
                <canvas id="canvas-station" width="450" height="350" style="max-width: 100%; height: auto; display:block;"></canvas>
            </div>
        </div>
    `;
    useStationTool('idle');
}

function useStationTool(tool) {
    stationDiametersState.activeTool = tool;
    
    // Add realistic reading noise based on the instrument's precision
    if (tool === 'balance') {
        stationDiametersState.displayValue = (stationDiametersState.trueMass + (Math.random() * 0.02 - 0.01)).toFixed(2);
        stationDiametersState.unit = "grams (g)";
    } else if (tool === 'vernier') {
        stationDiametersState.displayValue = (stationDiametersState.trueDiameter + (Math.random() * 0.04 - 0.02)).toFixed(2);
        stationDiametersState.unit = "centimeters (cm)";
    } else if (tool === 'micrometer') {
        let diamMm = stationDiametersState.trueDiameter * 10;
        stationDiametersState.displayValue = (diamMm + (Math.random() * 0.02 - 0.01)).toFixed(2);
        stationDiametersState.unit = "millimeters (mm)";
    } else {
        stationDiametersState.displayValue = "---";
        stationDiametersState.unit = "Select an instrument";
    }

    document.getElementById('station-lcd').innerText = stationDiametersState.displayValue;
    document.getElementById('station-unit').innerText = stationDiametersState.unit;

    if (stationDiametersState.animId) cancelAnimationFrame(stationDiametersState.animId);
    stationLoop();
}

function stationLoop() {
    const canvas = document.getElementById('canvas-station'); if(!canvas) return;
    const ctx = canvas.getContext('2d'); ctx.clearRect(0,0, canvas.width, canvas.height);

    const cx = 225, cy = 175;

    if (stationDiametersState.activeTool === 'idle') {
        ctx.fillStyle = '#0f172a'; ctx.font = '16px Poppins'; ctx.textAlign = 'center';
        ctx.fillText("Steel Ball Bearing resting on lab bench.", cx, cy + 40);
        ctx.beginPath(); ctx.arc(cx, cy, 30, 0, Math.PI*2);
        let grad = ctx.createRadialGradient(cx-10, cy-10, 5, cx, cy, 30);
        grad.addColorStop(0, '#f1f5f9'); grad.addColorStop(1, '#475569');
        ctx.fillStyle = grad; ctx.fill(); ctx.strokeStyle = '#1e293b'; ctx.lineWidth = 2; ctx.stroke();
    } 
    else if (stationDiametersState.activeTool === 'balance') {
        ctx.fillStyle = '#cbd5e1'; ctx.fillRect(cx - 80, cy + 30, 160, 40);
        ctx.fillStyle = '#1e293b'; ctx.fillRect(cx - 50, cy + 20, 100, 10);
        ctx.fillStyle = '#10b981'; ctx.fillRect(cx - 20, cy + 45, 40, 15);
        ctx.beginPath(); ctx.arc(cx, cy - 10, 30, 0, Math.PI*2);
        let grad = ctx.createRadialGradient(cx-10, cy-20, 5, cx, cy-10, 30);
        grad.addColorStop(0, '#f1f5f9'); grad.addColorStop(1, '#475569');
        ctx.fillStyle = grad; ctx.fill(); ctx.stroke();
    }
    else if (stationDiametersState.activeTool === 'vernier') {
        ctx.fillStyle = '#94a3b8'; 
        ctx.fillRect(cx - 100, cy - 80, 20, 160); 
        ctx.fillRect(cx + 40, cy - 80, 20, 160); 
        ctx.fillRect(cx - 100, cy - 100, 250, 20); 
        ctx.beginPath(); ctx.arc(cx - 25, cy, 30, 0, Math.PI*2);
        let grad = ctx.createRadialGradient(cx-35, cy-10, 5, cx-25, cy, 30);
        grad.addColorStop(0, '#f1f5f9'); grad.addColorStop(1, '#475569');
        ctx.fillStyle = grad; ctx.fill(); ctx.stroke();
    }
    else if (stationDiametersState.activeTool === 'micrometer') {
        ctx.strokeStyle = '#334155'; ctx.lineWidth = 25; ctx.lineCap = 'round';
        ctx.beginPath(); ctx.arc(cx - 20, cy, 70, Math.PI/2, Math.PI * 1.5); ctx.stroke();
        ctx.fillStyle = '#cbd5e1'; 
        ctx.fillRect(cx - 90, cy - 5, 20, 10); 
        ctx.fillRect(cx + 10, cy - 5, 60, 10); 
        ctx.beginPath(); ctx.arc(cx - 25, cy, 30, 0, Math.PI*2);
        let grad = ctx.createRadialGradient(cx-35, cy-10, 5, cx-25, cy, 30);
        grad.addColorStop(0, '#f1f5f9'); grad.addColorStop(1, '#475569');
        ctx.fillStyle = grad; ctx.fill(); ctx.stroke();
    }

    stationDiametersState.animId = requestAnimationFrame(stationLoop);
}

/**
 * ==========================================================================
 * STATION 4: ELECTROLYSIS (SALT VS SUGAR)
 * ==========================================================================
 */
function renderStation4() {
    document.getElementById('simulation-render-target').innerHTML = `
        <div class="bench-card" style="width:100%; max-width:850px; display:flex; flex-wrap:wrap; gap:20px; background:#0d1117; padding:1.5rem; border-radius:12px; border:1px solid #30363d; box-sizing:border-box;">
            <div style="flex:1; min-width:250px; display:flex; flex-direction:column; gap:15px;">
                <div style="background:#1e293b; padding:15px; border-radius:8px; border:1px solid #334155;">
                    <label style="color:#fff; font-size:0.9rem; font-weight:bold; display:block; margin-bottom:12px; text-align:center;">Circuit Sandbox</label>
                    <button onclick="st4Test('P')" style="width:100%; margin-bottom:8px; background:#3b82f6; color:#fff; border:none; padding:12px; border-radius:6px; font-weight:bold; cursor:pointer;"><i class="fas fa-vial"></i> Dip Nails in Solution P</button>
                    <button onclick="st4Test('Q')" style="width:100%; margin-bottom:8px; background:#8b5cf6; color:#fff; border:none; padding:12px; border-radius:6px; font-weight:bold; cursor:pointer;"><i class="fas fa-vial"></i> Dip Nails in Solution Q</button>
                    <button onclick="st4Test('idle')" style="width:100%; background:#ef4444; color:#fff; border:none; padding:12px; border-radius:6px; font-weight:bold; cursor:pointer;"><i class="fas fa-undo"></i> Clean & Reset</button>
                </div>
            </div>
            <div style="flex:2; min-width:300px; background:#fff; border-radius:8px; padding:10px; display:flex; justify-content:center; border:2px solid #0f172a; overflow:hidden;">
                <canvas id="canvas-st4" width="450" height="350" style="display:block;"></canvas>
            </div>
        </div>
    `;
    st4Test('idle');
}
function st4Test(sol) { st4State.activeSol = sol; if(st4State.animId) cancelAnimationFrame(st4State.animId); st4Loop(); }
function st4Loop() {
    const canvas = document.getElementById('canvas-st4'); if(!canvas) return;
    const ctx = canvas.getContext('2d'); ctx.clearRect(0,0, canvas.width, canvas.height);
    
    // Draw Battery & Lamp
    ctx.fillStyle = '#facc15'; ctx.fillRect(150, 40, 60, 30); ctx.fillStyle = '#000'; ctx.fillText('3V', 170, 60);
    ctx.fillStyle = '#475569'; ctx.fillRect(260, 30, 40, 40); // Lamp base
    
    let isGlowing = st4State.activeSol === 'P'; // Let's make P the salt (conductor)
    ctx.beginPath(); ctx.arc(280, 20, 25, 0, Math.PI*2);
    ctx.fillStyle = isGlowing ? '#fef08a' : '#e2e8f0'; ctx.fill(); ctx.strokeStyle='#94a3b8'; ctx.lineWidth=2; ctx.stroke();
    if(isGlowing) { ctx.shadowBlur = 20; ctx.shadowColor = '#facc15'; ctx.stroke(); ctx.shadowBlur = 0; }

    // Draw Wires
    ctx.strokeStyle = '#ef4444'; ctx.beginPath(); ctx.moveTo(150, 55); ctx.lineTo(100, 55); ctx.lineTo(100, 150); ctx.stroke();
    ctx.strokeStyle = '#000'; ctx.beginPath(); ctx.moveTo(210, 55); ctx.lineTo(260, 55); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(300, 55); ctx.lineTo(350, 55); ctx.lineTo(350, 150); ctx.stroke();

    // Draw Beaker & Solution
    ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(140, 150); ctx.lineTo(140, 320); ctx.lineTo(310, 320); ctx.lineTo(310, 150); ctx.stroke();
    if (st4State.activeSol !== 'idle') {
        ctx.fillStyle = st4State.activeSol === 'P' ? 'rgba(56,189,248,0.3)' : 'rgba(216,180,254,0.3)';
        ctx.fillRect(142, 200, 166, 118);
        ctx.fillStyle = '#0f172a'; ctx.font = 'bold 24px Poppins'; ctx.fillText(st4State.activeSol, 215, 270);
        
        // Draw Nails dipped in
        ctx.fillStyle = '#64748b'; ctx.fillRect(160, 150, 10, 100); ctx.fillRect(280, 150, 10, 100);
        // Connect wires to nails
        ctx.strokeStyle = '#ef4444'; ctx.beginPath(); ctx.moveTo(100, 150); ctx.lineTo(165, 150); ctx.stroke();
        ctx.strokeStyle = '#000'; ctx.beginPath(); ctx.moveTo(350, 150); ctx.lineTo(285, 150); ctx.stroke();
        
        // Bubbles if conducting
        if(isGlowing) {
            ctx.fillStyle = 'rgba(255,255,255,0.8)';
            for(let i=0; i<5; i++) {
                ctx.beginPath(); ctx.arc(165 + Math.random()*4-2, 250 - (performance.now()/20%50) - i*10, 2, 0, Math.PI*2); ctx.fill();
                ctx.beginPath(); ctx.arc(285 + Math.random()*4-2, 250 - (performance.now()/20%50) - i*10, 2, 0, Math.PI*2); ctx.fill();
            }
        }
    }
    st4State.animId = requestAnimationFrame(st4Loop);
}

/**
 * ==========================================================================
 * STATION 7: OVERFLOW CAN DENSITY
 * ==========================================================================
 */
function renderStation7() {
    document.getElementById('simulation-render-target').innerHTML = `
        <div class="bench-card" style="width:100%; max-width:850px; display:flex; flex-wrap:wrap; gap:20px; background:#0d1117; padding:1.5rem; border-radius:12px; border:1px solid #30363d; box-sizing:border-box;">
            <div style="flex:1; min-width:250px; display:flex; flex-direction:column; gap:15px;">
                <div style="background:#161b22; padding:15px; border-radius:8px; border:2px solid #30363d; text-align:center;">
                    <div style="color:#8b949e; font-size:0.8rem; margin-bottom:5px; font-family:'Orbitron';">TOP PAN BALANCE</div>
                    <div class="lcd-screen" id="st7-lcd" style="font-size:2.5rem; color:#ef4444; background:#000; padding:10px; border-radius:6px; font-weight:bold;">0.00 g</div>
                </div>
                <div style="background:#1e293b; padding:15px; border-radius:8px; border:1px solid #334155;">
                    <button onclick="st7Action('weigh')" style="width:100%; margin-bottom:8px; background:#475569; color:#fff; border:none; padding:12px; border-radius:6px; font-weight:bold; cursor:pointer;"><i class="fas fa-weight"></i> Weigh Object</button>
                    <button onclick="st7Action('drop')" style="width:100%; margin-bottom:8px; background:#3b82f6; color:#fff; border:none; padding:12px; border-radius:6px; font-weight:bold; cursor:pointer;"><i class="fas fa-water"></i> Drop in Overflow Can</button>
                    <button onclick="st7Action('idle')" style="width:100%; background:#f59e0b; color:#000; border:none; padding:12px; border-radius:6px; font-weight:bold; cursor:pointer;"><i class="fas fa-undo"></i> Reset</button>
                </div>
            </div>
            <div style="flex:2; min-width:300px; background:#fff; border-radius:8px; padding:10px; display:flex; justify-content:center; border:2px solid #0f172a; overflow:hidden;">
                <canvas id="canvas-st7" width="450" height="350" style="display:block;"></canvas>
            </div>
        </div>
    `;
    st7Action('idle');
}
function st7Action(act) { 
    st7State.phase = act; 
    if(act==='idle') { st7State.animY = 50; st7State.dispVol = 0; document.getElementById('st7-lcd').innerText = "0.00 g"; }
    else if(act==='weigh') { document.getElementById('st7-lcd').innerText = (st7State.trueMass + (Math.random()*0.04-0.02)).toFixed(2) + " g"; }
    else { document.getElementById('st7-lcd').innerText = "0.00 g"; }
    if(st7State.animId) cancelAnimationFrame(st7State.animId); st7Loop(); 
}
function st7Loop() {
    const canvas = document.getElementById('canvas-st7'); if(!canvas) return;
    const ctx = canvas.getContext('2d'); ctx.clearRect(0,0, canvas.width, canvas.height);

    // Draw Balance
    ctx.fillStyle = '#cbd5e1'; ctx.fillRect(20, 280, 120, 40); ctx.fillStyle = '#1e293b'; ctx.fillRect(30, 270, 100, 10);
    
    // Draw Overflow Can
    ctx.strokeStyle = '#64748b'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(200, 120); ctx.lineTo(200, 280); ctx.lineTo(300, 280); ctx.lineTo(300, 120); ctx.stroke();
    ctx.fillStyle = 'rgba(56,189,248,0.3)'; ctx.fillRect(202, 140, 96, 138); // Water right up to spout
    ctx.beginPath(); ctx.moveTo(300, 140); ctx.lineTo(330, 160); ctx.lineTo(330, 170); ctx.lineTo(300, 150); ctx.fillStyle='#64748b'; ctx.fill(); // Spout

    // Draw Measuring Cylinder
    ctx.strokeStyle = '#94a3b8'; ctx.beginPath(); ctx.moveTo(330, 180); ctx.lineTo(330, 320); ctx.lineTo(380, 320); ctx.lineTo(380, 180); ctx.stroke();
    
    // Object Animation
    ctx.fillStyle = '#3f3f46';
    if(st7State.phase === 'weigh') {
        ctx.fillRect(70, 240, 30, 30);
    } else if(st7State.phase === 'drop') {
        if(st7State.animY < 240) { st7State.animY += 3; }
        ctx.fillRect(235, st7State.animY, 30, 30);
        
        // Water displacement animation
        if(st7State.animY > 140 && st7State.dispVol < st7State.trueVol) {
            st7State.dispVol += 0.2;
            // Drip from spout
            ctx.fillStyle = '#38bdf8'; ctx.beginPath(); ctx.arc(330, 170 + ((performance.now()/10)%150), 3, 0, Math.PI*2); ctx.fill();
        }
    }

    // Filled Volume in Cylinder
    if(st7State.dispVol > 0) {
        ctx.fillStyle = 'rgba(56,189,248,0.5)';
        let pxH = st7State.dispVol * 4; // Visual scaling
        ctx.fillRect(332, 320 - pxH, 46, pxH);
    }
    
    // Cylinder Ticks
    ctx.fillStyle = '#0f172a'; ctx.font = '10px Arial';
    for(let i=0; i<=20; i+=5) {
        let ty = 320 - (i*4);
        ctx.beginPath(); ctx.moveTo(330, ty); ctx.lineTo(335, ty); ctx.stroke();
        if(i>0) ctx.fillText(i, 315, ty+4);
    }

    st7State.animId = requestAnimationFrame(st7Loop);
}

/**
 * ==========================================================================
 * STATION 8: MAGNETIC BLACK BOXES
 * ==========================================================================
 */
function renderStation8() {
    document.getElementById('simulation-render-target').innerHTML = `
        <div class="bench-card" style="width:100%; max-width:850px; display:flex; flex-wrap:wrap; gap:20px; background:#0d1117; padding:1.5rem; border-radius:12px; border:1px solid #30363d; box-sizing:border-box;">
            <div style="flex:1; min-width:250px; display:flex; flex-direction:column; gap:15px;">
                <div style="background:#1e293b; padding:15px; border-radius:8px; border:1px solid #334155;">
                    <label style="color:#fff; font-size:0.9rem; font-weight:bold; display:block; margin-bottom:12px;">Select Black Box to Suspend</label>
                    <button onclick="st8Action('A')" style="width:100%; margin-bottom:8px; background:#475569; color:#fff; border:none; padding:12px; border-radius:6px; font-weight:bold; cursor:pointer;">Hang Box A</button>
                    <button onclick="st8Action('B')" style="width:100%; margin-bottom:8px; background:#475569; color:#fff; border:none; padding:12px; border-radius:6px; font-weight:bold; cursor:pointer;">Hang Box B</button>
                    <button onclick="st8Action('C')" style="width:100%; background:#475569; color:#fff; border:none; padding:12px; border-radius:6px; font-weight:bold; cursor:pointer;">Hang Box C</button>
                </div>
                <div style="background:#161b22; padding:15px; border-radius:8px; border:1px solid #334155;">
                    <label style="color:#facc15; font-size:0.85rem; display:block; margin-bottom:8px;"><i class="fas fa-magnet"></i> Slide Permanent Magnet</label>
                    <input type="range" id="slider-st8" min="50" max="300" value="150" style="width:100%; cursor:pointer;">
                </div>
            </div>
            <div style="flex:2; min-width:300px; background:#fff; border-radius:8px; padding:10px; display:flex; justify-content:center; border:2px solid #0f172a; overflow:hidden;">
                <canvas id="canvas-st8" width="450" height="350" style="display:block;"></canvas>
            </div>
        </div>
    `;
    document.getElementById('slider-st8').addEventListener('input', (e) => { st8State.magnetDist = parseInt(e.target.value); });
    st8Action('A');
}
function st8Action(box) { st8State.activeBox = box; document.getElementById('slider-st8').value = 150; st8State.magnetDist = 150; if(st8State.animId) cancelAnimationFrame(st8State.animId); st8Loop(); }
function st8Loop() {
    const canvas = document.getElementById('canvas-st8'); if(!canvas) return;
    const ctx = canvas.getContext('2d'); ctx.clearRect(0,0, canvas.width, canvas.height);

    // Physics mapping: A = Ferro (Attracts), B = Magnet (Repels North), C = Non-Mag (Nothing)
    let pull = 0;
    if(st8State.activeBox === 'A') pull = -2000 / Math.pow(st8State.magnetDist, 1.5); // Attracts
    else if(st8State.activeBox === 'B') pull = 2000 / Math.pow(st8State.magnetDist, 1.5); // Repels
    
    // Draw Stand
    ctx.fillStyle = '#1e293b'; ctx.fillRect(20, 20, 200, 15); ctx.fillRect(20, 20, 15, 300);
    
    // Calculate Box Position
    let cx = 150; let cy = 35; let strL = 150;
    let angle = Math.max(-Math.PI/4, Math.min(Math.PI/4, pull)); // Limit swing
    let bx = cx + Math.sin(angle)*strL;
    let by = cy + Math.cos(angle)*strL;

    // String & Box
    ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(bx, by); ctx.stroke();
    ctx.fillStyle = '#0f172a'; ctx.fillRect(bx-25, by-25, 50, 50);
    ctx.fillStyle = '#fff'; ctx.font = 'bold 20px Arial'; ctx.textAlign = 'center'; ctx.fillText(st8State.activeBox, bx, by+7);

    // Draw Magnet being brought close
    let mx = bx + st8State.magnetDist;
    ctx.fillStyle = '#ef4444'; ctx.fillRect(mx, by-15, 60, 30); ctx.fillStyle = '#3b82f6'; ctx.fillRect(mx+60, by-15, 60, 30);
    ctx.fillStyle = '#fff'; ctx.font = 'bold 16px Arial'; ctx.fillText('N', mx+30, by+5); ctx.fillText('S', mx+90, by+5);

    st8State.animId = requestAnimationFrame(st8Loop);
}

/**
 * ==========================================================================
 * STATION 9: FOCAL LENGTH (LENS & MIRROR METHOD)
 * ==========================================================================
 */
function renderStation9() {
    document.getElementById('simulation-render-target').innerHTML = `
        <div class="bench-card" style="width:100%; max-width:850px; display:flex; flex-wrap:wrap; gap:20px; background:#0d1117; padding:1.5rem; border-radius:12px; border:1px solid #30363d; box-sizing:border-box;">
            <div style="flex:1; min-width:250px; display:flex; flex-direction:column; gap:15px;">
                <div style="background:#161b22; padding:15px; border-radius:8px; border:2px solid #38bdf8; text-align:center;">
                    <div style="color:#38bdf8; font-size:0.8rem; margin-bottom:5px; font-family:'Orbitron';">RULER DISTANCE (cm)</div>
                    <div class="lcd-screen" id="st9-lcd" style="font-size:2.5rem; color:#fff; background:#000; padding:10px; border-radius:6px; font-weight:bold;">15.0</div>
                </div>
                <div style="background:#1e293b; padding:15px; border-radius:8px; border:1px solid #334155;">
                    <label style="color:#facc15; font-size:0.85rem; display:block; margin-bottom:8px;"><i class="fas fa-arrows-alt-v"></i> Adjust Search Pin Height</label>
                    <input type="range" id="slider-st9" min="5" max="40" value="15" step="0.1" style="width:100%; cursor:pointer;">
                    <p style="color:#94a3b8; font-size:0.75rem; margin-top:10px;">Adjust until the pin and its inverted image perfectly coincide (No Parallax).</p>
                </div>
            </div>
            <div style="flex:2; min-width:300px; background:#fff; border-radius:8px; padding:10px; display:flex; justify-content:center; position:relative; border:2px solid #0f172a; overflow:hidden;">
                <canvas id="canvas-st9" width="450" height="350" style="display:block;"></canvas>
            </div>
        </div>
    `;
    document.getElementById('slider-st9').addEventListener('input', (e) => { 
        st9State.pinHeight = parseFloat(e.target.value); 
        document.getElementById('st9-lcd').innerText = st9State.pinHeight.toFixed(1);
    });
    if(st9State.animId) cancelAnimationFrame(st9State.animId); st9Loop();
}
function st9Loop() {
    const canvas = document.getElementById('canvas-st9'); if(!canvas) return;
    const ctx = canvas.getContext('2d'); ctx.clearRect(0,0, canvas.width, canvas.height);

    const cx = 225; const cy = 250; // Lens center

    // Draw Mirror at bottom
    ctx.fillStyle = '#cbd5e1'; ctx.fillRect(cx-60, cy+10, 120, 10);
    // Draw Lens
    ctx.fillStyle = 'rgba(56,189,248,0.4)'; ctx.beginPath(); ctx.ellipse(cx, cy, 50, 10, 0, 0, Math.PI*2); ctx.fill(); ctx.strokeStyle='#0f172a'; ctx.stroke();
    
    // Draw Ruler
    ctx.strokeStyle = '#000'; ctx.lineWidth=3; ctx.beginPath(); ctx.moveTo(cx-100, cy); ctx.lineTo(cx-100, 50); ctx.stroke();
    ctx.font = '10px Arial'; ctx.fillStyle='#000';
    for(let i=0; i<=40; i+=10) { let y = cy - (i*4.5); ctx.fillText(i, cx-125, y+4); ctx.beginPath(); ctx.moveTo(cx-100,y); ctx.lineTo(cx-95,y); ctx.stroke(); }

    // Pin Graphics
    let pxY = cy - (st9State.pinHeight * 4.5);
    
    // Image Pin (Inverted, blurs if not at focus)
    let error = Math.abs(st9State.pinHeight - st9State.focalLength);
    let blur = error * 2; let imgY = cy - (st9State.focalLength * 4.5) + (error * 1.5); // Shifts and blurs
    
    ctx.save(); ctx.globalAlpha = Math.max(0.1, 1 - (error/15)); // Fades out if too far
    ctx.filter = `blur(${blur}px)`;
    ctx.fillStyle = '#3b82f6'; ctx.beginPath(); ctx.moveTo(cx-5, imgY-30); ctx.lineTo(cx+5, imgY-30); ctx.lineTo(cx, imgY); ctx.fill(); // Inverted triangle tip
    ctx.restore();

    // Real Pin
    ctx.fillStyle = '#ef4444'; ctx.beginPath(); ctx.moveTo(cx-5, pxY+30); ctx.lineTo(cx+5, pxY+30); ctx.lineTo(cx, pxY); ctx.fill();

    // Visual cue if perfect
    if(error < 0.5) { ctx.fillStyle = '#10b981'; ctx.font = 'bold 16px Poppins'; ctx.textAlign='center'; ctx.fillText('NO PARALLAX ACHIEVED (u = f)', cx, 30); }

    st9State.animId = requestAnimationFrame(st9Loop);
}

/**
 * ==========================================================================
 * STATION 10: EVAPORATION COOLING EFFECT
 * ==========================================================================
 */
function renderStation10() {
    document.getElementById('simulation-render-target').innerHTML = `
        <div class="bench-card" style="width:100%; max-width:850px; display:flex; flex-wrap:wrap; gap:20px; background:#0d1117; padding:1.5rem; border-radius:12px; border:1px solid #30363d; box-sizing:border-box;">
            <div style="flex:1; min-width:250px; display:flex; flex-direction:column; gap:15px;">
                <div style="background:#161b22; padding:15px; border-radius:8px; border:2px solid #30363d; display:flex; gap:10px;">
                    <div style="flex:1; text-align:center;"><div style="color:#8b949e; font-size:0.6rem; font-family:'Orbitron';">DRY BULB (°C)</div><div class="lcd-screen" id="st10-t2" style="font-size:1.8rem; color:#f59e0b; padding:5px;">25.0</div></div>
                    <div style="flex:1; text-align:center;"><div style="color:#8b949e; font-size:0.6rem; font-family:'Orbitron';">WET BULB (°C)</div><div class="lcd-screen" id="st10-t1" style="font-size:1.8rem; color:#38bdf8; padding:5px;">25.0</div></div>
                </div>
                <div style="background:#1e293b; padding:15px; border-radius:8px; border:1px solid #334155; text-align:center;">
                    <div style="color:#10b981; font-size:1.2rem; font-weight:bold; font-family:'Orbitron'; margin-bottom:10px;" id="st10-time">0:00 mins</div>
                    <button onclick="st10Action('fan')" id="btn-st10" style="width:100%; background:#8b5cf6; color:#fff; border:none; padding:12px; border-radius:6px; font-weight:bold; cursor:pointer;"><i class="fas fa-fan"></i> Turn Fan ON</button>
                    <button onclick="st10Action('reset')" style="width:100%; margin-top:8px; background:#ef4444; color:#fff; border:none; padding:12px; border-radius:6px; font-weight:bold; cursor:pointer;"><i class="fas fa-undo"></i> Reset Setup</button>
                </div>
            </div>
            <div style="flex:2; min-width:300px; background:#fff; border-radius:8px; padding:10px; display:flex; justify-content:center; border:2px solid #0f172a; overflow:hidden;">
                <canvas id="canvas-st10" width="450" height="350" style="display:block;"></canvas>
            </div>
        </div>
    `;
    st10Action('reset');
}
function st10Action(act) {
    if(act === 'reset') {
        st10State.fanOn = false; st10State.t1 = 25.0; st10State.t2 = 25.0; st10State.timeMins = 0;
        document.getElementById('btn-st10').innerHTML = '<i class="fas fa-fan"></i> Turn Fan ON'; document.getElementById('btn-st10').style.background = '#8b5cf6';
    } else if (act === 'fan') {
        st10State.fanOn = !st10State.fanOn;
        st10State.lastTick = performance.now();
        if(st10State.fanOn) { document.getElementById('btn-st10').innerHTML = 'Turn Fan OFF'; document.getElementById('btn-st10').style.background = '#475569'; }
        else { document.getElementById('btn-st10').innerHTML = '<i class="fas fa-fan"></i> Turn Fan ON'; document.getElementById('btn-st10').style.background = '#8b5cf6'; }
    }
    if(st10State.animId) cancelAnimationFrame(st10State.animId); st10Loop();
}
function st10Loop() {
    const canvas = document.getElementById('canvas-st10'); if(!canvas) return;
    const ctx = canvas.getContext('2d'); ctx.clearRect(0,0, canvas.width, canvas.height);

    if (st10State.fanOn && st10State.timeMins < 3.0) {
        const now = performance.now(); let dtMins = ((now - st10State.lastTick)/1000) * 0.1; // sim speed
        st10State.timeMins += dtMins; st10State.lastTick = now;
        
        // Wet bulb drops due to latent heat of vaporization (EtOH evaporates fast!)
        if(st10State.t1 > 16.0) st10State.t1 -= (dtMins * 8.0);
    }

    document.getElementById('st10-t1').innerText = (st10State.t1 + (Math.random()*0.2-0.1)).toFixed(1);
    document.getElementById('st10-t2').innerText = (st10State.t2 + (Math.random()*0.2-0.1)).toFixed(1);
    document.getElementById('st10-time').innerText = st10State.timeMins.toFixed(2) + " mins";

    // Draw Stand
    ctx.fillStyle = '#1e293b'; ctx.fillRect(220, 20, 10, 300); ctx.fillRect(170, 70, 110, 10); ctx.fillRect(170, 170, 110, 10);

    // Dry Thermometer (Top)
    ctx.fillStyle = '#f8fafc'; ctx.fillRect(80, 65, 120, 20); ctx.fillStyle='#ef4444'; ctx.beginPath(); ctx.arc(90, 75, 12, 0, Math.PI*2); ctx.fill();
    ctx.fillRect(100, 72, (st10State.t2/50)*80, 6);

    // Wet Thermometer (Bottom)
    ctx.fillStyle = '#f8fafc'; ctx.fillRect(80, 165, 120, 20); ctx.fillStyle='#ef4444'; ctx.beginPath(); ctx.arc(90, 175, 12, 0, Math.PI*2); ctx.fill();
    ctx.fillRect(100, 172, (st10State.t1/50)*80, 6);
    
    // Toilet Tissue wrap (Wet)
    ctx.fillStyle = 'rgba(56,189,248,0.6)'; ctx.beginPath(); ctx.arc(90, 175, 15, 0, Math.PI*2); ctx.fill(); // Blue wet tint

    // Draw Fan Wind
    if(st10State.fanOn) {
        ctx.strokeStyle = 'rgba(148,163,184,0.5)'; ctx.lineWidth = 3;
        for(let i=0; i<5; i++) {
            let wx = 350 - ((performance.now()/5 + i*40) % 300);
            ctx.beginPath(); ctx.moveTo(wx, 50+i*40); ctx.lineTo(wx-30, 50+i*40); ctx.stroke();
        }
    }

    st10State.animId = requestAnimationFrame(st10Loop);
}

/**
 * ==========================================================================
 * STATION 12: RADIUS OF A CAPILLARY TUBE
 * ==========================================================================
 */
function renderStation12() {
    document.getElementById('simulation-render-target').innerHTML = `
        <div class="bench-card" style="width:100%; max-width:850px; display:flex; flex-wrap:wrap; gap:20px; background:#0d1117; padding:1.5rem; border-radius:12px; border:1px solid #30363d;">
            <div style="flex:1; min-width:250px; display:flex; flex-direction:column; gap:15px;">
                <div style="background:#1e293b; padding:15px; border-radius:8px; border:1px solid #334155;">
                    <label style="color:#fff; font-size:0.85rem; display:block; margin-bottom:8px; font-family:'Poppins';"><i class="fas fa-search-plus"></i> Select Tube Radius (r)</label>
                    <input type="range" id="slider-st12" min="0.2" max="1.5" value="0.5" step="0.1" style="width:100%; cursor:pointer;">
                    <p style="color:#94a3b8; font-size:0.75rem; margin-top:10px;">Observe the capillary rise (h) on the rule. Use h to calculate the true internal radius.</p>
                </div>
            </div>
            <div style="flex:2; min-width:300px; background:#fff; border-radius:8px; padding:10px; display:flex; justify-content:center; border:2px solid #0f172a; overflow:hidden;">
                <canvas id="canvas-st12" width="450" height="350"></canvas>
            </div>
        </div>
    `;
    document.getElementById('slider-st12').addEventListener('input', (e) => { st12State.radiusMm = parseFloat(e.target.value); });
    st12Loop();
}
function st12Loop() {
    const canvas = document.getElementById('canvas-st12'); if(!canvas) return;
    const ctx = canvas.getContext('2d'); ctx.clearRect(0,0, canvas.width, canvas.height);

    // Physics: h = 2T / (r * rho * g). Scaled for visual representation.
    let h_cm = 1.48 / st12State.radiusMm; 
    let pxHeight = h_cm * 20; // 20px per cm

    // Draw Beaker & Water
    ctx.fillStyle = 'rgba(56, 189, 248, 0.3)'; ctx.fillRect(150, 250, 150, 100);
    ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(150, 200); ctx.lineTo(150, 350); ctx.lineTo(300, 350); ctx.lineTo(300, 200); ctx.stroke();
    
    // Draw Ruler
    ctx.fillStyle = '#facc15'; ctx.fillRect(200, 50, 20, 300);
    ctx.fillStyle = '#000'; ctx.font = '10px Arial';
    for(let i=0; i<=10; i++) {
        let ty = 250 - (i*20); // 0 is at water level (250)
        ctx.beginPath(); ctx.moveTo(200, ty); ctx.lineTo(210, ty); ctx.stroke();
        if(i>0) ctx.fillText(i, 205, ty+10);
    }

    // Draw Capillary Tube
    let tubeW = st12State.radiusMm * 4;
    ctx.fillStyle = 'rgba(255,255,255,0.7)'; ctx.fillRect(230 - tubeW/2, 50, tubeW, 280);
    ctx.strokeStyle = '#64748b'; ctx.lineWidth = 1; ctx.strokeRect(230 - tubeW/2, 50, tubeW, 280);

    // Draw Water inside Tube
    ctx.fillStyle = 'rgba(14, 165, 233, 0.8)';
    ctx.fillRect(230 - tubeW/2 + 1, 250 - pxHeight, tubeW - 2, pxHeight + 30);
    
    // Meniscus Curve
    ctx.beginPath(); ctx.arc(230, 250 - pxHeight, tubeW/2 - 1, 0, Math.PI, false); ctx.fill();

    st12State.animId = requestAnimationFrame(st12Loop);
}

/**
 * ==========================================================================
 * STATION 13: LIQUID DENSITY VIA U-TUBE
 * ==========================================================================
 */
function renderStation13() {
    document.getElementById('simulation-render-target').innerHTML = `
        <div class="bench-card" style="width:100%; max-width:850px; display:flex; flex-wrap:wrap; gap:20px; background:#0d1117; padding:1.5rem; border-radius:12px; border:1px solid #30363d;">
            <div style="flex:1; min-width:250px; display:flex; flex-direction:column; gap:15px;">
                <div style="background:#1e293b; padding:15px; border-radius:8px; border:1px solid #334155;">
                    <label style="color:#38bdf8; font-size:0.85rem; display:block; margin-bottom:8px; font-weight:bold;">Inject Liquid A (Water)</label>
                    <input type="range" id="slider-st13-a" min="0" max="20" value="0" step="1" style="width:100%; cursor:pointer; margin-bottom:15px;">
                    
                    <label style="color:#facc15; font-size:0.85rem; display:block; margin-bottom:8px; font-weight:bold;">Inject Liquid B (Oil)</label>
                    <input type="range" id="slider-st13-b" min="0" max="20" value="0" step="1" style="width:100%; cursor:pointer;">
                </div>
            </div>
            <div style="flex:2; min-width:300px; background:#fff; border-radius:8px; padding:10px; display:flex; justify-content:center; border:2px solid #0f172a; overflow:hidden;">
                <canvas id="canvas-st13" width="450" height="350"></canvas>
            </div>
        </div>
    `;
    document.getElementById('slider-st13-a').addEventListener('input', (e) => { st13State.volA = parseFloat(e.target.value); });
    document.getElementById('slider-st13-b').addEventListener('input', (e) => { st13State.volB = parseFloat(e.target.value); });
    st13Loop();
}
function st13Loop() {
    const canvas = document.getElementById('canvas-st13'); if(!canvas) return;
    const ctx = canvas.getContext('2d'); ctx.clearRect(0,0, canvas.width, canvas.height);

    // Physics of U-Tube balancing: Hydrostatic Pressure
    let baseLevel = 280; 
    let pxPerVol = 5;
    
    let heightA = st13State.volA * pxPerVol;
    let heightB = st13State.volB * pxPerVol;
    
    // Balance calculation
    let shift = (heightA * st13State.densityA - heightB * st13State.densityB) / 2.0;

    let leftFluidTop = baseLevel - heightA + shift;
    let rightFluidTop = baseLevel - heightB - shift;
    let boundaryY = baseLevel + shift; // Where the two fluids touch on the right side

    // Draw Ruler in center
    ctx.fillStyle = '#e2e8f0'; ctx.fillRect(215, 20, 20, 300);
    ctx.fillStyle = '#0f172a'; ctx.font='10px Arial';
    for(let i=0; i<=25; i+=5) {
        let ty = 300 - (i*10); ctx.beginPath(); ctx.moveTo(215, ty); ctx.lineTo(235, ty); ctx.stroke();
        if(i>0) ctx.fillText(i, 220, ty-2);
    }

    // Draw U-Tube Glass
    ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 4; ctx.beginPath();
    ctx.moveTo(150, 50); ctx.lineTo(150, 280); ctx.arc(225, 280, 75, Math.PI, 0, true); ctx.lineTo(300, 50); ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(180, 50); ctx.lineTo(180, 280); ctx.arc(225, 280, 45, Math.PI, 0, true); ctx.lineTo(270, 50); ctx.stroke();

    // Fill Fluids
    if (st13State.volA > 0) {
        ctx.fillStyle = 'rgba(56, 189, 248, 0.6)'; // Water
        ctx.fillRect(152, leftFluidTop, 26, boundaryY - leftFluidTop); // Left arm
        ctx.beginPath(); ctx.arc(225, 280, 73, Math.PI, 0, true); ctx.lineTo(270, 280); ctx.arc(225, 280, 47, 0, Math.PI, false); ctx.fill(); // Bottom curve
        ctx.fillRect(272, 280, 26, boundaryY - 280); // Right arm up to boundary
    }

    if (st13State.volB > 0) {
        ctx.fillStyle = 'rgba(250, 204, 21, 0.7)'; // Oil (Yellow)
        ctx.fillRect(272, rightFluidTop, 26, boundaryY - rightFluidTop); // Right arm above water
    }

    // Line of balance
    if (st13State.volA > 0 && st13State.volB > 0) {
        ctx.strokeStyle = '#ef4444'; ctx.setLineDash([4,4]);
        ctx.beginPath(); ctx.moveTo(130, boundaryY); ctx.lineTo(320, boundaryY); ctx.stroke(); ctx.setLineDash([]);
        ctx.fillStyle = '#ef4444'; ctx.fillText("Equilibrium Boundary", 330, boundaryY+4);
    }

    st13State.animId = requestAnimationFrame(st13Loop);
}

/**
 * ==========================================================================
 * STATION 14: SPECIFIC HEAT CAPACITY OF WATER (ELEC CALORIMETRY)
 * ==========================================================================
 */
function renderStation14() {
    document.getElementById('simulation-render-target').innerHTML = `
        <div class="bench-card" style="width: 100%; max-width: 850px; display: flex; flex-wrap: wrap; gap: 20px; background: #0d1117; padding: 1.5rem; border-radius: 12px; border: 1px solid #30363d;">
            <div style="flex: 1; min-width: 250px; display: flex; flex-direction: column; gap: 15px;">
                <div style="background: #161b22; padding: 15px; border-radius: 8px; border: 2px solid #30363d; text-align: center;">
                    <div style="color:#8b949e; font-size:0.8rem; font-family:'Orbitron';">THERMOMETER (°C)</div>
                    <div class="lcd-screen" id="st14-temp" style="font-size:2.5rem; color:#ef4444; background:#000; padding:5px; border-radius:6px; font-weight:bold;">25.0</div>
                </div>
                <div style="background: #161b22; padding: 15px; border-radius: 8px; border: 2px solid #30363d; text-align: center;">
                    <div style="color:#8b949e; font-size:0.8rem; font-family:'Orbitron';">STOPWATCH (s)</div>
                    <div class="lcd-screen" id="st14-time" style="font-size:2.5rem; color:#38bdf8; background:#000; padding:5px; border-radius:6px; font-weight:bold;">0.0</div>
                </div>
                <div style="background: #1e293b; padding: 15px; border-radius: 8px; border: 1px solid #334155;">
                    <button id="btn-st14" onclick="st14Toggle()" style="width:100%; background:var(--emerald); color:white; border:none; padding:12px; border-radius:6px; font-weight:bold; cursor:pointer;"><i class="fas fa-power-off"></i> Power Heater (50W)</button>
                    <button onclick="st14Reset()" style="width:100%; margin-top:10px; background:#ef4444; color:white; border:none; padding:12px; border-radius:6px; font-weight:bold; cursor:pointer;"><i class="fas fa-undo"></i> Reset System</button>
                </div>
            </div>
            <div style="flex: 2; min-width: 300px; background: #fff; border-radius: 8px; padding: 10px; display: flex; justify-content: center; position: relative; border: 2px solid #0f172a;">
                <canvas id="canvas-st14" width="450" height="350"></canvas>
            </div>
        </div>
    `;
    st14Reset();
}
function st14Reset() { st14State.isOn = false; st14State.time = 0; st14State.temp = 25.0; document.getElementById('btn-st14').style.background = 'var(--emerald)'; if(st14State.animId) cancelAnimationFrame(st14State.animId); st14Loop(); }
function st14Toggle() {
    st14State.isOn = !st14State.isOn;
    if(st14State.isOn) { st14State.lastTick = performance.now(); document.getElementById('btn-st14').style.background = '#f59e0b'; }
    else document.getElementById('btn-st14').style.background = 'var(--emerald)';
}
function st14Loop() {
    const canvas = document.getElementById('canvas-st14'); if(!canvas) return;
    const ctx = canvas.getContext('2d'); ctx.clearRect(0,0, canvas.width, canvas.height);

    if(st14State.isOn) {
        const now = performance.now(); let dt = (now - st14State.lastTick)/1000;
        let simDt = dt * 10; // Speed up time 10x
        st14State.time += simDt; st14State.lastTick = now;
        
        // E = Pt = mc(dT) -> dT = (Pt)/(mc). c for water = 4.2 J/gC
        let energy = st14State.power * simDt;
        st14State.temp += energy / (st14State.mass * 4.2);
    }
    
    document.getElementById('st14-temp').innerText = st14State.temp.toFixed(1);
    document.getElementById('st14-time').innerText = st14State.time.toFixed(1);

    const cx = 225;
    // Calorimeter
    ctx.fillStyle = '#b45309'; ctx.fillRect(cx-70, 150, 140, 180);
    ctx.fillStyle = 'rgba(56,189,248,0.5)'; ctx.fillRect(cx-65, 180, 130, 140);
    
    // Heater Coil
    ctx.strokeStyle = st14State.isOn ? '#ef4444' : '#64748b'; ctx.lineWidth = 5;
    ctx.beginPath(); ctx.moveTo(cx-20, 50); ctx.lineTo(cx-20, 280); 
    ctx.lineTo(cx-40, 290); ctx.lineTo(cx, 300); ctx.lineTo(cx-40, 310); ctx.lineTo(cx, 320); ctx.stroke(); // coils
    
    // Thermometer
    ctx.fillStyle = '#fff'; ctx.fillRect(cx+30, 50, 10, 240);
    ctx.fillStyle = '#ef4444'; ctx.fillRect(cx+33, 270 - (st14State.temp*1.5), 4, (st14State.temp*1.5));
    ctx.beginPath(); ctx.arc(cx+35, 280, 8, 0, Math.PI*2); ctx.fill();

    st14State.animId = requestAnimationFrame(st14Loop);
}

/**
 * ==========================================================================
 * STATION 16: FIRST LAW OF THERMODYNAMICS (BALLOON)
 * ==========================================================================
 */
function renderStation16() {
    document.getElementById('simulation-render-target').innerHTML = `
        <div class="bench-card" style="width:100%; max-width:850px; display:flex; flex-wrap:wrap; gap:20px; background:#0d1117; padding:1.5rem; border-radius:12px; border:1px solid #30363d;">
            <div style="flex:1; min-width:250px; display:flex; flex-direction:column; gap:15px;">
                <div style="background:#1e293b; padding:15px; border-radius:8px; border:1px solid #334155;">
                    <button onclick="st16Move('air')" style="width:100%; margin-bottom:8px; background:#475569; color:#fff; border:none; padding:12px; border-radius:6px; font-weight:bold; cursor:pointer;">Rest on Bench (Room Temp)</button>
                    <button onclick="st16Move('cold')" style="width:100%; margin-bottom:8px; background:#38bdf8; color:#fff; border:none; padding:12px; border-radius:6px; font-weight:bold; cursor:pointer;"><i class="fas fa-snowflake"></i> Submerge in Ice Water</button>
                    <button onclick="st16Move('hot')" style="width:100%; background:#ef4444; color:#fff; border:none; padding:12px; border-radius:6px; font-weight:bold; cursor:pointer;"><i class="fas fa-fire"></i> Submerge in Hot Water</button>
                </div>
                <div style="color:#cbd5e1; font-size:0.85rem; text-align:center; padding:10px;">Observe the balloon's volume change due to thermal expansion/contraction of air inside the bottle.</div>
            </div>
            <div style="flex:2; min-width:300px; background:#fff; border-radius:8px; padding:10px; display:flex; justify-content:center; border:2px solid #0f172a; overflow:hidden;">
                <canvas id="canvas-st16" width="450" height="350"></canvas>
            </div>
        </div>
    `;
    st16Move('air');
}
function st16Move(loc) { 
    st16State.location = loc; 
    if(loc==='air') st16State.targetSize = 30;
    else if(loc==='cold') st16State.targetSize = 10; // Deflates
    else if(loc==='hot') st16State.targetSize = 65; // Expands heavily
    if(st16State.animId) cancelAnimationFrame(st16State.animId); st16Loop(); 
}
function st16Loop() {
    const canvas = document.getElementById('canvas-st16'); if(!canvas) return;
    const ctx = canvas.getContext('2d'); ctx.clearRect(0,0, canvas.width, canvas.height);

    // Smooth physics transition for balloon size
    st16State.currentSize += (st16State.targetSize - st16State.currentSize) * 0.05;

    // Draw Baths
    ctx.fillStyle = 'rgba(56, 189, 248, 0.2)'; ctx.fillRect(30, 200, 130, 130); ctx.fillStyle='#0f172a'; ctx.fillText("ICE WATER", 60, 345);
    ctx.fillStyle = 'rgba(239, 68, 68, 0.2)'; ctx.fillRect(290, 200, 130, 130); ctx.fillStyle='#0f172a'; ctx.fillText("HOT WATER", 320, 345);
    
    // Determine Bottle Position
    let bx = 225; let by = 220; // Center (Air)
    if(st16State.location === 'cold') { bx = 95; by = 240; }
    else if(st16State.location === 'hot') { bx = 355; by = 240; }

    // Draw Bottle
    ctx.strokeStyle = '#64748b'; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(bx-25, by); ctx.lineTo(bx-25, by+80); ctx.lineTo(bx+25, by+80); ctx.lineTo(bx+25, by); 
    ctx.lineTo(bx+10, by-30); ctx.lineTo(bx-10, by-30); ctx.closePath(); ctx.stroke();

    // Draw Balloon (Dynamic Arc)
    ctx.fillStyle = 'rgba(244, 63, 94, 0.8)'; // Pinkish red balloon
    ctx.beginPath(); 
    ctx.moveTo(bx-12, by-30); 
    // Bezier curves expand outward based on currentSize
    ctx.bezierCurveTo(bx-st16State.currentSize, by-30-st16State.currentSize, bx+st16State.currentSize, by-30-st16State.currentSize, bx+12, by-30);
    ctx.fill();

    st16State.animId = requestAnimationFrame(st16Loop);
}

/**
 * ==========================================================================
 * STATION 17: ELECTRICAL BLACK BOXES
 * ==========================================================================
 */
function renderStation17() {
    document.getElementById('simulation-render-target').innerHTML = `
        <div class="bench-card" style="width:100%; max-width:850px; display:flex; flex-wrap:wrap; gap:20px; background:#0d1117; padding:1.5rem; border-radius:12px; border:1px solid #30363d;">
            <div style="flex:1; min-width:250px; display:flex; flex-direction:column; gap:15px;">
                <div style="background:#161b22; padding:15px; border-radius:8px; border:2px solid #30363d; text-align:center;">
                    <div style="color:#8b949e; font-size:0.8rem; font-family:'Orbitron';">MILLIAMMETER (mA)</div>
                    <div class="lcd-screen" id="st17-lcd" style="font-size:3rem; color:#facc15; background:#000; padding:10px; border-radius:6px; font-weight:bold;">0.00</div>
                </div>
                <div style="background:#1e293b; padding:15px; border-radius:8px; border:1px solid #334155;">
                    <button onclick="st17Connect('A')" style="width:100%; margin-bottom:8px; background:#475569; color:#fff; border:none; padding:12px; border-radius:6px; font-weight:bold; cursor:pointer;">Connect Box A</button>
                    <button onclick="st17Connect('B')" style="width:100%; margin-bottom:8px; background:#475569; color:#fff; border:none; padding:12px; border-radius:6px; font-weight:bold; cursor:pointer;">Connect Box B</button>
                    <button onclick="st17Connect('none')" style="width:100%; background:#ef4444; color:#fff; border:none; padding:12px; border-radius:6px; font-weight:bold; cursor:pointer;">Disconnect Circuit</button>
                </div>
            </div>
            <div style="flex:2; min-width:300px; background:#fff; border-radius:8px; padding:10px; display:flex; justify-content:center; border:2px solid #0f172a; overflow:hidden;">
                <canvas id="canvas-st17" width="450" height="350"></canvas>
            </div>
        </div>
    `;
    st17Connect('none');
}
function st17Connect(box) {
    st17State.activeBox = box;
    // Box A is Series (High R -> Low I). Let R = 100 ohms each. Series = 200 ohms. I = 3V/200 = 0.015 A = 15 mA.
    // Box B is Parallel (Low R -> High I). Parallel = 50 ohms. I = 3V/50 = 0.060 A = 60 mA.
    if(box === 'A') st17State.current = 15.0; 
    else if(box === 'B') st17State.current = 60.0;
    else st17State.current = 0.0;
    
    if(st17State.animId) cancelAnimationFrame(st17State.animId); st17Loop();
}
function st17Loop() {
    const canvas = document.getElementById('canvas-st17'); if(!canvas) return;
    const ctx = canvas.getContext('2d'); ctx.clearRect(0,0, canvas.width, canvas.height);

    let displayCurrent = st17State.current + (st17State.current > 0 ? Math.random()*0.4 - 0.2 : 0);
    document.getElementById('st17-lcd').innerText = displayCurrent.toFixed(2);

    // Circuit Board Layout
    ctx.strokeStyle = '#0f172a'; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(100, 250); ctx.lineTo(100, 100); ctx.lineTo(350, 100); ctx.lineTo(350, 250); ctx.stroke(); // Main wires
    
    // Battery
    ctx.fillStyle = '#facc15'; ctx.fillRect(70, 200, 60, 20); ctx.fillStyle='#000'; ctx.font='12px Arial'; ctx.fillText('3.0 V', 85, 215);
    
    // Ammeter node
    ctx.fillStyle = '#1e293b'; ctx.beginPath(); ctx.arc(225, 100, 20, 0, Math.PI*2); ctx.fill(); ctx.fillStyle='#fff'; ctx.fillText('mA', 215, 105);

    // Box Nodes (Terminals)
    ctx.fillStyle = '#ef4444'; ctx.beginPath(); ctx.arc(100, 250, 6, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = '#000'; ctx.beginPath(); ctx.arc(350, 250, 6, 0, Math.PI*2); ctx.fill();

    // Draw active box connected
    if(st17State.activeBox !== 'none') {
        ctx.strokeStyle = '#3b82f6'; ctx.beginPath(); ctx.moveTo(100, 250); ctx.lineTo(150, 280); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(350, 250); ctx.lineTo(300, 280); ctx.stroke();
        
        ctx.fillStyle = '#0f172a'; ctx.fillRect(150, 260, 150, 60);
        ctx.fillStyle = '#fff'; ctx.font='bold 20px Poppins'; ctx.fillText("BOX " + st17State.activeBox, 195, 295);
        
        // Electron flow animation
        ctx.fillStyle = '#ef4444';
        let speed = st17State.current / 10;
        let pos = (performance.now() * speed) % 250;
        ctx.beginPath(); ctx.arc(100 + pos, 100, 4, 0, Math.PI*2); ctx.fill();
    }

    st17State.animId = requestAnimationFrame(st17Loop);
}

/**
 * ==========================================================================
 * STATION 18: DETERMINING THE DENSITY OF SAND
 * ==========================================================================
 */
function renderStation18() {
    document.getElementById('simulation-render-target').innerHTML = `
        <div class="bench-card" style="width:100%; max-width:850px; display:flex; flex-wrap:wrap; gap:20px; background:#0d1117; padding:1.5rem; border-radius:12px; border:1px solid #30363d;">
            <div style="flex:1; min-width:250px; display:flex; flex-direction:column; gap:15px;">
                <div style="background:#161b22; padding:15px; border-radius:8px; border:2px solid #30363d; text-align:center;">
                    <div style="color:#8b949e; font-size:0.8rem; margin-bottom:5px; font-family:'Orbitron';">TOP PAN BALANCE</div>
                    <div class="lcd-screen" id="st18-lcd" style="font-size:2.5rem; color:#ef4444; background:#000; padding:10px; border-radius:6px; font-weight:bold;">0.00 g</div>
                </div>
                <div style="background:#1e293b; padding:15px; border-radius:8px; border:1px solid #334155;">
                    <button onclick="st18Action('measure')" style="width:100%; margin-bottom:8px; background:#3b82f6; color:#fff; border:none; padding:12px; border-radius:6px; font-weight:bold; cursor:pointer;"><i class="fas fa-ruler"></i> Measure Empty Cylinder</button>
                    <button onclick="st18Action('fill')" style="width:100%; margin-bottom:8px; background:#facc15; color:#000; border:none; padding:12px; border-radius:6px; font-weight:bold; cursor:pointer;"><i class="fas fa-fill"></i> Fill Cylinder with Sand</button>
                    <button onclick="st18Action('weigh')" style="width:100%; margin-bottom:8px; background:#475569; color:#fff; border:none; padding:12px; border-radius:6px; font-weight:bold; cursor:pointer;"><i class="fas fa-weight"></i> Weigh Full Cylinder</button>
                    <button onclick="st18Action('idle')" style="width:100%; background:#ef4444; color:#fff; border:none; padding:12px; border-radius:6px; font-weight:bold; cursor:pointer;"><i class="fas fa-undo"></i> Reset Setup</button>
                </div>
            </div>
            <div style="flex:2; min-width:300px; background:#fff; border-radius:8px; padding:10px; display:flex; justify-content:center; border:2px solid #0f172a; overflow:hidden;">
                <canvas id="canvas-st18" width="450" height="350"></canvas>
            </div>
        </div>
    `;
    st18Action('idle');
}
function st18Action(act) {
    st18State.phase = act;
    let cardMass = 5.2; // Mass of empty cardboard cylinder
    if(act === 'weigh') st18State.scaleVal = cardMass + st18State.sandMass;
    else if(act === 'measure') st18State.scaleVal = cardMass;
    else st18State.scaleVal = 0.0;
    
    document.getElementById('st18-lcd').innerText = (st18State.scaleVal + (st18State.scaleVal > 0 ? (Math.random()*0.04-0.02) : 0)).toFixed(2) + " g";
    if(st18State.animId) cancelAnimationFrame(st18State.animId); st18Loop();
}
function st18Loop() {
    const canvas = document.getElementById('canvas-st18'); if(!canvas) return;
    const ctx = canvas.getContext('2d'); ctx.clearRect(0,0, canvas.width, canvas.height);

    // Draw Balance
    ctx.fillStyle = '#cbd5e1'; ctx.fillRect(250, 280, 140, 40);
    ctx.fillStyle = '#1e293b'; ctx.fillRect(270, 270, 100, 10);
    
    // Draw Tray & Sand Pile
    ctx.fillStyle = '#94a3b8'; ctx.fillRect(30, 300, 150, 15); // Tray
    ctx.fillStyle = '#d97706'; ctx.beginPath(); ctx.moveTo(50, 300); ctx.quadraticCurveTo(105, 230, 160, 300); ctx.fill(); // Sand pile

    // Draw Cardboard Cylinder
    let cx = st18State.phase === 'weigh' ? 320 : 105;
    let cy = st18State.phase === 'weigh' ? 270 : 150;
    
    // Cylinder body
    ctx.fillStyle = '#fcd34d'; ctx.fillRect(cx - 30, cy - 100, 60, 100);
    ctx.strokeStyle = '#b45309'; ctx.lineWidth = 2; ctx.strokeRect(cx - 30, cy - 100, 60, 100);
    // Cylinder top/bottom ellipses
    ctx.beginPath(); ctx.ellipse(cx, cy - 100, 30, 8, 0, 0, Math.PI*2); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.ellipse(cx, cy, 30, 8, 0, 0, Math.PI*2); ctx.fill(); ctx.stroke();

    if(st18State.phase === 'fill' || st18State.phase === 'weigh') {
        // Draw Sand inside
        ctx.fillStyle = '#b45309';
        ctx.fillRect(cx - 28, cy - 90, 56, 90);
        ctx.beginPath(); ctx.ellipse(cx, cy - 90, 28, 6, 0, 0, Math.PI*2); ctx.fill();
    }

    if(st18State.phase === 'measure') {
        // Vernier Caliper measuring diameter
        ctx.fillStyle = '#64748b'; 
        ctx.fillRect(cx - 80, cy - 50, 200, 15); // Ruler
        ctx.fillRect(cx - 30, cy - 50, 5, 40); // Left Jaw
        ctx.fillRect(cx + 25, cy - 50, 5, 40); // Right Jaw
        
        ctx.fillStyle = '#0f172a'; ctx.font = 'bold 12px Arial';
        ctx.fillText(`h = ${st18State.cylH} cm`, cx + 50, cy - 80);
        ctx.fillText(`d = ${st18State.cylD} cm`, cx - 80, cy - 60);
    }

    st18State.animId = requestAnimationFrame(st18Loop);
}

/**
 * ==========================================================================
 * STATION 19: MEASURING RESISTANCE WITH AN OHMMETER
 * ==========================================================================
 */
function renderStation19() {
    document.getElementById('simulation-render-target').innerHTML = `
        <div class="bench-card" style="width:100%; max-width:850px; display:flex; flex-wrap:wrap; gap:20px; background:#0d1117; padding:1.5rem; border-radius:12px; border:1px solid #30363d;">
            <div style="flex:1; min-width:250px; display:flex; flex-direction:column; gap:15px;">
                <div style="background:#161b22; padding:15px; border-radius:8px; border:2px solid #30363d; text-align:center;">
                    <div style="color:#8b949e; font-size:0.8rem; margin-bottom:5px; font-family:'Orbitron';">MULTIMETER (OHMS Ω)</div>
                    <div class="lcd-screen" id="st19-lcd" style="font-size:2.5rem; color:#10b981; background:#000; padding:10px; border-radius:6px; font-weight:bold;">1. . .</div>
                </div>
                <div style="background:#1e293b; padding:15px; border-radius:8px; border:1px solid #334155; display:grid; grid-template-columns:1fr 1fr; gap:8px;">
                    <button onclick="st19Connect('A')" style="background:#475569; color:#fff; border:none; padding:10px; border-radius:6px; font-weight:bold; cursor:pointer;">Resistor A</button>
                    <button onclick="st19Connect('B')" style="background:#475569; color:#fff; border:none; padding:10px; border-radius:6px; font-weight:bold; cursor:pointer;">Resistor B</button>
                    <button onclick="st19Connect('C')" style="background:#475569; color:#fff; border:none; padding:10px; border-radius:6px; font-weight:bold; cursor:pointer;">Resistor C</button>
                    <button onclick="st19Connect('D')" style="background:#475569; color:#fff; border:none; padding:10px; border-radius:6px; font-weight:bold; cursor:pointer;">Resistor D</button>
                    <button onclick="st19Connect('E')" style="grid-column: span 2; background:#475569; color:#fff; border:none; padding:10px; border-radius:6px; font-weight:bold; cursor:pointer;">Resistor E</button>
                </div>
                <button onclick="st19Connect('none')" style="width:100%; background:#ef4444; color:#fff; border:none; padding:12px; border-radius:6px; font-weight:bold; cursor:pointer;"><i class="fas fa-plug"></i> Disconnect Probes</button>
            </div>
            <div style="flex:2; min-width:300px; background:#fff; border-radius:8px; padding:10px; display:flex; justify-content:center; border:2px solid #0f172a; overflow:hidden;">
                <canvas id="canvas-st19" width="450" height="350"></canvas>
            </div>
        </div>
    `;
    st19Connect('none');
}
function st19Connect(res) {
    st19State.activeResistor = res;
    // Map Resistors to Ohms (with slight manufacturing tolerance noise)
    const resMap = { 'A': 10.2, 'B': 46.8, 'C': 328.5, 'D': 995.0, 'E': 4680.0 };
    if(res === 'none') {
        st19State.reading = "1. . ."; // Open circuit symbol on DMM
    } else {
        let noise = (Math.random() * 2) - 1.0;
        st19State.reading = (resMap[res] + noise).toFixed(1);
    }
    if(st19State.animId) cancelAnimationFrame(st19State.animId); st19Loop();
}
function st19Loop() {
    const canvas = document.getElementById('canvas-st19'); if(!canvas) return;
    const ctx = canvas.getContext('2d'); ctx.clearRect(0,0, canvas.width, canvas.height);

    let displayVal = st19State.reading;
    if(st19State.activeResistor !== 'none') {
        let noise = (Math.random() * 0.4) - 0.2;
        displayVal = (parseFloat(st19State.reading) + noise).toFixed(1);
    }
    document.getElementById('st19-lcd').innerText = displayVal;

    // Draw Multimeter Body
    ctx.fillStyle = '#facc15'; ctx.fillRect(175, 40, 100, 150); // Yellow casing
    ctx.fillStyle = '#1e293b'; ctx.fillRect(210, 110, 30, 30); // Dial
    ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(225, 125, 5, 0, Math.PI*2); ctx.fill();

    // Draw Probes
    ctx.strokeStyle = '#ef4444'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(200, 190); ctx.lineTo(150, 250); ctx.stroke();
    ctx.strokeStyle = '#000'; ctx.beginPath(); ctx.moveTo(250, 190); ctx.lineTo(300, 250); ctx.stroke();
    
    // Probe Tips
    ctx.fillStyle = '#ef4444'; ctx.fillRect(145, 250, 10, 40); ctx.fillStyle = '#94a3b8'; ctx.fillRect(148, 290, 4, 15);
    ctx.fillStyle = '#000'; ctx.fillRect(295, 250, 10, 40); ctx.fillStyle = '#94a3b8'; ctx.fillRect(298, 290, 4, 15);

    // Draw Resistor if connected
    if(st19State.activeResistor !== 'none') {
        // Resistor body
        ctx.fillStyle = '#d97706'; ctx.fillRect(195, 285, 60, 25);
        ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(152, 297); ctx.lineTo(195, 297); ctx.stroke(); // Left wire
        ctx.beginPath(); ctx.moveTo(255, 297); ctx.lineTo(300, 297); ctx.stroke(); // Right wire
        
        // Color Bands
        ctx.fillStyle = '#ef4444'; ctx.fillRect(205, 285, 5, 25);
        ctx.fillStyle = '#3b82f6'; ctx.fillRect(220, 285, 5, 25);
        ctx.fillStyle = '#facc15'; ctx.fillRect(235, 285, 5, 25);
        ctx.fillStyle = '#d4d4d8'; ctx.fillRect(245, 285, 5, 25); // Silver tolerance

        ctx.fillStyle = '#0f172a'; ctx.font = 'bold 16px Arial'; ctx.textAlign = 'center';
        ctx.fillText(`Resistor ${st19State.activeResistor}`, 225, 330);
    }

    st19State.animId = requestAnimationFrame(st19Loop);
}

/**
 * ==========================================================================
 * STATION 21: CONSTRUCTING AND CHARGING A CAPACITOR
 * ==========================================================================
 */
function renderStation21() {
    document.getElementById('simulation-render-target').innerHTML = `
        <div class="bench-card" style="width:100%; max-width:850px; display:flex; flex-wrap:wrap; gap:20px; background:#0d1117; padding:1.5rem; border-radius:12px; border:1px solid #30363d;">
            <div style="flex:1; min-width:250px; display:flex; flex-direction:column; gap:15px;">
                <div style="background:#161b22; padding:15px; border-radius:8px; border:2px solid #30363d; text-align:center;">
                    <div style="color:#8b949e; font-size:0.8rem; font-family:'Orbitron';">VOLTMETER (V)</div>
                    <div class="lcd-screen" id="st21-v" style="font-size:2.5rem; color:#38bdf8; background:#000; padding:10px; border-radius:6px; font-weight:bold;">0.00</div>
                    <div style="color:#8b949e; font-size:0.75rem; margin-top:10px;">TIMER: <span id="st21-t" style="color:#facc15;">0:00 mins</span></div>
                </div>
                <div style="background:#1e293b; padding:15px; border-radius:8px; border:1px solid #334155;">
                    <button onclick="st21Action('charge')" style="width:100%; margin-bottom:10px; background:#facc15; color:#000; border:none; padding:12px; border-radius:6px; font-weight:bold; cursor:pointer;"><i class="fas fa-battery-full"></i> Connect Battery (Charge)</button>
                    <button onclick="st21Action('discharge')" style="width:100%; background:var(--emerald); color:#fff; border:none; padding:12px; border-radius:6px; font-weight:bold; cursor:pointer;"><i class="fas fa-plug"></i> Connect Voltmeter (Read)</button>
                </div>
            </div>
            <div style="flex:2; min-width:300px; background:#fff; border-radius:8px; padding:10px; display:flex; justify-content:center; border:2px solid #0f172a; overflow:hidden;">
                <canvas id="canvas-st21" width="450" height="350"></canvas>
            </div>
        </div>
    `;
    st21Action('idle');
}
function st21Action(act) {
    st21State.phase = act; st21State.lastTick = performance.now();
    if(act === 'charge') { st21State.voltage = 3.0; st21State.time = 0; }
    if(st21State.animId) cancelAnimationFrame(st21State.animId); st21Loop();
}
function st21Loop() {
    const canvas = document.getElementById('canvas-st21'); if(!canvas) return;
    const ctx = canvas.getContext('2d'); ctx.clearRect(0,0, canvas.width, canvas.height);

    if(st21State.phase === 'charge') {
        const now = performance.now(); let dt = (now - st21State.lastTick)/1000;
        st21State.time += (dt * 10); // Simulation speed
        st21State.lastTick = now;
        if(st21State.time > 180) st21State.time = 180; // Max 3 mins
    } else if (st21State.phase === 'discharge') {
        const now = performance.now(); let dt = (now - st21State.lastTick)/1000;
        st21State.lastTick = now;
        // Dielectric leakage through cardboard
        st21State.voltage -= (dt * 0.05); 
        if(st21State.voltage < 0) st21State.voltage = 0;
    }

    let min = Math.floor(st21State.time / 60); let sec = Math.floor(st21State.time % 60);
    document.getElementById('st21-t').innerText = `${min}:${sec < 10 ? '0' : ''}${sec} mins`;
    document.getElementById('st21-v').innerText = (st21State.phase==='discharge' ? st21State.voltage.toFixed(2) : "---");

    // Draw Cardboard / Foil setup
    ctx.fillStyle = '#b45309'; ctx.fillRect(150, 80, 150, 200); // Back board
    ctx.fillStyle = 'rgba(226, 232, 240, 0.9)'; ctx.fillRect(160, 90, 130, 180); // Foil 1
    
    ctx.fillStyle = 'rgba(180, 83, 9, 0.8)'; ctx.fillRect(140, 70, 150, 200); // Front board offset
    ctx.fillStyle = 'rgba(203, 213, 225, 0.9)'; ctx.fillRect(150, 80, 130, 180); // Foil 2

    // Connections
    if (st21State.phase === 'charge') {
        // Battery
        ctx.fillStyle = '#facc15'; ctx.fillRect(350, 150, 40, 60); ctx.fillStyle='#000'; ctx.fillText('3V', 360, 185);
        ctx.strokeStyle = '#ef4444'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(350, 165); ctx.lineTo(280, 165); ctx.stroke(); // Front foil
        ctx.strokeStyle = '#000'; ctx.beginPath(); ctx.moveTo(350, 195); ctx.lineTo(310, 195); ctx.stroke(); // Back foil
        
        // Show charge building up
        let chargeAlpha = st21State.time / 180;
        ctx.fillStyle = `rgba(239, 68, 68, ${chargeAlpha})`; ctx.fillText('+++++', 180, 120);
        ctx.fillStyle = `rgba(56, 189, 248, ${chargeAlpha})`; ctx.fillText('-----', 200, 120);

    } else if (st21State.phase === 'discharge') {
        // Voltmeter Probes
        ctx.strokeStyle = '#ef4444'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(50, 150); ctx.lineTo(150, 150); ctx.stroke(); 
        ctx.strokeStyle = '#000'; ctx.beginPath(); ctx.moveTo(50, 200); ctx.lineTo(160, 200); ctx.stroke(); 
        ctx.fillStyle = '#1e293b'; ctx.fillRect(10, 150, 40, 50); ctx.fillStyle='#fff'; ctx.fillText('V', 25, 180);
    }

    st21State.animId = requestAnimationFrame(st21Loop);
}

/**
 * ==========================================================================
 * STATION 22: BLACK BOXES (SERIES VS PARALLEL)
 * ==========================================================================
 */
function renderStation22() {
    document.getElementById('simulation-render-target').innerHTML = `
        <div class="bench-card" style="width:100%; max-width:850px; display:flex; flex-wrap:wrap; gap:20px; background:#0d1117; padding:1.5rem; border-radius:12px; border:1px solid #30363d;">
            <div style="flex:1; min-width:250px; display:flex; flex-direction:column; gap:15px;">
                <div style="background:#161b22; padding:15px; border-radius:8px; border:2px solid #30363d; text-align:center;">
                    <div style="color:#8b949e; font-size:0.8rem; font-family:'Orbitron';">MILLIAMMETER (mA)</div>
                    <div class="lcd-screen" id="st22-lcd" style="font-size:3rem; color:#facc15; background:#000; padding:10px; border-radius:6px; font-weight:bold;">0.00</div>
                </div>
                <div style="background:#1e293b; padding:15px; border-radius:8px; border:1px solid #334155;">
                    <button onclick="st22Connect('A')" style="width:100%; margin-bottom:8px; background:#475569; color:#fff; border:none; padding:12px; border-radius:6px; font-weight:bold; cursor:pointer;">Connect Box A</button>
                    <button onclick="st22Connect('B')" style="width:100%; margin-bottom:8px; background:#475569; color:#fff; border:none; padding:12px; border-radius:6px; font-weight:bold; cursor:pointer;">Connect Box B</button>
                    <button onclick="st22Connect('none')" style="width:100%; background:#ef4444; color:#fff; border:none; padding:12px; border-radius:6px; font-weight:bold; cursor:pointer;">Disconnect Circuit</button>
                </div>
            </div>
            <div style="flex:2; min-width:300px; background:#fff; border-radius:8px; padding:10px; display:flex; justify-content:center; border:2px solid #0f172a; overflow:hidden;">
                <canvas id="canvas-st22" width="450" height="350"></canvas>
            </div>
        </div>
    `;
    st22Connect('none');
}
function st22Connect(box) {
    st22State.activeBox = box;
    // Box A is Series (High R -> Low I). 100 ohms each. Series = 200 ohms. I = 3V/200 = 0.015 A = 15 mA.
    // Box B is Parallel (Low R -> High I). Parallel = 50 ohms. I = 3V/50 = 0.060 A = 60 mA.
    if(box === 'A') st22State.current = 15.0; 
    else if(box === 'B') st22State.current = 60.0;
    else st22State.current = 0.0;
    
    if(st22State.animId) cancelAnimationFrame(st22State.animId); st22Loop();
}
function st22Loop() {
    const canvas = document.getElementById('canvas-st22'); if(!canvas) return;
    const ctx = canvas.getContext('2d'); ctx.clearRect(0,0, canvas.width, canvas.height);

    let displayCurrent = st22State.current + (st22State.current > 0 ? Math.random()*0.4 - 0.2 : 0);
    document.getElementById('st22-lcd').innerText = displayCurrent.toFixed(2);

    // Circuit Board Layout
    ctx.strokeStyle = '#0f172a'; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(100, 250); ctx.lineTo(100, 100); ctx.lineTo(350, 100); ctx.lineTo(350, 250); ctx.stroke(); // Main wires
    
    // Battery
    ctx.fillStyle = '#facc15'; ctx.fillRect(70, 200, 60, 20); ctx.fillStyle='#000'; ctx.font='12px Arial'; ctx.fillText('3.0 V', 85, 215);
    
    // Ammeter node
    ctx.fillStyle = '#1e293b'; ctx.beginPath(); ctx.arc(225, 100, 20, 0, Math.PI*2); ctx.fill(); ctx.fillStyle='#fff'; ctx.fillText('mA', 215, 105);

    // Box Nodes (Terminals)
    ctx.fillStyle = '#ef4444'; ctx.beginPath(); ctx.arc(100, 250, 6, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = '#000'; ctx.beginPath(); ctx.arc(350, 250, 6, 0, Math.PI*2); ctx.fill();

    // Draw active box connected
    if(st22State.activeBox !== 'none') {
        ctx.strokeStyle = '#3b82f6'; ctx.beginPath(); ctx.moveTo(100, 250); ctx.lineTo(150, 280); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(350, 250); ctx.lineTo(300, 280); ctx.stroke();
        
        ctx.fillStyle = '#0f172a'; ctx.fillRect(150, 260, 150, 60);
        ctx.fillStyle = '#fff'; ctx.font='bold 20px Poppins'; ctx.fillText("BOX " + st22State.activeBox, 195, 295);
        
        // Electron flow animation
        ctx.fillStyle = '#ef4444';
        let speed = st22State.current / 10;
        let pos = (performance.now() * speed) % 250;
        ctx.beginPath(); ctx.arc(100 + pos, 100, 4, 0, Math.PI*2); ctx.fill();
    }

    st22State.animId = requestAnimationFrame(st22Loop);
}

/**
 * ==========================================================================
 * UPPER SIXTH STATION 1: SPEED OF SOUND IN TRAPPED AIR
 * ==========================================================================
 */
function renderStationV2_1() {
    document.getElementById('simulation-render-target').innerHTML = `
        <div class="bench-card" style="width: 100%; max-width: 850px; display: flex; flex-wrap: wrap; gap: 20px; background: #0d1117; padding: 1.5rem; border-radius: 12px; border: 1px solid #30363d;">
            <div style="flex: 1; min-width: 250px; display: flex; flex-direction: column; gap: 15px;">
                <div style="background: #161b22; padding: 20px; border-radius: 8px; border: 2px solid #30363d; text-align: center;">
                    <div style="color:#10b981; font-size:0.9rem; font-weight:bold; margin-bottom:10px;"><i class="fas fa-volume-up"></i> LIVE AUDIO ENABLED</div>
                    <button id="btn-strike-v2" onclick="stV2_1Strike()" style="width:100%; background:#f59e0b; color:#000; border:none; padding:15px; border-radius:8px; font-weight:bold; font-size:1.1rem; cursor:pointer; box-shadow:0 0 15px rgba(245, 158, 11, 0.4);"><i class="fas fa-bolt"></i> Strike Fork & Listen</button>
                </div>
                <div style="background: #1e293b; padding: 15px; border-radius: 8px; border: 1px solid #334155;">
                    <label style="color:#f8fafc; font-size:0.85rem; display:block; margin-bottom:8px;">Select Tuning Fork (f)</label>
                    <select id="sound-v2-f" onchange="stV2_1ChangeFork()" style="width:100%; padding:10px; background:#0f172a; color:#fff; border:1px solid #475569; border-radius:4px; margin-bottom:15px;">
                        <option value="256">256 Hz</option>
                        <option value="320">320 Hz</option>
                        <option value="426">426 Hz</option>
                        <option value="512">512 Hz</option>
                    </select>
                    <label style="color:#fff; font-size:0.85rem; display:block; margin-bottom:8px;">Drag Pipe Length (L): <span id="lbl-sound-v2-l" style="color:var(--sim-accent);">15.0 cm</span></label>
                    <input type="range" id="slider-sound-v2-l" min="5" max="50" value="15" step="0.1" style="width:100%; cursor:pointer;">
                </div>
            </div>
            <div style="flex: 1.5; min-width: 300px; background: #010409; border-radius: 8px; padding: 10px; display: flex; justify-content: center; position: relative; border: 2px solid #0f172a; overflow:hidden;">
                <canvas id="canvas-stV2-1" width="400" height="400" style="display:block;"></canvas>
            </div>
        </div>
    `;

    document.getElementById('slider-sound-v2-l').addEventListener('input', (e) => {
        stV2_1State.tubeL = parseFloat(e.target.value);
        document.getElementById('lbl-sound-v2-l').innerText = `${stV2_1State.tubeL.toFixed(1)} cm`;
        stV2_1UpdateVol();
    });

    stV2_1ChangeFork();
    stV2_1Loop();
}

function stV2_1ChangeFork() {
    stV2_1State.freq = parseInt(document.getElementById('sound-v2-f').value);
    if (stV2_1State.isRinging) { stV2_1Stop(); setTimeout(stV2_1Strike, 100); }
}

function stV2_1Strike() {
    if (stV2_1State.isRinging) return;
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    stV2_1State.audioCtx = new AudioContext();
    stV2_1State.oscillator = stV2_1State.audioCtx.createOscillator();
    stV2_1State.gainNode = stV2_1State.audioCtx.createGain();
    stV2_1State.oscillator.type = 'sine'; 
    stV2_1State.oscillator.frequency.value = stV2_1State.freq;
    stV2_1State.oscillator.connect(stV2_1State.gainNode);
    stV2_1State.gainNode.connect(stV2_1State.audioCtx.destination);
    stV2_1State.gainNode.gain.value = 0.05; 
    stV2_1State.oscillator.start();
    
    stV2_1State.isRinging = true;
    document.getElementById('btn-strike-v2').innerHTML = `<i class="fas fa-volume-mute"></i> Stop Sound`;
    document.getElementById('btn-strike-v2').style.background = '#ef4444';
    document.getElementById('btn-strike-v2').onclick = stV2_1Stop;
    stV2_1UpdateVol();
}

function stV2_1Stop() {
    if (stV2_1State.oscillator) { stV2_1State.oscillator.stop(); stV2_1State.audioCtx.close(); }
    stV2_1State.isRinging = false;
    document.getElementById('btn-strike-v2').innerHTML = `<i class="fas fa-bolt"></i> Strike Fork & Listen`;
    document.getElementById('btn-strike-v2').style.background = '#f59e0b';
    document.getElementById('btn-strike-v2').onclick = stV2_1Strike;
}

function stV2_1UpdateVol() {
    if (!stV2_1State.isRinging) return;
    let theoreticalResonanceL = (stV2_1State.v / (4 * stV2_1State.freq)) - stV2_1State.endCorrection;
    let diff = Math.abs(stV2_1State.tubeL - theoreticalResonanceL);
    let volumeSwell = 0.05 + 0.85 * Math.exp(-(diff * diff) / 2.0); 
    stV2_1State.gainNode.gain.setTargetAtTime(volumeSwell, stV2_1State.audioCtx.currentTime, 0.1);
}

function stV2_1Loop() {
    const canvas = document.getElementById('canvas-stV2-1'); if(!canvas) return;
    const ctx = canvas.getContext('2d'); ctx.clearRect(0,0, canvas.width, canvas.height);

    ctx.fillStyle = 'rgba(56, 189, 248, 0.4)'; ctx.fillRect(140, 180, 120, 210); // Water
    ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 4;
    ctx.beginPath(); ctx.moveTo(140, 80); ctx.lineTo(140, 390); ctx.lineTo(260, 390); ctx.lineTo(260, 80); ctx.stroke(); // Cylinder

    let tubeBottomY = 180 + (60 * 5) - (stV2_1State.tubeL * 5); 
    let tubeTopY = tubeBottomY - (60 * 5); // 60cm pipe, 5px per cm
    
    ctx.fillStyle = '#e2e8f0'; ctx.fillRect(175, tubeTopY, 50, 60 * 5);
    ctx.strokeStyle = '#64748b'; ctx.lineWidth = 2; ctx.strokeRect(175, tubeTopY, 50, 60 * 5);

    ctx.strokeStyle = '#fff'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(320, 180); ctx.lineTo(320, -70); ctx.stroke(); // Ruler
    ctx.fillStyle = '#fff'; ctx.font = '10px monospace';
    for(let i=0; i<=50; i+=5) {
        let ty = 180 - (i*5);
        ctx.beginPath(); ctx.moveTo(320, ty); ctx.lineTo(330, ty); ctx.stroke();
        ctx.fillText(i, 335, ty+3);
    }

    if (stV2_1State.isRinging) {
        let diff = Math.abs(stV2_1State.tubeL - ((stV2_1State.v / (4 * stV2_1State.freq)) - stV2_1State.endCorrection));
        let waveColor = diff < 2.0 ? 'rgba(239, 68, 68, ' : 'rgba(56, 189, 248, '; 
        let time = performance.now() / 1000;
        ctx.lineWidth = diff < 2.0 ? 4 : 1;
        
        for (let i = 0; i < 3; i++) {
            let radius = ((time * 50 + (i * 20)) % 60) + 10;
            let alpha = 1 - (radius / 70);
            ctx.strokeStyle = waveColor + alpha + ')';
            ctx.beginPath(); ctx.arc(200, tubeTopY - 20, radius, Math.PI, 0); ctx.stroke();
        }
        ctx.fillStyle = '#94a3b8'; ctx.fillRect(195, tubeTopY - 60, 10, 30);
        let forkVib = Math.sin(time * 50) * 2;
        ctx.beginPath(); ctx.moveTo(195, tubeTopY - 60); ctx.quadraticCurveTo(180+forkVib, tubeTopY-80, 180, tubeTopY-100); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(205, tubeTopY - 60); ctx.quadraticCurveTo(220-forkVib, tubeTopY-80, 220, tubeTopY-100); ctx.stroke();
    }
    stV2_1State.animId = requestAnimationFrame(stV2_1Loop);
}

/**
 * ==========================================================================
 * UPPER SIXTH STATION 2: GREY BOXES (SERIES VS PARALLEL RESISTORS)
 * ==========================================================================
 */
function renderStationV2_2() {
    document.getElementById('simulation-render-target').innerHTML = `
        <div class="bench-card" style="width:100%; max-width:850px; display:flex; flex-wrap:wrap; gap:20px; background:#0d1117; padding:1.5rem; border-radius:12px; border:1px solid #30363d;">
            <div style="flex:1; min-width:250px; display:flex; flex-direction:column; gap:15px;">
                <div style="background:#161b22; padding:15px; border-radius:8px; border:2px solid #30363d; text-align:center;">
                    <div style="color:#8b949e; font-size:0.8rem; font-family:'Orbitron';">MILLIAMMETER (mA)</div>
                    <div class="lcd-screen" id="stV2-2-lcd" style="font-size:3rem; color:#facc15; background:#000; padding:10px; border-radius:6px; font-weight:bold;">0.00</div>
                </div>
                <div style="background:#1e293b; padding:15px; border-radius:8px; border:1px solid #334155;">
                    <button onclick="stV2_2Connect('A')" style="width:100%; margin-bottom:8px; background:#64748b; color:#fff; border:none; padding:12px; border-radius:6px; font-weight:bold; cursor:pointer;">Connect Grey Box A</button>
                    <button onclick="stV2_2Connect('B')" style="width:100%; margin-bottom:8px; background:#64748b; color:#fff; border:none; padding:12px; border-radius:6px; font-weight:bold; cursor:pointer;">Connect Grey Box B</button>
                    <button onclick="stV2_2Connect('none')" style="width:100%; background:#ef4444; color:#fff; border:none; padding:12px; border-radius:6px; font-weight:bold; cursor:pointer;">Disconnect</button>
                </div>
            </div>
            <div style="flex:2; min-width:300px; background:#fff; border-radius:8px; padding:10px; display:flex; justify-content:center; border:2px solid #0f172a; overflow:hidden;">
                <canvas id="canvas-stV2-2" width="450" height="350"></canvas>
            </div>
        </div>
    `;
    stV2_2Connect('none');
}
function stV2_2Connect(box) {
    stV2_2State.activeBox = box;
    if(box === 'A') stV2_2State.current = 15.0; // Series (High R)
    else if(box === 'B') stV2_2State.current = 60.0; // Parallel (Low R)
    else stV2_2State.current = 0.0;
    if(stV2_2State.animId) cancelAnimationFrame(stV2_2State.animId); stV2_2Loop();
}
function stV2_2Loop() {
    const canvas = document.getElementById('canvas-stV2-2'); if(!canvas) return;
    const ctx = canvas.getContext('2d'); ctx.clearRect(0,0, canvas.width, canvas.height);

    let displayCurrent = stV2_2State.current + (stV2_2State.current > 0 ? Math.random()*0.4 - 0.2 : 0);
    document.getElementById('stV2-2-lcd').innerText = displayCurrent.toFixed(2);

    ctx.strokeStyle = '#0f172a'; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(100, 250); ctx.lineTo(100, 100); ctx.lineTo(350, 100); ctx.lineTo(350, 250); ctx.stroke(); // Wires
    
    ctx.fillStyle = '#facc15'; ctx.fillRect(70, 200, 60, 20); ctx.fillStyle='#000'; ctx.font='12px Arial'; ctx.fillText('3.0 V', 85, 215); // Battery
    ctx.fillStyle = '#1e293b'; ctx.beginPath(); ctx.arc(225, 100, 20, 0, Math.PI*2); ctx.fill(); ctx.fillStyle='#fff'; ctx.fillText('mA', 215, 105); // Ammeter

    ctx.fillStyle = '#ef4444'; ctx.beginPath(); ctx.arc(100, 250, 6, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = '#000'; ctx.beginPath(); ctx.arc(350, 250, 6, 0, Math.PI*2); ctx.fill(); // Terminals

    if(stV2_2State.activeBox !== 'none') {
        ctx.strokeStyle = '#3b82f6'; ctx.beginPath(); ctx.moveTo(100, 250); ctx.lineTo(150, 280); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(350, 250); ctx.lineTo(300, 280); ctx.stroke();
        
        ctx.fillStyle = '#94a3b8'; ctx.fillRect(150, 260, 150, 60); // GREY BOX
        ctx.strokeStyle = '#475569'; ctx.strokeRect(150, 260, 150, 60);
        ctx.fillStyle = '#0f172a'; ctx.font='bold 20px Poppins'; ctx.fillText("BOX " + stV2_2State.activeBox, 195, 295);
        
        ctx.fillStyle = '#ef4444'; let speed = stV2_2State.current / 10; let pos = (performance.now() * speed) % 250;
        ctx.beginPath(); ctx.arc(100 + pos, 100, 4, 0, Math.PI*2); ctx.fill(); // Electrons
    }
    stV2_2State.animId = requestAnimationFrame(stV2_2Loop);
}

/**
 * ==========================================================================
 * UPPER SIXTH STATION 3: UNCALIBRATED SPRING BALANCE
 * ==========================================================================
 */
function renderStationV2_3() {
    document.getElementById('simulation-render-target').innerHTML = `
        <div class="bench-card" style="width: 100%; max-width: 800px; display: flex; flex-wrap: wrap; gap: 20px; background: #0d1117; padding: 1.5rem; border-radius: 12px; border: 1px solid #30363d; box-sizing: border-box;">
            <div style="flex: 1; min-width: 250px; display: flex; flex-direction: column; gap: 15px;">
                <div style="background: #1e293b; padding: 15px; border-radius: 8px; border: 1px solid #334155;">
                    <label style="color:#fff; font-size:0.9rem; font-weight:bold; display:block; margin-bottom:12px; text-align:center;">Load Plastic Cup</label>
                    <button onclick="stV2_3Load('none')" style="width:100%; margin-bottom:8px; background:#475569; color:#fff; border:none; padding:12px; border-radius:6px; font-weight:bold; cursor:pointer;">Empty Cup</button>
                    <button onclick="stV2_3Load('50')" style="width:100%; margin-bottom:8px; background:#3b82f6; color:#fff; border:none; padding:12px; border-radius:6px; font-weight:bold; cursor:pointer;">Add 50g Standard Mass</button>
                    <button onclick="stV2_3Load('100')" style="width:100%; margin-bottom:8px; background:#f59e0b; color:#000; border:none; padding:12px; border-radius:6px; font-weight:bold; cursor:pointer;">Add 100g Standard Mass</button>
                    <button onclick="stV2_3Load('unknown')" style="width:100%; background:#ef4444; color:#fff; border:none; padding:12px; border-radius:6px; font-weight:bold; cursor:pointer;">Add Unknown Stone (m2)</button>
                </div>
            </div>
            <div style="flex: 2; min-width: 300px; background: #fff; border-radius: 8px; padding: 10px; display: flex; justify-content: center; position: relative; border: 2px solid #0f172a; overflow:hidden;">
                <canvas id="canvas-stV2-3" width="450" height="420" style="display:block;"></canvas>
            </div>
        </div>
    `;
    stV2_3Load('none');
}
function stV2_3Load(massType) {
    stV2_3State.load = massType;
    if(stV2_3State.animId) cancelAnimationFrame(stV2_3State.animId); stV2_3Loop();
}
function stV2_3Loop() {
    const canvas = document.getElementById('canvas-stV2-3'); if(!canvas) return;
    const ctx = canvas.getContext('2d'); ctx.clearRect(0,0, canvas.width, canvas.height);

    let appliedMass = 0;
    if(stV2_3State.load === '50') appliedMass = 50;
    else if(stV2_3State.load === '100') appliedMass = 100;
    else if(stV2_3State.load === 'unknown') appliedMass = stV2_3State.trueUnknown;

    // Smooth spring physics
    let targetExt = (appliedMass * 1.5); // pixels
    stV2_3State.animY += (targetExt - stV2_3State.animY) * 0.1;

    let startY = 40; let endY = 140 + stV2_3State.animY;

    // Stand
    ctx.fillStyle = '#475569'; ctx.fillRect(60, 15, 14, 380); ctx.fillRect(30, 395, 160, 15); ctx.fillStyle = '#334155'; ctx.fillRect(68, 35, 120, 12);

    // Spring
    ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 4; ctx.lineJoin = "round"; ctx.beginPath(); ctx.moveTo(160, startY);
    let loops = 20; let stepY = (endY - startY) / loops;
    for (let i = 0; i <= loops; i++) {
        let loopOffset = (i === 0 || i === loops) ? 0 : (i % 2 === 0 ? 16 : -16);
        ctx.lineTo(160 + loopOffset, startY + (i * stepY));
    }
    ctx.stroke();

    // Broomstick pointer
    ctx.strokeStyle = '#b45309'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(160, endY); ctx.lineTo(240, endY); ctx.stroke();
    ctx.fillStyle = '#dc2626'; ctx.beginPath(); ctx.moveTo(240, endY); ctx.lineTo(232, endY - 5); ctx.lineTo(232, endY + 5); ctx.fill();

    // Plastic Cup
    ctx.strokeStyle = '#d1d5db'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(160, endY); ctx.lineTo(140, endY + 30); ctx.moveTo(160, endY); ctx.lineTo(180, endY + 30); ctx.stroke();
    ctx.fillStyle = 'rgba(255,255,255,0.8)'; ctx.beginPath(); ctx.moveTo(140, endY+30); ctx.lineTo(180, endY+30); ctx.lineTo(170, endY+60); ctx.lineTo(150, endY+60); ctx.fill(); ctx.stroke();

    // Mass in cup
    if(stV2_3State.load === '50' || stV2_3State.load === '100') {
        ctx.fillStyle = '#d97706'; ctx.fillRect(150, endY+45, 20, 15); ctx.fillStyle='#fff'; ctx.font='8px Arial'; ctx.fillText(stV2_3State.load+'g', 152, endY+55);
    } else if(stV2_3State.load === 'unknown') {
        ctx.fillStyle = '#475569'; ctx.beginPath(); ctx.arc(160, endY+50, 10, 0, Math.PI*2); ctx.fill(); // Stone
    }

    // Ruler
    ctx.strokeStyle = '#0f172a'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(250, 20); ctx.lineTo(250, 390); ctx.stroke();
    ctx.fillStyle = '#0f172a'; ctx.font = '10px monospace'; ctx.textAlign = 'left';
    for (let r = 0; r <= 180; r++) {
        let ty = 30 + (r * 2); let isMajor = r % 10 === 0; let isMed = r % 5 === 0 && !isMajor;
        ctx.beginPath(); ctx.moveTo(250, ty); ctx.lineTo(250 + (isMajor ? 14 : (isMed ? 9 : 5)), ty); ctx.lineWidth = isMajor ? 2 : 1; ctx.stroke();
        if (isMajor) ctx.fillText(`${r/10} cm`, 268, ty + 4);
    }

    stV2_3State.animId = requestAnimationFrame(stV2_3Loop);
}

/**
 * ==========================================================================
 * UPPER SIXTH STATION 4: DENSITY OF A WIRE
 * ==========================================================================
 */
function renderStationV2_4() {
    document.getElementById('simulation-render-target').innerHTML = `
        <div class="bench-card" style="width: 100%; max-width: 850px; display: flex; flex-wrap: wrap; gap: 20px; background: #0d1117; padding: 1.5rem; border-radius: 12px; border: 1px solid #30363d; box-sizing: border-box;">
            <div style="flex: 1; min-width: 250px; display: flex; flex-direction: column; gap: 15px;">
                <div style="background: #161b22; padding: 20px; border-radius: 8px; border: 2px solid #30363d; text-align: center;">
                    <div style="color:#8b949e; font-size:0.8rem; margin-bottom:5px; font-family:'Orbitron';">INSTRUMENT READOUT</div>
                    <div class="lcd-screen" id="stV2-4-lcd" style="font-size:2.5rem; color:#10b981; background:#000; padding:10px; border-radius:6px; font-weight:bold;">---</div>
                    <div id="stV2-4-unit" style="color:#f59e0b; font-size:1rem; font-weight:bold; margin-top:5px;"></div>
                </div>
                <div style="background: #1e293b; padding: 15px; border-radius: 8px; border: 1px solid #334155;">
                    <label style="color:#fff; font-size:0.9rem; font-weight:bold; display:block; margin-bottom:12px; text-align:center;">Wire Testing Instruments</label>
                    <button onclick="stV2_4Tool('balance')" style="width:100%; margin-bottom:8px; background:#475569; color:#fff; border:none; padding:12px; border-radius:6px; font-weight:bold; cursor:pointer;"><i class="fas fa-weight-hanging"></i> Place on Balance</button>
                    <button onclick="stV2_4Tool('ruler')" style="width:100%; margin-bottom:8px; background:#3b82f6; color:#fff; border:none; padding:12px; border-radius:6px; font-weight:bold; cursor:pointer;"><i class="fas fa-ruler"></i> Stretch on Metre Rule</button>
                    <button onclick="stV2_4Tool('micrometer')" style="width:100%; background:#f59e0b; color:#000; border:none; padding:12px; border-radius:6px; font-weight:bold; cursor:pointer;"><i class="fas fa-tools"></i> Grip in Micrometer</button>
                </div>
            </div>
            <div style="flex: 2; min-width: 300px; background: #fff; border-radius: 8px; padding: 10px; display: flex; justify-content: center; align-items: center; position: relative; border: 2px solid #0f172a; overflow:hidden;">
                <canvas id="canvas-stV2-4" width="450" height="350" style="display:block;"></canvas>
            </div>
        </div>
    `;
    stV2_4Tool('idle');
}
function stV2_4Tool(tool) {
    stV2_4State.activeTool = tool;
    if (tool === 'balance') { stV2_4State.disp = (stV2_4State.trueMass + (Math.random()*0.02-0.01)).toFixed(2); stV2_4State.unit = "grams (g)"; }
    else if (tool === 'ruler') { stV2_4State.disp = (stV2_4State.trueL + (Math.random()*0.2-0.1)).toFixed(1); stV2_4State.unit = "centimeters (cm)"; }
    else if (tool === 'micrometer') { stV2_4State.disp = (stV2_4State.trueD + (Math.random()*0.02-0.01)).toFixed(2); stV2_4State.unit = "millimeters (mm)"; }
    else { stV2_4State.disp = "---"; stV2_4State.unit = "Select an instrument"; }

    document.getElementById('stV2-4-lcd').innerText = stV2_4State.disp;
    document.getElementById('stV2-4-unit').innerText = stV2_4State.unit;
    if(stV2_4State.animId) cancelAnimationFrame(stV2_4State.animId); stV2_4Loop();
}
function stV2_4Loop() {
    const canvas = document.getElementById('canvas-stV2-4'); if(!canvas) return;
    const ctx = canvas.getContext('2d'); ctx.clearRect(0,0, canvas.width, canvas.height);
    const cx = 225, cy = 175;

    if(stV2_4State.activeTool === 'idle') {
        ctx.fillStyle = '#0f172a'; ctx.font = '16px Poppins'; ctx.textAlign = 'center'; ctx.fillText("Coiled wire resting on lab bench.", cx, cy);
        ctx.strokeStyle = '#b45309'; ctx.lineWidth = 2; ctx.beginPath();
        for(let i=0; i<30; i++) { ctx.arc(cx, cy+40, 15 + i*0.5, i, i+Math.PI); } ctx.stroke();
    } else if(stV2_4State.activeTool === 'balance') {
        ctx.fillStyle = '#cbd5e1'; ctx.fillRect(cx - 80, cy + 30, 160, 40); ctx.fillStyle = '#1e293b'; ctx.fillRect(cx - 50, cy + 20, 100, 10);
        ctx.strokeStyle = '#b45309'; ctx.lineWidth = 2; ctx.beginPath();
        for(let i=0; i<30; i++) { ctx.arc(cx, cy+10, 15 + i*0.5, i, i+Math.PI); } ctx.stroke();
    } else if(stV2_4State.activeTool === 'ruler') {
        ctx.fillStyle = '#fcd34d'; ctx.fillRect(20, cy, 410, 30); // Ruler
        ctx.fillStyle = '#000'; ctx.font='10px Arial'; for(let i=0; i<=100; i+=10) { let rx = 25+(i*3.8); ctx.fillRect(rx, cy, 2, 8); ctx.fillText(i, rx-5, cy+20); }
        ctx.strokeStyle = '#b45309'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(25, cy-5); ctx.lineTo(25 + (stV2_4State.trueL*3.8), cy-5); ctx.stroke(); // Straight wire
    } else if(stV2_4State.activeTool === 'micrometer') {
        ctx.strokeStyle = '#334155'; ctx.lineWidth = 25; ctx.lineCap = 'round'; ctx.beginPath(); ctx.arc(cx - 20, cy, 70, Math.PI/2, Math.PI * 1.5); ctx.stroke();
        ctx.fillStyle = '#cbd5e1'; ctx.fillRect(cx - 90, cy - 5, 20, 10); ctx.fillRect(cx + 10, cy - 5, 60, 10); 
        ctx.fillStyle = '#b45309'; ctx.fillRect(cx - 70, cy - 1, 80, 2); // Tiny wire gripped
    }

    stV2_4State.animId = requestAnimationFrame(stV2_4Loop);
}

/**
 * ==========================================================================
 * UPPER SIXTH STATION 5: CAPACITOR + RESISTOR CIRCUITS (SERIES/PARALLEL)
 * ==========================================================================
 */
function renderStationV2_5() {
    document.getElementById('simulation-render-target').innerHTML = `
        <div class="bench-card" style="width:100%; max-width:850px; display:flex; flex-wrap:wrap; gap:20px; background:#0d1117; padding:1.5rem; border-radius:12px; border:1px solid #30363d;">
            <div style="flex:1; min-width:250px; display:flex; flex-direction:column; gap:15px;">
                <div style="background:#161b22; padding:15px; border-radius:8px; border:2px solid #30363d; text-align:center;">
                    <div style="color:#8b949e; font-size:0.8rem; font-family:'Orbitron';">AMMETER (A)</div>
                    <div class="lcd-screen" id="stV2-5-lcd" style="font-size:3rem; color:#facc15; background:#000; padding:10px; border-radius:6px; font-weight:bold;">0.00</div>
                </div>
                <div style="background:#1e293b; padding:15px; border-radius:8px; border:1px solid #334155;">
                    <button onclick="stV2_5Connect('A')" style="width:100%; margin-bottom:8px; background:#475569; color:#fff; border:none; padding:12px; border-radius:6px; font-weight:bold; cursor:pointer;">Connect Box A</button>
                    <button onclick="stV2_5Connect('B')" style="width:100%; margin-bottom:8px; background:#475569; color:#fff; border:none; padding:12px; border-radius:6px; font-weight:bold; cursor:pointer;">Connect Box B</button>
                    <button onclick="stV2_5Power()" id="btn-stV2-5-pwr" style="width:100%; background:var(--emerald); color:#fff; border:none; padding:12px; border-radius:6px; font-weight:bold; cursor:pointer;">Turn Power ON</button>
                </div>
            </div>
            <div style="flex:2; min-width:300px; background:#fff; border-radius:8px; padding:10px; display:flex; justify-content:center; border:2px solid #0f172a; overflow:hidden;">
                <canvas id="canvas-stV2-5" width="450" height="350"></canvas>
            </div>
        </div>
    `;
    stV2_5Connect('none');
}
function stV2_5Connect(box) { stV2_5State.activeBox = box; stV2_5State.isConnected = false; stV2_5State.current = 0; document.getElementById('btn-stV2-5-pwr').innerHTML = "Turn Power ON"; document.getElementById('btn-stV2-5-pwr').style.background = "var(--emerald)"; if(stV2_5State.animId) cancelAnimationFrame(stV2_5State.animId); stV2_5Loop(); }
function stV2_5Power() {
    if(stV2_5State.activeBox === 'none') { alert("Connect a box first!"); return; }
    stV2_5State.isConnected = !stV2_5State.isConnected;
    if(stV2_5State.isConnected) {
        stV2_5State.lastTick = performance.now(); stV2_5State.time = 0;
        document.getElementById('btn-stV2-5-pwr').innerHTML = "Turn Power OFF"; document.getElementById('btn-stV2-5-pwr').style.background = "#ef4444";
    } else {
        stV2_5State.current = 0;
        document.getElementById('btn-stV2-5-pwr').innerHTML = "Turn Power ON"; document.getElementById('btn-stV2-5-pwr').style.background = "var(--emerald)";
    }
}
function stV2_5Loop() {
    const canvas = document.getElementById('canvas-stV2-5'); if(!canvas) return;
    const ctx = canvas.getContext('2d'); ctx.clearRect(0,0, canvas.width, canvas.height);

    if(stV2_5State.isConnected) {
        const now = performance.now(); let dt = (now - stV2_5State.lastTick)/1000; stV2_5State.time += dt*5; stV2_5State.lastTick = now;
        
        // Box A = Series (Cap blocks DC). I = I0 * e^(-t/RC). Spikes then hits 0.
        // Box B = Parallel (Cap charges, R allows flow). I = I_steady + I0 * e^(-t/RC). Spikes then hits steady state.
        let I0 = 2.5; let steady = stV2_5State.activeBox === 'B' ? 0.8 : 0.0;
        stV2_5State.current = steady + (I0 * Math.exp(-stV2_5State.time / 2.0)); // Fake RC constant
    }

    let displayCurrent = stV2_5State.current + (stV2_5State.current > 0.05 ? Math.random()*0.02 - 0.01 : 0);
    document.getElementById('stV2-5-lcd').innerText = displayCurrent.toFixed(2);

    // Circuit Board Layout
    ctx.strokeStyle = '#0f172a'; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(100, 250); ctx.lineTo(100, 100); ctx.lineTo(350, 100); ctx.lineTo(350, 250); ctx.stroke(); 
    ctx.fillStyle = '#facc15'; ctx.fillRect(70, 200, 60, 20); ctx.fillStyle='#000'; ctx.font='12px Arial'; ctx.fillText('DC Batt', 80, 215);
    ctx.fillStyle = '#1e293b'; ctx.beginPath(); ctx.arc(225, 100, 20, 0, Math.PI*2); ctx.fill(); ctx.fillStyle='#fff'; ctx.fillText('A', 220, 105);

    ctx.fillStyle = '#ef4444'; ctx.beginPath(); ctx.arc(100, 250, 6, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = '#000'; ctx.beginPath(); ctx.arc(350, 250, 6, 0, Math.PI*2); ctx.fill();

    if(stV2_5State.activeBox !== 'none') {
        ctx.strokeStyle = '#3b82f6'; ctx.beginPath(); ctx.moveTo(100, 250); ctx.lineTo(150, 280); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(350, 250); ctx.lineTo(300, 280); ctx.stroke();
        
        ctx.fillStyle = '#64748b'; ctx.fillRect(150, 260, 150, 60);
        ctx.fillStyle = '#fff'; ctx.font='bold 20px Poppins'; ctx.fillText("BOX " + stV2_5State.activeBox, 195, 295);
        
        // Electron flow animation
        if(stV2_5State.current > 0.05) {
            ctx.fillStyle = '#ef4444'; let speed = stV2_5State.current * 2; let pos = (performance.now() * speed) % 250;
            ctx.beginPath(); ctx.arc(100 + pos, 100, 4, 0, Math.PI*2); ctx.fill();
        }
    }
    stV2_5State.animId = requestAnimationFrame(stV2_5Loop);
}

/**
 * ==========================================================================
 * UPPER SIXTH STATION 6 (SET 2 ST 2): YOUNG'S MODULUS
 * ==========================================================================
 */
function renderStationV2_6() {
    document.getElementById('simulation-render-target').innerHTML = `
        <div class="bench-card" style="width: 100%; max-width: 850px; display: flex; flex-wrap: wrap; gap: 20px; background: #0d1117; padding: 1.5rem; border-radius: 12px; border: 1px solid #30363d;">
            <div style="flex: 1; min-width: 250px; display: flex; flex-direction: column; gap: 15px;">
                <div style="background: #1e293b; padding: 20px; border-radius: 8px; border: 1px solid #334155;">
                    <label style="color:#fff; font-size:0.85rem; display:block; margin-bottom:8px;">Load Mass (W): <span id="lbl-ym-m" style="color:var(--sim-accent);">0 g</span></label>
                    <input type="range" id="slider-ym-m" min="0" max="500" value="0" step="50" style="width:100%; cursor:pointer;">
                    
                    <div style="color:var(--amber); font-size:0.75rem; margin-top:15px; border-top:1px solid #475569; padding-top:10px;">
                        Fixed parameters:<br>L = 95 cm<br>b = 2.5 cm<br>d = 0.5 cm
                    </div>
                </div>
            </div>
            <div style="flex: 2; min-width: 300px; background: #fff; border-radius: 8px; padding: 10px; display: flex; justify-content: center; border: 2px solid #0f172a; overflow: hidden;">
                <canvas id="canvas-stV2-6" width="450" height="380" style="display: block;"></canvas>
            </div>
        </div>
    `;

    document.getElementById('slider-ym-m').addEventListener('input', (e) => {
        stV2_6State.mass = parseInt(e.target.value);
        document.getElementById('lbl-ym-m').innerText = `${stV2_6State.mass} g`;
    });
    if(stV2_6State.animId) cancelAnimationFrame(stV2_6State.animId); stV2_6Loop();
}

function stV2_6Loop() {
    const canvas = document.getElementById('canvas-stV2-6'); if(!canvas) return;
    const ctx = canvas.getContext('2d'); ctx.clearRect(0,0, canvas.width, canvas.height);

    // Physics Deflection (y = 4L^3 W / Ebd^3). Scaled for UI.
    let targetDeflection = (stV2_6State.mass / 50) * 12; // visual pixels
    stV2_6State.animY += (targetDeflection - stV2_6State.animY) * 0.1;

    let startX = 100; let beamWidth = 280;

    // Draw Bench & Clamp
    ctx.fillStyle = '#1e293b'; ctx.fillRect(20, 100, 80, 200);
    ctx.fillStyle = '#64748b'; ctx.fillRect(60, 85, 30, 25); // G-Clamp
    ctx.beginPath(); ctx.arc(75, 85, 10, Math.PI, 0); ctx.fillStyle = '#475569'; ctx.fill();

    // Draw Wooden Bar (Cubic Bezier for flex)
    ctx.strokeStyle = '#d97706'; ctx.lineWidth = 10; ctx.lineCap = "butt"; ctx.beginPath();
    ctx.moveTo(startX, 105);
    for (let x = 0; x <= beamWidth; x++) {
        let pct = x / beamWidth;
        let yOffset = stV2_6State.animY * (Math.pow(pct, 2) * (3 - 2 * pct));
        ctx.lineTo(startX + x, 105 + yOffset);
    }
    ctx.stroke();

    // Draw Mass
    let endY = 105 + stV2_6State.animY;
    if(stV2_6State.mass > 0) {
        ctx.fillStyle = '#475569'; ctx.fillRect(startX + beamWidth - 15, endY, 30, 10 + (stV2_6State.mass/20));
        ctx.fillStyle = '#fff'; ctx.font = '10px Arial'; ctx.fillText(stV2_6State.mass+'g', startX + beamWidth - 12, endY + 15 + (stV2_6State.mass/40));
    }

    // Ruler
    ctx.strokeStyle = '#0f172a'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(410, 20); ctx.lineTo(410, 300); ctx.stroke();
    ctx.fillStyle = '#0f172a'; ctx.font = '10px monospace';
    for(let i=0; i<=15; i++) {
        let ty = 105 + (i*10);
        ctx.beginPath(); ctx.moveTo(410, ty); ctx.lineTo(i%5===0 ? 395 : 402, ty); ctx.stroke();
        if(i%5===0) ctx.fillText(i, 415, ty+3);
    }

    // Red pointer
    ctx.strokeStyle = 'rgba(239,68,68,0.5)'; ctx.setLineDash([4,4]);
    ctx.beginPath(); ctx.moveTo(startX + beamWidth, endY); ctx.lineTo(410, endY); ctx.stroke(); ctx.setLineDash([]);
    
    let displayY = (stV2_6State.animY / 10).toFixed(2);
    ctx.fillStyle = '#ef4444'; ctx.fillText(`y = ${displayY} cm`, 330, endY - 10);

    stV2_6State.animId = requestAnimationFrame(stV2_6Loop);
}

/**
 * ==========================================================================
 * UPPER SIXTH STATION 7: LATENT HEAT OF FUSION OF ICE
 * ==========================================================================
 */
function renderStationV2_7() {
    document.getElementById('simulation-render-target').innerHTML = `
        <div class="bench-card" style="width:100%; max-width:850px; display:flex; flex-wrap:wrap; gap:20px; background:#0d1117; padding:1.5rem; border-radius:12px; border:1px solid #30363d;">
            <div style="flex:1; min-width:250px; display:flex; flex-direction:column; gap:15px;">
                <div style="background:#161b22; padding:15px; border-radius:8px; border:2px solid #30363d; text-align:center;">
                    <div style="color:#8b949e; font-size:0.8rem; font-family:'Orbitron';">THERMOMETER (°C)</div>
                    <div class="lcd-screen" id="stV2-7-temp" style="font-size:3rem; color:#ef4444; background:#000; padding:10px; border-radius:6px; font-weight:bold;">35.0</div>
                </div>
                <div style="background:#1e293b; padding:15px; border-radius:8px; border:1px solid #334155;">
                    <button onclick="stV2_7AddIce()" style="width:100%; margin-bottom:8px; background:#38bdf8; color:#fff; border:none; padding:12px; border-radius:6px; font-weight:bold; cursor:pointer;"><i class="fas fa-icicles"></i> Drop Dry Ice Block</button>
                    <button onclick="stV2_7Reset()" style="width:100%; background:#ef4444; color:#fff; border:none; padding:12px; border-radius:6px; font-weight:bold; cursor:pointer;"><i class="fas fa-undo"></i> Reset Warm Water</button>
                </div>
            </div>
            <div style="flex:2; min-width:300px; background:#fff; border-radius:8px; padding:10px; display:flex; justify-content:center; border:2px solid #0f172a; overflow:hidden;">
                <canvas id="canvas-stV2-7" width="450" height="350"></canvas>
            </div>
        </div>
    `;
    stV2_7Reset();
}
function stV2_7Reset() { stV2_7State.temp = 35.0; stV2_7State.iceAdded = 0; if(stV2_7State.animId) cancelAnimationFrame(stV2_7State.animId); stV2_7Loop(); }
function stV2_7AddIce() {
    stV2_7State.iceAdded++;
    // Physics: Each ice block cools the water due to Latent Heat + Sensible Heat
    stV2_7State.targetTemp = stV2_7State.temp - 6.5; 
}
function stV2_7Loop() {
    const canvas = document.getElementById('canvas-stV2-7'); if(!canvas) return;
    const ctx = canvas.getContext('2d'); ctx.clearRect(0,0, canvas.width, canvas.height);

    if (stV2_7State.iceAdded > 0) {
        if(stV2_7State.temp > stV2_7State.targetTemp) stV2_7State.temp -= 0.05; // Melting cooling effect
    }

    let dispTemp = stV2_7State.temp + (Math.random()*0.1 - 0.05);
    document.getElementById('stV2-7-temp').innerText = dispTemp.toFixed(1);

    const cx = 225;
    // Calorimeter
    ctx.fillStyle = '#b45309'; ctx.fillRect(cx-70, 150, 140, 180);
    ctx.fillStyle = 'rgba(56,189,248,0.5)'; ctx.fillRect(cx-65, 180 - (stV2_7State.iceAdded*5), 130, 140 + (stV2_7State.iceAdded*5));
    
    // Ice blocks floating
    if(stV2_7State.temp > stV2_7State.targetTemp) { // Actively melting
        ctx.fillStyle = 'rgba(255,255,255,0.8)';
        for(let i=0; i<stV2_7State.iceAdded; i++) {
            ctx.fillRect(cx - 30 + (i*15), 180 - (stV2_7State.iceAdded*5) + Math.sin(performance.now()/200+i)*3, 20, 20);
        }
    }
    
    // Thermometer
    ctx.fillStyle = '#fff'; ctx.fillRect(cx+30, 50, 10, 240);
    ctx.fillStyle = '#ef4444'; ctx.fillRect(cx+33, 280 - (stV2_7State.temp*3), 4, (stV2_7State.temp*3));
    ctx.beginPath(); ctx.arc(cx+35, 285, 8, 0, Math.PI*2); ctx.fill();

    stV2_7State.animId = requestAnimationFrame(stV2_7Loop);
}

/**
 * ==========================================================================
 * UPPER SIXTH STATION 8: THERMOELECTRIC EMF
 * ==========================================================================
 */
function renderStationV2_8() {
    document.getElementById('simulation-render-target').innerHTML = `
        <div class="bench-card" style="width:100%; max-width:850px; display:flex; flex-wrap:wrap; gap:20px; background:#0d1117; padding:1.5rem; border-radius:12px; border:1px solid #30363d;">
            <div style="flex:1; min-width:250px; display:flex; flex-direction:column; gap:15px;">
                <div style="background:#161b22; padding:15px; border-radius:8px; border:2px solid #30363d; text-align:center;">
                    <div style="color:#8b949e; font-size:0.8rem; font-family:'Orbitron';">MICROAMMETER (µA)</div>
                    <div class="lcd-screen" id="stV2-8-lcd" style="font-size:3rem; color:#facc15; background:#000; padding:10px; border-radius:6px; font-weight:bold;">0.0</div>
                </div>
                <div style="background:#1e293b; padding:15px; border-radius:8px; border:1px solid #334155;">
                    <button id="btn-stv2-8" onclick="stV2_8Toggle()" style="width:100%; background:#ef4444; color:#fff; border:none; padding:12px; border-radius:6px; font-weight:bold; cursor:pointer;"><i class="fas fa-fire"></i> Shove Wires Into Flame</button>
                    <p style="color:#94a3b8; font-size:0.75rem; margin-top:10px;">Observe the current generated by the temperature difference between the hot and cold junctions (Seebeck Effect).</p>
                </div>
            </div>
            <div style="flex:2; min-width:300px; background:#fff; border-radius:8px; padding:10px; display:flex; justify-content:center; border:2px solid #0f172a; overflow:hidden;">
                <canvas id="canvas-stV2-8" width="450" height="350"></canvas>
            </div>
        </div>
    `;
    stV2_8State.inFlame = false; stV2_8State.temp = 25; stV2_8State.current = 0;
    if(stV2_8State.animId) cancelAnimationFrame(stV2_8State.animId); stV2_8Loop();
}
function stV2_8Toggle() {
    stV2_8State.inFlame = !stV2_8State.inFlame;
    document.getElementById('btn-stv2-8').innerHTML = stV2_8State.inFlame ? "Remove from Flame" : "<i class='fas fa-fire'></i> Shove Wires Into Flame";
    document.getElementById('btn-stv2-8').style.background = stV2_8State.inFlame ? "#64748b" : "#ef4444";
}
function stV2_8Loop() {
    const canvas = document.getElementById('canvas-stV2-8'); if(!canvas) return;
    const ctx = canvas.getContext('2d'); ctx.clearRect(0,0, canvas.width, canvas.height);

    if(stV2_8State.inFlame) {
        if(stV2_8State.temp < 800) stV2_8State.temp += 5.0; // Rapid heating
    } else {
        if(stV2_8State.temp > 25) stV2_8State.temp -= 2.0; // Cooling
    }

    // Seebeck effect physics mapping: Current proportional to delta T
    stV2_8State.current = (stV2_8State.temp - 25) * 0.045;
    
    let disp = stV2_8State.current + (stV2_8State.current > 0 ? (Math.random()*0.4 - 0.2) : 0);
    document.getElementById('stV2-8-lcd').innerText = disp.toFixed(1);

    // Ammeter
    ctx.fillStyle = '#1e293b'; ctx.fillRect(250, 100, 120, 80); ctx.fillStyle = '#fff'; ctx.font='bold 16px Poppins'; ctx.fillText('µA Meter', 270, 145);
    
    // Dissimilar Wires (Copper & Constantan)
    let jY = stV2_8State.inFlame ? 250 : 200; // Drops into flame
    ctx.strokeStyle = '#b45309'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(270, 180); ctx.lineTo(150, jY); ctx.stroke(); // Copper
    ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(350, 180); ctx.lineTo(150, jY); ctx.stroke(); // Constantan
    
    // Hot Junction
    ctx.fillStyle = stV2_8State.temp > 100 ? '#ef4444' : '#000';
    ctx.beginPath(); ctx.arc(150, jY, 8, 0, Math.PI*2); ctx.fill();

    // Candle Flame
    ctx.fillStyle = '#fff'; ctx.fillRect(140, 270, 20, 80); // Wax
    ctx.fillStyle = '#f59e0b';
    ctx.beginPath(); ctx.moveTo(150, 230 - Math.random()*10); ctx.quadraticCurveTo(165, 270, 150, 270); ctx.quadraticCurveTo(135, 270, 150, 230); ctx.fill(); // Fire

    stV2_8State.animId = requestAnimationFrame(stV2_8Loop);
}

/**
 * ==========================================================================
 * UPPER SIXTH STATION 9: MAGNETIC BOXES (PLOTTING COMPASS)
 * ==========================================================================
 */
function renderStationV2_9() {
    document.getElementById('simulation-render-target').innerHTML = `
        <div class="bench-card" style="width:100%; max-width:850px; display:flex; flex-wrap:wrap; gap:20px; background:#0d1117; padding:1.5rem; border-radius:12px; border:1px solid #30363d;">
            <div style="flex:1; min-width:250px; display:flex; flex-direction:column; gap:15px;">
                <div style="background:#1e293b; padding:15px; border-radius:8px; border:1px solid #334155;">
                    <label style="color:#facc15; font-size:0.85rem; display:block; margin-bottom:8px;"><i class="fas fa-compass"></i> Slide Plotting Compass</label>
                    <input type="range" id="slider-stV2-9" min="50" max="400" value="225" style="width:100%; cursor:pointer;">
                    <div style="color:#cbd5e1; font-size:0.75rem; margin-top:10px;">Drag the compass past the boxes. Watch the needle's behavior to deduce what is inside (Magnet, Ferro, Non-Mag).</div>
                </div>
            </div>
            <div style="flex:2; min-width:300px; background:#fff; border-radius:8px; padding:10px; display:flex; justify-content:center; border:2px solid #0f172a; overflow:hidden;">
                <canvas id="canvas-stV2-9" width="450" height="350"></canvas>
            </div>
        </div>
    `;
    document.getElementById('slider-stV2-9').addEventListener('input', (e) => { stV2_9State.compassX = parseInt(e.target.value); });
    if(stV2_9State.animId) cancelAnimationFrame(stV2_9State.animId); stV2_9Loop();
}
function stV2_9Loop() {
    const canvas = document.getElementById('canvas-stV2-9'); if(!canvas) return;
    const ctx = canvas.getContext('2d'); ctx.clearRect(0,0, canvas.width, canvas.height);

    // Box P: Magnet (Strong pull/repel). Box Q: Ferro (Mild attract). Box R: Non-Mag.
    let pxP = 100, pxQ = 225, pxR = 350;

    // Draw Boxes
    ctx.fillStyle = '#0f172a'; 
    ctx.fillRect(pxP-25, 100, 50, 50); ctx.fillRect(pxQ-25, 100, 50, 50); ctx.fillRect(pxR-25, 100, 50, 50);
    ctx.fillStyle = '#fff'; ctx.font = 'bold 20px Arial'; ctx.textAlign='center';
    ctx.fillText('P', pxP, 132); ctx.fillText('Q', pxQ, 132); ctx.fillText('R', pxR, 132);

    // Compass physics
    let cx = stV2_9State.compassX; let cy = 250;
    let distP = Math.sqrt(Math.pow(cx - pxP, 2) + Math.pow(cy - 125, 2));
    let distQ = Math.sqrt(Math.pow(cx - pxQ, 2) + Math.pow(cy - 125, 2));

    let angle = 0; // Earth North (pointing up)
    if(distP < 150) {
        // Magnet dictates field lines heavily.
        angle = Math.atan2(cy - 125, cx - pxP) + (Math.PI/2); // Swings to align with flux
    } else if(distQ < 100) {
        // Ferro attracts either pole, needle just points towards it slightly
        let pull = 1000 / (distQ * distQ);
        angle = (cx > pxQ ? -pull : pull);
    }

    // Smooth needle turn
    stV2_9State.theta += (angle - stV2_9State.theta) * 0.1;

    // Draw Compass
    ctx.beginPath(); ctx.arc(cx, cy, 30, 0, Math.PI*2); ctx.fillStyle='#f8fafc'; ctx.fill(); ctx.strokeStyle='#1e293b'; ctx.lineWidth=3; ctx.stroke();
    ctx.save(); ctx.translate(cx, cy); ctx.rotate(stV2_9State.theta);
    ctx.fillStyle = '#ef4444'; ctx.beginPath(); ctx.moveTo(0,-20); ctx.lineTo(6,0); ctx.lineTo(-6,0); ctx.fill(); // North red
    ctx.fillStyle = '#94a3b8'; ctx.beginPath(); ctx.moveTo(0,20); ctx.lineTo(6,0); ctx.lineTo(-6,0); ctx.fill(); // South grey
    ctx.restore();

    stV2_9State.animId = requestAnimationFrame(stV2_9Loop);
}

/**
 * ==========================================================================
 * UPPER SIXTH STATION 10: THERMISTOR VS LDR
 * ==========================================================================
 */
function renderStationV2_10() {
    document.getElementById('simulation-render-target').innerHTML = `
        <div class="bench-card" style="width:100%; max-width:850px; display:flex; flex-wrap:wrap; gap:20px; background:#0d1117; padding:1.5rem; border-radius:12px; border:1px solid #30363d;">
            <div style="flex:1; min-width:250px; display:flex; flex-direction:column; gap:15px;">
                <div style="background:#161b22; padding:15px; border-radius:8px; border:2px solid #30363d; text-align:center;">
                    <div style="color:#8b949e; font-size:0.8rem; font-family:'Orbitron';">MILLIAMMETER (mA)</div>
                    <div class="lcd-screen" id="stV2-10-lcd" style="font-size:3rem; color:#facc15; background:#000; padding:10px; border-radius:6px; font-weight:bold;">0.00</div>
                </div>
                <div style="background:#1e293b; padding:15px; border-radius:8px; border:1px solid #334155;">
                    <select id="stV2-10-comp" onchange="stV2_10Select()" style="width:100%; padding:10px; background:#0f172a; color:#fff; border:1px solid #475569; border-radius:4px; margin-bottom:15px;">
                        <option value="none">Select Component...</option>
                        <option value="A">Component A</option>
                        <option value="B">Component B</option>
                    </select>
                    <button id="btn-stV2-10" onmousedown="stV2_10Cover(true)" onmouseup="stV2_10Cover(false)" onmouseleave="stV2_10Cover(false)" ontouchstart="stV2_10Cover(true)" ontouchend="stV2_10Cover(false)" style="width:100%; background:var(--emerald); color:#fff; border:none; padding:12px; border-radius:6px; font-weight:bold; cursor:pointer;"><i class="fas fa-hand-paper"></i> Press & Hold Thumb over Component</button>
                </div>
            </div>
            <div style="flex:2; min-width:300px; background:#fff; border-radius:8px; padding:10px; display:flex; justify-content:center; border:2px solid #0f172a; overflow:hidden;">
                <canvas id="canvas-stV2-10" width="450" height="350"></canvas>
            </div>
        </div>
    `;
    stV2_10Select();
}
function stV2_10Select() {
    stV2_10State.activeComp = document.getElementById('stV2-10-comp').value;
    stV2_10State.isCovered = false;
    if(stV2_10State.animId) cancelAnimationFrame(stV2_10State.animId); stV2_10Loop();
}
function stV2_10Cover(state) {
    stV2_10State.isCovered = state;
    document.getElementById('btn-stV2-10').style.background = state ? '#ef4444' : 'var(--emerald)';
}
function stV2_10Loop() {
    const canvas = document.getElementById('canvas-stV2-10'); if(!canvas) return;
    const ctx = canvas.getContext('2d'); ctx.clearRect(0,0, canvas.width, canvas.height);

    let targetI = 0;
    // Comp A = Thermistor. Heat (thumb) LOWERS resistance -> Current INCREASES.
    // Comp B = LDR. Dark (thumb) INCREASES resistance -> Current DECREASES.
    if(stV2_10State.activeComp === 'A') {
        targetI = stV2_10State.isCovered ? 45.0 : 15.0; // Heats up, flows more
    } else if (stV2_10State.activeComp === 'B') {
        targetI = stV2_10State.isCovered ? 2.0 : 35.0; // Goes dark, flow stops
    }
    
    stV2_10State.current += (targetI - stV2_10State.current) * 0.05; // Smooth transition
    let dispI = stV2_10State.current + (stV2_10State.current > 1 ? Math.random()*0.2-0.1 : 0);
    document.getElementById('stV2-10-lcd').innerText = dispI.toFixed(2);

    // Circuit
    ctx.strokeStyle = '#0f172a'; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(100, 250); ctx.lineTo(100, 100); ctx.lineTo(350, 100); ctx.lineTo(350, 250); ctx.stroke(); 
    
    ctx.fillStyle = '#facc15'; ctx.fillRect(70, 200, 60, 20); ctx.fillStyle='#000'; ctx.font='12px Arial'; ctx.fillText('1.5 V', 85, 215); // Battery
    ctx.fillStyle = '#1e293b'; ctx.beginPath(); ctx.arc(225, 100, 20, 0, Math.PI*2); ctx.fill(); ctx.fillStyle='#fff'; ctx.fillText('mA', 215, 105); // Ammeter

    // Component placement
    if(stV2_10State.activeComp !== 'none') {
        ctx.strokeStyle = '#3b82f6'; ctx.beginPath(); ctx.moveTo(100, 250); ctx.lineTo(180, 250); ctx.moveTo(350, 250); ctx.lineTo(270, 250); ctx.stroke();
        
        ctx.fillStyle = '#475569'; ctx.beginPath(); ctx.arc(225, 250, 30, 0, Math.PI*2); ctx.fill(); // The component
        
        // Draw Thumb
        if(stV2_10State.isCovered) {
            ctx.fillStyle = 'rgba(253, 186, 116, 0.9)'; // Skin tone
            ctx.beginPath(); ctx.ellipse(225, 250, 50, 80, Math.PI/4, 0, Math.PI*2); ctx.fill();
        }

        // Electrons
        if(stV2_10State.current > 1) {
            ctx.fillStyle = '#ef4444'; let speed = stV2_10State.current / 5; let pos = (performance.now() * speed) % 250;
            ctx.beginPath(); ctx.arc(100 + pos, 100, 4, 0, Math.PI*2); ctx.fill();
        }
    }

    stV2_10State.animId = requestAnimationFrame(stV2_10Loop);
}

/**
 * ==========================================================================
 * SET 4 ST 1: INTERNAL DIAMETER OF A PIPE
 * ==========================================================================
 */
function renderStation4_1() {
    document.getElementById('simulation-render-target').innerHTML = `
        <div class="bench-card" style="width:100%; max-width:850px; display:flex; flex-wrap:wrap; gap:20px; background:#0d1117; padding:1.5rem; border-radius:12px; border:1px solid #30363d;">
            <div style="flex:1; min-width:250px; display:flex; flex-direction:column; gap:15px;">
                <div style="background:#1e293b; padding:15px; border-radius:8px; border:1px solid #334155;">
                    <label style="color:#38bdf8; font-size:0.85rem; display:block; margin-bottom:8px;"><i class="fas fa-tint"></i> Pour Water (Volume V cm³)</label>
                    <input type="range" id="slider-st4-1" min="0" max="150" value="0" step="5" style="width:100%; cursor:pointer;">
                    <div style="color:#fff; margin-top:10px; font-weight:bold;">V = <span id="lbl-st4-1-v" style="color:var(--sim-accent);">0</span> cm³</div>
                    <div style="color:#94a3b8; font-size:0.75rem; margin-top:10px;">Read the height (h) on the rule. Use V = πr²h to find the diameter.</div>
                </div>
            </div>
            <div style="flex:2; min-width:300px; background:#fff; border-radius:8px; padding:10px; display:flex; justify-content:center; border:2px solid #0f172a; overflow:hidden;">
                <canvas id="canvas-st4-1" width="450" height="350"></canvas>
            </div>
        </div>
    `;
    document.getElementById('slider-st4-1').addEventListener('input', (e) => { 
        st4_1State.vol = parseInt(e.target.value); 
        document.getElementById('lbl-st4-1-v').innerText = st4_1State.vol;
    });
    if(st4_1State.animId) cancelAnimationFrame(st4_1State.animId); st4_1Loop();
}
function st4_1Loop() {
    const canvas = document.getElementById('canvas-st4-1'); if(!canvas) return;
    const ctx = canvas.getContext('2d'); ctx.clearRect(0,0, canvas.width, canvas.height);

    // Physics: V = pi * r^2 * h => h = V / (pi * r^2)
    let area = Math.PI * Math.pow(st4_1State.radius, 2);
    let h_cm = st4_1State.vol / area;
    let pxHeight = h_cm * 8; // 8 pixels per cm

    // Base and Pipe
    ctx.fillStyle = '#475569'; ctx.fillRect(150, 300, 100, 20); // Base plug
    ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 4;
    ctx.beginPath(); ctx.moveTo(170, 50); ctx.lineTo(170, 300); ctx.lineTo(230, 300); ctx.lineTo(230, 50); ctx.stroke(); // Pipe

    // Water
    if(st4_1State.vol > 0) {
        ctx.fillStyle = 'rgba(56, 189, 248, 0.6)';
        ctx.fillRect(172, 300 - pxHeight, 56, pxHeight);
        ctx.beginPath(); ctx.ellipse(200, 300 - pxHeight, 28, 5, 0, 0, Math.PI*2); ctx.fillStyle='rgba(14, 165, 233, 0.8)'; ctx.fill();
    }

    // Ruler
    ctx.fillStyle = '#facc15'; ctx.fillRect(250, 50, 20, 260); ctx.fillStyle='#000'; ctx.font='10px Arial';
    for(let i=0; i<=30; i+=5) {
        let ty = 300 - (i*8); ctx.beginPath(); ctx.moveTo(250, ty); ctx.lineTo(260, ty); ctx.stroke();
        if(i>0) ctx.fillText(i, 255, ty+10);
    }
    st4_1State.animId = requestAnimationFrame(st4_1Loop);
}

/**
 * ==========================================================================
 * SET 4 ST 2: ENERGY STORED IN A CHARGED CAPACITOR
 * ==========================================================================
 */
function renderStation4_2() {
    document.getElementById('simulation-render-target').innerHTML = `
        <div class="bench-card" style="width:100%; max-width:850px; display:flex; flex-wrap:wrap; gap:20px; background:#0d1117; padding:1.5rem; border-radius:12px; border:1px solid #30363d;">
            <div style="flex:1; min-width:250px; display:flex; flex-direction:column; gap:15px;">
                <div style="background:#161b22; padding:15px; border-radius:8px; border:2px solid #30363d; text-align:center;">
                    <div style="color:#8b949e; font-size:0.8rem; font-family:'Orbitron';">VOLTMETER (V)</div>
                    <div class="lcd-screen" id="st4-2-v" style="font-size:3rem; color:#38bdf8; background:#000; padding:10px; border-radius:6px; font-weight:bold;">0.00</div>
                    <div style="color:#facc15; font-size:1rem; margin-top:10px; font-weight:bold;" id="st4-2-time">0:00 mins</div>
                </div>
                <div style="background:#1e293b; padding:15px; border-radius:8px; border:1px solid #334155;">
                    <button id="btn-st4-2" onclick="st4_2Toggle()" style="width:100%; background:var(--emerald); color:#fff; border:none; padding:12px; border-radius:6px; font-weight:bold; cursor:pointer;"><i class="fas fa-plug"></i> Close Switch (Charge)</button>
                    <p style="color:#94a3b8; font-size:0.75rem; margin-top:10px;">Capacitance C = 1000 µF.</p>
                </div>
            </div>
            <div style="flex:2; min-width:300px; background:#fff; border-radius:8px; padding:10px; display:flex; justify-content:center; border:2px solid #0f172a; overflow:hidden;">
                <canvas id="canvas-st4-2" width="450" height="350"></canvas>
            </div>
        </div>
    `;
    st4_2State.isCharging = false; st4_2State.time = 0; st4_2State.voltage = 0;
    if(st4_2State.animId) cancelAnimationFrame(st4_2State.animId); st4_2Loop();
}
function st4_2Toggle() {
    st4_2State.isCharging = !st4_2State.isCharging;
    if(st4_2State.isCharging) { st4_2State.lastTick = performance.now(); document.getElementById('btn-st4-2').innerHTML = "Open Switch (Read)"; document.getElementById('btn-st4-2').style.background = "#ef4444"; }
    else { document.getElementById('btn-st4-2').innerHTML = "Close Switch (Charge)"; document.getElementById('btn-st4-2').style.background = "var(--emerald)"; }
}
function st4_2Loop() {
    const canvas = document.getElementById('canvas-st4-2'); if(!canvas) return;
    const ctx = canvas.getContext('2d'); ctx.clearRect(0,0, canvas.width, canvas.height);

    if(st4_2State.isCharging) {
        const now = performance.now(); let dt = (now - st4_2State.lastTick)/1000;
        st4_2State.time += dt * 5; // Sim speed
        st4_2State.lastTick = now;
        st4_2State.voltage = 3.0 * (1 - Math.exp(-st4_2State.time / 20)); // RC charge curve
    }

    let m = Math.floor(st4_2State.time / 60); let s = Math.floor(st4_2State.time % 60);
    document.getElementById('st4-2-time').innerText = `${m}:${s < 10 ? '0' : ''}${s} mins`;
    
    // Only show voltage accurately if switch is OPEN after charging, else it shows charging state
    let dispV = st4_2State.voltage + (st4_2State.voltage > 0 ? (Math.random()*0.02-0.01) : 0);
    document.getElementById('st4-2-v').innerText = dispV.toFixed(2);

    // Circuit
    ctx.strokeStyle = '#0f172a'; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(100, 250); ctx.lineTo(100, 100); ctx.lineTo(150, 100); ctx.moveTo(250, 100); ctx.lineTo(350, 100); ctx.lineTo(350, 250); ctx.stroke();
    
    // Switch
    ctx.fillStyle = '#b45309'; ctx.fillRect(150, 90, 100, 20); // Wood block
    ctx.fillStyle = '#ef4444'; ctx.beginPath(); ctx.arc(170, 100, 5, 0, Math.PI*2); ctx.fill(); ctx.beginPath(); ctx.arc(230, 100, 5, 0, Math.PI*2); ctx.fill(); // Thumbtacks
    ctx.strokeStyle = '#000'; ctx.beginPath(); ctx.moveTo(170, 100); ctx.lineTo(st4_2State.isCharging ? 230 : 210, st4_2State.isCharging ? 100 : 70); ctx.stroke();

    // Battery
    ctx.fillStyle = '#facc15'; ctx.fillRect(70, 150, 60, 30); ctx.fillStyle='#000'; ctx.font='12px Arial'; ctx.fillText('3.0V Cell', 75, 170);

    // Capacitor
    ctx.strokeStyle = '#3b82f6'; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(100, 250); ctx.lineTo(150, 250); ctx.moveTo(350, 250); ctx.lineTo(300, 250); ctx.stroke();
    ctx.fillRect(150, 220, 10, 60); ctx.fillRect(290, 220, 10, 60);
    ctx.fillStyle = '#0f172a'; ctx.fillText('1000 µF', 200, 280);

    // Voltmeter attached
    ctx.strokeStyle = '#ef4444'; ctx.lineWidth=2; ctx.beginPath(); ctx.moveTo(150, 250); ctx.lineTo(150, 320); ctx.lineTo(200, 320); ctx.stroke();
    ctx.strokeStyle = '#000'; ctx.beginPath(); ctx.moveTo(290, 250); ctx.lineTo(290, 320); ctx.lineTo(250, 320); ctx.stroke();
    ctx.fillStyle = '#1e293b'; ctx.fillRect(200, 300, 50, 40); ctx.fillStyle='#fff'; ctx.fillText('V', 220, 325);

    st4_2State.animId = requestAnimationFrame(st4_2Loop);
}

/**
 * ==========================================================================
 * SET 4 ST 3: EARTH'S MAGNETIC FIELD
 * ==========================================================================
 */
function renderStation4_3() {
    document.getElementById('simulation-render-target').innerHTML = `
        <div class="bench-card" style="width:100%; max-width:850px; display:flex; flex-wrap:wrap; gap:20px; background:#0d1117; padding:1.5rem; border-radius:12px; border:1px solid #30363d;">
            <div style="flex:1; min-width:250px; display:flex; flex-direction:column; gap:15px;">
                <div style="background:#1e293b; padding:15px; border-radius:8px; border:1px solid #334155;">
                    <label style="color:#fff; font-size:0.9rem; font-weight:bold; display:block; margin-bottom:12px; text-align:center;">Suspend a Box</label>
                    <button onclick="st4_3Action('P')" style="width:100%; margin-bottom:8px; background:#475569; color:#fff; border:none; padding:12px; border-radius:6px; font-weight:bold; cursor:pointer;">Hang Box P</button>
                    <button onclick="st4_3Action('Q')" style="width:100%; margin-bottom:8px; background:#475569; color:#fff; border:none; padding:12px; border-radius:6px; font-weight:bold; cursor:pointer;">Hang Box Q</button>
                    <button onclick="st4_3Action('R')" style="width:100%; background:#475569; color:#fff; border:none; padding:12px; border-radius:6px; font-weight:bold; cursor:pointer;">Hang Box R</button>
                    <p style="color:#94a3b8; font-size:0.75rem; margin-top:15px;">Observe how the box aligns when freely suspended. The Earth's magnetic North is pointing UP.</p>
                </div>
            </div>
            <div style="flex:2; min-width:300px; background:#fff; border-radius:8px; padding:10px; display:flex; justify-content:center; border:2px solid #0f172a; overflow:hidden;">
                <canvas id="canvas-st4-3" width="450" height="350"></canvas>
            </div>
        </div>
    `;
    st4_3Action('none');
}
function st4_3Action(box) {
    st4_3State.activeBox = box;
    st4_3State.angle = (Math.random() * Math.PI) - (Math.PI/2); // Start random
    if(st4_3State.animId) cancelAnimationFrame(st4_3State.animId); st4_3Loop();
}
function st4_3Loop() {
    const canvas = document.getElementById('canvas-st4-3'); if(!canvas) return;
    const ctx = canvas.getContext('2d'); ctx.clearRect(0,0, canvas.width, canvas.height);

    const cx = 225, cy = 175;

    // Earth's Magnetic Field Indicator
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.2)'; ctx.lineWidth = 2;
    for(let i=50; i<400; i+=50) {
        ctx.beginPath(); ctx.moveTo(i, 350); ctx.lineTo(i, 50); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(i-5, 60); ctx.lineTo(i, 50); ctx.lineTo(i+5, 60); ctx.stroke(); // Arrows UP
    }
    ctx.fillStyle = '#0f172a'; ctx.font = 'bold 14px Arial'; ctx.fillText("Earth's Magnetic North", 150, 30);

    // Stand Top
    ctx.fillStyle = '#475569'; ctx.fillRect(cx-50, 40, 100, 10);

    if(st4_3State.activeBox !== 'none') {
        // Physics: Box Q is Magnet (aligns 0 radians). P and R are random.
        let targetAngle = st4_3State.angle; 
        if(st4_3State.activeBox === 'Q') targetAngle = 0; // Aligns N-S
        
        st4_3State.angle += (targetAngle - st4_3State.angle) * 0.05; // Smooth rotate

        ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(cx, 50); ctx.lineTo(cx, cy); ctx.stroke(); // String

        ctx.save(); ctx.translate(cx, cy); ctx.rotate(st4_3State.angle);
        ctx.fillStyle = '#64748b'; ctx.fillRect(-40, -15, 80, 30); // The Box
        ctx.fillStyle = '#fff'; ctx.font = 'bold 16px Poppins'; ctx.textAlign='center'; ctx.fillText(st4_3State.activeBox, 0, 5);
        ctx.restore();
    } else {
        ctx.fillStyle = '#94a3b8'; ctx.font = 'italic 16px Poppins'; ctx.fillText("Select a box to suspend...", 140, 200);
    }

    st4_3State.animId = requestAnimationFrame(st4_3Loop);
}

/**
 * ==========================================================================
 * SET 5 ST 1: LOST VOLTS & INTERNAL RESISTANCE
 * ==========================================================================
 */
function renderStation5_1() {
    document.getElementById('simulation-render-target').innerHTML = `
        <div class="bench-card" style="width:100%; max-width:850px; display:flex; flex-wrap:wrap; gap:20px; background:#0d1117; padding:1.5rem; border-radius:12px; border:1px solid #30363d;">
            <div style="flex:1; min-width:250px; display:flex; flex-direction:column; gap:15px;">
                <div style="background:#161b22; padding:15px; border-radius:8px; border:2px solid #30363d; display:flex; gap:10px;">
                    <div style="flex:1; text-align:center;"><div style="color:#8b949e; font-size:0.6rem; font-family:'Orbitron';">VOLTS (V)</div><div class="lcd-screen" id="st5-1-v" style="font-size:1.8rem; color:#38bdf8; padding:5px;">0.00</div></div>
                    <div style="flex:1; text-align:center;"><div style="color:#8b949e; font-size:0.6rem; font-family:'Orbitron';">AMPS (A)</div><div class="lcd-screen" id="st5-1-i" style="font-size:1.8rem; color:#ef4444; padding:5px;">0.00</div></div>
                </div>
                <div style="background:#1e293b; padding:15px; border-radius:8px; border:1px solid #334155;">
                    <button id="btn-st5-1" onclick="st5_1Toggle()" style="width:100%; background:#ef4444; color:#fff; border:none; padding:12px; border-radius:6px; font-weight:bold; cursor:pointer;">Close Switch (Connect R)</button>
                    <p style="color:#94a3b8; font-size:0.75rem; margin-top:10px;">R = 10.0 Ω.</p>
                </div>
            </div>
            <div style="flex:2; min-width:300px; background:#fff; border-radius:8px; padding:10px; display:flex; justify-content:center; border:2px solid #0f172a; overflow:hidden;">
                <canvas id="canvas-st5-1" width="450" height="350"></canvas>
            </div>
        </div>
    `;
    st5_1State.isClosed = false;
    if(st5_1State.animId) cancelAnimationFrame(st5_1State.animId); st5_1Loop();
}
function st5_1Toggle() {
    st5_1State.isClosed = !st5_1State.isClosed;
    document.getElementById('btn-st5-1').innerHTML = st5_1State.isClosed ? "Open Switch" : "Close Switch (Connect R)";
    document.getElementById('btn-st5-1').style.background = st5_1State.isClosed ? "#64748b" : "#ef4444";
}
function st5_1Loop() {
    const canvas = document.getElementById('canvas-st5-1'); if(!canvas) return;
    const ctx = canvas.getContext('2d'); ctx.clearRect(0,0, canvas.width, canvas.height);

    // Physics: I = E / (R + r). V = E - Ir.
    let I = st5_1State.isClosed ? st5_1State.E / (st5_1State.R + st5_1State.r) : 0;
    let V = st5_1State.E - (I * st5_1State.r);

    document.getElementById('st5-1-v').innerText = (V + (Math.random()*0.02-0.01)).toFixed(2);
    document.getElementById('st5-1-i').innerText = (I + (I>0?Math.random()*0.002-0.001:0)).toFixed(2);

    // Circuit Layout
    ctx.strokeStyle = '#0f172a'; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(100, 200); ctx.lineTo(100, 100); ctx.lineTo(350, 100); ctx.lineTo(350, 200); ctx.stroke(); 
    
    // Battery
    ctx.fillStyle = '#facc15'; ctx.fillRect(195, 85, 60, 30); ctx.fillStyle='#000'; ctx.font='12px Arial'; ctx.fillText('Cell', 210, 105);
    
    // Voltmeter across Battery
    ctx.strokeStyle = '#38bdf8'; ctx.beginPath(); ctx.moveTo(180, 100); ctx.lineTo(180, 50); ctx.lineTo(270, 50); ctx.lineTo(270, 100); ctx.stroke();
    ctx.fillStyle = '#1e293b'; ctx.beginPath(); ctx.arc(225, 50, 15, 0, Math.PI*2); ctx.fill(); ctx.fillStyle='#fff'; ctx.fillText('V', 221, 55);

    // Ammeter
    ctx.fillStyle = '#1e293b'; ctx.beginPath(); ctx.arc(100, 150, 15, 0, Math.PI*2); ctx.fill(); ctx.fillStyle='#fff'; ctx.fillText('A', 96, 155);

    // Switch
    ctx.fillStyle = '#b45309'; ctx.fillRect(330, 200, 40, 15);
    ctx.strokeStyle = '#ef4444'; ctx.beginPath(); ctx.moveTo(350, 200); ctx.lineTo(st5_1State.isClosed ? 350 : 330, st5_1State.isClosed ? 250 : 230); ctx.stroke();

    // Resistor
    ctx.strokeStyle = '#0f172a'; ctx.beginPath(); ctx.moveTo(100, 250); ctx.lineTo(350, 250); ctx.stroke();
    ctx.fillStyle = '#d97706'; ctx.fillRect(195, 235, 60, 30); ctx.fillStyle='#fff'; ctx.fillText('10 Ω', 210, 255);

    if(st5_1State.isClosed) {
        ctx.fillStyle = '#ef4444'; let speed = I * 10; let pos = (performance.now() * speed) % 250;
        ctx.beginPath(); ctx.arc(100 + pos, 100, 4, 0, Math.PI*2); ctx.fill(); // Flow
    }

    st5_1State.animId = requestAnimationFrame(st5_1Loop);
}

/**
 * ==========================================================================
 * SET 5 ST 2: DENSITY OF A TORUS RING
 * ==========================================================================
 */
function renderStation5_2() {
    document.getElementById('simulation-render-target').innerHTML = `
        <div class="bench-card" style="width:100%; max-width:850px; display:flex; flex-wrap:wrap; gap:20px; background:#0d1117; padding:1.5rem; border-radius:12px; border:1px solid #30363d;">
            <div style="flex:1; min-width:250px; display:flex; flex-direction:column; gap:15px;">
                <div style="background:#161b22; padding:20px; border-radius:8px; border:2px solid #30363d; text-align:center;">
                    <div class="lcd-screen" id="st5-2-lcd" style="font-size:2.5rem; color:#10b981; background:#000; padding:10px; border-radius:6px; font-weight:bold;">---</div>
                    <div id="st5-2-unit" style="color:#f59e0b; font-size:1rem; font-weight:bold; margin-top:5px;"></div>
                </div>
                <div style="background:#1e293b; padding:15px; border-radius:8px; border:1px solid #334155;">
                    <button onclick="st5_2Tool('balance')" style="width:100%; margin-bottom:8px; background:#475569; color:#fff; border:none; padding:12px; border-radius:6px; font-weight:bold; cursor:pointer;"><i class="fas fa-weight"></i> Weigh on Balance</button>
                    <button onclick="st5_2Tool('vernier1')" style="width:100%; margin-bottom:8px; background:#3b82f6; color:#fff; border:none; padding:12px; border-radius:6px; font-weight:bold; cursor:pointer;">Internal Dia (Vernier)</button>
                    <button onclick="st5_2Tool('vernier2')" style="width:100%; margin-bottom:8px; background:#3b82f6; color:#fff; border:none; padding:12px; border-radius:6px; font-weight:bold; cursor:pointer;">External Dia (Vernier)</button>
                </div>
            </div>
            <div style="flex:2; min-width:300px; background:#fff; border-radius:8px; padding:10px; display:flex; justify-content:center; align-items:center; border:2px solid #0f172a; overflow:hidden;">
                <canvas id="canvas-st5-2" width="450" height="350"></canvas>
            </div>
        </div>
    `;
    st5_2Tool('idle');
}
function st5_2Tool(tool) {
    st5_2State.tool = tool;
    if(tool==='balance') { st5_2State.disp = (st5_2State.trueM + (Math.random()*0.02-0.01)).toFixed(2); st5_2State.unit="g"; }
    else if(tool==='vernier1') { st5_2State.disp = (st5_2State.trueD1 + (Math.random()*0.04-0.02)).toFixed(2); st5_2State.unit="cm"; }
    else if(tool==='vernier2') { st5_2State.disp = (st5_2State.trueD2 + (Math.random()*0.04-0.02)).toFixed(2); st5_2State.unit="cm"; }
    else { st5_2State.disp = "---"; st5_2State.unit=""; }
    
    document.getElementById('st5-2-lcd').innerText = st5_2State.disp;
    document.getElementById('st5-2-unit').innerText = st5_2State.unit;
    if(st5_2State.animId) cancelAnimationFrame(st5_2State.animId); st5_2Loop();
}
function st5_2Loop() {
    const canvas = document.getElementById('canvas-st5-2'); if(!canvas) return;
    const ctx = canvas.getContext('2d'); ctx.clearRect(0,0, canvas.width, canvas.height);
    const cx = 225, cy = 175;

    if(st5_2State.tool === 'idle') {
        ctx.fillStyle = '#0f172a'; ctx.font = '16px Poppins'; ctx.textAlign='center'; ctx.fillText("Metal Torus (Ring)", cx, cy + 80);
    }

    // Draw Tool
    if(st5_2State.tool === 'balance') {
        ctx.fillStyle = '#cbd5e1'; ctx.fillRect(cx - 80, cy + 30, 160, 40); ctx.fillStyle = '#1e293b'; ctx.fillRect(cx - 50, cy + 20, 100, 10);
    } else if(st5_2State.tool.includes('vernier')) {
        ctx.fillStyle = '#94a3b8'; ctx.fillRect(cx - 100, cy - 80, 250, 20); // Ruler
        let jawW = st5_2State.tool === 'vernier1' ? 40 : 60; // Inner vs Outer jaws
        ctx.fillRect(cx - jawW/2 - 10, cy - 80, 10, 80); ctx.fillRect(cx + jawW/2, cy - 80, 10, 80);
    }

    // Draw Torus
    ctx.beginPath(); ctx.arc(cx, cy, 30, 0, Math.PI*2); ctx.arc(cx, cy, 20, 0, Math.PI*2, true); 
    ctx.fillStyle = '#facc15'; ctx.fill(); ctx.strokeStyle = '#b45309'; ctx.lineWidth = 2; ctx.stroke();

    st5_2State.animId = requestAnimationFrame(st5_2Loop);
}

/**
 * ==========================================================================
 * SET 5 ST 3: RESISTOR, LDR, THERMISTOR
 * ==========================================================================
 */
function renderStation5_3() {
    document.getElementById('simulation-render-target').innerHTML = `
        <div class="bench-card" style="width:100%; max-width:850px; display:flex; flex-wrap:wrap; gap:20px; background:#0d1117; padding:1.5rem; border-radius:12px; border:1px solid #30363d;">
            <div style="flex:1; min-width:250px; display:flex; flex-direction:column; gap:15px;">
                <div style="background:#161b22; padding:15px; border-radius:8px; border:2px solid #30363d; text-align:center;">
                    <div style="color:#8b949e; font-size:0.8rem; font-family:'Orbitron';">AMMETER (mA)</div>
                    <div class="lcd-screen" id="st5-3-lcd" style="font-size:3rem; color:#facc15; background:#000; padding:10px; border-radius:6px; font-weight:bold;">0.00</div>
                </div>
                <div style="background:#1e293b; padding:15px; border-radius:8px; border:1px solid #334155;">
                    <select id="st5-3-comp" onchange="st5_3Select()" style="width:100%; padding:10px; background:#0f172a; color:#fff; border:1px solid #475569; border-radius:4px; margin-bottom:15px;">
                        <option value="none">Select Component...</option>
                        <option value="A">Component A</option>
                        <option value="B">Component B</option>
                        <option value="C">Component C</option>
                    </select>
                    <button onmousedown="st5_3Env('light')" onmouseup="st5_3Env('normal')" onmouseleave="st5_3Env('normal')" ontouchstart="st5_3Env('light')" ontouchend="st5_3Env('normal')" style="width:100%; margin-bottom:8px; background:#3b82f6; color:#fff; border:none; padding:12px; border-radius:6px; font-weight:bold; cursor:pointer;"><i class="fas fa-lightbulb"></i> Hold Torchlight</button>
                    <button onmousedown="st5_3Env('heat')" onmouseup="st5_3Env('normal')" onmouseleave="st5_3Env('normal')" ontouchstart="st5_3Env('heat')" ontouchend="st5_3Env('normal')" style="width:100%; background:#ef4444; color:#fff; border:none; padding:12px; border-radius:6px; font-weight:bold; cursor:pointer;"><i class="fas fa-fire"></i> Hold Burning Candle</button>
                </div>
            </div>
            <div style="flex:2; min-width:300px; background:#fff; border-radius:8px; padding:10px; display:flex; justify-content:center; border:2px solid #0f172a; overflow:hidden;">
                <canvas id="canvas-st5-3" width="450" height="350"></canvas>
            </div>
        </div>
    `;
    st5_3Select();
}
function st5_3Select() { st5_3State.comp = document.getElementById('st5-3-comp').value; st5_3State.env = 'normal'; if(st5_3State.animId) cancelAnimationFrame(st5_3State.animId); st5_3Loop(); }
function st5_3Env(env) { st5_3State.env = env; }
function st5_3Loop() {
    const canvas = document.getElementById('canvas-st5-3'); if(!canvas) return;
    const ctx = canvas.getContext('2d'); ctx.clearRect(0,0, canvas.width, canvas.height);

    let R = Infinity;
    // Comp A = Resistor (100 ohms). Comp B = LDR (1000 dark, 50 light). Comp C = Thermistor (1000 cold, 50 hot).
    if(st5_3State.comp === 'A') { R = 100; }
    else if(st5_3State.comp === 'B') { R = st5_3State.env === 'light' ? 50 : 1000; }
    else if(st5_3State.comp === 'C') { R = st5_3State.env === 'heat' ? 50 : 1000; }

    let targetI = st5_3State.comp !== 'none' ? (1.5 / R) * 1000 : 0; // mA
    st5_3State.current += (targetI - st5_3State.current) * 0.1;
    document.getElementById('st5-3-lcd').innerText = (st5_3State.current + (st5_3State.current>1?Math.random()*0.4-0.2:0)).toFixed(2);

    // Circuit
    ctx.strokeStyle = '#0f172a'; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(100, 250); ctx.lineTo(100, 100); ctx.lineTo(350, 100); ctx.lineTo(350, 250); ctx.stroke(); 
    ctx.fillStyle = '#facc15'; ctx.fillRect(70, 200, 60, 20); ctx.fillStyle='#000'; ctx.font='12px Arial'; ctx.fillText('1.5 V', 85, 215); // Battery
    ctx.fillStyle = '#1e293b'; ctx.beginPath(); ctx.arc(225, 100, 20, 0, Math.PI*2); ctx.fill(); ctx.fillStyle='#fff'; ctx.fillText('mA', 215, 105); // Ammeter

    // Component
    if(st5_3State.comp !== 'none') {
        ctx.strokeStyle = '#3b82f6'; ctx.beginPath(); ctx.moveTo(100, 250); ctx.lineTo(180, 250); ctx.moveTo(350, 250); ctx.lineTo(270, 250); ctx.stroke();
        ctx.fillStyle = '#475569'; ctx.fillRect(180, 230, 90, 40); ctx.fillStyle='#fff'; ctx.font='bold 20px Poppins'; ctx.fillText(st5_3State.comp, 218, 257);
        
        // Environment visuals
        if(st5_3State.env === 'light') { ctx.fillStyle='rgba(250, 204, 21, 0.4)'; ctx.beginPath(); ctx.arc(225, 250, 80, 0, Math.PI*2); ctx.fill(); }
        if(st5_3State.env === 'heat') { ctx.fillStyle='rgba(239, 68, 68, 0.4)'; ctx.beginPath(); ctx.arc(225, 250, 80, 0, Math.PI*2); ctx.fill(); }

        // Flow
        if(st5_3State.current > 1) {
            ctx.fillStyle = '#ef4444'; let pos = (performance.now() * (st5_3State.current/5)) % 250;
            ctx.beginPath(); ctx.arc(100 + pos, 100, 4, 0, Math.PI*2); ctx.fill();
        }
    }

    st5_3State.animId = requestAnimationFrame(st5_3Loop);
}