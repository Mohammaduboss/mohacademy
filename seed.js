require('dotenv').config();
const mongoose = require('mongoose');
const Experiment = require('./models/Experiment');

const experimentsToInject = [
    {
        experimentCode: "M2:01",
        title: "Measuring Distances and Angles",
        subject: "Physics",
        category: "Mechanics - Lower Sixth",
        description: "Use a drawing board, protractor, and ruler to investigate the trigonometric relationship between an angle, hypotenuse, and opposite side to determine slope.",
        xpReward: 150,
        instructions: [
            "Attach the plane sheet of paper onto a drawing board using cello tape or thumb tacks provided.",
            "Draw a horizontal line, AB, of length 18 cm on the plane sheet. This line should be 14 cm from the bottom edge.",
            "Draw a perpendicular line to AB meeting it at its midpoint, O.",
            "On the first quadrant draw a line OY of length 8.0 cm to make an angle, \\theta, with the horizontal line AB.",
            "From Y, drop a perpendicular line of height h, to meet AB at X.",
            "Measure the acute angle, \\theta, that the line OY makes with AB.",
            "Vary \\theta and repeat steps 3 and 4 to obtain corresponding values of h.",
            "Plot a graph of h as ordinate and \\sin\\theta as abscissa.",
            "Determine the slope of your graph.",
            "Fasten the sheet of paper in your workbook."
        ],
        simulationSettings: { engineType: "geometry_board" },
        tableStructure: [
            { key: "h", label: "h / cm", type: "number", step: "0.1" },
            { key: "theta", label: "θ / °", type: "number", step: "1" },
            { key: "sin", label: "sin θ", type: "number", step: "0.001" }
        ],
        gradingRubric: { expectedSlope: 8.0, requiredRows: 6 }
    },
    {
        experimentCode: "M2:02",
        title: "Determining the Circular Constant, π",
        subject: "Physics",
        category: "Mechanics - Lower Sixth",
        description: "Use a vernier caliper and a metre rule to measure the diameters and circumferences of different cylindrical containers to deduce the value of π.",
        xpReward: 150,
        instructions: [
            "Using a vernier caliper measure the external diameter, d, of each coin or container.",
            "Carefully wrap a length of string or paper tape round the circumference of each container. Make an ink mark on the two portions of the string at the point where they overlap.",
            "Stretch out the string and measure the distance between the two ink marks on it. Record this distance as the circumference, C, of the container.",
            "Plot a graph of d (y-axis) against C (x-axis).",
            "Determine the slope, S, of your graph.",
            "Hence determine the value of π."
        ],
        simulationSettings: { engineType: "circular_constant" },
        tableStructure: [
            { key: "object", label: "Container", type: "text" },
            { key: "d", label: "Diameter, d / cm", type: "number", step: "0.01" },
            { key: "c", label: "Circumference, C / cm", type: "number", step: "0.1" }
        ],
        gradingRubric: {
            requiredRows: 5, expectedSlope: 0.318, slopeTolerance: 0.02,
            deductionLogic: "The theoretical relationship is C = πd. Rearranging for the graph of d vs C gives d = (1/π)C. Therefore, the slope S = 1/π, meaning π = 1/S."
        }
    },
    {
        experimentCode: "M2:03",
        title: "Measuring the Density of a Liquid",
        subject: "Physics",
        category: "Mechanics - Lower Sixth",
        description: "Determine the density of a cooking liquid by measuring its mass relative to its volume using a digital balance.",
        xpReward: 150,
        instructions: [
            "Measure the mass, M1, of the empty measuring cylinder using the digital balance.",
            "Use the valve slider to pour some liquid into the measuring cylinder. Note its exact volume, V, using the optical meniscus zoom lens.",
            "Measure the new mass, M2, of the measuring cylinder and its contents on the balance.",
            "Calculate the mass of the liquid, m (where m = M2 - M1). Fill this manually into the table.",
            "Vary V and repeat steps 2 to 4 to obtain more values of m and V.",
            "Plot a graph of m as abscissa (x-axis) against V as ordinate (y-axis).",
            "Determine the slope, S, of your graph.",
            "Hence determine the density, ρ, of the liquid."
        ],
        simulationSettings: { engineType: "liquid_density" },
        tableStructure: [
            { key: "v", label: "Volume, V / cm³", type: "number", step: "1" },
            { key: "m1", label: "Mass M1 / g", type: "number", step: "0.1" },
            { key: "m2", label: "Mass M2 / g", type: "number", step: "0.1" },
            { key: "m", label: "Mass m / g", type: "number", step: "0.1" }
        ],
        gradingRubric: {
            requiredRows: 5, expectedSlope: 1.18, slopeTolerance: 0.05,
            deductionLogic: "The theoretical relationship is density = mass/volume. Since volume V is on the y-axis and mass m is on the x-axis, the slope S equals 1/density, meaning density = 1/S."
        }
    },
    {
        experimentCode: "M2:05",
        title: "Measuring the Average Mass of a Nail",
        subject: "Physics",
        category: "Mechanics - Lower Sixth",
        description: "Determine the average mass of a nail by gathering cumulative mass readings and performing a graphical slope analysis.",
        xpReward: 150,
        instructions: [
            "Select one of the nails at random and measure its mass, M, using the balance.",
            "Measure the mass, m, of 5 of the nails.",
            "By increasing the number of nails by 5 each time, collect several values of number of nails, n, and the corresponding masses, m.",
            "Plot a graph of m (vertical axis) against n (horizontal axis).",
            "Determine the slope, S, of your graph.",
            "What is the significance of the slope, S?",
            "Compare your values obtained in 1 and 6."
        ],
        simulationSettings: { engineType: "average_mass_nails" },
        tableStructure: [
            { key: "n", label: "Number of nails, n", type: "number", step: "1" },
            { key: "m", label: "Total Mass, m / g", type: "number", step: "0.1" }
        ],
        gradingRubric: { requiredRows: 6, expectedSlope: 2.45, slopeTolerance: 0.06 }
    },
    {
        experimentCode: "M2:06A",
        title: "M2:06 Acceleration Due to Gravity (Simple Pendulum)",
        subject: "Physics",
        category: "Mechanics - Lower Sixth",
        description: "Investigate simple harmonic approximations to derive local gravitational acceleration constraints via period timing structures.",
        xpReward: 150,
        instructions: [
            "Adjust the pendulum twine length using the slider controller.",
            "Measure and record the exact length L from the midpoint clamp anchor down to the center of the bob mass.",
            "Displace the bob bob slightly (under 10 degrees) and release it to execute clean planar harmonic oscillations.",
            "Utilize the digital laboratory stopwatch tool to capture the total elapsed time duration for 20 complete oscillations.",
            "Perform this timing routine twice to securely register values for t1 and t2, then compute their arithmetic mean (t_av).",
            "Evaluate the cycle period T (t_av / 20) and calculate its square (T²).",
            "Repeat this operational sequence across 6 distinct length variations.",
            "Plot your final best-fit line of T² (y-axis) against L (x-axis) to solve for acceleration constant g."
        ],
        simulationSettings: { engineType: "simple_pendulum" },
        tableStructure: [
            { key: "l", label: "L / cm", type: "number", step: "0.1" },
            { key: "t1", label: "t1 / s", type: "number", step: "0.01" },
            { key: "t2", label: "t2 / s", type: "number", step: "0.01" },
            { key: "tav", label: "t_av / s", type: "number", step: "0.01" },
            { key: "tperiod", label: "T / s", type: "number", step: "0.01" },
            { key: "tsq", label: "T² / s²", type: "number", step: "0.01" }
        ],
        gradingRubric: { requiredRows: 6, expectedSlope: 0.0402, slopeTolerance: 0.003 }
    },
    {
        experimentCode: "M2:06B",
        title: "M2:06 Inclined Plane Kinematics",
        subject: "Physics",
        category: "Mechanics - Lower Sixth",
        description: "Analyze acceleration and determining speed limits on a variable grooved incline plane rule.",
        xpReward: 150,
        instructions: [
            "Vary the vertical prop support height (h) using the slider parameter control.",
            "Place the steel ball bearing at the marked initialization point P at the upper edge channel.",
            "Trigger the launch valve to release the ball. The system micro-gates will automatically capture rolling transit duration t.",
            "Compute the square of the duration parameter (t²) and log your values cleanly.",
            "Gather data configurations across 5 distinct elevation steps.",
            "Plot the graph of elevation h on the vertical ordinate scale against t² on the horizontal abscissa scale.",
            "Evaluate gradient S to characterize down-track velocity dynamics."
        ],
        simulationSettings: { engineType: "inclined_plane" },
        tableStructure: [
            { key: "h", label: "h / cm", type: "number", step: "0.1" },
            { key: "t", label: "Time, t / s", type: "number", step: "0.01" },
            { key: "tsq", label: "t² / s²", type: "number", step: "0.01" }
        ],
        gradingRubric: { requiredRows: 5, expectedSlope: 122.5, slopeTolerance: 10.0 }
    },
    {
        experimentCode: "M2:07",
        title: "M2:07 Loaded Cantilever Deflection Measurements",
        subject: "Physics",
        category: "Mechanics - Lower Sixth",
        description: "Investigate localized structural bending strain properties on a rule clamped cantilever supporting a shifting load.",
        xpReward: 150,
        instructions: [
            "Vary the distance position L of the 200 g solid weight block relative to the heavy table edge clamp boundary.",
            "Observe the physical structural bending strain deflection taking place along the extended wooden profile rule.",
            "Examine the vertical millimeter indicator tool to capture the rest height clearance value h down to the laboratory floor.",
            "Compile these structural reading coordinates across 6 separate distance increments.",
            "Plot the vertical rest height deflection profile h against load distribution offset link index L."
        ],
        simulationSettings: { engineType: "loaded_cantilever" },
        tableStructure: [
            { key: "l", label: "L / cm", type: "number", step: "1" },
            { key: "h", label: "Height, h / cm", type: "number", step: "0.1" }
        ],
        gradingRubric: { requiredRows: 6, expectedSlope: -0.22, slopeTolerance: 0.03 }
    },
    {
        experimentCode: "M2:08",
        title: "M2:08 Material Elasticity Analysis (Hooke's Law)",
        subject: "Physics",
        category: "Mechanics - Lower Sixth",
        description: "Validate linear stress-strain material limits on a spiral steel coil supporting incremental load weights.",
        xpReward: 150,
        instructions: [
            "Observe the initial baseline indicator position on the zero-load suspended vertical rule alignment scale.",
            "Click to add 50 g weight tokens incrementally onto the suspended pan hanger terminal loop hook.",
            "Track the corresponding extension values e produced by tracking pointer offsets directly off the rule scale.",
            "Convert total applied mass load vectors directly into downward weights forces (w = mg).",
            "Gather data matrices across 6 load scaling stages.",
            "Plot applied load weight forces w against net coil stretch distance tracking variables e to check structural spring constants."
        ],
        simulationSettings: { engineType: "hookes_law" },
        tableStructure: [
            { key: "m", label: "Mass, m / g", type: "number", step: "1" },
            { key: "w", label: "Weight, w / N", type: "number", step: "0.01" },
            { key: "ptr", label: "Pointer / cm", type: "number", step: "0.1" },
            { key: "e", label: "Extension, e / cm", type: "number", step: "0.1" }
        ],
        gradingRubric: { requiredRows: 6, expectedSlope: 0.245, slopeTolerance: 0.02 }
    },
    {
        experimentCode: "M2:09",
        title: "M2:09 Cooling a Liquid with Ice",
        subject: "Physics",
        category: "Thermal Physics",
        description: "Determine the rate of temperature drop of water when exposed to ice.",
        xpReward: 150,
        instructions: [
            "Observe the thermometer clamped vertically in the measuring cylinder.",
            "Record the initial temperature of the water at t = 0 minutes.",
            "Click 'Add Ice Lumps' to drop ice into the water and automatically start the stopwatch.",
            "Record the temperature, θ, at suitable 1-minute intervals for 10 simulation minutes.",
            "Use the Curve Tool to plot a smooth graph of θ as ordinate against t as abscissa.",
            "Determine the slope of your graph at t = 6 minutes (Draw a tangent line using the Line Tool).",
            "Record from your graph the time at which the lowest temperature was reached."
        ],
        simulationSettings: { engineType: "thermal_cooling_ice" },
        tableStructure: [
            { key: "t", label: "Time, t / min", type: "number", step: "1" },
            { key: "temp", label: "Temp, θ / °C", type: "number", step: "0.5" }
        ],
        gradingRubric: { requiredRows: 10, expectedSlope: -2.5, slopeTolerance: 1.0 }
    },
    {
        experimentCode: "H2:01",
        title: "H2:01 Heating and Cooling Curves",
        subject: "Physics",
        category: "Thermal Physics",
        description: "Plot a Newtonian cooling curve for hot water placed in a cold environment.",
        xpReward: 150,
        instructions: [
            "Observe the thermometer placed in the small beaker of hot water.",
            "Note the initial temperature of the hot water (approximately 85°C) and start the stopwatch.",
            "While the virtual stirrer agitates the water continuously, record the temperature, θ, every 1 minute for 10 minutes.",
            "Use the Curve Tool to plot a smooth graph of θ against time t.",
            "Determine the gradient of the graph when t = 3 minutes using a tangent."
        ],
        simulationSettings: { engineType: "thermal_cooling_water" },
        tableStructure: [
            { key: "t", label: "Time, t / min", type: "number", step: "1" },
            { key: "temp", label: "Temp, θ / °C", type: "number", step: "0.5" }
        ],
        gradingRubric: { requiredRows: 10, expectedSlope: -3.8, slopeTolerance: 1.5 }
    },
    {
        experimentCode: "H2:03",
        title: "H2:03 Specific Heat Transfer via Candle",
        subject: "Physics",
        category: "Thermal Physics",
        description: "Track the thermal absorption and emission of a metal can heated by a candle flame.",
        xpReward: 150,
        instructions: [
            "Record the initial temperature, θ1, of the air inside the can.",
            "Click 'Light Candle' to place the flame below the can.",
            "Record the temperature at regular 0.5 min intervals till it reaches about 100°C.",
            "Plot a smooth curve of θ1 against time, t, and calculate its gradient at t = 1.5 minutes.",
            "Click 'Extinguish & Cool' to simulate removing the heat source.",
            "Record the cooling temperature, θ2, at regular intervals.",
            "Plot a smooth cooling curve of θ2 against time, t, on the same axes."
        ],
        simulationSettings: { engineType: "thermal_heating_candle" },
        tableStructure: [
            { key: "t", label: "Time, t / min", type: "number", step: "0.5" },
            { key: "theta1", label: "Heating θ1 / °C", type: "number", step: "0.5" },
            { key: "theta2", label: "Cooling θ2 / °C", type: "number", step: "0.5" }
        ],
        gradingRubric: { requiredRows: 8, expectedSlope: 15.0, slopeTolerance: 3.0 }
    },
    {
        experimentCode: "H2:04",
        title: "H2:04 Determining the Melting Point of Candle Wax",
        subject: "Physics",
        category: "Thermal Physics",
        description: "Observe latent heat of fusion by plotting the cooling curve of liquid wax as it solidifies.",
        xpReward: 150,
        instructions: [
            "Observe the hot liquid wax (above 80°C) in the plastic cup.",
            "Start the stopwatch and stir the mixture continuously.",
            "Note its temperature, θ, at regular 1-minute intervals.",
            "Use the Curve Tool to plot a smooth graph of θ against time, t.",
            "Observe the flat plateau in your curve. This represents the latent heat release during phase change.",
            "Determine the melting point of the wax from your graph by reading the temperature at the plateau."
        ],
        simulationSettings: { engineType: "thermal_wax_melting" },
        tableStructure: [
            { key: "t", label: "Time, t / min", type: "number", step: "1" },
            { key: "temp", label: "Temp, θ / °C", type: "number", step: "0.5" }
        ],
        gradingRubric: { requiredRows: 10, expectedSlope: 60.0, slopeTolerance: 2.0, deductionLogic: "The melting point is found by reading the y-value of the horizontal plateau on the cooling curve." }
    },
    // --- PASTE THIS NEW EXPERIMENT AT THE END OF THE ARRAY ---
    {
        experimentCode: "E2:03",
        title: "E2:03 Measuring the Density of a Solid",
        subject: "Physics",
        category: "Mechanics - Lower Sixth",
        description: "Determine the density of a solid object by measuring its mass and using the displacement method to find its volume.",
        xpReward: 150,
        instructions: [
            "Select one of the solid steel blocks from the apparatus tray.",
            "Click 'Place on Balance' to measure the mass, m, of the object. Allow the scale to settle.",
            "Note the initial volume of water, V1, in the measuring cylinder using the optical zoom lens.",
            "Click 'Lower into Water' to gently submerge the object via the string.",
            "Note the new volume, V2, of the water and the submerged object.",
            "Calculate the exact volume of the object, V (where V = V2 - V1). Fill this manually into the table.",
            "Click 'Reset Apparatus' and repeat the procedure using the other available objects.",
            "Plot a graph of m (y-axis) against V (x-axis).",
            "Determine the slope, S, of the graph. This slope represents the density of the material."
        ],
        simulationSettings: { engineType: "solid_density" },
        tableStructure: [
            { key: "m", label: "Mass, m / g", type: "number", step: "0.1" },
            { key: "v1", label: "Volume V1 / cm³", type: "number", step: "1" },
            { key: "v2", label: "Volume V2 / cm³", type: "number", step: "1" },
            { key: "v", label: "Volume V / cm³", type: "number", step: "1" }
        ],
        gradingRubric: { 
            requiredRows: 5, 
            expectedSlope: 7.85, 
            slopeTolerance: 0.5, 
            deductionLogic: "The graph plots mass (y-axis) vs Volume (x-axis). The slope S = m/V. Therefore, the slope directly gives the physical quantity of Density. (Steel is approx 7.85 g/cm³)." 
        }
    },
    // --- NEW MECHANICS EXPERIMENTS (M1-01, M2-02_Elasticity, M3-03, M4-04) ---
    {
        experimentCode: "M1:01",
        title: "M1:01 Relative Density of a Liquid",
        subject: "Physics",
        category: "Mechanics",
        description: "Use Archimedes' Principle to determine the specific gravity of oil by comparing apparent weight loss in water and oil.",
        xpReward: 150,
        instructions: [
            "Select an object (Stone) from the drop-down menu.",
            "Record its weight in air, W1, from the spring balance.",
            "Click 'Immerse in Water'. Wait for the fluid to settle and record the apparent weight, W2.",
            "Click 'Immerse in Oil'. Record the apparent weight, W3.",
            "Manually calculate the apparent loss in water (U = W1 - W2) and in oil (V = W1 - W3).",
            "Repeat for all available stones.",
            "Use the Curve Tool to plot V (vertical axis) against U (horizontal axis).",
            "Determine the slope, S, which represents the relative density of the oil."
        ],
        simulationSettings: { engineType: "relative_density" },
        tableStructure: [
            { key: "w1", label: "W1 (Air) / N", type: "number", step: "0.01" },
            { key: "w2", label: "W2 (Water) / N", type: "number", step: "0.01" },
            { key: "w3", label: "W3 (Oil) / N", type: "number", step: "0.01" },
            { key: "u", label: "Loss U / N", type: "number", step: "0.01" },
            { key: "v", label: "Loss V / N", type: "number", step: "0.01" }
        ],
        gradingRubric: { requiredRows: 5, expectedSlope: 0.85, slopeTolerance: 0.05, deductionLogic: "The slope S = V/U represents the Specific Gravity (Relative Density) of the vegetable oil." }
    },
    {
        experimentCode: "M2:02_Elasticity",
        title: "M2:02 Investigating Rubber Band Elasticity",
        subject: "Physics",
        category: "Mechanics",
        description: "Determine the elastic constant of a rubber band by measuring stretch distance against applied weight.",
        xpReward: 150,
        instructions: [
            "Observe the initial vertical distance, d, of the empty rubber band loop on the ruler.",
            "Click 'Add 50g Mass' to load the cup.",
            "Adjust the clamp slider to bring the wooden bar back to perfectly horizontal.",
            "Measure the new distance, l, of the stretched rubber loop.",
            "Manually calculate the extension (l - d) in meters.",
            "Repeat by increasing the mass in 50g steps.",
            "Plot Weight (W) on the y-axis against extension (l - d) on the x-axis."
        ],
        simulationSettings: { engineType: "rubber_elasticity" },
        tableStructure: [
            { key: "m", label: "Mass / g", type: "number", step: "50" },
            { key: "w", label: "Weight W / N", type: "number", step: "0.01" },
            { key: "l", label: "Length l / cm", type: "number", step: "0.1" },
            { key: "e", label: "Ext (l-d) / m", type: "number", step: "0.001" }
        ],
        gradingRubric: { requiredRows: 5, expectedSlope: 45.0, slopeTolerance: 5.0, deductionLogic: "The slope S represents the elastic constant (stiffness) of the rubber band." }
    },
    {
        experimentCode: "M3:03",
        title: "M3:03 Young's Modulus via Cantilever",
        subject: "Physics",
        category: "Mechanics",
        description: "Determine Young's Modulus (E) by observing the vertical oscillation period of a loaded cantilever beam.",
        xpReward: 150,
        instructions: [
            "Set the load mass, m, using the controls.",
            "Click 'Displace & Release' to make the wooden cantilever perform vertical oscillations.",
            "Use the digital stopwatch to measure the time for 10 complete oscillations.",
            "Manually calculate the period, T (Time / 10), and square it (T²).",
            "Repeat for different mass values.",
            "Plot log10(T²) as ordinate against log10(m) as abscissa to find the intercept, h."
        ],
        simulationSettings: { engineType: "cantilever_oscillation" },
        tableStructure: [
            { key: "m", label: "Mass m / kg", type: "number", step: "0.01" },
            { key: "t10", label: "Time (10) / s", type: "number", step: "0.01" },
            { key: "t", label: "Period T / s", type: "number", step: "0.01" },
            { key: "logm", label: "log10(m)", type: "number", step: "0.001" },
            { key: "logt2", label: "log10(T²)", type: "number", step: "0.001" }
        ],
        gradingRubric: { requiredRows: 6, expectedSlope: 1.0, slopeTolerance: 0.1 }
    },
    {
        experimentCode: "M4:04",
        title: "M4:04 Oscillating Mass of a Helical Spring",
        subject: "Physics",
        category: "Mechanics",
        description: "Determine the effective oscillating mass of a spring by analyzing dynamic periods.",
        xpReward: 150,
        instructions: [
            "Load the spring scale pan with a known mass, m.",
            "Click 'Displace & Release' to initiate vertical harmonic oscillations.",
            "Use the stopwatch to measure the time, t, for 10 complete oscillations.",
            "Calculate the period, T.",
            "Vary the mass in the pan and repeat.",
            "Plot T² (y-axis) against m (x-axis) to find the slope S and the intercept C."
        ],
        simulationSettings: { engineType: "spring_oscillation" },
        tableStructure: [
            { key: "m", label: "Mass m / kg", type: "number", step: "0.05" },
            { key: "t10", label: "Time (10) / s", type: "number", step: "0.01" },
            { key: "t", label: "Period T / s", type: "number", step: "0.01" },
            { key: "t2", label: "T² / s²", type: "number", step: "0.01" }
        ],
        gradingRubric: { requiredRows: 5, expectedSlope: 3.9, slopeTolerance: 0.2 }
    },
    {
        experimentCode: "M6:06",
        title: "M6:06 Verifying the Principle of Moments",
        subject: "Physics",
        category: "Mechanics",
        description: "Verify the principle of moments by balancing a rigid wooden bar suspended from its midpoint.",
        xpReward: 150,
        instructions: [
            "Observe the wooden bar suspended from its midpoint O.",
            "Cup A contains a fixed mass M (100g) and is suspended at a fixed distance x (30 cm) from O.",
            "Select a mass m for Cup B.",
            "Adjust the position slider (distance l) for Cup B until the wooden bar becomes perfectly horizontal.",
            "Measure and record the horizontal distance l when balanced.",
            "Vary the mass m in Cup B and repeat the balancing procedure to obtain 7 values of m and l.",
            "Plot a graph of m as ordinate against 1/l as abscissa."
        ],
        simulationSettings: { engineType: "principle_of_moments" },
        tableStructure: [
            { key: "m", label: "Mass m / g", type: "number", step: "1" },
            { key: "l", label: "Distance l / cm", type: "number", step: "0.1" },
            { key: "inv_l", label: "1/l / cm⁻¹", type: "number", step: "0.001" }
        ],
        gradingRubric: { requiredRows: 7, expectedSlope: 3000, slopeTolerance: 100, deductionLogic: "From M*x = m*l, we get m = (M*x)*(1/l). Therefore the slope S1 = M*x = 100g * 30cm = 3000." }
    },
    {
        experimentCode: "M7:07",
        title: "M7:07 Equilibrium of Concurrent Forces",
        subject: "Physics",
        category: "Mechanics",
        description: "Investigate concurrent forces using a helical spring and string tension angles.",
        xpReward: 150,
        instructions: [
            "Observe the unloaded spring. Note its initial length L0.",
            "Place a 100g mass in the cup to find the standard extension L1.",
            "Empty the cup. Hook the lateral string to it, causing the spring to pull at an angle.",
            "Load the scale pan with varying masses (m).",
            "Use the virtual protractor and ruler to measure the new spring length (L2) and the angle (β) between the strings.",
            "Calculate Tension T using the provided equation.",
            "Plot a graph of Y = T*cos(β/2) against X = m (in kg)."
        ],
        simulationSettings: { engineType: "concurrent_forces" },
        tableStructure: [
            { key: "m", label: "Mass m / kg", type: "number", step: "0.01" },
            { key: "l2", label: "Length L2 / cm", type: "number", step: "0.1" },
            { key: "beta", label: "Angle β / °", type: "number", step: "1" },
            { key: "t", label: "Tension T / N", type: "number", step: "0.01" },
            { key: "y", label: "T*cos(β/2)", type: "number", step: "0.01" }
        ],
        gradingRubric: { requiredRows: 7, expectedSlope: 9.81, slopeTolerance: 0.5 }
    },
    {
        experimentCode: "M8:08",
        title: "M8:08 Earth's Gravitational Field (Simple Pulley)",
        subject: "Physics",
        category: "Mechanics",
        description: "Determine g using an Atwood Machine simple pulley system with unbalanced masses.",
        xpReward: 150,
        instructions: [
            "Mass B is fixed at 235g. Mass A starts at 200g. Add sand to Mass A to vary its weight.",
            "Set the difference in heights (h) between point P (Mass A) and point Q using the distance slider.",
            "Click 'Release Pulley'. The heavier mass B will pull mass A upwards.",
            "Use the automated micro-gate timer to record the time (t) taken to cover distance h.",
            "Vary h and repeat to obtain 7 readings.",
            "Plot a graph of h as ordinate against t² as abscissa."
        ],
        simulationSettings: { engineType: "simple_pulley" },
        tableStructure: [
            { key: "h", label: "Distance h / cm", type: "number", step: "0.1" },
            { key: "t", label: "Time t / s", type: "number", step: "0.01" },
            { key: "t2", label: "t² / s²", type: "number", step: "0.01" }
        ],
        gradingRubric: { requiredRows: 7, expectedSlope: 35.0, slopeTolerance: 5.0 }
    },
    {
        experimentCode: "SW1:09",
        title: "SW1:09 The Speed of Sound in Air",
        subject: "Physics",
        category: "Waves",
        description: "Use acoustic resonance in a closed PVC pipe to calculate the speed of sound and end corrections.",
        xpReward: 150,
        instructions: [
            "Select a Tuning Fork of known frequency (f).",
            "Click 'Strike Fork & Listen'. Ensure your device audio is turned ON.",
            "Slowly drag the PVC pipe upwards out of the water.",
            "Listen closely! When the exact resonance length (L) is reached, the sound will suddenly amplify (get loud).",
            "Use the background metre rule to read the length L of the air column above the water at maximum volume.",
            "Change the tuning fork and repeat to obtain 7 pairs of f and L.",
            "Plot a graph of L on the vertical axis against 1/f on the horizontal axis."
        ],
        simulationSettings: { engineType: "sound_resonance" },
        tableStructure: [
            { key: "f", label: "Freq f / Hz", type: "number", step: "1" },
            { key: "inv_f", label: "1/f / s", type: "number", step: "0.0001" },
            { key: "l", label: "Length L / cm", type: "number", step: "0.1" }
        ],
        gradingRubric: { requiredRows: 7, expectedSlope: 8575, slopeTolerance: 500, deductionLogic: "Slope = v/4. Thus Speed of Sound v = 4 * Slope." }
    },
    // --- VOL 2 MAINSTREAMS (LATENT HEAT & THIN LENSES) ---
    {
        experimentCode: "H2:11",
        title: "H2:11 Specific Latent Heat of Vaporization",
        subject: "Physics",
        category: "Thermal Physics",
        description: "Determine the specific latent heat of vaporization of water using an electrical heating coil and a top pan balance.",
        xpReward: 150,
        instructions: [
            "Observe the initial mass reading (mi) of the boiling water on the top pan balance.",
            "Click 'Power ON (1000W)' to start the heater and the stopwatch simultaneously.",
            "Watch the water vaporize. The mass will dynamically decrease.",
            "After a reasonable quantity has vaporized, click 'Power OFF'.",
            "Record the final mass (mf) and the elapsed time (t).",
            "Calculate vaporized mass m = mi - mf, and the energy supplied Pt.",
            "Repeat for various boiling durations.",
            "Plot a graph of Pt (y-axis) against m (x-axis) to find the slope S (Latent Heat)."
        ],
        simulationSettings: { engineType: "latent_vaporization" },
        tableStructure: [
            { key: "mi", label: "Initial mi / g", type: "number", step: "0.1" },
            { key: "mf", label: "Final mf / g", type: "number", step: "0.1" },
            { key: "m", label: "Mass m / kg", type: "number", step: "0.001" },
            { key: "t", label: "Time t / s", type: "number", step: "1" },
            { key: "pt", label: "Energy Pt / J", type: "number", step: "1" }
        ],
        gradingRubric: { requiredRows: 7, expectedSlope: 2260000, slopeTolerance: 100000 }
    },
    {
        experimentCode: "LW5:17",
        title: "LW5:17 Focal Length by Magnification",
        subject: "Physics",
        category: "Optics",
        description: "Determine the focal length of a converging lens by plotting magnification against image distance on an optical bench.",
        xpReward: 150,
        instructions: [
            "Set the object distance (u) using the slider.",
            "Look at the 'Screen View' monitor. Adjust the Screen Distance (v) slider until the blurred image becomes perfectly sharp.",
            "Record the sharp image distance (v).",
            "Calculate the magnification m = v/u.",
            "Vary the object distance u and repeat to obtain a series of sharp images.",
            "Plot a graph of magnification m (y-axis) against v (x-axis).",
            "Determine the slope (S) and its reciprocal (1/S) which yields the focal length."
        ],
        simulationSettings: { engineType: "optical_bench" },
        tableStructure: [
            { key: "u", label: "Object u / cm", type: "number", step: "0.1" },
            { key: "v", label: "Image v / cm", type: "number", step: "0.1" },
            { key: "mag", label: "Mag (m = v/u)", type: "number", step: "0.01" }
        ],
        gradingRubric: { requiredRows: 7, expectedSlope: 0.066, slopeTolerance: 0.01 }
    },
    {
        experimentCode: "LW6:18",
        title: "LW6:18 Minimum Distance Method (Focal Length)",
        subject: "Physics",
        category: "Optics",
        description: "Determine the focal length of a lens by finding the minimum distance between an object and its real image.",
        xpReward: 150,
        instructions: [
            "Set the object distance (u) to a value greater than the estimated focal length.",
            "Vary the screen distance (v) until a perfectly sharp image is obtained on the monitor.",
            "Measure and record u, v, and calculate the total distance OS = (u + v).",
            "Move the object to a new position u (in steps of about 10 cm) and find the new sharp screen position v.",
            "Plot a graph of Y = (u + v) against X = u (or v).",
            "Obtain the co-ordinates of the minimum turning point to calculate the focal length f."
        ],
        simulationSettings: { engineType: "optical_bench" },
        tableStructure: [
            { key: "u", label: "Object u / cm", type: "number", step: "0.1" },
            { key: "v", label: "Image v / cm", type: "number", step: "0.1" },
            { key: "uv", label: "(u + v) / cm", type: "number", step: "0.1" }
        ],
        gradingRubric: { requiredRows: 7, expectedSlope: 1.0, slopeTolerance: 0.2 }
    },
    // --- THE MISSING MAINSTREAMS (H1-10, H3-12, LW4-16) ---
    {
        experimentCode: "H1:10",
        title: "H1:10 Specific Heat Capacity of a Solid",
        subject: "Physics",
        category: "Thermal Physics",
        description: "Determine the specific heat capacity of a metal block using the method of mixtures.",
        xpReward: 150,
        instructions: [
            "Measure the mass of the metal block (ms) on the digital balance.",
            "Place the block in boiling water (100°C) and allow it to reach thermal equilibrium.",
            "Record the initial temperature of the cold water in the calorimeter (θ1).",
            "Click 'Transfer Block' to quickly move the hot block into the calorimeter.",
            "Stir the water continuously and observe the temperature rise.",
            "Record the final maximum temperature of the mixture (θ3).",
            "Repeat using different mass blocks or different initial water volumes.",
            "Plot a graph of (θ3 - θ1) against (θ2 - θ3) to determine the thermal constants."
        ],
        simulationSettings: { engineType: "calorimetry_mixture" },
        tableStructure: [
            { key: "ms", label: "Mass ms / g", type: "number", step: "0.1" },
            { key: "mw", label: "Mass mw / g", type: "number", step: "0.1" },
            { key: "theta1", label: "Cold θ1 / °C", type: "number", step: "0.1" },
            { key: "theta3", label: "Mix θ3 / °C", type: "number", step: "0.1" },
            { key: "dt_cold", label: "(θ3 - θ1)", type: "number", step: "0.1" },
            { key: "dt_hot", label: "(100 - θ3)", type: "number", step: "0.1" }
        ],
        gradingRubric: { requiredRows: 7, expectedSlope: 0.11, slopeTolerance: 0.05 }
    },
    {
        experimentCode: "H3:12",
        title: "H3:12 Verifying Heat Flow through a Boundary",
        subject: "Physics",
        category: "Thermal Physics",
        description: "Analyze coupled thermal transfer rates between two distinct bodies of water separated by a thin plastic boundary.",
        xpReward: 150,
        instructions: [
            "Observe the two thermometers. Thermometer A is in the inner cup (Hot Water ~ 70°C). Thermometer B is in the outer beaker (Cold Water ~ 25°C).",
            "Start the stopwatch. Both water bodies will begin to exchange heat across the plastic cup boundary.",
            "Record the temperatures of the hot water (θ1) and cold water (θ2) simultaneously every 1 minute.",
            "Plot a graph of θ1 and θ2 against time (t) on the SAME axes.",
            "Draw tangents and determine the respective slopes S1 and S2 at t = 3 minutes."
        ],
        simulationSettings: { engineType: "heat_flow_boundary" },
        tableStructure: [
            { key: "t", label: "Time t / min", type: "number", step: "1" },
            { key: "theta1", label: "Hot θ1 / °C", type: "number", step: "0.5" },
            { key: "theta2", label: "Cold θ2 / °C", type: "number", step: "0.5" }
        ],
        gradingRubric: { requiredRows: 7, expectedSlope: -2.5, slopeTolerance: 1.0 }
    },
    {
        experimentCode: "LW4:16",
        title: "LW4:16 Focal Length via Optical Pins (No Parallax)",
        subject: "Physics",
        category: "Optics",
        description: "Determine the focal length of a converging lens using the method of no parallax with optical pins.",
        xpReward: 150,
        instructions: [
            "Set the Object Pin (O) at a known distance u from the lens.",
            "Look through the virtual lens interface. You will see the physical Image Pin (I) and the inverted optical image of Pin O.",
            "Use the 'Move Head' slider to simulate moving your head left and right.",
            "Adjust the Image Pin distance (v) until there is NO PARALLAX (the image and the pin stay locked together when you move your head).",
            "Record u and the true image distance v.",
            "Calculate (uv) and (u + v).",
            "Plot a graph of (uv) as ordinate against (u + v) as abscissa to determine the focal length."
        ],
        simulationSettings: { engineType: "optical_parallax" },
        tableStructure: [
            { key: "u", label: "Object u / cm", type: "number", step: "0.1" },
            { key: "v", label: "Image v / cm", type: "number", step: "0.1" },
            { key: "uv", label: "uv / cm²", type: "number", step: "1" },
            { key: "u_plus_v", label: "(u+v) / cm", type: "number", step: "0.1" }
        ],
        gradingRubric: { requiredRows: 7, expectedSlope: 15.0, slopeTolerance: 1.0, deductionLogic: "The equation uv = f(u+v) forms a straight line y=mx where m = f. Therefore the slope S directly equals the focal length." }
    },
    // --- VOL 2 MAINSTREAMS (ELECTRICITY, MAGNETISM, RADIOACTIVITY) ---
    {
        experimentCode: "E1:20",
        title: "E1:20 Resistivity of a Wire",
        subject: "Physics",
        category: "Electricity",
        description: "Determine the resistivity of constantan by measuring resistance against wire length.",
        xpReward: 150,
        instructions: [
            "Observe the micrometer screw gauge reading to determine the diameter (d) of the wire.",
            "Calculate the cross-sectional area A.",
            "Drag the jockey (probe) along the constantan wire stretched over the metre rule.",
            "Measure the length (l) of the wire between the thumb tack and the jockey.",
            "Record the corresponding resistance (R) from the digital ohmmeter.",
            "Vary the length and repeat to obtain 7 pairs of l and R.",
            "Plot a graph of R (y-axis) against l (x-axis) and find the slope S."
        ],
        simulationSettings: { engineType: "elec_resistivity" },
        tableStructure: [
            { key: "l", label: "Length l / cm", type: "number", step: "0.1" },
            { key: "r", label: "Resistance R / Ω", type: "number", step: "0.01" }
        ],
        gradingRubric: { requiredRows: 7, expectedSlope: 0.15, slopeTolerance: 0.05 }
    },
    {
        experimentCode: "E3:22",
        title: "E3:22 EMF and Internal Resistance",
        subject: "Physics",
        category: "Electricity",
        description: "Determine the electromotive force and internal resistance of a power supply using a chain of resistors.",
        xpReward: 150,
        instructions: [
            "With the switch S1 closed and S2 open, record the open-circuit voltage E0.",
            "Connect the ammeter probe (S2) to junction K (1 resistor in circuit).",
            "Record the Voltage (V) and Current (I).",
            "Move the probe to the remaining junctions (L to W) to add more resistors into the series chain.",
            "At each stage, record V and I to obtain 7 pairs of readings.",
            "Plot a graph of V as ordinate against I as abscissa."
        ],
        simulationSettings: { engineType: "elec_emf" },
        tableStructure: [
            { key: "i", label: "Current I / A", type: "number", step: "0.01" },
            { key: "v", label: "Voltage V / V", type: "number", step: "0.01" }
        ],
        gradingRubric: { requiredRows: 7, expectedSlope: -5.0, slopeTolerance: 1.0, deductionLogic: "From V = E - Ir, the slope of V vs I is negative r (-Internal Resistance)." }
    },
    {
        experimentCode: "EL2:24",
        title: "EL2:24 Time Constant of a Capacitor",
        subject: "Physics",
        category: "Electricity",
        description: "Determine the time constant and capacitance of a circuit by observing exponential discharge.",
        xpReward: 150,
        instructions: [
            "Click 'Charge Capacitor' to connect the 3V battery. Wait until the voltmeter reads max voltage (V0).",
            "Click 'Discharge & Start Timer'. The capacitor will discharge through the 500kΩ resistor.",
            "Record the voltmeter reading (V) every 30 seconds for the first few minutes.",
            "Plot a graph of V as ordinate against t as abscissa.",
            "Determine the time constant (τ) from the graph (time taken for V to drop to 37% of V0)."
        ],
        simulationSettings: { engineType: "elec_capacitor" },
        tableStructure: [
            { key: "t", label: "Time t / s", type: "number", step: "1" },
            { key: "v", label: "Voltage V / V", type: "number", step: "0.01" }
        ],
        gradingRubric: { requiredRows: 7, expectedSlope: 750, slopeTolerance: 50, deductionLogic: "The Time Constant (τ) = R * C. Since R is 500kΩ, C = τ / 500kΩ." }
    },
    {
        experimentCode: "B1:25",
        title: "B1:25 Magnetic Flux Density Variation",
        subject: "Physics",
        category: "Magnetism",
        description: "Investigate how magnetic flux density varies with distance from the pole of a bar magnet.",
        xpReward: 150,
        instructions: [
            "Observe the bar magnet aligned on the grid.",
            "Use the slider to move the compass along the perpendicular line away from the magnetic pole (Distance x).",
            "At each distance, use the visual protractor to measure the angle of deflection (θ) of the compass needle.",
            "Record x and θ.",
            "Plot a graph of θ as ordinate against x as abscissa."
        ],
        simulationSettings: { engineType: "mag_flux" },
        tableStructure: [
            { key: "x", label: "Distance x / cm", type: "number", step: "0.1" },
            { key: "theta", label: "Angle θ / °", type: "number", step: "1" }
        ],
        gradingRubric: { requiredRows: 7, expectedSlope: -2.5, slopeTolerance: 1.0 }
    },
    {
        experimentCode: "B2:26",
        title: "B2:26 Overcoming Magnetic Inertia",
        subject: "Physics",
        category: "Magnetism",
        description: "Measure the critical distance required for a magnetic force to overcome the static friction of pins.",
        xpReward: 150,
        instructions: [
            "Select the number of tailor pins (n) clustered at the intersection point.",
            "Slowly slide the bar magnet towards the pins.",
            "Stop exactly when the pins snap and jump to the magnet!",
            "Measure and record this critical distance (s) between the magnet pole and the original pin location.",
            "Vary the number of pins (n) and repeat.",
            "Plot a graph of s as ordinate against 1/n as abscissa."
        ],
        simulationSettings: { engineType: "mag_inertia" },
        tableStructure: [
            { key: "n", label: "Pins n", type: "number", step: "1" },
            { key: "inv_n", label: "1/n", type: "number", step: "0.01" },
            { key: "s", label: "Distance s / cm", type: "number", step: "0.1" }
        ],
        gradingRubric: { requiredRows: 7, expectedSlope: 15.0, slopeTolerance: 5.0 }
    },
    {
        experimentCode: "R2:28",
        title: "R2:28 Radioactive Decay via Water Flow",
        subject: "Physics",
        category: "Radioactivity",
        description: "Simulate exponential radioactive decay using the flow rate of water from a burette.",
        xpReward: 150,
        instructions: [
            "Ensure the burette is filled to the 50 cm³ mark (V0).",
            "Click 'Open Tap' to start the water flow and the timer simultaneously.",
            "Record the volume flown out (V) at regular time intervals (t).",
            "Calculate the volume remaining V1 = 50 - V.",
            "Plot a graph of V1 (y-axis) against t (x-axis).",
            "Determine the half-life from the graph (time taken for V1 to reach 25 cm³)."
        ],
        simulationSettings: { engineType: "radio_burette" },
        tableStructure: [
            { key: "t", label: "Time t / s", type: "number", step: "1" },
            { key: "v", label: "Vol Flown V / cm³", type: "number", step: "0.1" },
            { key: "v1", label: "Vol Left V1 / cm³", type: "number", step: "0.1" }
        ],
        gradingRubric: { requiredRows: 7, expectedSlope: 45.0, slopeTolerance: 10.0 }
    },
    {
        experimentCode: "R1:27",
        title: "R1:27 Radioactive Decay Using Cubes",
        subject: "Physics",
        category: "Radioactivity",
        description: "Simulate half-life using 250 probabilistic cubes (dice).",
        xpReward: 150,
        instructions: [
            "Observe the 250 cubes in the tray (N0 = 250).",
            "Click 'Toss Cubes'. The engine will simulate scattering them. Cubes landing marked-side up (1-in-6 chance) will decay and vanish.",
            "Record the number of the toss (t), cubes removed, and the number of cubes remaining (N).",
            "Repeat the toss until very few cubes remain.",
            "Plot a graph of cubes remaining (N) on the vertical axis against number of tosses (t) on the horizontal axis."
        ],
        simulationSettings: { engineType: "radio_cubes" },
        tableStructure: [
            { key: "t", label: "Toss t", type: "number", step: "1" },
            { key: "rem", label: "Removed", type: "number", step: "1" },
            { key: "n", label: "Remaining N", type: "number", step: "1" }
        ],
        gradingRubric: { requiredRows: 7, expectedSlope: 3.8, slopeTolerance: 0.5 }
    },
    // --- GCE EXAM STATIONS ---
    {
        experimentCode: "S3:01",
        experimentType: "station", // THIS FLAG TRIGGERS THE LAB REPORT UI!
        title: "Station 3: Measuring Diameters",
        subject: "Physics",
        category: "Stations",
        description: "Sandbox: Use the provided apparatus to determine the density of a steel ball bearing.",
        xpReward: 200,
        instructions: [
            "This is a Station experiment. You are not provided with guided steps or a data table.",
            "Use the 'Apparatus Controls' to mount the steel ball on the different instruments.",
            "Take your own readings for mass and diameter.",
            "Scroll down to the 'Official Lab Report' section.",
            "Write out your Procedure, Observations, Calculations (Density = Mass / Volume), and Precautions.",
            "Click 'Submit Lab Report' when finished."
        ],
        simulationSettings: { engineType: "station_diameters" },
        tableStructure: [], // Stations do not use predefined tables
        gradingRubric: { 
            requiredRows: 0, 
            deductionLogic: "AI must evaluate the written text. Check if they used V = 4/3 * pi * r^3 or V = 1/6 * pi * d^3. Check if they calculated density (m/v) correctly based on their observed values. Look for precautions like 'checked for zero error on the micrometer'." 
        }
    },
    // --- NEW STATIONS ---
    {
        experimentCode: "S4:02",
        experimentType: "station",
        title: "Station 4: Salt vs Sugar Solutions (Electrolysis)",
        subject: "Physics",
        category: "Stations",
        description: "Sandbox: Distinguish between NaCl and Sugar solutions using electrical conductivity apparatus.",
        xpReward: 200,
        instructions: ["Design a test using the battery, nails, and lamp to distinguish between solution P and Q."],
        simulationSettings: { engineType: "station_electrolysis" },
        tableStructure: [],
        gradingRubric: { requiredRows: 0, deductionLogic: "AI checks if the student identified that NaCl conducts electricity (lamp lights up) while sugar does not." }
    },
    {
        experimentCode: "S7:03",
        title: "Station 7: Estimating Density of a Standard Mass",
        experimentType: "station",
        subject: "Physics",
        category: "Stations",
        description: "Sandbox: Determine the density of a standard mass using an overflow can.",
        xpReward: 200,
        instructions: ["Use the provided apparatus to determine the density of the 5g-100g mass."],
        simulationSettings: { engineType: "station_overflow_density" },
        tableStructure: [],
        gradingRubric: { requiredRows: 0, deductionLogic: "AI checks for the displacement method: capturing overflow volume and dividing mass by volume." }
    },
    {
        experimentCode: "S8:04",
        title: "Station 8: Distinguishing Magnetic Materials",
        experimentType: "station",
        subject: "Physics",
        category: "Stations",
        description: "Sandbox: Identify a permanent magnet, a ferromagnetic material, and a non-magnetic material in black boxes.",
        xpReward: 200,
        instructions: ["Perform a test on the freely hanging boxes A, B, and C to determine their contents using the bar magnet."],
        simulationSettings: { engineType: "station_magnetic_boxes" },
        tableStructure: [],
        gradingRubric: { requiredRows: 0, deductionLogic: "AI checks if student noted repulsion (permanent magnet), attraction only (ferromagnetic), and no effect (non-magnetic)." }
    },
    {
        experimentCode: "S9:05",
        title: "Station 9: Focal Length of a Converging Lens",
        experimentType: "station",
        subject: "Physics",
        category: "Stations",
        description: "Sandbox: Determine focal length using a plane mirror and no-parallax.",
        xpReward: 200,
        instructions: ["Work out a test to determine the focal length (f) using the plane mirror."],
        simulationSettings: { engineType: "station_lens_mirror" },
        tableStructure: [],
        gradingRubric: { requiredRows: 0, deductionLogic: "AI verifies the student placed the mirror behind the lens and found the point where object and image coincide (u = f)." }
    },
    {
        experimentCode: "S10:06",
        title: "Station 10: Effect of Evaporation on a Surface",
        experimentType: "station",
        subject: "Physics",
        category: "Stations",
        description: "Sandbox: Compare the cooling effect on wet vs dry thermometers.",
        xpReward: 200,
        instructions: ["Wet one thermometer bulb with spirit, fan both for 3 minutes, and record observations."],
        simulationSettings: { engineType: "station_evaporation" },
        tableStructure: [],
        gradingRubric: { requiredRows: 0, deductionLogic: "AI verifies the student noted a temperature drop in the wet thermometer due to latent heat of vaporization." }
    },
    {
        experimentCode: "S12:07",
        title: "Station 12: Radius of a Capillary Tube",
        experimentType: "station",
        subject: "Physics",
        category: "Stations",
        description: "Sandbox: Use capillary rise and surface tension to find tube radius.",
        xpReward: 200,
        instructions: ["Determine the radius of the capillary tube using the provided formula and apparatus."],
        simulationSettings: { engineType: "station_capillary" },
        tableStructure: [],
        gradingRubric: { requiredRows: 0, deductionLogic: "AI checks if student measured capillary rise height (h) and applied r = 2y / (p*h*g)." }
    },
    {
        experimentCode: "S13:08",
        title: "Station 13: Liquid Density via U-Tube",
        experimentType: "station",
        subject: "Physics",
        category: "Stations",
        description: "Sandbox: Compare pressure heights of immiscible liquids to find density.",
        xpReward: 200,
        instructions: ["Transfer liquid A and B into opposite ends of the U-tube. Determine the density of liquid B."],
        simulationSettings: { engineType: "station_utube" },
        tableStructure: [],
        gradingRubric: { requiredRows: 0, deductionLogic: "AI checks for the balancing column equation: Density_A * Height_A = Density_B * Height_B." }
    },
    {
        experimentCode: "S14:09",
        title: "Station 14: Specific Heat Capacity of Water",
        experimentType: "station",
        subject: "Physics",
        category: "Stations",
        description: "Sandbox: Use an electric heater to determine water's thermal capacity.",
        xpReward: 200,
        instructions: ["Use the heater, stopwatch, and thermometer to determine the specific heat capacity of 500 cm³ of water."],
        simulationSettings: { engineType: "station_elec_calorimetry" },
        tableStructure: [],
        gradingRubric: { requiredRows: 0, deductionLogic: "AI checks for the equation E = Pt = mcΔT." }
    },
    {
        experimentCode: "S16:10",
        title: "Station 16: First Law of Thermodynamics",
        experimentType: "station",
        subject: "Physics",
        category: "Stations",
        description: "Sandbox: Observe gas volume changes in a balloon subjected to hot and cold water.",
        xpReward: 200,
        instructions: ["Lower the balloon-fitted bottle into ice-cold water, then hot water. Record observations."],
        simulationSettings: { engineType: "station_thermo_balloon" },
        tableStructure: [],
        gradingRubric: { requiredRows: 0, deductionLogic: "AI checks if student noted the balloon deflating in cold (volume decrease) and inflating in hot (volume increase)." }
    },
    {
        experimentCode: "S17:11",
        title: "Station 17: Resistors in Series vs Parallel",
        experimentType: "station",
        subject: "Physics",
        category: "Stations",
        description: "Sandbox: Distinguish between black boxes containing series and parallel circuits.",
        xpReward: 200,
        instructions: ["Use the cell and ammeter to distinguish between the parallel and series resistor boxes."],
        simulationSettings: { engineType: "station_blackbox_circuits" },
        tableStructure: [],
        gradingRubric: { requiredRows: 0, deductionLogic: "AI checks if student noted that the parallel box draws significantly more current than the series box." }
    },
    // --- FINAL VOL 1 STATIONS ---
    {
        experimentCode: "S18:12",
        experimentType: "station",
        title: "Station 18: Determining the Density of Sand",
        subject: "Physics",
        category: "Stations",
        description: "Sandbox: Use a self-made cardboard cylinder and a balance to determine the density of dry sand.",
        xpReward: 200,
        instructions: ["Make a cylinder out of cardboard. Determine its volume.", "Use the cylinder to determine the volume of some quantity of sand.", "Determine the density of the sand."],
        simulationSettings: { engineType: "station_sand_density" },
        tableStructure: [],
        gradingRubric: { requiredRows: 0, deductionLogic: "AI verifies if student calculated volume of cylinder (pi*r^2*h) and used Density = Mass / Volume." }
    },
    {
        experimentCode: "S19:13",
        experimentType: "station",
        title: "Station 19: Measuring Resistance with an Ohmmeter",
        subject: "Physics",
        category: "Stations",
        description: "Sandbox: Use a multimeter to measure 5 different resistors labeled A to E.",
        xpReward: 200,
        instructions: ["Ensure power in the multimeter.", "Measure and record the exact resistance of each of the resistors provided (A, B, C, D, E)."],
        simulationSettings: { engineType: "station_ohmmeter_resistors" },
        tableStructure: [],
        gradingRubric: { requiredRows: 0, deductionLogic: "AI checks if the student recorded 5 distinct resistance values for A through E within acceptable noise tolerances." }
    },
    {
        experimentCode: "S21:14",
        experimentType: "station",
        title: "Station 21: Constructing and Charging a Capacitor",
        subject: "Physics",
        category: "Stations",
        description: "Sandbox: Build a parallel plate capacitor using aluminum foil, charge it, and measure the retained voltage.",
        xpReward: 200,
        instructions: ["Connect the battery to the foil faces separated by 3mm.", "After 3 minutes, disconnect the battery.", "Connect a voltmeter across the two surfaces and observe the discharge."],
        simulationSettings: { engineType: "station_build_capacitor" },
        tableStructure: [],
        gradingRubric: { requiredRows: 0, deductionLogic: "AI verifies student noted an initial voltage spike (~3V) followed by a gradual decay due to dielectric leakage." }
    },
    {
        experimentCode: "S22:15",
        experimentType: "station",
        title: "Station 22: Current Variation with Resistance",
        subject: "Physics",
        category: "Stations",
        description: "Sandbox: Distinguish between series and parallel resistor boxes using a 3V battery and a milliammeter.",
        xpReward: 200,
        instructions: ["Determine which box (A or B) contains resistors connected in parallel and which in series.", "Present your inferences based on the current readings."],
        simulationSettings: { engineType: "station_blackbox_series_parallel" },
        tableStructure: [],
        gradingRubric: { requiredRows: 0, deductionLogic: "AI verifies student concluded Parallel draws more current (lower resistance) and Series draws less current (higher resistance)." }
    },
    // --- UPPER SIXTH (VOL 2) STATIONS ---
    {
        experimentCode: "S2V1:01",
        experimentType: "station",
        title: "Station 1: Speed of Sound in Trapped Air",
        subject: "Physics",
        category: "Stations",
        description: "Sandbox: Use a tuning fork and a water column to determine the speed of sound via resonance.",
        xpReward: 200,
        instructions: ["Using the tuning fork, water, and pipe, determine the speed of sound in air at room temperature."],
        simulationSettings: { engineType: "station_v2_sound" },
        tableStructure: [],
        gradingRubric: { requiredRows: 0, deductionLogic: "AI verifies student found the resonance length and used v = 4f(L+e) or v = 4fL." }
    },
    {
        experimentCode: "S2V2:02",
        experimentType: "station",
        title: "Station 2: Grey Boxes (Resistors in Series/Parallel)",
        subject: "Physics",
        category: "Stations",
        description: "Sandbox: Distinguish between two grey boxes containing identical resistors connected in series or parallel.",
        xpReward: 200,
        instructions: ["Design and execute a test to identify the arrangement in each grey box using the multimeter and battery."],
        simulationSettings: { engineType: "station_v2_resistor_boxes" },
        tableStructure: [],
        gradingRubric: { requiredRows: 0, deductionLogic: "AI checks if student noted Parallel draws higher current / has lower resistance than Series." }
    },
    {
        experimentCode: "S2V3:03",
        experimentType: "station",
        title: "Station 3: Uncalibrated Spring Balance",
        subject: "Physics",
        category: "Stations",
        description: "Sandbox: Use an uncalibrated helical spring and standard masses to determine an unknown mass.",
        xpReward: 200,
        instructions: ["Using the pieces of apparatus provided, determine the unknown mass m2."],
        simulationSettings: { engineType: "station_v2_spring_mass" },
        tableStructure: [],
        gradingRubric: { requiredRows: 0, deductionLogic: "AI checks for proportional extension calculations: (m1 / e1) = (m2 / e2)." }
    },
    {
        experimentCode: "S2V4:04",
        experimentType: "station",
        title: "Station 4: Determining the Density of a Wire",
        subject: "Physics",
        category: "Stations",
        description: "Sandbox: Use a micrometer screw gauge, metre rule, and balance to find the density of a thin wire.",
        xpReward: 200,
        instructions: ["Determine the density of the wire given using the available instruments."],
        simulationSettings: { engineType: "station_v2_wire_density" },
        tableStructure: [],
        gradingRubric: { requiredRows: 0, deductionLogic: "AI checks if volume was calculated using pi*(d/2)^2*L and density via Mass/Volume." }
    },
    {
        experimentCode: "S2V5:05",
        experimentType: "station",
        title: "Station 5: Capacitor and Resistor Circuits",
        subject: "Physics",
        category: "Stations",
        description: "Sandbox: Distinguish between RC circuits connected in series versus parallel.",
        xpReward: 200,
        instructions: ["Design tests and execute them to identify if the capacitor and resistor are in series or parallel inside boxes A and B."],
        simulationSettings: { engineType: "station_v2_cap_res_boxes" },
        tableStructure: [],
        gradingRubric: { requiredRows: 0, deductionLogic: "AI checks if student noted Series drops to zero current (DC block) while Parallel drops to a steady, non-zero current." }
    },
    // --- UPPER SIXTH (VOL 2) BATCH 2 ---
    {
        experimentCode: "S2V6:06",
        experimentType: "station",
        title: "Set 2 Station 2: Estimating Young's Modulus",
        subject: "Physics",
        category: "Stations",
        description: "Sandbox: Use a loaded wooden bar and measure its deflection to determine Young's modulus.",
        xpReward: 200,
        instructions: ["Clamp the metre rule at the 5cm mark.", "Load standard masses and measure the deflection y.", "Calculate E using the provided formula."],
        simulationSettings: { engineType: "station_v2_youngs_modulus" },
        tableStructure: [],
        gradingRubric: { requiredRows: 0, deductionLogic: "AI checks if the student correctly applied the formula E = (4 * L^3 * W) / (y * b * d^3)." }
    },
    {
        experimentCode: "S2V7:07",
        experimentType: "station",
        title: "Set 2 Station 3: Latent Heat of Fusion of Ice",
        subject: "Physics",
        category: "Stations",
        description: "Sandbox: Determine the latent heat of fusion by dropping ice into warm water.",
        xpReward: 200,
        instructions: ["Measure warm water temp. Drop dry ice blocks into the water.", "Stir until steady. Record the final volume to determine ice mass.", "Calculate latent heat (l)."],
        simulationSettings: { engineType: "station_v2_latent_ice" },
        tableStructure: [],
        gradingRubric: { requiredRows: 0, deductionLogic: "AI verifies the heat exchange equation: Heat lost by warm water = Heat gained by melting ice + Heat gained by ice water." }
    },
    {
        experimentCode: "S2V8:08",
        experimentType: "station",
        title: "Set 2 Station 4: The Effect of a Thermoelectric e.m.f",
        subject: "Physics",
        category: "Stations",
        description: "Sandbox: Create a thermocouple using dissimilar wires and a burning candle.",
        xpReward: 200,
        instructions: ["Twist the dissimilar wires together.", "Shove the junction into the candle flame for 2 minutes and observe the microammeter."],
        simulationSettings: { engineType: "station_v2_thermoelectric" },
        tableStructure: [],
        gradingRubric: { requiredRows: 0, deductionLogic: "AI checks if student concluded that a temperature difference across junctions of dissimilar metals generates an electromotive force (Seebeck effect)." }
    },
    {
        experimentCode: "S2V9:09",
        experimentType: "station",
        title: "Set 3 Station 1: Magnetic Boxes with a Compass",
        subject: "Physics",
        category: "Stations",
        description: "Sandbox: Distinguish a magnet, a ferromagnetic material, and a non-magnetic material using a plotting compass.",
        xpReward: 200,
        instructions: ["Run tests on boxes P, Q, and R using the plotting compass without opening them."],
        simulationSettings: { engineType: "station_v2_mag_compass" },
        tableStructure: [],
        gradingRubric: { requiredRows: 0, deductionLogic: "AI verifies: Magnet causes repulsion/attraction. Ferromagnet causes attraction to both poles. Non-magnet does nothing." }
    },
    {
        experimentCode: "S2V10:10",
        experimentType: "station",
        title: "Set 3 Station 2: Thermistor vs LDR",
        subject: "Physics",
        category: "Stations",
        description: "Sandbox: Identify electrical components based on their response to thumb pressure (heat/darkness).",
        xpReward: 200,
        instructions: ["Close the switch. Hold the component tightly between your thumb and forefinger.", "Observe current changes and deduce the name of the component."],
        simulationSettings: { engineType: "station_v2_thermistor_ldr" },
        tableStructure: [],
        gradingRubric: { requiredRows: 0, deductionLogic: "AI checks: LDR current drops (darkness increases resistance). Thermistor current rises (heat lowers resistance)." }
    },
    // --- SET 4 & SET 5 STATIONS ---
    {
        experimentCode: "S4V1:01",
        experimentType: "station",
        title: "Set 4 Station 1: Internal Diameter of a Pipe",
        subject: "Physics",
        category: "Stations",
        description: "Sandbox: Use a measuring cylinder to pour specific volumes of water into a pipe to determine its internal diameter.",
        xpReward: 200,
        instructions: ["Fill the pipe with water to a determined mark.", "Measure the height h of the water.", "Determine the volume V.", "Calculate the internal diameter."],
        simulationSettings: { engineType: "station_pipe_diameter" },
        tableStructure: [],
        gradingRubric: { requiredRows: 0, deductionLogic: "AI verifies student used V = pi * r^2 * h to find radius, then multiplied by 2 for diameter." }
    },
    {
        experimentCode: "S4V2:02",
        experimentType: "station",
        title: "Set 4 Station 2: Energy in a Charged Capacitor",
        subject: "Physics",
        category: "Stations",
        description: "Sandbox: Charge a capacitor for 1.5 minutes and calculate the energy stored.",
        xpReward: 200,
        instructions: ["Close the switch to charge the capacitor.", "Open the switch after 1.5 minutes and read the voltmeter.", "Determine the energy stored."],
        simulationSettings: { engineType: "station_capacitor_energy" },
        tableStructure: [],
        gradingRubric: { requiredRows: 0, deductionLogic: "AI checks if the student correctly applied E = 0.5 * C * V^2." }
    },
    {
        experimentCode: "S4V3:03",
        experimentType: "station",
        title: "Set 4 Station 3: Earth's Magnetic Field",
        subject: "Physics",
        category: "Stations",
        description: "Sandbox: Suspend 3 grey boxes to identify the magnet by its alignment with the Earth's magnetic field.",
        xpReward: 200,
        instructions: ["Suspend boxes P, Q, and R without opening them.", "Observe their alignment to distinguish the magnet, ferromagnet, and non-magnet."],
        simulationSettings: { engineType: "station_earth_magnetic" },
        tableStructure: [],
        gradingRubric: { requiredRows: 0, deductionLogic: "AI verifies student noted the Magnet freely aligns strictly North-South, while others do not align specifically." }
    },
    {
        experimentCode: "S5V1:01",
        experimentType: "station",
        title: "Set 5 Station 1: Lost Volts & Internal Resistance",
        subject: "Physics",
        category: "Stations",
        description: "Sandbox: Measure the electromotive force and terminal potential difference to calculate internal resistance.",
        xpReward: 200,
        instructions: ["Measure the voltage across the battery with the switch open.", "Measure V and I with the switch closed.", "Determine lost volts and internal resistance."],
        simulationSettings: { engineType: "station_internal_res" },
        tableStructure: [],
        gradingRubric: { requiredRows: 0, deductionLogic: "AI checks calculations: Lost Volts = E - V. Internal Resistance r = (E - V) / I." }
    },
    {
        experimentCode: "S5V2:02",
        experimentType: "station",
        title: "Set 5 Station 2: Density of a Torus Ring",
        subject: "Physics",
        category: "Stations",
        description: "Sandbox: Use calipers and a balance to find the density of a metal torus.",
        xpReward: 200,
        instructions: ["Determine the volume of metal used in making the torus.", "Hence determine its density."],
        simulationSettings: { engineType: "station_torus_density" },
        tableStructure: [],
        gradingRubric: { requiredRows: 0, deductionLogic: "AI verifies the student used internal/external diameters to find major/minor radii, calculated Volume = 2 * pi^2 * r^2 * R, and Density = m/V." }
    },
    {
        experimentCode: "S5V3:03",
        experimentType: "station",
        title: "Set 5 Station 3: Resistor, LDR, and Thermistor",
        subject: "Physics",
        category: "Stations",
        description: "Sandbox: Subject 3 components to heat and light to identify them.",
        xpReward: 200,
        instructions: ["Expose components A, B, and C to light and heat.", "Observe changes in current to identify the Resistor, LDR, and Thermistor."],
        simulationSettings: { engineType: "station_component_id" },
        tableStructure: [],
        gradingRubric: { requiredRows: 0, deductionLogic: "AI verifies: LDR current increases under light. Thermistor current increases under heat. Resistor remains constant." }
    },
    {
  "experimentCode": "ABT:01",
  "title": "ABT. 1: Standardisation of dilute HCl acid using 0.1M NaOH solution",
  "subject": "Chemistry",
  "category": "Volumetric Analysis",
  "xpReward": 250,
  "instructions": [
    "Wash all your glassware with tap water and rinse with distilled water.",
    "Rinse and fill a clean burette with the dilute HCl acid.",
    "Rinse a clean 25-cm³ pipette with sodium hydroxide solution and pipette 25 cm³ of the base into a clean 250 ml conical flask.",
    "Add 2 - 3 drops of phenolphthalein indicator to the solution... and titrate with the HCl acid until the permanent disappearance of the pink colour.",
    "Record the results of one approximate and two accurate titrations in the table below.",
    "Rinse your conical flask with tap water and distilled water after each titration before carrying out a subsequent one."
  ],
  simulationSettings: {
            engineType: "chem_titration",
            flaskColorStart: "rgba(255, 20, 147, ", 
            flaskColorEnd: "rgba(200, 215, 230, ",
            preLabBriefing: "Welcome to the lab! For this experiment, the standard 0.1M NaOH solution and the dilute HCl have already been prepared for you. Ensure you rinse your burette properly with the acid before beginning your rough titration."
        },
  "tableStructure": {
    "headers": ["Burette readings/cm³", "Approximate", "Accurate I", "Accurate II"],
    "rows": [
      { "label": "2nd burette reading", "keys": ["rough_f", "acc1_f", "acc2_f"] },
      { "label": "1st burette reading", "keys": ["rough_i", "acc1_i", "acc2_i"] },
      { "label": "Titre/cm³", "keys": ["rough_t", "acc1_t", "acc2_t"] }
    ]
  },
  "calculationsBlock": [
    { "id": "mean_titre", "label": "Mean titre/cm³:" },
    { "id": "calc_a", "label": "a) Write a balanced chemical equation for the reaction." },
    { "id": "calc_b", "label": "b) Calculate the molarity of the dilute HCl acid." },
    { "id": "calc_c", "label": "c) Calculate the concentration of the dilute HCl acid in gdm⁻³." }
  ],
  "gradingRubric": {
    "deductionLogic": "AI must check if rough titre > accurate titres. Check mean titre calculation. Verify equation: HCl + NaOH -> NaCl + H2O. Check molarity calculation using MaVa = MbVb."
  }
},
{
        experimentCode: "ABT:02",
        title: "ABT. 2: Standardisation of Sodium Hydroxide using Sulphamic Acid",
        subject: "Chemistry",
        category: "Volumetric Analysis",
        xpReward: 250,
        instructions: [
            "Weigh accurately between 2.30 g and 2.40 g of Sulphamic acid; dissolve it in distilled water and make up to the mark.",
            "Using a suitably rinsed pipette, transfer 25 cm³ of the Sulphamic acid solution to a 250-cm³ conical flask.",
            "Add 2-3 drops of phenolphthalein indicator and titrate with Solution A (NaOH). Record the results of two careful titrations."
        ],
        simulationSettings: {
            engineType: "chem_titration",
            flaskColorStart: "rgba(200, 215, 230, ", 
            flaskColorEnd: "rgba(255, 20, 147, ",
            preLabBriefing: "Welcome to the lab! The technician has prepared your workstation. You must first record the weighing data for your Sulphamic Acid standard solution.<br><br><b>Weighing Data:</b><br>&bull; Mass of weighing bottle + acid: <b>12.35 g</b><br>&bull; Mass of empty bottle: <b>10.00 g</b><br><br>Enter these values into Table 1, calculate the exact mass, and begin your titrations."
        },
        tableStructure: {
            headers: ["Burette Readings (cm³)", "Approximate", "Accurate I", "Accurate II"],
            rows: [
                { label: "Second Burette reading", keys: ["rough_f", "acc1_f", "acc2_f"] },
                { label: "First Burette reading", keys: ["rough_i", "acc1_i", "acc2_i"] },
                { label: "Titre/cm³", keys: ["rough_t", "acc1_t", "acc2_t"] }
            ]
        },
        calculationsBlock: [
            { id: "mass_bottle_acid", label: "TABLE 1: Mass of weighing bottle + Sulphamic acid (g)" },
            { id: "mass_bottle", label: "TABLE 1: Mass of weighing bottle alone (g)" },
            { id: "mass_acid", label: "TABLE 1: Mass of Sulphamic acid (g)" },
            { id: "mean_titre", label: "Hence ........ cm³ of NaOH reacts with 25 cm³ of aqueous Sulphamic acid:" },
            { id: "calc_a", label: "a) What is the concentration of the Sulphamic acid solution?" },
            { id: "calc_b", label: "b) Calculate the concentration of the NaOH solution in moldm⁻³" },
            { id: "calc_c", label: "c) What is the concentration of the NaOH solution in gdm⁻³?" }
        ],
        gradingRubric: { deductionLogic: "Check mass difference calculation, Sulphamic acid molarity calculation (Mr=97.1), and 1:1 stoichiometry with NaOH." }
    },
    {
        experimentCode: "ABT:03",
        title: "ABT. 3: Determine the Concentration of a Diluted Solution of Hydrochloric Acid using Sodium Carbonate",
        subject: "Chemistry",
        category: "Volumetric Analysis",
        xpReward: 250,
        instructions: [
            "Accurately weigh between 2.55 g and 2.60 g of anhydrous Sodium Carbonate, dissolve in distilled water and make up to 250 cm³ in a volumetric flask.",
            "Using a pipette, place 25 cm³ of Solution B (HCl) in a 250-cm³ volumetric flask and dilute to the mark.",
            "Pipette 25 cm³ of the Sodium Carbonate solution to a 250-cm³ conical flask. Add 2-3 drops of methyl orange.",
            "Titrate with the diluted Solution B to the end-point. Record the results."
        ],
        simulationSettings: {
            engineType: "chem_titration",
            flaskColorStart: "rgba(255, 215, 0, ", 
            flaskColorEnd: "rgba(255, 69, 0, ",
            preLabBriefing: "Welcome! To determine the concentration of the diluted HCl, you first need the mass of the anhydrous Sodium Carbonate used for your standard solution.<br><br><b>Weighing Data:</b><br>&bull; Mass of weighing bottle + Na₂CO₃: <b>14.58 g</b><br>&bull; Mass of empty bottle: <b>12.00 g</b><br><br>Enter this into Table 1, calculate the exact mass, and proceed with the titration."
        },
        tableStructure: {
            headers: ["Burette Readings (cm³)", "Approximate", "Accurate I", "Accurate II"],
            rows: [
                { label: "Second Burette reading", keys: ["rough_f", "acc1_f", "acc2_f"] },
                { label: "First Burette reading", keys: ["rough_i", "acc1_i", "acc2_i"] },
                { label: "Titre/cm³", keys: ["rough_t", "acc1_t", "acc2_t"] }
            ]
        },
        calculationsBlock: [
            { id: "mass_bottle_base", label: "TABLE 1: Mass of weighing bottle + Na₂CO₃ (g)" },
            { id: "mass_bottle_alone", label: "TABLE 1: Mass of weighing bottle alone (g)" },
            { id: "mass_base", label: "TABLE 1: Mass of Na₂CO₃ (g)" },
            { id: "mean_titre", label: "Therefore ........ cm³ of diluted HCl reacts with 25 cm³ of Na₂CO₃:" },
            { id: "calc_a", label: "a) What is the concentration of the Na₂CO₃ Solution?" },
            { id: "calc_b", label: "b) Calculate the concentration of the diluted acid solution." },
            { id: "calc_c", label: "c) What is the concentration of the original acid solution?" }
        ],
        gradingRubric: { deductionLogic: "Check concentration of Na2CO3 standard. Ensure 2:1 stoichiometric ratio of HCl to Na2CO3 is applied. Check dilution factor for final calculation." }
    },
    {
        experimentCode: "ABT:04",
        title: "ABT. 4: Standardization of HCl using Aqueous Na₂CO₃ and Determination of Acetic Acid Content",
        subject: "Chemistry",
        category: "Volumetric Analysis",
        xpReward: 300,
        instructions: [
            "1. Using a pipette place 50.0 cm³ of Solution A (HCl) in a 250-cm³ volumetric flask and make up to the mark.",
            "2. Pipette 25.0 cm³ of Solution B (Na₂CO₃) into a conical flask. Add methyl orange. Titrate with diluted HCl (Record in Table 1).",
            "3. Discard the content of the volumetric flask and burette, wash and rinse.",
            "4. Transfer 1.5 cm³ of acetic acid into a 250-cm³ volumetric flask. Make up to the mark (Diluted ethanoic acid).",
            "5. Pipette 25.0 cm³ of diluted acetic acid into a conical flask. Add phenolphthalein. Titrate with Solution C (NaOH) (Record in Table 2)."
        ],
        simulationSettings: {
            engineType: "chem_titration",
            phases: [
                { name: "Part 1: Na₂CO₃ vs HCl (Methyl Orange)", start: "rgba(255, 215, 0, ", end: "rgba(255, 69, 0, " },
                { name: "Part 2: Ethanoic vs NaOH (Phenolphthalein)", start: "rgba(200, 215, 230, ", end: "rgba(255, 20, 147, " }
            ],
            preLabBriefing: "Welcome! The lab technician has already pipetted 50.0 cm³ of Solution A (HCl) into your volumetric flask and diluted it to the 250 cm³ mark. Your standard Na₂CO₃ and ethanoic acid solutions are also ready. Please proceed directly to Part 1 of your titration."
        },
        tableStructure: {
            headers: ["Burette Readings (cm³)", "Approximate", "Accurate I", "Accurate II"],
            rows: [
                { label: "TABLE 1 (HCl): 2nd burette reading", keys: ["t1_rough_f", "t1_acc1_f", "t1_acc2_f"] },
                { label: "TABLE 1 (HCl): First burette reading", keys: ["t1_rough_i", "t1_acc1_i", "t1_acc2_i"] },
                { label: "TABLE 1 (HCl): Titre/cm³", keys: ["t1_rough_t", "t1_acc1_t", "t1_acc2_t"] },
                { label: "TABLE 2 (NaOH): 2nd burette reading", keys: ["t2_rough_f", "t2_acc1_f", "t2_acc2_f"] },
                { label: "TABLE 2 (NaOH): First burette reading", keys: ["t2_rough_i", "t2_acc1_i", "t2_acc2_i"] },
                { label: "TABLE 2 (NaOH): Titre/cm³", keys: ["t2_rough_t", "t2_acc1_t", "t2_acc2_t"] }
            ]
        },
        calculationsBlock: [
            { id: "mean_t1", label: "Therefore ...... cm³ titre (t₁) of diluted HCl reacts with 25.0 cm³ of solution B:" },
            { id: "mean_t2", label: "Therefore ...... cm³ titre (t₂) of solution C reacts with 25.0 cm³ of diluted acetic acid:" },
            { id: "calc_1a", label: "1a) Calculate concentration of sodium carbonate solution B (RAM: Na=23.0, C=12.0, O=16.0)" },
            { id: "calc_1b", label: "1b) Calculate the concentration of the diluted solution A using titre t₁" },
            { id: "calc_1c", label: "1c) Calculate the concentration of the original solution A" },
            { id: "calc_2a", label: "2a) Using titre t₂, calculate the concentration of the diluted ethanoic acid" },
            { id: "calc_2b", label: "2b) Calculate the concentration in moldm⁻³ of the original acetic acid supplied" },
            { id: "calc_2c", label: "2c) Calculate percentage of water content of the acetic acid supplied (density = 1.050 gcm⁻³)" }
        ],
        gradingRubric: { deductionLogic: "Evaluate Part 1 stoichiometry (2:1 HCl to Na2CO3). Evaluate Part 2 stoichiometry (1:1 Ethanoic to NaOH). Ensure proper dilution factors are applied to both original solutions." }
    },
    {
        experimentCode: "ABT:05",
        title: "ABT. 5: Standardization of HCl using Borax and Determination of NaOH Concentration",
        subject: "Chemistry",
        category: "Volumetric Analysis",
        xpReward: 300,
        instructions: [
            "1. Weigh accurately between 4.75 g and 4.85 g of Borax. Dissolve in distilled water and make up to 250 cm³ in a volumetric flask.",
            "2. Pipette 25 cm³ of the Borax solution into a conical flask. Add methyl orange and titrate with Solution E (HCl) to end-point.",
            "3. Pipette 25 cm³ of Solution F (NaOH) into a conical flask. Add phenolphthalein and titrate with Solution E (HCl) to end-point."
        ],
        simulationSettings: {
            engineType: "chem_titration",
            phases: [
                { name: "Part 1: Borax vs HCl (Methyl Orange)", start: "rgba(255, 215, 0, ", end: "rgba(255, 69, 0, " },
                { name: "Part 2: NaOH vs HCl (Phenolphthalein)", start: "rgba(255, 20, 147, ", end: "rgba(200, 215, 230, " }
            ],
            preLabBriefing: "Welcome! You must first standardize your HCl using Borax. Here is the mass data for the Borax weighed out for your 250 cm³ standard solution:<br><br><b>Weighing Data:</b><br>&bull; Mass of weighing bottle + Borax: <b>15.80 g</b><br>&bull; Mass of empty bottle: <b>11.00 g</b><br><br>Record these in Table 1 before you begin your titrations."
        },
        tableStructure: {
            headers: ["Burette Readings (cm³)", "Approximate", "Accurate I", "Accurate II"],
            rows: [
                { label: "TABLE 2 (Borax vs HCl): Second Burette reading", keys: ["t2_rough_f", "t2_acc1_f", "t2_acc2_f"] },
                { label: "TABLE 2 (Borax vs HCl): First Burette reading", keys: ["t2_rough_i", "t2_acc1_i", "t2_acc2_i"] },
                { label: "TABLE 2 (Borax vs HCl): Titre/cm³", keys: ["t2_rough_t", "t2_acc1_t", "t2_acc2_t"] },
                { label: "TABLE 3 (NaOH vs HCl): Second Burette reading", keys: ["t3_rough_f", "t3_acc1_f", "t3_acc2_f"] },
                { label: "TABLE 3 (NaOH vs HCl): First Burette reading", keys: ["t3_rough_i", "t3_acc1_i", "t3_acc2_i"] },
                { label: "TABLE 3 (NaOH vs HCl): Titre/cm³", keys: ["t3_rough_t", "t3_acc1_t", "t3_acc2_t"] }
            ]
        },
        calculationsBlock: [
            { id: "mass_bottle_borax", label: "TABLE 1: Mass of weighing bottle + Borax (g)" },
            { id: "mass_bottle", label: "TABLE 1: Mass of weighing bottle alone (g)" },
            { id: "mass_borax", label: "TABLE 1: Mass of Borax (g)" },
            { id: "mean_t2", label: "Mean Titre for Borax (cm³):" },
            { id: "mean_t3", label: "Hence ...... cm³ of HCl reacts with 25 cm³ of Sodium hydroxide:" },
            { id: "calc_1", label: "1) What is the concentration of the Borax solution (Borax RMM = 381)?" },
            { id: "calc_2", label: "2) Calculate the concentration of the HCl solution (Uses 1:2 stoichiometry with Borax)" },
            { id: "calc_3", label: "3) Calculate the concentration of the NaOH solution" }
        ],
        gradingRubric: { deductionLogic: "Verify Borax mass subtraction. Check Borax molarity using RMM 381. Verify HCl molarity using 2:1 ratio. Verify NaOH molarity using 1:1 ratio." }
    },
    {
        experimentCode: "ABT:06",
        title: "ABT. 6: Standardization of HCl using Borax & Determination of NaOH/Na₂CO₃ Mixture",
        subject: "Chemistry",
        category: "Volumetric Analysis",
        xpReward: 350,
        instructions: [
            "1. Weigh accurately between 4.90 - 4.95 g of borax. Dissolve in distilled water and make up to the 250 cm³ mark in a volumetric flask.",
            "2. Pipette 25 cm³ of the borax to a conical flask. Add methyl orange and titrate with HCl(aq). (Record in Table 2).",
            "3. Pipette 25 cm³ of Solution Y (mixture) to a conical flask. Add methyl orange and titrate with HCl(aq). (Record in Table 3).",
            "4. Pipette 25 cm³ of Solution Y, warm to 70°C, and add 10% BaCl₂(aq) dropwise until no further precipitate is formed. Cool, add phenolphthalein, and titrate with HCl(aq). (Record in Table 4)."
        ],
        simulationSettings: {
            engineType: "chem_titration",
            phases: [
                { name: "Part 1: Borax vs HCl (Methyl Orange)", start: "rgba(255, 215, 0, ", end: "rgba(255, 69, 0, " },
                { name: "Part 2: NaOH vs HCl (Phenolphthalein)", start: "rgba(255, 20, 147, ", end: "rgba(200, 215, 230, " }
            ],
            preLabBriefing: "Welcome! You must first standardize your HCl using Borax. Here is the mass data for the Borax weighed out for your 250 cm³ standard solution:<br><br><b>Weighing Data:</b><br>&bull; Mass of weighing bottle + Borax: <b>15.80 g</b><br>&bull; Mass of empty bottle: <b>11.00 g</b><br><br>Record these in Table 1 before you begin your titrations."
        },
        tableStructure: {
            headers: ["Burette Readings", "Approximate", "Accurate 1", "Accurate 2"],
            rows: [
                { label: "TABLE 2 (Borax): 2nd burette reading / cm³", keys: ["t2_rough_f", "t2_acc1_f", "t2_acc2_f"] },
                { label: "TABLE 2 (Borax): 1st burette reading / cm³", keys: ["t2_rough_i", "t2_acc1_i", "t2_acc2_i"] },
                { label: "TABLE 2 (Borax): Titre / cm³", keys: ["t2_rough_t", "t2_acc1_t", "t2_acc2_t"] },
                { label: "TABLE 3 (Sol. Y): 2nd burette reading / cm³", keys: ["t3_rough_f", "t3_acc1_f", "t3_acc2_f"] },
                { label: "TABLE 3 (Sol. Y): 1st burette reading / cm³", keys: ["t3_rough_i", "t3_acc1_i", "t3_acc2_i"] },
                { label: "TABLE 3 (Sol. Y): Titre / cm³", keys: ["t3_rough_t", "t3_acc1_t", "t3_acc2_t"] },
                { label: "TABLE 4 (Sol. Y + BaCl₂): 2nd burette reading", keys: ["t4_rough_f", "t4_acc1_f", "t4_acc2_f"] },
                { label: "TABLE 4 (Sol. Y + BaCl₂): 1st burette reading", keys: ["t4_rough_i", "t4_acc1_i", "t4_acc2_i"] },
                { label: "TABLE 4 (Sol. Y + BaCl₂): Titre / cm³", keys: ["t4_rough_t", "t4_acc1_t", "t4_acc2_t"] }
            ]
        },
        calculationsBlock: [
            { id: "mass_bottle_borax", label: "TABLE 1: Mass of weighing bottle + borax (g)" },
            { id: "mass_empty_bottle", label: "TABLE 1: Mass of empty weighing bottle (g)" },
            { id: "mass_borax", label: "TABLE 1: Mass of borax (g)" },
            { id: "mean_v1", label: "Mean titre, V₁ (Table 2) (cm³):" },
            { id: "mean_v2", label: "Mean titre, V₂ (Table 3) (cm³):" },
            { id: "mean_v3", label: "Mean titre, V₃ (Table 4) (cm³):" },
            { id: "calc_a", label: "a) Calculate the molarity of hydrochloric acid (Uses V₁)" },
            { id: "calc_b_i", label: "b) i) Calculate molarity of NaOH(aq) in solution Y (Uses V₃)" },
            { id: "calc_b_ii", label: "b) ii) Calculate molarity of Na₂CO₃ in solution Y (Uses V₂ - V₃)" },
            { id: "calc_c_i", label: "c) i) Determine concentration in g dm⁻³ of NaOH(aq) in solution Y" },
            { id: "calc_c_ii", label: "c) ii) Determine concentration in g dm⁻³ of Na₂CO₃(aq) in solution Y" }
        ],
        gradingRubric: { deductionLogic: "Verify Table 1 mass subtraction. Check HCl molarity via Borax (V1). Check NaOH molarity using V3. Check Na2CO3 molarity using (V2-V3). Verify mass concentration conversions using NaOH=40 and Na2CO3=106." }
    },
    {
        experimentCode: "ABT:07",
        title: "ABT. 7: Determination of the Dissociation Constant of KHSO₄ and Ethanoic Acid",
        subject: "Chemistry",
        category: "Volumetric Analysis",
        xpReward: 350,
        instructions: [
            "1. Weigh accurately between 3.20 - 3.30 g KHSO₄. Dissolve and make up to 250 ml in a volumetric flask.",
            "2. Pipette 25 cm³ KHSO₄, add phenolphthalein, and titrate with NaOH ('L'). Record in Table 2.",
            "3. Pipette 25 cm³ KHSO₄ WITHOUT indicator. Run half the titre volume of NaOH from step 2, mix, and measure the pH. Record in Table 2.",
            "4. Pipette 25 cm³ ethanoic acid ('M'), add phenolphthalein, and titrate with NaOH ('L'). Record in Table 3.",
            "5. Pipette 25 cm³ ethanoic acid WITHOUT indicator. Run half the titre volume of NaOH from step 4, mix, and measure the pH. Record in Table 3."
        ],
        simulationSettings: {
            engineType: "chem_titration",
            phases: [
                { name: "Table 2: KHSO₄ vs NaOH (Phenolphthalein)", start: "rgba(200, 215, 230, ", end: "rgba(255, 20, 147, " },
                { name: "Table 3: Ethanoic Acid vs NaOH (Phenolphthalein)", start: "rgba(200, 215, 230, ", end: "rgba(255, 20, 147, " }
            ],
            preLabBriefing: "Welcome! To find the dissociation constants, you first need the mass of the KHSO₄ used for your standard solution.<br><br><b>Weighing Data:</b><br>&bull; Mass of weighing bottle + KHSO₄: <b>13.25 g</b><br>&bull; Mass of empty bottle: <b>10.00 g</b><br><br>Record this in Table 1. Ensure you take precise pH readings at your half-equivalence points!"
        },
        tableStructure: {
            headers: ["Burette Readings", "Approximate", "Accurate I", "Accurate II"],
            rows: [
                { label: "TABLE 2 (KHSO₄): 2nd burette reading / cm³", keys: ["t2_rough_f", "t2_acc1_f", "t2_acc2_f"] },
                { label: "TABLE 2 (KHSO₄): 1st burette reading / cm³", keys: ["t2_rough_i", "t2_acc1_i", "t2_acc2_i"] },
                { label: "TABLE 2 (KHSO₄): Titre / cm³", keys: ["t2_rough_t", "t2_acc1_t", "t2_acc2_t"] },
                { label: "TABLE 2 (KHSO₄): pH at half-titre", keys: ["t2_rough_ph", "t2_acc1_ph", "t2_acc2_ph"] },
                { label: "TABLE 3 (Ethanoic): 2nd burette reading / cm³", keys: ["t3_rough_f", "t3_acc1_f", "t3_acc2_f"] },
                { label: "TABLE 3 (Ethanoic): 1st burette reading / cm³", keys: ["t3_rough_i", "t3_acc1_i", "t3_acc2_i"] },
                { label: "TABLE 3 (Ethanoic): Titre / cm³", keys: ["t3_rough_t", "t3_acc1_t", "t3_acc2_t"] },
                { label: "TABLE 3 (Ethanoic): pH at half-titre", keys: ["t3_rough_ph", "t3_acc1_ph", "t3_acc2_ph"] }
            ]
        },
        calculationsBlock: [
            { id: "mass_bottle_khso4", label: "TABLE 1: Mass of weighing bottle + KHSO₄ (g)" },
            { id: "mass_bottle", label: "TABLE 1: Mass of weighing bottle (g)" },
            { id: "mass_khso4", label: "TABLE 1: Mass of KHSO₄ (g)" },
            { id: "mean_t1", label: "Mean titre (t₁) / cm³ (Table 2):" },
            { id: "ph1", label: "pH₁ (Average pH from Table 2):" },
            { id: "mean_t2", label: "Mean titre (t₂) / cm³ (Table 3):" },
            { id: "ph2", label: "pH₂ (Average pH from Table 3):" },
            { id: "calc_1", label: "1) Calculate concentration of NaOH solution 'L' using titre t₁." },
            { id: "calc_2", label: "2) Calculate concentration of ethanoic acid 'M' using titre t₂." },
            { id: "calc_3i", label: "3) i) Determine dissociation constant Ka₁ for KHSO₄ from pH₁." },
            { id: "calc_3ii", label: "3) ii) Determine dissociation constant Ka₂ for ethanoic acid from pH₂." },
            { id: "calc_3iii", label: "3) iii) Compare Ka₁ with Ka₂ to determine which is a strong acid." }
        ],
        gradingRubric: { deductionLogic: "Check KHSO4 standard molarity. Check NaOH molarity using 1:1 stoichiometry with KHSO4. Check ethanoic acid molarity using 1:1 with NaOH. Verify pKa = pH at half equivalence, so Ka = 10^-pH." }
    },
    {
        experimentCode: "ABT:08",
        title: "ABT. 8: Standardization of NaOH using Oxalic Acid and Determination of Basicity",
        subject: "Chemistry",
        category: "Volumetric Analysis",
        xpReward: 350,
        instructions: [
            "1. From a communal burette place 25.0 cm³ of solution A into a suitably rinsed 250-cm³ volumetric flask. Dilute to the mark with distilled water. This is diluted solution A.",
            "2. Using a clean pipette, transfer 25.0 cm³ of solution B (0.05 moldm⁻³ oxalic acid) into a conical flask. Add 2 or 3 drops of phenolphthalein indicator and titrate with diluted solution A. Record in Table 1.",
            "3. Using a suitably rinsed pipette place 25.0 cm³ of solution C (0.10 moldm⁻³ monoacid) in a conical flask. Add 2 or 3 drops of phenolphthalein indicator and titrate with diluted solution A. Record in Table 2."
        ],
        simulationSettings: {
            engineType: "chem_titration",
            phases: [
                { name: "Table 1: Sol. B (Oxalic Acid) vs NaOH", start: "rgba(200, 215, 230, ", end: "rgba(255, 20, 147, " },
                { name: "Table 2: Sol. C (Monoacid) vs NaOH", start: "rgba(200, 215, 230, ", end: "rgba(255, 20, 147, " }
            ],
            preLabBriefing: "Welcome! Your 0.05 moldm⁻³ oxalic acid and 0.10 moldm⁻³ monoacid solutions are prepped. The technician has already diluted 25.0 cm³ of Solution A (NaOH) into a 250 cm³ volumetric flask for you. You may proceed directly to standardizing it against Solution B."
        },
        tableStructure: {
            headers: ["Burette Readings", "Approximate", "Accurate 1", "Accurate 2"],
            rows: [
                { label: "TABLE 1 (Sol B): 2nd burette reading / cm³", keys: ["t1_rough_f", "t1_acc1_f", "t1_acc2_f"] },
                { label: "TABLE 1 (Sol B): 1st burette reading / cm³", keys: ["t1_rough_i", "t1_acc1_i", "t1_acc2_i"] },
                { label: "TABLE 1 (Sol B): Titre / cm³", keys: ["t1_rough_t", "t1_acc1_t", "t1_acc2_t"] },
                { label: "TABLE 2 (Sol C): 2nd burette reading / cm³", keys: ["t2_rough_f", "t2_acc1_f", "t2_acc2_f"] },
                { label: "TABLE 2 (Sol C): 1st burette reading / cm³", keys: ["t2_rough_i", "t2_acc1_i", "t2_acc2_i"] },
                { label: "TABLE 2 (Sol C): Titre / cm³", keys: ["t2_rough_t", "t2_acc1_t", "t2_acc2_t"] }
            ]
        },
        calculationsBlock: [
            { id: "mean_t1", label: "Therefore ...... cm³ titre (t₁) of solution A reacts with 25.0 cm³ of solution B:" },
            { id: "mean_t2", label: "Therefore ...... cm³ titre (t₂) of solution A reacts with 25.0 cm³ of solution C:" },
            { id: "calc_1a", label: "1a) The concentration of diluted solution A using the titre, t₁." },
            { id: "calc_1b", label: "1b) The concentration of the original solution A." },
            { id: "calc_2", label: "2) Using the titre t₂, calculate the number of moles of sodium hydroxide which reacted with 25.0 cm³ of solution C." },
            { id: "calc_3", label: "3) The acid B ionizes in water as follows: HₙA ⇌ nH⁺ + Aⁿ⁻. Calculate the basicity (n) of the acid, given its RMM is 126.1." }
        ],
        gradingRubric: { deductionLogic: "Check concentration of diluted NaOH. Verify stoichiometric ratio calculation for the basicity of oxalic acid (should be n=2)." }
    },
    {
        experimentCode: "ABT:09",
        title: "ABT. 9: Standardization of Acid & Determination of pH of Mixtures",
        subject: "Chemistry",
        category: "Volumetric Analysis",
        xpReward: 350,
        instructions: [
            "1. Weigh accurately between 1.30 - 1.35 g of Na₂CO₃(s). Dissolve in distilled water and make up to 250 cm³ in a volumetric flask.",
            "2. Pipette 25.0 cm³ of the aqueous Na₂CO₃ to a conical flask. Add two drops of methyl orange and titrate with acid solution A. Record in Table 1.",
            "3. Pipette 25 cm³ of solution B (base) to a 250 cm³ volumetric flask. Dilute to the mark.",
            "4. For Table 2: Mix 10 cm³ diluted solution B with varying volumes of solution A (0 to 14 cm³) and distilled water (40 down to 26 cm³). Determine the pH of each mixture."
        ],
        simulationSettings: {
            engineType: "chem_titration",
            phases: [
                { name: "Part 1: Titration (Methyl Orange)", start: "rgba(255, 215, 0, ", end: "rgba(255, 69, 0, " },
                { name: "Part 2: pH Mixtures (Universal Ind.)", start: "rgba(46, 204, 113, ", end: "rgba(231, 76, 60, " }
            ],
            preLabBriefing: "Welcome! You will be plotting the pH of various mixtures today. First, here is the mass of Na₂CO₃ used for the initial standardization phase:<br><br><b>Weighing Data:</b><br>&bull; Mass of weighing bottle + Na₂CO₃: <b>11.32 g</b><br>&bull; Mass of empty bottle: <b>10.00 g</b><br><br>Record this in your data section and proceed with the titration in Phase 1."
        },
        tableStructure: {
            headers: ["Burette/Mixture", "Approx / Set 1", "Acc 1 / Set 2", "Acc 2 / Set 3"],
            rows: [
                { label: "TABLE 1: 2nd burette reading / cm³", keys: ["t1_rough_f", "t1_acc1_f", "t1_acc2_f"] },
                { label: "TABLE 1: 1st burette reading / cm³", keys: ["t1_rough_i", "t1_acc1_i", "t1_acc2_i"] },
                { label: "TABLE 1: Titre / cm³", keys: ["t1_rough_t", "t1_acc1_t", "t1_acc2_t"] },
                { label: "TABLE 2: pH (Vol A = 0, 2, 4 cm³)", keys: ["ph_0", "ph_2", "ph_4"] },
                { label: "TABLE 2: pH (Vol A = 6, 8, 10 cm³)", keys: ["ph_6", "ph_8", "ph_10"] },
                { label: "TABLE 2: pH (Vol A = 12, 14 cm³, -)", keys: ["ph_12", "ph_14", "ph_blank"] }
            ]
        },
        calculationsBlock: [
            { id: "mass_bottle_na2co3", label: "Mass of weighing bottle + Na₂CO₃(s) (g):" },
            { id: "mass_bottle", label: "Mass of empty weighing bottle (g):" },
            { id: "mass_na2co3", label: "Mass of Na₂CO₃(s) (g):" },
            { id: "mean_t1", label: "Mean titre from Table 1 (cm³):" },
            { id: "calc_a", label: "a) Calculate molarity of acid A (2 moles acid neutralized by 1 mole Na₂CO₃, RMM=106):" },
            { id: "calc_b", label: "b) Plot graph of pH vs Volume of Solution A (Confirm completion):" },
            { id: "calc_c_i_a", label: "c) i) From graph: Is Solution A a weak or strong acid?" },
            { id: "calc_c_i_b", label: "c) i) From graph: Is Solution B a weak or strong base?" },
            { id: "calc_c_ii", label: "c) ii) Determine volume of solution A required to neutralize 10 cm³ of solution B:" }
        ],
        gradingRubric: { deductionLogic: "Check molarity of standard Na2CO3. Check acid A molarity (requires 2:1 ratio). Verify graph deductions (pH curve shape determines weak/strong)." }
    },
    {
        experimentCode: "ABT:10",
        title: "ABT. 10: Standardization of NaOH & Determination of RMM of a Dibasic Acid",
        isPremium: true,
        subject: "Chemistry",
        category: "Volumetric Analysis",
        xpReward: 350,
        instructions: [
            "1. Transfer 50.0 cm³ of solution B (NaOH) into a 250-cm³ volumetric flask and dilute to the mark. This is DILUTED SOLUTION B.",
            "2. Pipette 25.0 cm³ of solution A (0.11 moldm⁻³ Nitric acid) into a conical flask. Add phenolphthalein and titrate with diluted solution B. (Record in Table 1).",
            "3. Weigh accurately between 1.21 g and 1.30 g of solid dibasic acid C. Dissolve and make up to the 250 cm³ mark in a volumetric flask. (Record mass in Table 2).",
            "4. Pipette 25.0 cm³ of solution C into a conical flask. Add phenolphthalein and titrate with diluted solution B. (Record in Table 3)."
        ],
        simulationSettings: {
            engineType: "chem_titration",
            phases: [
                { name: "Table 1: Sol. A (Nitric Acid) vs NaOH", start: "rgba(200, 215, 230, ", end: "rgba(255, 20, 147, " },
                { name: "Table 3: Sol. C (Dibasic Acid) vs NaOH", start: "rgba(200, 215, 230, ", end: "rgba(255, 20, 147, " }
            ],
            preLabBriefing: "Welcome to the final ABT! The technician has diluted Solution B (NaOH) for you. Here is the mass data for the unknown solid dibasic acid C:<br><br><b>Weighing Data:</b><br>&bull; Mass of weighing bottle + acid C: <b>10.25 g</b><br>&bull; Mass of empty bottle: <b>9.00 g</b><br><br>Record this in Table 2. Good luck determining its Relative Molecular Mass!"
        },
        tableStructure: {
            headers: ["Burette Readings", "Approximate", "Accurate 1", "Accurate 2"],
            rows: [
                { label: "TABLE 1 (Sol A): 2nd burette reading / cm³", keys: ["t1_rough_f", "t1_acc1_f", "t1_acc2_f"] },
                { label: "TABLE 1 (Sol A): 1st burette reading / cm³", keys: ["t1_rough_i", "t1_acc1_i", "t1_acc2_i"] },
                { label: "TABLE 1 (Sol A): Titre / cm³", keys: ["t1_rough_t", "t1_acc1_t", "t1_acc2_t"] },
                { label: "TABLE 3 (Sol C): 2nd burette reading / cm³", keys: ["t3_rough_f", "t3_acc1_f", "t3_acc2_f"] },
                { label: "TABLE 3 (Sol C): 1st burette reading / cm³", keys: ["t3_rough_i", "t3_acc1_i", "t3_acc2_i"] },
                { label: "TABLE 3 (Sol C): Titre / cm³", keys: ["t3_rough_t", "t3_acc1_t", "t3_acc2_t"] }
            ]
        },
        calculationsBlock: [
            { id: "mass_bottle_c", label: "TABLE 2: Mass of weighing bottle and dibasic acid C (g):" },
            { id: "mass_bottle", label: "TABLE 2: Mass of weighing bottle alone (g):" },
            { id: "mass_c", label: "TABLE 2: Mass of dibasic acid C (g):" },
            { id: "mean_t1", label: "Therefore ...... cm³ titre (t₁) of diluted solution B reacts with 25.0 cm³ of solution A:" },
            { id: "mean_t2", label: "Therefore ...... cm³ titre (t₂) of diluted solution B reacts with 25.0 cm³ of solution C:" },
            { id: "calc_1a", label: "1a) Using the titre t₁, calculate the concentration (moldm⁻³) of the diluted solution B:" },
            { id: "calc_1b", label: "1b) Calculate the concentration of the original solution B:" },
            { id: "calc_2a", label: "2a) Using the titre t₂, calculate the concentration (moldm⁻³) of the aqueous dibasic acid C:" },
            { id: "calc_2b", label: "2b) Hence determine the molecular mass of solid C:" }
        ],
        gradingRubric: { deductionLogic: "Check concentration of diluted NaOH (1:1 with Nitric Acid). Verify concentration of original NaOH (requires correct dilution factor). Verify concentration of dibasic acid C (1:2 ratio with NaOH). Check final RMM calculation using Mass/Volume and Concentration." }
    },
    {
        experimentCode: "RT:01",
        title: "RT. 1: Standardisation of Potassium Permanganate by Sodium Oxalate",
        subject: "Chemistry",
        category: "Volumetric Analysis",
        xpReward: 350,
        instructions: [
            "1. Weigh accurately between 1.65 g to 1.75 g of Sodium Oxalate. Dissolve in distilled water in a 250 cm³ volumetric flask and make up to the mark.",
            "2. Pipette 25 cm³ of this solution into a conical flask. Add 15 cm³ of dilute Sulphuric acid.",
            "3. Heat the mixture to about 70°C and titrate the hot solution with Solution R (KMnO₄) to the end-point (permanent pale pink coloration)."
        ],
        simulationSettings: {
            engineType: "chem_titration",
            buretColor: "128, 0, 128", // Deep Purple KMnO4
            flaskColorStart: "rgba(240, 248, 255, ", // Colorless
            flaskColorEnd: "rgba(255, 182, 193, ",   // Pale Pink
            preLabBriefing: "Welcome to Redox Titrations! You will be standardizing KMnO₄. The technician has provided the initial weighing data for your standard Sodium Oxalate solution.<br><br><b>Weighing Data:</b><br>&bull; Mass of weighing bottle + Oxalate: <b>12.70 g</b><br>&bull; Mass of weighing bottle alone: <b>11.00 g</b><br><br>Record this in Table 1, calculate the exact mass, and begin your titration."
        },
        tableStructure: {
            headers: ["Burette Readings", "Approximate", "Accurate 1", "Accurate 2"],
            rows: [
                { label: "TABLE 2: 2nd burette reading / cm³", keys: ["t2_rough_f", "t2_acc1_f", "t2_acc2_f"] },
                { label: "TABLE 2: 1st burette reading / cm³", keys: ["t2_rough_i", "t2_acc1_i", "t2_acc2_i"] },
                { label: "TABLE 2: Titre / cm³", keys: ["t2_rough_t", "t2_acc1_t", "t2_acc2_t"] }
            ]
        },
        calculationsBlock: [
            { id: "mass_bottle_oxalate", label: "TABLE 1: Mass of weighing bottle + Oxalate (g):" },
            { id: "mass_bottle", label: "TABLE 1: Mass of weighing bottle alone (g):" },
            { id: "mass_oxalate", label: "TABLE 1: Mass of Oxalate used (g):" },
            { id: "mean_t2", label: "Mean titre / cm³:" },
            { id: "calc_1", label: "1) Calculate the concentration of the Oxalate solution (Molar mass Na₂C₂O₄ = 134):" },
            { id: "calc_2", label: "2) What is the concentration of the KMnO₄ solution in moldm⁻³?" },
            { id: "calc_3", label: "3) Calculate the concentration of the KMnO₄ solution in gdm⁻³:" }
        ],
        gradingRubric: { deductionLogic: "Check Oxalate molarity. Verify KMnO4 molarity using the 2:5 stoichiometry (2 MnO4- : 5 C2O4 2-). Check g/dm3 conversion using RMM of KMnO4 (158)." }
    },
    {
        experimentCode: "RT:02",
        title: "RT. 2: Standardisation of Potassium Dichromate using Ammonium Iron (II) Sulphate",
        subject: "Chemistry",
        category: "Volumetric Analysis",
        xpReward: 350,
        instructions: [
            "1. Weigh out accurately between 0.74 g and 0.84 g of Potassium Dichromate (K₂Cr₂O₇). Dissolve and make up to 250 cm³ in a volumetric flask.",
            "2. Pipette 25 cm³ of the Fe(NH₄)₂(SO₄)₂·6H₂O solution into a conical flask.",
            "3. Add 15 cm³ of dilute sulphuric acid to the conical flask.",
            "4. Titrate the mixture against K₂Cr₂O₇ solution from the burette to a permanent pale green coloration."
        ],
        simulationSettings: {
            engineType: "chem_titration",
            buretColor: "255, 140, 0", // Bright Orange K2Cr2O7
            flaskColorStart: "rgba(240, 248, 255, ", // Colorless/Faint green
            flaskColorEnd: "rgba(143, 188, 143, ",   // Pale Green
            preLabBriefing: "Welcome! For this experiment, Potassium Dichromate (K₂Cr₂O₇) acts as your oxidizing agent. Here is the weighing data for your standard solution:<br><br><b>Weighing Data:</b><br>&bull; Mass of weighing bottle + K₂Cr₂O₇: <b>10.80 g</b><br>&bull; Mass of empty bottle: <b>10.00 g</b><br><br>Record this in Table 1 and proceed to find the concentration of the Iron (II) salt."
        },
        tableStructure: {
            headers: ["Burette Readings", "Approximate", "Accurate I", "Accurate II"],
            rows: [
                { label: "TABLE 2: 2nd burette reading / cm³", keys: ["t2_rough_f", "t2_acc1_f", "t2_acc2_f"] },
                { label: "TABLE 2: 1st burette reading / cm³", keys: ["t2_rough_i", "t2_acc1_i", "t2_acc2_i"] },
                { label: "TABLE 2: Titre / cm³", keys: ["t2_rough_t", "t2_acc1_t", "t2_acc2_t"] }
            ]
        },
        calculationsBlock: [
            { id: "mass_bottle_k2cr2o7", label: "TABLE 1: Mass of weighing bottle + K₂Cr₂O₇ (g):" },
            { id: "mass_bottle", label: "TABLE 1: Mass of weighing bottle (g):" },
            { id: "mass_k2cr2o7", label: "TABLE 1: Mass of K₂Cr₂O₇ (g):" },
            { id: "mean_t2", label: "Mean titre / cm³:" },
            { id: "calc_1a", label: "1a) Calculate the concentration of K₂Cr₂O₇ in moldm⁻³:" },
            { id: "calc_1b", label: "1b) Calculate the concentration of K₂Cr₂O₇ in gdm⁻³:" },
            { id: "calc_2a", label: "2a) Calculate the concentration of Fe²⁺ salt in moldm⁻³ (Uses 1:6 stoichiometry):" },
            { id: "calc_2b", label: "2b) Calculate the concentration of Fe²⁺ salt in gdm⁻³:" }
        ],
        gradingRubric: { deductionLogic: "Check K2Cr2O7 mass and molarity. Verify Fe2+ molarity using the 1:6 stoichiometry from the provided redox equation." }
    },
    {
        experimentCode: "RT:03",
        title: "RT. 3: Standardisation of KMnO₄ & Determination of Ethanedioic Acid",
        subject: "Chemistry",
        category: "Volumetric Analysis",
        xpReward: 350,
        instructions: [
            "1. Weigh 4.80 - 4.85 g of ammonium iron (II) sulphate. Dissolve in dilute H₂SO₄ and make up to 250 cm³ in a volumetric flask.",
            "2. Pipette 25 cm³ of the iron (II) solution to a conical flask, add 20 cm³ dilute H₂SO₄, and titrate with KMnO₄ to a pale pink color (Record in Table 1).",
            "3. Pipette 25 cm³ of oxalic acid into a conical flask, add 20 cm³ dilute H₂SO₄, heat to 70°C, and titrate with KMnO₄ to a pale pink color (Record in Table 2)."
        ],
        simulationSettings: {
            engineType: "chem_titration",
            phases: [
                { name: "Table 1: Iron (II) Sulphate vs KMnO₄", buretColor: "128, 0, 128", start: "rgba(240, 248, 255, ", end: "rgba(255, 182, 193, " },
                { name: "Table 2: Oxalic Acid vs KMnO₄", buretColor: "128, 0, 128", start: "rgba(240, 248, 255, ", end: "rgba(255, 182, 193, " }
            ],
            preLabBriefing: "Welcome! You will be using KMnO₄ for two different titrations today. The technician has provided the mass of the Ammonium Iron (II) Sulphate used to standardize your KMnO₄.<br><br><b>Weighing Data:</b><br>&bull; Mass of weighing bottle + Iron (II) salt: <b>14.82 g</b><br>&bull; Mass of empty bottle: <b>10.00 g</b><br><br>Record this under DATA, and use the Phase Selector to complete both tables."
        },
        tableStructure: {
            headers: ["Burette Readings", "Approximate", "Accurate 1", "Accurate 2"],
            rows: [
                { label: "TABLE 1 (Fe²⁺): 2nd burette reading / cm³", keys: ["t1_rough_f", "t1_acc1_f", "t1_acc2_f"] },
                { label: "TABLE 1 (Fe²⁺): 1st burette reading / cm³", keys: ["t1_rough_i", "t1_acc1_i", "t1_acc2_i"] },
                { label: "TABLE 1 (Fe²⁺): Titre / cm³", keys: ["t1_rough_t", "t1_acc1_t", "t1_acc2_t"] },
                { label: "TABLE 2 (Oxalic): 2nd burette reading / cm³", keys: ["t2_rough_f", "t2_acc1_f", "t2_acc2_f"] },
                { label: "TABLE 2 (Oxalic): 1st burette reading / cm³", keys: ["t2_rough_i", "t2_acc1_i", "t2_acc2_i"] },
                { label: "TABLE 2 (Oxalic): Titre / cm³", keys: ["t2_rough_t", "t2_acc1_t", "t2_acc2_t"] }
            ]
        },
        calculationsBlock: [
            { id: "mass_bottle_iron", label: "DATA: Mass of weighing bottle + iron (II) salt (g):" },
            { id: "mass_bottle", label: "DATA: Mass of weighing bottle alone (g):" },
            { id: "mass_iron", label: "DATA: Mass of iron (II) salt (g):" },
            { id: "mean_t1", label: "Mean titre, t₁ (cm³):" },
            { id: "mean_t2", label: "Mean titre, t₂ (cm³):" },
            { id: "calc_a", label: "a) Calculate the molarity of the KMnO₄ solution (Uses 1:5 stoichiometry with Fe²⁺):" },
            { id: "calc_bi", label: "b) i) Calculate the concentration of oxalic acid in moldm⁻³ (Uses 2:5 stoichiometry with KMnO₄):" },
            { id: "calc_bii", label: "b) ii) Calculate the concentration of oxalic acid in g/dm³:" },
            { id: "calc_c", label: "c) Why must the oxalic acid be hot on titration with the KMnO₄ solution?" }
        ],
        gradingRubric: { deductionLogic: "Check Fe2+ standard molarity. Verify KMnO4 molarity using Table 1 (1:5 ratio). Verify Oxalic Acid molarity using Table 2 (5:2 ratio). Verify explanation for heating (activation energy/kinetic speed of reaction)." }
    },
    {
        experimentCode: "RT:04",
        title: "RT. 4: Standardize Permanganate & Determine Concentration of Ammonium Iron (II) Sulphate",
        subject: "Chemistry",
        category: "Volumetric Analysis",
        xpReward: 350,
        instructions: [
            "1. Accurately weigh between 1.60 g and 1.80 g of sodium oxalate, dissolve and make up to 250 cm³ in a volumetric flask.",
            "2. Pipette 25 cm³ of the oxalate solution, add 15 cm³ dilute H₂SO₄, heat to 70°C, and titrate with Solution P (KMnO₄). (Record in Table 2).",
            "3. Pipette 25 cm³ of Solution Q (Fe²⁺), add 15 cm³ dilute H₂SO₄, and titrate with Solution P (KMnO₄). (Record in Table 3)."
        ],
        simulationSettings: {
            engineType: "chem_titration",
            phases: [
                { name: "Table 2: Sodium Oxalate vs KMnO₄", buretColor: "128, 0, 128", start: "rgba(240, 248, 255, ", end: "rgba(255, 182, 193, " },
                { name: "Table 3: Solution Q (Fe²⁺) vs KMnO₄", buretColor: "128, 0, 128", start: "rgba(240, 248, 255, ", end: "rgba(255, 182, 193, " }
            ],
            preLabBriefing: "Welcome! Today you will standardize KMnO₄ using Sodium Oxalate, then use it to find the concentration of an unknown Fe²⁺ solution. Here is your initial weighing data:<br><br><b>Weighing Data:</b><br>&bull; Mass of weighing bottle + Sodium oxalate: <b>11.70 g</b><br>&bull; Mass of weighing bottle alone: <b>10.00 g</b><br><br>Record this in Table 1, and use the Phase Selector to manage your tables."
        },
        tableStructure: {
            headers: ["Burette Readings", "Approximate", "Accurate 1", "Accurate 2"],
            rows: [
                { label: "TABLE 2 (Oxalate): 2nd burette reading", keys: ["t2_rough_f", "t2_acc1_f", "t2_acc2_f"] },
                { label: "TABLE 2 (Oxalate): 1st burette reading", keys: ["t2_rough_i", "t2_acc1_i", "t2_acc2_i"] },
                { label: "TABLE 2 (Oxalate): Titre/cm³", keys: ["t2_rough_t", "t2_acc1_t", "t2_acc2_t"] },
                { label: "TABLE 3 (Fe²⁺): 2nd burette reading", keys: ["t3_rough_f", "t3_acc1_f", "t3_acc2_f"] },
                { label: "TABLE 3 (Fe²⁺): 1st burette reading", keys: ["t3_rough_i", "t3_acc1_i", "t3_acc2_i"] },
                { label: "TABLE 3 (Fe²⁺): Titre/cm³", keys: ["t3_rough_t", "t3_acc1_t", "t3_acc2_t"] }
            ]
        },
        calculationsBlock: [
            { id: "mass_bottle_oxalate", label: "TABLE 1: Mass of weighing bottle + Sodium oxalate (g):" },
            { id: "mass_bottle", label: "TABLE 1: Mass of weighing bottle (g):" },
            { id: "mass_oxalate", label: "TABLE 1: Mass of Sodium oxalate (g):" },
            { id: "mean_t2", label: "Mean titre (Table 2) / cm³:" },
            { id: "mean_t3", label: "Mean titre (Table 3) / cm³:" },
            { id: "calc_a", label: "a) Calculate the concentration in moldm⁻³ of the sodium oxalate solution (RMM = 134):" },
            { id: "calc_b", label: "b) Calculate the concentration of KMnO₄ in moldm⁻³ (Uses 2:5 stoichiometry with Oxalate):" },
            { id: "calc_ci", label: "c) i) Calculate the concentration of Iron (II) salt solution in moldm⁻³ (Uses 1:5 stoichiometry):" },
            { id: "calc_cii", label: "c) ii) Calculate the concentration of Iron (II) salt solution in gdm⁻³:" },
            { id: "calc_d", label: "d) Calculate the percentage of Fe²⁺ in the Iron (II) salt:" }
        ],
        gradingRubric: { deductionLogic: "Check Oxalate standard molarity. Check KMnO4 molarity from Table 2 (2:5 ratio). Check Fe2+ molarity from Table 3 (5:1 ratio with KMnO4). Verify mass percentage calculation." }
    },
    {
        experimentCode: "RT:05",
        title: "RT. 5: Standardisation of Sodium Thiosulphate using Dichromate",
        subject: "Chemistry",
        category: "Volumetric Analysis",
        xpReward: 350,
        instructions: [
            "1. Fill a clean burette with sodium thiosulphate solution.",
            "2. Pipette 25 cm³ of K₂CrO₄ solution into a 250-mL conical flask.",
            "3. Add 10 cm³ of dilute sulphuric acid followed by 10 cm³ of KI solution. Swirl for 10 seconds. (The solution turns dark brown due to the I₃⁻ complex).",
            "4. Titrate the mixture against Na₂S₂O₃ until the color becomes pale yellow.",
            "5. Add 2 cm³ of starch solution (turns dark blue). Continue titration until the blue-black color is discharged, leaving a pale green Cr³⁺ end point."
        ],
        simulationSettings: {
            engineType: "chem_titration",
            flaskColorStart: "rgba(0, 0, 139, ", 
            flaskColorEnd: "rgba(143, 188, 143, ",
            preLabBriefing: "Welcome to Iodometric Titrations! The standard K₂CrO₄ and KI solutions are prepped. <br><br><b>Color Guide:</b> The iodine generated will turn the flask dark brown. As you titrate with thiosulphate, it will fade to pale yellow. In a real lab, you add starch here to turn it dark blue-black. <br><br>For this simulation, the flask will start <b>Dark Blue</b> and you must titrate until it perfectly clears to the <b>Pale Green</b> of the Cr³⁺ ions."
        },
        tableStructure: {
            headers: ["Burette Readings/cm³", "Approximate", "Accurate I", "Accurate II"],
            rows: [
                { label: "2nd burette reading", keys: ["t1_rough_f", "t1_acc1_f", "t1_acc2_f"] },
                { label: "1st burette reading", keys: ["t1_rough_i", "t1_acc1_i", "t1_acc2_i"] },
                { label: "Titre", keys: ["t1_rough_t", "t1_acc1_t", "t1_acc2_t"] }
            ]
        },
        calculationsBlock: [
            { id: "mean_t1", label: "Mean titre (cm³):" },
            { id: "calc_1", label: "1. Establish a mole relationship between the CrO₄²⁻ and S₂O₃²⁻ in acidic medium." },
            { id: "calc_2", label: "2. Calculate the concentration of Na₂S₂O₃ in moldm⁻³ and gdm⁻³." },
            { id: "calc_3", label: "3. Calculate the number of moles of sodium thiosulphate that is run into the flask during the titration." },
            { id: "calc_4", label: "4. Use the number of moles calculated in 3 above to calculate the number of moles of iodine generated in the titration flask." }
        ],
        gradingRubric: { deductionLogic: "Verify stoichiometry: 1 mole CrO4(2-) reacts with 3 moles S2O3(2-). Check concentration calculations." }
    },
    {
        experimentCode: "RT:06",
        title: "RT. 6: Standardisation of Thiosulphate (via Peroxodisulphate) and KMnO₄ (via Ethanedioate)",
        subject: "Chemistry",
        category: "Volumetric Analysis",
        xpReward: 350,
        instructions: [
            "1. Pipette 25 cm³ of solution G (K₂S₂O₈) into a conical flask. Add 10 cm³ solution F (KI). Titrate with solution H (thiosulphate) until pale yellow. Add starch and titrate to colorless. (Record in Table 1).",
            "2. Weigh accurately 1.60 g - 1.70 g of solid L (ethanedioate). Dissolve and make up to 250 cm³. (Record in Table 2).",
            "3. Pipette 25 cm³ of solution L, add 15 cm³ dilute H₂SO₄, heat to 70°C, and titrate with Solution M (KMnO₄) until a permanent pale pink color is obtained. (Record in Table 3)."
        ],
        simulationSettings: {
            engineType: "chem_titration",
            phases: [
                { name: "Table 1: Iodine vs Thiosulphate (Starch)", start: "rgba(0, 0, 139, ", end: "rgba(255, 255, 255, " },
                { name: "Table 3: Ethanedioate vs KMnO₄", start: "rgba(240, 248, 255, ", end: "rgba(255, 182, 193, " }
            ],
            preLabBriefing: "Welcome! You have two distinct redox titrations to perform today. First, an iodometric titration (Table 1). Second, standardizing KMnO₄ using an ethanedioate salt. Here is the weighing data for Solid L:<br><br><b>Weighing Data:</b><br>&bull; Mass of weighing bottle + Solid L: <b>12.65 g</b><br>&bull; Mass of weighing bottle: <b>11.00 g</b><br><br>Record this in Table 2 and use the Phase Selector to switch between reactions."
        },
        tableStructure: {
            headers: ["Burette Readings", "Approximate", "Accurate", "Accurate"],
            rows: [
                { label: "TABLE 1: 2nd burette reading /cm³", keys: ["t1_rough_f", "t1_acc1_f", "t1_acc2_f"] },
                { label: "TABLE 1: 1st burette reading /cm³", keys: ["t1_rough_i", "t1_acc1_i", "t1_acc2_i"] },
                { label: "TABLE 1: Titre /cm³", keys: ["t1_rough_t", "t1_acc1_t", "t1_acc2_t"] },
                { label: "TABLE 3: 2nd burette reading /cm³", keys: ["t3_rough_f", "t3_acc1_f", "t3_acc2_f"] },
                { label: "TABLE 3: 1st burette reading /cm³", keys: ["t3_rough_i", "t3_acc1_i", "t3_acc2_i"] },
                { label: "TABLE 3: Titre /cm³", keys: ["t3_rough_t", "t3_acc1_t", "t3_acc2_t"] }
            ]
        },
        calculationsBlock: [
            { id: "mass_bottle_l", label: "TABLE 2: Mass of weighing bottle + solid L (g):" },
            { id: "mass_bottle", label: "TABLE 2: Mass of weighing bottle (g):" },
            { id: "mass_l", label: "TABLE 2: Mass of solid L (g):" },
            { id: "mean_t1", label: "Mean titre (t₁) for Sol. H vs Sol. G (cm³):" },
            { id: "mean_t2", label: "Mean titre (t₂) for Sol. M vs Sol. L (cm³):" },
            { id: "calc_1", label: "1. Calculate the concentration of the solution H using titre t₁:" },
            { id: "calc_2", label: "2. Calculate the concentration (moldm⁻³) of solution M using titre t₂:" }
        ],
        gradingRubric: { deductionLogic: "Verify Table 2 mass calculation. Verify concentration of Thiosulphate (H) using 1:2 ratio with peroxodisulphate. Verify KMnO4 (M) concentration using 2:5 ratio with ethanedioate." }
    },
    {
        experimentCode: "RT:07",
        title: "RT. 7: Standardisation of Copper (II) Sulphate using Sodium Thiosulphate",
        subject: "Chemistry",
        category: "Volumetric Analysis",
        xpReward: 350,
        instructions: [
            "1. Fill the burette with Solution A (0.1M Sodium thiosulphate).",
            "2. Pipette 25 cm³ of Solution B (Copper (II) sulphate) in a conical flask. Add 15 cm³ of 10% KI. Swirl and wait for about 5 minutes.",
            "3. Titrate with Solution A until the color changes to pale yellow. Add 2 cm³ of starch and continue to titrate to the disappearance of the dark blue coloration."
        ],
        simulationSettings: {
            engineType: "chem_titration",
            flaskColorStart: "rgba(0, 0, 139, ", 
            flaskColorEnd: "rgba(255, 245, 238, ",
            preLabBriefing: "Welcome! Today you will determine the amount of copper in Copper (II) sulphate using iodometry. The standard 0.1M Sodium thiosulphate is already prepared in the burette. <br><br><b>Color Guide:</b> The reaction between Cu²⁺ and I⁻ produces iodine and a milky white precipitate of CuI. The endpoint is reached when the dark blue starch-iodine complex completely disappears, leaving only the milky white precipitate behind."
        },
        tableStructure: {
            headers: ["Burette Readings /cm³", "Approximate", "Accurate", "Accurate"],
            rows: [
                { label: "Second burette reading", keys: ["t1_rough_f", "t1_acc1_f", "t1_acc2_f"] },
                { label: "First burette reading", keys: ["t1_rough_i", "t1_acc1_i", "t1_acc2_i"] },
                { label: "Titre/cm³", keys: ["t1_rough_t", "t1_acc1_t", "t1_acc2_t"] }
            ]
        },
        calculationsBlock: [
            { id: "mean_t1", label: "Hence ______ cm³ of Na₂S₂O₃ reacted with 25 cm³ of CuSO₄:" },
            { id: "calc_1", label: "1) Calculate the concentration in moldm⁻³ of the CuSO₄·5H₂O solution:" },
            { id: "calc_2", label: "2) What is the concentration in gdm⁻³ of the CuSO₄·5H₂O solution?" },
            { id: "calc_3", label: "3) What mass of copper is 1dm³ of the copper salt solution?" }
        ],
        gradingRubric: { deductionLogic: "Verify stoichiometry: 1 mole Cu2+ reacts with 1 mole S2O3(2-). Check g/dm3 calculations." }
    },
    {
        experimentCode: "RT:08",
        title: "RT. 8: Standardisation of Sodium Thiosulphate using Potassium Iodate (V)",
        subject: "Chemistry",
        category: "Volumetric Analysis",
        xpReward: 350,
        instructions: [
            "1. Weigh accurately 0.95 g - 1.00 g of KIO₃, dissolve and make up to 250 cm³ in a volumetric flask. (Record in Table 1).",
            "2. Pipette 25 cm³ of the iodate into a conical flask. Add 10 cm³ KI and 10 cm³ dilute H₂SO₄. Titrate with Solution L (thiosulphate) until pale yellow. Add starch and titrate to colorless. (Record in Table 2).",
            "3. Pipette 25 cm³ of Solution M (dichromate) into a conical flask. Add 25 cm³ dilute H₂SO₄, 10 cm³ KI. Titrate with Solution L until pale yellow. Add starch and titrate to a green color end point. (Record in Table 3)."
        ],
        simulationSettings: {
            engineType: "chem_titration",
            phases: [
                { name: "Table 2: Iodate vs Thiosulphate (Starch)", start: "rgba(0, 0, 139, ", end: "rgba(255, 255, 255, " },
                { name: "Table 3: Dichromate vs Thiosulphate (Starch)", start: "rgba(0, 0, 139, ", end: "rgba(143, 188, 143, " }
            ],
            preLabBriefing: "Welcome! You will standardize thiosulphate using Potassium Iodate, then use it to find the concentration of dichromate ions. <br><br><b>Weighing Data:</b><br>&bull; Mass of weighing bottle + KIO₃: <b>10.98 g</b><br>&bull; Mass of weighing bottle alone: <b>10.00 g</b><br><br>Record this in Table 1. Use the Phase Selector to switch between the colorless Iodate endpoint and the green Dichromate endpoint."
        },
        tableStructure: {
            headers: ["Burette Readings", "Approximate", "Accurate", "Accurate"],
            rows: [
                { label: "TABLE 2 (Iodate): 2nd burette reading", keys: ["t2_rough_f", "t2_acc1_f", "t2_acc2_f"] },
                { label: "TABLE 2 (Iodate): 1st burette reading", keys: ["t2_rough_i", "t2_acc1_i", "t2_acc2_i"] },
                { label: "TABLE 2 (Iodate): Titre/cm³", keys: ["t2_rough_t", "t2_acc1_t", "t2_acc2_t"] },
                { label: "TABLE 3 (Dichromate): 2nd burette reading", keys: ["t3_rough_f", "t3_acc1_f", "t3_acc2_f"] },
                { label: "TABLE 3 (Dichromate): 1st burette reading", keys: ["t3_rough_i", "t3_acc1_i", "t3_acc2_i"] },
                { label: "TABLE 3 (Dichromate): Titre/cm³", keys: ["t3_rough_t", "t3_acc1_t", "t3_acc2_t"] }
            ]
        },
        calculationsBlock: [
            { id: "mass_bottle_kio3", label: "TABLE 1: Mass of weighing bottle and potassium iodate (g):" },
            { id: "mass_bottle", label: "TABLE 1: Mass of weighing bottle alone (g):" },
            { id: "mass_kio3", label: "TABLE 1: Mass of potassium iodate weighed (g):" },
            { id: "mean_t1", label: "Therefore mean titre (t₁) (Table 2) (cm³):" },
            { id: "mean_t2", label: "Therefore mean titre (t₂) (Table 3) (cm³):" },
            { id: "calc_a", label: "(a) The concentration of sodium thiosulphate in solution L (moldm⁻³):" },
            { id: "calc_b", label: "(b) The concentration (moldm⁻³) of dichromate ions in solution M, using titre t₂:" }
        ],
        gradingRubric: { deductionLogic: "Check Table 1 mass. Verify Thiosulphate concentration using 1:6 ratio with Iodate. Verify Dichromate concentration using 1:6 ratio with Thiosulphate." }
    },
    {
        experimentCode: "RT:09",
        title: "RT. 9: Determination of Oxalic Acid & Sodium Oxalate Mixture",
        subject: "Chemistry",
        category: "Volumetric Analysis",
        xpReward: 350,
        instructions: [
            "1. Pipette 25 cm³ of solution N (mixture) in a conical flask, add phenolphthalein. Titrate with solution M (NaOH) to a pink coloration. (Record in Table 1).",
            "2. Drain out solution M from the burette, wash, rinse and fill with solution O (KMnO₄).",
            "3. Pipette 25 cm³ of solution N, add 15 cm³ dilute H₂SO₄, heat to 70°C. Titrate hot mixture with solution O to a permanent pink coloration. (Record in Table 2)."
        ],
        simulationSettings: {
            engineType: "chem_titration",
            phases: [
                { name: "Table 1: Mixture vs NaOH", start: "rgba(240, 248, 255, ", end: "rgba(255, 20, 147, " },
                { name: "Table 2: Mixture vs KMnO₄", start: "rgba(240, 248, 255, ", end: "rgba(255, 182, 193, " }
            ],
            preLabBriefing: "Welcome! Today you will determine the concentration of both oxalic acid and sodium oxalate in a mixture. <br><br><b>The Logic:</b> In Table 1, NaOH will ONLY react with the oxalic acid. In Table 2, KMnO₄ will oxidize BOTH the oxalic acid and the sodium oxalate! Use this to solve the mixture puzzle."
        },
        tableStructure: {
            headers: ["Parameter", "Approximate", "Accurate 1", "Accurate 2"],
            rows: [
                { label: "TABLE 1 (NaOH): 2nd burette reading", keys: ["t1_rough_f", "t1_acc1_f", "t1_acc2_f"] },
                { label: "TABLE 1 (NaOH): 1st burette reading", keys: ["t1_rough_i", "t1_acc1_i", "t1_acc2_i"] },
                { label: "TABLE 1 (NaOH): Titre/cm³", keys: ["t1_rough_t", "t1_acc1_t", "t1_acc2_t"] },
                { label: "TABLE 2 (KMnO₄): 2nd burette reading", keys: ["t2_rough_f", "t2_acc1_f", "t2_acc2_f"] },
                { label: "TABLE 2 (KMnO₄): 1st burette reading", keys: ["t2_rough_i", "t2_acc1_i", "t2_acc2_i"] },
                { label: "TABLE 2 (KMnO₄): Titre/cm³", keys: ["t2_rough_t", "t2_acc1_t", "t2_acc2_t"] }
            ]
        },
        calculationsBlock: [
            { id: "mean_t1", label: "Therefore ______ cm³ of solution M (t₁) is required to react with 25.0 cm³ of solution N." },
            { id: "mean_t2", label: "Therefore ______ cm³ of solution O (t₂) is required to react with 25.0 cm³ of solution N." },
            { id: "calc_1", label: "1. Given that NaOH reacts only with oxalic acid, calculate the concentration of oxalic acid in solution N using titre t₁." },
            { id: "calc_2", label: "2. Calculate the total concentration of oxalate ions in solution N using titre t₂." },
            { id: "calc_3", label: "3. Hence, calculate the concentration of sodium oxalate in solution." },
            { id: "calc_4", label: "4. Calculate the percentage by mass of oxalic acid and sodium oxalate in 250 cm³ of solution N." }
        ],
        gradingRubric: { deductionLogic: "Verify Oxalic acid concentration (1:2 ratio with NaOH). Verify total oxalate concentration (5:2 ratio with KMnO4). Verify Sodium Oxalate is calculated by subtracting Oxalic Acid from Total Oxalate." }
    },
    {
        experimentCode: "RT:10",
        title: "RT. 10: Standardisation of Sodium Sulphite using Potassium Iodate",
        subject: "Chemistry",
        category: "Volumetric Analysis",
        xpReward: 350,
        instructions: [
            "1. Weigh accurately between 0.99g and 1.09g of KIO₃. Dissolve and make up to 250 cm³ in a volumetric flask. (Record in Table I).",
            "2. Pipette 25 cm³ of the KIO₃ solution into a conical flask and add 15 cm³ dilute H₂SO₄. Add 25 cm³ of Solution Y (Na₂SO₃). Swirl and allow to stand for 5 minutes.",
            "3. Titrate the contents with Solution Z (thiosulphate) till pale yellow. Add starch and titrate to the disappearance of the dark blue coloration. (Record in Table II)."
        ],
        simulationSettings: {
            engineType: "chem_titration",
            flaskColorStart: "rgba(0, 0, 139, ", 
            flaskColorEnd: "rgba(255, 255, 255, ",
            preLabBriefing: "Welcome to the final Redox experiment! You are determining the concentration of a sodium sulphite solution using a back-titration method with Potassium Iodate. <br><br><b>Weighing Data:</b><br>&bull; Mass of weighing bottle + KIO₃: <b>11.05 g</b><br>&bull; Mass of weighing bottle alone: <b>10.00 g</b><br><br>Record this in Table I and proceed with the titration in Table II."
        },
        tableStructure: {
            headers: ["Burette Readings /cm³", "Approximate", "Accurate", "Accurate"],
            rows: [
                { label: "TABLE II: Second Burette reading", keys: ["t2_rough_f", "t2_acc1_f", "t2_acc2_f"] },
                { label: "TABLE II: First Burette reading", keys: ["t2_rough_i", "t2_acc1_i", "t2_acc2_i"] },
                { label: "TABLE II: Titre/cm³", keys: ["t2_rough_t", "t2_acc1_t", "t2_acc2_t"] }
            ]
        },
        calculationsBlock: [
            { id: "mass_bottle_kio3", label: "TABLE I: Mass of KIO₃ + weighing bottle (g):" },
            { id: "mass_bottle", label: "TABLE I: Mass of weighing bottle alone (g):" },
            { id: "mass_kio3", label: "TABLE I: Mass of KIO₃ (g):" },
            { id: "mean_t2", label: "Hence Titre ______ cm³ (from Table II):" },
            { id: "calc_1", label: "1) Calculate the concentration of the Iodate solution." },
            { id: "calc_2", label: "2) Calculate the concentration of the Sulphite solution." },
            { id: "calc_3", label: "3) Calculate the concentration of the thiosulphate solution." }
        ],
        gradingRubric: { deductionLogic: "Check Table I mass. Verify Iodate molarity calculation. Verify Sulphite calculation (back-titration logic using remaining iodine)." }
    },
    {
        experimentCode: "PT:01",
        title: "PT. 1: Standardization of Silver Nitrate using Potassium Chloride",
        subject: "Chemistry",
        category: "Volumetric Analysis",
        xpReward: 350,
        instructions: [
            "1. Weigh accurately between 1.46 g - 2.00 g of Potassium chloride. Dissolve in distilled water in a 250-cm³ volumetric flask and make up to the mark.",
            "2. Pipette 25 cm³ of KCl solution into a conical flask. Add 2-3 drops of Potassium Chromate indicator.",
            "3. Titrate slowly with Silver nitrate till the appearance of a permanent reddish-brown precipitate. Record the results."
        ],
        simulationSettings: {
            engineType: "chem_titration",
            flaskColorStart: "rgba(255, 255, 0, ",  
            flaskColorEnd: "rgba(165, 42, 42, ",     
            preLabBriefing: "Welcome to Precipitation Titrations! For this Mohr's method titration, you will standardize silver nitrate using a known chloride solution.<br><br><b>Weighing Data:</b><br>&bull; Mass of bottle + KCl: <b>11.75 g</b><br>&bull; Mass of bottle alone: <b>10.00 g</b><br><br><b>Color Guide:</b> The chromate indicator starts <b>Yellow</b>. At the endpoint, excess silver ions form a <b>Reddish-Brown</b> precipitate of silver chromate. Watch closely!"
        },
        tableStructure: {
            headers: ["Burette Readings", "Approximate", "Accurate", "Accurate"],
            rows: [
                { label: "Second Burette reading /cm³", keys: ["rough_f", "acc1_f", "acc2_f"] },
                { label: "First Burette reading /cm³", keys: ["rough_i", "acc1_i", "acc2_i"] },
                { label: "Titre/cm³", keys: ["rough_t", "acc1_t", "acc2_t"] }
            ]
        },
        calculationsBlock: [
            { id: "mass_bottle_kcl", label: "TABLE 1: Mass of bottle + KCl (g):" },
            { id: "mass_bottle", label: "TABLE 1: Mass of bottle alone (g):" },
            { id: "mass_kcl", label: "TABLE 1: Mass of KCl used (g):" },
            { id: "mean_t", label: "Hence ...... cm³ of AgNO₃ reacts with 25 cm³ of KCl:" },
            { id: "calc_1", label: "1) Calculate the concentration of the KCl solution." },
            { id: "calc_2", label: "2) What is the concentration of the AgNO₃ solution?" }
        ],
        gradingRubric: { deductionLogic: "Check mass subtraction. Verify KCl molarity. Check AgNO3 molarity using 1:1 stoichiometry with Chloride ions." }
    },
    {
        experimentCode: "PT:02",
        title: "PT. 2: Standardization of Hydrochloric Acid using Aqueous Silver Nitrate",
        subject: "Chemistry",
        category: "Volumetric Analysis",
        xpReward: 350,
        instructions: [
            "1. Pipette 25 cm³ of hydrochloric acid into a 250-cm³ conical flask.",
            "2. Add 1 g of calcium carbonate to the solution in the conical flask, then 3 drops of potassium chromate indicator. Swirl the mixture.",
            "3. Titrate the mixture with 0.1 M silver nitrate solution from the burette to the end point (first permanent reddish tinge)."
        ],
        simulationSettings: {
            engineType: "chem_titration",
            flaskColorStart: "rgba(255, 255, 0, ",  
            flaskColorEnd: "rgba(165, 42, 42, ",     
            preLabBriefing: "Welcome! Today you are determining the concentration of an unknown HCl solution. The standard 0.1 M AgNO₃ is prepared in the burette. <br><br><b>Notice:</b> You must add 1 g of CaCO₃ to the flask. This neutralizes the acid so the chromate indicator isn't destroyed, leaving the chloride ions unaffected.<br><br><b>Color Guide:</b> Watch for the yellow chromate to develop a permanent <b>Reddish Tinge</b>."
        },
        tableStructure: {
            headers: ["Burette Readings", "Approximate", "Accurate", "Accurate"],
            rows: [
                { label: "Second burette reading /cm³", keys: ["rough_f", "acc1_f", "acc2_f"] },
                { label: "First burette reading /cm³", keys: ["rough_i", "acc1_i", "acc2_i"] },
                { label: "Titre/cm³", keys: ["rough_t", "acc1_t", "acc2_t"] }
            ]
        },
        calculationsBlock: [
            { id: "mean_t", label: "Therefore ...... cm³ titre (t₁) of aqueous silver nitrate reacts with 25.0 cm³ of aqueous hydrochloric acid." },
            { id: "calc_1", label: "1. Calculate the concentration of hydrochloric acid that reacted with the silver nitrate solution. (HCl ≡ AgNO₃)" }
        ],
        gradingRubric: { deductionLogic: "Verify HCl concentration using the 1:1 molar equivalence with the 0.1M Silver Nitrate." }
    },
    {
        experimentCode: "CT:01",
        title: "CT. 1: Determination of the Total Hardness of Water by Complexometric Titration",
        subject: "Chemistry",
        category: "Volumetric Analysis",
        xpReward: 350,
        instructions: [
            "1. Fill the burette with Solution P (0.1 M EDTA).",
            "2. Analyze a Blank solution: Pipette 25 cm³ of Tap water into a conical flask. Heat the flask, add 2 cm³ pH 10 buffer and 2 cm³ of Eriochrome Black-T indicator.",
            "3. If the solution turns blue, there is no measurable Ca²⁺/Mg²⁺. If it turns wine red, titrate with Solution P until it changes through purple to blue. (Record as Blank).",
            "4. Repeat steps 2 and 3 using Solution Q (Hard water) in place of tap water. (Record two titrations as Hard water)."
        ],
        simulationSettings: {
            engineType: "chem_titration",
            phases: [
                { name: "Titration 1: Blank (Tap Water)", start: "rgba(220, 20, 60, ", end: "rgba(0, 0, 255, " },
                { name: "Titration 2: Hard Water", start: "rgba(220, 20, 60, ", end: "rgba(0, 0, 255, " }
            ],
            preLabBriefing: "Welcome to Complexometric Titrations! Today you are determining water hardness using EDTA and Eriochrome Black-T (EBT) indicator.<br><br><b>Color Guide:</b> The EBT indicator binds to Ca²⁺ and Mg²⁺ to form a <b>Wine Red</b> complex. As EDTA is added, it strips the metal ions away. The endpoint is reached when the solution turns pure <b>Blue</b>.<br><br>Use the Phase Selector to first run your Tap Water blank, then your Hard Water titrations."
        },
        tableStructure: {
            headers: ["Titrations", "2nd Burette reading", "1st Burette reading", "Titre/cm³"],
            rows: [
                { label: "Blank (Tap water)", keys: ["blank_f", "blank_i", "blank_t"] },
                { label: "Hard water (Rough)", keys: ["hw_rough_f", "hw_rough_i", "hw_rough_t"] },
                { label: "Hard water (Accurate)", keys: ["hw_acc_f", "hw_acc_i", "hw_acc_t"] }
            ]
        },
        calculationsBlock: [
            { id: "mean_t", label: "Hence ______ cm³ of EDTA reacts with 25 cm³ of the Hard water:" },
            { id: "calc_1", label: "1) Calculate the volume of EDTA used to determine the amount of calcium in the hard water." },
            { id: "calc_2", label: "2) Considering that the hard water has only Ca²⁺ ions, calculate the concentration in moldm⁻³ of the Ca²⁺ solution." },
            { id: "calc_3", label: "3) What mass of calcium is present in 1dm³ of the solution?" }
        ],
        gradingRubric: { deductionLogic: "Check that Blank Titre is properly subtracted from the Hard Water Titre if necessary. Verify Ca2+ molarity (1:1 with EDTA). Verify mass conversion." }
    },
    {
        experimentCode: "CT:02",
        title: "CT. 2: Standardisation of Magnesium Sulphate Solution using Aqueous EDTA",
        subject: "Chemistry",
        category: "Volumetric Analysis",
        xpReward: 350,
        instructions: [
            "1. Fill the burette with the 0.05M EDTA solution provided.",
            "2. Pipette 25 cm³ of the MgSO₄·7H₂O solution into a 250 ml conical flask. Add 75 cm³ distilled water followed by 2 cm³ of pH 10 ammonia buffer.",
            "3. Add a pinch of Eriochrome Black T indicator. Titrate with EDTA until the solution changes from red through purple and to blue at the end point."
        ],
        simulationSettings: {
            engineType: "chem_titration",
            flaskColorStart: "rgba(220, 20, 60, ",  
            flaskColorEnd: "rgba(0, 0, 255, ",       
            preLabBriefing: "Welcome! You are standardizing a Magnesium Sulphate solution using 0.05 M EDTA. <br><br><b>Color Guide:</b> You will use Eriochrome Black-T (EBT) indicator in a pH 10 ammonia buffer. The magnesium-EBT complex starts <b>Wine Red</b>. Titrate with EDTA until the indicator is completely displaced and the solution turns a clear <b>Blue</b>."
        },
        tableStructure: {
            headers: ["Burette readings/cm³", "Approximate", "Accurate I", "Accurate II"],
            rows: [
                { label: "2nd burette reading", keys: ["rough_f", "acc1_f", "acc2_f"] },
                { label: "1st burette reading", keys: ["rough_i", "acc1_i", "acc2_i"] },
                { label: "Titre", keys: ["rough_t", "acc1_t", "acc2_t"] }
            ]
        },
        calculationsBlock: [
            { id: "mean_t", label: "Mean titre (cm³):" },
            { id: "calc_1", label: "1) Calculate the concentration of MgSO₄·7H₂O assuming 1:1 reaction mole ratio." },
            { id: "calc_2", label: "2) Calculate the number of moles of MgSO₄·7H₂O required to reach the end point." },
            { id: "calc_3", label: "3) The EDTA reacting is in the form EDTA⁴⁻. Write down the formula of magnesium-EDTA complex." }
        ],
        gradingRubric: { deductionLogic: "Verify MgSO4 molarity using 1:1 ratio with 0.05M EDTA. Check moles calculation. Formula should be written as [Mg(EDTA)]2-." }
    },
    {
        experimentCode: "EN:01",
        title: "EN. 1: Determine the Enthalpy Change of Sodium Carbonate & HCl",
        subject: "Chemistry",
        category: "Thermochemistry",
        xpReward: 400,
        instructions: [
            "1. Weigh accurately between 1.90 g and 2.10 g of Sodium carbonate in a dry plastic cup. Record the mass in Table 1.",
            "2. By means of a measuring cylinder, place 30 cm³ of the hydrochloric acid solution in a plastic cup. Measure its temperature to the nearest 0.1°C at half a minute intervals till the 3rd minute.",
            "3. At exactly 3 ½ minutes, add the 30 cm³ of the hydrochloric acid solution to the sodium carbonate in the plastic cup. Stir continuously with the thermometer.",
            "4. Take the temperature readings to the nearest 0.1°C at half a minute intervals from the 4th minute to the 7th minute. Record the temperatures in Table 2."
        ],
        simulationSettings: {
            engineType: "chem_thermo",
            preLabBriefing: "Welcome to Thermochemistry! Today you will calculate the enthalpy change (ΔH) of a reaction. The technician has pre-weighed your Sodium Carbonate.<br><br><b>Weighing Data:</b><br>&bull; Mass of plastic cup + sodium carbonate: <b>7.25 g</b><br>&bull; Mass of plastic cup alone: <b>5.20 g</b><br><br>Record this in Table 1. <br><br><b>Instructions:</b> Start the timer to record the baseline temperature of the acid for 3 minutes. At exactly 3.5 minutes, click to add the acid to the carbonate and watch the thermometer spike!"
        },
        tableStructure: {
            headers: ["Time / min", "0.0", "0.5", "1.0", "1.5", "2.0", "2.5", "3.0", "3.5"],
            rows: [
                { label: "Temp / °C (Baseline)", keys: ["temp_0", "temp_05", "temp_10", "temp_15", "temp_20", "temp_25", "temp_30", "temp_35_xxx"] },
                { label: "Time / min", keys: ["time_40", "time_45", "time_50", "time_55", "time_60", "time_65", "time_70", "blank"] },
                { label: "Temp / °C (Reaction)", keys: ["temp_40", "temp_45", "temp_50", "temp_55", "temp_60", "temp_65", "temp_70", "blank2"] }
            ]
        },
        calculationsBlock: [
            { id: "mass_cup_na2co3", label: "TABLE 1: Mass of Plastic cup + sodium carbonate (g):" },
            { id: "mass_cup", label: "TABLE 1: Mass of plastic cup alone (g):" },
            { id: "mass_na2co3", label: "TABLE 1: Mass of Sodium carbonate (g):" },
            { id: "graph_confirm", label: "a) Did you plot the graph of temperature against time? (Yes/No):" },
            { id: "delta_t", label: "From the graph, what is the temperature rise, ΔT (°C)?" },
            { id: "delta_h", label: "b) Calculate the enthalpy change (ΔH) using: ΔH = (-13.4 x ΔT) / mass of carbonate:" }
        ],
        gradingRubric: { deductionLogic: "Verify Table 1 mass subtraction. Check if ΔT matches the simulated spike (approx 6-8°C). Verify ΔH calculation using the provided formula and accurate negative sign." }
    },
    {
        experimentCode: "EN:02",
        title: "EN. 2: Enthalpy Change of Neutralization (Continuous Variation)",
        subject: "Chemistry",
        category: "Thermochemistry",
        xpReward: 400,
        instructions: [
            "1. Fill two separate burettes with Solution A (HCl) and Solution B (NaOH).",
            "2. For Experiments 1 to 4: Run Solution B into the plastic cup, measure its initial temp. Add Solution A, stir, and measure the highest temperature attained. (Discard and wash after each).",
            "3. For Experiments 5 to 6: Run Solution A into the plastic cup, measure its initial temp. Add Solution B, stir, and measure the highest temperature attained."
        ],
        simulationSettings: {
            engineType: "chem_thermo_series",
            preLabBriefing: "Welcome to Continuous Variation! You will run 6 consecutive mini-experiments to find the exact volume ratio that produces the maximum heat.<br><br><b>Instructions:</b> Use the Experiment Selector dropdown to choose your volumes. Take note of the initial baseline temperature. Click 'Mix & Stir' to combine the acid and base, and watch the thermometer closely to catch the <b>Highest Temperature Attained</b> before it starts cooling."
        },
        tableStructure: {
            headers: ["Expt No", "Vol A (cm³)", "Vol B (cm³)", "Initial Temp A", "Initial Temp B", "Highest Temp", "Rise in Temp"],
            rows: [
                { label: "1", keys: ["vol_a_1", "vol_b_1", "init_a_1", "init_b_1", "high_1", "rise_1"] },
                { label: "2", keys: ["vol_a_2", "vol_b_2", "init_a_2", "init_b_2", "high_2", "rise_2"] },
                { label: "3", keys: ["vol_a_3", "vol_b_3", "init_a_3", "init_b_3", "high_3", "rise_3"] },
                { label: "4", keys: ["vol_a_4", "vol_b_4", "init_a_4", "init_b_4", "high_4", "rise_4"] },
                { label: "5", keys: ["vol_a_5", "vol_b_5", "init_a_5", "init_b_5", "high_5", "rise_5"] },
                { label: "6", keys: ["vol_a_6", "vol_b_6", "init_a_6", "init_b_6", "high_6", "rise_6"] }
            ]
        },
        calculationsBlock: [
            { id: "graph_confirm", label: "1) Did you plot the graph of temperature rise vs volume of HCl? (Your graph should have two intersecting lines):" },
            { id: "delta_t", label: "2a) From the intersection point, obtain the temperature change (ΔT) for complete neutralization:" },
            { id: "vol_hcl", label: "2b) From the intersection point, obtain the volume of HCl that completely neutralizes the NaOH:" },
            { id: "moles_hcl", label: "2b) Find the number of moles of HCl present in this volume:" },
            { id: "enthalpy", label: "c) Calculate the enthalpy change (KJmol⁻¹) of neutralization (Heat capacity = 4.18 J/K, Total Vol = 40 cm³):" }
        ],
        gradingRubric: { deductionLogic: "Verify the graph intersection logic: Maximum temp rise should be near 20cm3 A / 20cm3 B. Check Q=mcΔT calculation (Q = 40 * 4.18 * ΔT) and Enthalpy = -Q/moles." }
    },
    {
        experimentCode: "EN:03",
        title: "EN. 3: Determination of the Enthalpy of Solution of an Organic Compound",
        subject: "Chemistry",
        category: "Thermochemistry",
        xpReward: 400,
        instructions: [
            "1. Accurately weigh between 2.50 g and 2.70 g of Oxalic acid directly into a boiling tube. Record the mass in Table 1.",
            "2. Using a burette, add 5 cm³ of distilled water to the boiling tube. Place a 0.1°C thermometer in the tube.",
            "3. Heat carefully on a low flame until all oxalic acid dissolves. Place the tube in a beaker of cold water, stir gently, and record the temperature at which the first crystals appear (Table 2).",
            "4. Add 2.5 cm³ of distilled water to the tube (total 7.5 cm³). Repeat step 3.",
            "5. Repeat step 4 for experiments 3 and 4, adding 2.5 cm³ of distilled water each time."
        ],
        simulationSettings: {
            engineType: "chem_thermo_crystallization",
            preLabBriefing: "Welcome to Solubility Thermodynamics! Today you will calculate the enthalpy of solution for oxalic acid by finding the exact temperature at which crystals crash out of solution at different concentrations.<br><br><b>Weighing Data:</b><br>&bull; Mass of boiling tube + oxalic acid: <b>27.60 g</b><br>&bull; Mass of boiling tube alone: <b>25.00 g</b><br><br>Record this in Table 1. <br><br><b>Instructions:</b> Click 'Heat Tube' until the crystals dissolve. Then click 'Start Cooling' and watch the thermometer closely. The moment you see crystals appear in the tube, that is your crystallization temperature!"
        },
        tableStructure: {
            headers: ["EXPT.", "Vol of Water(V) / cm³", "Temp of crystals / °C", "Temp / K", "1/T (K⁻¹)", "Solubility, S / moldm⁻³", "Log₁₀S"],
            rows: [
                { label: "1", keys: ["vol_1", "temp_c_1", "temp_k_1", "inv_t_1", "sol_1", "log_s_1"] },
                { label: "2", keys: ["vol_2", "temp_c_2", "temp_k_2", "inv_t_2", "sol_2", "log_s_2"] },
                { label: "3", keys: ["vol_3", "temp_c_3", "temp_k_3", "inv_t_3", "sol_3", "log_s_3"] },
                { label: "4", keys: ["vol_4", "temp_c_4", "temp_k_4", "inv_t_4", "sol_4", "log_s_4"] }
            ]
        },
        calculationsBlock: [
            { id: "mass_tube_acid", label: "TABLE 1: Mass of boiling tube + oxalic acid (g):" },
            { id: "mass_tube", label: "TABLE 1: Mass of boiling tube alone (g):" },
            { id: "mass_acid", label: "TABLE 1: Mass of oxalic acid (g):" },
            { id: "calc_s", label: "a) Calculate S and complete Table 2 using the formula: S = (7.7 x mass of oxalic acid) / Vol of water." },
            { id: "graph_confirm", label: "b) Did you plot the graph of Log₁₀S (vertical axis) against 1/T? (Yes/No):" },
            { id: "calc_grad", label: "c) i) From the graph, calculate the gradient." },
            { id: "calc_dh", label: "c) ii) Calculate the enthalpy of solution (ΔH = -gradient x 2.3R, where R = 8.31 Jmol⁻¹K⁻¹):" }
        ],
        gradingRubric: { deductionLogic: "Check Table 1 mass (2.60g). Verify solubility calculations using the provided formula. Verify that Log S and 1/T are calculated correctly to 3 sig figs. Check enthalpy calculation using the gradient of the plot." }
    },
    {
        experimentCode: "EN:04",
        title: "EN. 4: Determination of the Enthalpy of Solution of Sodium Thiosulphate Pentahydrate",
        subject: "Chemistry",
        category: "Thermochemistry",
        xpReward: 450,
        instructions: [
            "1. Weigh accurately between 6.10 g and 6.25 g of solid C and record the mass in Table 1.",
            "2. (CALORIMETRY): Place 50 cm³ of distilled water into a plastic cup. Measure temp every 0.5 min. At 3.5 mins add solid C. Stir and record temps from minute 4 to 7 (Table 2).",
            "3. Transfer solution C into a 250 cm³ volumetric flask and make up to the mark.",
            "4. (TITRATION): Pipette 25 cm³ of solution D (K₂Cr₂O₇), add 25 cm³ dilute H₂SO₄ and 10 cm³ of KI. Titrate with solution C until pale yellow. Add starch, titrate to bluish-green. (Table 3)."
        ],
        simulationSettings: {
            engineType: "chem_hybrid_en4",
            isEndothermic: true, 
            flaskColorStart: "rgba(139, 69, 19, ", // Dark brown iodine
            flaskColorEnd: "rgba(0, 128, 128, ",   // Bluish-green Cr3+ endpoint
            preLabBriefing: "Welcome to the Hybrid Lab! This experiment is broken into two physical stations.<br><br><b>Station 1 (Calorimetry):</b> You will dissolve Solid C in water. This is an endothermic reaction, so the temperature will DROP.<br><br><b>Station 2 (Titration):</b> You will use your dissolved Solid C (Thiosulphate) to titrate Iodine generated by Dichromate. The flask starts dark brown, fades to pale yellow, and upon adding starch, will turn dark blue before ending at a <b>Bluish-Green</b> endpoint.<br><br><b>Weighing Data:</b><br>&bull; Mass of bottle + Solid C: <b>16.15 g</b><br>&bull; Mass of bottle alone: <b>10.00 g</b>"
        },
        tableStructure: {
            headers: ["Time / min", "0.0", "0.5", "1.0", "1.5", "2.0", "2.5", "3.0", "3.5"],
            rows: [
                { label: "Temp / °C (Baseline)", keys: ["temp_0", "temp_05", "temp_10", "temp_15", "temp_20", "temp_25", "temp_30", "temp_35_xxx"] },
                { label: "Time / min", keys: ["time_40", "time_45", "time_50", "time_55", "time_60", "time_65", "time_70", "blank"] },
                { label: "Temp / °C (Reaction)", keys: ["temp_40", "temp_45", "temp_50", "temp_55", "temp_60", "temp_65", "temp_70", "blank2"] },
                { label: "TABLE 3 (Titration)", keys: ["titre_rough", "titre_acc1", "titre_acc2", "titre_blank", "titre_blank2", "titre_blank3", "titre_blank4", "titre_blank5"] }
            ]
        },
        calculationsBlock: [
            { id: "delta_t", label: "From the graph, determine the temperature change (ΔT) accompanying the dissolution:" },
            { id: "enthalpy", label: "1. Calculate the standard enthalpy of solution of solid C in water (RMM = 248.0):" },
            { id: "molarity_d", label: "2. Calculate the molarity of solution D using your titration data:" }
        ],
        gradingRubric: { deductionLogic: "Check ΔT from graph (endothermic drop). Verify Enthalpy using the specific formula. Verify Solution D molarity using the 1:6 redox stoichiometry." }
    },
    {
        experimentCode: "EN:05",
        title: "EN. 5: Determination of the Enthalpy of Reaction between Zinc Powder and Aqueous Copper (II) Sulphate",
        subject: "Chemistry",
        category: "Thermochemistry",
        xpReward: 400,
        instructions: [
            "1. Weigh accurately between 1.26 g and 1.31 g of zinc powder and record the mass in Table 1.",
            "2. By means of a suitably rinsed burette, place 50.0 cm³ of solution M into a plastic cup. Record the temperature of solution M every half minutes in Table 2.",
            "3. At exactly minute 3 ½, with the thermometer still in the plastic cup, tip-in all of the metal powder into the plastic cup and stir gently with the thermometer taking the temperature every half minute from minute 4 to 7."
        ],
        simulationSettings: {
            engineType: "chem_thermo",
            isEndothermic: false,
            reactionButtonText: "Tip Zinc into CuSO₄", // NEW DYNAMIC TEXT
            preLabBriefing: "Welcome! Today you are measuring the heat of a displacement reaction between Zinc and Copper (II) Sulphate.<br><br><b>Weighing Data:</b><br>&bull; Mass of weighing bottle + metal powder: <b>11.28 g</b><br>&bull; Mass of weighing bottle alone: <b>10.00 g</b><br><br>Record this in Table 1, then proceed with the calorimetry simulation to track the exothermic temperature spike."
        },
        tableStructure: {
            headers: ["Time / min", "0.0", "0.5", "1.0", "1.5", "2.0", "2.5", "3.0", "3.5"],
            rows: [
                { label: "Temp / °C (Baseline)", keys: ["temp_0", "temp_05", "temp_10", "temp_15", "temp_20", "temp_25", "temp_30", "temp_35_xxx"] },
                { label: "Time / min", keys: ["time_40", "time_45", "time_50", "time_55", "time_60", "time_65", "time_70", "blank"] },
                { label: "Temp / °C (Reaction)", keys: ["temp_40", "temp_45", "temp_50", "temp_55", "temp_60", "temp_65", "temp_70", "blank2"] }
            ]
        },
        calculationsBlock: [
            { id: "mass_bottle_zn", label: "TABLE 1: Mass of weighing bottle + metal powder (g):" },
            { id: "mass_bottle", label: "TABLE 1: Mass of weighing bottle alone (g):" },
            { id: "mass_zn", label: "TABLE 1: Mass of metal powder (g):" },
            { id: "delta_t", label: "1. Obtain the temperature change ΔT from your plotted graph (°C):" },
            { id: "heat_rxn", label: "2. Calculate the heat of reaction (Specific heat capacity = 4.2 Jg⁻¹K⁻¹, assume 1 cm³ = 1 g):" },
            { id: "rxn_eq", label: "3. Write the equation of the reaction of the metal with solution M:" }
        ],
        gradingRubric: { deductionLogic: "Verify Zinc mass (1.28 g). Verify ΔT from graph. Check Q = mcΔT (where m = 50 g). Equation should be Zn(s) + CuSO4(aq) -> ZnSO4(aq) + Cu(s)." }
    },
    {
        experimentCode: "EN:06",
        title: "EN. 6: Determination of Enthalpy of Hydration of Copper (II) Sulphate (Hess's Law)",
        subject: "Chemistry",
        category: "Thermochemistry",
        xpReward: 500,
        instructions: [
            "1. Place 6.3 g of hydrated CuSO₄(s) in a weighing bottle.",
            "2. Place 50 cm³ of distilled water into the plastic cup. Record its temperature EVERY 15 seconds.",
            "3. At exactly the second minute (120 seconds), pour the hydrated CuSO₄(s) into the cup and stir.",
            "4. Record the temperature EVERY 15 seconds until the sixth minute (360 seconds). (Table 3).",
            "5. Repeat procedures 1 to 4 using 4.0 g of anhydrous CuSO₄(s) instead of hydrated. (Table 4)."
        ],
        simulationSettings: {
            engineType: "chem_thermo_hess",
            preLabBriefing: "Welcome to Hess's Law! You must determine two separate enthalpies to find the final enthalpy of hydration.<br><br><b>Weighing Data (Tables 1 & 2):</b><br>&bull; Mass of bottle + Hydrated CuSO₄: <b>16.30 g</b><br>&bull; Mass of bottle + Anhydrous CuSO₄: <b>14.00 g</b><br>&bull; Mass of empty bottle (both): <b>10.00 g</b><br><br><b>Instructions:</b> Use the simulator toggle to switch between the Hydrated salt (which causes a slight endothermic temperature drop) and the Anhydrous salt (which causes a massive exothermic spike). Add the solid exactly at 120 seconds!"
        },
        tableStructure: {
            headers: ["Time/sec", "0", "15", "30", "45", "60", "75", "90", "105", "120", "135", "150", "165", "180"],
            rows: [
                { label: "TABLE 3 (Hydrated): Temp/°C", keys: ["t3_0", "t3_15", "t3_30", "t3_45", "t3_60", "t3_75", "t3_90", "t3_105", "t3_120_xx", "t3_135", "t3_150", "t3_165", "t3_180"] },
                { label: "TABLE 3 (Hydrated): Time/sec", keys: ["lbl_195", "lbl_210", "lbl_225", "lbl_240", "lbl_255", "lbl_270", "lbl_285", "lbl_300", "lbl_315", "lbl_330", "lbl_345", "lbl_360", "lbl_blank"] },
                { label: "TABLE 3 (Hydrated): Temp/°C", keys: ["t3_195", "t3_210", "t3_225", "t3_240", "t3_255", "t3_270", "t3_285", "t3_300", "t3_315", "t3_330", "t3_345", "t3_360", "blank"] },
                { label: "TABLE 4 (Anhydrous): Temp/°C", keys: ["t4_0", "t4_15", "t4_30", "t4_45", "t4_60", "t4_75", "t4_90", "t4_105", "t4_120_xx", "t4_135", "t4_150", "t4_165", "t4_180"] },
                { label: "TABLE 4 (Anhydrous): Time/sec", keys: ["lbl_195_2", "lbl_210_2", "lbl_225_2", "lbl_240_2", "lbl_255_2", "lbl_270_2", "lbl_285_2", "lbl_300_2", "lbl_315_2", "lbl_330_2", "lbl_345_2", "lbl_360_2", "lbl_blank2"] },
                { label: "TABLE 4 (Anhydrous): Temp/°C", keys: ["t4_195", "t4_210", "t4_225", "t4_240", "t4_255", "t4_270", "t4_285", "t4_300", "t4_315", "t4_330", "t4_345", "t4_360", "blank2"] }
            ]
        },
        calculationsBlock: [
            { id: "mass_hyd", label: "TABLE 1: Mass of CuSO₄·5H₂O(s) (g):" },
            { id: "mass_anh", label: "TABLE 2: Mass of CuSO₄(s) (g):" },
            { id: "calc_1", label: "1. State Hess's law:" },
            { id: "calc_2i", label: "2. i) Calculate the molar enthalpy change of solution (ΔH₂) of anhydrous CuSO₄(s) [Assume c = 4.2 JK⁻¹g⁻¹]:" },
            { id: "calc_2ii", label: "2. ii) Calculate the molar enthalpy change of solution (ΔH₃) of hydrated CuSO₄(s):" },
            { id: "calc_3", label: "3. Calculate the molar enthalpy heat of hydration of anhydrous CuSO₄(s) [ΔH₁ = ΔH₂ - ΔH₃]:" },
            { id: "calc_4", label: "4. State the assumptions you made in calculating ΔH₂ and ΔH₃:" },
            { id: "calc_5", label: "5. State the sources of error in this experiment:" }
        ],
        gradingRubric: { deductionLogic: "Verify Table 1 and 2 masses (6.3g and 4.0g). Verify Q=mcΔT for both runs (m=50g). Verify Hess's Law application where ΔH_hydration = ΔH_sol(anhydrous) - ΔH_sol(hydrated)." }
    },
    {
        experimentCode: "EN:07",
        title: "EN. 7: Standardization of NaOH and Enthalpy Change of Neutralization",
        subject: "Chemistry",
        category: "Thermochemistry",
        xpReward: 450,
        instructions: [
            "1. Weigh 5.0 g - 5.1 g oxalic acid, dissolve and make up to 250 cm³ in a volumetric flask.",
            "2. (TITRATION): Pipette 25 cm³ of the aqueous oxalic acid and titrate with Solution R (NaOH) using phenolphthalein. (Record in Table 1).",
            "3. (CALORIMETRY): Place 45.0 cm³ of Solution R in a cup. Place 5.0 cm³ Solution S (HCl) in a second burette. Measure temp of R, add S, stir, and measure highest temp. (Experiment 1).",
            "4. Repeat for experiments 2 to 6 using the quantities shown in Table 2."
        ],
        simulationSettings: {
            engineType: "chem_hybrid_en7",
            flaskColorStart: "rgba(240, 248, 255, ", // Colorless acid
            flaskColorEnd: "rgba(255, 20, 147, ",   // Pink phenolphthalein endpoint
            seriesOptions: [
                { label: "1", volA: "45 cm³ NaOH", volB: "5 cm³ HCl" },
                { label: "2", volA: "35 cm³ NaOH", volB: "15 cm³ HCl" },
                { label: "3", volA: "30 cm³ NaOH", volB: "20 cm³ HCl" },
                { label: "4", volA: "25 cm³ NaOH", volB: "25 cm³ HCl" },
                { label: "5", volA: "15 cm³ NaOH", volB: "35 cm³ HCl" },
                { label: "6", volA: "10 cm³ NaOH", volB: "40 cm³ HCl" }
            ],
            preLabBriefing: "Welcome to the Hybrid Lab! You must use both the Burette and the Calorimeter.<br><br><b>Station 1 (Titration):</b> You must standardize Solution R (NaOH) against Oxalic acid. The flask starts colorless and turns pink at the endpoint.<br><br><b>Station 2 (Continuous Variation):</b> Mix the different volume ratios to find the maximum temperature spike. <br><br><b>Weighing Data:</b><br>&bull; Mass of beaker + oxalic acid: <b>55.05 g</b><br>&bull; Mass of empty beaker: <b>50.00 g</b><br><br>Record your masses and toggle between the stations using the buttons above the workspace!"
        },
        tableStructure: {
            headers: ["Parameter / Expt", "Approx / 1", "Acc 1 / 2", "Acc 2 / 3", "Expt 4", "Expt 5", "Expt 6"],
            rows: [
                { label: "TABLE 1 (Titration): 2nd burette reading", keys: ["t1_rough_f", "t1_acc1_f", "t1_acc2_f", "blank1", "blank2", "blank3"] },
                { label: "TABLE 1 (Titration): 1st burette reading", keys: ["t1_rough_i", "t1_acc1_i", "t1_acc2_i", "blank4", "blank5", "blank6"] },
                { label: "TABLE 1 (Titration): Titre / cm³", keys: ["t1_rough_t", "t1_acc1_t", "t1_acc2_t", "blank7", "blank8", "blank9"] },
                { label: "TABLE 2 (Thermo): Temp of R / °C", keys: ["temp_r_1", "temp_r_2", "temp_r_3", "temp_r_4", "temp_r_5", "temp_r_6"] },
                { label: "TABLE 2 (Thermo): Temp of S / °C", keys: ["temp_s_1", "temp_s_2", "temp_s_3", "temp_s_4", "temp_s_5", "temp_s_6"] },
                { label: "TABLE 2 (Thermo): Highest temp / °C", keys: ["high_1", "high_2", "high_3", "high_4", "high_5", "high_6"] },
                { label: "TABLE 2 (Thermo): Temp change ΔT / °C", keys: ["change_1", "change_2", "change_3", "change_4", "change_5", "change_6"] }
            ]
        },
        calculationsBlock: [
            { id: "mean_t", label: "Mean titre, t (cm³) from Table 1:" },
            { id: "calc_a", label: "a) Calculate the concentration (moldm⁻³) of the oxalic acid solution, C₂O₄H₂·2H₂O (RMM = 126):" },
            { id: "calc_b", label: "b) Calculate the concentration (moldm⁻³) of the sodium hydroxide solution, R:" },
            { id: "calc_heat", label: "Using the maximum on your graph, calculate the heat evolved (Total volume = 50.0 cm³, Heat capacity = 4.18 JK⁻¹):" },
            { id: "calc_enthalpy", label: "Calculate the enthalpy change of neutralization for hydrochloric acid and sodium hydroxide:" }
        ],
        gradingRubric: { deductionLogic: "Verify oxalic acid molarity based on 5.05g mass. Verify NaOH molarity using the 1:2 titration ratio. Check intersection point on the continuous variation graph for max ΔT. Verify enthalpy calculation using Q=mcΔT divided by limiting moles." }
    },
    {
        experimentCode: "CK:01",
        title: "CK. 1: Effect of Temperature on the Rate of Reaction (KMnO₄ & Oxalic Acid)",
        subject: "Chemistry",
        category: "Chemical Kinetics",
        xpReward: 450,
        instructions: [
            "1. Using a burette, place 4 cm³ of Solution C (KMnO₄) in a test tube.",
            "2. By means of a pipette, place 10 cm³ of Solution D (Oxalic acid) in a boiling tube.",
            "3. Place both tubes in a 500-cm³ beaker of water. Place a thermometer in the water and carefully bring the temperature to 30°C by heating or adding hot/cold water.",
            "4. Remove the thermometer, dry it, and place it in the boiling tube.",
            "5. Pour Solution C into the boiling tube containing Solution D and start timing. Stir gently and record the time at which the purple colour disappears.",
            "6. Repeat procedures 1 to 5 for temperatures 40°C, 50°C, and 60°C. Record results in the Table."
        ],
        simulationSettings: {
            engineType: "chem_kinetics_ck1",
            preLabBriefing: "Welcome to Chemical Kinetics! Today you are measuring how temperature affects reaction rates.<br><br><b>The Science:</b> Potassium Permanganate (Solution C) is deep purple. As it oxidizes the Oxalic Acid, it reduces to Mn²⁺ which is colorless. You must time exactly how long it takes for the purple color to completely disappear!<br><br><b>Instructions:</b><br>1. Select your target temperature from the dropdown.<br>2. Click 'Heat Water Bath' to bring the beaker to the correct temperature.<br>3. Click 'Mix Solutions & Start Timer' and watch the purple color fade. The timer will automatically stop when the reaction is complete."
        },
        tableStructure: {
            headers: ["Parameter", "30°C", "40°C", "50°C", "60°C"],
            rows: [
                { label: "Temperature of bath / °C", keys: ["t_bath_30", "t_bath_40", "t_bath_50", "t_bath_60"] },
                { label: "Temperature of reaction mixture / °C", keys: ["t_mix_30", "t_mix_40", "t_mix_50", "t_mix_60"] },
                { label: "Temperature of mixture / K", keys: ["k_30", "k_40", "k_50", "k_60"] },
                { label: "1/T (K⁻¹)", keys: ["inv_30", "inv_40", "inv_50", "inv_60"] },
                { label: "Reaction time (t) / s", keys: ["time_30", "time_40", "time_50", "time_60"] },
                { label: "Log₁₀t", keys: ["log_30", "log_40", "log_50", "log_60"] }
            ]
        },
        calculationsBlock: [
            { id: "calc_1", label: "1) Complete the table above." },
            { id: "calc_2", label: "2) Did you plot a graph of Log₁₀t (vertical axis) against 1/T? (Yes/No):" },
            { id: "calc_3", label: "3) Find the gradient of the graph:" },
            { id: "calc_4", label: "4) Estimate the activation energy of the reaction using the following expression: log(t₁/t₂) = Ea/R(1/T₁ - 1/T₂) Considering 40°C and 50°C (R = 8.31 JK⁻¹mol⁻¹):" }
        ],
        gradingRubric: { deductionLogic: "Verify Kelvin conversion (C + 273). Verify 1/T and Log10t calculations to 3 sig figs. Check Activation Energy (Ea) calculation using the provided Arrhenius derivation." }
    },
    {
        experimentCode: "CK:02",
        title: "CK. 2: Kinetics of Reaction Between Dilute HCl and Hydrated Sodium Thiosulphate",
        subject: "Chemistry",
        category: "Chemical Kinetics",
        xpReward: 450,
        instructions: [
            "1. From a burette place 25 cm³ of solution A (HCl) into a clean small beaker.",
            "2. Place 25 cm³ of solution B (thiosulphate) into a 150-cm³ conical flask. Place this on the cross mark (+) at the bottom of the page. Look into the flask to ensure you see the cross.",
            "3. At time t = 0, pour all solution A into solution B, swirl, and look into the flask until the cross mark disappears. Record the time in seconds. Clean the flask immediately.",
            "4. Repeat the procedure using the varying volumes of solution B and distilled water indicated in Table 1."
        ],
        simulationSettings: {
            engineType: "chem_kinetics_ck2",
            preLabBriefing: "Welcome to the Disappearing Cross Experiment!<br><br><b>The Science:</b> When Hydrochloric Acid reacts with Sodium Thiosulphate, solid Sulphur is precipitated. This makes the solution turn cloudy and opaque.<br><br><b>Instructions:</b><br>1. Use the dropdown to select your experiment number (this adjusts the concentration of thiosulphate).<br>2. Click 'Mix Solutions & Start Timer'.<br>3. Watch the top-down view of the flask closely. The timer will automatically stop the exact moment the Sulphur precipitate makes the black cross invisible!"
        },
        tableStructure: {
            headers: ["Expt No", "Vol of sol A (cm³)", "Vol of sol B (cm³)", "Vol of Distilled water/cm³", "[B] / moldm⁻³", "Time(t) / sec", "Rate, 1/t (s⁻¹)"],
            rows: [
                { label: "1", keys: ["vol_a1", "vol_b1", "vol_w1", "conc_1", "time_1", "rate_1"] },
                { label: "2", keys: ["vol_a2", "vol_b2", "vol_w2", "conc_2", "time_2", "rate_2"] },
                { label: "3", keys: ["vol_a3", "vol_b3", "vol_w3", "conc_3", "time_3", "rate_3"] },
                { label: "4", keys: ["vol_a4", "vol_b4", "vol_w4", "conc_4", "time_4", "rate_4"] },
                { label: "5", keys: ["vol_a5", "vol_b5", "vol_w5", "conc_5", "time_5", "rate_5"] }
            ]
        },
        calculationsBlock: [
            { id: "calc_1", label: "1. Complete Table 1 (Calculate 1/t for the reaction rate):" },
            { id: "calc_2", label: "2. Did you plot a graph of reaction rate against concentration of B? (Yes/No):" },
            { id: "calc_3", label: "3. From the graph determine the order of the reaction showing clearly how you arrive at your answer:" },
            { id: "calc_4a", label: "4a. Explain why the total volume of the reaction solution was kept the same for all the experiments:" },
            { id: "calc_4b", label: "4b. Explain why the volume of water added was varied:" },
            { id: "calc_5", label: "5. Estimate the time the reaction would take for a mixture containing: Sol A 50 cm³, Sol B 40 cm³, and distilled water 10 cm³:" }
        ],
        gradingRubric: { deductionLogic: "Verify 1/t calculations. Check reaction order determination (should be First Order with respect to thiosulphate, yielding a straight line through origin). Verify explanation of volume controls (keeping depth constant for cross visibility, keeping acid in excess)." }
    },
    {
        experimentCode: "CK:03",
        title: "CK. 3: Reaction Between Sulphite Ions, Hydrogen Ions and Iodate Ions",
        subject: "Chemistry",
        category: "Chemical Kinetics",
        xpReward: 500,
        instructions: [
            "1. Using a burette, place 30.0 cm³ of solution I (KIO₃) in a 250 cm³ conical flask. Add 70 cm³ of distilled water, 10.0 cm³ of sulphuric acid, and 20 cm³ of starch solution.",
            "2. Using a pipette, add 5.0 cm³ of solution J (Na₂SO₃). Start timing when half of solution J has been added.",
            "3. Swirl the flask contents and time the appearance of a blue coloration. Record the time (t) in seconds. Measure and record the temperature (Expt 1).",
            "4. Wash out the conical flask and shake to remove excess moisture.",
            "5. Perform experiments 2-6 using the varying volumes of Solution I and water shown in the table."
        ],
        simulationSettings: {
            engineType: "chem_kinetics_ck3",
            preLabBriefing: "Welcome to the famous Iodine Clock Reaction! 🇨🇲<br><br><b>The Science:</b> This reaction has a built-in delay. Iodate and Sulphite react to form Iodine, but the Sulphite immediately consumes the Iodine... until the Sulphite runs out! The exact second it runs out, the Iodine reacts with the starch to form a deep blue-black complex.<br><br><b>Instructions:</b><br>1. Select your experiment number to set the specific volume ratios.<br>2. Click 'Inject Sol. J & Start Timer'.<br>3. Do not take your eyes off the flask! The timer will run while the liquid remains clear, and will automatically stop the moment the spectacular blue flash occurs!"
        },
        tableStructure: {
            headers: ["Experiment", "1", "2", "3", "4", "5", "6"],
            rows: [
                { label: "Volume of solution I / cm³", keys: ["vol_i1", "vol_i2", "vol_i3", "vol_i4", "vol_i5", "vol_i6"] },
                { label: "Volume of water / cm³", keys: ["vol_w1", "vol_w2", "vol_w3", "vol_w4", "vol_w5", "vol_w6"] },
                { label: "Volume of dilute H₂SO₄ / cm³", keys: ["vol_a1", "vol_a2", "vol_a3", "vol_a4", "vol_a5", "vol_a6"] },
                { label: "Volume of starch / cm³", keys: ["vol_s1", "vol_s2", "vol_s3", "vol_s4", "vol_s5", "vol_s6"] },
                { label: "Volume of solution J / cm³", keys: ["vol_j1", "vol_j2", "vol_j3", "vol_j4", "vol_j5", "vol_j6"] },
                { label: "Time, t / sec", keys: ["time_1", "time_2", "time_3", "time_4", "time_5", "time_6"] },
                { label: "1/t / s⁻¹", keys: ["rate_1", "rate_2", "rate_3", "rate_4", "rate_5", "rate_6"] },
                { label: "Temperature / °C", keys: ["temp_1", "temp_2", "temp_3", "temp_4", "temp_5", "temp_6"] }
            ]
        },
        calculationsBlock: [
            { id: "calc_1", label: "1. Complete the table above (Calculate 1/t):" },
            { id: "calc_2", label: "2. Did you plot a graph of 1/t (vertical axis) against the volume of solution I? (Yes/No):" },
            { id: "calc_3", label: "3. Assuming Rate = K [IO₃⁻]ˣ [SO₃²⁻]ʸ [H⁺]ᶻ, deduce the value of 'x' from your graph:" },
            { id: "calc_4", label: "4. If the rate doubles for every 10°C rise, what would be the reaction time for experiment 4 if carried out at 20°C above the current temperature?" }
        ],
        gradingRubric: { deductionLogic: "Check 1/t calculations. Verify x = 1 (First Order with respect to Iodate, yielding a straight line through origin). Verify temperature calculation: a 20°C rise means rate doubles twice (x4), so time for Expt 4 must be divided by 4." }
    },
    {
        experimentCode: "CK:04",
        title: "CK. 4: Determination of the Order of Reaction Between Peroxodisulphate and Iodide",
        subject: "Chemistry",
        category: "Chemical Kinetics",
        xpReward: 500,
        instructions: [
            "1. By means of a burette, place 10 cm³ of solution F (Potassium Iodide) in a 250 cm³ conical flask. Add 10 cm³ of Solution E (Sodium thiosulphate) using a pipette.",
            "2. By means of a well rinsed pipette, place 15 cm³ of Solution G (Potassium peroxodisulphate) in a small beaker and add 2 cm³ of starch solution.",
            "3. Pour the Solution G from the small beaker into the conical flask containing Solution F and start timing. Swirl the flask and note the time of appearance of a blue coloration and the temperature of the mixture.",
            "4. Repeat procedures 1-3 using the volumes in the Table and add the volumes of water as indicated.",
            "5. Complete the Table."
        ],
        simulationSettings: {
            engineType: "chem_kinetics_ck4",
            preLabBriefing: "Welcome to the Advanced Kinetics Lab! 🇨🇲<br><br><b>The Setup:</b> To ensure perfect and continuous mixing for this Iodine Clock reaction, we have equipped your workstation with a <b>Magnetic Stirrer Plate</b>.<br><br><b>Instructions:</b><br>1. Select your experiment ratio from the dropdown to set the concentrations.<br>2. Click 'Add Sol G & Start Stirrer'.<br>3. Watch the magnetic stir bar create a vortex in the fluid! The precision timer will automatically stop the exact millisecond the solution flashes blue-black."
        },
        tableStructure: {
            headers: ["Expt", "Vol of Sol E/cm³", "Vol of Sol F/cm³", "Vol of Sol G/cm³", "Vol of water/cm³", "Vol of starch/cm³", "Reaction time, t/s", "1/t (s⁻¹)", "Temp/°C"],
            rows: [
                { label: "1", keys: ["vol_e1", "vol_f1", "vol_g1", "vol_w1", "vol_s1", "time_1", "rate_1", "temp_1"] },
                { label: "2", keys: ["vol_e2", "vol_f2", "vol_g2", "vol_w2", "vol_s2", "time_2", "rate_2", "temp_2"] },
                { label: "3", keys: ["vol_e3", "vol_f3", "vol_g3", "vol_w3", "vol_s3", "time_3", "rate_3", "temp_3"] },
                { label: "4", keys: ["vol_e4", "vol_f4", "vol_g4", "vol_w4", "vol_s4", "time_4", "rate_4", "temp_4"] }
            ]
        },
        calculationsBlock: [
            { id: "calc_1", label: "1) Did you plot a graph of volume of Iodine solution (vertical axis) against time? (Yes/No)" },
            { id: "calc_2", label: "2) The reaction rate is 1/t given by Rate = k[S₂O₈²⁻]ˣ[I⁻]ʸ. Determine x, the order of reaction with respect to peroxodisulphate:" },
            { id: "calc_3", label: "3) If the rate doubles for each 10°C rise, calculate the reaction time for experiment 3 at a temperature 20°C above your reaction temperature:" }
        ],
        gradingRubric: { deductionLogic: "Verify 1/t calculations. Check order 'x' (should be First Order, x=1). For question 3, a 20°C rise means the rate doubles twice (x4), so the time for Experiment 3 must be exactly divided by 4." }
    },
    {
        experimentCode: "CK:05",
        title: "CK. 5: Determination of the Order of a Reaction Between Iodine and Acetone",
        subject: "Chemistry",
        category: "Chemical Kinetics",
        xpReward: 500,
        instructions: [
            "1. Clamp two burettes and fill one with acetone and the other with HCl.",
            "2. Run 10 cm³ of acetone and 5 cm³ HCl into a 250 mL conical flask. Add 5 cm³ of distilled water.",
            "3. Place 5 cm³ of iodine solution into a beaker and add 5 drops of starch. The mixture will be blue-black.",
            "4. Pour the beaker's contents into the conical flask and start your stopwatch. Place the flask on a white tile and record the time it takes for the blue-black colour to disappear.",
            "5. Rinse the flask and repeat for experiments 2 to 4 using the volumes shown in the table."
        ],
        simulationSettings: {
            engineType: "chem_kinetics_ck5",
            preLabBriefing: "Welcome to the Initial Rates Method! 🇨🇲<br><br><b>The Science:</b> You are finding the reaction order for Acetone, HCl, and Iodine by systematically changing one concentration at a time.<br><br><b>Instructions:</b><br>1. Select your experiment number from the dropdown to load the specific volume ratios.<br>2. Click 'Mix Iodine & Start Timer'.<br>3. The deep blue-black starch-iodine complex will begin to react. The timer will automatically stop the exact millisecond the solution turns completely colorless!"
        },
        tableStructure: {
            headers: ["Experiment", "1", "2", "3", "4"],
            rows: [
                { label: "Vol of CH₃COCH₃ / cm³", keys: ["vol_ace1", "vol_ace2", "vol_ace3", "vol_ace4"] },
                { label: "Vol of distilled H₂O / cm³", keys: ["vol_w1", "vol_w2", "vol_w3", "vol_w4"] },
                { label: "Vol of HCl acid / cm³", keys: ["vol_h1", "vol_h2", "vol_h3", "vol_h4"] },
                { label: "Quantity of starch", keys: ["st1", "st2", "st3", "st4"] },
                { label: "Vol of iodine (I₂) / cm³", keys: ["vol_i1", "vol_i2", "vol_i3", "vol_i4"] },
                { label: "Time in sec", keys: ["time_1", "time_2", "time_3", "time_4"] },
                { label: "1/t in sec⁻¹", keys: ["rate_1", "rate_2", "rate_3", "rate_4"] }
            ]
        },
        calculationsBlock: [
            { id: "calc_1a", label: "1. (a) Complete the table by calculating 1/t." },
            { id: "calc_1b", label: "1. (b) Suggest a reason why 1/t should be considered as rate of reaction:" },
            { id: "calc_2a", label: "2. Using your data, deduce the order of the reaction with respect to: (a) CH₃COCH₃" },
            { id: "calc_2b", label: "2. (b) HCl acid" },
            { id: "calc_2c", label: "2. (c) Iodine (I₂)" },
            { id: "calc_3", label: "3. What assumption did you make in deducing the respective orders in question 2?" },
            { id: "calc_4", label: "4. Write down a rate equation for the iodination of acetone and deduce the overall order:" },
            { id: "calc_5", label: "5. What key assumption was made in running experiments 1 to 4 on the Table above?" }
        ],
        gradingRubric: { deductionLogic: "Verify 1/t values. Check deduced orders (Acetone = 1st, HCl = 1st, Iodine = Zero). Rate equation should be Rate = k[CH3COCH3][HCl]. Assumptions include total volume remaining constant and initial rate being proportional to average rate (1/t)." }
    },
    {
        experimentCode: "CK:06",
        title: "CK. 6: Effect of Temperature on the Rate of Reaction Between Magnesium and HCl",
        subject: "Chemistry",
        category: "Chemical Kinetics",
        xpReward: 500,
        instructions: [
            "1. Clamp a burette and fill it with 1.0 M hydrochloric acid.",
            "2. Run 10 cm³ of the HCl into a boiling tube and maintain the acid solution at the target temperature using the water bath and thermometer.",
            "3. Cut a 1cm piece of magnesium ribbon and add to the acid in the boiling tube. Start the stopwatch immediately to time the duration of effervescence.",
            "4. Record your results in the Table below.",
            "5. Repeat the procedure at temperatures of 35°C, 40°C, 45°C, 50°C, 55°C and 60°C."
        ],
        simulationSettings: {
            engineType: "chem_kinetics_ck6",
            preLabBriefing: "Welcome to the Effervescence Lab! 🇨🇲<br><br><b>The Setup:</b> We are measuring how heat affects the reaction rate between solid Magnesium and Hydrochloric Acid.<br><br><b>Instructions:</b><br>1. Select your target temperature and click 'Heat Water Bath' to bring the acid up to temp.<br>2. Click 'Drop Mg Ribbon & Start Timer'.<br>3. Watch the effervescence! You will see hydrogen gas bubbles rapidly fizzing off the magnesium strip as it dissolves. The timer stops the moment the metal completely disappears."
        },
        tableStructure: {
            headers: ["Parameter", "30°C", "35°C", "40°C", "45°C", "50°C", "55°C", "60°C"],
            rows: [
                { label: "Time in sec", keys: ["time_30", "time_35", "time_40", "time_45", "time_50", "time_55", "time_60"] },
                { label: "1/t in sec⁻¹", keys: ["rate_30", "rate_35", "rate_40", "rate_45", "rate_50", "rate_55", "rate_60"] }
            ]
        },
        calculationsBlock: [
            { id: "calc_1", label: "1) Did you plot a graph of 1/t (vertical axis) against temperature/°C? (Yes/No)" },
            { id: "calc_2", label: "2) From your graph, suggest the order of the reaction giving reasons." },
            { id: "calc_3", label: "3) Briefly explain how temperature affects the reaction you have just carried out (in terms of collision theory):" }
        ],
        gradingRubric: { deductionLogic: "Verify 1/t values. Check graph plotting confirmation. Ensure Collision theory explanation mentions increased kinetic energy leading to more frequent and successful effective collisions." }
    },
    {
        experimentCode: "QA:01",
        title: "QA. 1: Practical Exercise (Test for Cations) - Salts A, B, C, D",
        subject: "Chemistry",
        category: "Qualitative Analysis",
        xpReward: 600,
        instructions: [
            "1. You are provided with solutions of salts A, B, C, and D. Select a tube from the rack.",
            "2. Select a reagent from the shelf (NaOH, NH₃, Na₂CO₃, K₂CrO₄, H₂SO₄, KSCN).",
            "3. Click 'Add Dropwise' to observe initial reactions.",
            "4. Click 'Add to Excess' to see if precipitates dissolve.",
            "5. *SEQUENTIAL TESTS:* To test K₂CrO₄ followed by NaOH, add K₂CrO₄, then select NaOH from the dropdown and click 'Add Dropwise' WITHOUT washing the tube!",
            "6. Click 'Warm & Test Gas'. Both RED and BLUE damp litmus papers will be placed at the mouth of the tube.",
            "7. Click 'Wash Tube' before testing a completely new reaction."
        ],
        simulationSettings: {
            engineType: "chem_qualitative",
            preLabBriefing: "Welcome to Advanced Qualitative Analysis! 🇨🇲<br><br><b>The Setup:</b> I have prepared four mystery solutions (A, B, C, and D) containing different cations.<br><br><b>Instructions:</b><br>Focus on one tube at a time. Systematically apply every reagent to Tube A, recording your observations.<br><br><b>Litmus Tests:</b> When testing for gases, both Red and Blue litmus papers are used simultaneously. If Red turns Blue, the gas is alkaline. If Blue turns Red, it is acidic! <br><br><b>Sequential Mixing:</b> For step (d), add K₂CrO₄ first. Then, <b>without washing the tube</b>, change the reagent dropdown to NaOH and add it to see the secondary reaction!"
        },
        tableStructure: {
            headers: ["Salt", "Reagent Added", "Observations", "Inferences (Cation Present)"],
            rows: [
                { label: "A", keys: ["a_reag1", "a_obs1", "a_inf1"] },
                { label: "A", keys: ["a_reag2", "a_obs2", "a_inf2"] },
                { label: "B", keys: ["b_reag1", "b_obs1", "b_inf1"] },
                { label: "B", keys: ["b_reag2", "b_obs2", "b_inf2"] },
                { label: "C", keys: ["c_reag1", "c_obs1", "c_inf1"] },
                { label: "C", keys: ["c_reag2", "c_obs2", "c_inf2"] },
                { label: "D", keys: ["d_reag1", "d_obs1", "d_inf1"] },
                { label: "D", keys: ["d_reag2", "d_obs2", "d_inf2"] }
            ]
        },
        calculationsBlock: [
            { id: "final_a", label: "Final Conclusion: What is the Cation in Salt A?" },
            { id: "final_b", label: "Final Conclusion: What is the Cation in Salt B?" },
            { id: "final_c", label: "Final Conclusion: What is the Cation in Salt C?" },
            { id: "final_d", label: "Final Conclusion: What is the Cation in Salt D?" }
        ],
        gradingRubric: { deductionLogic: "Check final conclusions: A = Cu2+, B = Fe3+, C = NH4+, D = Ba2+. Verify observation of dual-litmus test (e.g. NH3 gas turns red litmus blue)." }
    },
    {
        experimentCode: "QA:02",
        title: "QA. 2: Identification of Inorganic Salts (Exercise 1) - Salts A, B, C",
        subject: "Chemistry",
        category: "Qualitative Analysis",
        xpReward: 700,
        instructions: [
            "1. Select an Unknown Salt (A, B, or C) from the dropdown.",
            "2. Select the specific Test Protocol (e.g., Test i, Test ii) you wish to perform based on the manual.",
            "3. Click 'Execute Next Step' to add the reagents sequentially. Observe color changes, precipitates, and solubility.",
            "4. For Salt A (Test iv), the system will automatically execute a Flame Test using a nichrome wire.",
            "5. For Salt C (Tests iv & v), the system will automatically simulate the filtration process before adding starch and thiosulphate.",
            "6. Record all Observations and Inferences in the provided tables, then deduce the identities of the salts."
        ],
        simulationSettings: {
            engineType: "chem_qualitative_advanced",
            preLabBriefing: "Welcome to Exercise 1 of Inorganic Salt Identification! 🇨🇲<br><br><b>The Setup:</b> We are testing three unknown salts using complex sequential protocols.<br><br><b>Instructions:</b><br>Select your Salt and the Test number from the dropdowns. Click 'Execute Next Step' to progress through the reaction sequence. <br><br><b>Watch Closely:</b> You will see redox color changes, precipitates forming and dissolving, a Bunsen burner flame test, and even a virtual filtration step!"
        },
        tableStructure: [
            {
                title: "SALT A OBSERVATIONS",
                headers: ["Test", "Observations", "Inferences"],
                rows: [
                    { label: "(i) Add K₂Cr₂O₇ then Na₂S₂O₃", keys: ["a_obs1", "a_inf1"] },
                    { label: "(ii) Add HNO₃, AgNO₃, then NH₃", keys: ["a_obs2", "a_inf2"] },
                    { label: "(iii) Add NaOH", keys: ["a_obs3", "a_inf3"] },
                    { label: "(iv) Flame Test", keys: ["a_obs4", "a_inf4"] }
                ]
            },
            {
                title: "SALT B OBSERVATIONS",
                headers: ["Test", "Observations", "Inferences"],
                rows: [
                    { label: "(i) Add NaOH", keys: ["b_obs1", "b_inf1"] },
                    { label: "(ii) Add NH₃", keys: ["b_obs2", "b_inf2"] },
                    { label: "(iii) Add Na-ethanoate & heat", keys: ["b_obs3", "b_inf3"] },
                    { label: "(iv) Add KSCN then SnCl₂", keys: ["b_obs4", "b_inf4"] },
                    { label: "(v) Add AgNO₃, HNO₃, then NH₃", keys: ["b_obs5", "b_inf5"] }
                ]
            },
            {
                title: "SALT C OBSERVATIONS",
                headers: ["Test", "Observations", "Inferences"],
                rows: [
                    { label: "(i) Add BaCl₂ then HCl", keys: ["c_obs1", "c_inf1"] },
                    { label: "(ii) Add NaOH to excess", keys: ["c_obs2", "c_inf2"] },
                    { label: "(iii) Add NH₃ to excess", keys: ["c_obs3", "c_inf3"] },
                    { label: "(iv) Add KI & Filter", keys: ["c_obs4", "c_inf4"] },
                    { label: "(v) To filtrate add Starch then Na₂S₂O₃", keys: ["c_obs5", "c_inf5"] }
                ]
            }
        ],
        calculationsBlock: [
            { id: "id_a", label: "Suggest the identity of Salt A:" },
            { id: "id_b", label: "Suggest the identity of Salt B:" },
            { id: "id_c", label: "Suggest the identity of Salt C:" }
        ],
        gradingRubric: { deductionLogic: "Check final identities: A = Barium Chloride (BaCl2), B = Iron(III) Chloride (FeCl3), C = Copper(II) Sulphate (CuSO4). Ensure observations match standard chemistry: A gives apple green flame. B gives blood red with KSCN that decolorizes with SnCl2. C gives white ppt with BaCl2 insoluble in HCl, and iodine release with KI." }
    },
    {
        experimentCode: "QA:03",
        title: "QA. 3: Identification of Inorganic Salts (Exercise 2) - Salts D, E, F",
        subject: "Chemistry",
        category: "Qualitative Analysis",
        xpReward: 700,
        instructions: [
            "1. Select an Unknown Salt (D, E, or F) from the dropdown.",
            "2. Select the specific Test Protocol you wish to perform based on the manual.",
            "3. Click 'Execute Next Step' to progress through the sequence.",
            "4. *PENCIL FLAME TEST:* For Tests D(a)(i) and E(b)(iv), the system will simulate a flame test using the graphite tip of a pencil.",
            "5. *LIMEWATER TEST:* For Test D(b)(iv), watch the gas travel through the delivery tube to turn the limewater milky.",
            "6. *BROWN RING TEST:* For Test E(b)(vi), observe the junction between the acid and the aqueous layer.",
            "7. Record all Observations and Inferences, then deduce the identities of the salts and the transition metal oxidation states."
        ],
        simulationSettings: {
            engineType: "chem_qualitative_advanced",
            preLabBriefing: "Welcome to Exercise 2! 🇨🇲<br><br><b>The Setup:</b> We are identifying Salts D, E, and F using advanced techniques.<br><br><b>What to watch for:</b><br>&bull; <b>Pencil Flame Tests:</b> Look at the color of the flame around the graphite tip.<br>&bull; <b>Limewater:</b> Watch the second tube turn milky white as gas bubbles through it.<br>&bull; <b>Brown Ring:</b> Look for the dark ring forming between the two liquid layers!<br>&bull; <b>Thermal Decomposition:</b> Watch the tilted pyrex tube fill with brown NO₂ gas when heated strongly."
        },
        tableStructure: [
            {
                title: "SALT D OBSERVATIONS",
                headers: ["Test", "Observations", "Inferences"],
                rows: [
                    { label: "a) (i) Flame Test", keys: ["d_obs1", "d_inf1"] },
                    { label: "b) (ii) Add H₂SO₄, then K₂Cr₂O₇", keys: ["d_obs2", "d_inf2"] },
                    { label: "(iii) Add conc HNO₃ & warm", keys: ["d_obs3", "d_inf3"] },
                    { label: "(iv) Add dil HCl (Limewater)", keys: ["d_obs4", "d_inf4"] },
                    { label: "(v) Add Iodine solution", keys: ["d_obs5", "d_inf5"] }
                ]
            },
            {
                title: "SALT E OBSERVATIONS",
                headers: ["Test", "Observations", "Inferences"],
                rows: [
                    { label: "(i) Add NaOH", keys: ["e_obs1", "e_inf1"] },
                    { label: "(ii) Add Na₂CO₃", keys: ["e_obs2", "e_inf2"] },
                    { label: "(iii) Add Na₂SO₄ & stand", keys: ["e_obs3", "e_inf3"] },
                    { label: "(iv) Flame Test", keys: ["e_obs4", "e_inf4"] },
                    { label: "(v) Heat strongly (Pyrex)", keys: ["e_obs5", "e_inf5"] },
                    { label: "(vi) Brown Ring Test", keys: ["e_obs6", "e_inf6"] }
                ]
            },
            {
                title: "SALT F OBSERVATIONS",
                headers: ["Test", "Observations", "Inferences"],
                rows: [
                    { label: "c) (i) NaOH & warm (Litmus)", keys: ["f_obs1", "f_inf1"] },
                    { label: "(ii) Add NaOH then HCl", keys: ["f_obs2", "f_inf2"] },
                    { label: "(iii) Add NaOH then BaCl₂", keys: ["f_obs3", "f_inf3"] },
                    { label: "(iv) Add HCl, then Zinc, warm", keys: ["f_obs4", "f_inf4"] }
                ]
            }
        ],
        calculationsBlock: [
            { id: "id_d", label: "(i) Suggest an identity for D:" },
            { id: "id_e", label: "(i) Suggest an identity for E:" },
            { id: "id_f_metal", label: "(ii) Identify the metal ion in compound F:" },
            { id: "id_f_init", label: "Initial Oxidation State (Before adding Zinc):" },
            { id: "id_f_final", label: "Final Oxidation State (After Zinc reduces it):" }
        ],
        gradingRubric: { deductionLogic: "D = Sodium Sulphite (Na2SO3). E = Calcium Nitrate (Ca(NO3)2). F = Ammonium Iron(III) Sulphate (NH4Fe(SO4)2). Metal ion in F = Iron (Fe). Initial oxidation state = +3 (yellow/brown), Final = +2 (pale green)." }
    },
    {
        experimentCode: "QA:04",
        title: "QA. 4: Identification of Inorganic Salts (Exercise 3) - Salts G, H, I, J",
        subject: "Chemistry",
        category: "Qualitative Analysis",
        xpReward: 800,
        instructions: [
            "1. Select an Unknown Salt (G, H, I, or J) from the dropdown.",
            "2. Select the specific Test Protocol you wish to perform based on the manual.",
            "3. Click 'Execute Next Step' to progress through the sequence.",
            "4. *REDOX ACTIONS:* For Test G(a)(ii) and I(c)(iv), watch the dramatic color changes as transition metals change oxidation states.",
            "5. *THERMAL DECOMPOSITION:* For Test H(b)(v), observe the color of the solid residue while hot versus when it cools down.",
            "6. Record all Observations and Inferences, then deduce the identities of the salts."
        ],
        simulationSettings: {
            engineType: "chem_qualitative_advanced",
            preLabBriefing: "Welcome to Exercise 3! 🇨🇲<br><br><b>The Setup:</b> We are analyzing four highly reactive salts (G, H, I, J).<br><br><b>What to watch for:</b><br>&bull; <b>Manganate(VII) Titration:</b> Watch the intense purple color disappear as it is reduced!<br>&bull; <b>Dichromate Reduction:</b> Observe the shift from vivid orange to dark green.<br>&bull; <b>Heating Solids:</b> Look closely at the Pyrex tube in Test H(v) to see if the solid changes color when hot vs. cold."
        },
        tableStructure: [
            {
                title: "SALT G & H OBSERVATIONS",
                headers: ["Test", "Observations", "Inferences"],
                rows: [
                    { label: "G (a)(i) Add NaOH", keys: ["g_obs1", "g_inf1"] },
                    { label: "G (a)(ii) Add H₂SO₄ & KMnO₄", keys: ["g_obs2", "g_inf2"] },
                    { label: "H (b)(i) Add dil HNO₃", keys: ["h_obs1", "h_inf1"] },
                    { label: "H (b)(ii) Add NaOH", keys: ["h_obs2", "h_inf2"] },
                    { label: "H (b)(iii) Add dil H₂SO₄", keys: ["h_obs3", "h_inf3"] },
                    { label: "H (b)(iv) Add aq NH₃", keys: ["h_obs4", "h_inf4"] },
                    { label: "H (b)(v) Heat strongly", keys: ["h_obs5", "h_inf5"] }
                ]
            },
            {
                title: "SALT I & J OBSERVATIONS",
                headers: ["Test", "Observations", "Inferences"],
                rows: [
                    { label: "I (c)(i) Flame Test", keys: ["i_obs1", "i_inf1"] },
                    { label: "I (c)(ii) Add dil HCl", keys: ["i_obs2", "i_inf2"] },
                    { label: "I (c)(iii) Add AgNO₃", keys: ["i_obs3", "i_inf3"] },
                    { label: "I (c)(iv) Add H₂SO₄ & Na₂SO₃", keys: ["i_obs4", "i_inf4"] },
                    { label: "I (c)(v) Add NaOH to excess", keys: ["i_obs5", "i_inf5"] },
                    { label: "J (d)(i) Flame Test", keys: ["j_obs1", "j_inf1"] },
                    { label: "J (d)(ii & iii) Add H₂SO₄, KI, Starch, Na₂S₂O₃", keys: ["j_obs2", "j_inf2"] }
                ]
            }
        ],
        calculationsBlock: [
            { id: "id_g", label: "(i) Suggest a possible identity for G:" },
            { id: "id_h", label: "Suggest a possible identity for H:" },
            { id: "id_j", label: "Suggest a possible identity for J:" },
            { id: "id_i_metal", label: "(ii) What is the metal ion in I:" },
            { id: "id_i_init", label: "Initial Oxidation State (in test c(iv)):" },
            { id: "id_i_final", label: "Final Oxidation State (in test c(iv)):" }
        ],
        gradingRubric: { deductionLogic: "G = Iron(II) Sulphate (FeSO4). H = Lead(II) Carbonate (PbCO3). J = Copper(II) Nitrate (Cu(NO3)2). Metal ion in I = Chromium (Cr). Initial oxidation state = +6 (orange), Final = +3 (green). Check H(v) observation for 'Brown when hot, yellow when cold' indicating PbO." }
    },
    {
        experimentCode: "QA:05",
        title: "QA. 5: Identification of Inorganic Salts (Exercise 4) - Salts K, L, M",
        subject: "Chemistry",
        category: "Qualitative Analysis",
        xpReward: 800,
        instructions: [
            "1. Select an Unknown Salt (K, L, or M) from the dropdown.",
            "2. Select the specific Test Protocol you wish to perform.",
            "3. Click 'Execute Next Step' to progress through the sequence.",
            "4. *ZINC CONFIRMATION:* For Salt K, watch closely as precipitates dissolve in both excess NaOH and NH₃.",
            "5. *MULTI-CATION SALT:* For Salt M, you will test for three different ions! Watch the Fe²⁺ oxidize to Fe³⁺ after adding KMnO₄, culminating in the blood-red KSCN test.",
            "6. Record all Observations and Inferences."
        ],
        simulationSettings: {
            engineType: "chem_qualitative_advanced",
            preLabBriefing: "Welcome to Exercise 4! 🇨🇲<br><br><b>The Setup:</b> We are identifying Salts K, L, and M using amphoteric properties and complex redox sequences.<br><br><b>What to watch for:</b><br>&bull; <b>Thermal Shifts:</b> Watch the Pyrex tube for Salt K. Does the solid change color when hot, then revert when cold?<br>&bull; <b>Amphoteric Behavior:</b> Watch precipitates form dropwise, then magically dissolve in excess reagent.<br>&bull; <b>Mohr's Salt Sequence:</b> Test M(iv) is a long sequence. Watch the pale green solution decolorize the purple permanganate, turning yellow-brown before forming the famous blood-red complex!"
        },
        tableStructure: [
            {
                title: "SALT K & L OBSERVATIONS",
                headers: ["Test", "Observations", "Inferences"],
                rows: [
                    { label: "K (a)(i) Heat strongly", keys: ["k_obs1", "k_inf1"] },
                    { label: "K (a)(ii) Add dil HCl", keys: ["k_obs2", "k_inf2"] },
                    { label: "K (a)(iii) Add NaOH to excess", keys: ["k_obs3", "k_inf3"] },
                    { label: "K (a)(iv) Add NH₃ to excess", keys: ["k_obs4", "k_inf4"] },
                    { label: "L (b)(i) Heat strongly", keys: ["l_obs1", "l_inf1"] },
                    { label: "L (b)(ii) Flame test on residue", keys: ["l_obs2", "l_inf2"] },
                    { label: "L (b)(iii) Add Conc H₂SO₄", keys: ["l_obs3", "l_inf3"] },
                    { label: "L (b)(iv) Dissolve, AgNO₃, HNO₃, NH₃", keys: ["l_obs4", "l_inf4"] }
                ]
            },
            {
                title: "SALT M OBSERVATIONS",
                headers: ["Test", "Observations", "Inferences"],
                rows: [
                    { label: "M (c)(i) NaOH & warm (Litmus)", keys: ["m_obs1", "m_inf1"] },
                    { label: "M (c)(ii) Add BaCl₂, then HCl", keys: ["m_obs2", "m_inf2"] },
                    { label: "M (c)(iii) Add NH₃ to excess", keys: ["m_obs3", "m_inf3"] },
                    { label: "M (c)(iv) H₂SO₄, KMnO₄, then NaOH & KSCN", keys: ["m_obs4", "m_inf4"] }
                ]
            }
        ],
        calculationsBlock: [
            { id: "id_k", label: "Suggest the identity of Salt K:" },
            { id: "id_l", label: "Suggest the identity of Salt L:" },
            { id: "id_m", label: "Suggest the identity of Salt M:" }
        ],
        gradingRubric: { deductionLogic: "K = Zinc Carbonate (ZnCO3). L = Calcium Chloride (CaCl2). M = Ammonium Iron(II) Sulphate. Verify ZnO thermal property (yellow hot, white cold). Verify amphoteric behavior for Zn2+. Verify M contains NH4+, Fe2+, and SO4(2-)." }
    },
    {
        experimentCode: "QA:06",
        title: "QA. 6: Identification of Inorganic Salts (Exercise 5) - Salts N, O, P",
        subject: "Chemistry",
        category: "Qualitative Analysis",
        xpReward: 800,
        instructions: [
            "1. Select an Unknown Salt (N, O, or P) from the dropdown.",
            "2. Select the specific Test Protocol you wish to perform.",
            "3. *FILTRATION ANALYSIS:* For Salt O, the salt is a mixture. Boiling and filtering separates the insoluble carbonate from the soluble halide. Pay attention to tests on the residue vs the filtrate!",
            "4. *GAS EVOLUTION:* Watch for brown bromine gas during the Conc H₂SO₄ test on Salt P.",
            "5. Record all Observations and Inferences to identify the anions and cations."
        ],
        simulationSettings: {
            engineType: "chem_qualitative_advanced",
            preLabBriefing: "Welcome to Exercise 5! 🇨🇲<br><br><b>The Setup:</b> We are analyzing Salts N, O, and P. <br><br><b>What to watch for:</b><br>&bull; <b>Direct Litmus Test:</b> See if the salt solution itself is alkaline or acidic.<br>&bull; <b>Mixture Separation:</b> Salt O will be boiled and filtered. You must perform tests on the solid residue left in the filter paper AND the clear filtrate liquid.<br>&bull; <b>Halide Solubility:</b> Watch the cream precipitate of Salt P dissolve in concentrated Ammonia!"
        },
        tableStructure: [
            {
                title: "SALT N & O OBSERVATIONS",
                headers: ["Test", "Observations", "Inferences"],
                rows: [
                    { label: "N (a) Flame test", keys: ["n_obs1", "n_inf1"] },
                    { label: "N (b)(i) Test solution with Litmus", keys: ["n_obs2", "n_inf2"] },
                    { label: "N (b)(ii) Add dil HCl (Limewater)", keys: ["n_obs3", "n_inf3"] },
                    { label: "N (b)(iii) Add MgSO₄", keys: ["n_obs4", "n_inf4"] },
                    { label: "O (c) Flame test", keys: ["o_obs1", "o_inf1"] },
                    { label: "O (d)(i) Boil & Filter", keys: ["o_obs2", "o_inf2"] },
                    { label: "O (d)(ii) Residue + dil HCl", keys: ["o_obs3", "o_inf3"] },
                    { label: "O (d)(iii) Filtrate + AgNO₃, HNO₃", keys: ["o_obs4", "o_inf4"] }
                ]
            },
            {
                title: "SALT P OBSERVATIONS",
                headers: ["Test", "Observations", "Inferences"],
                rows: [
                    { label: "P (e)(i) Flame test", keys: ["p_obs1", "p_inf1"] },
                    { label: "P (e)(ii) Add Conc H₂SO₄", keys: ["p_obs2", "p_inf2"] },
                    { label: "P (e)(iii) Dissolve, AgNO₃, HNO₃, Conc NH₃", keys: ["p_obs3", "p_inf3"] }
                ]
            }
        ],
        calculationsBlock: [
            { id: "id_n", label: "Identify the Salt, Anion, and Cation in N:" },
            { id: "id_o", label: "Identify the mixture components of O:" },
            { id: "id_p", label: "Identify the Salt, Anion, and Cation in P:" }
        ],
        gradingRubric: { deductionLogic: "N = Sodium Carbonate (Na2CO3, Na+, CO3 2-). O = Calcium Carbonate and Sodium Chloride mixture. P = Potassium Bromide (KBr, K+, Br-). Check cream precipitate for Bromide dissolving in conc NH3." }
    },
    {
        experimentCode: "QA:07",
        title: "QA. 7: Organic Compounds (Exercise 1) - Alcohols Q, R, S",
        subject: "Chemistry",
        category: "Qualitative Analysis",
        xpReward: 800,
        instructions: [
            "1. Select an Unknown Liquid (Q, R, or S) from the dropdown.",
            "2. Select the specific Test Protocol you wish to perform.",
            "3. Click 'Execute Next Step' to progress through the sequence.",
            "4. *PCl₅ TEST:* Watch the fume cupboard for steamy white fumes indicating an -OH group.",
            "5. *ESTERIFICATION:* Observe if a sweet, fruity odor is detected when poured into water.",
            "6. *OXIDATION:* Watch the Acidified Potassium Dichromate to see if it reduces from orange to green.",
            "7. *IODOFORM TEST:* Look closely for a dense yellow precipitate after 5 minutes of standing.",
            "8. Record all Observations and Inferences, then classify the alcohols."
        ],
        simulationSettings: {
            engineType: "chem_qualitative_advanced",
            preLabBriefing: "Welcome to Organic Analysis! 🇨🇲<br><br><b>The Setup:</b> We are testing three different Alcohols (Q, R, and S). Your goal is to determine which is primary, secondary, and tertiary.<br><br><b>What to watch for:</b><br>&bull; <b>Oxidation:</b> Primary and Secondary alcohols will turn the orange dichromate green. Tertiary alcohols will not react!<br>&bull; <b>Iodoform Test:</b> Only specific structures (like secondary alcohols with a methyl group) will form the heavy yellow precipitate."
        },
        tableStructure: [
            {
                title: "LIQUID Q OBSERVATIONS",
                headers: ["Test", "Observations", "Inferences"],
                rows: [
                    { label: "Q (i) Add PCl₅ (Fume Cupboard)", keys: ["q_obs1", "q_inf1"] },
                    { label: "Q (ii) Ignite in crucible lid", keys: ["q_obs2", "q_inf2"] },
                    { label: "Q (iii) Acetic acid + H₂SO₄, warm, pour to water", keys: ["q_obs3", "q_inf3"] },
                    { label: "Q (iv) K₂Cr₂O₇ + H₂SO₄, warm", keys: ["q_obs4", "q_inf4"] },
                    { label: "Q (v) KI + NaClO, stand 5 mins", keys: ["q_obs5", "q_inf5"] }
                ]
            },
            {
                title: "LIQUID R OBSERVATIONS",
                headers: ["Test", "Observations", "Inferences"],
                rows: [
                    { label: "R (i) Add PCl₅ (Fume Cupboard)", keys: ["r_obs1", "r_inf1"] },
                    { label: "R (ii) Ignite in crucible lid", keys: ["r_obs2", "r_inf2"] },
                    { label: "R (iii) Acetic acid + H₂SO₄, warm, pour to water", keys: ["r_obs3", "r_inf3"] },
                    { label: "R (iv) K₂Cr₂O₇ + H₂SO₄, warm", keys: ["r_obs4", "r_inf4"] },
                    { label: "R (v) KI + NaClO, stand 5 mins", keys: ["r_obs5", "r_inf5"] }
                ]
            },
            {
                title: "LIQUID S OBSERVATIONS",
                headers: ["Test", "Observations", "Inferences"],
                rows: [
                    { label: "S (i) Add PCl₅ (Fume Cupboard)", keys: ["s_obs1", "s_inf1"] },
                    { label: "S (ii) Ignite in crucible lid", keys: ["s_obs2", "s_inf2"] },
                    { label: "S (iii) Acetic acid + H₂SO₄, warm, pour to water", keys: ["s_obs3", "s_inf3"] },
                    { label: "S (iv) K₂Cr₂O₇ + H₂SO₄, warm", keys: ["s_obs4", "s_inf4"] },
                    { label: "S (v) KI + NaClO, stand 5 mins", keys: ["s_obs5", "s_inf5"] }
                ]
            }
        ],
        calculationsBlock: [
            { id: "class_q", label: "1) Classify Q (Primary, Secondary, or Tertiary):" },
            { id: "class_r", label: "1) Classify R:" },
            { id: "class_s", label: "1) Classify S:" },
            { id: "distinguish", label: "2) State a reagent useful in distinguishing chemically between Q, R, and S (Note: Manual typo says P, Q, R):" }
        ],
        gradingRubric: { deductionLogic: "Q = Primary (1°). R = Secondary (2°). S = Tertiary (3°). Verify observations: Q oxidizes to green but fails Iodoform. R oxidizes to green AND gives yellow iodoform ppt. S does neither. Distinguishing reagent = Lucas Reagent (ZnCl2/HCl) OR the combination of Acidified Dichromate and Iodoform reagents." }
    },
    {
        experimentCode: "QA:08",
        title: "QA. 8: Organic Compounds (Exercise 2) - Aldehydes & Ketones T, U, V",
        subject: "Chemistry",
        category: "Qualitative Analysis",
        xpReward: 800,
        instructions: [
            "1. Select an Unknown Compound (T, U, or V) from the dropdown.",
            "2. Select the specific Test Protocol you wish to perform.",
            "3. Click 'Execute Next Step' to progress through the sequence.",
            "4. *TOLLEN'S TEST:* Watch carefully as the clear solution transforms into a brilliant silver mirror coating on the glass!",
            "5. *FEHLING'S TEST:* Look for the distinct blue solution turning into a brick-red opaque precipitate.",
            "6. *WATCH GLASS:* For test V(vi), observe the watch glass over time as the liquid evaporates and oxidizes.",
            "7. Record all Observations and Inferences, then identify the structural features."
        ],
        simulationSettings: {
            engineType: "chem_qualitative_advanced",
            preLabBriefing: "Welcome to Carbonyl Analysis! 🇨🇲<br><br><b>The Setup:</b> We are testing three carbonyl compounds (T, U, V) to distinguish between aldehydes and ketones, and aliphatic vs. aromatic structures.<br><br><b>What to watch for:</b><br>&bull; <b>2,4-DNPH:</b> A bright orange/yellow precipitate confirms a carbonyl (C=O) group.<br>&bull; <b>Tollen's Reagent:</b> Aldehydes reduce the silver ions to metallic silver, coating the tube!<br>&bull; <b>Iodoform:</b> A yellow precipitate confirms a methyl ketone or methyl secondary alcohol structure."
        },
        tableStructure: [
            {
                title: "COMPOUND T OBSERVATIONS",
                headers: ["Test", "Observations", "Inferences"],
                rows: [
                    { label: "T (i) Ignite on crucible lid", keys: ["t_obs1", "t_inf1"] },
                    { label: "T (ii) Shake with water + Litmus", keys: ["t_obs2", "t_inf2"] },
                    { label: "T (iii) Add K₂Cr₂O₇ + H₂SO₄, warm", keys: ["t_obs3", "t_inf3"] },
                    { label: "T (iv) Iodine + NaOH (Iodoform), warm", keys: ["t_obs4", "t_inf4"] },
                    { label: "T (v) Tollen's Reagent, hot water bath", keys: ["t_obs5", "t_inf5"] }
                ]
            },
            {
                title: "COMPOUND U OBSERVATIONS",
                headers: ["Test", "Observations", "Inferences"],
                rows: [
                    { label: "U (i) Ignite on crucible lid", keys: ["u_obs1", "u_inf1"] },
                    { label: "U (ii) Add 2,4-DNPH", keys: ["u_obs2", "u_inf2"] },
                    { label: "U (iii) Add Fehling's solution", keys: ["u_obs3", "u_inf3"] },
                    { label: "U (iv) KI + NaClO (Iodoform), warm", keys: ["u_obs4", "u_inf4"] },
                    { label: "U (v) Filter (iv) + neutral FeCl₃", keys: ["u_obs5", "u_inf5"] }
                ]
            },
            {
                title: "COMPOUND V OBSERVATIONS",
                headers: ["Test", "Observations", "Inferences"],
                rows: [
                    { label: "V (i) Add 2,4-DNPH", keys: ["v_obs1", "v_inf1"] },
                    { label: "V (ii) Add KMnO₄ + H₂SO₄, warm", keys: ["v_obs2", "v_inf2"] },
                    { label: "V (iii) Iodine + NaOH (Iodoform)", keys: ["v_obs3", "v_inf3"] },
                    { label: "V (iv) Tollen's Reagent, warm", keys: ["v_obs4", "v_inf4"] },
                    { label: "V (v) Fehling's solution, heat", keys: ["v_obs5", "v_inf5"] },
                    { label: "V (vi) Watch glass in air", keys: ["v_obs6", "v_inf6"] }
                ]
            }
        ],
        calculationsBlock: [
            { id: "feat_t", label: "1. Identify the structural features of T:" },
            { id: "feat_u", label: "2. Give the structural features of U:" },
            { id: "feat_v", label: "3. Comment on the features of V:" }
        ],
        gradingRubric: { deductionLogic: "T = Ethanal (Aliphatic Aldehyde with CH3CO- group). U = Propanone/Acetone (Aliphatic Ketone with CH3CO- group). V = Benzaldehyde (Aromatic Aldehyde). Verify T gives positive Tollen's AND Iodoform. Verify U gives positive Iodoform but negative Tollen's/Fehling's. Verify V gives positive Tollen's, negative Fehling's, and forms Benzoic Acid crystals." }
    },
    {
        experimentCode: "QA:08_EX3", // Using EX3 to differentiate from the previous aldehyde/ketone block if you kept them in the same file
        title: "QA. 9: Organic Compounds (Exercise 3) - Solids W, X, Y",
        subject: "Chemistry",
        category: "Qualitative Analysis",
        xpReward: 800,
        instructions: [
            "1. Select an Unknown Solid (W, X, or Y) from the dropdown.",
            "2. Select the specific Test Protocol you wish to perform.",
            "3. Click 'Execute Next Step' to progress through the sequence.",
            "4. *IGNITION TESTS:* Watch the flame carefully! A clean blue/yellow flame suggests aliphatic, while an orange flame with thick black soot indicates an aromatic ring.",
            "5. *IRON(III) CHLORIDE TEST:* Observe the dramatic color changes. Look for deep violet complexes or buff-colored precipitates.",
            "6. *GAS IGNITION:* In tests involving strong heat or soda lime, watch for a secondary flame igniting at the mouth of the test tube!",
            "7. Record all Observations and Inferences, then identify the structural classifications."
        ],
        simulationSettings: {
            engineType: "chem_qualitative_advanced",
            preLabBriefing: "Welcome to Aromatic Analysis! 🇨🇲<br><br><b>The Setup:</b> We are testing three organic solids (W, X, Y). Solid W is known to be Phenol. We must determine if X and Y are aliphatic or aromatic carboxylic acid salts.<br><br><b>What to watch for:</b><br>&bull; <b>Sooty Flames:</b> High carbon-to-hydrogen ratios (aromatics) burn with yellow, smoky flames.<br>&bull; <b>The Violet Complex:</b> Phenol reacts with neutral FeCl₃ to form a beautiful, deep purple coordination complex.<br>&bull; <b>Decarboxylation:</b> Heating salts with Soda Lime removes the -COOH group, releasing the parent hydrocarbon. Watch for the gas burning at the mouth of the tube!"
        },
        tableStructure: [
            {
                title: "SOLID W OBSERVATIONS (Phenol)",
                headers: ["Test", "Observations", "Inferences"],
                rows: [
                    { label: "W (i) Stand in crucible lid, smell", keys: ["w_obs1", "w_inf1"] },
                    { label: "W (ii) Add neutral FeCl₃ & heat", keys: ["w_obs2", "w_inf2"] },
                    { label: "W (iii) Test solution with Litmus", keys: ["w_obs3", "w_inf3"] },
                    { label: "W (iv) Ignite in crucible lid", keys: ["w_obs4", "w_inf4"] }
                ]
            },
            {
                title: "SOLID X OBSERVATIONS",
                headers: ["Test", "Observations", "Inferences"],
                rows: [
                    { label: "X (i) Flame test on portion", keys: ["x_obs1", "x_inf1"] },
                    { label: "X (ii) Heat strongly (Burn gas at mouth)", keys: ["x_obs2", "x_inf2"] },
                    { label: "X (iii) Add Conc H₂SO₄", keys: ["x_obs3", "x_inf3"] },
                    { label: "X (iv) Test solution with Litmus", keys: ["x_obs4", "x_inf4"] },
                    { label: "X (v) Add neutral FeCl₃ & heat", keys: ["x_obs5", "x_inf5"] }
                ]
            },
            {
                title: "SOLID Y OBSERVATIONS",
                headers: ["Test", "Observations", "Inferences"],
                rows: [
                    { label: "Y (i) Flame test on portion", keys: ["y_obs1", "y_inf1"] },
                    { label: "Y (ii) Add Conc H₂SO₄, warm", keys: ["y_obs2", "y_inf2"] },
                    { label: "Y (iii) Heat with Soda Lime (Burn gas at mouth)", keys: ["y_obs3", "y_inf3"] },
                    { label: "Y (iv) Test solution with Litmus", keys: ["y_obs4", "y_inf4"] },
                    { label: "Y (v) Add neutral FeCl₃ & heat", keys: ["y_obs5", "y_inf5"] }
                ]
            }
        ],
        calculationsBlock: [
            { id: "id_arom", label: "Identify the salt of carboxylic acid which is (i) Aromatic:" },
            { id: "id_aliph", label: "Identify the salt of carboxylic acid which is (ii) Aliphatic:" }
        ],
        gradingRubric: { deductionLogic: "W = Phenol (Aromatic, weak acid, gives violet FeCl3 complex). X = Sodium Oxalate (Aliphatic, burns clean, gives CO gas). Y = Sodium Benzoate (Aromatic, burns sooty, gives benzene with soda lime, gives buff ppt with FeCl3). Final answers: Aromatic = Y, Aliphatic = X." }
    },
    {
        experimentCode: "QA:09",
        title: "QA. 9: Organic Compounds (Exercise 4) - Compounds AA, BB, CC",
        subject: "Chemistry",
        category: "Qualitative Analysis",
        xpReward: 800,
        instructions: [
            "1. Select an Unknown Compound (AA, BB, or CC) from the dropdown.",
            "2. Execute the sequential tests as instructed by the manual.",
            "3. *CANNIZZARO REACTION:* For test BB(iv), watch the aldehyde dissolve in hot concentrated NaOH, and then instantly precipitate as a white carboxylic acid salt when HCl is added!",
            "4. Record all Observations and Inferences to deduce the structures."
        ],
        simulationSettings: {
            engineType: "chem_qualitative_advanced",
            preLabBriefing: "Welcome to Exercise 4! 🇨🇲<br><br><b>The Setup:</b> We are testing an Acid, an Aldehyde, and an Alcohol.<br><br><b>What to watch for:</b><br>&bull; <b>Esterification:</b> Watch for the 'Sweet Fruity Odour' popup.<br>&bull; <b>The Cannizzaro Reaction:</b> Test BB(iv) demonstrates a disproportionation reaction unique to aldehydes lacking alpha-hydrogens!"
        },
        tableStructure: {
            headers: ["Test", "Observations", "Inferences"],
            rows: [
                { label: "AA (i) Esterification (Ethanol + H₂SO₄)", keys: ["aa_obs1", "aa_inf1"] },
                { label: "AA (ii) Shake with water + Litmus", keys: ["aa_obs2", "aa_inf2"] },
                { label: "AA (iii) Add neutral FeCl₃", keys: ["aa_obs3", "aa_inf3"] },
                { label: "BB (i) Ignite in crucible", keys: ["bb_obs1", "bb_inf1"] },
                { label: "BB (ii) Add 2,4-DNPH", keys: ["bb_obs2", "bb_inf2"] },
                { label: "BB (iii) Tollen's Reagent", keys: ["bb_obs3", "bb_inf3"] },
                { label: "BB (iv) Conc NaOH, warm, dissolve, add HCl", keys: ["bb_obs4", "bb_inf4"] },
                { label: "CC (i) Ignite in crucible", keys: ["cc_obs1", "cc_inf1"] },
                { label: "CC (ii) PCl₅ in Fume Cupboard", keys: ["cc_obs2", "cc_inf2"] },
                { label: "CC (iii) K₂Cr₂O₇ + H₂SO₄, warm", keys: ["cc_obs3", "cc_inf3"] }
            ]
        },
        calculationsBlock: [
            { id: "id_aa", label: "Suggest the structural identity of AA:" },
            { id: "id_bb", label: "Suggest the structural identity of BB:" },
            { id: "id_cc", label: "Suggest the structural identity of CC:" }
        ],
        gradingRubric: { deductionLogic: "AA = Ethanoic Acid (Aliphatic). BB = Benzaldehyde (Aromatic Aldehyde). CC = Benzyl Alcohol. Verify AA gives fruity smell but negative FeCl3. Verify BB gives Cannizzaro white ppt. Verify CC oxidizes (orange to green)." }
    },
    {
        experimentCode: "QA:10",
        title: "QA. 10: Chemistry of Amines, Amides, Amino Acids (Exercise 5) - DD, EE, FF",
        subject: "Chemistry",
        category: "Qualitative Analysis",
        xpReward: 900,
        instructions: [
            "1. Select an Unknown Compound (DD, EE, or FF).",
            "2. Execute the tests.",
            "3. *AMINO ACID CHELATION:* In test FF(iv), watch the amphoteric amino acid dissolve the Copper(II) precipitate to form a stunning deep blue complex.",
            "4. *BROMINATION:* Watch for the heavy white precipitate of 2,4,6-tribromoaniline in test DD(iii)."
        ],
        simulationSettings: {
            engineType: "chem_qualitative_advanced",
            preLabBriefing: "Welcome to Nitrogen Chemistry! 🇨🇲<br><br><b>The Setup:</b> You are identifying an Amine, an Amide, and an Amino Acid.<br><br><b>What to watch for:</b><br>&bull; <b>Gas Evolution:</b> Nitrous acid (NaNO₂ + HCl) will cause primary amines and amino acids to effervesce vigorously (N₂ gas).<br>&bull; <b>Copper Complexes:</b> Amino acids form beautiful deep blue chelate complexes with Copper(II) ions!"
        },
        tableStructure: {
            headers: ["Test", "Observations", "Inferences"],
            rows: [
                { label: "DD (i) Water, HCl, then excess NaOH", keys: ["dd_obs1", "dd_inf1"] },
                { label: "DD (ii) Water, HCl, then NaNO₂", keys: ["dd_obs2", "dd_inf2"] },
                { label: "DD (iii) Bromine water dropwise", keys: ["dd_obs3", "dd_inf3"] },
                { label: "EE (i) Add NaOH, warm (Litmus)", keys: ["ee_obs1", "ee_inf1"] },
                { label: "EE (ii) HCl then NaNO₂", keys: ["ee_obs2", "ee_inf2"] },
                { label: "FF (i) Water + Litmus", keys: ["ff_obs1", "ff_inf1"] },
                { label: "FF (ii) Add Na₂CO₃ (Limewater)", keys: ["ff_obs2", "ff_inf2"] },
                { label: "FF (iii) HCl then NaNO₂", keys: ["ff_obs3", "ff_inf3"] },
                { label: "FF (iv) Add CuSO₄ then NaOH", keys: ["ff_obs4", "ff_inf4"] }
            ]
        },
        calculationsBlock: [
            { id: "class_amide", label: "Classify the solution which is an Amide:" },
            { id: "class_amine", label: "Classify the solution which is an Amine:" },
            { id: "class_amino_acid", label: "Classify the solution which is an Amino Acid:" }
        ],
        gradingRubric: { deductionLogic: "Amide = EE (evolves NH3 with NaOH). Amine = DD (Aromatic primary amine, gives white ppt with Br2). Amino Acid = FF (Amphoteric, evolves CO2 with Carbonate, gives deep blue Cu complex)." }
    },
    {
        experimentCode: "QA:11",
        title: "QA. 11: Chemistry of Carbohydrates (Exercise 6) - JJ, KK, LL",
        subject: "Chemistry",
        category: "Qualitative Analysis",
        xpReward: 1000,
        instructions: [
            "1. Select an Unknown Carbohydrate (JJ, KK, or LL).",
            "2. *DEHYDRATION CHARRING:* For test KK(ii), add Conc H₂SO₄ to the sugar and step back! Watch the sugar physically expand into a boiling black carbon snake.",
            "3. *HYDROLYSIS:* In test KK(iv), watch the non-reducing sugar be forced to reduce Fehling's solution after boiling with HCl.",
            "4. Record Observations and identify the sugars."
        ],
        simulationSettings: {
            engineType: "chem_qualitative_advanced",
            preLabBriefing: "Welcome to Carbohydrate Chemistry! 🇨🇲<br><br><b>The Setup:</b> We are distinguishing between reducing sugars, non-reducing sugars, and complex starches.<br><br><b>What to watch for:</b><br>&bull; <b>Fehling's Test:</b> Reducing sugars (like glucose) will turn the blue solution into a brick-red precipitate.<br>&bull; <b>Sulphuric Acid Charring:</b> Conc H₂SO₄ is a powerful dehydrating agent. It will literally strip the water out of the carbohydrate, leaving behind a massive column of expanding black carbon!"
        },
        tableStructure: {
            headers: ["Test", "Observations", "Inferences"],
            rows: [
                { label: "JJ (i) Ignite on crucible lid", keys: ["jj_obs1", "jj_inf1"] },
                { label: "JJ (ii) Fehling's Solution, heat", keys: ["jj_obs2", "jj_inf2"] },
                { label: "JJ (iii) Tollen's Reagent, heat", keys: ["jj_obs3", "jj_inf3"] },
                { label: "KK (i) Ignite on crucible lid", keys: ["kk_obs1", "kk_inf1"] },
                { label: "KK (ii) Add Conc H₂SO₄, warm", keys: ["kk_obs2", "kk_inf2"] },
                { label: "KK (iii) Fehling's Solution, boil", keys: ["kk_obs3", "kk_inf3"] },
                { label: "KK (iv) Boil w/ HCl, neutralize NaOH, Fehling's", keys: ["kk_obs4", "kk_inf4"] },
                { label: "LL (i) Heat strongly (crucible)", keys: ["ll_obs1", "ll_inf1"] },
                { label: "LL (ii) Boil water, add LL, KIO₃, KI, H₂SO₄", keys: ["ll_obs2", "ll_inf2"] },
                { label: "LL (iii) Add Na₂S₂O₃ to mixture", keys: ["ll_obs3", "ll_inf3"] }
            ]
        },
        calculationsBlock: [
            { id: "feat_jj", label: "1) What structural feature of JJ accounts for its actions in a(iii)? Hence identify JJ." },
            { id: "id_kk_ll", label: "2) Suggest an identity for KK and LL." }
        ],
        gradingRubric: { deductionLogic: "JJ = Glucose (Reducing sugar, aldehyde group reduces Tollens). KK = Sucrose (Non-reducing, chars violently with acid, hydrolyzes to reducing). LL = Starch (Forms blue-black complex with Iodine generated in situ)." }
    },
    {
    experimentCode: "BIO14_1",
    title: "Lab 14: Biomolecules in Soya Bean Milk (Solution Q)",
    subject: "Biology",
    category: "Biochemistry & Nutrition",
    xpReward: 50,
    aiGradingRubric: `
        You are a strict Cambridge GCE A-Level Biology Examiner. 
        Evaluate the student's observations and deductions for Soya Bean Milk (Solution Q).
        1. Starch (Iodine test): Soya milk has NO starch. Observation must be 'yellow/brown' or 'unchanged'. Deduction: Starch absent.
        2. Reducing Sugar (Benedict's): Soya milk has NO free reducing sugar. Observation must be 'remains blue'. Deduction: Absent.
        3. Non-Reducing Sugar (Acid Hydrolysis + Benedict's): Soya milk HAS sucrose. Observation must be 'brick-red precipitate' or 'orange/red'. Deduction: Present.
        4. Lipids (Ethanol emulsion): Soya milk HAS fats. Observation must be 'cloudy white emulsion'. Deduction: Present.
        5. Proteins (Biuret test): Soya milk is HIGH in protein. Observation must be 'violet', 'purple', or 'lilac'. Deduction: Present.
        Grade out of 50. Be strict. If they leave an observation blank, penalize them heavily. Provide HTML formatted feedback with <p> and <ul> tags. Give the final score as a number.
    `,
    manualContent: `
        <h3>Experiment 1: Identification of Biomolecules in Commercially Sold Food Stuffs</h3>
        <p><strong>Sample Solution:</strong> Soya bean milk (Solution Q)</p>
        
        <h4>Apparatus & Reagents:</h4>
        <ul>
            <li>Test tubes & Test tube rack</li>
            <li>Iodine / KI solution</li>
            <li>Benedict's solution</li>
            <li>Dilute HCl & NaHCO3 powder/solution</li>
            <li>Biuret Reagents (5% KOH & 1% CuSO4) / Millon's Reagent</li>
            <li>Ethanol & Distilled Water</li>
            <li>Water bath (Boiling water)</li>
        </ul>

        <h4>Instructions:</h4>
        <ol>
            <li>Select a test tube in the rack for each biological molecule test.</li>
            <li>Add 2cm³ of Solution Q to the tube.</li>
            <li>Apply the correct reagent(s) and heat in the water bath if required by procedure.</li>
            <li>Observe any color shift or emulsion and record your procedure, observation, and deduction in the report table below.</li>
        </ol>
    `
},
{
    experimentCode: "BIO14_2",
    title: "Lab 14.2: Digestion of Starch by Salivary Amylase",
    subject: "Biology",
    category: "Enzymology & Biochemistry",
    xpReward: 60,
    aiGradingRubric: `
        You are a strict Cambridge GCE A-Level Biology Examiner. Grade the student's report on Starch Digestion by Amylase.
        1. Iodine Test: Tube A (Starch only) must turn Blue-Black. Tube B (Amylase) and Tube C (Starch+Amylase) remain yellow/brown because amylase hydrolyzed the starch in C.
        2. Benedict's Test: Tube C must show a brick-red/orange precipitate because starch was hydrolyzed into maltose (a reducing sugar). Tubes A and B remain blue.
        3. Protein (Millon's) Test: Tubes B and C must turn pink/red (or show protein presence) because Amylase is an enzyme, and all enzymes are proteins. Tube A remains clear/negative.
        4. Theory: The product of starch digestion is maltose. The role of amylase is to act as a biological catalyst/enzyme. Tube A is the control for starch stability; Tube B is the control for the enzyme itself.
        Grade strictly out of 60. Penalize heavily for missing control explanations or incorrect color changes. Use <p> and <ul> tags for formatting. Give a final numeric score.
    `,
    manualContent: `
        <h3>Experiment 2: Digestion of Starch by Salivary Amylase</h3>
        <p><strong>Objective:</strong> To demonstrate the hydrolysis of starch into reducing sugars by the enzyme amylase, and to identify the biochemical nature of the enzyme.</p>
        
        <h4>Apparatus & Reagents:</h4>
        <ul>
            <li>3 Test tubes (A, B, and C)</li>
            <li>1% Starch Solution & Distilled Water</li>
            <li>Salivary Amylase (Enzyme)</li>
            <li>Iodine (I₂/KI) Solution</li>
            <li>Benedict's Solution & Millon's Reagent</li>
            <li>Water Bath (37°C Incubator & 100°C Boiling)</li>
        </ul>
    `
},
{
    experimentCode: "BIO14_3",
    title: "Lab 14.3: Biomolecules in Known Grains (Germinating Maize)",
    subject: "Biology",
    category: "Biochemistry & Nutrition",
    xpReward: 60,
    aiGradingRubric: `
        You are a strict Cambridge GCE A-Level Biology Examiner. Grade the student's report on Germinating Maize Seeds.
        1. Starch Test: Observation must be 'blue-black'. Explanation: Starch is the primary storage polysaccharide in the maize endosperm.
        2. Reducing Sugar Test: Observation must be 'brick-red precipitate' or 'orange/red'. Explanation: During germination, enzymes (amylase) hydrolyze stored starch into reducing sugars (maltose/glucose) to provide energy for the growing embryo.
        3. Protein Test: Observation must be 'violet/purple' (Biuret) or 'red precipitate' (Millon's). Explanation: Proteins are present as structural components and as active enzymes catalyzing the germination process.
        Grade strictly out of 40. Penalize for missing explanations of *why* these molecules are present in a germinating seed. Use <p> and <ul> tags for formatting. Give a final numeric score.
    `,
    manualContent: `
        <h3>Experiment 3: Identification of Biomolecules in known grains</h3>
        <p><strong>Material Provided:</strong> Germinating maize grains, Iodine solution, Benedict's solution, Biuret/Millon's reagent, mortar and pestle, filter paper, funnel.</p>
        
        <h4>Instructions (Part 2):</h4>
        <ol>
            <li>Crush five germinating maize seeds in a mortar using a pestle.</li>
            <li>Add some distilled water to the crushed paste and stir well.</li>
            <li>Filter the mixture to obtain a clear extract (filtrate).</li>
            <li>Investigate the presence of starch, reducing sugars, and proteins in the filtrate.</li>
            <li>Record your Procedure, Observations/Results, and Explanations for each test.</li>
        </ol>
    `
},
{
    experimentCode: "BIO15_1",
    title: "Lab 15.1: Investigating the Role of Catalase Enzymes (Liver Extract)",
    subject: "Biology",
    category: "Enzymology",
    xpReward: 60,
    aiGradingRubric: `
        You are a strict Cambridge GCE A-Level Biology Examiner. Grade the student's report on the Catalase Enzyme experiment.
        1. Title: Must mention investigating catalase, enzymes in liver, or the breakdown of hydrogen peroxide.
        2. Procedure & Precautions: Must mention crushing the liver to release intracellular enzymes, using equal volumes for fair testing, or handling H2O2 safely.
        3. Tube A (Liver) Obs: Must mention effervescence, frothing, or rapid bubbling.
        4. Tube A Inference: Liver contains catalase which rapidly catalyzes the breakdown of H2O2 into water and oxygen gas.
        5. Tube B (Water) Obs: No visible reaction, no bubbles.
        6. Tube B Inference / Purpose: Acts as a CONTROL. Proves that H2O2 does not break down rapidly on its own without the enzyme.
        Grade strictly out of 40. Penalize heavily for missing the word 'control' for Tube B. Use HTML <p> and <ul> tags. Give a final numeric score.
    `,
    manualContent: `
        <h3>Experiment 1: Investigating the role of catalase enzymes</h3>
        <p><strong>Objective:</strong> To demonstrate the presence and activity of catalase in biological tissues.</p>
        
        <h4>Apparatus & Reagents:</h4>
        <ul>
            <li>Fresh mammalian liver tissue</li>
            <li>Hydrogen Peroxide (H₂O₂) solution</li>
            <li>Distilled water</li>
            <li>Mortar and pestle, filter paper, test tubes</li>
        </ul>
        
        <h4>Instructions:</h4>
        <ol>
            <li>Crush a piece of liver in a mortar with a pestle. Add water, stir, and filter to produce a stock liver solution.</li>
            <li>Fill Test Tube A with liver solution and Test Tube B with an equal volume of distilled water.</li>
            <li>Add drops of Hydrogen Peroxide to each test tube.</li>
            <li>Observe the reaction (or lack thereof) and complete the report.</li>
        </ol>
    `
},
{
    experimentCode: "BIO15_2",
    title: "Lab 15.2: Effect of Temperature on the Rate of Enzyme Activity",
    subject: "Biology",
    category: "Enzymology",
    xpReward: 80,
    aiGradingRubric: `
        You are a strict Cambridge GCE A-Level Biology Examiner. Grade the student's report on Temperature vs. Catalase Activity.
        1. Hypothesis: Must state a general relationship (e.g., Enzyme activity increases with temperature up to an optimum, then decreases as it denatures).
        2. Variables: IV = Temperature. DV = Rate of reaction / degree of fizzing. Controlled = Volume of liver, Volume of H2O2, pH.
        3. Observations (Table): Tube P = Very slow/little fizzing. Tube Q = Rapid/vigorous fizzing. Tube R = Slow/little fizzing. Tube S = No fizzing.
        4. Interpretations:
           - Tube P (-4C): Enzyme is INACTIVE due to low kinetic energy. Infrequent successful collisions. (Must NOT say denatured).
           - Tube Q (25C): High kinetic energy, active sites intact. High collision rate.
           - Tube R (60C): Enzyme is denaturing. Hydrogen/ionic bonds breaking, altering active site shape.
           - Tube S (100C): Enzyme is completely denatured. Active site destroyed.
        Grade strictly out of 40. Penalize if they say cold temperatures 'denature' enzymes. Use HTML <p> and <ul> tags. Give a final numeric score.
    `,
    manualContent: `
        <h3>Experiment 2: Effect of temperature on the rate of enzyme activity</h3>
        <p><strong>Objective:</strong> To determine how varying temperatures affect the rate at which catalase breaks down hydrogen peroxide.</p>
        
        <h4>Apparatus & Reagents:</h4>
        <ul>
            <li>Liver enzyme stock solution</li>
            <li>Hydrogen Peroxide (H₂O₂)</li>
            <li>4 Test tubes (P, Q, R, S)</li>
            <li>Water baths (-4°C, 25°C, 60°C, 100°C)</li>
        </ul>
    `
},
{
    experimentCode: "BIO15_3",
    title: "Lab 15.3: Effect of pH on the Rate of Enzyme Activity",
    subject: "Biology",
    category: "Enzymology",
    xpReward: 80,
    aiGradingRubric: `
        You are a strict Cambridge GCE A-Level Biology Examiner. Grade the student's report on pH vs. Catalase Activity.
        1. General Question: pH affects enzymes by altering the charges on the amino acids in the active site, which can break ionic bonds and denature the tertiary structure.
        2. Hypothesis: e.g., "Catalase will show maximum activity at a neutral pH and decreased activity at extreme acidic or alkaline pH values."
        3. Variables: Independent = pH level (HCl vs NaOH). Dependent = Degree of fizzing/rate of reaction. Controlled = Temperature, volume of liver extract, volume of H2O2.
        4. Observations (Table): Tube A (Acidic) = No/very little fizzing. Tube B (Neutral) = Rapid/vigorous fizzing. Tube C (Alkaline) = No/very little fizzing.
        5. Interpretation: Extreme pH (A and C) denatured the catalase enzyme by altering its active site. Tube B provided the optimum pH for successful enzyme-substrate complexes.
        Grade strictly out of 40. Use HTML <p> and <ul> tags. Give a final numeric score.
    `,
    manualContent: `
        <h3>Experiment 3: Effect of pH on the rate of enzyme activity</h3>
        <p><strong>Objective:</strong> To investigate how different pH environments (acidic, neutral, alkaline) affect the catalytic rate of catalase.</p>
        
        <h4>Apparatus & Reagents:</h4>
        <ul>
            <li>Freshly prepared liver solution (Catalase)</li>
            <li>Hydrogen Peroxide (H₂O₂)</li>
            <li>Dilute Hydrochloric Acid (HCl) & Sodium Hydroxide (NaOH)</li>
            <li>Distilled water & Test tubes</li>
        </ul>
    `
},
{
    experimentCode: "BIO15_4",
    title: "Lab 15.4: Effect of Substrate and Enzyme Concentration on Catalase",
    subject: "Biology",
    category: "Enzymology",
    xpReward: 80,
    aiGradingRubric: `
        You are a strict Cambridge GCE A-Level Biology Examiner. Grade the student's report on Catalase Concentration.
        1. Hypotheses: Substrate (As substrate concentration increases, rate increases until enzymes are saturated). Enzyme (As enzyme concentration increases, rate increases directly if substrate is in excess).
        2. Observations: Tube A (Fastest/Vigorous fizzing). Tube B (Fast fizzing, but less than A). Tube C (Moderate fizzing). Tube D (No fizzing).
        3. Interpretations: 
           - A: Highest enzyme concentration yields highest collision rate with substrate.
           - B: Lower enzyme concentration than A yields slightly lower reaction rate.
           - C: Lowest enzyme concentration yields lowest reaction rate.
           - D: Control tube lacking enzyme. Proves H2O2 does not breakdown rapidly on its own.
        4. Comparisons: A vs B (A is faster because 3ml > 2ml enzyme). C vs D (C reacts, D does not; proves enzyme is required).
        Grade strictly out of 40. Penalize if they fail to identify Tube D as the control. Use HTML <p> and <ul> tags. Give a final numeric score.
    `,
    manualContent: `
        <h3>Experiment 4: Effect of substrate and enzyme concentration on catalase activities</h3>
        <p><strong>Objective:</strong> To determine how varying the amount of enzyme (potato extract) and substrate (H₂O₂) affects the reaction rate.</p>
        
        <h4>Apparatus & Reagents:</h4>
        <ul>
            <li>Fresh potato tuber</li>
            <li>Hydrogen Peroxide (H₂O₂) & Distilled water</li>
            <li>Syringes, test tubes (A, B, C, D), mortar and pestle</li>
        </ul>
    `
},
{
    experimentCode: "BIO15_5",
    title: "Lab 15.5: Effect of Substrate Concentration on Enzyme Activity",
    subject: "Biology",
    category: "Enzymology",
    xpReward: 80,
    aiGradingRubric: `
        You are a strict Cambridge GCE A-Level Biology Examiner. Grade the student's report on Substrate Concentration vs. Catalase Activity.
        1. Hypothesis: Must state that as substrate concentration (H2O2) increases, the rate of reaction (foam height) increases.
        2. Variables: Independent = Substrate concentration / Percentage dilution. Dependent = Length of foaming in cm / Degree of fizzing. Controlled = Enzyme volume/concentration, temperature, pH.
        3. Observations (Table): The 100% tube must have the highest foam (approx 6.0 cm), scaling down proportionally to 0 cm for the 0% tube.
        4. Interpretations: Increased substrate concentration provides more substrate molecules to collide with enzyme active sites. This increases the frequency of successful enzyme-substrate complexes, yielding more oxygen gas (foam). The 0% tube acts as a control.
        Grade strictly out of 40. Penalize for missing units (cm) or confusing independent and dependent variables. Use HTML <p> and <ul> tags. Give a final numeric score.
    `,
    manualContent: `
        <h3>Experiment 5: Effect of Substrate Concentration on Enzyme Activity</h3>
        <p><strong>Objective:</strong> To determine how varying the percentage dilution of Hydrogen Peroxide affects the volume of oxygen gas produced by catalase.</p>
        
        <h4>Apparatus & Reagents:</h4>
        <ul>
            <li>Liver enzyme stock solution (Catalase)</li>
            <li>Hydrogen Peroxide (H₂O₂) stock solution</li>
            <li>Distilled water & 5 Test tubes</li>
            <li>Ruler (for measuring foam height)</li>
        </ul>
    `
},
{
    experimentCode: "BIO15_6",
    title: "Lab 15.6: Distribution of Catalase in a Germinating Seed",
    subject: "Biology",
    category: "Enzymology",
    xpReward: 80,
    aiGradingRubric: `
        You are a strict Cambridge GCE A-Level Biology Examiner. Grade the student's report on Catalase Distribution in Seeds.
        1. Hypothesis: Catalase concentration varies across different parts of the germinating seed, being highest in regions with the highest metabolic activity.
        2. Variables: Independent = Part of the germinating seed used. Dependent = Qualitative fizzing / Quantitative height of foam. Controlled = Volume of H2O2, mass of tissue, temperature.
        3. Observations: Tube A (Testa) = No/Slight fizz, ~0-0.2cm. Tube B (Cotyledon) = Moderate fizz, ~2-3cm. Tube C (Plumule) = Vigorous fizz, ~4-5cm. Tube D (Radicle) = Most vigorous fizz, ~5-6cm.
        4. Interpretations: 
           - Testa: Dead, protective tissue. Lacks metabolic activity and thus lacks enzymes.
           - Cotyledon: Storage tissue. Moderate metabolism to mobilize food reserves.
           - Plumule/Radicle: Actively growing meristematic tissues with extremely high respiration rates. They produce high amounts of toxic H2O2 as a byproduct, requiring the highest catalase concentration to detoxify it.
        Grade strictly out of 40. Penalize if they fail to link catalase concentration to the metabolic/growth rate of the specific tissue. Use HTML <p> and <ul> tags. Give a final numeric score.
    `,
    manualContent: `
        <h3>Experiment 6: Distribution and concentration of catalase in various parts of a germinating bean seed</h3>
        <p><strong>Objective:</strong> To determine how enzyme concentration varies across different anatomical regions of a developing plant embryo.</p>
        
        <h4>Apparatus & Reagents:</h4>
        <ul>
            <li>10 germinating bean seeds</li>
            <li>Hydrogen Peroxide (H₂O₂)</li>
            <li>Mortar, pestle, filter paper, test tubes, syringes</li>
            <li>Scalpel (for dissection)</li>
        </ul>
    `
},
{
    experimentCode: "BIO13_1",
    title: "Lab 13.1: Physiological Experiments on Osmosis (Carrot Strips)",
    subject: "Biology",
    category: "Cell Physiology",
    xpReward: 80,
    aiGradingRubric: `
        You are a strict Cambridge GCE A-Level Biology Examiner. Grade the student's report on Osmosis in Carrot Tuber Strips.
        1. Principle: Osmosis.
        2. Variables: Independent = Concentration / Type of solution. Dependent = Change in length/texture (or weight). Controlled = Initial dimensions (5x1x1cm), time (45 mins), plant tissue type.
        3. Table Data: Distilled water must show an increase in length and positive %. NaCl solutions must show a decrease in length and negative %. NaOH should show a decrease and a mushy/slimy texture.
        4. Interpretations (Weight/Size):
           - Distilled Water: Hypotonic environment. Water entered the cells via osmosis down the water potential gradient. Cells became turgid, increasing length/weight.
           - 0.5M NaCl: Hypertonic environment. Water left the cells via osmosis. Cells became flaccid, decreasing length/weight.
           - 1M NaCl: Highly hypertonic. More water left the cells, leading to severe plasmolysis and a larger decrease in size.
           - 1M NaOH: While hypertonic, NaOH is a strong base that chemically degrades/hydrolyzes cell walls (pectin), causing the tissue to become mushy and lose structural integrity.
        5. Water Potential Conclusion: Distilled water has a higher (less negative) water potential than the carrot cells. NaCl solutions have a lower (more negative) water potential than the cells.
        Grade strictly out of 40. Use HTML <p> and <ul> tags. Give a final numeric score.
    `,
    manualContent: `
        <h3>Experiment 1: Measuring Length and Texture of Strips in Different Solutions</h3>
        <p><strong>Objective:</strong> To observe the direction of water movement via osmosis and note physical/textural changes in plant tissues.</p>
        
        <h4>Apparatus & Reagents:</h4>
        <ul>
            <li>Fresh carrot tuber strips (cut to 5cm x 1cm x 1cm)</li>
            <li>Distilled Water, 0.5M NaCl, 1M NaCl, 1M NaOH</li>
            <li>4 Petri dishes, blotting paper, ruler, scalpel, clock</li>
        </ul>
    `
},
{
    experimentCode: "BIO13_2",
    title: "Lab 13.2: Weight and Curvature of Cocoyam Stalk in Different Solutions",
    subject: "Biology",
    category: "Cell Physiology",
    xpReward: 80,
    aiGradingRubric: `
        You are a strict Cambridge GCE A-Level Biology Examiner. Grade the student's report on Osmotic Curvature in Cocoyam Petioles.
        1. Hypothesis: Must relate solution concentration to weight change and degree of curvature.
        2. Principle: Osmosis / Tissue Tension.
        3. Table Data: Distilled water must show an increase in weight. NaCl must show a decrease. NaOH must show a decrease and chemical breakdown.
        4. Interpretations (Curvature):
           - Distilled Water: Hypotonic. Inner parenchyma cells absorb water via osmosis and expand more than the tough outer epidermis, causing the strip to curve outward (epidermis on the inside of the curve).
           - 1M NaCl: Hypertonic. Inner parenchyma cells lose water via osmosis and shrink more than the epidermis, causing the strip to curve inward (epidermis on the outside).
           - 1M NaOH: Plasmolysis combined with chemical degradation of cell walls (pectin), leading to a flaccid, mushy strip with irregular or extreme inward curvature.
        5. Water Potential Conclusion: Distilled water has a higher water potential than the protoplasm. NaCl/NaOH have a lower water potential than the protoplasm.
        Grade strictly out of 40. Penalize if they fail to mention the difference between the inner parenchyma and outer epidermis. Use HTML <p> and <ul> tags. Give a final numeric score.
    `,
    manualContent: `
        <h3>Experiment 2: Measuring weight and degree of curvature of cocoyam stalk</h3>
        <p><strong>Objective:</strong> To observe differential osmotic expansion in plant tissues and measure the corresponding weight changes.</p>
        
        <h4>Apparatus & Reagents:</h4>
        <ul>
            <li>Fresh cocoyam petioles (split radially into equal strips)</li>
            <li>Distilled Water, 1M NaCl, 1M NaOH</li>
            <li>3 Petri dishes, electronic balance, blotting paper, wall clock</li>
        </ul>
    `
},
{
    experimentCode: "BIO13_3",
    title: "Lab 13.3: Opening and Closure of Stomata in Different Solutions",
    subject: "Biology",
    category: "Cell Physiology",
    xpReward: 100,
    aiGradingRubric: `
        You are a strict Cambridge GCE A-Level Biology Examiner. Grade the student's report on Stomatal Osmosis.
        1. Phenomenon: Osmosis / Plasmolysis / Turgidity.
        2. Structural differences: Guard cells are bean-shaped, contain chloroplasts, and have unevenly thickened cell walls (thicker inner wall). Epidermal cells lack chloroplasts and have uniform thin walls.
        3. Diameter comparison: Wide/open in distilled water. Narrow/closed in 1M NaCl.
        4. Distilled Water Interpretation: Hypotonic solution. Water enters guard cells via endosmosis. Cells become turgid. The thin outer walls stretch more than the thick inner walls, pulling the stoma open.
        5. 1M NaCl Interpretation: Hypertonic solution. Water leaves guard cells via exosmosis. Cells become flaccid/plasmolyzed. Loss of turgor pressure causes the thick inner walls to collapse together, closing the stoma.
        6. Conclusion: Guard cell turgor regulates stomatal aperture via osmosis.
        Grade strictly out of 40. Penalize if they fail to mention 'endosmosis', 'exosmosis', 'turgidity', or the 'unevenly thickened walls' of the guard cells. Use HTML <p> and <ul> tags. Give a final numeric score.
    `,
    manualContent: `
        <h3>Experiment 3: Measuring the opening and closure of Stomata in Different Solutions</h3>
        <p><strong>Objective:</strong> To observe the effect of osmotic potential on the turgidity of guard cells and stomatal aperture.</p>
        
        <h4>Apparatus & Reagents:</h4>
        <ul>
            <li>Distilled Water and 1M NaCl</li>
            <li><i>Tradescantia</i> leaves (lower epidermis peel)</li>
            <li>Compound Microscope, slides, coverslips, dropper, blade</li>
        </ul>
    `
},
{
    experimentCode: "BIO16_1",
    title: "Lab 16: Enzyme Dehydrogenase (Methylene Blue Reduction)",
    subject: "Biology",
    category: "Enzymology",
    xpReward: 100,
    aiGradingRubric: `
        You are a strict Cambridge GCE A-Level Biology Examiner. Grade the student's report on the Dehydrogenase Methylene Blue experiment.
        1. Hypothesis: As the concentration of yeast (enzyme) increases, the rate of methylene blue reduction increases (time taken to decolorize decreases).
        2. Procedure: Must mention preparing percentage dilutions, adding equal volumes of methylene blue, incubating at 30C, and using a stopwatch to time decolorization.
        3. Table Data: Time must decrease as concentration increases. 0% must be recorded as 'infinity', 'no change', or a very high number.
        4. Interpretations:
           - 100% Dilution (Stock): Highest concentration of dehydrogenase enzymes. Rapid removal of hydrogen/electrons during respiration. Fastest reduction of methylene blue from blue to colorless.
           - 75% / 50% / 25%: Proportionally fewer enzymes present, leading to fewer successful collisions and a slower rate of dye reduction.
           - 0% Dilution: Acts as a control. Lacks yeast/enzymes. Proves that methylene blue does not decolorize on its own without the dehydrogenase activity.
        Grade strictly out of 40. Penalize if they fail to identify 0% as the control or fail to mention 'reduction' or 'hydrogen/electrons'. Use HTML <p> and <ul> tags. Give a final numeric score.
    `,
    manualContent: `
        <h3>Experiment 3: Percentage Dilution of Yeast Suspension</h3>
        <p><strong>Background:</strong> Dehydrogenase is an enzyme that catalyzes oxidation/fermentation by removing Hydrogen (or electrons). Methylene blue picks up these electrons and is <em>reduced</em>, changing from blue to colorless.</p>
        
        <h4>Apparatus & Reagents:</h4>
        <ul>
            <li>Yeast suspension stock solution</li>
            <li>Methylene blue dye</li>
            <li>Distilled water & Syringes</li>
            <li>5 Test tubes & Water bath at 30°C</li>
            <li>Stopwatch</li>
        </ul>
    `
},
{
    experimentCode: "BIO17_1",
    title: "Lab 17.1: Transpiration Rates in Different Plant Species",
    subject: "Biology",
    category: "Plant Physiology",
    xpReward: 80,
    aiGradingRubric: `
        You are a strict Cambridge GCE A-Level Biology Examiner. Grade the student's report on Transpiration in Mango vs Sunflower leaves.
        1. Calculations (Table): Check the 'Amount of water loss' and 'Rate' calculations based on their logged weights.
        2. Cumulative & Overall % Loss: Cumulative at 30 mins = (Wt at 0 - Wt at 30) / (Wt at 0) * 100. Overall at 60 mins = (Wt at 0 - Wt at 60) / (Wt at 0) * 100. Check their math.
        3. Xeromorphic Adaptation: Must identify Mango as the better adapted species. Justification: Mango leaves have a thick, waxy cuticle and a smaller surface-area-to-volume ratio (or sunken stomata) which significantly reduces water loss via cuticular and stomatal transpiration compared to the broad, thin sunflower leaves.
        4. External Factors: Must list at least 3 factors that influence transpiration rate: Temperature, Humidity, Wind speed / air currents, and Light intensity.
        Grade strictly out of 40. Penalize for incorrect math or failing to mention the 'thick waxy cuticle' of the mango leaf. Use HTML <p> and <ul> tags. Give a final numeric score.
    `,
    manualContent: `
        <h3>Experiment 1: Investigate the rate of water loss from plant leaves from different species</h3>
        <p><strong>Objective:</strong> To compare the transpiration rates of a mesophyte (Sunflower) and a xerophyte-adapted plant (Mango) under the same environmental conditions.</p>
        
        <h4>Apparatus & Reagents:</h4>
        <ul>
            <li>Freshly harvested Mango twig & Sunflower twig</li>
            <li>Digital balance, string, stopwatch</li>
            <li>Bucket of water</li>
        </ul>
    `
}

];

