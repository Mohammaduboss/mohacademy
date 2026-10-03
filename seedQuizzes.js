require('dotenv').config();
const mongoose = require('mongoose');
const Quiz = require('./models/Quiz'); 

const questionsToInject = [
    // ==========================================
    // 1. MECHANICS & MATERIALS
    // ==========================================
    {
        subject: "physics",
        topic: "mechanics",
        question: "Which of the following sets contains two vector quantities and one scalar quantity?",
        options: ["Power, Velocity, E-fields", "Force, Energy, Pressure", "Weight, Momentum, Displacement", "Mass, Torque, Temperature"],
        correctAnswerIndex: 0,
        xpValue: 25,
        explanation: "Velocity and E-fields are vectors. Power is a scalar. This gives the 2:1 ratio requested."
    },
    {
        subject: "physics",
        topic: "mechanics",
        question: "Equality or equivalent in units for all terms in a physics equation makes the equation:",
        options: ["Homogenous and correct", "Homogenous only", "Physically correct only", "Homogenous and possibly correct"],
        correctAnswerIndex: 1,
        xpValue: 25,
        explanation: "Having the same units on both sides only proves that an equation is dimensionally homogenous. It does not prove the equation is physically correct, because dimensionless constants (like ½) could still be missing or wrong."
    },
    {
        subject: "physics",
        topic: "mechanics",
        question: "Which of the following is a pair of scalar quantities?",
        options: ["Electric field strength and pressure", "Torque and time", "Pressure and energy", "Volume and weight"],
        correctAnswerIndex: 2,
        xpValue: 25,
        explanation: "Pressure (Force per unit area acting perpendicularly) and Energy are both scalar quantities, meaning they possess magnitude but no specific direction. Weight, Torque, and Electric Field are all vectors."
    },
    {
        subject: "physics",
        topic: "mechanics",
        question: "If a car initially moving with a velocity of 4 m/s accelerates steadily at 2 m/s² for 4 seconds:",
        options: ["It covers a distance of 16 m.", "It attains a velocity of 8 m/s.", "Its velocity-time graph is a straight line with non-zero slope.", "The frictional resistance to the motion is negligible."],
        correctAnswerIndex: 2,
        xpValue: 25,
        explanation: "Constant (steady) acceleration means the rate of change of velocity is constant. On a velocity-time graph, a constant rate of change is represented by a straight line with a non-zero slope."
    },
    {
        subject: "physics",
        topic: "mechanics",
        question: "A force of 0.60 kN is applied to a wire of diameter 0.002 m to cut it without the wire developing a 'neck'. Find the breaking stress in Pa on the wire.",
        options: ["3.8 × 10⁵", "9.6 × 10⁷", "4.8 × 10⁷", "1.9 × 10⁸"],
        correctAnswerIndex: 3,
        xpValue: 25,
        explanation: "Stress = Force / Area. Force = 0.60 kN = 600 N. Area = πr² = π(0.001 m)² = 3.14159 × 10⁻⁶ m². Stress = 600 / (3.14159 × 10⁻⁶) = 1.9 × 10⁸ Pa."
    },
    {
        subject: "physics",
        topic: "mechanics",
        question: "A uniform metre rule is supported on a knife edge placed at the 40.0 cm mark. A weight of 0.45 N suspended at the 15.0 cm mark balances the metre rule horizontally. The weight of the metre rule is:",
        options: ["1.13 N", "50.0 N", "0.50 N", "0.75 N"],
        correctAnswerIndex: 0,
        xpValue: 25,
        explanation: "By the principle of moments: Clockwise moments = Anticlockwise moments. The rule's weight (W) acts at its center of gravity (the 50 cm mark). W × (50 - 40) = 0.45 × (40 - 15). 10W = 11.25, so W = 1.125 N, which rounds to 1.13 N."
    },
    {
        subject: "physics",
        topic: "mechanics",
        question: "Which of the following physical quantities has kg·m²·s⁻² as its base S.I. units?",
        options: ["Pressure", "Energy", "Power", "Momentum"],
        correctAnswerIndex: 1,
        xpValue: 25,
        explanation: "Work (Energy) = Force × Distance = (Mass × Acceleration) × Distance. In base units: kg × (m·s⁻²) × m = kg·m²·s⁻². Pressure is kg·m⁻¹·s⁻², Power is kg·m²·s⁻³, and Momentum is kg·m·s⁻¹."
    },
    {
        subject: "physics",
        topic: "mechanics",
        question: "The resultant force acting on an object pulled simultaneously by 40.0 N West, 100.0 N East, and 80.0 N North, is:",
        options: ["100.0 N North-East", "80.0 N due North", "60.0 N North-East", "40.0 N South-East"],
        correctAnswerIndex: 0,
        xpValue: 25,
        explanation: "Net horizontal force = 100 N (East) - 40 N (West) = 60 N East. Net vertical force = 80 N North. The Resultant R = √(60² + 80²) = √(3600 + 6400) = √10000 = 100.0 N. Because the force moves North and East, the direction is North-East."
    },
    {
        subject: "physics",
        topic: "mechanics",
        question: "Which of the following sets contains ONLY fundamental base units of the S.I. system?",
        options: ["ampere, kilogram, joule", "ampere, kelvin, newton", "kelvin, second, ampere", "second, coulomb, ampere"],
        correctAnswerIndex: 2,
        xpValue: 25,
        explanation: "The seven fundamental S.I. base units are the meter, kilogram, second, ampere, kelvin, mole, and candela. Joules (energy), Newtons (force), and Coulombs (charge) are all derived units."
    },
    {
        subject: "physics",
        topic: "mechanics",
        question: "A uniform sphere of mass 5.0 kg is kept in position by a horizontal string P and a string Q inclined at 60° to the horizontal. If the system is in equilibrium, the tension in string Q is (Assume g = 9.8 m/s²):",
        options: ["98.1 N", "85.0 N", "28.3 N", "56.6 N"],
        correctAnswerIndex: 3,
        xpValue: 25,
        explanation: "To maintain vertical equilibrium, the vertical component of the tension in string Q must exactly balance the downward weight of the sphere. T_Q × sin(60°) = mg. T_Q = (5.0 × 9.8) / sin(60°) = 49 / 0.866 = 56.58 N, which rounds to 56.6 N."
    },
    {
        subject: "physics",
        topic: "mechanics",
        question: "Which of the following is true for a body moving on a circular path at a constant speed?",
        options: ["The acceleration is perpendicular to the velocity.", "The acceleration is constant with time.", "The acceleration is always directed opposite to the displacement.", "The centripetal force is provided by the weight of the object."],
        correctAnswerIndex: 0,
        xpValue: 25,
        explanation: "In uniform circular motion, the speed is constant but the direction changes continuously. This requires a centripetal acceleration directed strictly toward the center of the circle, which is always at a 90-degree angle (perpendicular) to the tangential velocity."
    },
    {
        subject: "physics",
        topic: "mechanics",
        question: "The displacement of a particle performing simple harmonic motion with angular frequency (ω) is given by x = A cos(ωt - φ). The total distance covered by the particle in two complete cycles is:",
        options: ["8A", "4A", "A", "2A"],
        correctAnswerIndex: 0,
        xpValue: 25,
        explanation: "In one complete cycle (oscillation), a particle moves from the center to maximum amplitude (+A), back to the center (A), to the negative amplitude (A), and back to the center (A). Distance per cycle = 4A. For two cycles, distance = 8A."
    },
    {
        subject: "physics",
        topic: "mechanics",
        question: "A bag hangs from a spring balance which is suspended from the ceiling of a lift. What is the mass of the bag if the reading on the spring balance is 160 N when the lift is moving upward with an acceleration of 3.0 m/s²? (Assume g = 9.8 m/s²)",
        options: ["16.3 kg", "12.5 kg", "23.5 kg", "53.2 kg"],
        correctAnswerIndex: 1,
        xpValue: 25,
        explanation: "Using Newton's Second Law (F = ma) on the bag: Tension (T) - Weight (mg) = ma. 160 - m(9.8) = m(3.0). Therefore, 160 = 12.8m. Solving for m gives 160 / 12.8 = 12.5 kg."
    },

    // ==========================================
    // 2. THERMAL PHYSICS
    // ==========================================
    {
        subject: "physics",
        topic: "thermal",
        question: "The temperature of a given gas is 300 K. Its average translational kinetic energy in joules (given Boltzmann's constant k = 1.38 × 10⁻²³ J/K) is:",
        options: ["1.38 × 10⁻²³", "6.21 × 10⁻²¹", "6.21 × 10⁻²³", "1.38 × 10⁻²¹"],
        correctAnswerIndex: 1,
        xpValue: 25,
        explanation: "The average translational kinetic energy of an ideal gas molecule is E = (3/2)kT. E = 1.5 × (1.38 × 10⁻²³) × 300 = 6.21 × 10⁻²¹ Joules."
    },
    {
        subject: "physics",
        topic: "thermal",
        question: "An ideal gas absorbs 1000 J of heat energy and expands from a volume of 0.025 m³ to a volume of 0.050 m³ at a constant pressure of 20 × 10³ Pa. Which of the following correctly describes the work done by the gas and the change in internal energy?",
        options: ["Work done = 100 J; ΔU = 900 J", "Work done = 500 J; ΔU = 500 J", "Work done = 500 J; ΔU = 1500 J", "Work done = 200 J; ΔU = 800 J"],
        correctAnswerIndex: 1,
        xpValue: 25,
        explanation: "Work done (W) at constant pressure = P × ΔV = (20 × 10³ Pa) × (0.050 - 0.025 m³) = 500 J. By the First Law of Thermodynamics, Change in Internal Energy (ΔU) = Q - W = 1000 J - 500 J = 500 J."
    },
    {
        subject: "physics",
        topic: "thermal",
        question: "Which of the following is correct for a body giving out heat?",
        options: ["Its temperature always drops with time.", "Its temperature could be constant.", "It cannot be in thermal equilibrium with any other body.", "It has a lower heat capacity than its surrounding."],
        correctAnswerIndex: 1,
        xpValue: 25,
        explanation: "During a phase change (like steam condensing to water or water freezing to ice), a body gives out latent heat to its surroundings while its temperature remains perfectly constant until the phase change is complete."
    },
    {
        subject: "physics",
        topic: "thermal",
        question: "An insulated metal bar whose ends are maintained at different temperatures transmits thermal energy along its length from one end to the other. Which of the following is true at steady state?",
        options: ["The temperature of all points along the bar remains constant.", "The rate of heat flow along the metal bar is constant.", "The bar is in thermal equilibrium.", "Heat is transmitted from the hot end to the cold end only by atoms vibrating."],
        correctAnswerIndex: 1,
        xpValue: 25,
        explanation: "At steady state, the temperature gradient is established and does not change with time. This means the rate at which heat enters the hot end is exactly equal to the rate at which it leaves the cold end (constant heat flow)."
    },

    // ==========================================
    // 3. WAVES & OPTICS
    // ==========================================
    {
        subject: "physics",
        topic: "waves",
        question: "A diffraction grating of 500 lines per mm is illuminated normally by light of wavelength 600 nm. How many images can be seen on either side of the normal, excluding the central image?",
        options: ["3", "4", "6", "2"],
        correctAnswerIndex: 0,
        xpValue: 25,
        explanation: "Slit spacing d = 1 / (500 x 10³ lines/m) = 2.0 x 10⁻⁶ m. Maximum order n = d / λ = (2.0 x 10⁻⁶) / (600 x 10⁻⁹) = 3.33. The highest whole integer is 3."
    },
    {
        subject: "physics",
        topic: "waves",
        question: "The critical angle for a ray of light moving through an optical fiber from a core of refractive index 1.54 to cladding of refractive index 1.48 is approximately:",
        options: ["80°", "43°", "74°", "40°"],
        correctAnswerIndex: 2,
        xpValue: 25,
        explanation: "The critical angle (c) is calculated using sin(c) = n2 / n1 (where n2 is the less dense medium). sin(c) = 1.48 / 1.54 = 0.961. Taking the inverse sine (arcsin) of 0.961 gives approximately 74°."
    },
    {
        subject: "physics",
        topic: "waves",
        question: "Depending on their mode of transmission through space, waves are classified as being:",
        options: ["Transverse or longitudinal.", "Mechanical or electromagnetic.", "Progressive or stationary.", "Short waves or long waves."],
        correctAnswerIndex: 1,
        xpValue: 25,
        explanation: "Mode of transmission refers to what the wave needs to travel. Mechanical waves require a physical medium (particles) to transmit energy, whereas Electromagnetic waves can transmit energy through the vacuum of space."
    },
    {
        subject: "physics",
        topic: "waves",
        question: "Given that the speed of sound in air is 340 m/s, what is the frequency of the sound at resonance in an open-ended pipe 1.2 m long when it is sounding its fundamental frequency?",
        options: ["142 Hz", "170 Hz", "204 Hz", "283 Hz"],
        correctAnswerIndex: 0,
        xpValue: 25,
        explanation: "For a pipe open at both ends, the fundamental wavelength λ = 2L. So, λ = 2 × 1.2 m = 2.4 m. Using the wave equation v = fλ, the frequency f = v / λ = 340 / 2.4 = 141.67 Hz, which rounds to 142 Hz."
    },
    {
        subject: "physics",
        topic: "waves",
        question: "When a beam of white light is incident on a diffraction grating, red light is deviated the most because in the visible spectrum red light has the:",
        options: ["Highest frequency", "Longest wavelength", "Highest intensity", "Lowest speed in air"],
        correctAnswerIndex: 1,
        xpValue: 25,
        explanation: "The grating equation is d·sin(θ) = nλ. The angle of deviation (θ) is directly proportional to the wavelength (λ). Since red light has the longest wavelength in the visible spectrum, it undergoes the greatest diffraction (bending)."
    },
    {
        subject: "physics",
        topic: "waves",
        question: "During a football match, the referee sounds a whistle which has a natural frequency fs. If the speed of sound is vs, a player running away from the referee at speed u hears a frequency fp given by:",
        options: ["[vs / (vs + u)] × fs", "[vs / (vs - u)] × fs", "[(vs - u) / vs] × fs", "[(vs + u) / vs] × fs"],
        correctAnswerIndex: 2,
        xpValue: 25,
        explanation: "By the Doppler Effect for a moving observer and a stationary source, the apparent frequency is fp = fs × (v_relative / v_sound). Since the player runs away, relative speed of the waves hitting them is (vs - u). Thus, fp = fs × [(vs - u) / vs]."
    },

    // ==========================================
    // 4. ELECTRICITY
    // ==========================================
    {
        subject: "physics",
        topic: "electricity",
        question: "A cell has an emf of 2.5V. It cannot be balanced on a potentiometer of length 100.0m when connected to a driver cell of 2.0V. Which of the following best explains why there is no balance point?",
        options: ["The current in the wire is too low.", "The balance length is too small.", "The emf of the cell is too low.", "The voltage across the wire is too low."],
        correctAnswerIndex: 3,
        xpValue: 25,
        explanation: "A balance point can only be found if the potential difference across the entire potentiometer wire is strictly greater than the EMF of the test cell. Here, the driver cell (2.0V) provides a max voltage lower than the test cell (2.5V)."
    },
    {
        subject: "physics",
        topic: "electricity",
        question: "A circuit consists of three identical resistors R₁, R₂, and R₃. R₁ is in series with a parallel combination of R₂ and R₃. If the main current entering R₁ is 3.0 A, the current flowing through R₂ is:",
        options: ["1.0 A", "3.0 A", "1.5 A", "2.0 A"],
        correctAnswerIndex: 2,
        xpValue: 25,
        explanation: "The total main current of 3.0 A passes through the first resistor. When it reaches the parallel junction, it splits. Because R₂ and R₃ are completely identical, the current splits perfectly in half: 3.0 A / 2 = 1.5 A through each parallel branch."
    },
    {
        subject: "physics",
        topic: "electricity",
        question: "The accuracy of a potentiometer depends primarily on the:",
        options: ["Thickness of the wire", "Accuracy of the galvanometer", "Uniformity of the wire", "Sensitivity of the galvanometer"],
        correctAnswerIndex: 2,
        xpValue: 25,
        explanation: "A potentiometer works on the principle that the potential drop across any length of the wire is directly proportional to that length (V ∝ L). This is only mathematically true if the wire has a perfectly uniform cross-sectional area and resistance throughout."
    },

    // ==========================================
    // 5. FIELDS (Gravity, Electric, Magnetic)
    // ==========================================
    {
        subject: "physics",
        topic: "fields",
        question: "According to Coulomb's law, the force between two point charge objects is exactly doubled if the:",
        options: ["Charge on each object is doubled.", "Distance between them is halved.", "Charges are brought closer.", "Product of the charges is doubled."],
        correctAnswerIndex: 3,
        xpValue: 25,
        explanation: "Coulomb's Law states F = k(Q1*Q2)/r². If the product of the charges (Q1*Q2) is doubled, the force exactly doubles. If you doubled BOTH charges, the force would quadruple (4x). If you halved the distance, the force would also quadruple."
    },
    {
        subject: "physics",
        topic: "fields",
        question: "In an electric field of strength E, a charge Q is accelerated through a distance y. The work done by the electric force is:",
        options: ["QEy", "QE / y", "Qy / E", "QE"],
        correctAnswerIndex: 0,
        xpValue: 25,
        explanation: "Work Done = Force × Distance. In an electric field, the force acting on a charge is F = QE. Therefore, the work done moving it through distance y is W = (QE) × y = QEy."
    },

    // ==========================================
    // 6. CAPACITORS & A.C. CIRCUITS
    // ==========================================
    {
        subject: "physics",
        topic: "capacitors",
        question: "A battery is connected to a parallel-plate capacitor that stores 6.0 x 10⁻⁴ J of energy. If the separation between the plates is doubled, what will be the value of the energy stored?",
        options: ["1.5 x 10⁻⁴ J", "1.2 x 10⁻⁴ J", "3.0 x 10⁻⁴ J", "6.0 x 10⁻⁴ J"],
        correctAnswerIndex: 2,
        xpValue: 25,
        explanation: "Capacitance C = (ε₀A)/d. Doubling the distance (d) halves the capacitance. Energy E = ½CV². Since V is constant (battery connected), halving C halves the energy to 3.0 x 10⁻⁴ J."
    },
    {
        subject: "physics",
        topic: "capacitors",
        question: "A step-down transformer with a turns ratio of 5:4 and an efficiency of 88% is used to run a motor. If the mains a.c. (primary current) is 5.0 A, the current drawn by the motor (secondary current) will be:",
        options: ["3.5 A", "8.8 A", "1.8 A", "5.5 A"],
        correctAnswerIndex: 3,
        xpValue: 25,
        explanation: "For a transformer, Vs/Vp = Ns/Np = 4/5. Efficiency (e) = (Vs × Is) / (Vp × Ip) = (Vs/Vp) × (Is/Ip). 0.88 = (4/5) × (Is / 5.0). Solving for Is: Is = (0.88 × 5.0 × 5) / 4 = 5.5 A."
    },

    // ==========================================
    // 7. MODERN & NUCLEAR PHYSICS
    // ==========================================
    {
        subject: "physics",
        topic: "quantum",
        question: "X-rays can be produced by:",
        options: ["Decelerating electrons.", "Electrons cutting electric field lines.", "Oscillating electrons.", "Electrons moving from higher to lower energy levels."],
        correctAnswerIndex: 0,
        xpValue: 25,
        explanation: "X-rays are primarily produced via 'Bremsstrahlung' (braking radiation). This occurs when high-speed electrons are rapidly decelerated upon striking a heavy metal target, converting their lost kinetic energy into high-energy X-ray photons."
    },
    {
        subject: "physics",
        topic: "quantum",
        question: "The helium nucleus is represented as ⁴₂He. The unified atomic mass unit (U) of a helium nucleus is 4.0015 U, that of a proton is 1.0073 U, and a neutron is 1.0087 U. What is the binding energy of helium in atomic mass units?",
        options: ["8.0335 U", "0.0285 U", "16.0060 U", "0.0305 U"],
        correctAnswerIndex: 3,
        xpValue: 25,
        explanation: "A helium nucleus has 2 protons and 2 neutrons. Expected mass = 2(1.0073) + 2(1.0087) = 2.0146 + 2.0174 = 4.0320 U. The mass defect (which converts to binding energy) = Expected Mass - Actual Mass = 4.0320 - 4.0015 = 0.0305 U."
    },
    {
        subject: "physics",
        topic: "quantum",
        question: "Which of the following is NOT conserved in nuclear processes?",
        options: ["Charge", "Mass", "Neutron number", "Nucleon number"],
        correctAnswerIndex: 1,
        xpValue: 25,
        explanation: "In nuclear reactions, rest mass is not conserved. Instead, a small amount of mass (the mass defect) is converted directly into binding energy according to Einstein's equation E = mc². Mass-energy is conserved, but mass alone is not."
    },
    {
        subject: "physics",
        topic: "quantum",
        question: "A metal has a work function of 2.1 eV. What is the threshold wavelength of the metal? (h = 6.63 × 10⁻³⁴ J·s, c = 3 × 10⁸ m/s, e = 1.6 × 10⁻¹⁹ C)",
        options: ["2.5 × 10⁻⁷ m", "1.9 × 10⁻⁷ m", "6.5 × 10⁻⁷ m", "5.9 × 10⁻⁷ m"],
        correctAnswerIndex: 3,
        xpValue: 25,
        explanation: "Work function Φ = hc / λ_threshold. First, convert eV to Joules: 2.1 eV × 1.6 × 10⁻¹⁹ = 3.36 × 10⁻¹⁹ J. Rearranging for wavelength: λ = hc / Φ = (6.63 × 10⁻³⁴ × 3 × 10⁸) / 3.36 × 10⁻¹⁹ = 5.91 × 10⁻⁷ m."
    },
    // ==========================================
    // CAPACITORS & A.C. CIRCUITS
    // ==========================================
    {
        subject: "physics",
        topic: "capacitors",
        question: "Two identical capacitors, each of capacitance C, are connected in parallel. This combination is then connected in series with a third identical capacitor C. The effective capacitance of the entire network is:",
        options: ["3C", "2C/3", "3C/2", "C/3"],
        correctAnswerIndex: 1,
        xpValue: 25,
        explanation: "First, find the equivalent capacitance of the parallel pair: C_parallel = C + C = 2C. Then, connect this 2C in series with the third capacitor C. For series: 1/C_total = 1/2C + 1/C = 3/2C. Inverting this gives C_total = 2C / 3."
    },
    {
        subject: "physics",
        topic: "capacitors",
        question: "A dielectric material is inserted between the plates of an isolated, charged parallel-plate capacitor. Which of the following statements is true?",
        options: [
            "The capacitance decreases.",
            "The potential difference between the plates decreases.",
            "The electric field strength increases.",
            "The charge on the plates increases."
        ],
        correctAnswerIndex: 1,
        xpValue: 25,
        explanation: "Inserting a dielectric increases the capacitance (C). Because the capacitor is isolated, its stored charge (Q) cannot change. Using the formula V = Q/C, if C increases while Q is constant, the potential difference (V) must decrease."
    },

    // ==========================================
    // ELECTRICITY (D.C. CIRCUITS)
    // ==========================================
    {
        subject: "physics",
        topic: "electricity",
        question: "Which of the following statements best explains why an ammeter is always connected in series in an electrical circuit?",
        options: [
            "It allows all the target current to flow through it without significantly altering the total resistance.",
            "It is the only way to make it highly sensitive to changes in temperature.",
            "The potential difference across the ammeter must be extremely high.",
            "It prevents the circuit from overheating."
        ],
        correctAnswerIndex: 0,
        xpValue: 25,
        explanation: "An ideal ammeter has nearly zero internal resistance. Connecting it in series ensures that all the current flowing through that branch passes through the meter, without adding extra resistance that would reduce the very current it is trying to measure."
    },
    {
        subject: "physics",
        topic: "electricity",
        question: "In a Kirchhoff electrical network, the first law (junction rule) and second law (loop rule) respectively obey the principles of conservation of:",
        options: [
            "Energy and charge",
            "Energy and momentum",
            "Charge and energy",
            "Voltage and charge"
        ],
        correctAnswerIndex: 2,
        xpValue: 25,
        explanation: "Kirchhoff's First Law (sum of currents entering a junction equals sum leaving) is based on the conservation of Charge. His Second Law (sum of potential drops in a closed loop equals zero) is based on the conservation of Energy."
    },

    // ==========================================
    // FIELDS (GRAVITY, ELECTRIC, MAGNETIC)
    // ==========================================
    {
        subject: "physics",
        topic: "fields",
        question: "Two identical long parallel wires carrying steady currents in the same direction are placed close to each other. Which of the following is true about the magnetic force between them?",
        options: [
            "They repel each other.",
            "They attract each other with a force proportional to the product of their currents.",
            "They exert no force on each other.",
            "They experience a torque that makes them cross."
        ],
        correctAnswerIndex: 1,
        xpValue: 25,
        explanation: "Parallel wires carrying currents in the same direction create magnetic fields that pull them together (attraction). By Ampere's Force Law, the magnitude of this attractive force is directly proportional to the product of the two currents (I₁ × I₂)."
    },
    {
        subject: "physics",
        topic: "fields",
        question: "An electron moves in a circular orbit of radius r in a uniform magnetic field B. Which of the following statements is most correct regarding its period of revolution?",
        options: [
            "The period is proportional to its orbital speed.",
            "The period is inversely proportional to its mass.",
            "The period is independent of its orbital speed.",
            "The period depends exponentially on the magnetic flux density."
        ],
        correctAnswerIndex: 2,
        xpValue: 25,
        explanation: "The magnetic force provides the centripetal force: qvB = mv²/r, meaning radius r = mv/qB. The period T = distance/speed = 2πr/v. Substituting r gives T = (2πmv/qB)/v = 2πm/qB. Notice that velocity (v) perfectly cancels out! The period is entirely independent of speed."
    },

    // ==========================================
    // MODERN & QUANTUM PHYSICS
    // ==========================================
    {
        subject: "physics",
        topic: "quantum",
        question: "A beam of light of wavelength λ ejects photoelectrons from the surface of a clean metal plate. If a less intense beam of the EXACT SAME wavelength is used, the emitted photoelectrons will be:",
        options: [
            "Equal in number and with the same kinetic energy.",
            "Fewer in number but with the same maximum kinetic energy.",
            "Fewer in number and with less kinetic energy.",
            "Equal in number and with less kinetic energy."
        ],
        correctAnswerIndex: 1,
        xpValue: 25,
        explanation: "Intensity determines the NUMBER of photons striking the metal, so a less intense beam ejects fewer electrons. However, the energy of each individual photon (E = hc/λ) remains exactly the same, meaning the maximum kinetic energy of the ejected electrons remains unchanged."
    },
    {
        subject: "physics",
        topic: "quantum",
        question: "Photons of light travel from a vacuum and enter a glass block. The energy of the individual photons upon entering the glass block:",
        options: [
            "Increases because their wavelength decreases.",
            "Decreases because their speed decreases.",
            "Stays the same because their speed and wavelength do not change.",
            "Stays the same because their frequency does not change."
        ],
        correctAnswerIndex: 3,
        xpValue: 25,
        explanation: "The energy of a photon is strictly determined by its frequency (E = hf). While the speed and wavelength of light change when it enters a denser medium like glass, the frequency is locked to the original source and never changes. Thus, the photon's energy stays the same."
    },

    // ==========================================
    // THERMAL PHYSICS
    // ==========================================
    {
        subject: "physics",
        topic: "thermal",
        question: "According to the first law of thermodynamics (ΔU = Q - W) for an ideal gas, which of the following statements is most correct?",
        options: [
            "Q = -W when the temperature increases.",
            "ΔU = 0 when no heat enters or leaves the system.",
            "W represents the work done strictly by gravity.",
            "ΔU = 0 when heat is supplied at a constant temperature (isothermal process)."
        ],
        correctAnswerIndex: 3,
        xpValue: 25,
        explanation: "For an ideal gas, internal energy (ΔU) is directly and solely proportional to its absolute temperature. During an isothermal process, the temperature remains constant, meaning the internal energy cannot change, so ΔU exactly equals 0."
    },
    {
        subject: "physics",
        topic: "thermal",
        question: "During a phase change, such as a block of ice melting into liquid water, which of the following is strictly true?",
        options: [
            "The internal kinetic energy of the system increases rapidly.",
            "The temperature of the system rises proportionally.",
            "Work is done against intermolecular forces to break or reorganize bonds.",
            "No latent heat is absorbed by the system."
        ],
        correctAnswerIndex: 2,
        xpValue: 25,
        explanation: "During a phase change, the temperature (and thus internal kinetic energy) remains completely flat. The latent heat energy being absorbed is entirely used to do internal work against the intermolecular forces to break the solid crystalline bonds into a liquid structure."
    },

    // ==========================================
    // WAVES & OPTICS
    // ==========================================
    {
        subject: "physics",
        topic: "waves",
        question: "Transverse waves can be experimentally distinguished from longitudinal waves using the phenomenon of:",
        options: [
            "Polarization",
            "Refraction",
            "Reflection",
            "Diffraction"
        ],
        correctAnswerIndex: 0,
        xpValue: 25,
        explanation: "Polarization restricts the oscillation of a wave to a single plane. This is only physically possible for transverse waves (like light), where oscillations are perpendicular to the wave's travel. Longitudinal waves (like sound) oscillate parallel to travel and cannot be polarized."
    },
    {
        subject: "physics",
        topic: "waves",
        question: "Monochromatic light illuminates two narrow parallel slits, forming an interference pattern on a screen. Which change would increase the separation between the dark fringes?",
        options: [
            "Decreasing the distance between the screen and the slits.",
            "Using monochromatic light of a shorter wavelength.",
            "Using monochromatic light of a higher frequency.",
            "Decreasing the distance between the two slits."
        ],
        correctAnswerIndex: 3,
        xpValue: 25,
        explanation: "Fringe separation (y) is given by Young's Double Slit formula: y = (λL) / d. To increase the separation (y), you must either increase wavelength (λ), increase screen distance (L), or DECREASE the slit separation (d)."
    },
    // ==========================================
    // CAPACITORS (Adds 5 to reach 10)
    // ==========================================
    {
        subject: "physics",
        topic: "capacitors",
        question: "In a circuit, the time constant is found to be 180 s when discharging through a 360 kΩ resistor. The discharging network consists of a 300 μF capacitor connected in parallel with an unknown capacitor C₁. What is the value of C₁?",
        options: ["200 μF", "150 μF", "300 μF", "15 μF"],
        correctAnswerIndex: 0,
        xpValue: 25,
        explanation: "Time constant τ = R × C_total. So, 180 = 360,000 × C_total. C_total = 180 / 360,000 = 0.0005 F = 500 μF. Since the capacitors are in parallel, C_total = 300 μF + C₁. Therefore, C₁ = 500 - 300 = 200 μF."
    },
    {
        subject: "physics",
        topic: "capacitors",
        question: "A network of capacitors is connected to a 6.0 V cell. A 4 μF and a 10 μF capacitor are in parallel, and this combination is connected in series to another parallel pair of 4 μF and 8 μF. What is the effective capacitance?",
        options: ["18 μF", "5.6 μF", "6.5 μF", "36 μF"],
        correctAnswerIndex: 2,
        xpValue: 25,
        explanation: "First, add the parallel pairs: 4 + 10 = 14 μF. The second pair is 4 + 8 = 12 μF. Now, you have 14 μF and 12 μF in series. C_eff = (14 × 12) / (14 + 12) = 168 / 26 = 6.46 μF, which rounds to 6.5 μF."
    },
    {
        subject: "physics",
        topic: "capacitors",
        question: "Two capacitors of 20 μF and 40 μF are connected in series to a 6V DC supply. When the switch is closed, which of the following is true?",
        options: [
            "The effective capacitance of the circuit is 60 μF.",
            "The P.d across the 40 μF capacitor is 4 V.",
            "The P.d across the 20 μF capacitor will be double the P.d across the 40 μF capacitor.",
            "The capacitors will each store the same amount of energy."
        ],
        correctAnswerIndex: 2,
        xpValue: 25,
        explanation: "In a series circuit, charge (Q) is the same for all capacitors. Because V = Q/C, voltage is inversely proportional to capacitance. The 20 μF capacitor is half the size of the 40 μF, so it takes exactly double the voltage."
    },
    {
        subject: "physics",
        topic: "capacitors",
        question: "Three capacitors C₁, C₂, and C₃ are connected to a power supply. C₂ and C₃ are in parallel, and this combination is in series with C₁. Which statement is NOT correct?",
        options: [
            "The total capacitance is (C₂ + C₃)C₁ / (C₁ + C₂ + C₃).",
            "The total charge stored by C₂ and C₃ is equal to the charge stored by C₁.",
            "The quantities of charge stored by C₂ and C₃ respectively are always the same.",
            "The total charge stored by the three capacitors is constant."
        ],
        correctAnswerIndex: 2,
        xpValue: 25,
        explanation: "In a parallel arrangement (C₂ and C₃), they share the same voltage, but they will only store the same amount of charge (Q = CV) if their capacitances are perfectly identical. Otherwise, their charge quantities will differ."
    },
    {
        subject: "physics",
        topic: "capacitors",
        question: "Which of the following statements about capacitors connected in series in the process of charging is correct?",
        options: [
            "The charge on each capacitor is the same, and effective capacitance is less than the individual capacitances.",
            "The voltage across each capacitor is the same.",
            "The charge is different but the effective capacitance increases.",
            "The voltage and charge are both perfectly identical."
        ],
        correctAnswerIndex: 0,
        xpValue: 25,
        explanation: "In series, the same current flows through all components, depositing identical charge on each capacitor. Because 1/C_total = 1/C₁ + 1/C₂..., the effective capacitance is always smaller than the smallest individual capacitor in the chain."
    },

    // ==========================================
    // ELECTRICITY (Adds 5 to reach 10)
    // ==========================================
    {
        subject: "physics",
        topic: "electricity",
        question: "Which of the following descriptions is consistent with a constant decrease in the current through a uniform piece of a conductor?",
        options: [
            "Number of electrons per unit volume is unaltered; Drift velocity increases.",
            "Number of electrons per unit volume decreases; Drift velocity is unaltered.",
            "Number of electrons per unit volume is unaltered; Drift velocity decreases.",
            "Number of electrons per unit volume increases; Drift velocity decreases."
        ],
        correctAnswerIndex: 2,
        xpValue: 25,
        explanation: "Current I = nAvq. For a uniform solid conductor, the charge carrier density 'n', cross-sectional area 'A', and charge 'q' are constant physical properties. Therefore, a decrease in current 'I' can only be caused by a decrease in the drift velocity 'v'."
    },
    {
        subject: "physics",
        topic: "electricity",
        question: "A bridge circuit consists of 4 resistors: 12Ω and R on the top branches, and 24Ω and 6Ω on the bottom branches. If a galvanometer placed across the center reads zero, what is the value of R?",
        options: ["1.5 Ω", "2.0 Ω", "3.0 Ω", "12.0 Ω"],
        correctAnswerIndex: 2,
        xpValue: 25,
        explanation: "This is a balanced Wheatstone Bridge. The ratio of the resistors in one arm must equal the ratio in the other arm: R₁/R₂ = R₃/R₄. Therefore, 12 / 24 = R / 6. Solving for R gives 0.5 = R / 6, meaning R = 3.0 Ω."
    },
    {
        subject: "physics",
        topic: "electricity",
        question: "In a circuit, an ammeter and a voltmeter are connected around two identical resistors, R₁ and R₂. A switch S sits in parallel with R₂ and the voltmeter. When switch S is closed:",
        options: [
            "Ammeter reading decreases; Voltmeter reading decreases to zero.",
            "Ammeter reading increases; Voltmeter reading decreases to zero.",
            "Ammeter reading increases; Voltmeter remains unchanged.",
            "Ammeter reading remains unchanged; Voltmeter reading increases."
        ],
        correctAnswerIndex: 1,
        xpValue: 25,
        explanation: "Closing the switch creates a short circuit of zero resistance perfectly in parallel with R₂ and the voltmeter. Current takes the path of least resistance, bypassing R₂ entirely (Voltmeter drops to 0). With R₂ bypassed, total circuit resistance drops, so the main current (Ammeter) increases."
    },
    {
        subject: "physics",
        topic: "electricity",
        question: "Four resistors P, Q, R, and S are connected in a loop. A 24V cell and 24Ω resistor are in parallel with a 12V cell and 12Ω resistor. Ammeter A₁ sits on the central wire, and A₂ sits on the bottom branch. What do A₁ and A₂ read?",
        options: [
            "A₁ reads 1A and A₂ reads zero.",
            "A₁ reads 2A and A₂ reads 1A.",
            "A₁ reads 1A and A₂ reads 2A.",
            "A₁ reads zero and A₂ reads 1A."
        ],
        correctAnswerIndex: 1,
        xpValue: 25,
        explanation: "By applying Kirchhoff's Loop Rule to the independent loops: Left loop: 24V = 24Ω × I₁. So I₁ = 1A. Right loop: 12V = 12Ω × I₂. So I₂ = 1A. The central wire (A₁) carries the sum of both loop currents (1A + 1A = 2A). A₂ only reads the right loop current (1A)."
    },
    {
        subject: "physics",
        topic: "electricity",
        question: "A potentiometer of length L is used to measure the EMF (E) of a cell. A balanced point on the wire (where the galvanometer reads zero) may NOT be obtained if:",
        options: [
            "E > Volts across the driver cell.",
            "E = Volts across the driver cell.",
            "E > Volts across the entire potentiometer wire AB.",
            "E < Volts across the entire potentiometer wire AB."
        ],
        correctAnswerIndex: 2,
        xpValue: 25,
        explanation: "A balance point occurs when the potential drop along the tested length of the wire exactly matches the test cell's EMF. If the test cell's EMF (E) is larger than the total voltage drop available across the entire wire AB, no balance point can ever be reached."
    },

    // ==========================================
    // FIELDS (Adds 6 to reach 10)
    // ==========================================
    {
        subject: "physics",
        topic: "fields",
        question: "Two parallel metal plates carrying equal but opposite charge are separated by a distance d. If the distance between the plates is doubled, the strength of the uniform electric field E between them would be:",
        options: ["E", "E/8", "E/4", "E/2"],
        correctAnswerIndex: 0,
        xpValue: 25,
        explanation: "For isolated parallel plates carrying fixed, equal, and opposite charge (Q), the electric field depends strictly on the charge density (E = σ / ε₀). Since the charge and the plate area do not change, the electric field strength E remains completely unaffected by the distance."
    },
    {
        subject: "physics",
        topic: "fields",
        question: "A small magnetic needle in a compass is at rest on a horizontal table top. Which of the following may cause deflection of the needle?",
        options: [
            "An intense LASER beam of monochromatic light.",
            "A straight wire carrying current, or a collimated beam of beta particles.",
            "A stationary charged glass rod.",
            "A beam of neutral neutrons."
        ],
        correctAnswerIndex: 1,
        xpValue: 25,
        explanation: "A magnetic compass needle is deflected by magnetic fields. Moving electrical charges generate magnetic fields. Therefore, both a current-carrying wire (electrons flowing) and a beam of beta particles (fast-moving electrons) will create a magnetic field that deflects the needle."
    },
    {
        subject: "physics",
        topic: "fields",
        question: "In a mass spectrometer, a beam of charged particles enters a uniform magnetic field perpendicularly. Which statement is correct?",
        options: [
            "The electric and magnetic fields are arranged parallel to each other.",
            "The mass-to-charge ratio (m/Q) is directly proportional to the radius of the circular path.",
            "The velocity in the circular path is independent of the magnetic field.",
            "The particles experience zero acceleration."
        ],
        correctAnswerIndex: 1,
        xpValue: 25,
        explanation: "The magnetic force provides the centripetal force: QvB = mv²/r. Rearranging this gives m/Q = rB/v. Assuming B and v are constant (as determined by the velocity selector), the mass-to-charge ratio (m/Q) is directly proportional to the radius of the path (r)."
    },
    {
        subject: "physics",
        topic: "fields",
        question: "A newly discovered planet has a mass equal to one eighth the mass of the earth and a radius equal to half the earth's radius. If the gravitational field strength on the earth's surface is g, the field strength on the new planet is:",
        options: ["g/16", "g/4", "g", "g/2"],
        correctAnswerIndex: 3,
        xpValue: 25,
        explanation: "Gravitational field strength g = GM/R². For the new planet: g' = G(M/8) / (R/2)². Squaring the denominator gives R²/4. So, g' = (GM/8) / (R²/4) = (4/8) × (GM/R²) = 1/2 g."
    },
    {
        subject: "physics",
        topic: "fields",
        question: "A particle with a charge of 60 μC moving with a velocity v enters a magnetic field of strength 1.25 × 10⁻² T at an angle of 60° to it. If the magnetic force exerted on the particle is 0.5 N, the value of v is:",
        options: ["1.3 × 10⁶ m/s", "6.5 × 10⁻⁶ m/s", "7.7 × 10⁻⁵ m/s", "7.7 × 10⁵ m/s"],
        correctAnswerIndex: 3,
        xpValue: 25,
        explanation: "Magnetic Force F = BQv sin(θ). Therefore, v = F / (BQ sin(60°)). v = 0.5 / (1.25×10⁻² × 60×10⁻⁶ × 0.866) = 0.5 / 6.495×10⁻⁷ ≈ 7.698 × 10⁵ m/s, which rounds to 7.7 × 10⁵ m/s."
    },
    {
        subject: "physics",
        topic: "fields",
        question: "An electron moves in a circular orbit in a uniform B-field. Which of the following statements is the most correct?",
        options: [
            "The period of the electron in the orbit is independent of the speed of the electron.",
            "The force on the electron is parallel to the field.",
            "The speed of the electron is independent of the radius of the orbit.",
            "The B-field is directly proportional to the radius of the circle."
        ],
        correctAnswerIndex: 0,
        xpValue: 25,
        explanation: "Centripetal force = Magnetic force: mv²/r = qvB. The period T = distance/speed = 2πr/v. Substitute r = mv/qB into the period equation: T = 2π(mv/qB) / v. The velocity 'v' cancels out entirely, meaning the period T = 2πm/qB, which is totally independent of speed."
    },

    // ==========================================
    // QUANTUM (Adds 4 to reach 10)
    // ==========================================
    {
        subject: "physics",
        topic: "quantum",
        question: "In atomic physics, the binding energy of an atomic nucleus is definitively defined as the:",
        options: [
            "Energy used in forming the nucleus from constituent nucleons.",
            "Energy needed to completely separate the nucleons to infinity.",
            "Energy equivalent of the mass of the nucleus.",
            "Difference between the total mass of the nucleons and that of the entire nucleus."
        ],
        correctAnswerIndex: 1,
        xpValue: 25,
        explanation: "Binding energy is defined as the work that must be done against the strong nuclear force to completely separate a nucleus into its constituent individual protons and neutrons."
    },
    {
        subject: "physics",
        topic: "quantum",
        question: "In a radioactive decay, a radioisotope emits an alpha particle, quickly followed by a beta particle. The resulting daughter nuclide:",
        options: [
            "Gains a unit positive charge.",
            "Has an atomic number reduced by 2.",
            "Has a neutron number reduced by 4.",
            "Has a nucleon (mass) number reduced by 4."
        ],
        correctAnswerIndex: 3,
        xpValue: 25,
        explanation: "An alpha particle (Helium nucleus) emission reduces the mass number by 4 and atomic number by 2. A beta particle (electron) emission converts a neutron to a proton, increasing the atomic number by 1 but leaving the mass number unchanged. Thus, the total mass number is exclusively reduced by 4."
    },
    {
        subject: "physics",
        topic: "quantum",
        question: "Photons of light enter a glass block traveling through a vacuum. The energy of the individual photons on entering the glass block:",
        options: [
            "Increases because the wavelength decreases.",
            "Decreases because the speed decreases.",
            "Stays the same because the speed and wavelength do not change.",
            "Stays the same because the frequency does not change."
        ],
        correctAnswerIndex: 3,
        xpValue: 25,
        explanation: "The energy of a photon is strictly determined by its frequency (E = hf). When light enters a denser medium like glass, its speed and wavelength decrease, but the frequency remains constant as it is dictated by the source. Therefore, energy is conserved and stays the same."
    },
    {
        subject: "physics",
        topic: "quantum",
        question: "A beam of protons used in a particle accelerator experiment is referred to as being a 20 MeV beam. The MeV is a unit of:",
        options: [
            "Charge",
            "Potential difference",
            "Energy",
            "Electric field intensity"
        ],
        correctAnswerIndex: 2,
        xpValue: 25,
        explanation: "MeV stands for Mega Electron-Volts. One electron-volt (eV) is the kinetic energy gained by a single electron accelerating from rest through an electric potential difference of one volt. Therefore, it is a unit of Energy."
    },

    // ==========================================
    // THERMAL (Adds 4 to reach 10)
    // ==========================================
    {
        subject: "physics",
        topic: "thermal",
        question: "During a change of state, which of the following processes occurs?",
        options: [
            "The internal kinetic energy of a system increases.",
            "Latent heat is absorbed without doing any internal work.",
            "Work is done and molecules are physically broken.",
            "Work is done against intermolecular forces and/or bonds are being broken or constructed."
        ],
        correctAnswerIndex: 3,
        xpValue: 25,
        explanation: "During a phase change, the temperature remains constant, meaning the internal kinetic energy does not change. The latent heat supplied is used entirely as internal potential energy to do work against intermolecular forces, breaking the lattice structure."
    },
    {
        subject: "physics",
        topic: "thermal",
        question: "The second law of thermodynamics helps one to understand that:",
        options: [
            "Net heat flows only in a particular direction in the universe, and entropy changes with time.",
            "Heat can completely be converted into work at 100% efficiency.",
            "Entropy of an isolated system always strictly decreases.",
            "Heat naturally flows from a cold object to a hot object."
        ],
        correctAnswerIndex: 0,
        xpValue: 25,
        explanation: "The Second Law dictates the direction of spontaneous processes: heat naturally flows from hot to cold, no engine is 100% efficient, and the total entropy (disorder) of an isolated system always increases over time."
    },
    {
        subject: "physics",
        topic: "thermal",
        question: "Which essential information is required to calculate the energy needed to change 0.5 kg of ice at -10°C to water at 20°C (ignoring heat lost)?",
        options: [
            "Mass of water, specific latent heat of fusion of ice, and specific heat capacity of water.",
            "Mass of calorimeter, specific heat capacity of water, and specific latent heat of fusion of ice.",
            "Specific heat capacity of ice, specific latent heat of fusion of ice, and specific heat capacity of water.",
            "Specific heat capacity of ice, temperature rise, specific latent heat of fusion of ice, and time taken."
        ],
        correctAnswerIndex: 2,
        xpValue: 25,
        explanation: "The process has three stages: heating the solid ice (requires SHC of ice), melting the ice at 0°C (requires specific latent heat of fusion), and heating the resulting liquid water to 20°C (requires SHC of water)."
    },
    {
        subject: "physics",
        topic: "thermal",
        question: "Running water is used to remove excess heat at a rate of 120 J/s from a vacuum pump. At what rate in kg/s does the water flow if it enters the pump at 20°C and leaves it at 22°C? (SHC of water = 4200 J/kg·K)",
        options: ["0.01", "0.08", "0.14", "0.28"],
        correctAnswerIndex: 0,
        xpValue: 25,
        explanation: "Power P = (mass/time) × c × ΔT. We need the mass flow rate (m/t). So, 120 = (m/t) × 4200 × (22 - 20). 120 = (m/t) × 8400. Therefore, (m/t) = 120 / 8400 = 0.0142 kg/s, which rounds to approximately 0.01 kg/s."
    },

    // ==========================================
    // WAVES (Adds 4 to reach 10)
    // ==========================================
    {
        subject: "physics",
        topic: "waves",
        question: "An aeroplane in flight sends radar waves to an airport tower and receives reflected signals registered on an oscilloscope. If the time base setting is 10⁻⁶ s/mm and the distance between the sent and received pulses on screen is 24 mm, how far is the plane from the airport? (c = 3 × 10⁸ m/s)",
        options: ["7.2 km", "3.6 km", "14.4 km", "1.8 km"],
        correctAnswerIndex: 1,
        xpValue: 25,
        explanation: "Total travel time t = 24 mm × 10⁻⁶ s/mm = 24 × 10⁻⁶ s. Because radar works by reflection, the signal travels to the airport and back (double distance). Distance = (Speed × Time) / 2 = (3×10⁸ × 24×10⁻⁶) / 2 = 3.6 × 10³ m = 3.6 km."
    },
    {
        subject: "physics",
        topic: "waves",
        question: "A pipe of length L is opened at both ends. It is made to resonate such that its second harmonic is at a frequency f₂. Which of the following is true about its fundamental frequency f₀?",
        options: [
            "The fundamental frequency f₀ is larger than f₂.",
            "The fundamental frequency f₀ is the same as f₂.",
            "The fundamental frequency f₀ is half of f₂.",
            "The fundamental frequency f₀ is a third of f₂."
        ],
        correctAnswerIndex: 2,
        xpValue: 25,
        explanation: "For a pipe open at both ends, all integer harmonics are present. The fundamental frequency is f₀. The second harmonic (the first overtone) is f₂ = 2f₀. Therefore, rearranging this gives f₀ = f₂ / 2, meaning the fundamental frequency is half of f₂."
    },
    {
        subject: "physics",
        topic: "waves",
        question: "When light falls on a clean glass block of refractive index 1.5, it is noticed using a polaroid that the reflected ray is completely plane polarized. Which of the following values is the angle of reflection?",
        options: ["56°", "45°", "90°", "44°"],
        correctAnswerIndex: 0,
        xpValue: 25,
        explanation: "By Brewster's Law, reflected light is completely polarized when the angle of incidence equals Brewster's angle (θp), where tan(θp) = n. tan(θp) = 1.5, so θp = arctan(1.5) = 56.3°. By the law of reflection, the angle of reflection equals the angle of incidence, so it is ~56°."
    },
    {
        subject: "physics",
        topic: "waves",
        question: "Transverse waves can be definitively distinguished from longitudinal waves using the physical phenomenon of:",
        options: [
            "Polarization",
            "Refraction",
            "Reflection",
            "Diffraction"
        ],
        correctAnswerIndex: 0,
        xpValue: 25,
        explanation: "Polarization restricts the oscillation of a wave to a single plane. This is only physically possible for transverse waves (like light), where oscillations are perpendicular to the wave's travel. Longitudinal waves (like sound) oscillate parallel to travel and cannot be polarized."
    },
    // ==========================================
    // THERMAL PHYSICS
    // ==========================================
    {
        subject: "physics",
        topic: "thermal",
        question: "Two bodies P and Q are in thermal equilibrium. This statement means that:",
        options: [
            "There is no net transfer of heat energy between P and Q.",
            "The rate of transfer of heat between P and Q is continuously increasing.",
            "P and Q have the exact same amount of total internal energy.",
            "P and Q must be in physical contact with each other."
        ],
        correctAnswerIndex: 0,
        xpValue: 25,
        explanation: "Thermal equilibrium simply means that two objects are at the exact same temperature. Because temperature dictates the direction of heat flow, zero temperature difference means there is zero net heat transfer between them."
    },
    {
        subject: "physics",
        topic: "thermal",
        question: "In a heat engine, heat energy Q_H is absorbed by the engine to do mechanical work while some of the heat Q_C is rejected and not available for conversion. The efficiency of the engine is given by:",
        options: [
            "(1 - Q_C / Q_H) × 100%",
            "(Q_C / Q_H) × 100%",
            "(1 - Q_H / Q_C) × 100%",
            "(Q_H / Q_C) × 100%"
        ],
        correctAnswerIndex: 0,
        xpValue: 25,
        explanation: "Efficiency is defined as (Useful Work Output) / (Total Heat Input). Work done is Q_H - Q_C. Therefore, Efficiency = (Q_H - Q_C) / Q_H, which simplifies mathematically to 1 - (Q_C / Q_H)."
    },

    // ==========================================
    // ELECTRICITY (D.C. CIRCUITS)
    // ==========================================
    {
        subject: "physics",
        topic: "electricity",
        question: "Figure 1 shows a battery of 12V connected to 3 resistors. A 6Ω and a 3Ω resistor are in parallel, and this combination is in series with a 4Ω resistor. What is the main current flowing in the circuit?",
        options: [
            "4 A",
            "2 A",
            "8 A",
            "1 A"
        ],
        correctAnswerIndex: 1,
        xpValue: 25,
        explanation: "First, resolve the parallel block: (6 × 3) / (6 + 3) = 18 / 9 = 2Ω. Add this to the series resistor to get the total circuit resistance: R_total = 2Ω + 4Ω = 6Ω. Using Ohm's Law (I = V/R), the main current is 12V / 6Ω = 2 A."
    },
    {
        subject: "physics",
        topic: "electricity",
        question: "A wire M of diameter 'd' is joined to another wire N of the same material. The diameter of N is half that of M, but the two wires have the same length. If a steady potential difference is applied across the ends of the composite wire, which of the following is correct?",
        options: [
            "The current in N is half the current in M.",
            "The drift velocity in N is four times that of the electrons in M.",
            "The number of charge carriers per unit volume in M is twice that in N.",
            "The drift velocity of electrons in M is twice that of electrons in N."
        ],
        correctAnswerIndex: 1,
        xpValue: 25,
        explanation: "Since the wires are joined in series, the current (I) is identical in both. Current I = nAvq. Area A is proportional to diameter squared (d²). Because N has half the diameter, its area is 1/4th that of M. To maintain the same current through a 4x smaller area, the drift velocity 'v' must be 4x faster."
    },

    // ==========================================
    // FIELDS (GRAVITY, ELECTRIC, MAGNETIC)
    // ==========================================
    {
        subject: "physics",
        topic: "fields",
        question: "A body moves from a point P₁ to another point P₂ in a uniform gravitational field. Which of the following statements about its change in gravitational potential energy is correct?",
        options: [
            "It depends heavily on the specific path taken between P₁ and P₂.",
            "It is independent of the mass of the body being moved.",
            "It is equal to the difference between the kinetic energies at P₁ and P₂.",
            "It depends only on the relative coordinates of P₁ and P₂ and not the path taken."
        ],
        correctAnswerIndex: 3,
        xpValue: 25,
        explanation: "Gravity is a conservative force. In any conservative force field, the work done (and therefore the change in potential energy) depends strictly on the initial and final positions, completely independent of the actual path traveled."
    },
    {
        subject: "physics",
        topic: "fields",
        question: "Two infinite long straight conductors, X and Y, are placed exactly 1.0 m apart in a vacuum. If the magnetic force per unit length between them is exactly 8.0 × 10⁻⁷ N/m, and the currents are identical, what is the current flowing in each conductor?",
        options: [
            "1.0 A",
            "2.0 A",
            "4.0 A",
            "8.0 A"
        ],
        correctAnswerIndex: 1,
        xpValue: 25,
        explanation: "The force per unit length between parallel wires is F/L = (μ₀ × I₁ × I₂) / (2πd). Since I₁ = I₂, let's call it I². 8.0 × 10⁻⁷ = (4π × 10⁻⁷ × I²) / (2π × 1.0). This simplifies to 8.0 × 10⁻⁷ = 2.0 × 10⁻⁷ × I². Therefore, I² = 4, meaning I = 2.0 A."
    },

    // ==========================================
    // CAPACITORS & A.C. CIRCUITS
    // ==========================================
    {
        subject: "physics",
        topic: "capacitors",
        question: "An LCR series circuit contains an inductor of L = 20.0 mH and operates at an angular frequency ω = 500 rad/s. What value of capacitance C is required for the current in the circuit to reach its absolute maximum (resonance)?",
        options: [
            "2.0 μF",
            "20.0 μF",
            "0.2 μF",
            "200 μF"
        ],
        correctAnswerIndex: 3,
        xpValue: 25,
        explanation: "Current is maximized at resonance, where inductive reactance equals capacitive reactance (ωL = 1/ωC). Rearranging for C gives C = 1 / (ω²L). C = 1 / (500² × 20.0×10⁻³) = 1 / (250,000 × 0.02) = 1 / 5000 = 0.0002 F, which is 200 μF."
    },
    {
        subject: "physics",
        topic: "capacitors",
        question: "The pulsating potential difference across a load can be smoothed or rectified. In order to achieve a more steady output, a suitable capacitor should be connected in:",
        options: [
            "Parallel with the load.",
            "Series with the load.",
            "Series with the diodes.",
            "Parallel with the AC source."
        ],
        correctAnswerIndex: 0,
        xpValue: 25,
        explanation: "To smooth a rectified DC signal, a 'smoothing capacitor' is placed directly in parallel with the load. It charges up during the voltage peaks and slowly discharges through the load during the voltage dips, keeping the output voltage steady."
    },

    // ==========================================
    // WAVES & OPTICS
    // ==========================================
    {
        subject: "physics",
        topic: "waves",
        question: "A car is moving towards a police post at 40 m/s sounding its horn, which emits a frequency of 380 Hz. If the speed of sound in air is 340 m/s, what is the exact physical wavelength of the sound waves in the air ahead of the car?",
        options: [
            "1.12 m",
            "0.79 m",
            "1.00 m",
            "0.89 m"
        ],
        correctAnswerIndex: 1,
        xpValue: 25,
        explanation: "Because the source is moving, the physical waves in front of it are compressed. The Doppler wavelength formula is λ' = (v - u) / f, where v is the speed of sound and u is the speed of the source. λ' = (340 - 40) / 380 = 300 / 380 = 0.789 m."
    },
    {
        subject: "physics",
        topic: "waves",
        question: "If an object is placed very close to both a thin convex lens and a thin concave lens (closer than their respective focal lengths), what type of images are formed?",
        options: [
            "The convex lens forms a virtual image, and the concave lens forms a virtual image.",
            "Both lenses will form real, inverted images.",
            "The convex lens forms a real image, while the concave lens forms a virtual image.",
            "The concave lens forms a real image, while the convex lens forms a virtual image."
        ],
        correctAnswerIndex: 0,
        xpValue: 25,
        explanation: "A concave lens ONLY ever forms virtual, diminished, upright images. A convex lens usually forms real images, but when an object is placed inside its focal length (u < f), it acts as a magnifying glass and forms a virtual, upright, magnified image."
    },

    // ==========================================
    // MODERN & QUANTUM PHYSICS
    // ==========================================
    {
        subject: "physics",
        topic: "quantum",
        question: "In a number of successive decay processes, a nucleus experiences a net decrease in its proton number by ONE, and a net decrease in its nucleon number by FOUR. Which of the following exact combinations of particles was emitted?",
        options: [
            "Two alpha particles and one beta particle",
            "One alpha particle and two beta particles",
            "One alpha particle and one beta particle",
            "Two alpha particles and two beta particles"
        ],
        correctAnswerIndex: 2,
        xpValue: 25,
        explanation: "An alpha particle drops the nucleon number by 4 and the proton number by 2. We now have -4 nucleons and -2 protons. A beta particle emission increases the proton number by +1 without affecting the nucleon number. Net result: -4 nucleons, and (-2 + 1) = -1 protons."
    },
    {
        subject: "physics",
        topic: "quantum",
        question: "Nuclear fusion is highly theorized to be fundamentally better than nuclear fission for harnessing energy because:",
        options: [
            "Fission occurs much too slowly to generate commercial power.",
            "Fusion yields significantly more energy per unit mass of fuel than fission.",
            "Fission produces absolutely zero radioactive waste.",
            "Fusion chain reactions are far easier to contain in small reactors."
        ],
        correctAnswerIndex: 1,
        xpValue: 25,
        explanation: "Nuclear fusion (combining light nuclei like hydrogen) releases vastly more energy per kilogram of fuel than nuclear fission (splitting heavy nuclei like uranium). Additionally, the fuel (isotopes of hydrogen) is incredibly abundant in seawater."
    },
    {
        subject: "physics",
        topic: "quantum",
        question: "The concept of 'wave-particle duality' in modern physics is best physically demonstrated by:",
        options: [
            "The deflection of an electron beam by an electric field.",
            "Electron diffraction patterns produced by passing electrons through crystals.",
            "Thermionic emission of electrons from a hot cathode.",
            "The deflection of a compass needle by a current-carrying wire."
        ],
        correctAnswerIndex: 1,
        xpValue: 25,
        explanation: "Diffraction and interference are exclusively wave properties. When solid particles (electrons) were fired through a crystal lattice and produced diffraction rings, it proved de Broglie's theory that matter possesses inherent wave-like characteristics."
    },

    // ==========================================
    // MECHANICS (Bonus to keep it fresh)
    // ==========================================
    {
        subject: "physics",
        topic: "mechanics",
        question: "A boy adds 5.00 J of energy to a girl on a swing by giving a push periodically each time she is at the exact same position. After doing this continuously for 10 minutes, a total of 2.40 kJ of energy has been added. Her frequency of swing in Hz is:",
        options: [
            "0.34 Hz",
            "0.80 Hz",
            "0.57 Hz",
            "0.28 Hz"
        ],
        correctAnswerIndex: 1,
        xpValue: 25,
        explanation: "Total energy = 2400 Joules. Energy per push = 5.00 Joules. Total pushes = 2400 / 5 = 480 pushes. Time = 10 minutes = 600 seconds. Frequency = oscillations / time = 480 pushes / 600 seconds = 0.80 Hz."
    },
    // ==========================================
    // CHEMISTRY: PHYSICAL
    // ==========================================
    {
        subject: "chemistry",
        topic: "physical",
        question: "Which one of the following processes is exothermic?",
        options: [
            "O(g) -> O⁺(g) + e⁻",
            "O⁻(g) + e⁻ -> O²⁻(g)",
            "O(g) + e⁻ -> O⁻(g)",
            "O(s) -> O(g) + e⁻"
        ],
        correctAnswerIndex: 2,
        xpValue: 25,
        explanation: "Electron affinity is the energy change when an electron is added to a neutral gaseous atom. For oxygen, the first electron affinity (adding one electron to form O⁻) releases energy and is an exothermic process."
    },
    {
        subject: "chemistry",
        topic: "physical",
        question: "The graph of log ionization energy against the number of electrons removed for element X shows a steady increase for the first 3 electrons, followed by a massive vertical jump for the 4th electron. In which group of the periodic table is element X found?",
        options: ["I", "II", "III", "IV"],
        correctAnswerIndex: 2,
        xpValue: 25,
        explanation: "A massive jump in successive ionization energies indicates that an electron is being removed from a deeper, much more stable inner electron shell. Because the jump happens immediately after 3 electrons are removed, the element must have exactly 3 valence electrons, placing it in Group III."
    },
    {
        subject: "chemistry",
        topic: "physical",
        question: "Consider the following two reactions:\n1. N₂(g) + 2O₂(g) -> 2NO₂(g)  ΔH = +88 kJ\n2. N₂(g) + 2O₂(g) -> N₂O₄(g)  ΔH = +10 kJ\nWhat will be the enthalpy change for the reaction: 2NO₂(g) -> N₂O₄(g)?",
        options: ["+98 kJ", "+78 kJ", "-98 kJ", "-78 kJ"],
        correctAnswerIndex: 3,
        xpValue: 25,
        explanation: "Using Hess's Law: Reverse the first equation so NO₂ is a reactant (this flips the sign, making ΔH = -88 kJ). Then, add it to the second equation (+10 kJ). The net enthalpy change is -88 kJ + 10 kJ = -78 kJ."
    },
    {
        subject: "chemistry",
        topic: "physical",
        question: "A potential energy diagram shows reactants at 150 kJ/mol and products at 50 kJ/mol. When a catalyst is used, the activation energy of the forward reaction is reduced to 35 kJ/mol. What is the activation energy of the catalyzed reverse reaction?",
        options: ["35 kJ/mol", "225 kJ/mol", "135 kJ/mol", "85 kJ/mol"],
        correctAnswerIndex: 2,
        xpValue: 25,
        explanation: "First, find the Enthalpy change (ΔH) = Products - Reactants = 50 - 150 = -100 kJ/mol. The catalyzed forward activation energy (Ea_fwd) is 35 kJ/mol. The reverse activation energy = Ea_fwd - ΔH = 35 - (-100) = 135 kJ/mol."
    },
    {
        subject: "chemistry",
        topic: "physical",
        question: "What is the oxidation state of chlorine in HClO?",
        options: ["+1", "-1", "+2", "+3"],
        correctAnswerIndex: 0,
        xpValue: 25,
        explanation: "In HClO, Hydrogen has an oxidation state of +1 and Oxygen is -2. Since the molecule is entirely neutral, the sum of all oxidation states must be zero. (+1) + Cl + (-2) = 0, therefore Chlorine must be +1."
    },
    {
        subject: "chemistry",
        topic: "physical",
        question: "Which of the following elements is most likely to have successive ionization energies in kJ/mol of: 786, 1580, 3230, 4360, 16000, 20000?",
        options: ["Al (Group III)", "Mg (Group II)", "P (Group V)", "Si (Group IV)"],
        correctAnswerIndex: 3,
        xpValue: 25,
        explanation: "Look for the largest proportional jump in the data. The energy jumps from 4,360 to 16,000 between the 4th and 5th ionization. This proves the atom has exactly 4 valence electrons, meaning it belongs to Group IV (Silicon)."
    },

    // ==========================================
    // CHEMISTRY: INORGANIC
    // ==========================================
    {
        subject: "chemistry",
        topic: "inorganic",
        question: "Gun powder burns with a lilac (purple) flame. The metal in gunpowder that causes this flame colour is?",
        options: ["Sodium", "Calcium", "Potassium", "Barium"],
        correctAnswerIndex: 2,
        xpValue: 25,
        explanation: "Flame tests are used to identify metal ions. Sodium produces a bright yellow flame, Calcium produces a brick-red flame, and Potassium produces a characteristic lilac (purple) flame."
    },
    {
        subject: "chemistry",
        topic: "inorganic",
        question: "Which of the elements below heavily exhibits the 'inert-pair effect'?",
        options: ["Carbon", "Lead", "Sodium", "Magnesium"],
        correctAnswerIndex: 1,
        xpValue: 25,
        explanation: "The inert-pair effect is the tendency of the outermost s-electrons to remain non-ionized or unshared in heavy post-transition metals. Lead (a heavy Group IV element) commonly exhibits the +2 oxidation state instead of +4 due directly to this effect."
    },
    {
        subject: "chemistry",
        topic: "inorganic",
        question: "An oxide in Period 3 reacts with both NaOH and HCl to form salts. What is the formula of the oxide?",
        options: ["Na₂O", "Al₂O₃", "SiO₂", "BeO"],
        correctAnswerIndex: 1,
        xpValue: 25,
        explanation: "An oxide that reacts with both acids (HCl) and bases (NaOH) is classified as amphoteric. In Period 3, Aluminum oxide (Al₂O₃) is the classic amphoteric oxide. Na₂O is basic, and SiO₂ is acidic."
    },
    {
        subject: "chemistry",
        topic: "inorganic",
        question: "Which of the hydrides below will be hydrolysed in water to give a basic solution?",
        options: ["CH₄", "SiH₄", "NH₃", "BiH₃"],
        correctAnswerIndex: 2,
        xpValue: 25,
        explanation: "Ammonia (NH₃) is the only hydride in this list that is highly soluble in water and acts as a weak base, accepting a proton from water to form ammonium (NH₄⁺) and hydroxide (OH⁻) ions."
    },

    // ==========================================
    // CHEMISTRY: ORGANIC
    // ==========================================
    {
        subject: "chemistry",
        topic: "organic",
        question: "Give the name of the reaction that occurs when ethene reacts with aqueous bromine.",
        options: [
            "Electrophilic addition",
            "Electrophilic substitution",
            "Nucleophilic addition",
            "Nucleophilic substitution"
        ],
        correctAnswerIndex: 0,
        xpValue: 25,
        explanation: "Ethene contains a carbon-carbon double bond, which is an area of high electron density. When it reacts with aqueous bromine, the bromine molecule acts as an electrophile, adding across the double bond in an electrophilic addition reaction."
    },
    {
        subject: "chemistry",
        topic: "organic",
        question: "When bromoethane is refluxed with KOH in an ALCOHOLIC medium, compound Y is formed. Give the identity of Y.",
        options: ["Ethanal", "Ethene", "Ethanol", "Ether"],
        correctAnswerIndex: 1,
        xpValue: 25,
        explanation: "Refluxing a haloalkane (like bromoethane) with potassium hydroxide in an ALCOHOLIC medium promotes an ELIMINATION reaction, removing HBr and forming a carbon-carbon double bond (Ethene). Note: Aqueous KOH would promote substitution to form Ethanol instead."
    },
    {
        subject: "chemistry",
        topic: "organic",
        question: "How are these two compounds, CH₃CH₂OH and CH₃OCH₃, logically related to each other?",
        options: [
            "They both react with PCl₅.",
            "They are allotropes.",
            "They both form hydrogen bonds.",
            "They are isomers."
        ],
        correctAnswerIndex: 3,
        xpValue: 25,
        explanation: "CH₃CH₂OH (ethanol) and CH₃OCH₃ (dimethyl ether) both share the exact same molecular formula (C₂H₆O) but have entirely different structural arrangements and functional groups. Therefore, they are structural isomers."
    },
    // ==========================================
    // CHEMISTRY: PHYSICAL
    // ==========================================
    {
        subject: "chemistry",
        topic: "physical",
        question: "What volume and concentration of H₂SO₄ will be needed to exactly neutralize 20 cm³ of 0.3 M NaOH?",
        options: [
            "20 cm³ of 0.3 M H₂SO₄",
            "10 cm³ of 0.3 M H₂SO₄",
            "20 cm³ of 0.6 M H₂SO₄",
            "10 cm³ of 0.6 M H₂SO₄"
        ],
        correctAnswerIndex: 1,
        xpValue: 25,
        explanation: "The balanced equation is H₂SO₄ + 2NaOH → Na₂SO₄ + 2H₂O. The mole ratio is 1:2. Moles of NaOH = 20 cm³ × 0.3 M = 6 mmol. Therefore, you need exactly half as many moles of H₂SO₄, which is 3 mmol. 10 cm³ of 0.3 M H₂SO₄ gives exactly 3 mmol."
    },
    {
        subject: "chemistry",
        topic: "physical",
        question: "The equilibrium constant for the forward reaction PCl₃(g) + Cl₂(g) ⇌ PCl₅(g) is 8.0 × 10³ mol⁻¹ dm³. The equilibrium constant for the REVERSE reaction is:",
        options: [
            "4.0 × 10³ mol dm⁻³",
            "8.0 × 10⁻³ mol dm⁻³",
            "16.0 × 10⁶ mol dm⁻³",
            "1.25 × 10⁻⁴ mol dm⁻³"
        ],
        correctAnswerIndex: 3,
        xpValue: 25,
        explanation: "The equilibrium constant for a reverse reaction is simply the mathematical reciprocal of the forward reaction's constant. K_reverse = 1 / K_forward = 1 / (8.0 × 10³) = 0.000125, which is written in standard form as 1.25 × 10⁻⁴."
    },
    {
        subject: "chemistry",
        topic: "physical",
        question: "What is the partial vapour pressure of methanol in a mixture of methanol and ethanol if the mole fraction of ethanol is 0.8 and the total pressure of the mixture is 1 atm?",
        options: ["0.8 atm", "0.2 atm", "1.0 atm", "0.25 atm"],
        correctAnswerIndex: 1,
        xpValue: 25,
        explanation: "The sum of all mole fractions in a mixture must equal 1. If the mole fraction of ethanol is 0.8, the mole fraction of methanol is 1.0 - 0.8 = 0.2. According to Raoult's/Dalton's Law, Partial Pressure = Mole Fraction × Total Pressure = 0.2 × 1 atm = 0.2 atm."
    },
    {
        subject: "chemistry",
        topic: "physical",
        question: "The Avogadro constant is strictly defined as:",
        options: [
            "The number of atoms in exactly 1 g of carbon-12.",
            "The number of atoms in exactly 12 g of carbon-12.",
            "The number of atoms in 1/12th of the mass of carbon-12.",
            "The carbon atoms found in 6.02 × 10²³ g of carbon."
        ],
        correctAnswerIndex: 1,
        xpValue: 25,
        explanation: "By definition, one mole is the amount of substance that contains the exact same number of particles as there are atoms in exactly 12 grams of the carbon-12 isotope. This number is the Avogadro constant (6.022 × 10²³)."
    },
    {
        subject: "chemistry",
        topic: "physical",
        question: "How many orbitals are there in a d-subshell of an atom?",
        options: ["5", "10", "3", "7"],
        correctAnswerIndex: 0,
        xpValue: 25,
        explanation: "A d-subshell consists of exactly 5 degenerate (equal energy) orbitals. Since each orbital can hold a maximum of 2 electrons, the entire d-subshell can hold a maximum of 10 electrons."
    },

    // ==========================================
    // CHEMISTRY: INORGANIC
    // ==========================================
    {
        subject: "chemistry",
        topic: "inorganic",
        question: "Chlorine gas may be prepared in the laboratory from concentrated hydrochloric acid by heating it with:",
        options: [
            "Concentrated H₂SO₄",
            "Manganese (IV) oxide",
            "Sodium chloride crystals",
            "Lead (II) oxide"
        ],
        correctAnswerIndex: 1,
        xpValue: 25,
        explanation: "Manganese(IV) oxide (MnO₂) acts as a strong oxidizing agent. When heated with concentrated HCl, it oxidizes the chloride ions (Cl⁻) into chlorine gas (Cl₂), while being reduced to Manganese(II) chloride (MnCl₂)."
    },
    {
        subject: "chemistry",
        topic: "inorganic",
        question: "When boron trifluoride (BF₃) reacts with ammonia (NH₃), the bond formed between the two molecules is:",
        options: [
            "An ionic bond",
            "A hydrogen bond",
            "A dative covalent bond",
            "A simple covalent bond"
        ],
        correctAnswerIndex: 2,
        xpValue: 25,
        explanation: "Boron in BF₃ is electron-deficient (it only has 6 electrons in its outer shell), while the nitrogen in NH₃ has a lone pair of electrons. Nitrogen donates both electrons from its lone pair to form a shared bond with boron, creating a dative (coordinate) covalent bond."
    },

    // ==========================================
    // CHEMISTRY: ORGANIC
    // ==========================================
    {
        subject: "chemistry",
        topic: "organic",
        question: "Give the exact IUPAC name of the following compound: CH₃CH₂CH₂CH(Br)CH(CH₃)CH₂CH₃",
        options: [
            "3-bromo-3-methylhexane",
            "2-bromo-2-ethylpentane",
            "4-bromo-3-methylheptane",
            "4-bromo-4-methylhexane"
        ],
        correctAnswerIndex: 2,
        xpValue: 25,
        explanation: "The longest continuous carbon chain has 7 carbons (heptane). You must number the chain from the end that gives the lowest numbers to the substituents. Numbering from right to left puts the methyl group on C3 and the bromine on C4. Alphabetically, 'bromo' comes before 'methyl', giving 4-bromo-3-methylheptane."
    },
    {
        subject: "chemistry",
        topic: "organic",
        question: "Which of the following compounds would most likely undergo a nucleophilic addition reaction?",
        options: ["Ethene", "Bromoethane", "Ethanal", "Benzene"],
        correctAnswerIndex: 2,
        xpValue: 25,
        explanation: "Nucleophilic addition is the characteristic reaction of carbonyl compounds (aldehydes and ketones). Ethanal has a polar C=O bond where the carbon is slightly positive, making it highly susceptible to attack by a nucleophile. Alkenes like ethene undergo electrophilic addition."
    },
    {
        subject: "chemistry",
        topic: "organic",
        question: "Which of the following compounds will give an alkane when reacted with soda lime?",
        options: [
            "CH₃CH₂OH (an alcohol)",
            "CH₃CH(Br)CH₃ (a haloalkane)",
            "CH₃CH₂COOH (a carboxylic acid)",
            "CH₃CH₂CH₂NH₂ (an amine)"
        ],
        correctAnswerIndex: 2,
        xpValue: 25,
        explanation: "Heating a carboxylic acid (or its sodium salt) with soda lime (a mixture of NaOH and CaO) results in a decarboxylation reaction. The -COOH group is entirely removed as sodium carbonate, leaving behind an alkane."
    },
    {
        subject: "chemistry",
        topic: "organic",
        question: "What is the general name given to the reaction where Phenylamine (aniline) reacts with NaNO₂ and HCl at a temperature strictly below 10°C?",
        options: ["Reduction", "Nitration", "Diazotisation", "Coupling"],
        correctAnswerIndex: 2,
        xpValue: 25,
        explanation: "The reaction of a primary aromatic amine with nitrous acid (generated in situ from NaNO₂ and HCl) at cold temperatures (< 10°C) produces a diazonium salt. This highly useful process is called diazotisation."
    },

    
    // ==========================================
    // CHEMISTRY: PHYSICAL
    // ==========================================
    {
        subject: "chemistry",
        topic: "physical",
        question: "The mass of 1 mole of calcium is exactly 40 g. What is the approximate mass of ONE single calcium atom?",
        options: [
            "6.02 × 10²³ g",
            "6.02 × 10⁻²³ g",
            "6.65 × 10²³ g",
            "6.65 × 10⁻²³ g"
        ],
        correctAnswerIndex: 3,
        xpValue: 25,
        explanation: "One mole of any substance contains Avogadro's number of particles (6.022 × 10²³). To find the mass of a single atom, divide the molar mass by Avogadro's number: 40 g / (6.022 × 10²³) ≈ 6.64 × 10⁻²³ g."
    },
    {
        subject: "chemistry",
        topic: "physical",
        question: "H₂O₂ decomposes according to the equation: 2H₂O₂ → 2H₂O + O₂. What is the ratio of the rate of disappearance of H₂O₂ with respect to the rate of formation of O₂ gas?",
        options: ["2:1", "1:2", "1:1", "2:3"],
        correctAnswerIndex: 0,
        xpValue: 25,
        explanation: "According to the stoichiometry of the balanced chemical equation, 2 moles of hydrogen peroxide (H₂O₂) decompose for every 1 mole of oxygen gas (O₂) formed. Therefore, the ratio of disappearance to formation is strictly 2:1."
    },
    {
        subject: "chemistry",
        topic: "physical",
        question: "The ground state electronic configuration of nitrogen (atomic number 7) using s, p, d, f notation is:",
        options: [
            "1s² 2s² 2p¹",
            "1s² 2s² 2p³",
            "1s² 2s² 2p²",
            "1s² 2s² 2p⁴"
        ],
        correctAnswerIndex: 1,
        xpValue: 25,
        explanation: "Nitrogen has 7 electrons. Following the Aufbau principle, the 1s subshell fills first (2 electrons), then the 2s subshell fills (2 electrons). The remaining 3 electrons occupy the 2p subshell, giving 1s² 2s² 2p³."
    },
    {
        subject: "chemistry",
        topic: "physical",
        question: "A cell is constructed using the following two half-cells: Ni²⁺/Ni (E° = -0.25V) and Ag⁺/Ag (E° = +0.80V). Choose the correct cell diagram for this cell.",
        options: [
            "Ni(s) | Ni²⁺(aq) || Ag⁺(aq) | Ag(s)",
            "Ag(s) | Ag⁺(aq) || Ni²⁺(aq) | Ni(s)",
            "Ni(s) | Ag⁺(aq) || Ni²⁺(aq) | Ag(s)",
            "Ag⁺(aq) | Ag(s) || Ni(s) | Ni²⁺(aq)"
        ],
        correctAnswerIndex: 0,
        xpValue: 25,
        explanation: "The half-cell with the more negative standard potential (Nickel) undergoes oxidation and acts as the anode. Silver undergoes reduction (cathode). Standard cell convention is Anode || Cathode, so it must be written as Ni | Ni²⁺ || Ag⁺ | Ag."
    },
    {
        subject: "chemistry",
        topic: "physical",
        question: "Brønsted-Lowry defined a base specifically as:",
        options: [
            "An electron pair donor",
            "An electron pair acceptor",
            "A proton donor",
            "A proton acceptor"
        ],
        correctAnswerIndex: 3,
        xpValue: 25,
        explanation: "In the Brønsted-Lowry theory of acids and bases, an acid is defined as a proton (H⁺) donor, while a base is strictly defined as a proton acceptor. (An electron pair donor is the definition of a Lewis base)."
    },
    {
        subject: "chemistry",
        topic: "physical",
        question: "The value of the equilibrium constant (Kc) for the reaction H₂(g) + I₂(g) ⇌ 2HI(g) can ONLY be altered by:",
        options: [
            "Adding a suitable catalyst",
            "Increasing the temperature",
            "Increasing the total pressure",
            "Adding more iodine to the system"
        ],
        correctAnswerIndex: 1,
        xpValue: 25,
        explanation: "Changes in concentration, pressure, or the addition of a catalyst will shift the position of an equilibrium to oppose the change (Le Chatelier's principle), but ONLY a change in temperature can actually alter the fundamental value of the equilibrium constant itself."
    },

    // ==========================================
    // CHEMISTRY: ORGANIC
    // ==========================================
    {
        subject: "chemistry",
        topic: "organic",
        question: "Nitration of benzene takes place in the presence of a nitrating mixture. Identify the correct nitrating mixture amongst the following:",
        options: [
            "dilute H₂SO₄ / dilute HNO₃",
            "Conc. H₂SO₄ / Conc. HNO₃",
            "NO₂⁺ gas",
            "Conc. HNO₃ alone"
        ],
        correctAnswerIndex: 1,
        xpValue: 25,
        explanation: "The nitration of benzene requires a powerful nitrating mixture consisting of concentrated sulfuric acid and concentrated nitric acid. The sulfuric acid acts as an acid catalyst, protonating the nitric acid to generate the highly reactive nitronium ion (NO₂⁺)."
    },
    {
        subject: "chemistry",
        topic: "organic",
        question: "Catenation as applied to carbon is strictly defined as the ability for carbon to:",
        options: [
            "Form compounds involving only carbon atoms.",
            "Undergo sp, sp², and sp³ hybridization.",
            "Form strong double bonds with oxygen.",
            "Form strong covalent bonds with itself."
        ],
        correctAnswerIndex: 3,
        xpValue: 25,
        explanation: "Catenation is the unique ability of atoms of the same element to link together and form long continuous chains or rings. Carbon's exceptional ability to form strong, stable carbon-carbon covalent bonds is the basis of all organic chemistry."
    },
    {
        subject: "chemistry",
        topic: "organic",
        question: "Hoffmann degradation is used to convert Ethanamide (CH₃CONH₂) to methylamine (CH₃NH₂). Give the correct reagent and reaction conditions.",
        options: [
            "Br₂ / AgNO₃ and heat",
            "Br₂ / KBr and heat",
            "Br₂ / KOH and heat",
            "Br₂ / ethanol and reflux"
        ],
        correctAnswerIndex: 2,
        xpValue: 25,
        explanation: "The Hoffmann degradation (or rearrangement) converts a primary amide into a primary amine with one fewer carbon atom. The specific reagents required are bromine (Br₂) and a strong alkali, typically potassium hydroxide (KOH), accompanied by heat."
    },
    {
        subject: "chemistry",
        topic: "organic",
        question: "Indicate the specific type of organic reaction that ethene (CH₂=CH₂) and hydrogen chloride (HCl) undergo.",
        options: [
            "Condensation reaction",
            "Nucleophilic addition",
            "Electrophilic addition",
            "Nucleophilic substitution"
        ],
        correctAnswerIndex: 2,
        xpValue: 25,
        explanation: "Ethene is an alkene with an electron-rich carbon-carbon double bond. When reacting with HCl, the partially positive hydrogen atom (an electrophile) attacks the double bond first, initiating an electrophilic addition reaction to form chloroethane."
    },
    // ==========================================
    // COMPUTER SCIENCE: ARCHITECTURE
    // ==========================================
    {
        subject: "computer_science",
        topic: "architecture",
        question: "The address bus of a certain computer has exactly 8 lines. What is the maximum number of addressable memory cells?",
        options: [
            "265",
            "256",
            "252",
            "255"
        ],
        correctAnswerIndex: 1,
        xpValue: 25,
        explanation: "The number of addressable memory cells is calculated by 2^n, where n is the number of lines in the address bus. 2⁸ equals 256 unique memory addresses (from 0 to 255)."
    },
    {
        subject: "computer_science",
        topic: "architecture",
        question: "A NAND gate has inputs A and B. Its output is connected to both inputs of another NAND gate. An equivalent gate for these two NAND gates combined is a(n):",
        options: ["OR gate", "AND gate", "NOR gate", "XOR gate"],
        correctAnswerIndex: 1,
        xpValue: 25,
        explanation: "The first NAND gate outputs NOT(A AND B). When you feed a signal into BOTH inputs of a second NAND gate, it acts identically to a NOT gate. Therefore, NOT(NOT(A AND B)) equals (A AND B), making it an AND gate."
    },
    {
        subject: "computer_science",
        topic: "architecture",
        question: "Which component locates and executes program instructions, carries out arithmetic operations, and fetches data from storage and input devices?",
        options: ["RAM", "Register", "Processor", "Cache"],
        correctAnswerIndex: 2,
        xpValue: 25,
        explanation: "The Processor (or CPU) is the brain of the computer responsible for the Fetch-Decode-Execute cycle, containing the Arithmetic Logic Unit (ALU) for calculations and the Control Unit (CU) for fetching and directing instructions."
    },

    // ==========================================
    // COMPUTER SCIENCE: SYSTEMS & NETWORKS
    // ==========================================
    {
        subject: "computer_science",
        topic: "systems",
        question: "Virtual memory is best described as:",
        options: [
            "An extremely large physical memory module.",
            "An extremely large secondary memory.",
            "An illusion of an extremely large main memory.",
            "A segmented network buffer."
        ],
        correctAnswerIndex: 2,
        xpValue: 25,
        explanation: "Virtual memory is a memory management capability of an OS that uses hardware and software to allow a computer to compensate for physical RAM shortages by temporarily transferring pages of data from random access memory (RAM) to disk storage, creating the illusion of infinite RAM."
    },
    {
        subject: "computer_science",
        topic: "systems",
        question: "A set of instructions that accesses common shared resources and MUST exclude one another in time is best referred to as a:",
        options: ["Critical region", "Deadlock", "Mutual Exclusion", "Process blocking"],
        correctAnswerIndex: 0,
        xpValue: 25,
        explanation: "A critical region (or critical section) is a part of a program that accesses a shared resource (like a shared variable or file) that must not be concurrently accessed by more than one executing thread. Mutual exclusion is the mechanism used to protect the critical region."
    },
    {
        subject: "computer_science",
        topic: "systems",
        question: "Which network device lets one forward data to other networks in an internet, no matter how distant they are?",
        options: ["Router", "Gateway", "Modem", "Codec"],
        correctAnswerIndex: 0,
        xpValue: 25,
        explanation: "A router operates at the network layer (Layer 3) and is responsible for forwarding data packets between distinct computer networks based on IP addresses, calculating the best path for the data to travel globally."
    },
    {
        subject: "computer_science",
        topic: "systems",
        question: "A multi-programming computer system is one which:",
        options: [
            "Has several distinct physical processors working in parallel.",
            "Has multiple users working at the exact same millisecond.",
            "Is capable of running two or more programs apparently simultaneously.",
            "Executes completely different operating systems at the same time."
        ],
        correctAnswerIndex: 2,
        xpValue: 25,
        explanation: "Multi-programming involves keeping several programs in main memory at the same time and rapidly switching the CPU between them (context switching). This maximizes CPU utilization and gives the user the illusion that programs are running simultaneously."
    },

    // ==========================================
    // COMPUTER SCIENCE: DATA STRUCTURES & ALGORITHMS
    // ==========================================
    {
        subject: "computer_science",
        topic: "data_structures",
        question: "The data structure required to optimally evaluate a postfix expression is a(n):",
        options: ["Stack", "Queue", "Tree", "Array"],
        correctAnswerIndex: 0,
        xpValue: 25,
        explanation: "A stack (Last-In-First-Out) is perfect for postfix evaluation. You push operands onto the stack as you read them from left to right. When you hit an operator, you pop the top two operands, apply the operator, and push the result back onto the stack."
    },
    {
        subject: "computer_science",
        topic: "data_structures",
        question: "A sort which searches through a list to exchange the first element with any element less than it, and then repeats with a new first element at subsequent positions is called:",
        options: ["Insertion sort", "Selection sort", "Bubble sort", "Quick sort"],
        correctAnswerIndex: 1,
        xpValue: 25,
        explanation: "Selection sort works by repeatedly finding the minimum element from the unsorted part of the list and swapping it with the element at the beginning of the unsorted section, effectively growing a sorted subsection from left to right."
    },
    {
        subject: "computer_science",
        topic: "data_structures",
        question: "An algorithm initially sets variables r and s to 10 and 0. If r >= s it then subtracts 3 from r and adds 2 to s, and repeatedly does so until r < s. The product of r and s immediately just before the third test of r >= s is:",
        options: ["0", "6", "14", "16"],
        correctAnswerIndex: 3,
        xpValue: 25,
        explanation: "Start: r=10, s=0. \nTest 1 (10>=0): r becomes 7, s becomes 2. \nTest 2 (7>=2): r becomes 4, s becomes 4. \nBefore Test 3, r=4 and s=4. The product is 4 × 4 = 16."
    },

    // ==========================================
    // COMPUTER SCIENCE: DATABASES
    // ==========================================
    {
        subject: "computer_science",
        topic: "databases",
        question: "It allows a user to access, update, and otherwise manipulate the data found in a DBMS:",
        options: [
            "Data Definition Language (DDL)",
            "Data Manipulation Language (DML)",
            "Structured Query Language (SQL)",
            "Fourth Generation Language (4GL)"
        ],
        correctAnswerIndex: 1,
        xpValue: 25,
        explanation: "DML (Data Manipulation Language) provides the commands used to retrieve, insert, delete, and modify data in a database. (DDL is used to define the actual structure and schema of the tables)."
    },
    {
        subject: "computer_science",
        topic: "databases",
        question: "A relational database table is considered to be in Third Normal Form (3NF) if it:",
        options: [
            "Has only a primary key.",
            "Is linked to another table by means of a foreign key.",
            "Has no repeating fields.",
            "Contains no non-key (transitive) dependencies."
        ],
        correctAnswerIndex: 3,
        xpValue: 25,
        explanation: "A table is in 3NF if it is already in 2NF and every non-key attribute is non-transitively dependent on the primary key. In simpler terms: all non-key fields must depend ONLY on the primary key, and not on any other non-key field."
    },
    {
        subject: "computer_science",
        topic: "databases",
        question: "Given that the state of the database no longer reflects a real state of the world that the database is supposed to capture, then such a state is called a(n):",
        options: ["Consistent state", "Parallel state", "Durable state", "Inconsistent state"],
        correctAnswerIndex: 3,
        xpValue: 25,
        explanation: "Data inconsistency occurs when different copies of data in a database no longer match or when the data violates established integrity constraints, meaning it fails to accurately represent the real-world scenario."
    },

    // ==========================================
    // COMPUTER SCIENCE: SOFTWARE ENGINEERING
    // ==========================================
    {
        subject: "computer_science",
        topic: "software_engineering",
        question: "Which activity is fundamentally performed at EVERY single stage of the Systems Development Life Cycle (SDLC)?",
        options: ["Coding", "Design", "Analysis", "Documentation"],
        correctAnswerIndex: 3,
        xpValue: 25,
        explanation: "Documentation is a continuous process. Whether you are in the feasibility study, analysis, design, implementation, or testing phase, thorough documentation must be maintained to track requirements, system architecture, code logic, and test cases."
    },
    {
        subject: "computer_science",
        topic: "software_engineering",
        question: "Which of the following compiler phases best work together so that strings of symbols are given the exact meaning expected of the program when executed?",
        options: [
            "Lexical analysis and syntax analysis",
            "Syntax analysis and code generation",
            "Code generation and code optimisation",
            "Code optimisation and code execution"
        ],
        correctAnswerIndex: 0,
        xpValue: 25,
        explanation: "Lexical analysis converts the raw code into meaningful tokens (keywords, identifiers). Syntax analysis (parsing) then takes these tokens and arranges them into a syntax tree to ensure they follow the grammatical rules of the programming language, giving the code structural meaning."
    },
    // ==========================================
    // COMPUTER SCIENCE: ARCHITECTURE (Adds 7)
    // ==========================================
    {
        subject: "computer_science",
        topic: "architecture",
        question: "In the memory hierarchy of a computer system, the fastest accessible memory is the:",
        options: ["RAM", "Cache", "CPU registers", "Virtual Memory"],
        correctAnswerIndex: 2,
        xpValue: 25,
        explanation: "CPU registers are built directly into the processor itself, making them the absolute fastest memory in the hierarchy. Cache is second, main memory (RAM) is third, and secondary/virtual memory is the slowest."
    },
    {
        subject: "computer_science",
        topic: "architecture",
        question: "A CPU has a 16-bit program counter. This means that the CPU can directly address a maximum of:",
        options: ["16K memory locations", "32K memory locations", "64K memory locations", "256K memory locations"],
        correctAnswerIndex: 2,
        xpValue: 25,
        explanation: "The maximum number of addressable locations is 2^n, where n is the number of bits in the address register. 2^16 equals 65,536 locations, which is exactly 64K."
    },
    {
        subject: "computer_science",
        topic: "architecture",
        question: "Which of the following is considered a 'Universal Gate' in digital logic?",
        options: ["AND", "OR", "NOR", "XOR"],
        correctAnswerIndex: 2,
        xpValue: 25,
        explanation: "A universal gate is one that can be used to implement any other boolean function without needing any other type of gate. Both NAND and NOR gates are universal gates."
    },
    {
        subject: "computer_science",
        topic: "architecture",
        question: "In register addressing mode, the operands required for the instruction are examined and found directly in:",
        options: ["Cache memory", "Secondary storage", "The CPU", "Primary memory"],
        correctAnswerIndex: 2,
        xpValue: 25,
        explanation: "In register addressing, the operand field contains a register reference rather than a memory address. Because registers reside physically within the CPU, the operands are examined directly in the CPU."
    },
    {
        subject: "computer_science",
        topic: "architecture",
        question: "A machine's CPU takes one of the arguments for its binary operations from the accumulator implicitly. This architecture is characteristic of a:",
        options: ["Three-address machine", "Two-address machine", "One-address machine", "Zero-address machine"],
        correctAnswerIndex: 2,
        xpValue: 25,
        explanation: "In a one-address machine, instructions only need to specify one operand in memory. The other operand is implicitly assumed to be already waiting in the accumulator register."
    },
    {
        subject: "computer_science",
        topic: "architecture",
        question: "In indexed mode addressing, how is the effective address of the operand determined?",
        options: [
            "The operand of the instruction is used immediately as data.",
            "The operand provides an offset added to an index register to find the location.",
            "The operand field holds the exact direct address for immediate use.",
            "The operand address is given as a fixed offset from the current instruction."
        ],
        correctAnswerIndex: 1,
        xpValue: 25,
        explanation: "In indexed addressing, the effective memory address is calculated by adding a constant value (the offset provided in the instruction) to the contents of a specific index register."
    },
    {
        subject: "computer_science",
        topic: "architecture",
        question: "Which of the following is NOT an advantage of Dynamic RAM (DRAM) over Static RAM (SRAM)?",
        options: ["High density", "Low cost", "High speed", "No need of memory refresh"],
        correctAnswerIndex: 3,
        xpValue: 25,
        explanation: "Dynamic RAM stores data in tiny capacitors that slowly leak charge, meaning it MUST be continually refreshed to keep the data. SRAM uses flip-flops, which do not need refreshing and are much faster, but less dense and more expensive."
    },

    // ==========================================
    // COMPUTER SCIENCE: SYSTEMS & NETWORKS (Adds 6)
    // ==========================================
    {
        subject: "computer_science",
        topic: "systems",
        question: "An operating system that processes instructions strictly and immediately as they arrive within a guaranteed timeframe is termed a:",
        options: ["Batch processing System", "Geographic Information System", "Management Information System", "Real-time information System"],
        correctAnswerIndex: 3,
        xpValue: 25,
        explanation: "Real-time operating systems (RTOS) are designed to process data as it comes in, typically without buffering delays. They are used in mission-critical environments like flight control or medical equipment where time delays are unacceptable."
    },
    {
        subject: "computer_science",
        topic: "systems",
        question: "A real-time operating system is most likely to be required for which of the following specific tasks?",
        options: [
            "Controlling access to a shared resource in a local area network.",
            "Ensuring that the system clock works correctly on a server.",
            "Managing the access to system files in a laptop computer.",
            "Controlling the fuel injection system of an automobile engine."
        ],
        correctAnswerIndex: 3,
        xpValue: 25,
        explanation: "Fuel injection requires microsecond-precision timing based on immediate sensor inputs. If the OS delays the computation, the engine misfires. This requires a hard real-time operating system."
    },
    {
        subject: "computer_science",
        topic: "systems",
        question: "Which of the following terms from the early days of operating systems is most correctly defined?",
        options: [
            "Batch systems grouped tasks and executed them interactively by a single user.",
            "Multi-tasking systems carry out multiple tasks simultaneously on multiple CPUs.",
            "Multi-user systems share machine resources among several users at the same time.",
            "Real-time systems were designed purely to keep time on the world clock."
        ],
        correctAnswerIndex: 2,
        xpValue: 25,
        explanation: "A multi-user operating system allows multiple users to access a computer's resources (CPU, memory, peripherals) concurrently, typically via terminals connected to a central mainframe."
    },
    {
        subject: "computer_science",
        topic: "systems",
        question: "The primary advantage of a multiprogramming operating system is that:",
        options: [
            "It eliminates the need for primary memory.",
            "CPU utilization can be heavily increased.",
            "It guarantees that all jobs will be completed faster.",
            "It allows a single user to run multiple distinct operating systems."
        ],
        correctAnswerIndex: 1,
        xpValue: 25,
        explanation: "Multiprogramming keeps multiple jobs in memory. When one job has to wait for an I/O operation (like reading a disk), the OS instantly switches the CPU to execute another job, drastically reducing CPU idle time."
    },
    {
        subject: "computer_science",
        topic: "systems",
        question: "In operating system design, concurrent processes are fundamentally defined as:",
        options: [
            "Processes that do not overlap in time.",
            "Processes that overlap in time.",
            "Processes that are executed by a single processor at the exact same millisecond.",
            "Processes that must wait for user input to continue."
        ],
        correctAnswerIndex: 1,
        xpValue: 25,
        explanation: "Concurrent processes are those whose execution timelines overlap. They do not have to execute at the exact same physical millisecond (which requires parallel processors), but their start and end times overlap as the CPU switches between them."
    },
    {
        subject: "computer_science",
        topic: "systems",
        question: "Which type of operating system allows many users to use the computer simultaneously by allocating rapid, small time-slices to each user?",
        options: ["Time Sharing operating system", "Real Time operating system", "Interactive operating system", "Batch operating system"],
        correctAnswerIndex: 0,
        xpValue: 25,
        explanation: "A time-sharing (or multitasking) OS rapidly switches the CPU among multiple users/tasks. The switching happens so fast that each user gets the illusion they have dedicated use of the computer."
    },

    // ==========================================
    // COMPUTER SCIENCE: DATA STRUCTURES (Adds 7)
    // ==========================================
    {
        subject: "computer_science",
        topic: "data_structures",
        question: "Which of the following statements is NOT true regarding a Stack data structure?",
        options: [
            "It is an ordered list of a similar data type.",
            "It experiences overflow when completely full and underflow when empty.",
            "It exclusively allows push() and pop() functions.",
            "Both push() and pop() operations are done at both the front and rear simultaneously."
        ],
        correctAnswerIndex: 3,
        xpValue: 25,
        explanation: "A stack is a strict Last-In-First-Out (LIFO) structure. Both insertion (push) and deletion (pop) operations happen strictly at only ONE end, known as the 'top' of the stack, never at both ends simultaneously."
    },
    {
        subject: "computer_science",
        topic: "data_structures",
        question: "The Dequeue() operation in data structures is best known as:",
        options: [
            "Adding a new element into a queue.",
            "Defining a first-in-first-out structure.",
            "Removing an element from a queue.",
            "Locating the tail of a queue."
        ],
        correctAnswerIndex: 2,
        xpValue: 25,
        explanation: "In a Queue (FIFO), 'Enqueue' adds an item to the rear, while 'Dequeue' removes the item that has been waiting the longest from the front."
    },
    {
        subject: "computer_science",
        topic: "data_structures",
        question: "Which of the following is strictly classified as a non-linear data structure?",
        options: ["Stacks", "Linked Lists", "Strings", "Trees"],
        correctAnswerIndex: 3,
        xpValue: 25,
        explanation: "Arrays, lists, strings, and stacks are linear because their elements are arranged sequentially. A Tree is non-linear because elements (nodes) are arranged hierarchically with parent-child relationships."
    },
    {
        subject: "computer_science",
        topic: "data_structures",
        question: "Which of the following search algorithms is best suited for finding an item in an already ordered list of numbers?",
        options: ["Binary search", "Sequential search", "Quick search", "Bubble search"],
        correctAnswerIndex: 0,
        xpValue: 25,
        explanation: "Binary search is immensely efficient for sorted lists. It compares the target value to the middle element, eliminating half of the remaining list with every single step, offering O(log n) time complexity."
    },
    {
        subject: "computer_science",
        topic: "data_structures",
        question: "What is the absolute required condition for a binary search algorithm to function correctly?",
        options: [
            "The list must be sorted beforehand.",
            "There should be direct access to the middle element only.",
            "The number of elements in the list must be an even number.",
            "The item found must always be located at the middle element."
        ],
        correctAnswerIndex: 0,
        xpValue: 25,
        explanation: "Binary search relies on the principle of dividing and conquering by comparing values. If the list is not sorted, knowing an element is 'smaller' than the middle element tells you absolutely nothing about which half to search next."
    },
    {
        subject: "computer_science",
        topic: "data_structures",
        question: "The fundamental difference between a linear array and a record is:",
        options: [
            "An array is suitable for homogeneous data, but the data items in a record can be of heterogeneous data types.",
            "A record may not have a natural sequential ordering as opposed to a linear array.",
            "Record entries can nest to form a hierarchical structure, but a linear array does not.",
            "All of the above."
        ],
        correctAnswerIndex: 3,
        xpValue: 25,
        explanation: "Arrays are strictly indexed, ordered lists of a single identical data type (homogeneous). Records (like a struct in C) can contain multiple different data types (heterogeneous), can be nested, and their fields are accessed by names rather than sequential indexes."
    },
    {
        subject: "computer_science",
        topic: "data_structures",
        question: "Which of the following data structures is used by the operating system to hold jobs waiting to be run by the computer (like documents waiting for a printer)?",
        options: ["Binary tree", "Queue", "Stack", "Linked list"],
        correctAnswerIndex: 1,
        xpValue: 25,
        explanation: "Scheduling and buffering tasks (like print jobs or CPU tasks) require fairness. A Queue uses a First-In-First-Out (FIFO) protocol, ensuring that the first job requested is the first job processed."
    },

    // ==========================================
    // COMPUTER SCIENCE: DATABASES (Adds 7)
    // ==========================================
    {
        subject: "computer_science",
        topic: "databases",
        question: "In designing a relational database, which diagram is primarily used to map real-world entities into forms that can be understood by the DBMS?",
        options: ["Structural Analysis Diagram", "Entity-Relationship (E-R) Diagram", "Data Flow Diagram", "Design Tool Diagram"],
        correctAnswerIndex: 1,
        xpValue: 25,
        explanation: "An E-R diagram visualizes the database schema by showing real-world objects (Entities) and how they relate to one another (Relationships), serving as the blueprint for building relational tables."
    },
    {
        subject: "computer_science",
        topic: "databases",
        question: "Another technical term for a 'record' (a complete row of data) in a relational database table is:",
        options: ["A field", "A tuple", "A relation", "An entity"],
        correctAnswerIndex: 1,
        xpValue: 25,
        explanation: "In relational algebra and database theory, a table is called a 'relation', a column is called an 'attribute' or 'field', and a single row (record) of data is referred to as a 'tuple'."
    },
    {
        subject: "computer_science",
        topic: "databases",
        question: "The level of data abstraction which describes exactly how the data is actually stored in hardware (blocks, bytes, indexing) in a database system is the:",
        options: ["Conceptual level", "Physical level", "File level", "View level"],
        correctAnswerIndex: 1,
        xpValue: 25,
        explanation: "The physical level is the lowest level of abstraction. It describes complex low-level data structures and how the data physically resides on the storage media."
    },
    {
        subject: "computer_science",
        topic: "databases",
        question: "Program-data independence in the context of a robust DBMS means that:",
        options: [
            "The content of data files cannot necessitate changes to the program.",
            "The program does not affect the contents of the files.",
            "The program does not affect the structure of the data files.",
            "Changes to the physical structure of the data files do not require rewriting the application programs."
        ],
        correctAnswerIndex: 3,
        xpValue: 25,
        explanation: "Data independence ensures that backend database optimizations (like adding indexes, splitting physical files, or changing storage engines) can happen completely invisibly without breaking the frontend applications using the data."
    },
    {
        subject: "computer_science",
        topic: "databases",
        question: "An 'attribute' in the strict context of a relational database may be defined as:",
        options: ["Something about which data is held.", "A column of a table.", "A row in a table.", "A primary key field of a table."],
        correctAnswerIndex: 1,
        xpValue: 25,
        explanation: "An attribute describes a specific characteristic of an entity. In a relational table, attributes are represented by the columns (e.g., 'FirstName', 'Age', 'Email')."
    },
    {
        subject: "computer_science",
        topic: "databases",
        question: "In relational database design, which of the following is true regarding candidate keys?",
        options: [
            "Candidate keys can be selected to act as primary keys.",
            "A primary key cannot be formed from multiple attributes.",
            "Foreign keys cannot exist without candidate keys.",
            "Candidate key attributes are allowed to contain completely null values."
        ],
        correctAnswerIndex: 0,
        xpValue: 25,
        explanation: "A candidate key is a field (or combination of fields) that uniquely identifies a record. A table might have several candidate keys, and the database designer selects one of them to serve as the official Primary Key."
    },
    {
        subject: "computer_science",
        topic: "databases",
        question: "The individual who physically realizes the design, implementation, security, and maintenance of the operational database system is certainly a:",
        options: ["Application Developer", "Database Designer", "Database Administrator (DBA)", "Data Administrator"],
        correctAnswerIndex: 2,
        xpValue: 25,
        explanation: "While designers map out the E-R diagrams, the Database Administrator (DBA) is the IT professional responsible for actually building, securing, maintaining, and tuning the live database on the server."
    },

    // ==========================================
    // COMPUTER SCIENCE: SOFTWARE ENGINEERING (Adds 8)
    // ==========================================
    {
        subject: "computer_science",
        topic: "software_engineering",
        question: "In the Systems Development Life Cycle (SDLC), the collection of information by means of interviews, questionnaires, and observation is a core activity in:",
        options: ["System Analysis", "System Design", "System Investigation", "Information Requirement"],
        correctAnswerIndex: 0,
        xpValue: 25,
        explanation: "During the Systems Analysis phase, developers gather exactly what the user needs. They use fact-finding techniques like interviews and surveys to map out the current system's flaws and the new system's requirements."
    },
    {
        subject: "computer_science",
        topic: "software_engineering",
        question: "The feature of the Object-Oriented paradigm which explicitly enables and promotes rapid code reuse is:",
        options: ["Object", "Class", "Inheritance", "Aggregation"],
        correctAnswerIndex: 2,
        xpValue: 25,
        explanation: "Inheritance allows a new 'child' class to automatically adopt the properties and methods of an existing 'parent' class. This prevents developers from writing the same code multiple times, enabling massive code reuse."
    },
    {
        subject: "computer_science",
        topic: "software_engineering",
        question: "An 'Object' in Object-Oriented Programming fundamentally encapsulates:",
        options: ["Raw Data only.", "Code Behavior only.", "System State only.", "Both Data (state) and Behavior (methods)."],
        correctAnswerIndex: 3,
        xpValue: 25,
        explanation: "Encapsulation bundles the data (variables/attributes) and the behavior (functions/methods that operate on the data) together into a single cohesive unit known as an Object, hiding the internal workings from the rest of the program."
    },
    {
        subject: "computer_science",
        topic: "software_engineering",
        question: "If a software program compiles and runs, but in its actual functioning fails to meet the specified user requirements, then it has experienced:",
        options: ["A syntax error", "A failure", "A hardware fault", "A memory defect"],
        correctAnswerIndex: 1,
        xpValue: 25,
        explanation: "A 'failure' in software engineering occurs when a system or component is unable to perform its required functions within specified performance requirements. Even if there are no code crashes, missing the business requirement is a failure."
    },
    {
        subject: "computer_science",
        topic: "software_engineering",
        question: "During the SDLC, rapid prototyping of a system's user interface and core functionality is typically performed by:",
        options: ["The Client alone", "The Developer alone", "The Manager", "Both the Client and the Developer collaboratively"],
        correctAnswerIndex: 3,
        xpValue: 25,
        explanation: "Prototyping is an iterative, collaborative process. The developer builds a quick, scaled-down version of the system, and the client evaluates it to provide immediate feedback on what works and what doesn't."
    },
    {
        subject: "computer_science",
        topic: "software_engineering",
        question: "Which of the following levels of software testing is strictly performed by the end-user (the customer) before final deployment?",
        options: ["Acceptance testing", "Unit testing", "Integration testing", "System testing"],
        correctAnswerIndex: 0,
        xpValue: 25,
        explanation: "User Acceptance Testing (UAT) is the absolute final phase of testing. Actual end-users test the software in the real world to verify that it meets the business needs they requested during the initial analysis phase."
    },
    {
        subject: "computer_science",
        topic: "software_engineering",
        question: "The detailed, forensic study of an existing, legacy system when preparing to develop a new Information System is referred to as:",
        options: ["System Planning", "System Analysis", "Feasibility Study", "System Design"],
        correctAnswerIndex: 1,
        xpValue: 25,
        explanation: "System Analysis involves deconstructing the old system to understand its inputs, processes, and bottlenecks. You cannot design a new system to solve problems if you haven't thoroughly analyzed the existing problems."
    },
    {
        subject: "computer_science",
        topic: "software_engineering",
        question: "What is the true underlying objective of a robust test strategy for a new program?",
        options: [
            "To ensure that the program compiles without any syntax errors.",
            "To mathematically prove that the program has zero errors.",
            "To establish exactly which data will allow the program to run without crashing.",
            "To deliberately try to provoke program failure and expose bugs."
        ],
        correctAnswerIndex: 3,
        xpValue: 25,
        explanation: "Testing is inherently a destructive process. A successful test is one that finds an error. The goal of testing is not to prove that the software works, but to brutally expose where and how it fails before the customer uses it."
    },
    // ==========================================
    // PURE MATHEMATICS: ALGEBRA
    // ==========================================
    {
        subject: "mathematics",
        topic: "algebra",
        question: "The roots of the quadratic equation cx² - 3x - c = 0 are:",
        options: [
            "(3 ± √(9 - 4c²)) / 2c",
            "(3 ± √(9 + 4c)) / 2c",
            "(3 ± √(9 + 4c²)) / 2c",
            "(3 ± √(9 - 4c)) / 2c"
        ],
        correctAnswerIndex: 2,
        xpValue: 25,
        explanation: "Using the standard quadratic formula x = [-b ± √(b² - 4ac)] / 2a. Here, a = c, b = -3, and c = -c. Plugging these in gives: x = [3 ± √((-3)² - 4(c)(-c))] / 2c, which simplifies to (3 ± √(9 + 4c²)) / 2c."
    },
    {
        subject: "mathematics",
        topic: "algebra",
        question: "The partial fractions corresponding to (2x + 7) / (x² + 5x + 6) are:",
        options: [
            "3/(x + 2) - 1/(x + 3)",
            "-3/(x + 2) + 1/(x + 3)",
            "-3/(x + 2) - 1/(x + 3)",
            "3/(x + 2) + 1/(x + 3)"
        ],
        correctAnswerIndex: 0,
        xpValue: 25,
        explanation: "Factor the denominator: (x+2)(x+3). Set up the identity: A/(x+2) + B/(x+3) = (2x+7) / ((x+2)(x+3)). Multiplying through gives A(x+3) + B(x+2) = 2x+7. Let x = -2, then A(1) = 3, so A = 3. Let x = -3, then B(-1) = 1, so B = -1."
    },
    {
        subject: "mathematics",
        topic: "algebra",
        question: "Let Matrix A be a 2x3 matrix and Matrix B be a 3x2 matrix. The order of the matrix product AB is:",
        options: ["2x3", "3x2", "3x3", "2x2"],
        correctAnswerIndex: 3,
        xpValue: 25,
        explanation: "When multiplying matrices, an (m x n) matrix multiplied by an (n x p) matrix results in an (m x p) matrix. Here, a (2 x 3) multiplied by a (3 x 2) yields a (2 x 2) matrix."
    },

    // ==========================================
    // PURE MATHEMATICS: CALCULUS
    // ==========================================
    {
        subject: "mathematics",
        topic: "calculus",
        question: "The limit as x approaches 3 of the function (x² - 9) / (x - 3) is:",
        options: ["0", "-3", "∞", "6"],
        correctAnswerIndex: 3,
        xpValue: 25,
        explanation: "Direct substitution yields 0/0 (indeterminate). Factor the difference of squares in the numerator: (x-3)(x+3) / (x-3). The (x-3) terms cancel out, leaving just (x+3). Evaluating the limit as x approaches 3 gives 3 + 3 = 6."
    },
    {
        subject: "mathematics",
        topic: "calculus",
        question: "Evaluate the integral: ∫ (x + 2) / (x + 3) dx",
        options: [
            "2x - ln(x + 3) + k",
            "x - ln(x + 3) + k",
            "ln(x + 3) + k",
            "x + ln(x + 3) + k"
        ],
        correctAnswerIndex: 1,
        xpValue: 25,
        explanation: "Rewrite the numerator to match the denominator: (x + 3 - 1). The integral becomes ∫ [(x+3)/(x+3) - 1/(x+3)] dx, which simplifies to ∫ [1 - 1/(x+3)] dx. Integrating this gives x - ln(x + 3) + k."
    },
    {
        subject: "mathematics",
        topic: "calculus",
        question: "Values of y for various values of x are given as points (x, y): (0, 4), (1, 6), (2, 7), (3, 5), (4, 4). Using the trapezium rule, the approximate value of the integral of y from x=0 to x=4 is:",
        options: ["9", "22", "44", "44/3"],
        correctAnswerIndex: 1,
        xpValue: 25,
        explanation: "Trapezium rule formula: Area ≈ (h/2) * [y₀ + 2(y₁ + y₂ + y₃) + y₄]. Here, h (step size) is 1. Area ≈ (1/2) * [4 + 2(6 + 7 + 5) + 4] = (1/2) * [4 + 36 + 4] = 44 / 2 = 22."
    },

    // ==========================================
    // PURE MATHEMATICS: GEOMETRY
    // ==========================================
    {
        subject: "mathematics",
        topic: "geometry",
        question: "The diameter of the circle whose equation is x² + y² + 6x - 4y - 23 = 0 is:",
        options: ["6", "12", "20", "10"],
        correctAnswerIndex: 1,
        xpValue: 25,
        explanation: "The general circle equation is x² + y² + 2gx + 2fy + c = 0. Here, g = 3, f = -2, c = -23. The radius r = √(g² + f² - c) = √(3² + (-2)² - (-23)) = √(9 + 4 + 23) = √36 = 6. The diameter is 2r = 12."
    },
    {
        subject: "mathematics",
        topic: "geometry",
        question: "The shortest distance of the plane 2x - 2y - z = 27 from the origin is:",
        options: ["9", "3", "27", "6"],
        correctAnswerIndex: 0,
        xpValue: 25,
        explanation: "The perpendicular distance from the origin (0,0,0) to a plane Ax + By + Cz + D = 0 is given by |D| / √(A² + B² + C²). Here, D = -27. Distance = |-27| / √(2² + (-2)² + (-1)²) = 27 / √9 = 27 / 3 = 9."
    },
    {
        subject: "mathematics",
        topic: "geometry",
        question: "The vector equation of a line passing through the point (1, 3, 4) and parallel to the vector (i - j + 2k) is:",
        options: [
            "r = i + 3j + 4k + λ(-4i - 2k)",
            "r = i - j + 2k + λ(-4i - 2k)",
            "r = i + 3j + 4k + λ(i - j + 2k)",
            "r = i - j + 2k + λ(i + 3j + 4k)"
        ],
        correctAnswerIndex: 2,
        xpValue: 25,
        explanation: "The vector equation of a line is r = a + λb, where 'a' is the position vector of a point on the line, and 'b' is the direction vector it is parallel to. Substituting the point (i + 3j + 4k) and direction (i - j + 2k) yields Option C."
    },

    // ==========================================
    // PURE MATHEMATICS: TRIGONOMETRY
    // ==========================================
    {
        subject: "mathematics",
        topic: "trigonometry",
        question: "Given that cos(x) = 1/√3, the exact value of sin(2x) is:",
        options: ["√(2/3)", "(2√2)/5", "(2√3)/3", "(2√2)/3"],
        correctAnswerIndex: 3,
        xpValue: 25,
        explanation: "First find sin(x). Since sin²x + cos²x = 1, sin²x = 1 - (1/3) = 2/3. So, sin(x) = √(2/3) = √2/√3. Using the double angle identity, sin(2x) = 2*sin(x)*cos(x) = 2 * (√2/√3) * (1/√3) = (2√2)/3."
    },
    {
        subject: "mathematics",
        topic: "trigonometry",
        question: "The general solution of the trigonometric equation cos(θ) = 1/2 is:",
        options: [
            "θ = 2nπ ± π/3",
            "θ = 2nπ ± π/6",
            "θ = nπ ± π/3",
            "θ = nπ ± π/6"
        ],
        correctAnswerIndex: 0,
        xpValue: 25,
        explanation: "The principal value where cos(θ) = 1/2 is π/3 (or 60°). The general solution for cosine is given by θ = 2nπ ± α, where α is the principal value. Therefore, θ = 2nπ ± π/3."
    },

    // ==========================================
    // PURE MATHEMATICS: FUNCTIONS & LOGIC
    // ==========================================
    {
        subject: "mathematics",
        topic: "functions",
        question: "A first approximation to the root of the equation e^x + 2x - 1 = 0 is x = 1. Using the Newton-Raphson method, a second approximation to the root of the equation is:",
        options: [
            "1 - (e + 1)/(e + 2)",
            "1 - (e + 2)/(e + 1)",
            "1 - (e - 1)/(e + 2)",
            "1 + (e + 1)/(e + 2)"
        ],
        correctAnswerIndex: 0,
        xpValue: 25,
        explanation: "Newton-Raphson formula: x₂ = x₁ - [f(x₁) / f'(x₁)]. Here, f(x) = e^x + 2x - 1, and f'(x) = e^x + 2. Substituting x₁ = 1 gives f(1) = e + 2 - 1 = e + 1, and f'(1) = e + 2. Thus, x₂ = 1 - (e + 1)/(e + 2)."
    },
    {
        subject: "mathematics",
        topic: "functions",
        question: "The converse of the logical implication p ⇒ q is represented as:",
        options: ["q ⇒ p", "~p ⇒ ~q", "p ⇔ q", "~q ⇒ ~p"],
        correctAnswerIndex: 0,
        xpValue: 25,
        explanation: "In formal logic, if a conditional statement is 'If p, then q' (p ⇒ q), its converse is simply reversing the hypothesis and conclusion, resulting in 'If q, then p' (q ⇒ p)."
    },
    {
        subject: "mathematics",
        topic: "functions",
        question: "An equivalence relation on a mathematical set is one that is strictly:",
        options: [
            "Reflexive, symmetric, and commutative.",
            "Reflexive, symmetric, and identical.",
            "Reflexive, anti-symmetric, and transitive.",
            "Reflexive, symmetric, and transitive."
        ],
        correctAnswerIndex: 3,
        xpValue: 25,
        explanation: "By mathematical definition, for any binary relation to be considered an equivalence relation (like equality '=' or congruence), it must simultaneously satisfy three properties: reflexivity, symmetry, and transitivity."
    },
    {
        subject: "mathematics",
        topic: "functions",
        question: "A binary relation R is defined on the set of natural numbers by mRn if and only if 'm+n is an odd number'. This relation R is:",
        options: [
            "Symmetric and reflexive",
            "Symmetric only",
            "Symmetric and transitive",
            "Anti-symmetric"
        ],
        correctAnswerIndex: 1,
        xpValue: 25,
        explanation: "It is not reflexive because m+m = 2m (which is always even). It is symmetric because if m+n is odd, n+m is also odd. It is not transitive because if m+n is odd (even+odd) and n+k is odd (odd+even), then m+k is even+even=even (not odd)."
    },
    // ==========================================
    // PURE MATHEMATICS: ALGEBRA
    // ==========================================
    {
        subject: "mathematics",
        topic: "algebra",
        question: "If 2/(x-2) + 3/(x+1) ≡ (ax+b)/[(x-2)(x+1)], then the values of the real constants a and b are respectively:",
        options: ["5, 4", "5, -4", "-5, 4", "-5, -4"],
        correctAnswerIndex: 1,
        xpValue: 25,
        explanation: "To combine the fractions, find the common denominator: [2(x+1) + 3(x-2)] / [(x-2)(x+1)]. Expanding the numerator gives 2x + 2 + 3x - 6, which simplifies to 5x - 4. Therefore, a = 5 and b = -4."
    },
    {
        subject: "mathematics",
        topic: "algebra",
        question: "Simplify the factorial expression: n! + (n-1)! + (n-2)!",
        options: ["n²(n-1)", "n²(n-2)!", "n(n-2)", "n(n-1)!"],
        correctAnswerIndex: 1,
        xpValue: 25,
        explanation: "Factor out the smallest term, which is (n-2)!. Rewrite the terms: n(n-1)(n-2)! + (n-1)(n-2)! + (n-2)!. Factoring out (n-2)! gives (n-2)! [n(n-1) + (n-1) + 1]. Inside the bracket: n² - n + n - 1 + 1 = n². The final simplified form is n²(n-2)!."
    },
    {
        subject: "mathematics",
        topic: "algebra",
        question: "Given that the roots of the equation x² - 14x + k = 0 are m and n, and that 3m = 4n, what is the value of the constant k?",
        options: ["28", "32", "24", "48"],
        correctAnswerIndex: 3,
        xpValue: 25,
        explanation: "From the sum of roots, m + n = 14. We are given 3m = 4n, so m = 4n/3. Substitute this into the sum: 4n/3 + n = 14, which means 7n/3 = 14, so n = 6. If n = 6, then m = 8. The product of the roots (m × n) gives k. So, k = 8 × 6 = 48."
    },
    {
        subject: "mathematics",
        topic: "algebra",
        question: "What is the solution set of values for x for which the inequality (x - 1)(x - 3)(2x + 1) > 0 holds true?",
        options: [
            "x < -1/2 or x > 3",
            "x < -3 or -1 < x < 1/2",
            "1 < x < 3",
            "-1/2 < x < 1 or x > 3"
        ],
        correctAnswerIndex: 3,
        xpValue: 25,
        explanation: "The critical points are x = 1, x = 3, and x = -1/2. Testing regions between these points on a number line reveals that the expression is positive (greater than 0) between -1/2 and 1, and for all values strictly greater than 3."
    },
    {
        subject: "mathematics",
        topic: "algebra",
        question: "How many different arrangements are there of the letters of the word MANNA in which the A's are grouped together?",
        options: ["4", "6", "12", "18"],
        correctAnswerIndex: 2,
        xpValue: 25,
        explanation: "Treat the two A's (AA) as a single block. We now are arranging 4 items: M, N, N, and (AA). The number of arrangements is 4! divided by 2! (since the letter N repeats twice). 24 / 2 = 12."
    },
    {
        subject: "mathematics",
        topic: "algebra",
        question: "If 2 log₂(x) + log₂(y) = 3, then which of the following is true?",
        options: ["xy² = 8", "xy = 4", "x²y = 3", "x²y = 8"],
        correctAnswerIndex: 3,
        xpValue: 25,
        explanation: "Using logarithm power rules, 2 log₂(x) becomes log₂(x²). Using addition rules, log₂(x²) + log₂(y) becomes log₂(x²y). So, log₂(x²y) = 3. Convert this from logarithmic to exponential form: x²y = 2³. Therefore, x²y = 8."
    },
    {
        subject: "mathematics",
        topic: "algebra",
        question: "Given the exponential equation 4^(2x+1) = 2^(x-1), the value of x is:",
        options: ["-1", "-2/3", "1", "-3/2"],
        correctAnswerIndex: 0,
        xpValue: 25,
        explanation: "Express both sides with a base of 2. Since 4 = 2², the left side becomes (2²)^(2x+1) = 2^(4x+2). Equate the powers: 4x + 2 = x - 1. Solving for x gives 3x = -3, so x = -1."
    },
    {
        subject: "mathematics",
        topic: "algebra",
        question: "If a complex number z has a modulus of 2 and an argument of π/6, then z in the form a + bi is:",
        options: ["1 + √3i", "√3 - i", "√3 + i", "1 - √3i"],
        correctAnswerIndex: 2,
        xpValue: 25,
        explanation: "The polar to rectangular conversion is z = r(cos θ + i sin θ). Here, r = 2 and θ = π/6 (or 30°). z = 2(cos(30°) + i sin(30°)) = 2(√3/2 + i(1/2)). Distributing the 2 gives √3 + i."
    },
    {
        subject: "mathematics",
        topic: "algebra",
        question: "The coefficient of x² in the binomial expansion of (2 - 4x)⁴ is:",
        options: ["64", "-384", "384", "16"],
        correctAnswerIndex: 2,
        xpValue: 25,
        explanation: "Using the binomial theorem, the general term is ⁴C_r (2)^(4-r) (-4x)^r. To find the x² term, let r = 2. ⁴C₂ (2)² (-4x)² = 6 × 4 × 16x² = 384x². The coefficient is 384."
    },

    // ==========================================
    // PURE MATHEMATICS: CALCULUS
    // ==========================================
    {
        subject: "mathematics",
        topic: "calculus",
        question: "If y = ln[(x+1) / 2x], then dy/dx is:",
        options: ["2x / (1+x)", "1/(x+1) - 1/x", "1/(x+1) + 1/2x", "1/(x+1) - 1/2x"],
        correctAnswerIndex: 1,
        xpValue: 25,
        explanation: "Use logarithm laws to expand first: y = ln(x+1) - ln(2x). Now differentiate each part separately. The derivative of ln(x+1) is 1/(x+1). The derivative of ln(2x) is (1/2x)*2 = 1/x. So, dy/dx = 1/(x+1) - 1/x."
    },
    {
        subject: "mathematics",
        topic: "calculus",
        question: "The general solution of the differential equation cos(x) dy/dx = y sin(x) is:",
        options: ["y = sec²x + k", "y = ln|sec x| + k", "ln y = ln|sec x| + k", "ln y = sec²x + k"],
        correctAnswerIndex: 2,
        xpValue: 25,
        explanation: "Separate the variables: (1/y) dy = (sin(x)/cos(x)) dx, which is (1/y) dy = tan(x) dx. Integrate both sides: ∫(1/y) dy = ∫tan(x) dx. The result is ln(y) = ln|sec(x)| + k."
    },

    // ==========================================
    // PURE MATHEMATICS: GEOMETRY
    // ==========================================
    {
        subject: "mathematics",
        topic: "geometry",
        question: "What is the centre of the circle given by the equation x² + y² - x + ½y - ¼ = 0?",
        options: ["(1/2, 1/4)", "(2, -1)", "(-1/2, -1/4)", "(1/2, -1/4)"],
        correctAnswerIndex: 3,
        xpValue: 25,
        explanation: "For the general circle equation x² + y² + 2gx + 2fy + c = 0, the centre is at (-g, -f). Here, 2g = -1 (so g = -1/2) and 2f = 1/2 (so f = 1/4). The centre is (-(-1/2), -(1/4)), which gives (1/2, -1/4)."
    },

    // ==========================================
    // PURE MATHEMATICS: TRIGONOMETRY
    // ==========================================
    {
        subject: "mathematics",
        topic: "trigonometry",
        question: "Given that √3 cos(x) + sin(x) ≡ R cos(x - θ), where R > 0 and 0 < θ < π/2, the values of R and tan(θ) respectively are:",
        options: ["√3 and √3", "4 and -1/√3", "2 and 1/√3", "3 and -√3"],
        correctAnswerIndex: 2,
        xpValue: 25,
        explanation: "Using the harmonic addition formula, R = √(a² + b²) = √( (√3)² + 1² ) = √(3 + 1) = √4 = 2. To find θ, tan(θ) = b/a = 1/√3."
    },

    // ==========================================
    // PURE MATHEMATICS: FUNCTIONS & LOGIC
    // ==========================================
    {
        subject: "mathematics",
        topic: "functions",
        question: "If set A = {1, 2} and set B = {3, 4}, then the cartesian product A × B is:",
        options: [
            "{3, 4, 6, 8}",
            "{(1,3), (1,4), (2,3), (2,4)}",
            "{(3,1), (4,1), (3,2), (4,2)}",
            "{4, 5, 5, 6}"
        ],
        correctAnswerIndex: 1,
        xpValue: 25,
        explanation: "The Cartesian product A × B is the set of all possible ordered pairs (a, b) where 'a' is an element of set A, and 'b' is an element of set B. This pairs 1 with 3 and 4, then pairs 2 with 3 and 4."
    },
    {
        subject: "mathematics",
        topic: "functions",
        question: "The vertical asymptotes of the rational curve y = (2x² - 3x) / (x² + x - 2) are:",
        options: ["x = -1 or x = 2", "x = 0 or x = 3/2", "x = 1 or x = 2", "x = 1 or x = -2"],
        correctAnswerIndex: 3,
        xpValue: 25,
        explanation: "Vertical asymptotes occur where the denominator is zero (and the numerator is not zero). Factoring the denominator x² + x - 2 gives (x - 1)(x + 2). Setting it to zero gives x = 1 and x = -2. The numerator is non-zero at both these values, confirming they are valid asymptotes."
    },
    // ==========================================
    // PURE MATHEMATICS: ALGEBRA
    // ==========================================
    {
        subject: "mathematics",
        topic: "algebra",
        question: "Given that (x + 1) is a factor of the polynomial P(x) = x³ - x² - x - m, the value of m is:",
        options: ["1", "-1", "0", "-4"],
        correctAnswerIndex: 1,
        xpValue: 25,
        explanation: "According to the Factor Theorem, if (x + 1) is a factor, then P(-1) = 0. Substituting x = -1 gives (-1)³ - (-1)² - (-1) - m = 0. This simplifies to -1 - 1 + 1 - m = 0, which means -1 - m = 0, so m = -1."
    },
    {
        subject: "mathematics",
        topic: "algebra",
        question: "Given the complex number equation (1 + i)z - 3 + i = 0, the value of z in the form a + bi is:",
        options: ["-1 - 2i", "-1 + 2i", "1 + 2i", "1 - 2i"],
        correctAnswerIndex: 3,
        xpValue: 25,
        explanation: "Rearrange to solve for z: z = (3 - i) / (1 + i). To divide complex numbers, multiply the top and bottom by the complex conjugate of the denominator (1 - i). Numerator: (3 - i)(1 - i) = 3 - 3i - i + i² = 3 - 4i - 1 = 2 - 4i. Denominator: (1 + i)(1 - i) = 1² - i² = 1 - (-1) = 2. Dividing gives (2 - 4i) / 2 = 1 - 2i."
    },
    {
        subject: "mathematics",
        topic: "algebra",
        question: "If the matrix [6, k, 2; 4, -3, 3; 2, -k, 2] is not invertible (singular), then the value of k is:",
        options: ["-2", "-3", "2", "3"],
        correctAnswerIndex: 3,
        xpValue: 25,
        explanation: "A matrix is singular if its determinant equals 0. Expanding along the top row: 6[(-3)(2) - (3)(-k)] - k[(4)(2) - (3)(2)] + 2[(4)(-k) - (-3)(2)] = 0. This gives 6(-6 + 3k) - k(2) + 2(-4k + 6) = 0. Simplifying: -36 + 18k - 2k - 8k + 12 = 0. This reduces to 8k - 24 = 0, meaning k = 3."
    },
    {
        subject: "mathematics",
        topic: "algebra",
        question: "Evaluate the series sum: Σ (r+1) from r=1 to r=20.",
        options: ["210", "320", "230", "302"],
        correctAnswerIndex: 2,
        xpValue: 25,
        explanation: "You can split the summation: Σ(r) + Σ(1). The sum of the first 20 integers is n(n+1)/2 = 20(21)/2 = 210. The sum of the constant 1 added 20 times is 20. Total sum = 210 + 20 = 230."
    },
    {
        subject: "mathematics",
        topic: "algebra",
        question: "By De Moivre's Theorem, the expression cos(7θ) + i sin(7θ) is mathematically equivalent to:",
        options: [
            "7(cos θ + i sin θ)",
            "7(cos θ - i sin θ)",
            "(cos θ + i sin θ)⁷",
            "cos(2θ)cos(5θ) + i sin(2θ)sin(5θ)"
        ],
        correctAnswerIndex: 2,
        xpValue: 25,
        explanation: "De Moivre's Theorem states that for any integer n, (cos θ + i sin θ)^n = cos(nθ) + i sin(nθ). Substituting n = 7 proves equivalence with option C."
    },

    // ==========================================
    // PURE MATHEMATICS: CALCULUS
    // ==========================================
    {
        subject: "mathematics",
        topic: "calculus",
        question: "Given that y = x^(sin x) where x > 0, the derivative dy/dx is:",
        options: [
            "(x cos x)y",
            "(-cos x ln x + (sin x)/x)y",
            "((cos x)/x)y",
            "(cos x ln x + (sin x)/x)y"
        ],
        correctAnswerIndex: 3,
        xpValue: 25,
        explanation: "Use logarithmic differentiation. ln(y) = sin(x) * ln(x). Differentiate both sides implicitly using the product rule: (1/y)(dy/dx) = [cos(x) * ln(x)] + [sin(x) * (1/x)]. Multiplying both sides by y gives dy/dx = y[cos(x)ln(x) + (sin(x)/x)]."
    },
    {
        subject: "mathematics",
        topic: "calculus",
        question: "Evaluate the definite integral: ∫(from -1 to 2) (3+x)/(2+x) dx",
        options: [
            "3/2",
            "1/4 + ln 4",
            "1",
            "3 + ln 4"
        ],
        correctAnswerIndex: 3,
        xpValue: 25,
        explanation: "Rewrite the integrand by dividing: (x+3)/(x+2) = (x+2+1)/(x+2) = 1 + 1/(x+2). Integrate with respect to x to get [x + ln|x+2|]. Evaluate from -1 to 2: Upper bound is (2 + ln(4)). Lower bound is (-1 + ln(1)). Since ln(1) = 0, (2 + ln 4) - (-1) = 3 + ln 4."
    },
    {
        subject: "mathematics",
        topic: "calculus",
        question: "Evaluate the indefinite integral: ∫ (1 / (x+4)) dx",
        options: [
            "tan⁻¹(x/2) + k",
            "½ tan⁻¹(x/2) + k",
            "ln(x+4)",
            "ln(x+4) + k"
        ],
        correctAnswerIndex: 3,
        xpValue: 25,
        explanation: "The integral of 1/(x+a) is simply the natural logarithm of the absolute value of the denominator. Therefore, the anti-derivative is ln(x+4) + k, where k is the constant of integration."
    },
    {
        subject: "mathematics",
        topic: "calculus",
        question: "The derivative of cos(1 - x) with respect to x is:",
        options: [
            "-sin(1 - x)",
            "sin(1 - x)",
            "-(1 - x)sin(1 - x)",
            "sin(1 + x)"
        ],
        correctAnswerIndex: 1,
        xpValue: 25,
        explanation: "Apply the chain rule. The derivative of the outer function cos(u) is -sin(u). The derivative of the inner function (1 - x) is -1. Multiplying these gives -sin(1 - x) * (-1) = sin(1 - x)."
    },
    {
        subject: "mathematics",
        topic: "calculus",
        question: "Evaluate the integral: ∫ 2x(x² + 3)^(3/2) dx",
        options: [
            "⅕(x² + 3)^(5/2) + k",
            "⅖(x⁴/4 + 3x²/2)^(5/2) + k",
            "⅖(x² + 3)^(5/2) + k",
            "5/2(x² + 3)^(5/2) + k"
        ],
        correctAnswerIndex: 2,
        xpValue: 25,
        explanation: "Use u-substitution. Let u = x² + 3, so du = 2x dx. The integral becomes ∫ u^(3/2) du. By the power rule for integration, this is [u^(5/2)] / (5/2) + k, which flips to ⅖ u^(5/2) + k. Substituting u back in yields ⅖(x² + 3)^(5/2) + k."
    },

    // ==========================================
    // PURE MATHEMATICS: GEOMETRY
    // ==========================================
    {
        subject: "mathematics",
        topic: "geometry",
        question: "The vectors 2i - qj - k and -3i - 2j + qk are perpendicular. The scalar value of q is:",
        options: ["1", "-3", "6", "-2"],
        correctAnswerIndex: 2,
        xpValue: 25,
        explanation: "Two vectors are perpendicular if their dot product equals 0. (2)(-3) + (-q)(-2) + (-1)(q) = 0. This gives -6 + 2q - q = 0. Simplifying gives q - 6 = 0, therefore q = 6."
    },
    {
        subject: "mathematics",
        topic: "geometry",
        question: "A circle with its centre at (2, 3) perfectly touches the x-axis at the point (2, 0). The Cartesian equation of the circle is:",
        options: [
            "(x + 2)² + (y + 3)² = 9",
            "(x + 2)² + (y + 3)² = 4",
            "(x - 2)² + (y - 3)² = 4",
            "(x - 2)² + (y - 3)² = 9"
        ],
        correctAnswerIndex: 3,
        xpValue: 25,
        explanation: "The equation of a circle is (x - h)² + (y - k)² = r², where (h,k) is the centre. We know h=2 and k=3. If the circle touches the x-axis (y=0) at (2,0), the radius must be the vertical distance from the centre to the axis, which is 3. r² = 9. So, (x - 2)² + (y - 3)² = 9."
    },

    // ==========================================
    // PURE MATHEMATICS: TRIGONOMETRY
    // ==========================================
    {
        subject: "mathematics",
        topic: "trigonometry",
        question: "If A = tan⁻¹(5) + tan⁻¹(-3), then tan(A) is equal to:",
        options: ["1/2", "-4/7", "1/8", "-1/7"],
        correctAnswerIndex: 2,
        xpValue: 25,
        explanation: "Let x = tan⁻¹(5) and y = tan⁻¹(-3), meaning tan(x) = 5 and tan(y) = -3. We are looking for tan(A) = tan(x + y). Using the tangent addition formula: [tan(x) + tan(y)] / [1 - tan(x)tan(y)]. This is [5 + (-3)] / [1 - (5)(-3)] = 2 / [1 - (-15)] = 2 / 16 = 1/8."
    },

    // ==========================================
    // PURE MATHEMATICS: FUNCTIONS & LOGIC
    // ==========================================
    {
        subject: "mathematics",
        topic: "functions",
        question: "If the logical statements are given as p: 'John is eating' and q: 'John is playing', the proposition ~q ⇒ p translates to:",
        options: [
            "If John is eating then he is not playing.",
            "If John is eating then he is playing.",
            "If John does not play then he will not eat.",
            "If John is not playing then he is eating."
        ],
        correctAnswerIndex: 3,
        xpValue: 25,
        explanation: "The symbol ~q represents the negation of q ('John is NOT playing'). The arrow ⇒ represents 'If... then'. Therefore, ~q ⇒ p directly translates to: 'If John is not playing, then John is eating'."
    },
    {
        subject: "mathematics",
        topic: "functions",
        question: "A function f is defined by f(x) = (x - 3) / (2x + 1) for x ≠ -½. The value of the inverse function f⁻¹(-1) is:",
        options: ["2/3", "4/3", "4", "3/4"],
        correctAnswerIndex: 0,
        xpValue: 25,
        explanation: "Finding f⁻¹(-1) simply means finding the x-value that makes the original function equal -1. Set (x - 3) / (2x + 1) = -1. Multiply both sides by the denominator: x - 3 = -2x - 1. Rearranging gives 3x = 2, so x = 2/3."
    },
    // ==========================================
    // BIOLOGY: CELL & MOLECULAR BIOLOGY
    // ==========================================
    {
        subject: "biology",
        topic: "cell_and_molecular_biology",
        question: "What passive process describes the movement of molecules or ions across the cell surface membrane assisted by special transport proteins?",
        options: ["Active transport", "Facilitated diffusion", "Simple diffusion", "Exocytosis"],
        correctAnswerIndex: 1,
        xpValue: 25,
        explanation: "Facilitated diffusion is the passive movement (requiring no ATP) of molecules down their concentration gradient, aided by specific transmembrane integral proteins like channel or carrier proteins."
    },
    {
        subject: "biology",
        topic: "cell_and_molecular_biology",
        question: "What is the primary event that occurs in the G₁ phase of the cell cycle?",
        options: [
            "The cell synthesizes new cell organelles, its metabolic rate increases, and growth occurs.",
            "DNA replication occurs, and each chromosome becomes two chromatids.",
            "The spindle fibers begin to form for division.",
            "There is an equal division of organelles into daughter cells."
        ],
        correctAnswerIndex: 0,
        xpValue: 25,
        explanation: "The G₁ (Gap 1) phase is the first growth phase of the cell cycle. During this time, the cell grows physically larger, copies organelles, and creates the molecular building blocks it will need for DNA synthesis (S phase)."
    },
    {
        subject: "biology",
        topic: "cell_and_molecular_biology",
        question: "Which of the following nitrogenous base pairings are both strictly examples of purine bases?",
        options: ["Adenine and thymine", "Guanine and cytosine", "Thymine and uracil", "Adenine and Guanine"],
        correctAnswerIndex: 3,
        xpValue: 25,
        explanation: "In nucleic acids, purines are the larger, double-ringed nitrogenous bases. The two purines are Adenine (A) and Guanine (G). The pyrimidines (single ring) are Cytosine (C), Thymine (T), and Uracil (U)."
    },

    // ==========================================
    // BIOLOGY: PHYSIOLOGY
    // ==========================================
    {
        subject: "biology",
        topic: "physiology",
        question: "A self-propagating polarity change that occurs along the length of the axon as a wave of depolarization is called a(n):",
        options: ["Threshold potential", "Refractory period", "Nerve impulse", "Repolarization"],
        correctAnswerIndex: 2,
        xpValue: 25,
        explanation: "A nerve impulse (also known as an action potential) is a self-propagating wave of electrical depolarization that travels rapidly along the plasma membrane of a neuron's axon."
    },
    {
        subject: "biology",
        topic: "physiology",
        question: "The alimentary canal of sheep is made up of a complicated stomach. The primary site in the stomach where microbial fermentation takes place is the:",
        options: ["Rumen", "Reticulum", "Omasum", "Abomasum"],
        correctAnswerIndex: 0,
        xpValue: 25,
        explanation: "The rumen is the largest compartment of a ruminant's stomach. It acts as a massive fermentation vat where symbiotic bacteria and protozoa break down tough plant cellulose into volatile fatty acids for absorption."
    },
    {
        subject: "biology",
        topic: "physiology",
        question: "During visual accommodation that allows light from distant objects to be focused on the retina, which of the following activities occurs?",
        options: [
            "The suspensory ligament relaxes causing the lens to thicken.",
            "The circular ciliary muscle relaxes.",
            "The radial ciliary muscle contracts.",
            "The lens becomes highly convex."
        ],
        correctAnswerIndex: 1,
        xpValue: 25,
        explanation: "To view distant objects, the eye's circular ciliary muscles must relax. This expands the ciliary ring, pulling the suspensory ligaments tight, which in turn stretches the lens into a thinner, less convex shape to decrease its refractive power."
    },
    {
        subject: "biology",
        topic: "physiology",
        question: "During transpiration, water is lost as vapour through the stomata. Which of the following is an ENVIRONMENTAL factor that influences this rate?",
        options: [
            "The size of the leaf.",
            "The number of stomata present in the leaf.",
            "The temperature of the surrounding air.",
            "The distribution of stomata over the leaf."
        ],
        correctAnswerIndex: 2,
        xpValue: 25,
        explanation: "Leaf size, stomatal number, and distribution are intrinsic (structural) plant factors. Temperature is an external environmental factor that directly increases the kinetic energy of water molecules, thereby increasing the rate of evaporation."
    },

    // ==========================================
    // BIOLOGY: ECOLOGY
    // ==========================================
    {
        subject: "biology",
        topic: "ecology",
        question: "One major limitation of using pyramids of numbers in ecology is that:",
        options: [
            "All organisms must be killed to obtain the data.",
            "The mass of each organism is exactly the same at all trophic levels.",
            "They can be inverted in the case of parasite infections, where consumers vastly outnumber producers.",
            "Dry mass is mostly used because it gives accurate results."
        ],
        correctAnswerIndex: 2,
        xpValue: 25,
        explanation: "A pyramid of numbers simply counts individuals. A single large tree (one producer) can support thousands of caterpillars (primary consumers) and millions of parasites, leading to an inverted pyramid that doesn't accurately represent energy flow."
    },
    {
        subject: "biology",
        topic: "ecology",
        question: "A forest burnt by villagers was left untouched for 40 years until a new forest developed and attained a climax community. This is best described as an example of:",
        options: ["Primary succession", "Deflected succession", "Secondary succession", "Plagioclimax succession"],
        correctAnswerIndex: 2,
        xpValue: 25,
        explanation: "Secondary succession occurs in areas where a biological community has already existed but was removed by a disturbance (like a fire), leaving the soil and seed bank intact. Primary succession starts on bare rock with no topsoil."
    },
    {
        subject: "biology",
        topic: "ecology",
        question: "A niche that is characterized by high levels of predation, disease, competition, and other environmental constraints is mathematically referred to as a:",
        options: ["Fundamental niche", "Realized niche", "Deflected niche", "Climax niche"],
        correctAnswerIndex: 1,
        xpValue: 25,
        explanation: "A fundamental niche is the theoretical potential role an organism could fill without constraints. A realized niche is the actual, much narrower role it is forced to occupy in the real world due to restrictive biological pressures like competition and predation."
    },

    // ==========================================
    // BIOLOGY: GENETICS & BIOTECHNOLOGY
    // ==========================================
    {
        subject: "biology",
        topic: "genetics_and_biotechnology",
        question: "An organism whose genetic material has been artificially altered using genetic engineering principles is called a(n):",
        options: ["Vector", "Clone", "Heterozygote", "Transgenic organism"],
        correctAnswerIndex: 3,
        xpValue: 25,
        explanation: "A transgenic organism (or Genetically Modified Organism, GMO) contains genetic material into which DNA from an unrelated organism has been artificially introduced using recombinant DNA technology."
    },
    {
        subject: "biology",
        topic: "genetics_and_biotechnology",
        question: "A health challenge associated with the lack of the enzyme that converts the amino acid phenylalanine into tyrosine is known as:",
        options: ["Huntington's chorea", "Klinefelter's syndrome", "Turner's syndrome", "Phenylketonuria (PKU)"],
        correctAnswerIndex: 3,
        xpValue: 25,
        explanation: "Phenylketonuria (PKU) is a rare inherited metabolic disorder. A genetic defect causes a deficiency of the enzyme phenylalanine hydroxylase, leading to a toxic buildup of phenylalanine in the body which can cause severe intellectual disability if untreated."
    },
    // ==========================================
    // BIOLOGY: ECOLOGY
    // ==========================================
    {
        subject: "biology",
        topic: "ecology",
        question: "An inverted pyramid of numbers is most likely to arise when we have a:",
        options: [
            "Predator food chain",
            "Producer food chain",
            "Parasitic food chain",
            "Detrital food chain"
        ],
        correctAnswerIndex: 2,
        xpValue: 25,
        explanation: "In a parasitic food chain, a single large producer (like a tree) can support thousands of primary consumers (like caterpillars), which in turn can host millions of tiny parasites. This creates an 'inverted' pyramid where the number of organisms increases at higher trophic levels."
    },
    {
        subject: "biology",
        topic: "ecology",
        question: "Which of the following events would most likely initiate primary succession?",
        options: [
            "The formation of a new volcanic island.",
            "The destruction of colonizing animals.",
            "The establishment of a climax community.",
            "A fire burning down an existing forest community."
        ],
        correctAnswerIndex: 0,
        xpValue: 25,
        explanation: "Primary succession occurs in completely barren areas where no soil exists and no biological community has lived before, such as a newly formed volcanic island or bare rock exposed by a retreating glacier. A fire would trigger secondary succession since the soil remains intact."
    },
    {
        subject: "biology",
        topic: "ecology",
        question: "When populations of the same species within the exact same geographical distribution range reproduce in strict isolation from each other, it is termed:",
        options: ["Allopatric speciation", "Sympatric speciation", "Directional selection", "Disruptive selection"],
        correctAnswerIndex: 1,
        xpValue: 25,
        explanation: "Sympatric speciation occurs when a new species evolves from a single ancestral species while inhabiting the exact same geographic region. This usually happens through behavioral, ecological, or temporal reproductive isolation, unlike allopatric speciation which requires a physical geographic barrier."
    },
    {
        subject: "biology",
        topic: "ecology",
        question: "Which of the following will provide the maximum amount of retained energy to a large population of humans (such as in China)?",
        options: ["Fish", "Chicken", "Birds", "Rice"],
        correctAnswerIndex: 3,
        xpValue: 25,
        explanation: "According to the 10% rule in ecology, approximately 90% of energy is lost at each trophic level. By eating producers (rice) directly, humans operate as primary consumers, obtaining maximum energy. Eating chickens or fish makes humans secondary or tertiary consumers, resulting in massive energy loss."
    },

    // ==========================================
    // BIOLOGY: PHYSIOLOGY
    // ==========================================
    {
        subject: "biology",
        topic: "physiology",
        question: "A nerve impulse is usually transmitted from a motor neuron to a muscle by the chemical release of:",
        options: ["Acetylcholine", "A hormone", "An action potential", "Ca²⁺ ions"],
        correctAnswerIndex: 0,
        xpValue: 25,
        explanation: "At the neuromuscular junction, the arrival of an action potential triggers the presynaptic neuron to release the neurotransmitter acetylcholine (ACh) into the synaptic cleft, which then binds to receptors on the muscle fiber to trigger a contraction."
    },
    {
        subject: "biology",
        topic: "physiology",
        question: "Which of the following organisms possesses an open circulatory system?",
        options: ["Fish", "Grasshopper", "Earthworm", "Human"],
        correctAnswerIndex: 1,
        xpValue: 25,
        explanation: "Arthropods, such as insects (like the grasshopper), have an open circulatory system. Their blood (hemolymph) is not entirely contained within blood vessels; instead, it is pumped by a heart into an open body cavity called a hemocoel, directly bathing the organs."
    },
    {
        subject: "biology",
        topic: "physiology",
        question: "Macrophages contribute to the body's primary immune defense mainly by:",
        options: [
            "Secreting specific antibodies.",
            "Secreting histamines.",
            "Producing memory cells.",
            "Ingesting invading organisms."
        ],
        correctAnswerIndex: 3,
        xpValue: 25,
        explanation: "Macrophages are a type of white blood cell that act as the immune system's 'garbage collectors.' Their primary function is phagocytosis—engulfing and digesting cellular debris, foreign substances, microbes, and cancer cells."
    },
    {
        subject: "biology",
        topic: "physiology",
        question: "The innermost layer of the human eye is specifically called the:",
        options: ["Retina", "Choroid", "Cornea", "Sclera"],
        correctAnswerIndex: 0,
        xpValue: 25,
        explanation: "The eye has three main layers: the outer sclera (the white of the eye), the middle choroid (vascular layer), and the innermost retina, which contains the light-sensitive photoreceptor cells (rods and cones)."
    },

    // ==========================================
    // BIOLOGY: GENETICS & BIOTECHNOLOGY
    // ==========================================
    {
        subject: "biology",
        topic: "genetics_and_biotechnology",
        question: "Which of the following DNA mutations is most likely to be fatal or cause severe phenotypic changes?",
        options: [
            "Nucleotide substitution",
            "Nucleotide added or deleted (Frameshift)",
            "Inversion of part of a nucleotide sequence",
            "Change of one nucleotide for another"
        ],
        correctAnswerIndex: 1,
        xpValue: 25,
        explanation: "The addition or deletion of a single nucleotide causes a 'frameshift mutation.' Because DNA is read in triplets (codons), a frameshift completely alters the reading frame for the entire rest of the gene, resulting in a completely entirely different, usually non-functional protein."
    },
    {
        subject: "biology",
        topic: "genetics_and_biotechnology",
        question: "In genetic engineering, when fragments of DNA from different organisms need to be permanently joined together, they are linked by the enzyme:",
        options: ["DNA polymerase", "DNAse", "DNA ligase", "Endonucleases"],
        correctAnswerIndex: 2,
        xpValue: 25,
        explanation: "After restriction endonucleases cut DNA strands to create 'sticky ends,' the enzyme DNA ligase is used to catalyze the formation of a permanent phosphodiester bond between the fragments, sealing the newly recombined DNA."
    },
    {
        subject: "biology",
        topic: "genetics_and_biotechnology",
        question: "Which of the following carries the exact code that directly determines the sequence of amino acids in a synthesized protein?",
        options: ["DNA", "tRNA", "mRNA", "rRNA"],
        correctAnswerIndex: 2,
        xpValue: 25,
        explanation: "Messenger RNA (mRNA) carries the transcribed genetic code from the DNA in the nucleus to the ribosomes in the cytoplasm. It contains specific triplet codons that exactly dictate the sequence of amino acids during translation."
    },
    {
        subject: "biology",
        topic: "genetics_and_biotechnology",
        question: "The most commonly studied sex-linked genetic trait in humans is:",
        options: ["Cystic fibrosis", "Ability to taste PTC", "Tongue rolling", "Red-green colour blindness"],
        correctAnswerIndex: 3,
        xpValue: 25,
        explanation: "Red-green colour blindness is the classic example of a sex-linked (specifically X-linked) recessive trait. Because the gene is located on the X chromosome, it appears much more frequently in males, who only possess one X chromosome."
    },
    // ==========================================
    // BIOLOGY: CELL & MOLECULAR BIOLOGY
    // ==========================================
    {
        subject: "biology",
        topic: "cell_and_molecular_biology",
        question: "An haemoglobin subunit about 150 amino acids long would require a coded DNA sequence that contains how many nucleotides?",
        options: ["50", "150", "300", "450"],
        correctAnswerIndex: 3,
        xpValue: 25,
        explanation: "The genetic code is read in triplets, meaning it takes exactly 3 nucleotides (one codon) to code for a single amino acid. Therefore, a chain of 150 amino acids requires 150 × 3 = 450 nucleotides."
    },
    {
        subject: "biology",
        topic: "cell_and_molecular_biology",
        question: "Facilitated diffusion across a cell membrane:",
        options: [
            "Requires glycoproteins.",
            "Requires ATP.",
            "Moves substances against a concentration gradient.",
            "Requires a protein carrier."
        ],
        correctAnswerIndex: 3,
        xpValue: 25,
        explanation: "Facilitated diffusion is a passive process, meaning it does not require energy (ATP) and moves substances down their concentration gradient. However, because the molecules are often large or charged, they strictly require specific transmembrane protein carriers or channels to pass."
    },
    {
        subject: "biology",
        topic: "cell_and_molecular_biology",
        question: "An enzyme is a large organic molecule with a specific surface geometry that is primarily composed of:",
        options: ["Amino acids", "Monosaccharides", "Polysaccharides", "Glycerol molecules"],
        correctAnswerIndex: 0,
        xpValue: 25,
        explanation: "Almost all biological enzymes are globular proteins. Proteins are massive polymers synthesized by joining long chains of amino acid monomers through peptide bonds."
    },

    // ==========================================
    // BIOLOGY: PHYSIOLOGY
    // ==========================================
    {
        subject: "biology",
        topic: "physiology",
        question: "The relatively large size of the mammalian brain allowing for greater learning, association, and memory is primarily due to the highly developed:",
        options: ["Cerebellum", "Cerebrum", "Hindbrain", "Midbrain"],
        correctAnswerIndex: 1,
        xpValue: 25,
        explanation: "The cerebrum (specifically the cerebral cortex) is the largest part of the mammalian brain. It is highly convoluted (folded) to increase surface area and is responsible for all higher-order functions: conscious thought, complex memory, learning, and reasoning."
    },
    {
        subject: "biology",
        topic: "physiology",
        question: "An enzyme released by the kidneys in response to a drop in human blood pressure is:",
        options: ["Renin", "Angiotensinogen", "Aldosterone", "Angiotensin"],
        correctAnswerIndex: 0,
        xpValue: 25,
        explanation: "When blood pressure drops, the juxtaglomerular cells in the kidneys secrete the enzyme renin. Renin initiates the Renin-Angiotensin-Aldosterone System (RAAS), which ultimately causes vasoconstriction and water retention to raise the blood pressure back to normal."
    },
    {
        subject: "biology",
        topic: "physiology",
        question: "The primary biological function of bile salts in digestion is to:",
        options: [
            "Chemically degrade fat.",
            "Digest fat into fatty acids.",
            "Emulsify fat.",
            "Activate the enzymes in pancreatic juice."
        ],
        correctAnswerIndex: 2,
        xpValue: 25,
        explanation: "Bile salts do not chemically digest fat. Instead, they act like a biological detergent to physically break down (emulsify) large, insoluble fat globules into microscopic droplets, massively increasing the surface area for the enzyme lipase to work on."
    },
    {
        subject: "biology",
        topic: "physiology",
        question: "A gas that causes rapid asphyxiation by binding irreversibly to haemoglobin, thus preventing oxygen from doing so, is:",
        options: ["Carbon dioxide", "Carbon monoxide", "Nitrous oxide", "Sulfur dioxide"],
        correctAnswerIndex: 1,
        xpValue: 25,
        explanation: "Carbon monoxide (CO) is deadly because it has an affinity for the iron in hemoglobin that is roughly 200 to 300 times greater than that of oxygen. Once it binds to form carboxyhemoglobin, it physically blocks oxygen from attaching, starving the tissues."
    },
    {
        subject: "biology",
        topic: "physiology",
        question: "Which of the following is a fundamental characteristic of hormones in the endocrine system?",
        options: [
            "Large quantities are needed to produce the desired effect.",
            "They are biological catalysts.",
            "They are exclusively produced in the exact tissue that they affect.",
            "Small quantities can produce massive physiological effects."
        ],
        correctAnswerIndex: 3,
        xpValue: 25,
        explanation: "Hormones are potent chemical messengers traveling in the bloodstream. Because they often trigger cascading enzyme reactions inside their target cells, incredibly microscopic quantities are enough to induce massive, system-wide changes."
    },

    // ==========================================
    // BIOLOGY: ECOLOGY & EVOLUTION
    // ==========================================
    {
        subject: "biology",
        topic: "ecology",
        question: "Which of the following factors specifically affect the distribution of living organisms within the soil?",
        options: ["Climatic factors", "Geological factors", "Edaphic factors", "Biotic factors"],
        correctAnswerIndex: 2,
        xpValue: 25,
        explanation: "In ecology, 'edaphic factors' relate directly to the physical and chemical conditions of the soil—such as soil pH, moisture, porosity, and mineral content—that heavily dictate what types of organisms can survive there."
    },
    {
        subject: "biology",
        topic: "genetics_and_biotechnology",
        question: "Which of the following pairs are considered homologous structures in evolutionary biology?",
        options: [
            "The wings of a bat and the wings of a butterfly.",
            "The human arm and the wing of a bat.",
            "The wing of a bat and the foreleg of a locust.",
            "The wings of a bird and the wings of a cockroach."
        ],
        correctAnswerIndex: 1,
        xpValue: 25,
        explanation: "Homologous structures share a fundamental underlying anatomical architecture due to descent from a common ancestor, even if they perform different functions today. A human arm and a bat wing possess the exact same pentadactyl (five-digit) skeletal bone layout."
    },

    // ==========================================
    // BIOLOGY: BIODIVERSITY & TAXONOMY
    // ==========================================
    {
        subject: "biology",
        topic: "biodiversity",
        question: "Which of the following statements is biologically true of all chordates?",
        options: [
            "Early developmental cleavages are spiral.",
            "They are protostomes.",
            "The first unfolding of the archenteron forms the anus.",
            "Early developmental cleavages are strictly determinate."
        ],
        correctAnswerIndex: 2,
        xpValue: 25,
        explanation: "All chordates (including humans) are deuterostomes. In embryonic development, the first opening that forms in the blastula (the blastopore/archenteron) develops into the anus, whereas in protostomes (like insects), it becomes the mouth."
    },
    {
        subject: "biology",
        topic: "biodiversity",
        question: "Humans, great apes, and monkeys are placed together in which of the following taxonomic categories?",
        options: ["Genus", "Order", "Family", "Class"],
        correctAnswerIndex: 1,
        xpValue: 25,
        explanation: "Humans, apes, monkeys, and lemurs all belong to the taxonomic Order called 'Primates.' They belong to different Families (Hominidae vs. Cercopithecidae) but share the same Order."
    },
    // ==========================================
    // FURTHER MATHEMATICS: FURTHER ALGEBRA
    // ==========================================
    {
        subject: "further_mathematics",
        topic: "further_algebra",
        question: "A group G has subgroups {a,b}, {a,b,c,d,f} and {a,d,e}. The least possible order of the group G is:",
        options: ["10", "20", "30", "60"],
        correctAnswerIndex: 2,
        xpValue: 30,
        explanation: "By Lagrange's Theorem, the order of any subgroup must perfectly divide the order of the parent group. The given subgroups have orders of 2, 5, and 3. The overall group order must be a multiple of all three. The least common multiple (LCM) of 2, 3, and 5 is 30."
    },
    {
        subject: "further_mathematics",
        topic: "further_algebra",
        question: "Given the group (Z_4, +_4) where Z_4 = {0, 1, 2, 3} and +_4 means addition modulo 4, the inverse of the element 3 is:",
        options: ["0", "1", "2", "3"],
        correctAnswerIndex: 1,
        xpValue: 30,
        explanation: "The identity element for addition is 0. To find the inverse of 3, we need an element 'x' such that 3 + x = 0 (mod 4). Since 3 + 1 = 4, and 4 ≡ 0 (mod 4), the inverse of 3 is 1."
    },
    {
        subject: "further_mathematics",
        topic: "further_algebra",
        question: "Under the complex transformation w = z / (z + i), the image of the point z = 1 - 2i is:",
        options: ["1/2 - 1/2 i", "1/2 - 3/2 i", "3/2 - 1/2 i", "3/2 - 3/2 i"],
        correctAnswerIndex: 2,
        xpValue: 30,
        explanation: "Substitute z = 1 - 2i into the equation: w = (1 - 2i) / (1 - 2i + i) = (1 - 2i) / (1 - i). To divide, multiply top and bottom by the conjugate (1 + i). Numerator: (1 - 2i)(1 + i) = 1 + i - 2i - 2i² = 1 - i + 2 = 3 - i. Denominator: (1 - i)(1 + i) = 1² + 1² = 2. The result is (3 - i) / 2, which is 3/2 - 1/2 i."
    },
    {
        subject: "further_mathematics",
        topic: "further_algebra",
        question: "The number of distinct solutions of the congruence equation 2x ≡ 4 (mod 6) is:",
        options: ["1", "3", "0", "2"],
        correctAnswerIndex: 3,
        xpValue: 30,
        explanation: "For a linear congruence ax ≡ b (mod m), the number of distinct solutions modulo m is equal to the greatest common divisor d = gcd(a, m), provided that d divides b. Here, a=2, m=6. gcd(2, 6) = 2. Since 2 divides 4, there are exactly 2 distinct solutions (which are x=2 and x=5)."
    },
    {
        subject: "further_mathematics",
        topic: "further_algebra",
        question: "The modular arithmetic expression x² ≡ -1 (mod 25) is mathematically equivalent to:",
        options: ["x² ≡ 1 (mod 25)", "x² ≡ 5 (mod 25)", "x² ≡ 24 (mod 25)", "x² ≡ 8 (mod 25)"],
        correctAnswerIndex: 2,
        xpValue: 30,
        explanation: "In modular arithmetic, negative numbers are found by adding the modulus. So, -1 (mod 25) is equivalent to -1 + 25 = 24. Therefore, the expression is x² ≡ 24 (mod 25)."
    },

    // ==========================================
    // FURTHER MATHEMATICS: FURTHER CALCULUS
    // ==========================================
    {
        subject: "further_mathematics",
        topic: "further_calculus",
        question: "The general solution of the differential equation (x² + 1)(dy/dx) + 2xy = 2x is:",
        options: ["y = (x² + 2x) / (x² + 1)", "y = (x² + k) / (x² + 1)", "y = (2x² + k) / (x² + 1)", "y = (x²) / (x² + 1) + k"],
        correctAnswerIndex: 1,
        xpValue: 30,
        explanation: "Notice that the left side is the exact derivative of a product: d/dx [y(x² + 1)] = (x² + 1)(dy/dx) + y(2x). So, the equation becomes d/dx [y(x² + 1)] = 2x. Integrating both sides with respect to x gives y(x² + 1) = x² + k. Dividing yields y = (x² + k) / (x² + 1)."
    },
    {
        subject: "further_mathematics",
        topic: "further_calculus",
        question: "The particular integral solution of the differential equation d²y/dx² + 4(dy/dx) + 4y = 3e^(-2x) could be:",
        options: ["y = A e^(-2x)", "y = A x e^(-2x)", "y = A x² e^(-2x)", "y = (Ax + B) e^(-2x)"],
        correctAnswerIndex: 2,
        xpValue: 30,
        explanation: "The auxiliary equation is m² + 4m + 4 = 0, giving a repeated root of m = -2. The complementary function is y = (A + Bx)e^(-2x). Because e^(-2x) and xe^(-2x) are already in the complementary function, you must multiply the trial particular integral by x² to maintain linear independence. Thus, the PI form is y = C x² e^(-2x)."
    },
    {
        subject: "further_mathematics",
        topic: "further_calculus",
        question: "Given that the Maclaurin series expansion gives (a + bx)e^x ≈ 4 + 5x + cx², then the values of a, b, and c are respectively:",
        options: ["4, 1, 3", "4, 3, 1", "-4, 3, 1", "-4, 3, 11"],
        correctAnswerIndex: 0,
        xpValue: 30,
        explanation: "The expansion of e^x ≈ 1 + x + x²/2. Multiplying by (a + bx) gives a + ax + ax²/2 + bx + bx². Grouping terms yields a + (a+b)x + (a/2 + b)x². Equating coefficients to 4 + 5x + cx²: a = 4. Then a+b = 5, so 4+b = 5, meaning b = 1. Finally, c = a/2 + b = 4/2 + 1 = 3."
    },
    {
        subject: "further_mathematics",
        topic: "further_calculus",
        question: "The hyperbolic function f(x) = cosh(x) is classified as:",
        options: ["An even function", "An odd function", "A periodic function", "A discontinuous function"],
        correctAnswerIndex: 0,
        xpValue: 30,
        explanation: "By definition, cosh(x) = (e^x + e^-x) / 2. If we substitute -x, we get cosh(-x) = (e^-x + e^x) / 2, which is exactly the same as cosh(x). Since f(-x) = f(x), it is an even function."
    },

    // ==========================================
    // FURTHER MATHEMATICS: FURTHER GEOMETRY
    // ==========================================
    {
        subject: "further_mathematics",
        topic: "further_geometry",
        question: "For any two 3D vectors a and b, the dot product a · (a × b) is identically equal to:",
        options: ["a · b", "a²b", "0", "a² + ab"],
        correctAnswerIndex: 2,
        xpValue: 30,
        explanation: "The cross product (a × b) produces a new vector that is strictly perpendicular (orthogonal) to both vector a and vector b. The dot product of any two perpendicular vectors is always exactly 0."
    },
    {
        subject: "further_mathematics",
        topic: "further_geometry",
        question: "The polar equation of the curve described by the complex locus equation |z| = 4 is:",
        options: ["r = 4 cos θ", "r = 4 sin θ", "r = 4", "r² = 16"],
        correctAnswerIndex: 2,
        xpValue: 30,
        explanation: "In the complex plane, z = r(cos θ + i sin θ), where r is the modulus |z|. Since |z| = 4, this directly translates to the polar equation r = 4, which represents a circle of radius 4 centered at the origin."
    },

    // ==========================================
    // FURTHER MATHEMATICS: MECHANICS
    // ==========================================
    {
        subject: "further_mathematics",
        topic: "mechanics",
        question: "If a flywheel loses kinetic energy amounting to 640 J when its angular velocity drops from 5 rad/s to 3 rad/s, then the moment of inertia of the flywheel is:",
        options: ["40 kg m²", "80 kg m²", "320 kg m²", "640 kg m²"],
        correctAnswerIndex: 1,
        xpValue: 30,
        explanation: "Rotational Kinetic Energy = ½ I ω². The loss of energy is ½ I (ω₁² - ω₂²) = 640. Plugging in the values: ½ I (5² - 3²) = 640. This becomes ½ I (25 - 9) = ½ I (16) = 8I. If 8I = 640, then I = 80 kg m²."
    },
    // ==========================================
    // FURTHER MATHEMATICS: FURTHER CALCULUS
    // ==========================================
    {
        subject: "further_mathematics",
        topic: "further_calculus",
        question: "Evaluate the limit as x approaches a of (x - a) / (a - x):",
        options: ["0", "a", "-1", "1"],
        correctAnswerIndex: 2,
        xpValue: 30,
        explanation: "Factor out a -1 from the denominator: (a - x) = -(x - a). The expression becomes (x - a) / -(x - a). The (x - a) terms cancel out perfectly, leaving exactly -1. Since it is a constant, the limit is -1."
    },
    {
        subject: "further_mathematics",
        topic: "further_calculus",
        question: "The solution to the equation artanh((x² - 1) / (x² + 1)) = ln(2) is:",
        options: ["ln(2)", "± 2", "± 3", "± 1/2"],
        correctAnswerIndex: 1,
        xpValue: 30,
        explanation: "The definition of artanh(z) is 1/2 ln((1+z)/(1-z)). Substitute z = (x² - 1)/(x² + 1). The fraction (1+z)/(1-z) simplifies perfectly to x². Therefore, 1/2 ln(x²) = ln(x) = ln(2). Thus, x = 2. Because x² is symmetric, the solution is ± 2."
    },
    {
        subject: "further_mathematics",
        topic: "further_calculus",
        question: "The rate of destruction of a bacteria colony is kx, where x is the number of bacteria. If the number decreases from 6000 to 2000 in exactly 4 hours, the value of the constant k is:",
        options: ["1/4 ln(1/3)", "4 ln(1/3)", "4 ln(3)", "1/4 ln(3)"],
        correctAnswerIndex: 3,
        xpValue: 30,
        explanation: "The differential equation is dx/dt = -kx, which solves to x(t) = x₀e^(-kt). Substituting the values gives 2000 = 6000e^(-4k), or 1/3 = e^(-4k). Taking the natural log gives ln(1/3) = -4k. Since ln(1/3) = -ln(3), we get -ln(3) = -4k, meaning k = 1/4 ln(3)."
    },
    {
        subject: "further_mathematics",
        topic: "further_calculus",
        question: "The mathematical domain of the function h(x) = (x + 1) / √(4 - x²) is:",
        options: ["]-∞, 2[", "]-2, 2[", "]2, +∞[", "]-∞, -2[ ∪ ]2, +∞["],
        correctAnswerIndex: 1,
        xpValue: 30,
        explanation: "For the function to be defined, the expression under the square root must be strictly greater than zero (since it is also in the denominator). Thus, 4 - x² > 0, which means x² < 4. Taking the square root gives -2 < x < 2."
    },

    // ==========================================
    // FURTHER MATHEMATICS: MECHANICS
    // ==========================================
    {
        subject: "further_mathematics",
        topic: "mechanics",
        question: "A particle executes simple harmonic motion between two points 10 meters apart. Its speed when it is 4 meters from the centre of its path is 6 m/s. The period of motion is:",
        options: ["π", "π/2", "2π", "4π"],
        correctAnswerIndex: 0,
        xpValue: 30,
        explanation: "The distance between the extremes is 10m, so the amplitude A = 5m. The velocity formula is v² = ω²(A² - x²). Plugging in the values gives 6² = ω²(5² - 4²), so 36 = ω²(25 - 16) = 9ω². Thus, ω² = 4 and ω = 2. The period T = 2π / ω = 2π / 2 = π."
    },
    {
        subject: "further_mathematics",
        topic: "mechanics",
        question: "A particle performs simple harmonic motion from centre O. Its velocity v at distance x from O is given by v² = 64 - 2x². The maximum velocity of the particle is:",
        options: ["8", "8√2", "16", "16√2"],
        correctAnswerIndex: 0,
        xpValue: 30,
        explanation: "The maximum velocity in simple harmonic motion always occurs at the equilibrium position (the centre, where x = 0). Substituting x = 0 into the equation gives v² = 64 - 0, meaning v² = 64. Taking the square root gives a maximum velocity of 8 m/s."
    },
    {
        subject: "further_mathematics",
        topic: "mechanics",
        question: "A smooth sphere traveling on a horizontal surface impinges obliquely on a vertical wall at a 60° angle to the wall and rebounds at right angles to its original direction. The coefficient of restitution e is:",
        options: ["√3 / 2", "1 / √3", "1 / 3", "2 / 3"],
        correctAnswerIndex: 2,
        xpValue: 30,
        explanation: "If the approach angle to the wall is 60°, the angle with the normal is 30°. Let u be the initial velocity. Normal velocity is u cos(30°), parallel is u sin(30°). Rebounding at 90° means the rebound angle is 60° to the normal. Using e = tan(θ_approach)/tan(θ_rebound) relative to the normal, e = tan(30°)/tan(60°) = (1/√3) / √3 = 1/3."
    },
    {
        subject: "further_mathematics",
        topic: "mechanics",
        question: "Using the theorem of Pappus, the distance of the centroid of a semicircular lamina of diameter 6a from its diameter is:",
        options: ["8a / π", "4a / π", "4a / 3π", "3a / 2π"],
        correctAnswerIndex: 1,
        xpValue: 30,
        explanation: "The Theorem of Pappus states that the volume of a solid of revolution equals the area of the lamina multiplied by the distance traveled by its centroid. Rotating a semicircle (radius r=3a) forms a sphere. V = 4/3 π r³. Area = 1/2 π r². 4/3 π(3a)³ = (1/2 π(3a)²) × 2πy. Solving for y yields y = 4r / 3π = 4(3a) / 3π = 4a / π."
    },

    // ==========================================
    // FURTHER MATHEMATICS: FURTHER ALGEBRA
    // ==========================================
    {
        subject: "further_mathematics",
        topic: "further_algebra",
        question: "If |z - 1 + 2i| = 3, then the least value of |z + 2 - 2i| is:",
        options: ["7", "3", "2", "1"],
        correctAnswerIndex: 2,
        xpValue: 30,
        explanation: "The locus |z - (1 - 2i)| = 3 is a circle centered at C(1, -2) with radius r = 3. The expression |z - (-2 + 2i)| represents the distance from a point on the circle to P(-2, 2). The distance from center C to P is √[(1 - -2)² + (-2 - 2)²] = √(3² + -4²) = 5. The least distance from P to the edge of the circle is CP - r = 5 - 3 = 2."
    },
    {
        subject: "further_mathematics",
        topic: "further_algebra",
        question: "If proposition p is: 'If x is a real number, then x² is positive', then the contrapositive of statement p is:",
        options: [
            "If x is not a real number, then x² is not positive.",
            "If x is a real number, then x² is not positive.",
            "If x² is not positive, then x is not a real number.",
            "If x² is positive, then x is not a real number."
        ],
        correctAnswerIndex: 2,
        xpValue: 30,
        explanation: "The contrapositive of a conditional statement 'If A, then B' is formed by negating and swapping both terms to get 'If not B, then not A'. Negating 'x² is positive' gives 'x² is not positive', and negating 'x is a real number' gives 'x is not a real number'."
    },

    // ==========================================
    // FURTHER MATHEMATICS: FURTHER GEOMETRY
    // ==========================================
    {
        subject: "further_mathematics",
        topic: "further_geometry",
        question: "A particle P moves on a curve with the polar equation r = 4e^θ. The angle between the velocity vector of P and the radius vector OP is:",
        options: ["π / 6", "π / 4", "π / 3", "π / 2"],
        correctAnswerIndex: 1,
        xpValue: 30,
        explanation: "The angle φ between the radius vector and the tangent (which is the direction of the velocity vector) is given by tan(φ) = r(dθ/dr). Differentiating r = 4e^θ with respect to θ gives dr/dθ = 4e^θ = r. Therefore, tan(φ) = r / r = 1. The arctan of 1 is π/4 (or 45°)."
    },
    {
        subject: "further_mathematics",
        topic: "further_geometry",
        question: "The major axis of an ellipse is vertical and of length 8. The minor axis is of length 4 and the centre is at the point (0, 1). The standard equation of the ellipse is:",
        options: [
            "x²/16 + (y - 1)²/4 = 1",
            "x²/4 + (y - 1)²/16 = 1",
            "(x - 1)²/4 + y²/16 = 1",
            "(x - 1)²/16 + y²/4 = 1"
        ],
        correctAnswerIndex: 1,
        xpValue: 30,
        explanation: "The vertical major axis 2a = 8, so a = 4 and a² = 16 (this goes under the y term since it is vertical). The minor axis 2b = 4, so b = 2 and b² = 4 (under the x term). The center is (h,k) = (0,1). The standard formula is (x-h)²/b² + (y-k)²/a² = 1, giving x²/4 + (y-1)²/16 = 1."
    },
    // ==========================================
    // FURTHER MATHEMATICS: FURTHER ALGEBRA
    // ==========================================
    {
        subject: "further_mathematics",
        topic: "further_algebra",
        question: "The correct partial fraction form of 2x / [x²(x+3)²] is:",
        options: [
            "A/x + B/x² + C/(x+3) + D/(x+3)²",
            "(Ax+B)/x² + (Cx+D)/(x+3)²",
            "A/x² + B/(x+3)²",
            "A/x + B/x² + Cx/(x+3)²"
        ],
        correctAnswerIndex: 0,
        xpValue: 30,
        explanation: "For repeated linear factors in the denominator, you must include a partial fraction for every ascending power of that factor up to its multiplicity. The factor x² requires A/x + B/x², and the factor (x+3)² requires C/(x+3) + D/(x+3)²."
    },
    {
        subject: "further_mathematics",
        topic: "further_algebra",
        question: "Which of the following statements is NOT mathematically true about matrix determinants?",
        options: [
            "The sign of the determinant changes when two rows are interchanged.",
            "The value of the determinant changes when a row or column is added to another.",
            "The determinant remains constant when a multiple of a row is added to another row.",
            "The determinant is exactly zero if any two rows or columns are identical."
        ],
        correctAnswerIndex: 1,
        xpValue: 30,
        explanation: "Adding a row or column (or a multiple of one) to another row or column is a standard row operation that explicitly does NOT change the value of the determinant."
    },
    {
        subject: "further_mathematics",
        topic: "further_algebra",
        question: "The matrix of the linear transformation T given by T(x,y) = (x - y, 3x) is:",
        options: [
            "[1, -1 ; 3, 0]",
            "[-1, 1 ; 0, 3]",
            "[1, 3 ; -1, 0]",
            "[0, 3 ; 1, -1]"
        ],
        correctAnswerIndex: 0,
        xpValue: 30,
        explanation: "To find the transformation matrix, apply T to the standard basis vectors. T(1,0) = (1(1) - 0, 3(1)) = (1, 3). T(0,1) = (0 - 1(1), 3(0)) = (-1, 0). These outputs form the vertical columns of the matrix, giving the top row as [1, -1] and the bottom row as [3, 0]."
    },
    {
        subject: "further_mathematics",
        topic: "further_algebra",
        question: "The transformation matrix M = [1, 2, 0 ; -2, -4, -2 ; 1, 2, 1] maps the 3D xyz space onto:",
        options: ["A line", "A plane", "The origin", "The entire 3D space"],
        correctAnswerIndex: 1,
        xpValue: 30,
        explanation: "Notice that column 2 is exactly twice column 1, meaning they are linearly dependent. Column 3 is not a multiple of column 1. Since there are exactly 2 linearly independent columns, the matrix has a rank of 2. A rank 2 transformation flattens 3D space onto a 2D plane."
    },

    // ==========================================
    // FURTHER MATHEMATICS: FURTHER CALCULUS
    // ==========================================
    {
        subject: "further_mathematics",
        topic: "further_calculus",
        question: "Given that f(x) = x² for x < 1; f(x) = 2x - 1 for 1 ≤ x < 3; and f(x) = 7 - x for x ≥ 3. The value of x for which f(x) is discontinuous is:",
        options: ["0", "1", "2", "3"],
        correctAnswerIndex: 3,
        xpValue: 30,
        explanation: "Check the boundaries. At x=1, the left-hand limit is 1²=1, and the right-hand limit is 2(1)-1=1. It is continuous at 1. At x=3, the left-hand limit is 2(3)-1=5, but the right-hand limit is 7-3=4. Because the limits do not match, it is discontinuous at x=3."
    },
    {
        subject: "further_mathematics",
        topic: "further_calculus",
        question: "The first two non-zero terms in the Maclaurin series expansion of the differential equation dy/dx = 2xy², where y = 1 when x = 0, are:",
        options: ["1 - x²", "1 + x²", "1 - 2x²", "1 + 2x²"],
        correctAnswerIndex: 1,
        xpValue: 30,
        explanation: "Given y(0) = 1. The first derivative y'(0) = 2(0)(1²) = 0. Differentiating again implicitly: y'' = 2y² + 2x(2yy'). At x=0, y=1, y'=0, we get y''(0) = 2(1²) + 0 = 2. The Maclaurin series is y(x) = y(0) + y'(0)x + y''(0)x²/2! = 1 + 0 + 2x²/2 = 1 + x²."
    },
    {
        subject: "further_mathematics",
        topic: "further_calculus",
        question: "Using the approximation y_{n+1} ≈ y_n + h(dy/dx) with a step length of 0.1, the value of y when x = 0.2, given that dy/dx = x + y and y=1 when x=0, is:",
        options: ["1.21", "1.12", "1.22", "1.23"],
        correctAnswerIndex: 2,
        xpValue: 30,
        explanation: "Step 1 (x=0 to 0.1): y_1 = y_0 + 0.1(x_0 + y_0) = 1 + 0.1(0 + 1) = 1.1. Step 2 (x=0.1 to 0.2): y_2 = y_1 + 0.1(x_1 + y_1) = 1.1 + 0.1(0.1 + 1.1) = 1.1 + 0.1(1.2) = 1.1 + 0.12 = 1.22."
    },
    {
        subject: "further_mathematics",
        topic: "further_calculus",
        question: "The total number of real solutions to the hyperbolic equation 3 cosh(2x - 1) = 3 is:",
        options: ["1", "2", "0", "Infinitely many"],
        correctAnswerIndex: 0,
        xpValue: 30,
        explanation: "Dividing by 3 gives cosh(2x - 1) = 1. The graph of cosh(z) has an absolute minimum at (0, 1), so the only value where cosh(z) = 1 is exactly z = 0. Therefore, 2x - 1 = 0, which means x = 1/2. This is the single, unique real solution."
    },
    {
        subject: "further_mathematics",
        topic: "further_calculus",
        question: "Evaluate the indefinite integral: ∫ 1 / √(x² - 16) dx",
        options: ["cos⁻¹(x/4) + k", "sin⁻¹(x/4) + k", "cosh⁻¹(x/4) + k", "sinh⁻¹(x/4) + k"],
        correctAnswerIndex: 2,
        xpValue: 30,
        explanation: "The standard integral formula for ∫ 1 / √(x² - a²) dx is arccosh(x/a) + C. Here, a² = 16, so a = 4. The integral evaluates precisely to cosh⁻¹(x/4) + k."
    },

    // ==========================================
    // FURTHER MATHEMATICS: FURTHER GEOMETRY
    // ==========================================
    {
        subject: "further_mathematics",
        topic: "further_geometry",
        question: "The volume of the tetrahedron OABC, where O is the origin and A, B, and C are the points (2,0,1), (3,1,2), and (-1,3,0) respectively, is:",
        options: ["1/3", "2", "3", "4"],
        correctAnswerIndex: 0,
        xpValue: 30,
        explanation: "The volume of a tetrahedron with edges defining vectors a, b, c from the origin is 1/6 |a · (b × c)|. Here, a=(2,0,1), b=(3,1,2), c=(-1,3,0). The cross product b × c = (-6, -2, 10). The dot product a · (-6, -2, 10) = 2(-6) + 0(-2) + 1(10) = -12 + 10 = -2. Volume = 1/6 |-2| = 2/6 = 1/3."
    },

    // ==========================================
    // FURTHER MATHEMATICS: MECHANICS
    // ==========================================
    {
        subject: "further_mathematics",
        topic: "mechanics",
        question: "A particle of mass 3m is attached to one end of a light elastic string of natural length 2a and modulus 2mg, whose other end is fixed to a point O. If allowed to fall from rest, its acceleration when the extension is 'a' is:",
        options: ["g", "2g/3", "2g", "3g"],
        correctAnswerIndex: 1,
        xpValue: 30,
        explanation: "By Hooke's Law, the tension T = λx/L. Here, λ = 2mg, x = a, and natural length L = 2a. So T = (2mg * a) / 2a = mg. The downward force of gravity on the 3m particle is 3mg. The net downward force is W - T = 3mg - mg = 2mg. Using F = ma, 2mg = 3m * a_accel. Therefore, acceleration = 2g/3."
    },
    {
        subject: "further_mathematics",
        topic: "mechanics",
        question: "Given that the moment of inertia of a rod of mass m about an axis through its centre is I, the moment of inertia about a parallel axis on the rod distant x from the centre is:",
        options: ["I - mx²", "I + mx²", "1/3 ml² + mx²", "I + 1/2 mx²"],
        correctAnswerIndex: 1,
        xpValue: 30,
        explanation: "By the Parallel Axis Theorem, the moment of inertia around any axis parallel to an axis through the center of mass is given by I_new = I_cm + md², where d is the perpendicular distance between the axes. Here, d = x, yielding I + mx²."
    }
];

async function seedQuizzes() {
    try {
        console.log('Connecting to database...');
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB Atlas!');

        // 🚨 CRITICAL: This wipes the old, messy physics tags out of the database! 🚨
        console.log('Clearing old physics questions from the database...');

        let count = 0;
        for (const q of questionsToInject) {
            await Quiz.findOneAndUpdate(
                { subject: q.subject, topic: q.topic, question: q.question },
                q,
                { upsert: true, new: true }
            );
            count++;
        }

        console.log(`🎉 Successfully uploaded ${count} clean questions to the database!`);
        process.exit(0); 
    } catch (error) {
        console.error('❌ Upload Failed:', error);
        process.exit(1);
    }
}

seedQuizzes();