async function seedDatabase() {
    try {
        console.log('Connecting to database...');
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB Atlas!');

        // --- AUTOMATED FREEMIUM ALLOCATOR ---
        // This dynamically counts subjects and locks everything after the 3rd one.
        const subjectTracker = {};

        experimentsToInject.forEach(lab => {
            const subject = lab.subject;
            
            // Initialize the counter for a new subject if it doesn't exist yet
            if (!subjectTracker[subject]) {
                subjectTracker[subject] = 0;
            }
            
            // Increment the count for this subject
            subjectTracker[subject]++;
            
            // If it's lab 1, 2, or 3 of this subject, make it free. Otherwise, lock it.
            if (subjectTracker[subject] <= 3) {
                lab.isPremium = false;
            } else {
                lab.isPremium = true;
            }
        });
        // ------------------------------------

        for (const lab of experimentsToInject) {
            await Experiment.findOneAndUpdate(
                { experimentCode: lab.experimentCode },
                lab,
                { upsert: true, new: true }
            );
            // I added the premium status to the log so you can watch it sort them in real-time
            console.log(`✅ Success: Mounted Engine Parameters for ${lab.experimentCode} | PRO: ${lab.isPremium}`);
        }

        console.log('🎉 System Parameter Sync Operations Complete!');
        process.exit(0); 
    } catch (error) {
        console.error('❌ Sync Execution Aborted:', error);
        process.exit(1);
    }
}

seedDatabase();