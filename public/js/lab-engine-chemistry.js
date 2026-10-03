/**
 * ==========================================================================
 * MOHACADEMY ADVANCED CHEMISTRY SIMULATION ROUTER
 * Volumetric (Titration) Dynamic Engine - Local Router Override Edition
 * ==========================================================================
 */

let globalExperimentBlueprint = null;

// ==========================================
// STATE MANAGEMENT MATRIX
// ==========================================
let titrationState = {
    buretVol: 0.00,       
    flaskVol: 25.0,       
    flowRate: 0,          
    endpointVol: 24.50,   
    isFlowing: false,
    animId: null,
    lastTick: 0,
    currentPhaseIndex: 0 // Tracks which indicator phase we are on
};

// MULTI-EXPERIMENT LOCAL ROUTER
// This bypasses the database to guarantee the correct layout loads instantly.
function getFallbackBlueprint(code) {
    if (code === 'ABT:02') {
        return {
            title: "ABT. 2: Standardisation of Sodium Hydroxide using Sulphamic Acid",
            instructions: [
                "Weigh accurately between 2.30 g and 2.40 g of Sulphamic acid; dissolve it in distilled water and make up to the mark.",
                "Using a suitably rinsed pipette, transfer 25 cm³ of the Sulphamic acid solution to a 250-cm³ conical flask.",
                "Add 2-3 drops of phenolphthalein indicator and titrate with Solution A (NaOH). Record the results of two careful titrations."
            ],
            simulationSettings: {
                engineType: "chem_titration",
                flaskColorStart: "rgba(200, 215, 230, ", // Colorless
                flaskColorEnd: "rgba(255, 20, 147, "     // Pink
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
            ]
        };
    } else if (code === 'ABT:03') {
        return {
            title: "ABT. 3: Determine the Concentration of a Diluted Solution of Hydrochloric Acid using Sodium Carbonate",
            instructions: [
                "Accurately weigh between 2.55 g and 2.60 g of anhydrous Sodium Carbonate, dissolve in distilled water and make up to 250 cm³ in a volumetric flask.",
                "Using a pipette, place 25 cm³ of Solution B (HCl) in a 250-cm³ volumetric flask and dilute to the mark.",
                "Pipette 25 cm³ of the Sodium Carbonate solution to a 250-cm³ conical flask. Add 2-3 drops of methyl orange.",
                "Titrate with the diluted Solution B to the end-point. Record the results."
            ],
            simulationSettings: {
                engineType: "chem_titration",
                flaskColorStart: "rgba(255, 215, 0, ", // Yellow
                flaskColorEnd: "rgba(255, 69, 0, "     // Orange-Red
            },
            tableStructure: {
                headers: ["Titration Phase", "Second Burette reading", "First Burette reading", "Titre/cm³"],
                rows: [
                    { label: "Approximate", keys: ["rough_f", "rough_i", "rough_t"] },
                    { label: "Accurate I", keys: ["acc1_f", "acc1_i", "acc1_t"] },
                    { label: "Accurate II", keys: ["acc2_f", "acc2_i", "acc2_t"] }
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
            ]
        };
    } else if (code === 'ABT:04') {
        return {
            title: "ABT. 4: Standardization of HCl using Aqueous Na₂CO₃ and Determination of Acetic Acid Content",
            instructions: [
                "1. Using a pipette place 50.0 cm³ of Solution A (HCl) in a 250-cm³ volumetric flask and make up to the mark.",
                "2. Pipette 25.0 cm³ of Solution B (Na₂CO₃) into a conical flask. Add methyl orange. Titrate with diluted HCl (Record in Table 1).",
                "3. Discard the content of the volumetric flask and burette, wash and rinse.",
                "4. Transfer 1.5 cm³ of acetic acid into a 250-cm³ volumetric flask. Make up to the mark (Diluted ethanoic acid).",
                "5. Pipette 25.0 cm³ of diluted acetic acid into a conical flask. Add phenolphthalein. Titrate with Solution C (NaOH) (Record in Table 2)."
            ],
            simulationSettings: {
                engineType: "chem_titration",
                flaskColorStart: "rgba(255, 215, 0, ",  
                flaskColorEnd: "rgba(255, 69, 0, "      
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
            ]
        };
    } else if (code === 'ABT:05') {
        return {
            title: "ABT. 5: Standardization of HCl using Borax and Determination of NaOH Concentration",
            instructions: [
                "1. Weigh accurately between 4.75 g and 4.85 g of Borax. Dissolve in distilled water and make up to 250 cm³ in a volumetric flask.",
                "2. Pipette 25 cm³ of the Borax solution into a conical flask. Add methyl orange and titrate with Solution E (HCl) to end-point.",
                "3. Pipette 25 cm³ of Solution F (NaOH) into a conical flask. Add phenolphthalein and titrate with Solution E (HCl) to end-point."
            ],
            simulationSettings: {
                engineType: "chem_titration",
                flaskColorStart: "rgba(255, 215, 0, ", 
                flaskColorEnd: "rgba(255, 69, 0, "     
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
            ]
        };
        } else if (code === 'ABT:06') {
        return {
            title: "ABT. 6: Standardization of HCl using Borax & Determination of NaOH/Na₂CO₃ Mixture",
            instructions: [
                "1. Weigh accurately between 4.90 - 4.95 g of borax. Dissolve in distilled water and make up to the 250 cm³ mark in a volumetric flask.",
                "2. Pipette 25 cm³ of the borax to a conical flask. Add methyl orange and titrate with HCl(aq). (Record in Table 2).",
                "3. Pipette 25 cm³ of Solution Y (mixture) to a conical flask. Add methyl orange and titrate with HCl(aq). (Record in Table 3).",
                "4. Pipette 25 cm³ of Solution Y, warm to 70°C, and add 10% BaCl₂(aq) dropwise until no further precipitate is formed. Cool, add phenolphthalein, and titrate with HCl(aq). (Record in Table 4)."
            ],
            simulationSettings: {
                engineType: "chem_titration",
                phases: [
                    { name: "Table 2: Borax vs HCl (Methyl Orange)", start: "rgba(255, 215, 0, ", end: "rgba(255, 69, 0, " },
                    { name: "Table 3: Solution Y vs HCl (Methyl Orange)", start: "rgba(255, 215, 0, ", end: "rgba(255, 69, 0, " },
                    { name: "Table 4: Ppt Solution Y vs HCl (Phenolphthalein)", start: "rgba(255, 20, 147, ", end: "rgba(200, 215, 230, " }
                ]
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
            ]
        };
        } else if (code === 'ABT:07') {
        return {
            title: "ABT. 7: Determination of the Dissociation Constant of KHSO₄ and Ethanoic Acid",
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
                ]
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
            ]
        };
        } else if (code === 'ABT:08') {
        return {
            title: "ABT. 8: Standardization of NaOH using Oxalic Acid and Determination of Basicity",
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
                ]
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
            ]
        };
        } else if (code === 'ABT:09') {
        return {
            title: "ABT. 9: Standardization of Acid & Determination of pH of Mixtures",
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
                ]
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
            ]
        };
        } else if (code === 'ABT:10') {
        return {
            title: "ABT. 10: Standardization of NaOH & Determination of RMM of a Dibasic Acid",
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
                ]
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
            ]
        };
        } else if (code === 'RT:01') {
        return {
            title: "RT. 1: Standardisation of Potassium Permanganate by Sodium Oxalate",
            instructions: [
                "1. Weigh accurately between 1.65 g to 1.75 g of Sodium Oxalate. Dissolve in distilled water in a 250 cm³ volumetric flask and make up to the mark.",
                "2. Pipette 25 cm³ of this solution into a conical flask. Add 15 cm³ of dilute Sulphuric acid.",
                "3. Heat the mixture to about 70°C and titrate the hot solution with Solution R (KMnO₄) to the end-point (permanent pale pink coloration)."
            ],
            simulationSettings: {
                engineType: "chem_titration",
                flaskColorStart: "rgba(240, 248, 255, ", 
                flaskColorEnd: "rgba(255, 182, 193, ",
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
            ]
        };
    } else if (code === 'RT:02') {
        return {
            title: "RT. 2: Standardisation of Potassium Dichromate using Ammonium Iron (II) Sulphate",
            instructions: [
                "1. Weigh out accurately between 0.74 g and 0.84 g of Potassium Dichromate (K₂Cr₂O₇). Dissolve and make up to 250 cm³ in a volumetric flask.",
                "2. Pipette 25 cm³ of the Fe(NH₄)₂(SO₄)₂·6H₂O solution into a conical flask.",
                "3. Add 15 cm³ of dilute sulphuric acid to the conical flask.",
                "4. Titrate the mixture against K₂Cr₂O₇ solution from the burette to a permanent pale green coloration."
            ],
            simulationSettings: {
                engineType: "chem_titration",
                flaskColorStart: "rgba(240, 248, 255, ", 
                flaskColorEnd: "rgba(143, 188, 143, ",
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
            ]
        };
    } else if (code === 'RT:03') {
        return {
            title: "RT. 3: Standardisation of KMnO₄ & Determination of Ethanedioic Acid",
            instructions: [
                "1. Weigh 4.80 - 4.85 g of ammonium iron (II) sulphate. Dissolve in dilute H₂SO₄ and make up to 250 cm³ in a volumetric flask.",
                "2. Pipette 25 cm³ of the iron (II) solution to a conical flask, add 20 cm³ dilute H₂SO₄, and titrate with KMnO₄ to a pale pink color (Record in Table 1).",
                "3. Pipette 25 cm³ of oxalic acid into a conical flask, add 20 cm³ dilute H₂SO₄, heat to 70°C, and titrate with KMnO₄ to a pale pink color (Record in Table 2)."
            ],
            simulationSettings: {
                engineType: "chem_titration",
                phases: [
                    { name: "Table 1: Iron (II) Sulphate vs KMnO₄", start: "rgba(240, 248, 255, ", end: "rgba(255, 182, 193, " },
                    { name: "Table 2: Oxalic Acid vs KMnO₄", start: "rgba(240, 248, 255, ", end: "rgba(255, 182, 193, " }
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
            ]
        };
    } else if (code === 'RT:04') {
        return {
            title: "RT. 4: Standardize Permanganate & Determine Concentration of Ammonium Iron (II) Sulphate",
            instructions: [
                "1. Accurately weigh between 1.60 g and 1.80 g of sodium oxalate, dissolve and make up to 250 cm³ in a volumetric flask.",
                "2. Pipette 25 cm³ of the oxalate solution, add 15 cm³ dilute H₂SO₄, heat to 70°C, and titrate with Solution P (KMnO₄). (Record in Table 2).",
                "3. Pipette 25 cm³ of Solution Q (Fe²⁺), add 15 cm³ dilute H₂SO₄, and titrate with Solution P (KMnO₄). (Record in Table 3)."
            ],
            simulationSettings: {
                engineType: "chem_titration",
                phases: [
                    { name: "Table 2: Sodium Oxalate vs KMnO₄", start: "rgba(240, 248, 255, ", end: "rgba(255, 182, 193, " },
                    { name: "Table 3: Solution Q (Fe²⁺) vs KMnO₄", start: "rgba(240, 248, 255, ", end: "rgba(255, 182, 193, " }
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
            ]
        };
        } else if (code === 'RT:05') {
        return {
            title: "RT. 5: Standardisation of Sodium Thiosulphate using Dichromate",
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
            ]
        };
    } else if (code === 'RT:06') {
        return {
            title: "RT. 6: Standardisation of Thiosulphate (via Peroxodisulphate) and KMnO₄ (via Ethanedioate)",
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
            ]
        };
    } else if (code === 'RT:07') {
        return {
            title: "RT. 7: Standardisation of Copper (II) Sulphate using Sodium Thiosulphate",
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
            ]
        };
    } else if (code === 'RT:08') {
        return {
            title: "RT. 8: Standardisation of Sodium Thiosulphate using Potassium Iodate (V)",
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
            ]
        };
    } else if (code === 'RT:09') {
        return {
            title: "RT. 9: Determination of Oxalic Acid & Sodium Oxalate Mixture",
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
            ]
        };
    } else if (code === 'RT:10') {
        return {
            title: "RT. 10: Standardisation of Sodium Sulphite using Potassium Iodate",
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
            ]
        };
        } else if (code === 'PT:01') {
        return {
            title: "PT. 1: Standardization of Silver Nitrate using Potassium Chloride",
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
            ]
        };
    } else if (code === 'PT:02') {
        return {
            title: "PT. 2: Standardization of Hydrochloric Acid using Aqueous Silver Nitrate",
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
            ]
        };
    } else if (code === 'CT:01') {
        return {
            title: "CT. 1: Determination of the Total Hardness of Water by Complexometric Titration",
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
            ]
        };
    } else if (code === 'CT:02') {
        return {
            title: "CT. 2: Standardisation of Magnesium Sulphate Solution using Aqueous EDTA",
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
            ]
        };
        } else if (code === 'EN:01') {
        return {
            title: "EN. 1: Determine the Enthalpy Change of Sodium Carbonate & HCl",
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
            ]
        };
        } else if (code === 'EN:02') {
        return {
            title: "EN. 2: Enthalpy Change of Neutralization (Continuous Variation)",
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
            ]
        };
        } else if (code === 'EN:03') {
        return {
            title: "EN. 3: Determination of the Enthalpy of Solution of an Organic Compound",
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
            ]
        };
        } else if (code === 'EN:04') {
        return {
            title: "EN. 4: Determination of the Enthalpy of Solution of Sodium Thiosulphate Pentahydrate",
            instructions: [
                "1. Weigh accurately between 6.10 g and 6.25 g of solid C and record the mass in Table 1.",
                "2. (CALORIMETRY): Place 50 cm³ of distilled water into a plastic cup. Measure temp every 0.5 min. At 3.5 mins add solid C. Stir and record temps from minute 4 to 7 (Table 2).",
                "3. Transfer solution C into a 250 cm³ volumetric flask and make up to the mark.",
                "4. (TITRATION): Pipette 25 cm³ of solution D (K₂Cr₂O₇), add 25 cm³ dilute H₂SO₄ and 10 cm³ of KI. Titrate with solution C until pale yellow. Add starch, titrate to bluish-green. (Table 3)."
            ],
            simulationSettings: {
                engineType: "chem_hybrid_en4",
                isEndothermic: true, 
                flaskColorStart: "rgba(139, 69, 19, ", 
                flaskColorEnd: "rgba(0, 128, 128, ",   
                preLabBriefing: "Welcome to the Hybrid Lab! This experiment is broken into two physical stations.<br><br><b>Station 1 (Calorimetry):</b> You will dissolve Solid C in water. This is an endothermic reaction, so the temperature will DROP.<br><br><b>Station 2 (Titration):</b> You will use your dissolved Solid C (Thiosulphate) to titrate Iodine generated by Dichromate. The flask starts dark brown, fades to pale yellow, and upon adding starch, will turn dark blue before ending at a <b>Bluish-Green</b> endpoint.<br><br><b>Weighing Data:</b><br>&bull; Mass of bottle + Solid C: <b>16.15 g</b><br>&bull; Mass of bottle alone: <b>10.00 g</b><br><br><b>Notice:</b> You must fill out both Table 2 (Calorimetry) and Table 3 (Titration) below."
            },
            tableStructure: [
                {
                    title: "TABLE 2: Calorimetry Data",
                    headers: ["Time / min", "0.0", "0.5", "1.0", "1.5", "2.0", "2.5", "3.0", "3.5"],
                    rows: [
                        { label: "Temp / °C (Baseline)", keys: ["temp_0", "temp_05", "temp_10", "temp_15", "temp_20", "temp_25", "temp_30", "temp_35_xxx"] },
                        { label: "Time / min", keys: ["time_40", "time_45", "time_50", "time_55", "time_60", "time_65", "time_70", "blank"] },
                        { label: "Temp / °C (Reaction)", keys: ["temp_40", "temp_45", "temp_50", "temp_55", "temp_60", "temp_65", "temp_70", "blank2"] }
                    ]
                },
                {
                    title: "TABLE 3: Titration Data",
                    headers: ["Burette Readings", "Approximate", "Accurate 1", "Accurate 2"],
                    rows: [
                        { label: "2nd burette reading / cm³", keys: ["titre_rough_f", "titre_acc1_f", "titre_acc2_f"] },
                        { label: "1st reading / cm³", keys: ["titre_rough_i", "titre_acc1_i", "titre_acc2_i"] },
                        { label: "Titre / cm³", keys: ["titre_rough_t", "titre_acc1_t", "titre_acc2_t"] }
                    ]
                }
            ],
            calculationsBlock: [
                { id: "delta_t", label: "From the graph, determine the temperature change (ΔT) accompanying the dissolution:" },
                { id: "enthalpy", label: "1. Calculate the standard enthalpy of solution of solid C in water (RMM = 248.0):" },
                { id: "molarity_d", label: "2. Calculate the molarity of solution D using your titration data:" }
            ]
        };
        } else if (code === 'EN:05') {
        return {
            title: "EN. 5: Determination of the Enthalpy of Reaction between Zinc Powder and Aqueous Copper (II) Sulphate",
            instructions: [
                "1. Weigh accurately between 1.26 g and 1.31 g of zinc powder and record the mass in Table 1.",
                "2. By means of a suitably rinsed burette, place 50.0 cm³ of solution M into a plastic cup. Record the temperature of solution M every half minutes in Table 2.",
                "3. At exactly minute 3 ½, with the thermometer still in the plastic cup, tip-in all of the metal powder into the plastic cup and stir gently with the thermometer taking the temperature every half minute from minute 4 to 7."
            ],
            simulationSettings: {
                engineType: "chem_thermo",
                isEndothermic: false,
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
            ]
        };
        } else if (code === 'EN:06') {
        return {
            title: "EN. 6: Determination of Enthalpy of Hydration of Copper (II) Sulphate (Hess's Law)",
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
            ]
        };
        } else if (code === 'EN:07') {
        return {
            title: "EN. 7: Standardization of NaOH and Enthalpy Change of Neutralization",
            instructions: [
                "1. Weigh 5.0 g - 5.1 g oxalic acid, dissolve and make up to 250 cm³ in a volumetric flask.",
                "2. (TITRATION): Pipette 25 cm³ of the aqueous oxalic acid and titrate with Solution R (NaOH) using phenolphthalein. (Record in Table 1).",
                "3. (CALORIMETRY): Place 45.0 cm³ of Solution R in a cup. Place 5.0 cm³ Solution S (HCl) in a second burette. Measure temp of R, add S, stir, and measure highest temp. (Experiment 1).",
                "4. Repeat for experiments 2 to 6 using the quantities shown in Table 2."
            ],
            simulationSettings: {
                engineType: "chem_hybrid_en7",
                flaskColorStart: "rgba(240, 248, 255, ", 
                flaskColorEnd: "rgba(255, 20, 147, ",   
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
            ]
        };
        } else if (code === 'CK:01') {
        return {
            title: "CK. 1: Effect of Temperature on the Rate of Reaction (KMnO₄ & Oxalic Acid)",
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
            ]
        };
        } else if (code === 'CK:02') {
        return {
            title: "CK. 2: Kinetics of Reaction Between Dilute HCl and Hydrated Sodium Thiosulphate",
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
            ]
        };
        } else if (code === 'CK:03') {
        return {
            title: "CK. 3: Reaction Between Sulphite Ions, Hydrogen Ions and Iodate Ions",
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
            ]
        };
        } else if (code === 'CK:04') {
        return {
            title: "CK. 4: Determination of the Order of Reaction Between Peroxodisulphate and Iodide",
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
            ]
        };
        } else if (code === 'CK:05') {
        return {
            title: "CK. 5: Determination of the Order of a Reaction Between Iodine and Acetone",
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
            ]
        };
    } else if (code === 'CK:06') {
        return {
            title: "CK. 6: Effect of Temperature on the Rate of Reaction Between Magnesium and HCl",
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
            ]
        };
        } else if (code === 'QA:01') {
        return {
            title: "QA. 1: Practical Exercise (Test for Cations) - Salts A, B, C, D",
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
            ]
        };
        } else if (code === 'QA:02') {
        return {
            title: "QA. 2: Identification of Inorganic Salts (Exercise 1) - Salts A, B, C",
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
            ]
        };
        } else if (code === 'QA:03') {
        return {
            title: "QA. 3: Identification of Inorganic Salts (Exercise 2) - Salts D, E, F",
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
            ]
        };
        } else if (code === 'QA:04') {
        return {
            title: "QA. 4: Identification of Inorganic Salts (Exercise 3) - Salts G, H, I, J",
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
            ]
        };
        } else if (code === 'QA:05') {
        return {
            title: "QA. 5: Identification of Inorganic Salts (Exercise 4) - Salts K, L, M",
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
            ]
        };
    } else if (code === 'QA:06') {
        return {
            title: "QA. 6: Identification of Inorganic Salts (Exercise 5) - Salts N, O, P",
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
            ]
        };
        } else if (code === 'QA:07') {
        return {
            title: "QA. 7: Organic Compounds (Exercise 1) - Alcohols Q, R, S",
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
            ]
        };
        } else if (code === 'QA:08') {
        return {
            title: "QA. 8: Organic Compounds (Exercise 2) - Aldehydes & Ketones T, U, V",
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
            ]
        };
        } else if (code === 'QA:08_EX3') {
        return {
            title: "QA. 9: Organic Compounds (Exercise 3) - Solids W, X, Y",
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
            ]
        };
        } else if (code === 'QA:09') {
        return {
            title: "QA. 9: Organic Compounds (Exercise 4) - Compounds AA, BB, CC",
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
            ]
        };
    } else if (code === 'QA:10') {
        return {
            title: "QA. 10: Chemistry of Amines, Amides, Amino Acids (Exercise 5) - DD, EE, FF",
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
            ]
        };
    } else if (code === 'QA:11') {
        return {
            title: "QA. 11: Chemistry of Carbohydrates (Exercise 6) - JJ, KK, LL",
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
            ]
        };
    
    }
    
    // Default fallback is ABT:01
    return {
        title: "ABT. 1: Standardisation of dilute HCl acid using 0.1M NaOH solution",
        instructions: [
            "Wash all your glassware with tap water and rinse with distilled water.",
            "Rinse and fill a clean burette with the dilute HCl acid.",
            "Rinse a clean 25-cm³ pipette with sodium hydroxide solution and pipette 25 cm³ of the base into a clean 250 ml conical flask.",
            "Add 2 - 3 drops of phenolphthalein indicator to the base. Titrate with the HCl acid until the permanent disappearance of the pink colour.",
            "Record the results of one approximate and two accurate titrations in the table below."
        ],
        simulationSettings: {
            engineType: "chem_titration",
            flaskColorStart: "rgba(255, 20, 147, ", 
            flaskColorEnd: "rgba(200, 215, 230, "   
        },
        tableStructure: {
            headers: ["Burette readings/cm³", "Approximate", "Accurate I", "Accurate II"],
            rows: [
              { label: "2nd burette reading", keys: ["rough_f", "acc1_f", "acc2_f"] },
              { label: "1st burette reading", keys: ["rough_i", "acc1_i", "acc2_i"] },
              { label: "Titre/cm³", keys: ["rough_t", "acc1_t", "acc2_t"] }
            ]
        },
        calculationsBlock: [
            { id: "mean_titre", label: "Mean titre/cm³:" },
            { id: "calc_a", label: "a) Write a balanced chemical equation for the reaction." },
            { id: "calc_b", label: "b) Calculate the molarity of the dilute HCl acid." },
            { id: "calc_c", label: "c) Calculate the concentration of the dilute HCl acid in gdm⁻³." }
        ]
    };
    
}

document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    
    if (id) {
        loadLabBlueprint(id);
    } else {
        console.warn("No ID provided. Loading default ABT:01 blueprint.");
        globalExperimentBlueprint = getFallbackBlueprint('ABT:01');
        setTimeout(setupLabWorkspace, 100); 
    }
});

async function loadLabBlueprint(code) {
    try {
        const res = await fetch(`/api/labs/${code}`);
        
        if (!res.ok) throw new Error("Experiment not found in database.");
        
        let data = await res.json();
        const fallback = getFallbackBlueprint(code);
        
        // Check if database data is incomplete. If it is, patch it with the local router.
        if (!data.tableStructure || Object.keys(data.tableStructure).length === 0) {
            data.tableStructure = fallback.tableStructure;
        }
        if (!data.calculationsBlock || data.calculationsBlock.length === 0) {
            data.calculationsBlock = fallback.calculationsBlock;
        }
        if (!data.simulationSettings || !data.simulationSettings.flaskColorStart) {
            data.simulationSettings = { ...fallback.simulationSettings, ...data.simulationSettings };
        }
        
        globalExperimentBlueprint = data;
        setupLabWorkspace();

    } catch (err) {
        console.error("Database fetch failed, overriding with Local Router:", err.message);
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
                <span style="background:#2ecc71; color:#0f172a; font-weight:800; padding:2px 8px; border-radius:4px; font-size:0.85rem; flex-shrink:0;">${idx+1}</span>
                <p style="margin:0; color:#cbd5e1; font-size:0.9rem; line-height:1.5;">${step}</p>
            </div>
        `;
    });

    const engine = globalExperimentBlueprint.simulationSettings?.engineType;

    // 1. TITRATION ROUTE
    if (engine && engine.startsWith('chem_titration')) {
        buildDynamicReportUI(globalExperimentBlueprint);
        titrationState.endpointVol = 23.50 + (Math.random() * 2.00); 
        renderTitrationWorkspace();
        
        if (globalExperimentBlueprint.simulationSettings.preLabBriefing) {
            showPreLabBriefing('#2ecc71');
        }
    } 
    // 2. THERMOCHEMISTRY ROUTE
    else if (engine && engine.startsWith('chem_thermo')) {
        buildDynamicReportUI(globalExperimentBlueprint);
        
        if (engine === 'chem_thermo_series') {
            renderThermoSeriesWorkspace();
        } else if (engine === 'chem_thermo_crystallization') {
            renderThermoCrystWorkspace(); 
        } else if (engine === 'chem_thermo_hess') {
            renderThermoHessWorkspace(); // NEW ROUTE FOR EN. 6
        } else {
            renderThermoWorkspace();
        }
        
        if (globalExperimentBlueprint.simulationSettings.preLabBriefing) {
            showPreLabBriefing('#e28743');
        }
    } 
    // 3. HYBRID ROUTE (EN. 4)
    else if (engine === 'chem_hybrid_en4') {
        buildDynamicReportUI(globalExperimentBlueprint);
        renderHybridEN4Workspace(); 
        
        if (globalExperimentBlueprint.simulationSettings.preLabBriefing) {
            showPreLabBriefing('#8e44ad');
        }
    }
    else if (engine && engine.startsWith('chem_hybrid_en7')) {
        buildDynamicReportUI(globalExperimentBlueprint);
        renderHybridEN7Workspace(); // Custom toggle UI
        
        if (globalExperimentBlueprint.simulationSettings.preLabBriefing) {
            const overlay = document.createElement('div');
            overlay.style.cssText = "position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(15, 23, 42, 0.9); display: flex; justify-content: center; align-items: center; z-index: 9999; backdrop-filter: blur(5px);";
            overlay.innerHTML = `
                <div style="background: #1e293b; padding: 30px; border-radius: 12px; max-width: 550px; text-align: center; border: 2px solid #8e44ad;">
                    <h2 style="color: #8e44ad; margin-top: 0; margin-bottom: 15px; font-family: 'Poppins';"><i class="fas fa-random"></i> Lab Assistant Briefing</h2>
                    <div style="color: #cbd5e1; font-size: 1.05rem; line-height: 1.6; text-align: left; margin-bottom: 25px; padding: 15px; background: #0f172a; border-radius: 8px; border-left: 4px solid #8e44ad;">
                        ${globalExperimentBlueprint.simulationSettings.preLabBriefing}
                    </div>
                    <button onclick="this.parentElement.parentElement.remove()" style="background: #8e44ad; color: #fff; border: none; padding: 12px 30px; font-weight: bold; border-radius: 6px; cursor: pointer; font-size: 1.1rem; font-family: 'Poppins'; transition: 0.2s;">Acknowledge & Begin</button>
                </div>
            `;
            document.body.appendChild(overlay);
        }
    }   
    // 4. KINETICS ROUTE (Rates of Reaction)
    else if (engine && engine.startsWith('chem_kinetics')) {
        buildDynamicReportUI(globalExperimentBlueprint);
        
        if (engine === 'chem_kinetics_ck1') {
            renderKineticsCK1Workspace();
        } else if (engine === 'chem_kinetics_ck2') {
            renderKineticsCK2Workspace(); // NEW ROUTE FOR DISAPPEARING CROSS
        } else if (engine === 'chem_kinetics_ck3') {
            renderKineticsCK3Workspace(); // NEW ROUTE FOR IODINE CLOCK
        } else if (engine === 'chem_kinetics_ck4') {
            renderKineticsCK4Workspace(); // NEW ROUTE FOR MAGNETIC STIRRER
        } else if (engine === 'chem_kinetics_ck5') {
            renderKineticsCK5Workspace(); // NEW ROUTE: Fading Blue-Black
        } else if (engine === 'chem_kinetics_ck6') {
            renderKineticsCK6Workspace(); // NEW ROUTE: Dissolving Magnesium
        }
        
        if (globalExperimentBlueprint.simulationSettings.preLabBriefing) {
            const overlay = document.createElement('div');
            overlay.style.cssText = "position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(15, 23, 42, 0.9); display: flex; justify-content: center; align-items: center; z-index: 9999; backdrop-filter: blur(5px);";
            overlay.innerHTML = `
                <div style="background: #1e293b; padding: 30px; border-radius: 12px; max-width: 550px; text-align: center; border: 2px solid #9b59b6;">
                    <h2 style="color: #9b59b6; margin-top: 0; margin-bottom: 15px; font-family: 'Poppins';"><i class="fas fa-stopwatch"></i> Lab Assistant Briefing</h2>
                    <div style="color: #cbd5e1; font-size: 1.05rem; line-height: 1.6; text-align: left; margin-bottom: 25px; padding: 15px; background: #0f172a; border-radius: 8px; border-left: 4px solid #9b59b6;">
                        ${globalExperimentBlueprint.simulationSettings.preLabBriefing}
                    </div>
                    <button onclick="this.parentElement.parentElement.remove()" style="background: #9b59b6; color: #fff; border: none; padding: 12px 30px; font-weight: bold; border-radius: 6px; cursor: pointer; font-size: 1.1rem; font-family: 'Poppins'; transition: 0.2s;">Acknowledge & Begin</button>
                </div>
            `;
            document.body.appendChild(overlay);
        }
    }     
    // 5. QUALITATIVE ANALYSIS ROUTE (Test Tubes & Reagents)
    else if (engine && engine.startsWith('chem_qualitative')) {
        buildDynamicReportUI(globalExperimentBlueprint);
        
        if (engine === 'chem_qualitative_advanced') {
            renderQualitativeAdvancedWorkspace(); // NEW ROUTE
        } else {
            renderQualitativeWorkspace();
        }
        
        if (globalExperimentBlueprint.simulationSettings.preLabBriefing) {
            const overlay = document.createElement('div');
            overlay.style.cssText = "position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(15, 23, 42, 0.9); display: flex; justify-content: center; align-items: center; z-index: 9999; backdrop-filter: blur(5px);";
            overlay.innerHTML = `
                <div style="background: #1e293b; padding: 30px; border-radius: 12px; max-width: 550px; text-align: center; border: 2px solid #f39c12;">
                    <h2 style="color: #f39c12; margin-top: 0; margin-bottom: 15px; font-family: 'Poppins';"><i class="fas fa-vials"></i> Lab Assistant Briefing</h2>
                    <div style="color: #cbd5e1; font-size: 1.05rem; line-height: 1.6; text-align: left; margin-bottom: 25px; padding: 15px; background: #0f172a; border-radius: 8px; border-left: 4px solid #f39c12;">
                        ${globalExperimentBlueprint.simulationSettings.preLabBriefing}
                    </div>
                    <button onclick="this.parentElement.parentElement.remove()" style="background: #f39c12; color: #0f172a; border: none; padding: 12px 30px; font-weight: bold; border-radius: 6px; cursor: pointer; font-size: 1.1rem; font-family: 'Poppins'; transition: 0.2s;">Acknowledge & Begin</button>
                </div>
            `;
            document.body.appendChild(overlay);
        }
    }
}

// Helper to clean up popup code
function showPreLabBriefing(color) {
    const overlay = document.createElement('div');
    overlay.style.cssText = "position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(15, 23, 42, 0.9); display: flex; justify-content: center; align-items: center; z-index: 9999; backdrop-filter: blur(5px);";
    overlay.innerHTML = `
        <div style="background: #1e293b; padding: 30px; border-radius: 12px; max-width: 550px; text-align: center; border: 2px solid ${color};">
            <h2 style="color: ${color}; margin-top: 0; margin-bottom: 15px; font-family: 'Poppins';"><i class="fas fa-flask"></i> Lab Assistant Briefing</h2>
            <div style="color: #cbd5e1; font-size: 1.05rem; line-height: 1.6; text-align: left; margin-bottom: 25px; padding: 15px; background: #0f172a; border-radius: 8px; border-left: 4px solid ${color};">
                ${globalExperimentBlueprint.simulationSettings.preLabBriefing}
            </div>
            <button onclick="this.parentElement.parentElement.remove()" style="background: ${color}; color: #fff; border: none; padding: 12px 30px; font-weight: bold; border-radius: 6px; cursor: pointer; font-size: 1.1rem; font-family: 'Poppins'; transition: 0.2s;">Acknowledge & Begin</button>
        </div>
    `;
    document.body.appendChild(overlay);
}

/**
 * ==========================================================================
 * DYNAMIC FORM BUILDER
 * ==========================================================================
 */
/**
 * ==========================================================================
 * DYNAMIC FORM BUILDER (SUPPORTS MULTIPLE TABLES)
 * ==========================================================================
 */
function buildDynamicReportUI(blueprint) {
    const container = document.getElementById('dynamic-data-table-container');
    if (!container) return;

    let html = '';

    // Normalize to an array so we can support 1 table (like ABT:01) or multiple (like EN:04)
    let tablesToRender = [];
    if (Array.isArray(blueprint.tableStructure)) {
        tablesToRender = blueprint.tableStructure;
    } else if (blueprint.tableStructure) {
        tablesToRender = [blueprint.tableStructure];
    }

    tablesToRender.forEach(table => {
        if (table && table.rows) {
            html += `<div style="width: 100%; overflow-x: auto; background: #0f172a; border-radius: 8px; border: 1px solid #334155; margin-bottom: 20px;">
                        <table style="width: 100%; min-width: 600px; border-collapse: collapse; font-family: 'Lato', sans-serif;">`;
            
            if (table.title) {
                html += `<thead><tr><th colspan="100%" style="background: #1e293b; color: #eebf4d; padding: 10px; text-align: center; border-bottom: 2px solid #334155; font-family: 'Poppins'; font-size: 0.95rem;">${table.title}</th></tr></thead>`;
            }

            if (table.headers) {
                html += `<thead><tr>`;
                table.headers.forEach(header => {
                    html += `<th style="background: #1e293b; color: #2ecc71; padding: 14px; text-align: center; border-bottom: 2px solid #334155; border-right: 1px solid #334155; font-family: 'Poppins'; text-transform: uppercase; font-size: 0.85rem;">${header}</th>`;
                });
                html += `</tr></thead>`;
            }

            html += `<tbody>`;
            table.rows.forEach(row => {
                html += `<tr><td style="font-weight: bold; color: #cbd5e1; padding: 12px; border-bottom: 1px solid #334155; border-right: 1px solid #334155; text-align: left;">${row.label}</td>`;
                row.keys.forEach(key => {
                    html += `<td style="padding: 12px; border-bottom: 1px solid #334155; border-right: 1px solid #334155; text-align: center;">
                                <input type="text" data-key="${key}" class="sim-input" placeholder="-" style="width: 100%; padding: 10px; box-sizing: border-box; background: #161b22; color: #fff; border: 1px solid #475569; border-radius: 4px; text-align: center; font-family: 'Poppins'; font-weight: 600; outline: none;">
                             </td>`;
                });
                html += `</tr>`;
            });
            html += `</tbody></table></div>`;
        }
    });

    if (blueprint.calculationsBlock && blueprint.calculationsBlock.length > 0) {
        html += `<div style="display: flex; flex-direction: column; gap: 15px; padding-top: 15px; border-top: 2px solid #14532d;">`;
        blueprint.calculationsBlock.forEach(calc => {
            if (calc.label.toLowerCase().includes("equation") || calc.label.toLowerCase().includes("calculate")) {
                html += `
                    <div style="width: 100%; display: flex; flex-direction: column; gap: 5px;">
                        <label style="color: #2ecc71; font-weight:bold; font-family: 'Poppins'; font-size: 0.9rem;">${calc.label}</label>
                        <textarea id="${calc.id}" rows="3" placeholder="Show your working here..." style="width:100%; border-radius:6px; background:#161b22; color:#fff; padding:12px; border:1px solid #475569; font-family:'Poppins'; resize:vertical; outline:none; box-sizing: border-box;"></textarea>
                    </div>
                `;
            } else {
                html += `
                    <div style="width: 100%; display: flex; flex-direction: column; gap: 5px;">
                        <label style="color: #2ecc71; font-weight:bold; font-family: 'Poppins'; font-size: 0.9rem;">${calc.label}</label>
                        <input type="text" id="${calc.id}" placeholder="Enter final value..." style="width:100%; border-radius:6px; background:#161b22; color:#fff; padding:12px; border:1px solid #475569; font-family:'Poppins'; outline:none; box-sizing: border-box;">
                    </div>
                `;
            }
        });
        html += `</div>`;
    }

    container.innerHTML = html;
}

/**
 * ==========================================================================
 * HIGH-FIDELITY TITRATION CANVAS SIMULATOR
 * ==========================================================================
 */
function renderTitrationWorkspace() {
    let phaseSelectorHTML = '';
    const settings = globalExperimentBlueprint.simulationSettings;
    
    // Check if this experiment has multiple phases
    if (settings && settings.phases) {
        let options = settings.phases.map((p, i) => `<option value="${i}">${p.name}</option>`).join('');
        phaseSelectorHTML = `
            <div style="margin-bottom: 15px; background: #0f172a; padding: 10px; border-radius: 6px; border: 1px solid #2ecc71;">
                <label style="color:#fff; font-size:0.8rem; font-weight:bold; display:block; margin-bottom:8px; text-align:center;"><i class="fas fa-exchange-alt"></i> Select Titration Phase</label>
                <select id="indicator-selector" onchange="window.changeIndicatorPhase()" style="width:100%; padding:8px; background:#1e293b; color:#2ecc71; border:1px solid #475569; border-radius:4px; font-family:'Poppins'; font-weight:bold; outline:none; cursor:pointer;">
                    ${options}
                </select>
            </div>
        `;
    }

    document.getElementById('simulation-render-target').innerHTML = `
        <div class="sim-container-row">
            <div class="sim-controls-col">
                <div style="background: #161b22; padding: 15px; border-radius: 8px; border: 2px solid #30363d; text-align: center; margin-bottom: 15px;">
                    <div style="color:#8b949e; font-size:0.8rem; margin-bottom:5px; font-family:'Orbitron';">DIGITAL VOLUME LOG (cm³)</div>
                    <div class="lcd-screen" id="buret-lcd" style="color: #2ecc71; font-size: 3rem; background: #000; padding: 10px; border-radius: 6px;">0.00</div>
                </div>

                ${phaseSelectorHTML}

                <div style="background: #1e293b; padding: 15px; border-radius: 8px; border: 1px solid #334155;">
                    <label style="color:#fff; font-size:0.9rem; font-weight:bold; display:block; margin-bottom:12px; text-align:center;">Burette Tap Control</label>
                    <button id="btn-flow-fast" onclick="window.setTitrationSpeed('fast')" style="width:100%; margin-bottom:8px; background:#475569; color:#fff; border:none; padding:12px; border-radius:6px; font-weight:bold; cursor:pointer; transition: 0.2s;"><i class="fas fa-water"></i> Open Tap (Fast Pour)</button>
                    <button id="btn-flow-slow" onclick="window.setTitrationSpeed('drop')" style="width:100%; margin-bottom:8px; background:#475569; color:#fff; border:none; padding:12px; border-radius:6px; font-weight:bold; cursor:pointer; transition: 0.2s;"><i class="fas fa-tint"></i> Open Tap (Drop by Drop)</button>
                    <button id="btn-flow-stop" onclick="window.setTitrationSpeed('stop')" style="width:100%; margin-bottom:15px; background:#ef4444; color:#fff; border:none; padding:12px; border-radius:6px; font-weight:bold; cursor:pointer; transition: 0.2s;"><i class="fas fa-hand-paper"></i> Close Tap</button>
                    
                    <button onclick="window.resetTitrationFlask()" style="width:100%; background:#f59e0b; color:#000; border:none; padding:12px; border-radius:6px; font-weight:bold; cursor:pointer; transition: 0.2s;"><i class="fas fa-flask"></i> Empty Flask & Refill Burette</button>
                </div>
            </div>

            <div class="sim-canvas-col">
                <canvas id="canvas-titration" width="450" height="420"></canvas>
            </div>
        </div>
    `;
    
    titrationLoop();
}

window.changeIndicatorPhase = function() {
    let el = document.getElementById('indicator-selector');
    if(el) {
        titrationState.currentPhaseIndex = parseInt(el.value);
        window.resetTitrationFlask(); 
    }
};

window.setTitrationSpeed = function(speed) {
    if (speed === 'fast') {
        titrationState.isFlowing = true; titrationState.flowRate = 1.5; 
        document.getElementById('btn-flow-fast').style.background = '#3b82f6';
        document.getElementById('btn-flow-slow').style.background = '#475569';
    } else if (speed === 'drop') {
        titrationState.isFlowing = true; titrationState.flowRate = 0.15; 
        document.getElementById('btn-flow-fast').style.background = '#475569';
        document.getElementById('btn-flow-slow').style.background = '#3b82f6';
    } else {
        titrationState.isFlowing = false; titrationState.flowRate = 0;
        document.getElementById('btn-flow-fast').style.background = '#475569';
        document.getElementById('btn-flow-slow').style.background = '#475569';
    }
    titrationState.lastTick = performance.now();
};

window.resetTitrationFlask = function() {
    window.setTitrationSpeed('stop');
    titrationState.buretVol = 0.00;
    titrationState.flaskVol = 25.0;
    titrationState.endpointVol = 23.50 + (Math.random() * 2.00); 
};

function getFlaskColor(addedVolume) {
    const settings = globalExperimentBlueprint.simulationSettings;
    let startRGB = "rgba(255, 20, 147, "; 
    let endRGB = "rgba(200, 215, 230, ";    

    // Read colors dynamically based on current phase
    if (settings && settings.phases && settings.phases.length > titrationState.currentPhaseIndex) {
        startRGB = settings.phases[titrationState.currentPhaseIndex].start;
        endRGB = settings.phases[titrationState.currentPhaseIndex].end;
    } else if (settings) {
        startRGB = settings.flaskColorStart || startRGB;
        endRGB = settings.flaskColorEnd || endRGB;
    }

    let diff = titrationState.endpointVol - addedVolume;

    if (diff > 0.5) {
        return startRGB + "0.4)"; 
    } else if (diff > 0 && diff <= 0.5) {
        let alpha = 0.4 * (diff / 0.5); 
        return startRGB + alpha + ")";
    } else {
        return endRGB + "0.15)"; 
    }
}

function titrationLoop() {
    const canvas = document.getElementById('canvas-titration');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0,0, canvas.width, canvas.height);

    if (titrationState.isFlowing && titrationState.buretVol < 50.0) {
        const now = performance.now();
        let dt = (now - titrationState.lastTick) / 1000;
        titrationState.buretVol += (titrationState.flowRate * dt);
        titrationState.flaskVol += (titrationState.flowRate * dt);
        titrationState.lastTick = now;
        
        if (titrationState.buretVol >= 50.0) {
            titrationState.buretVol = 50.0;
            window.setTitrationSpeed('stop');
        }
    }

    document.getElementById('buret-lcd').innerText = titrationState.buretVol.toFixed(2);

    const cx = 150; 

    // --- 1. DRAW STAND & CLAMP ---
    let standGrad = ctx.createLinearGradient(cx-80, 0, cx-60, 0);
    standGrad.addColorStop(0, '#334155'); standGrad.addColorStop(0.5, '#94a3b8'); standGrad.addColorStop(1, '#1e293b');
    ctx.fillStyle = standGrad; ctx.fillRect(cx-75, 20, 12, 380); 

    let baseGrad = ctx.createLinearGradient(0, 390, 0, 410);
    baseGrad.addColorStop(0, '#475569'); baseGrad.addColorStop(1, '#0f172a');
    ctx.fillStyle = baseGrad; ctx.fillRect(cx-100, 390, 160, 15);  

    ctx.fillStyle = '#64748b'; ctx.fillRect(cx-65, 140, 50, 12);  
    ctx.beginPath(); ctx.arc(cx-15, 146, 8, 0, Math.PI*2); ctx.fillStyle='#1e293b'; ctx.fill(); 

    // --- DETERMINE DYNAMIC BURETTE COLOR ---
    let bColor = "186, 230, 253"; // Default pale blue for clear liquids
    const settings = globalExperimentBlueprint.simulationSettings;
    if (settings) {
        if (settings.phases && settings.phases[titrationState.currentPhaseIndex] && settings.phases[titrationState.currentPhaseIndex].buretColor) {
            bColor = settings.phases[titrationState.currentPhaseIndex].buretColor;
        } else if (settings.buretColor) {
            bColor = settings.buretColor;
        }
    }

    // --- 2. DRAW BURETTE ---
    const pxPerCm3 = 240 / 50.0;
    const buretTop = 20;
    const buretBottom = 260;
    const buretFluidY = buretTop + (titrationState.buretVol * pxPerCm3);

    ctx.fillStyle = 'rgba(241, 245, 249, 0.5)';
    ctx.fillRect(cx-12, buretTop, 24, 240);

    ctx.fillStyle = `rgba(${bColor}, 0.7)`; // Dynamic burette fluid color
    ctx.fillRect(cx-11, buretFluidY, 22, buretBottom - buretFluidY);
    
    ctx.beginPath(); ctx.ellipse(cx, buretFluidY, 11, 3, 0, 0, Math.PI*2);
    ctx.fillStyle = `rgba(${bColor}, 0.9)`; ctx.fill(); ctx.strokeStyle = 'rgba(0,0,0,0.3)'; ctx.lineWidth=1; ctx.stroke();

    ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(cx-12, buretTop); ctx.lineTo(cx-12, buretBottom); ctx.lineTo(cx-3, buretBottom+20); ctx.lineTo(cx-3, buretBottom+40); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx+12, buretTop); ctx.lineTo(cx+12, buretBottom); ctx.lineTo(cx+3, buretBottom+20); ctx.lineTo(cx+3, buretBottom+40); ctx.stroke();
    
    ctx.fillStyle = 'rgba(255,255,255,0.4)'; ctx.fillRect(cx-8, buretTop, 4, 240);

    ctx.fillStyle = '#334155'; ctx.fillRect(cx-15, buretBottom+25, 30, 10); 
    ctx.fillStyle = '#ef4444'; ctx.beginPath(); ctx.roundRect(cx-25, buretBottom+23, 10, 14, 3); ctx.fill();

    ctx.fillStyle = '#0f172a'; ctx.font = '10px Arial'; ctx.textAlign='right';
    for(let i=0; i<=50; i++) {
        let ty = buretTop + (i * pxPerCm3);
        ctx.beginPath(); ctx.moveTo(cx-12, ty);
        if (i%5===0) { ctx.lineTo(cx-4, ty); ctx.lineWidth=1.5; ctx.stroke(); ctx.fillText(i, cx-16, ty+4); } 
        else { ctx.lineTo(cx-8, ty); ctx.lineWidth=0.5; ctx.stroke(); }
    }

    // --- 3. DRAW ANIMATED DRIPS ---
    if (titrationState.isFlowing) {
        ctx.fillStyle = `rgba(${bColor}, 0.9)`; // Dynamic drip color
        if (titrationState.flowRate > 0.5) {
            ctx.fillRect(cx-1.5, buretBottom+40, 3, 50); 
        } else {
            let dropY = buretBottom+40 + ((performance.now() * 0.3) % 50);
            ctx.beginPath(); ctx.ellipse(cx, dropY, 2, 4, 0, 0, Math.PI*2); ctx.fill(); 
        }
    }

    // --- 4. DRAW PHOTOREALISTIC CONICAL FLASK ---
    let flaskY = 385; 
    let neckY = 320;
    
    let maxFlaskVol = 100.0;
    let fillRatio = Math.min(titrationState.flaskVol / maxFlaskVol, 1.0);
    let fluidH = fillRatio * 65; 
    let fluidTopY = flaskY - fluidH;
    
    let fluidRadius = 45 - (fillRatio * (45 - 15));
    let flaskColor = getFlaskColor(titrationState.buretVol);

    ctx.beginPath(); ctx.ellipse(cx, flaskY, 45, 10, 0, 0, Math.PI*2);
    ctx.fillStyle = flaskColor; ctx.fill();

    ctx.beginPath();
    ctx.moveTo(cx - 45, flaskY);
    ctx.lineTo(cx - fluidRadius, fluidTopY);
    ctx.lineTo(cx + fluidRadius, fluidTopY);
    ctx.lineTo(cx + 45, flaskY);
    ctx.fill();

    ctx.beginPath(); ctx.ellipse(cx, fluidTopY, fluidRadius, fluidRadius*0.2, 0, 0, Math.PI*2);
    ctx.fillStyle = flaskColor; ctx.fill();
    
    ctx.strokeStyle = 'rgba(255,255,255,0.4)'; ctx.lineWidth = 1;
    let swirl = Math.sin(performance.now() / 150) * (fluidRadius/3);
    ctx.beginPath(); ctx.ellipse(cx + swirl, fluidTopY, fluidRadius*0.4, fluidRadius*0.1, 0, 0, Math.PI*2); ctx.stroke();

    ctx.strokeStyle = 'rgba(203, 213, 225, 0.8)'; ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(cx - 15, neckY - 30);
    ctx.lineTo(cx - 15, neckY);
    ctx.quadraticCurveTo(cx - 15, neckY + 10, cx - 45, flaskY - 10);
    ctx.quadraticCurveTo(cx - 50, flaskY, cx - 40, flaskY + 5);
    ctx.quadraticCurveTo(cx, flaskY + 12, cx + 40, flaskY + 5);
    ctx.quadraticCurveTo(cx + 50, flaskY, cx + 45, flaskY - 10);
    ctx.quadraticCurveTo(cx + 15, neckY + 10, cx + 15, neckY);
    ctx.lineTo(cx + 15, neckY - 30);
    ctx.moveTo(cx - 15, neckY - 30);
    ctx.bezierCurveTo(cx - 15, neckY - 35, cx + 15, neckY - 35, cx + 15, neckY - 30);
    ctx.bezierCurveTo(cx + 15, neckY - 25, cx - 15, neckY - 25, cx - 15, neckY - 30);
    ctx.stroke();

    ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.beginPath();
    ctx.moveTo(cx - 8, neckY - 20); ctx.lineTo(cx - 8, neckY + 5);
    ctx.quadraticCurveTo(cx - 8, neckY + 10, cx - 35, flaskY - 15);
    ctx.quadraticCurveTo(cx - 25, flaskY - 15, cx - 4, neckY + 5);
    ctx.lineTo(cx - 4, neckY - 20); ctx.fill();

    // --- 5. DRAW THE MENISCUS ZOOM LENS ---
    const zoomCx = 350;
    const zoomCy = 120;
    const zoomRadius = 75;
    const zoomFactor = 2.8;

    ctx.strokeStyle = 'rgba(148, 163, 184, 0.5)'; ctx.lineWidth = 2; ctx.setLineDash([4,4]);
    ctx.beginPath(); ctx.moveTo(cx+12, buretFluidY); ctx.lineTo(zoomCx - zoomRadius, zoomCy); ctx.stroke(); ctx.setLineDash([]);

    ctx.save();
    ctx.beginPath(); ctx.arc(zoomCx, zoomCy, zoomRadius, 0, Math.PI*2);
    ctx.clip();
    ctx.fillStyle = '#f8fafc'; ctx.fill();

    let startV = Math.max(0, Math.floor(titrationState.buretVol - 2));
    let endV = Math.min(50, startV + 4);

    ctx.textAlign = 'right';
    for(let v = startV; v <= endV; v += 0.1) {
        let diffCm3 = v - titrationState.buretVol;
        let yPosZoomed = zoomCy + (diffCm3 * pxPerCm3 * zoomFactor);

        ctx.beginPath(); ctx.moveTo(zoomCx - 40, yPosZoomed);
        
        if (Math.abs(Math.round(v * 10) % 10) === 0) {
            ctx.lineTo(zoomCx - 10, yPosZoomed); ctx.lineWidth = 3; ctx.strokeStyle = '#0f172a'; ctx.stroke();
            ctx.fillStyle = '#0f172a'; ctx.font = 'bold 16px Arial'; ctx.fillText(v.toFixed(0), zoomCx - 45, yPosZoomed + 6);
        } else if (Math.abs(Math.round(v * 10) % 5) === 0) {
            ctx.lineTo(zoomCx - 20, yPosZoomed); ctx.lineWidth = 2; ctx.strokeStyle = '#334155'; ctx.stroke();
        } else {
            ctx.lineTo(zoomCx - 30, yPosZoomed); ctx.lineWidth = 1; ctx.strokeStyle = '#64748b'; ctx.stroke();
        }
    }

    ctx.fillStyle = `rgba(${bColor}, 0.6)`; // Dynamic zoom liquid color
    ctx.fillRect(zoomCx - 40, zoomCy, 80, zoomRadius); 
    
    ctx.beginPath(); ctx.ellipse(zoomCx, zoomCy, 40, 12, 0, 0, Math.PI*2);
    ctx.fillStyle = `rgba(${bColor}, 0.9)`; ctx.fill(); ctx.strokeStyle = 'rgba(0,0,0,0.3)'; ctx.lineWidth=2; ctx.stroke();

    ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 6;
    ctx.beginPath(); ctx.moveTo(zoomCx - 40, zoomCy - zoomRadius); ctx.lineTo(zoomCx - 40, zoomCy + zoomRadius); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(zoomCx + 40, zoomCy - zoomRadius); ctx.lineTo(zoomCx + 40, zoomCy + zoomRadius); ctx.stroke();

    ctx.restore(); 

    ctx.beginPath(); ctx.arc(zoomCx, zoomCy, zoomRadius, 0, Math.PI*2);
    ctx.strokeStyle = '#0f172a'; ctx.lineWidth = 6; ctx.stroke();
    
    let lensGlare = ctx.createLinearGradient(zoomCx - zoomRadius, zoomCy - zoomRadius, zoomCx + zoomRadius, zoomCy + zoomRadius);
    lensGlare.addColorStop(0, 'rgba(255,255,255,0.6)'); 
    lensGlare.addColorStop(0.5, 'rgba(255,255,255,0)');
    ctx.fillStyle = lensGlare; ctx.fill();

    titrationState.animId = requestAnimationFrame(titrationLoop);
}

// Override AI Submit to read dynamic inputs
window.submitLabForGrading = async function() {
    // 1. Scrape the dynamic table
    let tableData = {};
    document.querySelectorAll('#titration-table .sim-input').forEach(input => {
        tableData[input.dataset.key] = input.value || "No input";
    });

    // 2. Scrape the dynamic calculation textareas/inputs
    let calculationsData = {};
    const calcBlock = globalExperimentBlueprint.calculationsBlock;
    if (calcBlock) {
        calcBlock.forEach(calc => {
            const inputEl = document.getElementById(calc.id);
            calculationsData[calc.label] = inputEl ? inputEl.value : "No input";
        });
    }

    const payload = {
        subject: "Chemistry",
        isStation: false,
        tableData: tableData,
        calculations: calculationsData
    };

    const modal = document.getElementById('ai-modal');
    const content = document.getElementById('ai-feedback-content');
    modal.style.display = 'flex';
    content.innerHTML = `
        <i class="fas fa-circle-notch fa-spin fa-3x" style="color: #2ecc71; margin-bottom: 15px;"></i>
        <p>Transmitting data to AI Chief Examiner...</p>
        <p style="font-size: 0.8rem; color: #64748b;">Evaluating volumetric accuracy and stoichiometry.</p>
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
};

/**
 * ==========================================================================
 * THERMOCHEMISTRY ENGINE (CALORIMETRY)
 * ==========================================================================
 */
let thermoState = {
    timeSeconds: 0,
    tempBase: 25.0,
    tempCurrent: 25.0,
    isRunning: false,
    hasReacted: false,
    lastTick: 0,
    animId: null
};

function renderThermoWorkspace() {
    thermoState = { timeSeconds: 0, tempBase: 24.5 + Math.random(), tempCurrent: 0, isRunning: false, hasReacted: false, lastTick: 0 };
    thermoState.tempCurrent = thermoState.tempBase;

    // Pull dynamic button text from the blueprint, or use a default
    let btnText = globalExperimentBlueprint.simulationSettings.reactionButtonText || "Add Reactant";

    document.getElementById('simulation-render-target').innerHTML = `
        <div class="sim-container-row">
            <div class="sim-controls-col">
                <div style="background: #161b22; padding: 15px; border-radius: 8px; border: 2px solid #30363d; text-align: center; margin-bottom: 15px;">
                    <div style="color:#8b949e; font-size:0.8rem; margin-bottom:5px; font-family:'Orbitron';">DIGITAL STOPWATCH (MIN : SEC)</div>
                    <div class="lcd-screen" id="thermo-timer-lcd" style="color: #eebf4d; font-size: 3rem; background: #000; padding: 10px; border-radius: 6px;">00:00</div>
                </div>
                
                <div style="background: #161b22; padding: 15px; border-radius: 8px; border: 2px solid #30363d; text-align: center; margin-bottom: 15px;">
                    <div style="color:#8b949e; font-size:0.8rem; margin-bottom:5px; font-family:'Orbitron';">THERMOMETER (°C)</div>
                    <div class="lcd-screen" id="thermo-temp-lcd" style="color: #ff4757; font-size: 3rem; background: #000; padding: 10px; border-radius: 6px;">${thermoState.tempCurrent.toFixed(1)}</div>
                </div>

                <div style="background: #1e293b; padding: 15px; border-radius: 8px; border: 1px solid #334155;">
                    <button id="btn-thermo-start" onclick="window.startThermo()" style="width:100%; margin-bottom:10px; background:#2ecc71; color:#0f172a; border:none; padding:12px; border-radius:6px; font-weight:bold; cursor:pointer;"><i class="fas fa-play"></i> Start Timer (Baseline)</button>
                    <button id="btn-thermo-react" onclick="window.reactThermo()" disabled style="width:100%; background:#475569; color:#fff; border:none; padding:12px; border-radius:6px; font-weight:bold; cursor:not-allowed;"><i class="fas fa-flask"></i> ${btnText}</button>
                </div>
            </div>

            <div class="sim-canvas-col">
                <canvas id="canvas-thermo" width="450" height="420"></canvas>
            </div>
        </div>
    `;
    
    thermoLoop();
}

window.startThermo = function() {
    if (!thermoState.isRunning) {
        thermoState.isRunning = true;
        thermoState.lastTick = performance.now();
        document.getElementById('btn-thermo-start').innerHTML = `<i class="fas fa-pause"></i> Pause Timer`;
        document.getElementById('btn-thermo-start').style.background = '#f1c40f';
    } else {
        thermoState.isRunning = false;
        document.getElementById('btn-thermo-start').innerHTML = `<i class="fas fa-play"></i> Resume Timer`;
        document.getElementById('btn-thermo-start').style.background = '#2ecc71';
    }
};

window.reactThermo = function() {
    thermoState.hasReacted = true;
    document.getElementById('btn-thermo-react').disabled = true;
    document.getElementById('btn-thermo-react').style.background = '#475569';
    document.getElementById('btn-thermo-react').style.cursor = 'not-allowed';
    document.getElementById('btn-thermo-react').innerHTML = `<i class="fas fa-check"></i> Acid Added!`;
};

function thermoLoop() {
    const canvas = document.getElementById('canvas-thermo');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0,0, canvas.width, canvas.height);

    if (thermoState.isRunning) {
        const now = performance.now();
        let dt = (now - thermoState.lastTick) / 1000;
        thermoState.timeSeconds += (dt * 4); 
        thermoState.lastTick = now;

        let currentMin = thermoState.timeSeconds / 60;

        if (currentMin >= 3.5 && !thermoState.hasReacted) {
            let reactBtn = document.getElementById('btn-thermo-react');
            reactBtn.disabled = false;
            reactBtn.style.background = '#e74c3c';
            reactBtn.style.cursor = 'pointer';
            thermoState.isRunning = false; 
            window.startThermo(); 
        }

        // Calculate Temperature Curve (Endothermic vs Exothermic)
        if (!thermoState.hasReacted) {
            thermoState.tempCurrent = thermoState.tempBase + (Math.sin(thermoState.timeSeconds) * 0.05);
        } else {
            let timeSinceReaction = currentMin - 3.5;
            let isEndo = globalExperimentBlueprint.simulationSettings?.isEndothermic || false;
            let magnitude = isEndo ? -6.5 : 7.5; // Endothermic drops temp, Exothermic raises temp

            if (timeSinceReaction < 0.5) {
                let progress = timeSinceReaction / 0.5;
                thermoState.tempCurrent = thermoState.tempBase + (magnitude * Math.sin(progress * Math.PI / 2));
            } else {
                let peakTemp = thermoState.tempBase + magnitude;
                let recoveryTime = timeSinceReaction - 0.5;
                let recoveryRate = isEndo ? 0.4 : -0.8; // Cold fluids warm back up, hot fluids cool down
                thermoState.tempCurrent = peakTemp + (recoveryTime * recoveryRate); 
            }
        }
    }

    // Update LCDs
    let mins = Math.floor(thermoState.timeSeconds / 60);
    let secs = Math.floor(thermoState.timeSeconds % 60);
    document.getElementById('thermo-timer-lcd').innerText = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    document.getElementById('thermo-temp-lcd').innerText = thermoState.tempCurrent.toFixed(1);

    const cx = canvas.width / 2;

    // Draw Thermometer
    ctx.fillStyle = '#f1f2f6';
    ctx.beginPath(); ctx.roundRect(cx - 10, 50, 20, 250, 10); ctx.fill();
    ctx.strokeStyle = '#a4b0be'; ctx.lineWidth = 2; ctx.stroke();
    
    // Thermometer Bulb
    ctx.beginPath(); ctx.arc(cx, 310, 20, 0, Math.PI*2); 
    ctx.fillStyle = '#ff4757'; ctx.fill(); ctx.stroke();

    // Thermometer Fluid (Map 15C-40C to pixel heights)
    let tempHeight = Math.max(10, Math.min(230, (thermoState.tempCurrent - 15) * 9.2));
    ctx.fillStyle = '#ff4757';
    ctx.fillRect(cx - 4, 300 - tempHeight, 8, tempHeight + 10);

    // Draw Plastic Cup (Calorimeter)
    ctx.fillStyle = 'rgba(223, 228, 234, 0.6)';
    ctx.beginPath();
    ctx.moveTo(cx - 60, 200); ctx.lineTo(cx + 60, 200);
    ctx.lineTo(cx + 45, 360); ctx.lineTo(cx - 45, 360);
    ctx.closePath(); ctx.fill(); ctx.strokeStyle = '#ced6e0'; ctx.stroke();

    // Draw Fluid in Cup
    ctx.fillStyle = thermoState.hasReacted ? 'rgba(164, 176, 190, 0.4)' : 'rgba(112, 161, 255, 0.2)';
    ctx.beginPath();
    ctx.moveTo(cx - 55, 240); ctx.lineTo(cx + 55, 240);
    ctx.lineTo(cx + 45, 360); ctx.lineTo(cx - 45, 360);
    ctx.closePath(); ctx.fill();

    thermoState.animId = requestAnimationFrame(thermoLoop);
}

/**
 * ==========================================================================
 * THERMOCHEMISTRY - CONTINUOUS VARIATION (SERIES) ENGINE
 * ==========================================================================
 */
let thermoSeriesState = {
    selectedExpt: 0,
    tempBase: 25.0,
    tempCurrent: 25.0,
    targetTemp: 25.0,
    isMixed: false,
    mixTime: 0,
    animId: null
};

// Scientifically simulated temperature peaks for the 6 experiments
const seriesTempSpikes = [1.6, 4.0, 6.4, 7.2, 4.8, 2.4]; 

function renderThermoSeriesWorkspace() {
    thermoSeriesState = { selectedExpt: 0, tempBase: 24.0 + (Math.random()*1.5), tempCurrent: 0, targetTemp: 0, isMixed: false, mixTime: 0 };
    thermoSeriesState.tempCurrent = thermoSeriesState.tempBase;
    thermoSeriesState.targetTemp = thermoSeriesState.tempBase;

    document.getElementById('simulation-render-target').innerHTML = `
        <div class="sim-container-row">
            <div class="sim-controls-col">
                <div style="background: #161b22; padding: 15px; border-radius: 8px; border: 2px solid #30363d; text-align: center; margin-bottom: 15px;">
                    <div style="color:#8b949e; font-size:0.8rem; margin-bottom:5px; font-family:'Orbitron';">DIGITAL THERMOMETER (°C)</div>
                    <div class="lcd-screen" id="thermo-series-lcd" style="color: #ff4757; font-size: 3.5rem; background: #000; padding: 10px; border-radius: 6px;">${thermoSeriesState.tempCurrent.toFixed(1)}</div>
                </div>

                <div style="margin-bottom: 15px; background: #0f172a; padding: 10px; border-radius: 6px; border: 1px solid #e28743;">
                    <label style="color:#fff; font-size:0.8rem; font-weight:bold; display:block; margin-bottom:8px; text-align:center;"><i class="fas fa-vials"></i> Select Experiment</label>
                    <select id="expt-selector" onchange="window.resetThermoSeries()" style="width:100%; padding:8px; background:#1e293b; color:#e28743; border:1px solid #475569; border-radius:4px; font-family:'Poppins'; font-weight:bold; outline:none; cursor:pointer;">
                        ${globalExperimentBlueprint.simulationSettings.seriesOptions ? 
                            globalExperimentBlueprint.simulationSettings.seriesOptions.map((opt, i) => 
                                `<option value="${i}">Expt ${opt.label}: ${opt.volA} + ${opt.volB}</option>`
                            ).join('') 
                            : 
                            `<option value="0">Expt 1: 4 cm³ A + 36 cm³ B</option>
                             <option value="1">Expt 2: 10 cm³ A + 30 cm³ B</option>
                             <option value="2">Expt 3: 16 cm³ A + 24 cm³ B</option>
                             <option value="3">Expt 4: 22 cm³ A + 18 cm³ B</option>
                             <option value="4">Expt 5: 28 cm³ A + 12 cm³ B</option>
                             <option value="5">Expt 6: 34 cm³ A + 6 cm³ B</option>`
                        }
                    </select>
                </div>

                <div style="background: #1e293b; padding: 15px; border-radius: 8px; border: 1px solid #334155;">
                    <button id="btn-mix-stir" onclick="window.mixAndStir()" style="width:100%; background:#e74c3c; color:#fff; border:none; padding:15px; border-radius:6px; font-weight:bold; font-size: 1.1rem; cursor:pointer; transition: 0.2s;"><i class="fas fa-bolt"></i> Mix & Stir Solutions</button>
                </div>
            </div>

            <div class="sim-canvas-col">
                <canvas id="canvas-thermo-series" width="450" height="420"></canvas>
            </div>
        </div>
    `;
    
    thermoSeriesLoop();
}

window.resetThermoSeries = function() {
    let el = document.getElementById('expt-selector');
    thermoSeriesState.selectedExpt = parseInt(el.value);
    thermoSeriesState.isMixed = false;
    // Generate a slightly new baseline temp for realism on each wash
    thermoSeriesState.tempBase = 24.0 + (Math.random()*1.5); 
    thermoSeriesState.tempCurrent = thermoSeriesState.tempBase;
    thermoSeriesState.targetTemp = thermoSeriesState.tempBase;
    
    let btn = document.getElementById('btn-mix-stir');
    btn.disabled = false;
    btn.style.background = '#e74c3c';
    btn.style.cursor = 'pointer';
    btn.innerHTML = `<i class="fas fa-bolt"></i> Mix & Stir Solutions`;
};

window.mixAndStir = function() {
    thermoSeriesState.isMixed = true;
    thermoSeriesState.mixTime = performance.now();
    thermoSeriesState.targetTemp = thermoSeriesState.tempBase + seriesTempSpikes[thermoSeriesState.selectedExpt];
    
    let btn = document.getElementById('btn-mix-stir');
    btn.disabled = true;
    btn.style.background = '#475569';
    btn.style.cursor = 'not-allowed';
    btn.innerHTML = `<i class="fas fa-check-circle"></i> Reaction in Progress`;
};

function thermoSeriesLoop() {
    const canvas = document.getElementById('canvas-thermo-series');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0,0, canvas.width, canvas.height);

    let stirOffset = 0;
    
    if (thermoSeriesState.isMixed) {
        let elapsed = (performance.now() - thermoSeriesState.mixTime) / 1000;
        
        // Easing function to make temperature shoot up smoothly, then slowly cool
        if (elapsed < 3.0) {
            // Rising temp
            thermoSeriesState.tempCurrent += (thermoSeriesState.targetTemp - thermoSeriesState.tempCurrent) * 0.05;
            // Vigorous stirring animation
            stirOffset = Math.sin(elapsed * 15) * 15;
        } else {
            // Cooling phase
            thermoSeriesState.tempCurrent -= 0.005; // Cools down slowly
            document.getElementById('btn-mix-stir').innerHTML = `<i class="fas fa-snowflake"></i> Cooling Down...`;
        }
    } else {
        // Natural baseline fluctuation
        thermoSeriesState.tempCurrent = thermoSeriesState.tempBase + (Math.sin(performance.now()/500) * 0.03);
    }

    // Update LCD
    document.getElementById('thermo-series-lcd').innerText = thermoSeriesState.tempCurrent.toFixed(1);

    const cx = canvas.width / 2;

    // Draw Stirring Rod (Behind Front Glass, animates if mixing)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(cx + 30 + stirOffset, 80);
    ctx.lineTo(cx - 20 + stirOffset, 340);
    ctx.stroke();

    // Draw Thermometer
    ctx.fillStyle = '#f1f2f6';
    ctx.beginPath(); ctx.roundRect(cx - 10, 30, 20, 270, 10); ctx.fill();
    ctx.strokeStyle = '#a4b0be'; ctx.lineWidth = 2; ctx.stroke();
    
    // Thermometer Bulb
    ctx.beginPath(); ctx.arc(cx, 310, 20, 0, Math.PI*2); 
    ctx.fillStyle = '#ff4757'; ctx.fill(); ctx.stroke();

    // Thermometer Fluid (Dynamic mapped height)
    let tempHeight = Math.max(10, Math.min(250, (thermoSeriesState.tempCurrent - 20) * 10));
    ctx.fillStyle = '#ff4757';
    ctx.fillRect(cx - 4, 300 - tempHeight, 8, tempHeight + 10);

    // Draw Plastic Cup (Calorimeter)
    ctx.fillStyle = 'rgba(223, 228, 234, 0.5)';
    ctx.beginPath();
    ctx.moveTo(cx - 70, 180); ctx.lineTo(cx + 70, 180); // Wider cup
    ctx.lineTo(cx + 50, 370); ctx.lineTo(cx - 50, 370);
    ctx.closePath(); ctx.fill(); ctx.strokeStyle = '#ced6e0'; ctx.lineWidth = 3; ctx.stroke();

    // Draw Fluid in Cup (Level jumps when mixed)
    let fluidTop = thermoSeriesState.isMixed ? 200 : 280; 
    let fluidWidthTop = thermoSeriesState.isMixed ? 66 : 56;
    
    // Smoothly animate fluid level rising
    if (thermoSeriesState.isMixed) {
        let elapsed = (performance.now() - thermoSeriesState.mixTime) / 1000;
        if (elapsed < 0.5) {
            fluidTop = 280 - (80 * (elapsed / 0.5));
            fluidWidthTop = 56 + (10 * (elapsed / 0.5));
        }
    }

    ctx.fillStyle = thermoSeriesState.isMixed ? 'rgba(164, 176, 190, 0.6)' : 'rgba(112, 161, 255, 0.4)';
    ctx.beginPath();
    ctx.moveTo(cx - fluidWidthTop, fluidTop); ctx.lineTo(cx + fluidWidthTop, fluidTop);
    ctx.lineTo(cx + 48, 368); ctx.lineTo(cx - 48, 368);
    ctx.closePath(); ctx.fill();
    
    // Fluid Surface Oval
    ctx.beginPath(); ctx.ellipse(cx, fluidTop, fluidWidthTop, 8, 0, 0, Math.PI*2);
    ctx.fillStyle = thermoSeriesState.isMixed ? 'rgba(164, 176, 190, 0.8)' : 'rgba(112, 161, 255, 0.6)';
    ctx.fill();

    thermoSeriesState.animId = requestAnimationFrame(thermoSeriesLoop);
}

/**
 * ==========================================================================
 * THERMOCHEMISTRY - CRYSTALLIZATION ENGINE
 * ==========================================================================
 */
let crystState = {
    stepIndex: 0,
    volumes: [5.0, 7.5, 10.0, 12.5],
    targetTemps: [58.5, 47.2, 38.8, 31.5], // Scientifically modeled crystallization points
    tempCurrent: 25.0,
    mode: 'idle', // 'idle', 'heating', 'cooling'
    crystals: [], // Array of particle objects
    animId: null
};

function renderThermoCrystWorkspace() {
    crystState = { stepIndex: 0, volumes: [5.0, 7.5, 10.0, 12.5], targetTemps: [58.5, 47.2, 38.8, 31.5], tempCurrent: 25.0, mode: 'idle', crystals: [] };
    initCrystals(true); // Spawn initial solid crystals at room temp

    document.getElementById('simulation-render-target').innerHTML = `
        <div class="sim-container-row">
            <div class="sim-controls-col">
                <div style="background: #161b22; padding: 15px; border-radius: 8px; border: 2px solid #30363d; text-align: center; margin-bottom: 15px;">
                    <div style="color:#8b949e; font-size:0.8rem; margin-bottom:5px; font-family:'Orbitron';">THERMOMETER (°C)</div>
                    <div class="lcd-screen" id="cryst-temp-lcd" style="color: #ff4757; font-size: 3.5rem; background: #000; padding: 10px; border-radius: 6px;">${crystState.tempCurrent.toFixed(1)}</div>
                </div>

                <div style="background: #161b22; padding: 15px; border-radius: 8px; border: 2px solid #30363d; text-align: center; margin-bottom: 15px;">
                    <div style="color:#8b949e; font-size:0.8rem; margin-bottom:5px; font-family:'Orbitron';">BURETTE (WATER ADDED)</div>
                    <div class="lcd-screen" id="cryst-vol-lcd" style="color: #3498db; font-size: 2rem; background: #000; padding: 10px; border-radius: 6px;">${crystState.volumes[0].toFixed(1)} cm³</div>
                </div>

                <div style="background: #1e293b; padding: 15px; border-radius: 8px; border: 1px solid #334155;">
                    <button id="btn-cryst-heat" onclick="window.heatCrystTube()" style="width:100%; margin-bottom:10px; background:#e74c3c; color:#fff; border:none; padding:12px; border-radius:6px; font-weight:bold; cursor:pointer; transition: 0.2s;"><i class="fas fa-fire"></i> Heat Tube (Dissolve)</button>
                    <button id="btn-cryst-cool" onclick="window.coolCrystTube()" disabled style="width:100%; margin-bottom:10px; background:#475569; color:#fff; border:none; padding:12px; border-radius:6px; font-weight:bold; cursor:not-allowed; transition: 0.2s;"><i class="fas fa-snowflake"></i> Start Cooling (Cold Bath)</button>
                    <button id="btn-cryst-add" onclick="window.addCrystWater()" disabled style="width:100%; background:#475569; color:#fff; border:none; padding:12px; border-radius:6px; font-weight:bold; cursor:not-allowed; transition: 0.2s;"><i class="fas fa-tint"></i> Add 2.5 cm³ Water (Next Expt)</button>
                </div>
            </div>

            <div class="sim-canvas-col">
                <canvas id="canvas-thermo-cryst" width="450" height="420"></canvas>
            </div>
        </div>
    `;
    
    crystLoop();
}

function initCrystals(isVisible) {
    crystState.crystals = [];
    if (!isVisible) return;
    for(let i=0; i<40; i++) {
        crystState.crystals.push({
            x: 225 + (Math.random() * 30 - 15),
            y: 340 + (Math.random() * 20),
            size: Math.random() * 4 + 2,
            opacity: 1.0
        });
    }
}

window.heatCrystTube = function() {
    crystState.mode = 'heating';
    document.getElementById('btn-cryst-heat').disabled = true;
    document.getElementById('btn-cryst-heat').style.background = '#475569';
    document.getElementById('btn-cryst-heat').style.cursor = 'not-allowed';
    document.getElementById('btn-cryst-heat').innerHTML = `<i class="fas fa-fire"></i> Heating...`;
};

window.coolCrystTube = function() {
    crystState.mode = 'cooling';
    document.getElementById('btn-cryst-cool').disabled = true;
    document.getElementById('btn-cryst-cool').style.background = '#475569';
    document.getElementById('btn-cryst-cool').style.cursor = 'not-allowed';
    document.getElementById('btn-cryst-cool').innerHTML = `<i class="fas fa-snowflake"></i> Cooling in Bath...`;
};

window.addCrystWater = function() {
    if (crystState.stepIndex < 3) {
        crystState.stepIndex++;
        crystState.mode = 'idle';
        document.getElementById('cryst-vol-lcd').innerText = `${crystState.volumes[crystState.stepIndex].toFixed(1)} cm³`;
        
        // Reset Buttons
        let heatBtn = document.getElementById('btn-cryst-heat');
        heatBtn.disabled = false;
        heatBtn.style.background = '#e74c3c';
        heatBtn.style.cursor = 'pointer';
        heatBtn.innerHTML = `<i class="fas fa-fire"></i> Heat Tube (Dissolve)`;
        
        let addBtn = document.getElementById('btn-cryst-add');
        addBtn.disabled = true;
        addBtn.style.background = '#475569';
        addBtn.style.cursor = 'not-allowed';
    }
};

function crystLoop() {
    const canvas = document.getElementById('canvas-thermo-cryst');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0,0, canvas.width, canvas.height);

    // Thermodynamics Engine
    if (crystState.mode === 'heating') {
        crystState.tempCurrent += 0.25; // Heat up quickly
        if (crystState.tempCurrent >= 80.0) {
            crystState.tempCurrent = 80.0;
            crystState.mode = 'idle';
            // Unlock Cooling
            let coolBtn = document.getElementById('btn-cryst-cool');
            coolBtn.disabled = false;
            coolBtn.style.background = '#3498db';
            coolBtn.style.cursor = 'pointer';
            coolBtn.innerHTML = `<i class="fas fa-snowflake"></i> Start Cooling (Cold Bath)`;
        }
        // Fade out crystals as it heats
        crystState.crystals.forEach(c => c.opacity -= 0.05);
        crystState.crystals = crystState.crystals.filter(c => c.opacity > 0);
    } 
    else if (crystState.mode === 'cooling') {
        crystState.tempCurrent -= 0.1; // Cool down slowly
        
        // Check for crystallization trigger
        let target = crystState.targetTemps[crystState.stepIndex];
        if (crystState.tempCurrent <= target && crystState.crystals.length === 0) {
            initCrystals(true); // BAM! Crystals appear.
            
            // Unlock "Add Water" if not the last step
            if (crystState.stepIndex < 3) {
                let addBtn = document.getElementById('btn-cryst-add');
                addBtn.disabled = false;
                addBtn.style.background = '#9b59b6';
                addBtn.style.cursor = 'pointer';
            }
        }
        
        // Stop cooling at room temp
        if (crystState.tempCurrent <= 25.0) {
            crystState.tempCurrent = 25.0;
            crystState.mode = 'idle';
            document.getElementById('btn-cryst-cool').innerHTML = `<i class="fas fa-check"></i> Cooled`;
        }
    }

    // Update LCD
    document.getElementById('cryst-temp-lcd').innerText = crystState.tempCurrent.toFixed(1);

    const cx = canvas.width / 2;

    // Draw Cold Water Bath (Beaker)
    ctx.fillStyle = 'rgba(112, 161, 255, 0.15)';
    ctx.beginPath(); ctx.roundRect(cx - 80, 180, 160, 220, 10); ctx.fill();
    ctx.strokeStyle = '#a4b0be'; ctx.lineWidth = 2; ctx.stroke();
    // Bath Water Level
    ctx.fillStyle = 'rgba(112, 161, 255, 0.3)';
    ctx.fillRect(cx - 78, 220, 156, 178);

    // Draw Boiling Tube
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.beginPath();
    ctx.moveTo(cx - 25, 80); ctx.lineTo(cx + 25, 80);
    ctx.lineTo(cx + 25, 340);
    ctx.arc(cx, 340, 25, 0, Math.PI);
    ctx.lineTo(cx - 25, 340);
    ctx.closePath(); ctx.fill(); ctx.strokeStyle = '#ced6e0'; ctx.lineWidth = 3; ctx.stroke();

    // Draw Fluid in Boiling Tube (Level changes based on step)
    let fluidLevel = 320 - (crystState.stepIndex * 20); 
    ctx.fillStyle = 'rgba(200, 214, 229, 0.6)';
    ctx.beginPath();
    ctx.moveTo(cx - 23, fluidLevel); ctx.lineTo(cx + 23, fluidLevel);
    ctx.lineTo(cx + 23, 340);
    ctx.arc(cx, 340, 23, 0, Math.PI);
    ctx.closePath(); ctx.fill();

    // Draw Thermometer inside tube
    ctx.fillStyle = '#f1f2f6';
    ctx.beginPath(); ctx.roundRect(cx - 6, 40, 12, 300, 6); ctx.fill();
    ctx.strokeStyle = '#a4b0be'; ctx.lineWidth = 1; ctx.stroke();
    ctx.beginPath(); ctx.arc(cx, 335, 12, 0, Math.PI*2); 
    ctx.fillStyle = '#ff4757'; ctx.fill(); ctx.stroke();
    // Thermometer Fluid
    let tempHeight = Math.max(5, Math.min(270, (crystState.tempCurrent / 100) * 270));
    ctx.fillStyle = '#ff4757';
    ctx.fillRect(cx - 2, 330 - tempHeight, 4, tempHeight + 5);

    // Draw Crystals
    crystState.crystals.forEach(c => {
        ctx.fillStyle = `rgba(255, 255, 255, ${c.opacity})`;
        ctx.strokeStyle = `rgba(200, 200, 200, ${c.opacity})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.rect(c.x, c.y, c.size, c.size);
        ctx.fill(); ctx.stroke();
    });

    crystState.animId = requestAnimationFrame(crystLoop);
}

/**
 * ==========================================================================
 * HYBRID ENGINE (EN. 4: CALORIMETRY + TITRATION)
 * ==========================================================================
 */
function renderHybridEN4Workspace() {
    // Generate the exact endpoint volume for the titration phase behind the scenes
    titrationState.endpointVol = 24.00 + (Math.random() * 1.50); 
    
    document.getElementById('simulation-render-target').innerHTML = `
        <div style="display: flex; justify-content: center; gap: 15px; margin-bottom: 20px;">
            <button id="btn-tab-thermo" onclick="window.switchHybridTab('thermo')" style="background:#e28743; color:#fff; border:none; padding:10px 20px; border-radius:6px; font-weight:bold; cursor:pointer; font-size: 1rem; flex: 1;"><i class="fas fa-fire-alt"></i> Station 1: Calorimeter</button>
            <button id="btn-tab-titration" onclick="window.switchHybridTab('titration')" style="background:#475569; color:#fff; border:none; padding:10px 20px; border-radius:6px; font-weight:bold; cursor:pointer; font-size: 1rem; flex: 1;"><i class="fas fa-vial"></i> Station 2: Burette</button>
        </div>

        <div id="hybrid-thermo-container">
            <!-- This will be injected by renderThermoWorkspace -->
        </div>

        <div id="hybrid-titration-container" style="display: none;">
            <!-- This will be injected by renderTitrationWorkspace -->
        </div>
    `;

    // Initialize both workspaces in their respective containers
    const originalRenderTarget = document.getElementById('simulation-render-target');
    
    // 1. Mount Thermo
    const thermoTarget = document.getElementById('hybrid-thermo-container');
    document.getElementById('simulation-render-target') = thermoTarget; // Temp override for rendering
    renderThermoWorkspace(); 
    
    // 2. Mount Titration
    const titrationTarget = document.getElementById('hybrid-titration-container');
    document.getElementById('simulation-render-target') = titrationTarget; // Temp override
    renderTitrationWorkspace();

    // Restore original target
    document.getElementById('simulation-render-target') = originalRenderTarget;
}

window.switchHybridTab = function(tab) {
    if (tab === 'thermo') {
        document.getElementById('hybrid-thermo-container').style.display = 'block';
        document.getElementById('hybrid-titration-container').style.display = 'none';
        document.getElementById('btn-tab-thermo').style.background = '#e28743';
        document.getElementById('btn-tab-titration').style.background = '#475569';
    } else {
        document.getElementById('hybrid-thermo-container').style.display = 'none';
        document.getElementById('hybrid-titration-container').style.display = 'block';
        document.getElementById('btn-tab-thermo').style.background = '#475569';
        document.getElementById('btn-tab-titration').style.background = '#3498db';
    }
};
/**
 * ==========================================================================
 * HYBRID ENGINE (EN. 4: CALORIMETRY + TITRATION)
 * ==========================================================================
 */
function renderHybridEN4Workspace() {
    const target = document.getElementById('simulation-render-target');
    
    // Inject the Tab UI and two hidden containers
    target.innerHTML = `
        <div style="display: flex; justify-content: center; gap: 15px; margin-bottom: 20px;">
            <button id="btn-tab-thermo" onclick="window.switchHybridTab('thermo')" style="background:#e28743; color:#fff; border:none; padding:10px 20px; border-radius:6px; font-weight:bold; cursor:pointer; font-size: 1rem; flex: 1;"><i class="fas fa-fire-alt"></i> Station 1: Calorimeter</button>
            <button id="btn-tab-titration" onclick="window.switchHybridTab('titration')" style="background:#475569; color:#fff; border:none; padding:10px 20px; border-radius:6px; font-weight:bold; cursor:pointer; font-size: 1rem; flex: 1;"><i class="fas fa-vial"></i> Station 2: Burette</button>
        </div>
        <div id="hybrid-thermo-container"></div>
        <div id="hybrid-titration-container" style="display: none;"></div>
    `;

    // Temporarily rename the main target so our render functions target the tabs
    target.id = "simulation-render-target-temp";
    
    // Render Thermo into Station 1
    const thermoContainer = document.getElementById("hybrid-thermo-container");
    thermoContainer.id = "simulation-render-target";
    renderThermoWorkspace();
    document.getElementById("simulation-render-target").id = "hybrid-thermo-container";
    
    // Render Titration into Station 2
    const titrContainer = document.getElementById("hybrid-titration-container");
    titrContainer.id = "simulation-render-target";
    renderTitrationWorkspace();
    document.getElementById("simulation-render-target").id = "hybrid-titration-container";
    
    // Restore the main target ID
    target.id = "simulation-render-target";

    // Set Titration state specific for EN4
    titrationState.endpointVol = 24.00 + (Math.random() * 1.50); 
}

window.switchHybridTab = function(tab) {
    if (tab === 'thermo') {
        document.getElementById('hybrid-thermo-container').style.display = 'block';
        document.getElementById('hybrid-titration-container').style.display = 'none';
        document.getElementById('btn-tab-thermo').style.background = '#e28743';
        document.getElementById('btn-tab-titration').style.background = '#475569';
    } else {
        document.getElementById('hybrid-thermo-container').style.display = 'none';
        document.getElementById('hybrid-titration-container').style.display = 'block';
        document.getElementById('btn-tab-thermo').style.background = '#475569';
        document.getElementById('btn-tab-titration').style.background = '#3498db';
    }
};

/**
 * ==========================================================================
 * THERMOCHEMISTRY - HESS'S LAW ENGINE (EN. 6)
 * ==========================================================================
 */
let hessState = {
    timeSeconds: 0,
    tempBase: 25.0,
    tempCurrent: 25.0,
    isRunning: false,
    hasReacted: false,
    activePhase: 'hydrated', // 'hydrated' or 'anhydrous'
    lastTick: 0,
    animId: null
};

function renderThermoHessWorkspace() {
    hessState = { timeSeconds: 0, tempBase: 24.5 + Math.random(), tempCurrent: 0, isRunning: false, hasReacted: false, activePhase: 'hydrated', lastTick: 0 };
    hessState.tempCurrent = hessState.tempBase;

    document.getElementById('simulation-render-target').innerHTML = `
        <div class="sim-container-row">
            <div class="sim-controls-col">
                <div style="display: flex; gap: 10px; margin-bottom: 15px;">
                    <button id="btn-hess-hydrated" onclick="window.setHessPhase('hydrated')" style="flex:1; background:#3498db; color:#fff; border:none; padding:10px; border-radius:6px; font-weight:bold; cursor:pointer;">Hydrated (Table 3)</button>
                    <button id="btn-hess-anhydrous" onclick="window.setHessPhase('anhydrous')" style="flex:1; background:#475569; color:#fff; border:none; padding:10px; border-radius:6px; font-weight:bold; cursor:pointer;">Anhydrous (Table 4)</button>
                </div>

                <div style="background: #161b22; padding: 15px; border-radius: 8px; border: 2px solid #30363d; text-align: center; margin-bottom: 15px;">
                    <div style="color:#8b949e; font-size:0.8rem; margin-bottom:5px; font-family:'Orbitron';">STOPWATCH (SECONDS)</div>
                    <div class="lcd-screen" id="hess-timer-lcd" style="color: #eebf4d; font-size: 3rem; background: #000; padding: 10px; border-radius: 6px;">0</div>
                </div>
                
                <div style="background: #161b22; padding: 15px; border-radius: 8px; border: 2px solid #30363d; text-align: center; margin-bottom: 15px;">
                    <div style="color:#8b949e; font-size:0.8rem; margin-bottom:5px; font-family:'Orbitron';">THERMOMETER (°C)</div>
                    <div class="lcd-screen" id="hess-temp-lcd" style="color: #ff4757; font-size: 3rem; background: #000; padding: 10px; border-radius: 6px;">${hessState.tempCurrent.toFixed(1)}</div>
                </div>

                <div style="background: #1e293b; padding: 15px; border-radius: 8px; border: 1px solid #334155;">
                    <button id="btn-hess-start" onclick="window.startHess()" style="width:100%; margin-bottom:10px; background:#2ecc71; color:#0f172a; border:none; padding:12px; border-radius:6px; font-weight:bold; cursor:pointer;"><i class="fas fa-play"></i> Start Timer</button>
                    <button id="btn-hess-react" onclick="window.reactHess()" disabled style="width:100%; background:#475569; color:#fff; border:none; padding:12px; border-radius:6px; font-weight:bold; cursor:not-allowed;"><i class="fas fa-flask"></i> Add Solid (At 120s)</button>
                </div>
            </div>

            <div class="sim-canvas-col">
                <canvas id="canvas-thermo-hess" width="450" height="420"></canvas>
            </div>
        </div>
    `;
    
    hessLoop();
}

window.setHessPhase = function(phase) {
    hessState.activePhase = phase;
    hessState.timeSeconds = 0;
    hessState.tempBase = 24.5 + Math.random();
    hessState.tempCurrent = hessState.tempBase;
    hessState.isRunning = false;
    hessState.hasReacted = false;
    
    document.getElementById('btn-hess-hydrated').style.background = phase === 'hydrated' ? '#3498db' : '#475569';
    document.getElementById('btn-hess-anhydrous').style.background = phase === 'anhydrous' ? '#e74c3c' : '#475569';
    
    document.getElementById('btn-hess-start').innerHTML = `<i class="fas fa-play"></i> Start Timer`;
    document.getElementById('btn-hess-start').style.background = '#2ecc71';
    
    let reactBtn = document.getElementById('btn-hess-react');
    reactBtn.disabled = true;
    reactBtn.style.background = '#475569';
    reactBtn.style.cursor = 'not-allowed';
    reactBtn.innerHTML = `<i class="fas fa-flask"></i> Add Solid (At 120s)`;
};

window.startHess = function() {
    if (hessState.timeSeconds >= 360) return; // End of experiment
    
    if (!hessState.isRunning) {
        hessState.isRunning = true;
        hessState.lastTick = performance.now();
        document.getElementById('btn-hess-start').innerHTML = `<i class="fas fa-pause"></i> Pause Timer`;
        document.getElementById('btn-hess-start').style.background = '#f1c40f';
    } else {
        hessState.isRunning = false;
        document.getElementById('btn-hess-start').innerHTML = `<i class="fas fa-play"></i> Resume Timer`;
        document.getElementById('btn-hess-start').style.background = '#2ecc71';
    }
};

window.reactHess = function() {
    hessState.hasReacted = true;
    document.getElementById('btn-hess-react').disabled = true;
    document.getElementById('btn-hess-react').style.background = '#475569';
    document.getElementById('btn-hess-react').style.cursor = 'not-allowed';
    document.getElementById('btn-hess-react').innerHTML = `<i class="fas fa-check"></i> Solid Added!`;
};

function hessLoop() {
    const canvas = document.getElementById('canvas-thermo-hess');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0,0, canvas.width, canvas.height);

    if (hessState.isRunning) {
        const now = performance.now();
        let dt = (now - hessState.lastTick) / 1000;
        hessState.timeSeconds += (dt * 5); // 1 real sec = 5 sim secs
        hessState.lastTick = now;
        
        if (hessState.timeSeconds >= 360) {
            hessState.timeSeconds = 360;
            hessState.isRunning = false;
            document.getElementById('btn-hess-start').innerHTML = `<i class="fas fa-flag-checkered"></i> Finished`;
            document.getElementById('btn-hess-start').style.background = '#95a5a6';
        }

        // Unlock reaction button at 120 seconds exactly
        if (hessState.timeSeconds >= 120 && !hessState.hasReacted && hessState.timeSeconds < 130) {
            let reactBtn = document.getElementById('btn-hess-react');
            reactBtn.disabled = false;
            reactBtn.style.background = hessState.activePhase === 'hydrated' ? '#3498db' : '#e74c3c';
            reactBtn.style.cursor = 'pointer';
            hessState.isRunning = false; // Auto-pause
            window.startHess(); // Toggle UI
        }

        // Physics
        if (!hessState.hasReacted) {
            hessState.tempCurrent = hessState.tempBase + (Math.sin(hessState.timeSeconds) * 0.03);
        } else {
            let timeSince = hessState.timeSeconds - 120;
            if (hessState.activePhase === 'hydrated') {
                // Endothermic Drop (Hydrated)
                if (timeSince < 60) {
                    hessState.tempCurrent = hessState.tempBase - (1.2 * Math.sin((timeSince/60) * Math.PI / 2));
                } else {
                    let minTemp = hessState.tempBase - 1.2;
                    hessState.tempCurrent = minTemp + ((timeSince - 60) * 0.003); // Slow warm up
                }
            } else {
                // Exothermic Spike (Anhydrous)
                if (timeSince < 45) {
                    hessState.tempCurrent = hessState.tempBase + (8.5 * Math.sin((timeSince/45) * Math.PI / 2));
                } else {
                    let peakTemp = hessState.tempBase + 8.5;
                    hessState.tempCurrent = peakTemp - ((timeSince - 45) * 0.015); // Newtonian cool down
                }
            }
        }
    }

    document.getElementById('hess-timer-lcd').innerText = Math.floor(hessState.timeSeconds);
    document.getElementById('hess-temp-lcd').innerText = hessState.tempCurrent.toFixed(1);

    const cx = canvas.width / 2;

    // Draw Thermometer
    ctx.fillStyle = '#f1f2f6';
    ctx.beginPath(); ctx.roundRect(cx - 10, 50, 20, 250, 10); ctx.fill();
    ctx.strokeStyle = '#a4b0be'; ctx.lineWidth = 2; ctx.stroke();
    
    ctx.beginPath(); ctx.arc(cx, 310, 20, 0, Math.PI*2); 
    ctx.fillStyle = '#ff4757'; ctx.fill(); ctx.stroke();

    let tempHeight = Math.max(10, Math.min(230, (hessState.tempCurrent - 20) * 11.5));
    ctx.fillStyle = '#ff4757';
    ctx.fillRect(cx - 4, 300 - tempHeight, 8, tempHeight + 10);

    // Draw Cup
    ctx.fillStyle = 'rgba(223, 228, 234, 0.6)';
    ctx.beginPath();
    ctx.moveTo(cx - 60, 200); ctx.lineTo(cx + 60, 200);
    ctx.lineTo(cx + 45, 360); ctx.lineTo(cx - 45, 360);
    ctx.closePath(); ctx.fill(); ctx.stroke();

    // Draw Fluid (Changes color based on reaction state)
    let fluidColor = 'rgba(112, 161, 255, 0.2)'; // Water
    if (hessState.hasReacted) {
        fluidColor = hessState.activePhase === 'hydrated' ? 'rgba(52, 152, 219, 0.7)' : 'rgba(41, 128, 185, 0.9)'; // Copper solutions
    }
    ctx.fillStyle = fluidColor;
    ctx.beginPath();
    ctx.moveTo(cx - 55, 240); ctx.lineTo(cx + 55, 240);
    ctx.lineTo(cx + 45, 360); ctx.lineTo(cx - 45, 360);
    ctx.closePath(); ctx.fill();

    hessState.animId = requestAnimationFrame(hessLoop);
}

/**
 * ==========================================================================
 * HYBRID ENGINE (EN. 7: TITRATION + THERMO SERIES)
 * ==========================================================================
 */
/**
 * ==========================================================================
 * HYBRID ENGINE (EN. 7: TITRATION + THERMO SERIES)
 * ==========================================================================
 */
function renderHybridEN7Workspace() {
    const target = document.getElementById('simulation-render-target');
    titrationState.endpointVol = 24.50 + (Math.random() * 1.50); 
    
    // Inject the Tab UI and two hidden containers
    target.innerHTML = `
        <div style="display: flex; justify-content: center; gap: 15px; margin-bottom: 20px;">
            <button id="btn-tab-titration" onclick="window.switchHybridEN7Tab('titration')" style="background:#8e44ad; color:#fff; border:none; padding:10px 20px; border-radius:6px; font-weight:bold; cursor:pointer; font-size: 1rem; flex: 1;"><i class="fas fa-vial"></i> Station 1: Titration</button>
            <button id="btn-tab-thermo-series" onclick="window.switchHybridEN7Tab('thermo-series')" style="background:#475569; color:#fff; border:none; padding:10px 20px; border-radius:6px; font-weight:bold; cursor:pointer; font-size: 1rem; flex: 1;"><i class="fas fa-fire-alt"></i> Station 2: Cont. Variation</button>
        </div>

        <div id="hybrid-titration-container"></div>
        <div id="hybrid-thermo-series-container" style="display: none;"></div>
    `;

    // Temporarily rename the main target so our render functions target the tabs
    target.id = "simulation-render-target-temp";
    
    // 1. Render Titration into Station 1
    const titrContainer = document.getElementById("hybrid-titration-container");
    titrContainer.id = "simulation-render-target";
    renderTitrationWorkspace(); 
    document.getElementById("simulation-render-target").id = "hybrid-titration-container";

    // 2. Render Thermo Series into Station 2
    const thermoSeriesTarget = document.getElementById("hybrid-thermo-series-container");
    thermoSeriesTarget.id = "simulation-render-target";
    renderThermoSeriesWorkspace();
    document.getElementById("simulation-render-target").id = "hybrid-thermo-series-container";

    // Restore the main target ID
    target.id = "simulation-render-target";
}

window.switchHybridEN7Tab = function(tab) {
    if (tab === 'titration') {
        document.getElementById('hybrid-titration-container').style.display = 'block';
        document.getElementById('hybrid-thermo-series-container').style.display = 'none';
        document.getElementById('btn-tab-titration').style.background = '#8e44ad';
        document.getElementById('btn-tab-thermo-series').style.background = '#475569';
    } else {
        document.getElementById('hybrid-titration-container').style.display = 'none';
        document.getElementById('hybrid-thermo-series-container').style.display = 'block';
        document.getElementById('btn-tab-titration').style.background = '#475569';
        document.getElementById('btn-tab-thermo-series').style.background = '#e28743';
    }
};

window.switchHybridEN7Tab = function(tab) {
    if (tab === 'titration') {
        document.getElementById('hybrid-titration-container').style.display = 'block';
        document.getElementById('hybrid-thermo-series-container').style.display = 'none';
        document.getElementById('btn-tab-titration').style.background = '#8e44ad';
        document.getElementById('btn-tab-thermo-series').style.background = '#475569';
    } else {
        document.getElementById('hybrid-titration-container').style.display = 'none';
        document.getElementById('hybrid-thermo-series-container').style.display = 'block';
        document.getElementById('btn-tab-titration').style.background = '#475569';
        document.getElementById('btn-tab-thermo-series').style.background = '#e28743';
    }
};

/**
 * ==========================================================================
 * CHEMICAL KINETICS - DISAPPEARING PURPLE ENGINE (CK. 1)
 * ==========================================================================
 */
let ck1State = {
    selectedTemp: 30,
    currentTemp: 25.0,
    timeSeconds: 0,
    colorAlpha: 1.0,
    isHeating: false,
    isMixed: false,
    isRunning: false,
    lastTick: 0,
    animId: null
};

// Target reaction times in seconds for each temperature (Arrhenius estimation)
const ck1TargetTimes = {
    30: 125, // Slowest
    40: 62,  // Roughly halves
    50: 31,
    60: 15   // Fastest
};

function renderKineticsCK1Workspace() {
    ck1State = { selectedTemp: 30, currentTemp: 25.0, timeSeconds: 0, colorAlpha: 1.0, isHeating: false, isMixed: false, isRunning: false, lastTick: 0 };

    document.getElementById('simulation-render-target').innerHTML = `
        <div class="sim-container-row">
            <div class="sim-controls-col">
                <div style="margin-bottom: 15px; background: #0f172a; padding: 10px; border-radius: 6px; border: 1px solid #9b59b6;">
                    <label style="color:#fff; font-size:0.8rem; font-weight:bold; display:block; margin-bottom:8px; text-align:center;"><i class="fas fa-temperature-high"></i> Select Target Temperature</label>
                    <select id="ck1-temp-selector" onchange="window.resetCK1()" style="width:100%; padding:8px; background:#1e293b; color:#9b59b6; border:1px solid #475569; border-radius:4px; font-family:'Poppins'; font-weight:bold; outline:none; cursor:pointer;">
                        <option value="30">30 °C Target</option>
                        <option value="40">40 °C Target</option>
                        <option value="50">50 °C Target</option>
                        <option value="60">60 °C Target</option>
                    </select>
                </div>

                <div style="display:flex; gap:10px; margin-bottom: 15px;">
                    <div style="flex:1; background: #161b22; padding: 10px; border-radius: 8px; border: 2px solid #30363d; text-align: center;">
                        <div style="color:#8b949e; font-size:0.7rem; margin-bottom:5px; font-family:'Orbitron';">WATER BATH (°C)</div>
                        <div class="lcd-screen" id="ck1-temp-lcd" style="color: #ff4757; font-size: 2rem; background: #000; padding: 5px; border-radius: 6px;">${ck1State.currentTemp.toFixed(1)}</div>
                    </div>
                    <div style="flex:1; background: #161b22; padding: 10px; border-radius: 8px; border: 2px solid #30363d; text-align: center;">
                        <div style="color:#8b949e; font-size:0.7rem; margin-bottom:5px; font-family:'Orbitron';">TIMER (SEC)</div>
                        <div class="lcd-screen" id="ck1-timer-lcd" style="color: #eebf4d; font-size: 2rem; background: #000; padding: 5px; border-radius: 6px;">0.0</div>
                    </div>
                </div>

                <div style="background: #1e293b; padding: 15px; border-radius: 8px; border: 1px solid #334155;">
                    <button id="btn-ck1-heat" onclick="window.heatCK1Bath()" style="width:100%; margin-bottom:10px; background:#e74c3c; color:#fff; border:none; padding:12px; border-radius:6px; font-weight:bold; cursor:pointer; transition: 0.2s;"><i class="fas fa-fire"></i> Heat Water Bath</button>
                    <button id="btn-ck1-mix" onclick="window.mixCK1()" disabled style="width:100%; background:#475569; color:#fff; border:none; padding:12px; border-radius:6px; font-weight:bold; cursor:not-allowed; transition: 0.2s;"><i class="fas fa-flask"></i> Mix & Start Timer</button>
                </div>
            </div>

            <div class="sim-canvas-col">
                <canvas id="canvas-ck1" width="450" height="420"></canvas>
            </div>
        </div>
    `;
    
    ck1Loop();
}

window.resetCK1 = function() {
    let el = document.getElementById('ck1-temp-selector');
    ck1State.selectedTemp = parseInt(el.value);
    ck1State.currentTemp = 25.0; // Reset to room temp
    ck1State.timeSeconds = 0;
    ck1State.colorAlpha = 1.0;
    ck1State.isHeating = false;
    ck1State.isMixed = false;
    ck1State.isRunning = false;
    
    let heatBtn = document.getElementById('btn-ck1-heat');
    heatBtn.disabled = false;
    heatBtn.style.background = '#e74c3c';
    heatBtn.style.cursor = 'pointer';
    heatBtn.innerHTML = `<i class="fas fa-fire"></i> Heat Water Bath`;
    
    let mixBtn = document.getElementById('btn-ck1-mix');
    mixBtn.disabled = true;
    mixBtn.style.background = '#475569';
    mixBtn.style.cursor = 'not-allowed';
};

window.heatCK1Bath = function() {
    ck1State.isHeating = true;
    let heatBtn = document.getElementById('btn-ck1-heat');
    heatBtn.disabled = true;
    heatBtn.style.background = '#475569';
    heatBtn.style.cursor = 'not-allowed';
    heatBtn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Heating to ${ck1State.selectedTemp}°C...`;
};

window.mixCK1 = function() {
    ck1State.isMixed = true;
    ck1State.isRunning = true;
    ck1State.lastTick = performance.now();
    
    let mixBtn = document.getElementById('btn-ck1-mix');
    mixBtn.disabled = true;
    mixBtn.style.background = '#475569';
    mixBtn.style.cursor = 'not-allowed';
    mixBtn.innerHTML = `<i class="fas fa-stopwatch"></i> Reaction Running...`;
};

function ck1Loop() {
    const canvas = document.getElementById('canvas-ck1');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0,0, canvas.width, canvas.height);

    const now = performance.now();

    // 1. Heating Logic
    if (ck1State.isHeating) {
        ck1State.currentTemp += 0.2; // Heat up rapidly for UX
        
        // Add random fluctuation for realism
        let displayTemp = ck1State.currentTemp + (Math.random() * 0.4 - 0.2);
        document.getElementById('ck1-temp-lcd').innerText = displayTemp.toFixed(1);

        if (ck1State.currentTemp >= ck1State.selectedTemp) {
            ck1State.currentTemp = ck1State.selectedTemp;
            ck1State.isHeating = false;
            document.getElementById('ck1-temp-lcd').innerText = ck1State.currentTemp.toFixed(1);
            
            // Unlock mixing
            let mixBtn = document.getElementById('btn-ck1-mix');
            mixBtn.disabled = false;
            mixBtn.style.background = '#9b59b6';
            mixBtn.style.cursor = 'pointer';
            
            document.getElementById('btn-ck1-heat').innerHTML = `<i class="fas fa-check"></i> Target Temp Reached`;
        }
    }

    // 2. Reaction (Disappearing Purple) Logic
    if (ck1State.isRunning) {
        let dt = (now - ck1State.lastTick) / 1000;
        ck1State.lastTick = now;
        
        // Speed up simulation time for UX (1 real sec = 2 sim secs)
        let simDt = dt * 2; 
        ck1State.timeSeconds += simDt;
        
        // Fading logic based on Target Time
        let targetTime = ck1TargetTimes[ck1State.selectedTemp];
        let fadeRate = 1.0 / targetTime; // How much alpha to lose per second
        
        ck1State.colorAlpha -= (fadeRate * simDt);

        if (ck1State.colorAlpha <= 0.05) {
            ck1State.colorAlpha = 0; // Pure colorless
            ck1State.isRunning = false;
            document.getElementById('btn-ck1-mix').innerHTML = `<i class="fas fa-flag-checkered"></i> Reaction Complete!`;
            document.getElementById('btn-ck1-mix').style.background = '#2ecc71';
        }
        
        document.getElementById('ck1-timer-lcd').innerText = ck1State.timeSeconds.toFixed(1);
    }

    // --- DRAWING THE SCENE ---
    const cx = canvas.width / 2;

    // Draw Water Bath Beaker
    ctx.fillStyle = 'rgba(112, 161, 255, 0.15)';
    ctx.beginPath(); ctx.roundRect(cx - 100, 150, 200, 240, 10); ctx.fill();
    ctx.strokeStyle = '#a4b0be'; ctx.lineWidth = 2; ctx.stroke();
    
    // Draw Bath Water Level (Bubbling if heating)
    ctx.fillStyle = 'rgba(112, 161, 255, 0.3)';
    let bathY = 190;
    if(ck1State.isHeating) { bathY += Math.sin(now/50)*2; }
    ctx.fillRect(cx - 98, bathY, 196, 390 - bathY);

    // Draw Boiling Tube
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.beginPath();
    ctx.moveTo(cx - 25, 50); ctx.lineTo(cx + 25, 50);
    ctx.lineTo(cx + 25, 370);
    ctx.arc(cx, 370, 25, 0, Math.PI);
    ctx.lineTo(cx - 25, 370);
    ctx.closePath(); ctx.fill(); ctx.strokeStyle = '#ced6e0'; ctx.lineWidth = 3; ctx.stroke();

    // Draw Reaction Fluid in Tube
    let tubeFluidY = ck1State.isMixed ? 240 : 280; // Level rises when mixed
    
    // Determine color: starts purple, fades to colorless water
    let r = Math.floor(142 + ((200 - 142) * (1 - ck1State.colorAlpha)));
    let g = Math.floor(68  + ((214 - 68)  * (1 - ck1State.colorAlpha)));
    let b = Math.floor(173 + ((229 - 173) * (1 - ck1State.colorAlpha)));
    
    ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${ck1State.isMixed ? 0.9 : 0.4})`; // Oxalic is colorless initially
    
    ctx.beginPath();
    ctx.moveTo(cx - 23, tubeFluidY); ctx.lineTo(cx + 23, tubeFluidY);
    ctx.lineTo(cx + 23, 370);
    ctx.arc(cx, 370, 23, 0, Math.PI);
    ctx.closePath(); ctx.fill();

    // Draw Stirring rod if running
    if (ck1State.isRunning) {
        let stirOffset = Math.sin(now / 100) * 10;
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.moveTo(cx + 10 + stirOffset, 40);
        ctx.lineTo(cx - 10 + stirOffset, 380);
        ctx.stroke();
    }

    ck1State.animId = requestAnimationFrame(ck1Loop);
}

/**
 * ==========================================================================
 * CHEMICAL KINETICS - DISAPPEARING CROSS ENGINE (CK. 2)
 * ==========================================================================
 */
let ck2State = {
    selectedExpt: 0,
    timeSeconds: 0,
    cloudOpacity: 0.0,
    isRunning: false,
    isComplete: false,
    lastTick: 0,
    animId: null
};

// Target times based on 1st Order Kinetics relative to concentration of Thiosulphate
// [B] values: 0.5, 0.4, 0.3, 0.2, 0.1
const ck2TargetTimes = [20.0, 25.0, 33.3, 50.0, 100.0]; 

function renderKineticsCK2Workspace() {
    ck2State = { selectedExpt: 0, timeSeconds: 0, cloudOpacity: 0.0, isRunning: false, isComplete: false, lastTick: 0 };

    document.getElementById('simulation-render-target').innerHTML = `
        <div class="sim-container-row">
            <div class="sim-controls-col">
                <div style="margin-bottom: 15px; background: #0f172a; padding: 10px; border-radius: 6px; border: 1px solid #9b59b6;">
                    <label style="color:#fff; font-size:0.8rem; font-weight:bold; display:block; margin-bottom:8px; text-align:center;"><i class="fas fa-flask"></i> Select Mixture Ratio</label>
                    <select id="ck2-expt-selector" onchange="window.resetCK2()" style="width:100%; padding:8px; background:#1e293b; color:#9b59b6; border:1px solid #475569; border-radius:4px; font-family:'Poppins'; font-weight:bold; outline:none; cursor:pointer;">
                        <option value="0">Expt 1: [B] = 0.5 moldm⁻³</option>
                        <option value="1">Expt 2: [B] = 0.4 moldm⁻³</option>
                        <option value="2">Expt 3: [B] = 0.3 moldm⁻³</option>
                        <option value="3">Expt 4: [B] = 0.2 moldm⁻³</option>
                        <option value="4">Expt 5: [B] = 0.1 moldm⁻³</option>
                    </select>
                </div>

                <div style="background: #161b22; padding: 15px; border-radius: 8px; border: 2px solid #30363d; text-align: center; margin-bottom: 15px;">
                    <div style="color:#8b949e; font-size:0.8rem; margin-bottom:5px; font-family:'Orbitron';">PRECISION TIMER (SEC)</div>
                    <div class="lcd-screen" id="ck2-timer-lcd" style="color: #eebf4d; font-size: 3.5rem; background: #000; padding: 10px; border-radius: 6px;">0.0</div>
                </div>

                <div style="background: #1e293b; padding: 15px; border-radius: 8px; border: 1px solid #334155;">
                    <button id="btn-ck2-mix" onclick="window.startCK2()" style="width:100%; background:#e74c3c; color:#fff; border:none; padding:15px; border-radius:6px; font-weight:bold; font-size: 1.1rem; cursor:pointer; transition: 0.2s;"><i class="fas fa-bolt"></i> Mix Solutions & Start Timer</button>
                </div>
            </div>

            <div class="sim-canvas-col" style="display: flex; justify-content: center; align-items: center; background: #fff; border-radius: 8px;">
                <canvas id="canvas-ck2" width="400" height="400" style="border-radius: 8px;"></canvas>
            </div>
        </div>
    `;
    
    ck2Loop();
}

window.resetCK2 = function() {
    let el = document.getElementById('ck2-expt-selector');
    ck2State.selectedExpt = parseInt(el.value);
    ck2State.timeSeconds = 0;
    ck2State.cloudOpacity = 0.0;
    ck2State.isRunning = false;
    ck2State.isComplete = false;
    
    let mixBtn = document.getElementById('btn-ck2-mix');
    mixBtn.disabled = false;
    mixBtn.style.background = '#e74c3c';
    mixBtn.style.cursor = 'pointer';
    mixBtn.innerHTML = `<i class="fas fa-bolt"></i> Mix Solutions & Start Timer`;
    
    document.getElementById('ck2-timer-lcd').innerText = "0.0";
};

window.startCK2 = function() {
    ck2State.isRunning = true;
    ck2State.isComplete = false;
    ck2State.lastTick = performance.now();
    
    let mixBtn = document.getElementById('btn-ck2-mix');
    mixBtn.disabled = true;
    mixBtn.style.background = '#475569';
    mixBtn.style.cursor = 'not-allowed';
    mixBtn.innerHTML = `<i class="fas fa-stopwatch"></i> Reaction Running...`;
};

function ck2Loop() {
    const canvas = document.getElementById('canvas-ck2');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    // Background is white paper
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;

    // Draw the Black Cross on the paper
    ctx.fillStyle = '#000000';
    ctx.fillRect(cx - 10, cy - 80, 20, 160); // Vertical line
    ctx.fillRect(cx - 80, cy - 10, 160, 20); // Horizontal line

    if (ck2State.isRunning) {
        const now = performance.now();
        let dt = (now - ck2State.lastTick) / 1000;
        ck2State.lastTick = now;
        
        // Use real time
        ck2State.timeSeconds += dt;
        
        // Calculate precipitation opacity based on specific experiment target time
        let targetTime = ck2TargetTimes[ck2State.selectedExpt];
        ck2State.cloudOpacity = Math.min(1.0, ck2State.timeSeconds / targetTime);

        // Check for completion
        if (ck2State.cloudOpacity >= 1.0 && !ck2State.isComplete) {
            ck2State.cloudOpacity = 1.0;
            ck2State.isRunning = false;
            ck2State.isComplete = true;
            
            let mixBtn = document.getElementById('btn-ck2-mix');
            mixBtn.style.background = '#2ecc71';
            mixBtn.innerHTML = `<i class="fas fa-eye-slash"></i> Cross Disappeared!`;
        }
        
        document.getElementById('ck2-timer-lcd').innerText = ck2State.timeSeconds.toFixed(1);
    }

    // Draw Flask Top-Down View
    // Outer rim of flask
    ctx.beginPath(); ctx.arc(cx, cy, 140, 0, Math.PI*2);
    ctx.strokeStyle = 'rgba(200, 210, 220, 0.8)'; ctx.lineWidth = 6; ctx.stroke();
    // Inner rim of neck
    ctx.beginPath(); ctx.arc(cx, cy, 50, 0, Math.PI*2);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)'; ctx.lineWidth = 4; ctx.stroke();
    
    // Draw the Sulphur precipitate (milky yellow-white)
    ctx.beginPath(); ctx.arc(cx, cy, 137, 0, Math.PI*2);
    ctx.fillStyle = `rgba(250, 250, 210, ${ck2State.cloudOpacity})`; 
    ctx.fill();
    
    // Add subtle swirling animation if running
    if (ck2State.isRunning) {
        ctx.strokeStyle = `rgba(255, 255, 255, ${Math.sin(performance.now()/200)*0.2 + 0.2})`;
        ctx.lineWidth = 15;
        ctx.beginPath();
        ctx.arc(cx, cy, 80 + Math.sin(performance.now()/300)*10, 0, Math.PI*2);
        ctx.stroke();
    }

    ck2State.animId = requestAnimationFrame(ck2Loop);
}

/**
 * ==========================================================================
 * CHEMICAL KINETICS - IODINE CLOCK ENGINE (CK. 3)
 * ==========================================================================
 */
let ck3State = {
    selectedExpt: 0,
    timeSeconds: 0,
    isBlue: false,
    isRunning: false,
    isComplete: false,
    lastTick: 0,
    animId: null
};

// Target times based on 1st Order Kinetics relative to concentration of Iodate (Solution I)
// Volumes of I: 30, 26, 22, 18, 14, 10
// We set realistic base times proportional to 1/Volume
const ck3TargetTimes = [15.0, 17.3, 20.4, 25.0, 32.1, 45.0]; 

function renderKineticsCK3Workspace() {
    ck3State = { selectedExpt: 0, timeSeconds: 0, isBlue: false, isRunning: false, isComplete: false, lastTick: 0 };

    document.getElementById('simulation-render-target').innerHTML = `
        <div class="sim-container-row">
            <div class="sim-controls-col">
                <div style="margin-bottom: 15px; background: #0f172a; padding: 10px; border-radius: 6px; border: 1px solid #3498db;">
                    <label style="color:#fff; font-size:0.8rem; font-weight:bold; display:block; margin-bottom:8px; text-align:center;"><i class="fas fa-flask"></i> Select Experiment Ratio</label>
                    <select id="ck3-expt-selector" onchange="window.resetCK3()" style="width:100%; padding:8px; background:#1e293b; color:#3498db; border:1px solid #475569; border-radius:4px; font-family:'Poppins'; font-weight:bold; outline:none; cursor:pointer;">
                        <option value="0">Expt 1 (30 cm³ Sol I + 70 cm³ Water)</option>
                        <option value="1">Expt 2 (26 cm³ Sol I + 74 cm³ Water)</option>
                        <option value="2">Expt 3 (22 cm³ Sol I + 78 cm³ Water)</option>
                        <option value="3">Expt 4 (18 cm³ Sol I + 82 cm³ Water)</option>
                        <option value="4">Expt 5 (14 cm³ Sol I + 86 cm³ Water)</option>
                        <option value="5">Expt 6 (10 cm³ Sol I + 90 cm³ Water)</option>
                    </select>
                </div>

                <div style="display:flex; gap:10px; margin-bottom: 15px;">
                    <div style="flex:1; background: #161b22; padding: 10px; border-radius: 8px; border: 2px solid #30363d; text-align: center;">
                        <div style="color:#8b949e; font-size:0.7rem; margin-bottom:5px; font-family:'Orbitron';">THERMOMETER (°C)</div>
                        <div class="lcd-screen" style="color: #ff4757; font-size: 2rem; background: #000; padding: 5px; border-radius: 6px;">25.0</div>
                    </div>
                    <div style="flex:1; background: #161b22; padding: 10px; border-radius: 8px; border: 2px solid #30363d; text-align: center;">
                        <div style="color:#8b949e; font-size:0.7rem; margin-bottom:5px; font-family:'Orbitron';">TIMER (SEC)</div>
                        <div class="lcd-screen" id="ck3-timer-lcd" style="color: #eebf4d; font-size: 2rem; background: #000; padding: 5px; border-radius: 6px;">0.0</div>
                    </div>
                </div>

                <div style="background: #1e293b; padding: 15px; border-radius: 8px; border: 1px solid #334155;">
                    <button id="btn-ck3-mix" onclick="window.startCK3()" style="width:100%; background:#e74c3c; color:#fff; border:none; padding:15px; border-radius:6px; font-weight:bold; font-size: 1.1rem; cursor:pointer; transition: 0.2s;"><i class="fas fa-eye-dropper"></i> Inject Sol J & Start Timer</button>
                </div>
            </div>

            <div class="sim-canvas-col">
                <canvas id="canvas-ck3" width="450" height="420"></canvas>
            </div>
        </div>
    `;
    
    ck3Loop();
}

window.resetCK3 = function() {
    let el = document.getElementById('ck3-expt-selector');
    ck3State.selectedExpt = parseInt(el.value);
    ck3State.timeSeconds = 0;
    ck3State.isBlue = false;
    ck3State.isRunning = false;
    ck3State.isComplete = false;
    
    let mixBtn = document.getElementById('btn-ck3-mix');
    mixBtn.disabled = false;
    mixBtn.style.background = '#e74c3c';
    mixBtn.style.cursor = 'pointer';
    mixBtn.innerHTML = `<i class="fas fa-eye-dropper"></i> Inject Sol J & Start Timer`;
    
    document.getElementById('ck3-timer-lcd').innerText = "0.0";
};

window.startCK3 = function() {
    ck3State.isRunning = true;
    ck3State.isComplete = false;
    ck3State.lastTick = performance.now();
    
    let mixBtn = document.getElementById('btn-ck3-mix');
    mixBtn.disabled = true;
    mixBtn.style.background = '#475569';
    mixBtn.style.cursor = 'not-allowed';
    mixBtn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Wait for the flash...`;
};

function ck3Loop() {
    const canvas = document.getElementById('canvas-ck3');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0,0, canvas.width, canvas.height);

    if (ck3State.isRunning) {
        const now = performance.now();
        let dt = (now - ck3State.lastTick) / 1000;
        ck3State.lastTick = now;
        
        // Use real time
        ck3State.timeSeconds += dt;
        
        // Check if we hit the flash point
        let targetTime = ck3TargetTimes[ck3State.selectedExpt];

        if (ck3State.timeSeconds >= targetTime && !ck3State.isComplete) {
            ck3State.timeSeconds = targetTime; // Lock exact time
            ck3State.isBlue = true; // INSTANT FLASH
            ck3State.isRunning = false;
            ck3State.isComplete = true;
            
            let mixBtn = document.getElementById('btn-ck3-mix');
            mixBtn.style.background = '#3498db';
            mixBtn.innerHTML = `<i class="fas fa-check-circle"></i> Reaction Complete!`;
        }
        
        document.getElementById('ck3-timer-lcd').innerText = ck3State.timeSeconds.toFixed(1);
    }

    const cx = canvas.width / 2;
    let flaskY = 385; 
    let neckY = 220;

    // Draw Flask Fluid
    let fluidTopY = 300;
    let fluidRadius = 40;

    ctx.beginPath(); ctx.ellipse(cx, flaskY, 65, 15, 0, 0, Math.PI*2);
    // THE MAGIC FLASH: Clear water turns instantly deep blue-black
    ctx.fillStyle = ck3State.isBlue ? 'rgba(5, 5, 30, 0.95)' : 'rgba(230, 240, 255, 0.3)'; 
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(cx - 65, flaskY);
    ctx.lineTo(cx - fluidRadius, fluidTopY);
    ctx.lineTo(cx + fluidRadius, fluidTopY);
    ctx.lineTo(cx + 65, flaskY);
    ctx.fill();

    ctx.beginPath(); ctx.ellipse(cx, fluidTopY, fluidRadius, 8, 0, 0, Math.PI*2);
    ctx.fill();

    // Subtle swirl animation while running
    if (ck3State.isRunning) {
        ctx.strokeStyle = 'rgba(255,255,255,0.4)'; ctx.lineWidth = 1;
        let swirl = Math.sin(performance.now() / 150) * (fluidRadius/3);
        ctx.beginPath(); ctx.ellipse(cx + swirl, fluidTopY, fluidRadius*0.4, fluidRadius*0.1, 0, 0, Math.PI*2); ctx.stroke();
    }

    // Draw Photorealistic Conical Flask Glass
    ctx.strokeStyle = 'rgba(203, 213, 225, 0.8)'; ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(cx - 20, neckY - 30);
    ctx.lineTo(cx - 20, neckY);
    ctx.quadraticCurveTo(cx - 20, neckY + 10, cx - 65, flaskY - 10);
    ctx.quadraticCurveTo(cx - 70, flaskY, cx - 60, flaskY + 5);
    ctx.quadraticCurveTo(cx, flaskY + 15, cx + 60, flaskY + 5);
    ctx.quadraticCurveTo(cx + 70, flaskY, cx + 65, flaskY - 10);
    ctx.quadraticCurveTo(cx + 20, neckY + 10, cx + 20, neckY);
    ctx.lineTo(cx + 20, neckY - 30);
    ctx.moveTo(cx - 20, neckY - 30);
    ctx.bezierCurveTo(cx - 20, neckY - 35, cx + 20, neckY - 35, cx + 20, neckY - 30);
    ctx.bezierCurveTo(cx + 20, neckY - 25, cx - 20, neckY - 25, cx - 20, neckY - 30);
    ctx.stroke();

    // Glass glare
    ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.beginPath();
    ctx.moveTo(cx - 10, neckY - 20); ctx.lineTo(cx - 10, neckY + 5);
    ctx.quadraticCurveTo(cx - 10, neckY + 10, cx - 50, flaskY - 15);
    ctx.quadraticCurveTo(cx - 40, flaskY - 15, cx - 6, neckY + 5);
    ctx.lineTo(cx - 6, neckY - 20); ctx.fill();

    // Injector Animation (Only shows right when timer starts)
    if (ck3State.isRunning && ck3State.timeSeconds < 1.0) {
        ctx.fillStyle = '#a4b0be';
        ctx.fillRect(cx - 5, neckY - 100, 10, 60); // Pipette
        ctx.fillStyle = '#3498db';
        let dropY = neckY - 40 + (ck3State.timeSeconds * 100);
        if (dropY < fluidTopY) {
            ctx.beginPath(); ctx.ellipse(cx, dropY, 3, 5, 0, 0, Math.PI*2); ctx.fill();
        }
    }

    ck3State.animId = requestAnimationFrame(ck3Loop);
}

/**
 * ==========================================================================
 * CHEMICAL KINETICS - MAGNETIC STIRRER ENGINE (CK. 4)
 * ==========================================================================
 */
let ck4State = {
    selectedExpt: 0,
    timeSeconds: 0,
    isBlue: false,
    isRunning: false,
    isComplete: false,
    stirAngle: 0,
    lastTick: 0,
    animId: null
};

// Target times based on 1st Order Kinetics relative to Vol of Sol G (15, 11, 7, 3)
const ck4TargetTimes = [20.0, 27.2, 42.8, 100.0]; 

function renderKineticsCK4Workspace() {
    ck4State = { selectedExpt: 0, timeSeconds: 0, isBlue: false, isRunning: false, isComplete: false, stirAngle: 0, lastTick: 0 };

    document.getElementById('simulation-render-target').innerHTML = `
        <div class="sim-container-row">
            <div class="sim-controls-col">
                <div style="margin-bottom: 15px; background: #0f172a; padding: 10px; border-radius: 6px; border: 1px solid #1abc9c;">
                    <label style="color:#fff; font-size:0.8rem; font-weight:bold; display:block; margin-bottom:8px; text-align:center;"><i class="fas fa-sliders-h"></i> Select Sol G Volume Ratio</label>
                    <select id="ck4-expt-selector" onchange="window.resetCK4()" style="width:100%; padding:8px; background:#1e293b; color:#1abc9c; border:1px solid #475569; border-radius:4px; font-family:'Poppins'; font-weight:bold; outline:none; cursor:pointer;">
                        <option value="0">Expt 1 (15 cm³ Sol G + 0 cm³ Water)</option>
                        <option value="1">Expt 2 (11 cm³ Sol G + 4 cm³ Water)</option>
                        <option value="2">Expt 3 (7 cm³ Sol G + 8 cm³ Water)</option>
                        <option value="3">Expt 4 (3 cm³ Sol G + 12 cm³ Water)</option>
                    </select>
                </div>

                <div style="display:flex; gap:10px; margin-bottom: 15px;">
                    <div style="flex:1; background: #161b22; padding: 10px; border-radius: 8px; border: 2px solid #30363d; text-align: center;">
                        <div style="color:#8b949e; font-size:0.7rem; margin-bottom:5px; font-family:'Orbitron';">THERMOMETER (°C)</div>
                        <div class="lcd-screen" style="color: #ff4757; font-size: 2rem; background: #000; padding: 5px; border-radius: 6px;">25.0</div>
                    </div>
                    <div style="flex:1; background: #161b22; padding: 10px; border-radius: 8px; border: 2px solid #30363d; text-align: center;">
                        <div style="color:#8b949e; font-size:0.7rem; margin-bottom:5px; font-family:'Orbitron';">TIMER (SEC)</div>
                        <div class="lcd-screen" id="ck4-timer-lcd" style="color: #eebf4d; font-size: 2rem; background: #000; padding: 5px; border-radius: 6px;">0.0</div>
                    </div>
                </div>

                <div style="background: #1e293b; padding: 15px; border-radius: 8px; border: 1px solid #334155;">
                    <button id="btn-ck4-mix" onclick="window.startCK4()" style="width:100%; background:#1abc9c; color:#0f172a; border:none; padding:15px; border-radius:6px; font-weight:bold; font-size: 1.1rem; cursor:pointer; transition: 0.2s;"><i class="fas fa-sync fa-spin"></i> Add Sol G & Start Stirrer</button>
                </div>
            </div>

            <div class="sim-canvas-col">
                <canvas id="canvas-ck4" width="450" height="420"></canvas>
            </div>
        </div>
    `;
    
    ck4Loop();
}

window.resetCK4 = function() {
    let el = document.getElementById('ck4-expt-selector');
    ck4State.selectedExpt = parseInt(el.value);
    ck4State.timeSeconds = 0;
    ck4State.isBlue = false;
    ck4State.isRunning = false;
    ck4State.isComplete = false;
    ck4State.stirAngle = 0;
    
    let mixBtn = document.getElementById('btn-ck4-mix');
    mixBtn.disabled = false;
    mixBtn.style.background = '#1abc9c';
    mixBtn.style.cursor = 'pointer';
    mixBtn.innerHTML = `<i class="fas fa-sync fa-spin"></i> Add Sol G & Start Stirrer`;
    
    document.getElementById('ck4-timer-lcd').innerText = "0.0";
};

window.startCK4 = function() {
    ck4State.isRunning = true;
    ck4State.isComplete = false;
    ck4State.lastTick = performance.now();
    
    let mixBtn = document.getElementById('btn-ck4-mix');
    mixBtn.disabled = true;
    mixBtn.style.background = '#475569';
    mixBtn.style.cursor = 'not-allowed';
    mixBtn.innerHTML = `<i class="fas fa-stopwatch"></i> Reaction Running...`;
};

function ck4Loop() {
    const canvas = document.getElementById('canvas-ck4');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0,0, canvas.width, canvas.height);

    const now = performance.now();

    if (ck4State.isRunning) {
        let dt = (now - ck4State.lastTick) / 1000;
        ck4State.lastTick = now;
        
        ck4State.timeSeconds += dt;
        ck4State.stirAngle += 0.8; // Spin the magnetic bar rapidly
        
        let targetTime = ck4TargetTimes[ck4State.selectedExpt];

        if (ck4State.timeSeconds >= targetTime && !ck4State.isComplete) {
            ck4State.timeSeconds = targetTime;
            ck4State.isBlue = true; // INSTANT FLASH
            ck4State.isRunning = false; // Stops the stirrer
            ck4State.isComplete = true;
            
            let mixBtn = document.getElementById('btn-ck4-mix');
            mixBtn.style.background = '#2c3e50';
            mixBtn.innerHTML = `<i class="fas fa-check-circle"></i> Reaction Complete!`;
        }
        
        document.getElementById('ck4-timer-lcd').innerText = ck4State.timeSeconds.toFixed(1);
    }

    const cx = canvas.width / 2;
    let flaskY = 320; 
    let neckY = 150;

    // --- 1. DRAW MAGNETIC STIRRER PLATE ---
    ctx.fillStyle = '#2c3e50';
    ctx.beginPath(); ctx.roundRect(cx - 100, flaskY + 10, 200, 60, 10); ctx.fill();
    ctx.fillStyle = '#bdc3c7';
    ctx.beginPath(); ctx.ellipse(cx, flaskY + 10, 90, 20, 0, 0, Math.PI*2); ctx.fill();
    
    // Digital Stirrer Display
    ctx.fillStyle = '#000';
    ctx.fillRect(cx - 30, flaskY + 40, 60, 20);
    ctx.fillStyle = '#e74c3c';
    ctx.font = '14px Orbitron, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(ck4State.isRunning ? "600 RPM" : "0 RPM", cx, flaskY + 55);

    // --- 2. DRAW FLASK FLUID ---
    let fluidTopY = 240;
    let fluidRadius = 45;

    ctx.beginPath(); ctx.ellipse(cx, flaskY, 65, 15, 0, 0, Math.PI*2);
    ctx.fillStyle = ck4State.isBlue ? 'rgba(5, 5, 30, 0.95)' : 'rgba(230, 240, 255, 0.3)'; 
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(cx - 65, flaskY);
    ctx.lineTo(cx - fluidRadius, fluidTopY);
    ctx.lineTo(cx + fluidRadius, fluidTopY);
    ctx.lineTo(cx + 65, flaskY);
    ctx.fill();

    // VORTEX EFFECT (Dynamic fluid surface)
    ctx.beginPath();
    if (ck4State.isRunning) {
        // Deep V-shape vortex when stirring
        ctx.moveTo(cx - fluidRadius, fluidTopY);
        ctx.quadraticCurveTo(cx, fluidTopY + 40, cx + fluidRadius, fluidTopY);
        ctx.quadraticCurveTo(cx, fluidTopY - 10, cx - fluidRadius, fluidTopY);
    } else {
        // Flat surface when stopped
        ctx.ellipse(cx, fluidTopY, fluidRadius, 8, 0, 0, Math.PI*2);
    }
    ctx.fill();

    // --- 3. DRAW MAGNETIC STIR BAR ---
    ctx.save();
    ctx.translate(cx, flaskY);
    if (ck4State.isRunning) ctx.rotate(ck4State.stirAngle);
    ctx.fillStyle = '#ecf0f1'; // White Teflon bar
    ctx.beginPath(); ctx.roundRect(-15, -4, 30, 8, 4); ctx.fill();
    ctx.strokeStyle = '#95a5a6'; ctx.lineWidth = 1; ctx.stroke();
    ctx.restore();

    // --- 4. DRAW PHOTOREALISTIC CONICAL FLASK ---
    ctx.strokeStyle = 'rgba(203, 213, 225, 0.8)'; ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(cx - 20, neckY - 30);
    ctx.lineTo(cx - 20, neckY);
    ctx.quadraticCurveTo(cx - 20, neckY + 10, cx - 65, flaskY - 10);
    ctx.quadraticCurveTo(cx - 70, flaskY, cx - 60, flaskY + 5);
    ctx.quadraticCurveTo(cx, flaskY + 15, cx + 60, flaskY + 5);
    ctx.quadraticCurveTo(cx + 70, flaskY, cx + 65, flaskY - 10);
    ctx.quadraticCurveTo(cx + 20, neckY + 10, cx + 20, neckY);
    ctx.lineTo(cx + 20, neckY - 30);
    ctx.moveTo(cx - 20, neckY - 30);
    ctx.bezierCurveTo(cx - 20, neckY - 35, cx + 20, neckY - 35, cx + 20, neckY - 30);
    ctx.bezierCurveTo(cx + 20, neckY - 25, cx - 20, neckY - 25, cx - 20, neckY - 30);
    ctx.stroke();

    // Glass glare
    ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.beginPath();
    ctx.moveTo(cx - 10, neckY - 20); ctx.lineTo(cx - 10, neckY + 5);
    ctx.quadraticCurveTo(cx - 10, neckY + 10, cx - 50, flaskY - 15);
    ctx.quadraticCurveTo(cx - 40, flaskY - 15, cx - 6, neckY + 5);
    ctx.lineTo(cx - 6, neckY - 20); ctx.fill();

    ck4State.animId = requestAnimationFrame(ck4Loop);
}

/**
 * ==========================================================================
 * CHEMICAL KINETICS - INITIAL RATES FADING ENGINE (CK. 5)
 * ==========================================================================
 */
let ck5State = {
    selectedExpt: 0,
    timeSeconds: 0,
    colorAlpha: 1.0,
    isRunning: false,
    isComplete: false,
    lastTick: 0,
    animId: null
};

// Target times based on Kinetics: Rate = k[Acetone]^1 [HCl]^1 [I2]^0
// Expt 1: Base (10, 5, 5) -> ~20s
// Expt 2: Acetone halved (5, 5, 5) -> Rate halved -> ~40s
// Expt 3: HCl doubled (5, 10, 5) -> Rate doubles back -> ~20s
// Expt 4: Iodine doubled (5, 5, 10) -> Rate same, but double iodine to consume -> ~80s
const ck5TargetTimes = [20.0, 40.0, 20.0, 80.0]; 

function renderKineticsCK5Workspace() {
    ck5State = { selectedExpt: 0, timeSeconds: 0, colorAlpha: 1.0, isRunning: false, isComplete: false, lastTick: 0 };

    document.getElementById('simulation-render-target').innerHTML = `
        <div class="sim-container-row">
            <div class="sim-controls-col">
                <div style="margin-bottom: 15px; background: #0f172a; padding: 10px; border-radius: 6px; border: 1px solid #8e44ad;">
                    <label style="color:#fff; font-size:0.8rem; font-weight:bold; display:block; margin-bottom:8px; text-align:center;"><i class="fas fa-flask"></i> Select Experiment Ratio</label>
                    <select id="ck5-expt-selector" onchange="window.resetCK5()" style="width:100%; padding:8px; background:#1e293b; color:#8e44ad; border:1px solid #475569; border-radius:4px; font-family:'Poppins'; font-weight:bold; outline:none; cursor:pointer;">
                        <option value="0">Expt 1: Base Reference (10 Acetone, 5 HCl)</option>
                        <option value="1">Expt 2: Halve Acetone (5 Acetone, 5 HCl)</option>
                        <option value="2">Expt 3: Double HCl (5 Acetone, 10 HCl)</option>
                        <option value="3">Expt 4: Double Iodine (5 Ace, 5 HCl, 10 Iodine)</option>
                    </select>
                </div>

                <div style="background: #161b22; padding: 15px; border-radius: 8px; border: 2px solid #30363d; text-align: center; margin-bottom: 15px;">
                    <div style="color:#8b949e; font-size:0.8rem; margin-bottom:5px; font-family:'Orbitron';">PRECISION TIMER (SEC)</div>
                    <div class="lcd-screen" id="ck5-timer-lcd" style="color: #eebf4d; font-size: 3.5rem; background: #000; padding: 10px; border-radius: 6px;">0.0</div>
                </div>

                <div style="background: #1e293b; padding: 15px; border-radius: 8px; border: 1px solid #334155;">
                    <button id="btn-ck5-mix" onclick="window.startCK5()" style="width:100%; background:#8e44ad; color:#fff; border:none; padding:15px; border-radius:6px; font-weight:bold; font-size: 1.1rem; cursor:pointer; transition: 0.2s;"><i class="fas fa-tint"></i> Mix Iodine & Start Timer</button>
                </div>
            </div>
            <div class="sim-canvas-col">
                <canvas id="canvas-ck5" width="450" height="420"></canvas>
            </div>
        </div>
    `;
    ck5Loop();
}

window.resetCK5 = function() {
    ck5State.selectedExpt = parseInt(document.getElementById('ck5-expt-selector').value);
    ck5State.timeSeconds = 0; ck5State.colorAlpha = 1.0; ck5State.isRunning = false; ck5State.isComplete = false;
    let mixBtn = document.getElementById('btn-ck5-mix');
    mixBtn.disabled = false; mixBtn.style.background = '#8e44ad'; mixBtn.style.cursor = 'pointer';
    mixBtn.innerHTML = `<i class="fas fa-tint"></i> Mix Iodine & Start Timer`;
    document.getElementById('ck5-timer-lcd').innerText = "0.0";
};

window.startCK5 = function() {
    ck5State.isRunning = true; ck5State.lastTick = performance.now();
    let mixBtn = document.getElementById('btn-ck5-mix');
    mixBtn.disabled = true; mixBtn.style.background = '#475569'; mixBtn.style.cursor = 'not-allowed';
    mixBtn.innerHTML = `<i class="fas fa-stopwatch"></i> Fading...`;
};

function ck5Loop() {
    const canvas = document.getElementById('canvas-ck5');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0,0, canvas.width, canvas.height);

    if (ck5State.isRunning) {
        let dt = (performance.now() - ck5State.lastTick) / 1000;
        ck5State.lastTick = performance.now();
        
        let simDt = dt * 1.5; // Slightly fast forward for UX
        ck5State.timeSeconds += simDt;
        
        let targetTime = ck5TargetTimes[ck5State.selectedExpt];
        let fadeRate = 1.0 / targetTime;
        ck5State.colorAlpha -= (fadeRate * simDt);

        if (ck5State.colorAlpha <= 0.05) {
            ck5State.colorAlpha = 0;
            ck5State.isRunning = false; ck5State.isComplete = true;
            let mixBtn = document.getElementById('btn-ck5-mix');
            mixBtn.innerHTML = `<i class="fas fa-flag-checkered"></i> Reaction Complete!`;
            mixBtn.style.background = '#2ecc71';
        }
        document.getElementById('ck5-timer-lcd').innerText = ck5State.timeSeconds.toFixed(1);
    }

    const cx = canvas.width / 2; let flaskY = 385; let neckY = 220; let fluidTopY = 300; let fluidRadius = 40;

    // Draw Flask Fluid (Fading Blue-Black to Colorless)
    let r = Math.floor(230 + ((5 - 230) * ck5State.colorAlpha));
    let g = Math.floor(240 + ((5 - 240) * ck5State.colorAlpha));
    let b = Math.floor(255 + ((30 - 255) * ck5State.colorAlpha));
    let alpha = 0.3 + (ck5State.colorAlpha * 0.65);
    ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;

    ctx.beginPath(); ctx.ellipse(cx, flaskY, 65, 15, 0, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.moveTo(cx - 65, flaskY); ctx.lineTo(cx - fluidRadius, fluidTopY); ctx.lineTo(cx + fluidRadius, fluidTopY); ctx.lineTo(cx + 65, flaskY); ctx.fill();
    ctx.beginPath(); ctx.ellipse(cx, fluidTopY, fluidRadius, 8, 0, 0, Math.PI*2); ctx.fill();

    // Swirl
    if (ck5State.isRunning) {
        ctx.strokeStyle = 'rgba(255,255,255,0.4)'; ctx.lineWidth = 1;
        let swirl = Math.sin(performance.now() / 150) * (fluidRadius/3);
        ctx.beginPath(); ctx.ellipse(cx + swirl, fluidTopY, fluidRadius*0.4, fluidRadius*0.1, 0, 0, Math.PI*2); ctx.stroke();
    }

    // Flask Glass
    ctx.strokeStyle = 'rgba(203, 213, 225, 0.8)'; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(cx - 20, neckY - 30); ctx.lineTo(cx - 20, neckY); ctx.quadraticCurveTo(cx - 20, neckY + 10, cx - 65, flaskY - 10); ctx.quadraticCurveTo(cx - 70, flaskY, cx - 60, flaskY + 5); ctx.quadraticCurveTo(cx, flaskY + 15, cx + 60, flaskY + 5); ctx.quadraticCurveTo(cx + 70, flaskY, cx + 65, flaskY - 10); ctx.quadraticCurveTo(cx + 20, neckY + 10, cx + 20, neckY); ctx.lineTo(cx + 20, neckY - 30); ctx.stroke();
    
    ck5State.animId = requestAnimationFrame(ck5Loop);
}


/**
 * ==========================================================================
 * CHEMICAL KINETICS - EFFERVESCENCE & MAGNESIUM ENGINE (CK. 6)
 * ==========================================================================
 */
let ck6State = {
    selectedTemp: 30, currentTemp: 25.0, timeSeconds: 0,
    mgWidth: 40, mgHeight: 12, // Starting size of Mg ribbon
    isHeating: false, isRunning: false, isComplete: false,
    bubbles: [], lastTick: 0, animId: null
};

// Target times based on temperature (Reaction rate doubles per 10 degrees)
// 30C ~ 60s, 35C ~ 42s, 40C ~ 30s, 45C ~ 21s, 50C ~ 15s, 55C ~ 10s, 60C ~ 7.5s
const ck6TargetTimes = { 30: 60.0, 35: 42.4, 40: 30.0, 45: 21.2, 50: 15.0, 55: 10.6, 60: 7.5 };

function renderKineticsCK6Workspace() {
    ck6State = { selectedTemp: 30, currentTemp: 25.0, timeSeconds: 0, mgWidth: 40, mgHeight: 12, isHeating: false, isRunning: false, isComplete: false, bubbles: [], lastTick: 0 };

    document.getElementById('simulation-render-target').innerHTML = `
        <div class="sim-container-row">
            <div class="sim-controls-col">
                <div style="margin-bottom: 15px; background: #0f172a; padding: 10px; border-radius: 6px; border: 1px solid #3498db;">
                    <label style="color:#fff; font-size:0.8rem; font-weight:bold; display:block; margin-bottom:8px; text-align:center;"><i class="fas fa-thermometer-half"></i> Select Target Temperature</label>
                    <select id="ck6-temp-selector" onchange="window.resetCK6()" style="width:100%; padding:8px; background:#1e293b; color:#3498db; border:1px solid #475569; border-radius:4px; font-family:'Poppins'; font-weight:bold; outline:none; cursor:pointer;">
                        <option value="30">30 °C Target</option><option value="35">35 °C Target</option>
                        <option value="40">40 °C Target</option><option value="45">45 °C Target</option>
                        <option value="50">50 °C Target</option><option value="55">55 °C Target</option>
                        <option value="60">60 °C Target</option>
                    </select>
                </div>

                <div style="display:flex; gap:10px; margin-bottom: 15px;">
                    <div style="flex:1; background: #161b22; padding: 10px; border-radius: 8px; border: 2px solid #30363d; text-align: center;">
                        <div style="color:#8b949e; font-size:0.7rem; margin-bottom:5px; font-family:'Orbitron';">WATER BATH (°C)</div>
                        <div class="lcd-screen" id="ck6-temp-lcd" style="color: #ff4757; font-size: 2rem; background: #000; padding: 5px; border-radius: 6px;">${ck6State.currentTemp.toFixed(1)}</div>
                    </div>
                    <div style="flex:1; background: #161b22; padding: 10px; border-radius: 8px; border: 2px solid #30363d; text-align: center;">
                        <div style="color:#8b949e; font-size:0.7rem; margin-bottom:5px; font-family:'Orbitron';">TIMER (SEC)</div>
                        <div class="lcd-screen" id="ck6-timer-lcd" style="color: #eebf4d; font-size: 2rem; background: #000; padding: 5px; border-radius: 6px;">0.0</div>
                    </div>
                </div>

                <div style="background: #1e293b; padding: 15px; border-radius: 8px; border: 1px solid #334155;">
                    <button id="btn-ck6-heat" onclick="window.heatCK6Bath()" style="width:100%; margin-bottom:10px; background:#e74c3c; color:#fff; border:none; padding:12px; border-radius:6px; font-weight:bold; cursor:pointer; transition: 0.2s;"><i class="fas fa-fire"></i> Heat Water Bath</button>
                    <button id="btn-ck6-drop" onclick="window.dropMg()" disabled style="width:100%; background:#475569; color:#fff; border:none; padding:12px; border-radius:6px; font-weight:bold; cursor:not-allowed; transition: 0.2s;"><i class="fas fa-magic"></i> Drop Mg Ribbon & Start</button>
                </div>
            </div>
            <div class="sim-canvas-col"><canvas id="canvas-ck6" width="450" height="420"></canvas></div>
        </div>
    `;
    ck6Loop();
}

window.resetCK6 = function() {
    ck6State.selectedTemp = parseInt(document.getElementById('ck6-temp-selector').value);
    ck6State.currentTemp = 25.0; ck6State.timeSeconds = 0; ck6State.mgWidth = 40; ck6State.mgHeight = 12;
    ck6State.isHeating = false; ck6State.isRunning = false; ck6State.isComplete = false; ck6State.bubbles = [];
    
    document.getElementById('btn-ck6-heat').disabled = false;
    document.getElementById('btn-ck6-heat').style.background = '#e74c3c';
    document.getElementById('btn-ck6-heat').innerHTML = `<i class="fas fa-fire"></i> Heat Water Bath`;
    
    document.getElementById('btn-ck6-drop').disabled = true;
    document.getElementById('btn-ck6-drop').style.background = '#475569';
    document.getElementById('ck6-timer-lcd').innerText = "0.0";
};

window.heatCK6Bath = function() {
    ck6State.isHeating = true;
    let heatBtn = document.getElementById('btn-ck6-heat');
    heatBtn.disabled = true; heatBtn.style.background = '#475569';
    heatBtn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Heating...`;
};

window.dropMg = function() {
    ck6State.isRunning = true; ck6State.lastTick = performance.now();
    let dropBtn = document.getElementById('btn-ck6-drop');
    dropBtn.disabled = true; dropBtn.style.background = '#475569';
    dropBtn.innerHTML = `<i class="fas fa-stopwatch"></i> Dissolving Mg...`;
};

function ck6Loop() {
    const canvas = document.getElementById('canvas-ck6');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0,0, canvas.width, canvas.height);
    const now = performance.now();

    // Heating
    if (ck6State.isHeating) {
        ck6State.currentTemp += 0.25; 
        document.getElementById('ck6-temp-lcd').innerText = (ck6State.currentTemp + (Math.random()*0.2-0.1)).toFixed(1);
        if (ck6State.currentTemp >= ck6State.selectedTemp) {
            ck6State.currentTemp = ck6State.selectedTemp; ck6State.isHeating = false;
            document.getElementById('ck6-temp-lcd').innerText = ck6State.currentTemp.toFixed(1);
            let dropBtn = document.getElementById('btn-ck6-drop');
            dropBtn.disabled = false; dropBtn.style.background = '#3498db'; dropBtn.style.cursor = 'pointer';
            document.getElementById('btn-ck6-heat').innerHTML = `<i class="fas fa-check"></i> Temp Reached`;
        }
    }

    // Reaction & Dissolving Mg
    if (ck6State.isRunning) {
        let dt = (now - ck6State.lastTick) / 1000; ck6State.lastTick = now;
        let simDt = dt * 2.0; // Fast forward
        ck6State.timeSeconds += simDt;
        
        let targetTime = ck6TargetTimes[ck6State.selectedTemp];
        let decayRate = 1.0 / targetTime;
        
        ck6State.mgWidth -= (40 * decayRate * simDt);
        ck6State.mgHeight -= (12 * decayRate * simDt);

        // Spawn Bubbles (Effervescence)
        if (ck6State.mgWidth > 0 && Math.random() < 0.6) {
            ck6State.bubbles.push({
                x: (canvas.width/2) + (Math.random() * ck6State.mgWidth) - (ck6State.mgWidth/2),
                y: 360, size: Math.random() * 3 + 1, speed: Math.random() * 2 + 1
            });
        }

        if (ck6State.mgWidth <= 0) {
            ck6State.mgWidth = 0; ck6State.mgHeight = 0;
            ck6State.isRunning = false; ck6State.isComplete = true;
            document.getElementById('btn-ck6-drop').innerHTML = `<i class="fas fa-check-circle"></i> Mg Dissolved!`;
            document.getElementById('btn-ck6-drop').style.background = '#2ecc71';
        }
        document.getElementById('ck6-timer-lcd').innerText = ck6State.timeSeconds.toFixed(1);
    }

    const cx = canvas.width / 2;

    // Draw Water Bath
    ctx.fillStyle = 'rgba(112, 161, 255, 0.15)'; ctx.beginPath(); ctx.roundRect(cx - 100, 150, 200, 240, 10); ctx.fill();
    ctx.strokeStyle = '#a4b0be'; ctx.lineWidth = 2; ctx.stroke();
    let bathY = 190; if(ck6State.isHeating) bathY += Math.sin(now/50)*2; // Boil
    ctx.fillStyle = 'rgba(112, 161, 255, 0.3)'; ctx.fillRect(cx - 98, bathY, 196, 390 - bathY);

    // Draw Boiling Tube
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.beginPath(); ctx.moveTo(cx-25, 50); ctx.lineTo(cx+25, 50); ctx.lineTo(cx+25, 370); ctx.arc(cx, 370, 25, 0, Math.PI); ctx.lineTo(cx-25, 370); ctx.fill(); ctx.strokeStyle = '#ced6e0'; ctx.lineWidth = 3; ctx.stroke();

    // Draw Acid Fluid
    ctx.fillStyle = `rgba(200, 214, 229, 0.4)`; 
    ctx.beginPath(); ctx.moveTo(cx-23, 260); ctx.lineTo(cx+23, 260); ctx.lineTo(cx+23, 370); ctx.arc(cx, 370, 23, 0, Math.PI); ctx.fill();

    // Draw Magnesium Ribbon
    if (ck6State.isRunning || (!ck6State.isComplete && !ck6State.isRunning && ck6State.timeSeconds === 0 && !document.getElementById('btn-ck6-drop').disabled)) {
        let drawW = ck6State.mgWidth; let drawH = ck6State.mgHeight;
        if (drawW > 0) {
            ctx.fillStyle = '#95a5a6'; // Silver/grey metal
            ctx.beginPath(); ctx.roundRect(cx - (drawW/2), 365 - drawH, drawW, drawH, 2); ctx.fill();
            ctx.strokeStyle = '#7f8c8d'; ctx.lineWidth=1; ctx.stroke();
        }
    }

    // Draw & Animate Bubbles
    ck6State.bubbles.forEach((b, i) => {
        b.y -= b.speed;
        b.x += Math.sin(b.y / 10) * 1.5; // Wiggle
        ctx.beginPath(); ctx.arc(b.x, b.y, b.size, 0, Math.PI*2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)'; ctx.fill(); ctx.strokeStyle = 'rgba(200,200,200,0.9)'; ctx.lineWidth=0.5; ctx.stroke();
        if (b.y < 260) { ck6State.bubbles.splice(i, 1); } // Pop at surface
    });

    ck6State.animId = requestAnimationFrame(ck6Loop);
}

/**
 * ==========================================================================
 * ADVANCED QUALITATIVE ANALYSIS ENGINE (QA. 1) - PHOTOREALISTIC & SEQUENTIAL
 * ==========================================================================
 */
let qaState = {
    selectedTube: 'A', 
    selectedReagent: 'NaOH',
    activeReagents: [], // Tracks sequence: e.g., ['K2CrO4', 'NaOH']
    tubeLevel: 30, // Percentage full
    solColor: 'rgba(230, 240, 255, 0.1)', 
    pptColor: null, 
    pptAmount: 0, 
    litmusRedColor: '#e74c3c',   // Starts red
    litmusBlueColor: '#3498db',  // Starts blue
    litmusDipped: false,
    isWarming: false,
    animId: null
};

// THE ADVANCED CHEMICAL BRAIN
const reactionMatrix = {
    'A': { // COPPER (II)
        baseColor: 'rgba(173, 216, 230, 0.5)', // Pale blue solution
        'NaOH': { dropPpt: '#3498db', dropSol: null, excessPpt: '#3498db', excessSol: null, gas: null }, 
        'NH3': { dropPpt: '#3498db', dropSol: null, excessPpt: null, excessSol: 'rgba(0, 0, 139, 0.9)', gas: null }, 
        'Na2CO3': { dropPpt: '#1abc9c', dropSol: null, excessPpt: '#1abc9c', excessSol: null, gas: null }, 
        'K2CrO4': { dropPpt: '#a0522d', dropSol: 'rgba(241, 196, 15, 0.4)', excessPpt: '#a0522d', excessSol: 'rgba(241, 196, 15, 0.4)', gas: null }, // Brown ppt
        'K2CrO4+NaOH': { dropPpt: '#3498db', dropSol: 'rgba(241, 196, 15, 0.4)', excessPpt: '#3498db', excessSol: 'rgba(241, 196, 15, 0.4)', gas: null }, // SEQUENTIAL: NaOH displaces chromate, turns blue!
        'H2SO4': { dropPpt: null, dropSol: 'rgba(173, 216, 230, 0.5)', excessPpt: null, excessSol: null, gas: null },
        'KSCN': { dropPpt: '#a8d08d', dropSol: null, excessPpt: '#a8d08d', excessSol: null, gas: null }
    },
    'B': { // IRON (III)
        baseColor: 'rgba(245, 222, 179, 0.6)', // Pale yellow/brown
        'NaOH': { dropPpt: '#8b4513', dropSol: null, excessPpt: '#8b4513', excessSol: null, gas: null },
        'NH3': { dropPpt: '#8b4513', dropSol: null, excessPpt: '#8b4513', excessSol: null, gas: null },
        'Na2CO3': { dropPpt: '#8b4513', dropSol: null, excessPpt: '#8b4513', excessSol: null, gas: 'effervescence' },
        'K2CrO4': { dropPpt: '#8b4513', dropSol: 'rgba(241, 196, 15, 0.4)', excessPpt: '#8b4513', excessSol: null, gas: null },
        'K2CrO4+NaOH': { dropPpt: '#6b3e0f', dropSol: 'rgba(241, 196, 15, 0.4)', excessPpt: '#6b3e0f', excessSol: null, gas: null }, // Darker rust
        'H2SO4': { dropPpt: null, dropSol: 'rgba(245, 222, 179, 0.3)', excessPpt: null, excessSol: null, gas: null },
        'KSCN': { dropPpt: null, dropSol: 'rgba(139, 0, 0, 0.98)', excessPpt: null, excessSol: 'rgba(139, 0, 0, 0.98)', gas: null } // Blood red
    },
    'C': { // AMMONIUM
        baseColor: 'rgba(230, 240, 255, 0.1)', 
        'NaOH': { dropPpt: null, dropSol: null, excessPpt: null, excessSol: null, gas: 'NH3' },
        'NH3': { dropPpt: null, dropSol: null, excessPpt: null, excessSol: null, gas: null },
        'Na2CO3': { dropPpt: null, dropSol: null, excessPpt: null, excessSol: null, gas: 'NH3' },
        'K2CrO4': { dropPpt: null, dropSol: 'rgba(241, 196, 15, 0.6)', excessPpt: null, excessSol: 'rgba(241, 196, 15, 0.6)', gas: null },
        'K2CrO4+NaOH': { dropPpt: null, dropSol: 'rgba(241, 196, 15, 0.6)', excessPpt: null, excessSol: null, gas: 'NH3' },
        'H2SO4': { dropPpt: null, dropSol: null, excessPpt: null, excessSol: null, gas: null },
        'KSCN': { dropPpt: null, dropSol: null, excessPpt: null, excessSol: null, gas: null }
    },
    'D': { // BARIUM
        baseColor: 'rgba(230, 240, 255, 0.1)',
        'NaOH': { dropPpt: null, dropSol: null, excessPpt: null, excessSol: null, gas: null },
        'NH3': { dropPpt: null, dropSol: null, excessPpt: null, excessSol: null, gas: null },
        'Na2CO3': { dropPpt: '#ffffff', dropSol: null, excessPpt: '#ffffff', excessSol: null, gas: null }, // White
        'K2CrO4': { dropPpt: '#f1c40f', dropSol: 'rgba(241, 196, 15, 0.4)', excessPpt: '#f1c40f', excessSol: null, gas: null }, // Yellow ppt
        'K2CrO4+NaOH': { dropPpt: '#f1c40f', dropSol: 'rgba(241, 196, 15, 0.4)', excessPpt: '#f1c40f', excessSol: null, gas: null }, // Insoluble in NaOH
        'H2SO4': { dropPpt: '#ffffff', dropSol: null, excessPpt: '#ffffff', excessSol: null, gas: null }, // Heavy White
        'KSCN': { dropPpt: null, dropSol: null, excessPpt: null, excessSol: null, gas: null }
    }
};

function renderQualitativeWorkspace() {
    initQAState();

    document.getElementById('simulation-render-target').innerHTML = `
        <div class="sim-container-row">
            <div class="sim-controls-col">
                <div style="margin-bottom: 15px; background: #0f172a; padding: 10px; border-radius: 6px; border: 1px solid #f39c12;">
                    <label style="color:#fff; font-size:0.8rem; font-weight:bold; display:block; margin-bottom:8px; text-align:center;"><i class="fas fa-vial"></i> 1. Select Unknown Salt Tube</label>
                    <select id="qa-tube-selector" onchange="window.changeQATube()" style="width:100%; padding:8px; background:#1e293b; color:#f39c12; border:1px solid #475569; border-radius:4px; font-family:'Poppins'; font-weight:bold; outline:none; cursor:pointer;">
                        <option value="A">Tube A (Unknown Cation)</option>
                        <option value="B">Tube B (Unknown Cation)</option>
                        <option value="C">Tube C (Unknown Cation)</option>
                        <option value="D">Tube D (Unknown Cation)</option>
                    </select>
                </div>

                <div style="margin-bottom: 15px; background: #0f172a; padding: 10px; border-radius: 6px; border: 1px solid #3498db;">
                    <label style="color:#fff; font-size:0.8rem; font-weight:bold; display:block; margin-bottom:8px; text-align:center;"><i class="fas fa-eye-dropper"></i> 2. Select Reagent</label>
                    <select id="qa-reagent-selector" onchange="window.changeQAReagent()" style="width:100%; padding:8px; background:#1e293b; color:#3498db; border:1px solid #475569; border-radius:4px; font-family:'Poppins'; font-weight:bold; outline:none; cursor:pointer;">
                        <option value="NaOH">Aqueous Sodium Hydroxide (NaOH)</option>
                        <option value="NH3">Aqueous Ammonia (NH₃)</option>
                        <option value="Na2CO3">Sodium Carbonate (Na₂CO₃)</option>
                        <option value="K2CrO4">Potassium Chromate (K₂CrO₄)</option>
                        <option value="H2SO4">Dilute Sulphuric Acid (H₂SO₄)</option>
                        <option value="KSCN">Potassium Thiocyanate (KSCN)</option>
                    </select>
                </div>

                <div style="background: #1e293b; padding: 15px; border-radius: 8px; border: 1px solid #334155;">
                    <button id="btn-qa-drop" onclick="window.applyQAReagent('drop')" style="width:100%; margin-bottom:8px; background:#2ecc71; color:#0f172a; border:none; padding:10px; border-radius:6px; font-weight:bold; cursor:pointer; transition: 0.2s;"><i class="fas fa-tint"></i> Add Dropwise</button>
                    <button id="btn-qa-excess" onclick="window.applyQAReagent('excess')" disabled style="width:100%; margin-bottom:8px; background:#475569; color:#fff; border:none; padding:10px; border-radius:6px; font-weight:bold; cursor:not-allowed; transition: 0.2s;"><i class="fas fa-water"></i> Add to Excess</button>
                    <button id="btn-qa-warm" onclick="window.warmQATube()" style="width:100%; margin-bottom:15px; background:#e74c3c; color:#fff; border:none; padding:10px; border-radius:6px; font-weight:bold; cursor:pointer; transition: 0.2s;"><i class="fas fa-fire"></i> Warm & Test Gas (Litmus)</button>
                    
                    <button onclick="window.washQATube()" style="width:100%; background:#f1c40f; color:#0f172a; border:none; padding:10px; border-radius:6px; font-weight:bold; cursor:pointer; transition: 0.2s;"><i class="fas fa-sync"></i> Wash & Reset Tube</button>
                </div>
            </div>

            <div class="sim-canvas-col" style="background: radial-gradient(circle, #ffffff 0%, #e2e8f0 100%); border-radius:8px; display:flex; justify-content:center; align-items:center; border: 1px solid #cbd5e1;">
                <canvas id="canvas-qa" width="400" height="420"></canvas>
            </div>
        </div>
    `;
    
    qaLoop();
}

function initQAState() {
    let tube = document.getElementById('qa-tube-selector') ? document.getElementById('qa-tube-selector').value : 'A';
    qaState = {
        selectedTube: tube,
        selectedReagent: document.getElementById('qa-reagent-selector') ? document.getElementById('qa-reagent-selector').value : 'NaOH',
        activeReagents: [],
        tubeLevel: 30,
        solColor: reactionMatrix[tube].baseColor,
        pptColor: null,
        pptAmount: 0,
        litmusRedColor: '#e74c3c',   // Starts red
        litmusBlueColor: '#3498db',  // Starts blue
        litmusDipped: false,
        isWarming: false,
        animId: null
    };
}

window.changeQATube = function() { 
    window.washQATube(); 
};

window.changeQAReagent = function() { 
    qaState.selectedReagent = document.getElementById('qa-reagent-selector').value; 
    // Re-enable dropwise button so students can add sequentially WITHOUT washing!
    document.getElementById('btn-qa-drop').disabled = false;
    document.getElementById('btn-qa-drop').style.background = '#2ecc71';
    document.getElementById('btn-qa-drop').style.cursor = 'pointer';
};

window.washQATube = function() {
    initQAState();
    document.getElementById('btn-qa-drop').disabled = false;
    document.getElementById('btn-qa-drop').style.background = '#2ecc71';
    document.getElementById('btn-qa-drop').style.cursor = 'pointer';
    
    document.getElementById('btn-qa-excess').disabled = true;
    document.getElementById('btn-qa-excess').style.background = '#475569';
    document.getElementById('btn-qa-excess').style.cursor = 'not-allowed';
};

window.applyQAReagent = function(amount) {
    if (amount === 'drop') {
        if (!qaState.activeReagents.includes(qaState.selectedReagent)) {
            qaState.activeReagents.push(qaState.selectedReagent);
        }
    }

    // Determine the reaction key (supports single or sequential like 'K2CrO4+NaOH')
    let reactionKey = qaState.activeReagents.join('+');
    let rxn = reactionMatrix[qaState.selectedTube][reactionKey];
    
    // Fallback if combination doesn't exist, just use the latest reagent
    if (!rxn) {
        reactionKey = qaState.selectedReagent;
        rxn = reactionMatrix[qaState.selectedTube][reactionKey];
    }
    
    if (amount === 'drop') {
        qaState.tubeLevel = Math.min(80, qaState.tubeLevel + 15);
        if (rxn && rxn.dropPpt) { qaState.pptColor = rxn.dropPpt; qaState.pptAmount = 25; }
        if (rxn && rxn.dropSol) { qaState.solColor = rxn.dropSol; }
        
        document.getElementById('btn-qa-drop').disabled = true;
        document.getElementById('btn-qa-drop').style.background = '#475569';
        document.getElementById('btn-qa-drop').style.cursor = 'not-allowed';
        
        document.getElementById('btn-qa-excess').disabled = false;
        document.getElementById('btn-qa-excess').style.background = '#3498db';
        document.getElementById('btn-qa-excess').style.cursor = 'pointer';
    } 
    else if (amount === 'excess') {
        qaState.tubeLevel = Math.min(95, qaState.tubeLevel + 25);
        if (rxn && rxn.excessPpt) { 
            qaState.pptColor = rxn.excessPpt; qaState.pptAmount = 45; // Precipitate grows
        } else {
            qaState.pptColor = null; qaState.pptAmount = 0; // Precipitate dissolves!
        }
        if (rxn && rxn.excessSol) { qaState.solColor = rxn.excessSol; }
        
        document.getElementById('btn-qa-excess').disabled = true;
        document.getElementById('btn-qa-excess').style.background = '#475569';
        document.getElementById('btn-qa-excess').style.cursor = 'not-allowed';
    }
};

window.warmQATube = function() {
    qaState.isWarming = true;
    qaState.litmusDipped = true;
    
    // Reset colors to default before testing
    qaState.litmusRedColor = '#e74c3c';
    qaState.litmusBlueColor = '#3498db';
    
    let reactionKey = qaState.activeReagents.join('+');
    let rxn = reactionMatrix[qaState.selectedTube][reactionKey] || reactionMatrix[qaState.selectedTube][qaState.selectedReagent];
    
    // Evaluate Gas Evolution for both papers
    if (rxn && rxn.gas === 'NH3') {
        // Alkaline gas: Red turns Blue, Blue stays Blue
        setTimeout(() => { qaState.litmusRedColor = '#3498db'; }, 1500); 
    } else if (rxn && rxn.gas === 'effervescence') {
        // CO2 gas (weakly acidic): Blue turns pale red/orange, Red stays Red
        setTimeout(() => { qaState.litmusBlueColor = '#e67e22'; }, 1500); 
    }
    
    setTimeout(() => { qaState.isWarming = false; qaState.litmusDipped = false; }, 4000);
};

function qaLoop() {
    const canvas = document.getElementById('canvas-qa');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0,0, canvas.width, canvas.height);

    const cx = canvas.width / 2;
    const bottomY = 380;
    const tubeHeight = 280;
    const topY = bottomY - tubeHeight;
    const radius = 35;

    // --- 1. DRAW FLUID ---
    let fluidH = (qaState.tubeLevel / 100) * tubeHeight;
    let fluidTop = bottomY - fluidH;
    
    let solGrad = ctx.createLinearGradient(cx - radius, 0, cx + radius, 0);
    let cRgb = qaState.solColor.match(/\d+(\.\d+)?/g) || [255,255,255,0.1];
    solGrad.addColorStop(0, `rgba(${cRgb[0]}, ${cRgb[1]}, ${cRgb[2]}, ${Math.min(1, parseFloat(cRgb[3])+0.2)})`);
    solGrad.addColorStop(0.5, qaState.solColor);
    solGrad.addColorStop(1, `rgba(${cRgb[0]}, ${cRgb[1]}, ${cRgb[2]}, ${Math.min(1, parseFloat(cRgb[3])+0.2)})`);

    ctx.fillStyle = solGrad;
    ctx.beginPath();
    ctx.moveTo(cx - radius + 4, topY);
    ctx.lineTo(cx - radius + 4, bottomY - radius);
    ctx.arc(cx, bottomY - radius, radius - 4, Math.PI, 0, true); 
    ctx.arc(cx, bottomY - radius, radius - 4, Math.PI, 0, false);
    ctx.lineTo(cx + radius - 4, topY);
    
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(cx - radius + 4, fluidTop);
    ctx.lineTo(cx - radius + 4, bottomY - radius);
    ctx.arc(cx, bottomY - radius, radius - 4, Math.PI, 0, false);
    ctx.lineTo(cx + radius - 4, fluidTop);
    ctx.closePath();
    ctx.clip();
    ctx.fillRect(cx - radius, fluidTop, radius*2, fluidH);
    
    ctx.beginPath(); ctx.ellipse(cx, fluidTop, radius - 4, 6, 0, 0, Math.PI*2);
    ctx.fillStyle = `rgba(${cRgb[0]}, ${cRgb[1]}, ${cRgb[2]}, ${Math.min(1, parseFloat(cRgb[3])+0.4)})`;
    ctx.fill(); ctx.strokeStyle = 'rgba(255,255,255,0.5)'; ctx.lineWidth = 1; ctx.stroke();

    // --- 2. DRAW PRECIPITATE ---
    if (qaState.pptColor && qaState.pptAmount > 0) {
        let pptH = (qaState.pptAmount / 100) * tubeHeight;
        let pptTop = bottomY - pptH;
        ctx.fillStyle = qaState.pptColor;
        
        ctx.beginPath();
        ctx.moveTo(cx - radius + 5, bottomY - radius);
        for(let px = cx - radius + 5; px <= cx + radius - 5; px += 5) {
            ctx.lineTo(px, pptTop + Math.sin(px/5)*5 + Math.random()*3);
        }
        ctx.lineTo(cx + radius - 5, bottomY - radius);
        ctx.arc(cx, bottomY - radius, radius - 5, 0, Math.PI, false);
        ctx.fill();

        for(let i=0; i<40; i++) {
            let px = cx - radius + 10 + Math.random()*(radius*2 - 20);
            let py = pptTop - Math.random()*(fluidH - pptH);
            py += (performance.now()/50) % (fluidH - pptH);
            if (py > pptTop) py -= (fluidH - pptH);
            ctx.beginPath(); ctx.arc(px, py, Math.random()*2.5+1, 0, Math.PI*2); ctx.fill();
        }
    }

    // --- 3. DRAW BUBBLES ---
    let rxnKey = qaState.activeReagents.join('+');
    let rxn = reactionMatrix[qaState.selectedTube][rxnKey] || reactionMatrix[qaState.selectedTube][qaState.selectedReagent];
    
    if (qaState.isWarming || (rxn && rxn.gas === 'effervescence')) {
        ctx.fillStyle = 'rgba(255,255,255,0.7)';
        ctx.strokeStyle = 'rgba(150,150,150,0.5)';
        for(let i=0; i<25; i++) {
            let bx = cx - 25 + Math.random()*50;
            let by = bottomY - Math.random()*fluidH;
            by -= (performance.now()/15) % fluidH; 
            if (by < fluidTop) by = bottomY; 
            ctx.beginPath(); ctx.arc(bx, by, Math.random()*3+1, 0, Math.PI*2); 
            ctx.fill(); ctx.stroke();
        }
    }
    ctx.restore(); 

    // --- 4. DRAW DUAL LITMUS PAPERS ---
    if (qaState.litmusDipped) {
        // Red Litmus Paper (Left Side)
        ctx.fillStyle = qaState.litmusRedColor;
        ctx.fillRect(cx - 15, fluidTop - 80, 12, 70); 
        ctx.fillStyle = 'rgba(0,0,0,0.15)'; 
        ctx.fillRect(cx - 15, fluidTop - 30, 12, 20); // Wet mark
        
        // Blue Litmus Paper (Right Side)
        ctx.fillStyle = qaState.litmusBlueColor;
        ctx.fillRect(cx + 3, fluidTop - 80, 12, 70); 
        ctx.fillStyle = 'rgba(0,0,0,0.15)'; 
        ctx.fillRect(cx + 3, fluidTop - 30, 12, 20); // Wet mark
    }

    // --- 5. DRAW PHOTOREALISTIC GLASS TUBE ---
    let glassGrad = ctx.createLinearGradient(cx - radius, 0, cx + radius, 0);
    glassGrad.addColorStop(0, 'rgba(100, 116, 139, 0.4)');
    glassGrad.addColorStop(0.1, 'rgba(255, 255, 255, 0.1)');
    glassGrad.addColorStop(0.85, 'rgba(255, 255, 255, 0.1)');
    glassGrad.addColorStop(0.95, 'rgba(255, 255, 255, 0.8)');
    glassGrad.addColorStop(1, 'rgba(100, 116, 139, 0.5)');

    ctx.strokeStyle = 'rgba(148, 163, 184, 0.6)';
    ctx.lineWidth = 2;
    ctx.fillStyle = glassGrad;
    
    ctx.beginPath();
    ctx.moveTo(cx - radius, topY);
    ctx.lineTo(cx - radius, bottomY - radius);
    ctx.arc(cx, bottomY - radius, radius, Math.PI, 0, false);
    ctx.lineTo(cx + radius, topY);
    ctx.fill(); ctx.stroke();

    ctx.beginPath(); ctx.ellipse(cx, topY, radius+4, 8, 0, 0, Math.PI*2); 
    ctx.strokeStyle = 'rgba(203, 213, 225, 0.9)'; ctx.lineWidth=3; ctx.stroke();
    ctx.beginPath(); ctx.ellipse(cx, topY, radius+2, 6, 0, 0, Math.PI*2); 
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)'; ctx.lineWidth=1; ctx.stroke();
    
    ctx.fillStyle = 'rgba(255,255,255,0.4)';
    ctx.beginPath();
    ctx.moveTo(cx - radius + 8, topY + 12);
    ctx.lineTo(cx - radius + 8, bottomY - radius);
    ctx.arc(cx, bottomY - radius, radius - 8, Math.PI, Math.PI*0.75, false);
    ctx.lineTo(cx - radius + 14, topY + 12);
    ctx.fill();

    // --- 6. DRAW FLAME ---
    if (qaState.isWarming) {
        ctx.fillStyle = 'rgba(231, 76, 60, 0.8)'; 
        ctx.beginPath(); ctx.moveTo(cx-20, bottomY+15); ctx.quadraticCurveTo(cx, bottomY-25, cx+20, bottomY+15); ctx.quadraticCurveTo(cx, bottomY+30, cx-20, bottomY+15); ctx.fill();
        ctx.fillStyle = 'rgba(241, 196, 15, 0.9)'; 
        ctx.beginPath(); ctx.moveTo(cx-10, bottomY+15); ctx.quadraticCurveTo(cx, bottomY-5, cx+10, bottomY+15); ctx.quadraticCurveTo(cx, bottomY+25, cx-10, bottomY+15); ctx.fill();
    }

    qaState.animId = requestAnimationFrame(qaLoop);
}

/**
 * ==========================================================================
 * ADVANCED QUALITATIVE ANALYSIS ENGINE (QA. 2 & 3) - PROTOCOL DRIVEN
 * ==========================================================================
 */
let qaAdvState = {
    salt: 'A',
    testId: 'A_i',
    stepIndex: 0,
    tubeLevel: 30,
    solColor: 'rgba(230, 240, 255, 0.1)', 
    pptColor: null, 
    pptAmount: 0,
    mode: 'tube', // 'tube', 'flame', 'filter', 'pencil_flame', 'limewater', 'strong_heat', 'brown_ring'
    flameColor: '#3498db', 
    animId: null
};

// THE EXTENDED CHEMICAL BRAIN (Includes A, B, C, D, E, F)
const testProtocols = {
    // === SALT A (Barium Chloride) ===
    'A_i': {
        steps: [
            { text: "Add K₂Cr₂O₇", sol: 'rgba(230, 126, 34, 0.6)', ppt: '#f1c40f', amt: 25 },
            { text: "Add Na₂S₂O₃", sol: 'rgba(46, 204, 113, 0.6)', ppt: '#f1c40f', amt: 25 }
        ]
    },
    'A_ii': {
        steps: [
            { text: "Add HNO₃ & AgNO₃", sol: 'rgba(230, 240, 255, 0.1)', ppt: '#ffffff', amt: 30 },
            { text: "Add conc. NH₃", sol: 'rgba(230, 240, 255, 0.1)', ppt: null, amt: 0 }
        ]
    },
    'A_iii': {
        steps: [
            { text: "Add NaOH", sol: 'rgba(230, 240, 255, 0.1)', ppt: null, amt: 0 }
        ]
    },
    'A_iv': {
        steps: [
            { text: "Execute Flame Test", mode: 'flame', flame: '#2ecc71' }
        ]
    },

    // === SALT B (Iron III Chloride) ===
    'B_i': {
        steps: [{ text: "Add NaOH", sol: 'rgba(245, 222, 179, 0.2)', ppt: '#8b4513', amt: 30 }]
    },
    'B_ii': {
        steps: [{ text: "Add NH₃", sol: 'rgba(245, 222, 179, 0.2)', ppt: '#8b4513', amt: 30 }]
    },
    'B_iii': {
        steps: [{ text: "Add Na-Ethanoate & Heat", sol: 'rgba(245, 222, 179, 0.2)', ppt: '#a0522d', amt: 40 }]
    },
    'B_iv': {
        steps: [
            { text: "Add KSCN", sol: 'rgba(139, 0, 0, 0.98)', ppt: null, amt: 0 },
            { text: "Add SnCl₂", sol: 'rgba(173, 255, 173, 0.3)', ppt: null, amt: 0 }
        ]
    },
    'B_v': {
        steps: [
            { text: "Add AgNO₃ & HNO₃", sol: 'rgba(245, 222, 179, 0.4)', ppt: '#ffffff', amt: 30 },
            { text: "Add NH₃", sol: 'rgba(245, 222, 179, 0.2)', ppt: null, amt: 0 }
        ]
    },

    // === SALT C (Copper II Sulphate) ===
    'C_i': {
        steps: [
            { text: "Add BaCl₂", sol: 'rgba(173, 216, 230, 0.5)', ppt: '#ffffff', amt: 30 },
            { text: "Add dil HCl", sol: 'rgba(173, 216, 230, 0.5)', ppt: '#ffffff', amt: 30 }
        ]
    },
    'C_ii': {
        steps: [
            { text: "Add NaOH dropwise", sol: 'rgba(173, 216, 230, 0.2)', ppt: '#3498db', amt: 20 },
            { text: "Add excess NaOH", sol: 'rgba(173, 216, 230, 0.2)', ppt: '#3498db', amt: 40 }
        ]
    },
    'C_iii': {
        steps: [
            { text: "Add NH₃ dropwise", sol: 'rgba(173, 216, 230, 0.2)', ppt: '#3498db', amt: 20 },
            { text: "Add excess NH₃", sol: 'rgba(0, 0, 139, 0.95)', ppt: null, amt: 0 }
        ]
    },
    'C_iv_v': {
        steps: [
            { text: "Add KI", sol: 'rgba(160, 82, 45, 0.8)', ppt: '#ffffff', amt: 25 },
            { text: "Filter Mixture", mode: 'filter', sol: 'rgba(160, 82, 45, 0.8)', ppt: null, amt: 0 },
            { text: "Add Starch", sol: 'rgba(5, 5, 30, 0.95)', ppt: null, amt: 0 },
            { text: "Add Na₂S₂O₃", sol: 'rgba(230, 240, 255, 0.1)', ppt: null, amt: 0 }
        ]
    },

    // === SALT D (Sodium Sulphite) ===
    'D_a_i': { 
        steps: [{ text: "Pencil Flame Test", mode: 'pencil_flame', flame: '#f1c40f' }] 
    },
    'D_b_ii': { 
        steps: [
            { text: "Add dil H₂SO₄", sol: 'rgba(230, 240, 255, 0.1)', ppt: null, amt: 0 },
            { text: "Add K₂Cr₂O₇", sol: 'rgba(46, 204, 113, 0.6)', ppt: null, amt: 0 } 
        ]
    },
    'D_iii': { 
        steps: [{ text: "Add conc HNO₃ & warm", mode: 'strong_heat', sol: 'rgba(230, 240, 255, 0.1)', gasColor: 'rgba(139, 69, 19, 0.6)' }] 
    }, 
    'D_iv': { 
        steps: [{ text: "Add dil HCl (Route to Limewater)", mode: 'limewater', sol: 'rgba(230, 240, 255, 0.1)' }] 
    },
    'D_v': { 
        steps: [
            { text: "Load Iodine Solution", sol: 'rgba(160, 82, 45, 0.6)', ppt: null, amt: 0 }, 
            { text: "Add Salt D", sol: 'rgba(230, 240, 255, 0.1)', ppt: null, amt: 0 } 
        ]
    },

    // === SALT E (Calcium Nitrate) ===
    'E_i': { steps: [{ text: "Add NaOH", sol: 'rgba(230, 240, 255, 0.1)', ppt: '#ffffff', amt: 25 }] },
    'E_ii': { steps: [{ text: "Add Na₂CO₃", sol: 'rgba(230, 240, 255, 0.1)', ppt: '#ffffff', amt: 35 }] }, 
    'E_iii': { steps: [{ text: "Add Na₂SO₄", sol: 'rgba(230, 240, 255, 0.1)', ppt: 'rgba(255,255,255,0.4)', amt: 10 }] },
    'E_iv': { steps: [{ text: "Pencil Flame Test", mode: 'pencil_flame', flame: '#e74c3c' }] }, 
    'E_v': { steps: [{ text: "Heat Strongly (Pyrex)", mode: 'strong_heat', sol: 'rgba(0,0,0,0)', ppt: '#ffffff', amt: 5, gasColor: 'rgba(139, 69, 19, 0.8)' }] }, 
    'E_vi': { 
        steps: [
            { text: "Add Fresh FeSO₄", sol: 'rgba(173, 255, 173, 0.3)', ppt: null, amt: 0 }, 
            { text: "Add conc H₂SO₄ down side", mode: 'brown_ring', sol: 'rgba(173, 255, 173, 0.3)' } 
        ]
    },

    // === SALT F (Ammonium Iron(III) Sulphate) ===
    'F_ci': { steps: [{ text: "Add NaOH & Warm", mode: 'tube', sol: 'rgba(245, 222, 179, 0.3)', ppt: '#8b4513', amt: 25 }] }, 
    'F_cii': { 
        steps: [
            { text: "Add NaOH", sol: 'rgba(245, 222, 179, 0.3)', ppt: '#8b4513', amt: 30 },
            { text: "Add dil HCl", sol: 'rgba(245, 222, 179, 0.6)', ppt: null, amt: 0 } 
        ]
    },
    'F_ciii': { 
        steps: [
            { text: "Add NaOH", sol: 'rgba(245, 222, 179, 0.3)', ppt: '#8b4513', amt: 20 },
            { text: "Add BaCl₂", sol: 'rgba(245, 222, 179, 0.3)', ppt: '#e0cda7', amt: 40 } 
        ]
    },
    'F_civ': { 
        steps: [
            { text: "Add HCl", sol: 'rgba(245, 222, 179, 0.5)', ppt: null, amt: 0 },
            { text: "Add Zinc & Warm", mode: 'tube', sol: 'rgba(173, 255, 173, 0.4)', ppt: null, amt: 0 } 
        ]
    },
    // === SALT G (Iron II Sulphate) ===
    'G_a_i': { steps: [{ text: "Add NaOH", sol: 'rgba(230, 240, 255, 0.1)', ppt: '#556b2f', amt: 30 }] }, // Dirty green ppt Fe(OH)2
    'G_a_ii': { steps: [
        { text: "Add dil H₂SO₄", sol: 'rgba(173, 255, 173, 0.3)', ppt: null, amt: 0 },
        { text: "Add KMnO₄ dropwise", sol: 'rgba(148, 0, 211, 0.8)', ppt: null, amt: 0 }, // Purple temporarily
        { text: "Wait for Reduction", sol: 'rgba(245, 222, 179, 0.4)', ppt: null, amt: 0 } // Fe2+ oxidizes to Fe3+ (yellow/brown), KMnO4 decolorizes!
    ]},

    // === SALT H (Lead II Carbonate) ===
    'H_b_i': { steps: [{ text: "Add dil HNO₃", mode: 'effervescence', sol: 'rgba(230, 240, 255, 0.1)', ppt: null, amt: 0 }] }, // Effervescence (CO2), dissolves
    'H_b_ii': { steps: [
        { text: "Add NaOH dropwise", sol: 'rgba(230, 240, 255, 0.1)', ppt: '#ffffff', amt: 25 }, // White ppt Pb(OH)2
        { text: "Add excess NaOH", sol: 'rgba(230, 240, 255, 0.1)', ppt: null, amt: 0 } // Dissolves
    ]},
    'H_b_iii': { steps: [{ text: "Add dil H₂SO₄", sol: 'rgba(230, 240, 255, 0.1)', ppt: '#ffffff', amt: 40 }] }, // Heavy white ppt PbSO4
    'H_b_iv': { steps: [
        { text: "Add aq NH₃ dropwise", sol: 'rgba(230, 240, 255, 0.1)', ppt: '#ffffff', amt: 25 },
        { text: "Add excess NH₃", sol: 'rgba(230, 240, 255, 0.1)', ppt: '#ffffff', amt: 25 } // Insoluble in excess NH3
    ]},
    'H_b_v': { steps: [
        { text: "Heat Strongly (Solid)", mode: 'strong_heat', sol: 'rgba(0,0,0,0)', ppt: '#a0522d', amt: 5, gasColor: 'rgba(0,0,0,0)' }, // PbO is brown/orange when HOT
        { text: "Allow to Cool", mode: 'strong_heat', sol: 'rgba(0,0,0,0)', ppt: '#f1c40f', amt: 5, gasColor: 'rgba(0,0,0,0)' }, // PbO turns yellow when COLD
        { text: "Add dil HCl", mode: 'tube', sol: 'rgba(230, 240, 255, 0.1)', ppt: null, amt: 0 } // Dissolves
    ]},

    // === SALT I (Potassium Dichromate) ===
    'I_c_i': { steps: [{ text: "Pencil Flame Test", mode: 'pencil_flame', flame: '#9b59b6' }] }, // Lilac (K)
    'I_c_ii': { steps: [{ text: "Add dil HCl", sol: 'rgba(230, 126, 34, 0.7)', ppt: null, amt: 0 }] }, // Remains orange
    'I_c_iii': { steps: [{ text: "Add aq AgNO₃", sol: 'rgba(230, 126, 34, 0.5)', ppt: '#8b0000', amt: 30 }] }, // Dark red ppt Ag2CrO4
    'I_c_iv': { steps: [
        { text: "Add dil H₂SO₄", sol: 'rgba(230, 126, 34, 0.7)', ppt: null, amt: 0 },
        { text: "Add aq Na₂SO₃", sol: 'rgba(46, 204, 113, 0.7)', ppt: null, amt: 0 } // Dichromate reduced to Green Cr3+
    ]},
    'I_c_v': { steps: [
        { text: "Add NaOH dropwise", sol: 'rgba(46, 204, 113, 0.4)', ppt: '#2ecc71', amt: 25 }, // Green ppt Cr(OH)3
        { text: "Add excess NaOH", sol: 'rgba(46, 204, 113, 0.8)', ppt: null, amt: 0 } // Dissolves to green solution
    ]},

    // === SALT J (Copper II Nitrate) ===
    'J_d_i': { steps: [{ text: "Pencil Flame Test", mode: 'pencil_flame', flame: '#1abc9c' }] }, // Blue-Green (Cu)
    'J_d_ii_iii': { steps: [
        { text: "Add dil H₂SO₄ & KI", sol: 'rgba(160, 82, 45, 0.8)', ppt: '#f8fafc', amt: 25 }, // Brown Iodine + White CuI ppt
        { text: "Add Starch", sol: 'rgba(5, 5, 30, 0.95)', ppt: '#f8fafc', amt: 25 }, // Blue-black complex + White ppt hidden inside
        { text: "Add excess Na₂S₂O₃", sol: 'rgba(230, 240, 255, 0.1)', ppt: '#f8fafc', amt: 25 } // Iodine reduced to colorless, revealing the white CuI ppt!
    ]},

    // === SALT K (Zinc Carbonate) ===
    'K_a_i': { steps: [
        { text: "Heat Strongly (Solid)", mode: 'strong_heat', sol: 'rgba(0,0,0,0)', ppt: '#f1c40f', amt: 5, gasColor: 'rgba(0,0,0,0)' }, // ZnO is yellow hot
        { text: "Allow to Cool", mode: 'strong_heat', sol: 'rgba(0,0,0,0)', ppt: '#ffffff', amt: 5, gasColor: 'rgba(0,0,0,0)' } // ZnO is white cold
    ]},
    'K_a_ii': { steps: [{ text: "Add dil HCl", mode: 'effervescence', sol: 'rgba(230, 240, 255, 0.1)', ppt: null, amt: 0 }] }, // Effervescence, dissolves
    'K_a_iii': { steps: [
        { text: "Add NaOH dropwise", sol: 'rgba(230, 240, 255, 0.1)', ppt: '#ffffff', amt: 30 }, // White ppt Zn(OH)2
        { text: "Add excess NaOH", sol: 'rgba(230, 240, 255, 0.1)', ppt: null, amt: 0 } // Dissolves (Amphoteric)
    ]},
    'K_a_iv': { steps: [
        { text: "Add NH₃ dropwise", sol: 'rgba(230, 240, 255, 0.1)', ppt: '#ffffff', amt: 30 }, // White ppt Zn(OH)2
        { text: "Add excess NH₃", sol: 'rgba(230, 240, 255, 0.1)', ppt: null, amt: 0 } // Dissolves (Amphoteric)
    ]},

    // === SALT L (Calcium Chloride) ===
    'L_b_i': { steps: [{ text: "Heat Strongly", mode: 'strong_heat', sol: 'rgba(0,0,0,0)', ppt: '#ffffff', amt: 5 }] }, // White residue
    'L_b_ii': { steps: [{ text: "Pencil Flame Test", mode: 'pencil_flame', flame: '#e74c3c' }] }, // Brick red (Ca)
    'L_b_iii': { steps: [{ text: "Add Conc H₂SO₄", mode: 'effervescence', sol: 'rgba(230, 240, 255, 0.1)', gasColor: 'rgba(255,255,255,0.4)' }] }, // White HCl fumes
    'L_b_iv': { steps: [
        { text: "Add AgNO₃", sol: 'rgba(230, 240, 255, 0.1)', ppt: '#ffffff', amt: 30 }, // White ppt AgCl
        { text: "Add dil HNO₃", sol: 'rgba(230, 240, 255, 0.1)', ppt: '#ffffff', amt: 30 }, // Insoluble
        { text: "Add Conc NH₃", sol: 'rgba(230, 240, 255, 0.1)', ppt: null, amt: 0 } // Soluble!
    ]},

    // === SALT M (Ammonium Iron II Sulphate) ===
    'M_c_i': { steps: [{ text: "Add NaOH & Warm", mode: 'dual_litmus', sol: 'rgba(173, 255, 173, 0.3)', ppt: '#556b2f', amt: 25 }] }, // NH3 gas, green ppt
    'M_c_ii': { steps: [
        { text: "Add BaCl₂", sol: 'rgba(173, 255, 173, 0.3)', ppt: '#ffffff', amt: 30 }, // White ppt BaSO4
        { text: "Add dil HCl", sol: 'rgba(173, 255, 173, 0.3)', ppt: '#ffffff', amt: 30 } // Insoluble
    ]},
    'M_c_iii': { steps: [
        { text: "Add NH₃ dropwise", sol: 'rgba(173, 255, 173, 0.3)', ppt: '#556b2f', amt: 20 },
        { text: "Add excess NH₃", sol: 'rgba(173, 255, 173, 0.3)', ppt: '#556b2f', amt: 30 } // Insoluble green ppt
    ]},
    'M_c_iv': { steps: [
        { text: "Add dil H₂SO₄", sol: 'rgba(173, 255, 173, 0.1)', ppt: null, amt: 0 },
        { text: "Add KMnO₄", sol: 'rgba(245, 222, 179, 0.4)', ppt: null, amt: 0 }, // Fe2+ oxidized to Fe3+ (yellow), KMnO4 decolorized
        { text: "Test d(i): Add NaOH to excess", sol: 'rgba(245, 222, 179, 0.2)', ppt: '#8b4513', amt: 30 }, // Now gives BROWN Fe(OH)3 ppt instead of green!
        { text: "Test d(ii): Add KSCN", sol: 'rgba(139, 0, 0, 0.98)', ppt: null, amt: 0 } // Blood red Fe(SCN)3 complex!
    ]},

    // === SALT N (Sodium Carbonate) ===
    'N_a': { steps: [{ text: "Pencil Flame Test", mode: 'pencil_flame', flame: '#f1c40f' }] }, // Yellow (Na)
    'N_b_i': { steps: [{ text: "Litmus Test (Solution)", mode: 'dual_litmus', sol: 'rgba(230, 240, 255, 0.1)' }] }, // Alkaline solution turns red litmus blue directly
    'N_b_ii': { steps: [{ text: "Add dil HCl (Limewater Test)", mode: 'limewater', sol: 'rgba(230, 240, 255, 0.1)' }] }, // CO2 turns limewater milky
    'N_b_iii': { steps: [{ text: "Add MgSO₄", sol: 'rgba(230, 240, 255, 0.1)', ppt: '#ffffff', amt: 30 }] }, // White ppt MgCO3

    // === SALT O (CaCO3 & NaCl Mixture) ===
    'O_c': { steps: [{ text: "Pencil Flame Test", mode: 'pencil_flame', flame: '#e74c3c' }] }, // Red (Ca) dominates
    'O_d_i': { steps: [{ text: "Boil & Filter Mixture", mode: 'filter', sol: 'rgba(230, 240, 255, 0.1)', ppt: '#ffffff', amt: 25 }] }, // White residue (CaCO3), clear filtrate (NaCl)
    'O_d_ii': { steps: [{ text: "Test Residue + dil HCl", mode: 'effervescence', sol: 'rgba(230, 240, 255, 0.1)' }] }, // Effervescence from Carbonate
    'O_d_iii': { steps: [
        { text: "Test Filtrate + AgNO₃", sol: 'rgba(230, 240, 255, 0.1)', ppt: '#ffffff', amt: 25 }, // White ppt AgCl
        { text: "Add dil HNO₃", sol: 'rgba(230, 240, 255, 0.1)', ppt: '#ffffff', amt: 25 } // Insoluble
    ]},

    // === SALT P (Potassium Bromide) ===
    'P_e_i': { steps: [{ text: "Pencil Flame Test", mode: 'pencil_flame', flame: '#9b59b6' }] }, // Lilac (K)
    'P_e_ii': { steps: [{ text: "Add Conc H₂SO₄", mode: 'effervescence', sol: 'rgba(230, 240, 255, 0.1)', gasColor: 'rgba(160, 82, 45, 0.5)' }] }, // Brown fumes (Br2)
    'P_e_iii': { steps: [
        { text: "Add AgNO₃", sol: 'rgba(230, 240, 255, 0.1)', ppt: '#f5f5dc', amt: 25 }, // Cream ppt AgBr
        { text: "Add dil HNO₃", sol: 'rgba(230, 240, 255, 0.1)', ppt: '#f5f5dc', amt: 25 }, // Insoluble
        { text: "Add Conc NH₃", sol: 'rgba(230, 240, 255, 0.1)', ppt: null, amt: 0 } // Soluble!
    ]},
    // === LIQUID Q (Primary Alcohol / Propan-1-ol) ===
    'Q_i': { steps: [{ text: "Add PCl₅ in Fume Cupboard", mode: 'fume_cupboard', sol: 'rgba(255,255,255,0.1)', gasColor: 'rgba(255,255,255,0.8)' }] }, // Steamy white fumes
    'Q_ii': { steps: [{ text: "Ignite in Crucible", mode: 'crucible_ignition', flame: '#3498db' }] }, // Clean blue flame
    'Q_iii': { steps: [{ text: "Esterification & Pour into Water", mode: 'esterification', sol: 'rgba(255,255,255,0.2)', smell: true }] }, // Sweet fruity smell
    'Q_iv': { steps: [
        { text: "Add K₂Cr₂O₇ & H₂SO₄", sol: 'rgba(230, 126, 34, 0.7)', ppt: null, amt: 0 },
        { text: "Warm Gently", sol: 'rgba(46, 204, 113, 0.7)', ppt: null, amt: 0 } // Primary oxidizes: Orange to Green
    ]},
    'Q_v': { steps: [{ text: "Iodoform Test (KI + NaClO)", mode: 'iodoform', sol: 'rgba(241, 196, 15, 0.3)', ppt: null, amt: 0 }] }, // Negative (No yellow ppt)

    // === LIQUID R (Secondary Alcohol / Propan-2-ol) ===
    'R_i': { steps: [{ text: "Add PCl₅ in Fume Cupboard", mode: 'fume_cupboard', sol: 'rgba(255,255,255,0.1)', gasColor: 'rgba(255,255,255,0.8)' }] }, 
    'R_ii': { steps: [{ text: "Ignite in Crucible", mode: 'crucible_ignition', flame: '#3498db' }] }, 
    'R_iii': { steps: [{ text: "Esterification & Pour into Water", mode: 'esterification', sol: 'rgba(255,255,255,0.2)', smell: true }] }, 
    'R_iv': { steps: [
        { text: "Add K₂Cr₂O₇ & H₂SO₄", sol: 'rgba(230, 126, 34, 0.7)', ppt: null, amt: 0 },
        { text: "Warm Gently", sol: 'rgba(46, 204, 113, 0.7)', ppt: null, amt: 0 } // Secondary oxidizes: Orange to Green
    ]},
    'R_v': { steps: [{ text: "Iodoform Test (KI + NaClO)", mode: 'iodoform', sol: 'rgba(241, 196, 15, 0.3)', ppt: '#f1c40f', amt: 25 }] }, // Positive (Yellow CHI3 ppt)

    // === LIQUID S (Tertiary Alcohol / tert-Butanol) ===
    'S_i': { steps: [{ text: "Add PCl₅ in Fume Cupboard", mode: 'fume_cupboard', sol: 'rgba(255,255,255,0.1)', gasColor: 'rgba(255,255,255,0.8)' }] }, 
    'S_ii': { steps: [{ text: "Ignite in Crucible", mode: 'crucible_ignition', flame: '#f1c40f' }] }, // Slightly yellower flame
    'S_iii': { steps: [{ text: "Esterification & Pour into Water", mode: 'esterification', sol: 'rgba(255,255,255,0.2)', smell: false }] }, // No smell (too slow)
    'S_iv': { steps: [
        { text: "Add K₂Cr₂O₇ & H₂SO₄", sol: 'rgba(230, 126, 34, 0.7)', ppt: null, amt: 0 },
        { text: "Warm Gently", sol: 'rgba(230, 126, 34, 0.7)', ppt: null, amt: 0 } // Tertiary does NOT oxidize: Stays Orange
    ]},
    'S_v': { steps: [{ text: "Iodoform Test (KI + NaClO)", mode: 'iodoform', sol: 'rgba(241, 196, 15, 0.3)', ppt: null, amt: 0 }] }, // Negative
    
    // === COMPOUND T (Ethanal) ===
    'T_i': { steps: [{ text: "Ignite in Crucible", mode: 'crucible_ignition', flame: '#3498db' }] }, // Clean flame
    'T_ii': { steps: [{ text: "Water + Litmus", mode: 'dual_litmus', sol: 'rgba(255,255,255,0.1)' }] }, // Soluble, neutral
    'T_iii': { steps: [
        { text: "Add K₂Cr₂O₇ & H₂SO₄", sol: 'rgba(230, 126, 34, 0.7)', ppt: null, amt: 0 },
        { text: "Warm Mixture", sol: 'rgba(46, 204, 113, 0.7)', ppt: null, amt: 0 } // Oxidizes to acetic acid: Orange to Green
    ]},
    'T_iv': { steps: [{ text: "Iodoform Test (I₂ + NaOH)", mode: 'iodoform', sol: 'rgba(241, 196, 15, 0.3)', ppt: '#f1c40f', amt: 25 }] }, // Positive (Yellow CHI3 ppt)
    'T_v': { steps: [
        { text: "Prepare Tollen's Reagent", sol: 'rgba(255,255,255,0.1)', ppt: null, amt: 0 }, 
        { text: "Add T & Heat in Bath", mode: 'silver_mirror', sol: 'rgba(255,255,255,0.1)' } // Silver Mirror!
    ]},

    // === COMPOUND U (Propanone/Acetone) ===
    'U_i': { steps: [{ text: "Ignite in Crucible", mode: 'crucible_ignition', flame: '#3498db' }] }, 
    'U_ii': { steps: [{ text: "Add 2,4-DNPH", sol: 'rgba(230, 126, 34, 0.4)', ppt: '#e67e22', amt: 30 }] }, // Orange ppt (Carbonyl)
    'U_iii': { steps: [
        { text: "Add Fehling's Solution", sol: 'rgba(52, 152, 219, 0.8)', ppt: null, amt: 0 }, // Deep blue
        { text: "Heat", sol: 'rgba(52, 152, 219, 0.8)', ppt: null, amt: 0 } // Negative! Stays blue (ketone)
    ]},
    'U_iv': { steps: [{ text: "Iodoform Test (KI + NaClO)", mode: 'iodoform', sol: 'rgba(241, 196, 15, 0.3)', ppt: '#f1c40f', amt: 25 }] }, // Positive (Yellow CHI3 ppt)
    'U_v': { steps: [
        { text: "Filter (iv)", mode: 'filter', sol: 'rgba(255,255,255,0.1)', ppt: '#f1c40f', amt: 25 }, // Clear filtrate (contains acetate)
        { text: "Add neutral FeCl₃ to Filtrate", mode: 'tube', sol: 'rgba(139, 69, 19, 0.8)', ppt: null, amt: 0 } // Red-brown solution (Acetate test)
    ]},

    // === COMPOUND V (Benzaldehyde) ===
    'V_i': { steps: [{ text: "Add 2,4-DNPH", sol: 'rgba(230, 126, 34, 0.4)', ppt: '#e67e22', amt: 30 }] }, // Orange ppt (Carbonyl)
    'V_ii': { steps: [
        { text: "Add KMnO₄ & H₂SO₄", sol: 'rgba(148, 0, 211, 0.8)', ppt: null, amt: 0 },
        { text: "Warm Mixture", sol: 'rgba(255,255,255,0.1)', ppt: null, amt: 0 } // Decolorizes (Oxidizes to benzoic acid)
    ]},
    'V_iii': { steps: [{ text: "Iodoform Test (I₂ + NaOH)", mode: 'iodoform', sol: 'rgba(241, 196, 15, 0.3)', ppt: null, amt: 0 }] }, // Negative
    'V_iv': { steps: [
        { text: "Prepare Tollen's Reagent", sol: 'rgba(255,255,255,0.1)', ppt: null, amt: 0 }, 
        { text: "Add V & Heat in Bath", mode: 'silver_mirror', sol: 'rgba(255,255,255,0.1)' } // Silver Mirror!
    ]},
    'V_v': { steps: [
        { text: "Add Fehling's Solution", sol: 'rgba(52, 152, 219, 0.8)', ppt: null, amt: 0 }, 
        { text: "Heat", sol: 'rgba(52, 152, 219, 0.8)', ppt: null, amt: 0 } // Negative! Aromatic aldehydes do not reduce Fehling's easily.
    ]},
    'V_vi': { steps: [{ text: "Stand on Watch Glass", mode: 'watch_glass', smell: true }] }, // Evaporates to white benzoic acid crystals, smells of almonds
    // === SOLID W (Phenol) ===
    'W_i': { steps: [{ text: "Stand & Smell", mode: 'watch_glass', smell: true, smellText: "♨️ Distinct 'Carbolic' Odour" }] }, 
    'W_ii': { steps: [
        { text: "Add neutral FeCl₃", sol: 'rgba(75, 0, 130, 0.95)', ppt: null, amt: 0 }, // DEEP VIOLET COMPLEX!
        { text: "Heat", sol: 'rgba(75, 0, 130, 0.95)', ppt: null, amt: 0 } // Remains violet
    ]},
    'W_iii': { steps: [{ text: "Water + Litmus", mode: 'dual_litmus', sol: 'rgba(255,255,255,0.1)' }] }, // Blue turns Red (Weak acid)
    'W_iv': { steps: [{ text: "Ignite in Crucible", mode: 'crucible_ignition', flame: '#e67e22', sooty: true }] }, // Aromatic = Sooty, smoky flame

    // === SOLID X (Sodium Oxalate) ===
    'X_i': { steps: [{ text: "Pencil Flame Test", mode: 'pencil_flame', flame: '#f1c40f' }] }, // Yellow (Na)
    'X_ii': { steps: [{ text: "Heat Strongly (Ignite Gas)", mode: 'strong_heat', sol: 'rgba(0,0,0,0)', ppt: '#ffffff', amt: 5, gasFlame: '#3498db' }] }, // Evolves CO which burns with a pale blue flame at the mouth
    'X_iii': { steps: [{ text: "Add Conc H₂SO₄", mode: 'effervescence', sol: 'rgba(255,255,255,0.1)', gasColor: 'rgba(255,255,255,0)' }] }, // Evolves CO and CO2 (colorless)
    'X_iv': { steps: [{ text: "Water + Litmus", mode: 'dual_litmus', sol: 'rgba(255,255,255,0.1)' }] }, // Neutral/slightly alkaline
    'X_v': { steps: [
        { text: "Add neutral FeCl₃", sol: 'rgba(245, 222, 179, 0.3)', ppt: null, amt: 0 }, // Pale yellow (iron color)
        { text: "Heat", sol: 'rgba(245, 222, 179, 0.3)', ppt: null, amt: 0 } // Negative for violet complex
    ]},

    // === SOLID Y (Sodium Benzoate) ===
    'Y_i': { steps: [{ text: "Pencil Flame Test", mode: 'pencil_flame', flame: '#f1c40f', sooty: true }] }, // Yellow (Na) BUT sooty due to aromatic ring
    'Y_ii': { steps: [{ text: "Add Conc H₂SO₄", mode: 'tube', sol: 'rgba(255,255,255,0.1)', ppt: '#ffffff', amt: 30 }] }, // White ppt of benzoic acid forms
    'Y_iii': { steps: [{ text: "Heat with Soda Lime", mode: 'strong_heat', sol: 'rgba(0,0,0,0)', ppt: '#ffffff', amt: 15, gasFlame: '#e67e22', sooty: true }] }, // Decarboxylates to Benzene, which burns very sooty at the mouth
    'Y_iv': { steps: [{ text: "Water + Litmus", mode: 'dual_litmus', sol: 'rgba(255,255,255,0.1)' }] }, // Alkaline (salt of strong base/weak acid) turns red litmus blue
    'Y_v': { steps: [
        { text: "Add neutral FeCl₃", sol: 'rgba(245, 222, 179, 0.3)', ppt: '#d2b48c', amt: 30 }, // Buff/flesh-colored precipitate of basic iron(III) benzoate
        { text: "Heat", sol: 'rgba(245, 222, 179, 0.3)', ppt: '#d2b48c', amt: 30 } 
    ]},
    // === COMPOUND AA (Ethanoic Acid) ===
    'AA_i': { steps: [{ text: "Esterification & Smell", mode: 'esterification', sol: 'rgba(255,255,255,0.1)', smell: true }] },
    'AA_ii': { steps: [{ text: "Water + Litmus", mode: 'dual_litmus', sol: 'rgba(255,255,255,0.1)' }] }, // Blue turns red (acid)
    'AA_iii': { steps: [{ text: "Add neutral FeCl₃", sol: 'rgba(245, 222, 179, 0.4)', ppt: null, amt: 0 }] }, // Negative (Yellow/orange, no violet)

    // === COMPOUND BB (Benzaldehyde) ===
    'BB_i': { steps: [{ text: "Ignite in Crucible", mode: 'crucible_ignition', flame: '#e67e22', sooty: true }] }, // Aromatic sooty flame
    'BB_ii': { steps: [{ text: "Add 2,4-DNPH", sol: 'rgba(230, 126, 34, 0.4)', ppt: '#e67e22', amt: 30 }] }, // Orange ppt
    'BB_iii': { steps: [
        { text: "Prepare Tollen's Reagent", sol: 'rgba(255,255,255,0.1)', ppt: null, amt: 0 }, 
        { text: "Add BB & Heat", mode: 'silver_mirror', sol: 'rgba(255,255,255,0.1)' } // Silver Mirror
    ]},
    'BB_iv': { steps: [
        { text: "Add Conc NaOH & Warm", sol: 'rgba(245, 222, 179, 0.2)', ppt: null, amt: 0 }, // Cannizzaro (dissolves)
        { text: "Add Conc HCl", sol: 'rgba(245, 222, 179, 0.2)', ppt: '#ffffff', amt: 35 } // Heavy white ppt of Benzoic Acid!
    ]},

    // === COMPOUND CC (Benzyl Alcohol) ===
    'CC_i': { steps: [{ text: "Ignite in Crucible", mode: 'crucible_ignition', flame: '#e67e22', sooty: true }] }, // Aromatic sooty
    'CC_ii': { steps: [{ text: "Add PCl₅ in Fume Cupboard", mode: 'fume_cupboard', sol: 'rgba(255,255,255,0.1)', gasColor: 'rgba(255,255,255,0.8)' }] }, // White fumes
    'CC_iii': { steps: [
        { text: "Add K₂Cr₂O₇ & H₂SO₄", sol: 'rgba(230, 126, 34, 0.7)', ppt: null, amt: 0 },
        { text: "Warm Mixture", sol: 'rgba(46, 204, 113, 0.7)', ppt: null, amt: 0 } // Oxidizes to Benzoic Acid: Orange to Green
    ]},

    // === COMPOUND DD (Phenylamine/Aniline) ===
    'DD_i': { steps: [
        { text: "Add Water", sol: 'rgba(255,255,255,0.1)', ppt: 'rgba(200,200,200,0.5)', amt: 10 }, // Insoluble drops
        { text: "Add HCl", sol: 'rgba(255,255,255,0.1)', ppt: null, amt: 0 }, // Dissolves to salt
        { text: "Add excess NaOH", sol: 'rgba(255,255,255,0.1)', ppt: 'rgba(200,200,200,0.5)', amt: 15 } // Amine reprecipitates
    ]},
    'DD_ii': { steps: [{ text: "Add HCl & NaNO₂", mode: 'effervescence', sol: 'rgba(255,255,255,0.1)' }] }, // Diazotization/N2 gas
    'DD_iii': { steps: [{ text: "Add Bromine Water", sol: 'rgba(255,255,255,0.1)', ppt: '#ffffff', amt: 40 }] }, // Heavy white ppt (Tribromoaniline)

    // === COMPOUND EE (Acetamide) ===
    'EE_i': { steps: [{ text: "Add NaOH & Warm", mode: 'dual_litmus', sol: 'rgba(255,255,255,0.1)' }] }, // NH3 gas turns red litmus blue
    'EE_ii': { steps: [{ text: "Add HCl & NaNO₂", mode: 'effervescence', sol: 'rgba(255,255,255,0.1)' }] }, // N2 gas

    // === COMPOUND FF (Glycine) ===
    'FF_i': { steps: [{ text: "Water + Litmus", mode: 'dual_litmus', sol: 'rgba(255,255,255,0.1)' }] }, // Neutral/Amphoteric
    'FF_ii': { steps: [{ text: "Add Na₂CO₃ (Limewater)", mode: 'limewater', sol: 'rgba(255,255,255,0.1)' }] }, // CO2 evolved (acts as acid)
    'FF_iii': { steps: [{ text: "Add HCl & NaNO₂", mode: 'effervescence', sol: 'rgba(255,255,255,0.1)' }] }, // N2 gas (primary amine group)
    'FF_iv': { steps: [
        { text: "Add CuSO₄", sol: 'rgba(173, 216, 230, 0.4)', ppt: '#3498db', amt: 20 }, // Pale blue ppt initially
        { text: "Add NaOH", sol: 'rgba(0, 0, 139, 0.95)', ppt: null, amt: 0 } // Deep blue chelate complex!
    ]},

    // === COMPOUND JJ (Glucose) ===
    'JJ_i': { steps: [{ text: "Ignite in Crucible", mode: 'crucible_ignition', flame: '#e67e22', smell: true, smellText: "♨️ Smell of Burnt Sugar" }] }, 
    'JJ_ii': { steps: [
        { text: "Add Fehling's Solution", sol: 'rgba(52, 152, 219, 0.8)', ppt: null, amt: 0 }, 
        { text: "Heat", sol: 'rgba(255, 255, 255, 0.1)', ppt: '#c0392b', amt: 40 } // Brick Red ppt!
    ]},
    'JJ_iii': { steps: [
        { text: "Prepare Tollen's Reagent", sol: 'rgba(255,255,255,0.1)', ppt: null, amt: 0 }, 
        { text: "Add JJ & Heat", mode: 'silver_mirror', sol: 'rgba(255,255,255,0.1)' } // Silver Mirror!
    ]},

    // === COMPOUND KK (Sucrose) ===
    'KK_i': { steps: [{ text: "Ignite in Crucible", mode: 'crucible_ignition', flame: '#e67e22', smell: true, smellText: "♨️ Smell of Burnt Sugar" }] }, 
    'KK_ii': { steps: [{ text: "Add Conc H₂SO₄ & Warm", mode: 'charring', sol: 'rgba(0,0,0,0.8)' }] }, // CHARRING ANIMATION
    'KK_iii': { steps: [
        { text: "Add Fehling's Solution", sol: 'rgba(52, 152, 219, 0.8)', ppt: null, amt: 0 }, 
        { text: "Boil", sol: 'rgba(52, 152, 219, 0.8)', ppt: null, amt: 0 } // Negative! (Non-reducing)
    ]},
    'KK_iv': { steps: [
        { text: "Boil with HCl & Neutralize", sol: 'rgba(255,255,255,0.1)', ppt: null, amt: 0 }, // Hydrolysis
        { text: "Add Fehling's & Heat", sol: 'rgba(255,255,255,0.1)', ppt: '#c0392b', amt: 40 } // Now Positive! Brick Red ppt!
    ]},

    // === COMPOUND LL (Starch) ===
    'LL_i': { steps: [{ text: "Heat Strongly", mode: 'strong_heat', sol: 'rgba(0,0,0,0)', ppt: '#333333', amt: 10, gasColor: 'rgba(255,255,255,0.5)' }] }, // Chars
    'LL_ii': { steps: [
        { text: "Add KIO₃, KI, H₂SO₄", sol: 'rgba(160, 82, 45, 0.7)', ppt: null, amt: 0 }, // Brown Iodine forms
        { text: "Add LL (Starch)", sol: 'rgba(5, 5, 30, 0.98)', ppt: null, amt: 0 } // Deep Blue-Black!
    ]},
    'LL_iii': { steps: [{ text: "Add Na₂S₂O₃", sol: 'rgba(255,255,255,0.1)', ppt: null, amt: 0 }] } // Decolorizes back to clear
};

const baseColors = {
    'A': 'rgba(230, 240, 255, 0.1)', 
    'B': 'rgba(245, 222, 179, 0.5)', 
    'C': 'rgba(173, 216, 230, 0.5)',
    'D': 'rgba(230, 240, 255, 0.1)', 
    'E': 'rgba(230, 240, 255, 0.1)', 
    'F': 'rgba(245, 222, 179, 0.5)',
    'G': 'rgba(173, 255, 173, 0.3)', // Fe2+ pale green
    'H': 'rgba(255, 255, 255, 0.0)', // Solid (insoluble initially)
    'I': 'rgba(230, 126, 34, 0.7)',  // Cr2O7 2- bright orange
    'J': 'rgba(173, 216, 230, 0.5)',  // Cu2+ pale blue
    'K': 'rgba(255, 255, 255, 0.0)', // Solid initially
    'L': 'rgba(255, 255, 255, 0.0)', 
    'M': 'rgba(173, 255, 173, 0.3)', // Pale green Fe2+
    'N': 'rgba(230, 240, 255, 0.1)', // Colorless
    'O': 'rgba(255, 255, 255, 0.3)', // Milky suspension before filtering
    'P': 'rgba(230, 240, 255, 0.1)',  // Colorless
    'Q': 'rgba(255, 255, 255, 0.1)', 
    'R': 'rgba(255, 255, 255, 0.1)', 
    'S': 'rgba(255, 255, 255, 0.1)',
    'T': 'rgba(255, 255, 255, 0.1)', 
    'U': 'rgba(255, 255, 255, 0.1)', 
    'V': 'rgba(255, 255, 255, 0.1)',
    'W': 'rgba(255, 255, 255, 0.1)', 
    'X': 'rgba(255, 255, 255, 0.1)', 
    'Y': 'rgba(255, 255, 255, 0.1)',
    'AA': 'rgba(255, 255, 255, 0.1)', 
    'BB': 'rgba(255, 255, 255, 0.1)', 
    'CC': 'rgba(255, 255, 255, 0.1)',
    'DD': 'rgba(255, 255, 255, 0.1)', 
    'EE': 'rgba(255, 255, 255, 0.1)', 
    'FF': 'rgba(255, 255, 255, 0.1)',
    'JJ': 'rgba(255, 255, 255, 0.1)', 
    'KK': 'rgba(255, 255, 255, 0.1)', 
    'LL': 'rgba(255, 255, 255, 0.1)'
};

function renderQualitativeAdvancedWorkspace() {
    document.getElementById('simulation-render-target').innerHTML = `
        <div class="sim-container-row">
            <div class="sim-controls-col">
                <div style="margin-bottom: 15px; background: #0f172a; padding: 10px; border-radius: 6px; border: 1px solid #f39c12;">
                    <label style="color:#fff; font-size:0.8rem; font-weight:bold; display:block; margin-bottom:8px; text-align:center;"><i class="fas fa-vial"></i> 1. Select Unknown Salt</label>
                    <select id="qa-adv-salt" onchange="window.updateProtocolDropdown()" style="width:100%; padding:8px; background:#1e293b; color:#f39c12; border:1px solid #475569; border-radius:4px; font-family:'Poppins'; font-weight:bold; outline:none; cursor:pointer;">
                        <option value="A">Salt A</option>
                        <option value="B">Salt B</option>
                        <option value="C">Salt C</option>
                        <option value="D">Salt D</option>
                        <option value="E">Salt E</option>
                        <option value="F">Salt F</option>
                        <option value="G">Salt G</option>
                        <option value="H">Salt H</option>
                        <option value="I">Salt I</option>
                        <option value="J">Salt J</option>
                        <option value="K">Salt K</option>
                        <option value="L">Salt L</option>
                        <option value="M">Salt M</option>
                        <option value="N">Salt N</option>
                        <option value="O">Salt O</option>
                        <option value="P">Salt P</option>
                        <option value="Q">Liquid Q</option>
                        <option value="R">Liquid R</option>
                        <option value="S">Liquid S</option>
                        <option value="T">Compound T</option>
                        <option value="U">Compound U</option>
                        <option value="V">Compound V</option>
                        <option value="W">Solid W</option>
                        <option value="X">Solid X</option>
                        <option value="Y">Solid Y</option>
                        <option value="AA">Salt AA</option>
                        <option value="BB">Salt BB</option>
                        <option value="CC">Salt CC</option>
                        <option value="DD">Salt DD</option>
                        <option value="EE">Salt EE</option>
                        <option value="FF">Salt FF</option>
                        <option value="JJ">Salt JJ</option>
                        <option value="KK">Salt KK</option>
                        <option value="LL">Salt LL</option>
                    </select>
                </div>

                <div style="margin-bottom: 15px; background: #0f172a; padding: 10px; border-radius: 6px; border: 1px solid #3498db;">
                    <label style="color:#fff; font-size:0.8rem; font-weight:bold; display:block; margin-bottom:8px; text-align:center;"><i class="fas fa-list-ol"></i> 2. Select Test Protocol</label>
                    <select id="qa-adv-test" onchange="window.resetAdvQA()" style="width:100%; padding:8px; background:#1e293b; color:#3498db; border:1px solid #475569; border-radius:4px; font-family:'Poppins'; font-weight:bold; outline:none; cursor:pointer;">
                        <!-- Injected dynamically -->
                    </select>
                </div>

                <div style="background: #1e293b; padding: 15px; border-radius: 8px; border: 1px solid #334155;">
                    <button id="btn-qa-step" onclick="window.executeNextQAStep()" style="width:100%; margin-bottom:10px; background:#2ecc71; color:#0f172a; border:none; padding:15px; border-radius:6px; font-weight:bold; cursor:pointer; font-size: 1.05rem; transition: 0.2s;"><i class="fas fa-play"></i> Execute Next Step</button>
                    <button onclick="window.resetAdvQA()" style="width:100%; background:#475569; color:#fff; border:none; padding:10px; border-radius:6px; font-weight:bold; cursor:pointer; transition: 0.2s;"><i class="fas fa-sync"></i> Wash & Reset Tube</button>
                </div>
            </div>

            <div class="sim-canvas-col" style="background: radial-gradient(circle, #1e293b 0%, #0f172a 100%); border-radius:8px; display:flex; justify-content:center; align-items:center; border: 2px solid #334155;">
                <canvas id="canvas-qa-adv" width="400" height="420"></canvas>
            </div>
        </div>
    `;
    
    window.updateProtocolDropdown();
    qaAdvLoop();
}

window.updateProtocolDropdown = function() {
    let salt = document.getElementById('qa-adv-salt').value;
    let testSelect = document.getElementById('qa-adv-test');
    testSelect.innerHTML = '';
    
    if (salt === 'A') {
        testSelect.innerHTML += `<option value="A_i">Test (i): Dichromate & Thiosulphate</option>`;
        testSelect.innerHTML += `<option value="A_ii">Test (ii): Halide Test</option>`;
        testSelect.innerHTML += `<option value="A_iii">Test (iii): NaOH</option>`;
        testSelect.innerHTML += `<option value="A_iv">Test (iv): Flame Test</option>`;
    } else if (salt === 'B') {
        testSelect.innerHTML += `<option value="B_i">Test (i): NaOH</option>`;
        testSelect.innerHTML += `<option value="B_ii">Test (ii): NH₃</option>`;
        testSelect.innerHTML += `<option value="B_iii">Test (iii): Sodium Ethanoate + Heat</option>`;
        testSelect.innerHTML += `<option value="B_iv">Test (iv): KSCN & SnCl₂ Reduction</option>`;
        testSelect.innerHTML += `<option value="B_v">Test (v): Halide Test</option>`;
    } else if (salt === 'C') {
        testSelect.innerHTML += `<option value="C_i">Test (i): BaCl₂ & HCl</option>`;
        testSelect.innerHTML += `<option value="C_ii">Test (ii): NaOH (Drop & Excess)</option>`;
        testSelect.innerHTML += `<option value="C_iii">Test (iii): NH₃ (Drop & Excess)</option>`;
        testSelect.innerHTML += `<option value="C_iv_v">Test (iv & v): KI, Filter, Starch, Thiosulphate</option>`;
    } else if (salt === 'D') {
        testSelect.innerHTML += `<option value="D_a_i">Test (i): Pencil Flame Test</option>`;
        testSelect.innerHTML += `<option value="D_b_ii">Test (ii): H₂SO₄ & K₂Cr₂O₇</option>`;
        testSelect.innerHTML += `<option value="D_iii">Test (iii): Conc HNO₃ & Warm</option>`;
        testSelect.innerHTML += `<option value="D_iv">Test (iv): HCl (Limewater Test)</option>`;
        testSelect.innerHTML += `<option value="D_v">Test (v): Iodine Solution</option>`;
    } else if (salt === 'E') {
        testSelect.innerHTML += `<option value="E_i">Test (i): NaOH</option>`;
        testSelect.innerHTML += `<option value="E_ii">Test (ii): Na₂CO₃</option>`;
        testSelect.innerHTML += `<option value="E_iii">Test (iii): Na₂SO₄</option>`;
        testSelect.innerHTML += `<option value="E_iv">Test (iv): Pencil Flame Test</option>`;
        testSelect.innerHTML += `<option value="E_v">Test (v): Heat Strongly</option>`;
        testSelect.innerHTML += `<option value="E_vi">Test (vi): Brown Ring Test</option>`;
    } else if (salt === 'F') {
        testSelect.innerHTML += `<option value="F_ci">Test (i): NaOH & Warm (Litmus)</option>`;
        testSelect.innerHTML += `<option value="F_cii">Test (ii): NaOH then HCl</option>`;
        testSelect.innerHTML += `<option value="F_ciii">Test (iii): NaOH then BaCl₂</option>`;
        testSelect.innerHTML += `<option value="F_civ">Test (iv): HCl then Zinc Powder</option>`;
    } else if (salt === 'G') {
        testSelect.innerHTML += `<option value="G_a_i">Test a(i): Add NaOH</option>`;
        testSelect.innerHTML += `<option value="G_a_ii">Test a(ii): H₂SO₄ & KMnO₄ Reduction</option>`;
    } else if (salt === 'H') {
        testSelect.innerHTML += `<option value="H_b_i">Test b(i): Add dil HNO₃</option>`;
        testSelect.innerHTML += `<option value="H_b_ii">Test b(ii): Add NaOH</option>`;
        testSelect.innerHTML += `<option value="H_b_iii">Test b(iii): Add dil H₂SO₄</option>`;
        testSelect.innerHTML += `<option value="H_b_iv">Test b(iv): Add aq NH₃</option>`;
        testSelect.innerHTML += `<option value="H_b_v">Test b(v): Heat Strongly</option>`;
    } else if (salt === 'I') {
        testSelect.innerHTML += `<option value="I_c_i">Test c(i): Flame Test</option>`;
        testSelect.innerHTML += `<option value="I_c_ii">Test c(ii): Add dil HCl</option>`;
        testSelect.innerHTML += `<option value="I_c_iii">Test c(iii): Add aq AgNO₃</option>`;
        testSelect.innerHTML += `<option value="I_c_iv">Test c(iv): H₂SO₄ & Na₂SO₃ Reduction</option>`;
        testSelect.innerHTML += `<option value="I_c_v">Test c(v): NaOH to excess</option>`;
    } else if (salt === 'J') {
        testSelect.innerHTML += `<option value="J_d_i">Test d(i): Flame Test</option>`;
        testSelect.innerHTML += `<option value="J_d_ii_iii">Test d(ii & iii): KI, Starch, Na₂S₂O₃</option>`;
    } else if (salt === 'K') {
        testSelect.innerHTML += `<option value="K_a_i">Test a(i): Heat strongly</option>`;
        testSelect.innerHTML += `<option value="K_a_ii">Test a(ii): Add dil HCl</option>`;
        testSelect.innerHTML += `<option value="K_a_iii">Test a(iii): NaOH to excess</option>`;
        testSelect.innerHTML += `<option value="K_a_iv">Test a(iv): NH₃ to excess</option>`;
    } else if (salt === 'L') {
        testSelect.innerHTML += `<option value="L_b_i">Test b(i): Heat strongly</option>`;
        testSelect.innerHTML += `<option value="L_b_ii">Test b(ii): Flame Test on residue</option>`;
        testSelect.innerHTML += `<option value="L_b_iii">Test b(iii): Add Conc H₂SO₄</option>`;
        testSelect.innerHTML += `<option value="L_b_iv">Test b(iv): Dissolve, AgNO₃, HNO₃, NH₃</option>`;
    } else if (salt === 'M') {
        testSelect.innerHTML += `<option value="M_c_i">Test c(i): NaOH & warm (Litmus)</option>`;
        testSelect.innerHTML += `<option value="M_c_ii">Test c(ii): BaCl₂ then HCl</option>`;
        testSelect.innerHTML += `<option value="M_c_iii">Test c(iii): NH₃ to excess</option>`;
        testSelect.innerHTML += `<option value="M_c_iv">Test c(iv): Redox Sequence (H₂SO₄, KMnO₄, NaOH, KSCN)</option>`;
    } else if (salt === 'N') {
        testSelect.innerHTML += `<option value="N_a">Test (a): Flame Test</option>`;
        testSelect.innerHTML += `<option value="N_b_i">Test b(i): Litmus Test</option>`;
        testSelect.innerHTML += `<option value="N_b_ii">Test b(ii): Limewater Test</option>`;
        testSelect.innerHTML += `<option value="N_b_iii">Test b(iii): Add MgSO₄</option>`;
    } else if (salt === 'O') {
        testSelect.innerHTML += `<option value="O_c">Test (c): Flame Test</option>`;
        testSelect.innerHTML += `<option value="O_d_i">Test d(i): Boil & Filter Mixture</option>`;
        testSelect.innerHTML += `<option value="O_d_ii">Test d(ii): Residue + dil HCl</option>`;
        testSelect.innerHTML += `<option value="O_d_iii">Test d(iii): Filtrate + AgNO₃ & HNO₃</option>`;
    } else if (salt === 'P') {
        testSelect.innerHTML += `<option value="P_e_i">Test e(i): Flame Test</option>`;
        testSelect.innerHTML += `<option value="P_e_ii">Test e(ii): Add Conc H₂SO₄</option>`;
        testSelect.innerHTML += `<option value="P_e_iii">Test e(iii): AgNO₃, HNO₃, Conc NH₃</option>`;
    } else if (salt === 'Q' || salt === 'R' || salt === 'S') {
        testSelect.innerHTML += `<option value="${salt}_i">Test (i): PCl₅ in Fume Cupboard</option>`;
        testSelect.innerHTML += `<option value="${salt}_ii">Test (ii): Ignite in Crucible</option>`;
        testSelect.innerHTML += `<option value="${salt}_iii">Test (iii): Esterification (Smell test)</option>`;
        testSelect.innerHTML += `<option value="${salt}_iv">Test (iv): Oxidation (K₂Cr₂O₇ + H₂SO₄)</option>`;
        testSelect.innerHTML += `<option value="${salt}_v">Test (v): Iodoform Test</option>`;
    } else if (salt === 'T') {
        testSelect.innerHTML += `<option value="T_i">Test (i): Ignite in Crucible</option>`;
        testSelect.innerHTML += `<option value="T_ii">Test (ii): Shake with Water & Litmus</option>`;
        testSelect.innerHTML += `<option value="T_iii">Test (iii): K₂Cr₂O₇ + H₂SO₄ (Oxidation)</option>`;
        testSelect.innerHTML += `<option value="T_iv">Test (iv): Iodoform Test</option>`;
        testSelect.innerHTML += `<option value="T_v">Test (v): Tollen's Reagent Test</option>`;
    } else if (salt === 'U') {
        testSelect.innerHTML += `<option value="U_i">Test (i): Ignite in Crucible</option>`;
        testSelect.innerHTML += `<option value="U_ii">Test (ii): Add 2,4-DNPH</option>`;
        testSelect.innerHTML += `<option value="U_iii">Test (iii): Fehling's Solution</option>`;
        testSelect.innerHTML += `<option value="U_iv">Test (iv): Iodoform Test</option>`;
        testSelect.innerHTML += `<option value="U_v">Test (v): Filter & Neutral FeCl₃</option>`;
    } else if (salt === 'V') {
        testSelect.innerHTML += `<option value="V_i">Test (i): Add 2,4-DNPH</option>`;
        testSelect.innerHTML += `<option value="V_ii">Test (ii): KMnO₄ + H₂SO₄ (Oxidation)</option>`;
        testSelect.innerHTML += `<option value="V_iii">Test (iii): Iodoform Test</option>`;
        testSelect.innerHTML += `<option value="V_iv">Test (iv): Tollen's Reagent Test</option>`;
        testSelect.innerHTML += `<option value="V_v">Test (v): Fehling's Solution</option>`;
        testSelect.innerHTML += `<option value="V_vi">Test (vi): Stand on Watch Glass</option>`;
    } else if (salt === 'W') {
        testSelect.innerHTML += `<option value="W_i">Test (i): Stand & Smell</option>`;
        testSelect.innerHTML += `<option value="W_ii">Test (ii): Add neutral FeCl₃</option>`;
        testSelect.innerHTML += `<option value="W_iii">Test (iii): Litmus Test</option>`;
        testSelect.innerHTML += `<option value="W_iv">Test (iv): Ignite in Crucible</option>`;
    } else if (salt === 'X') {
        testSelect.innerHTML += `<option value="X_i">Test (i): Flame Test</option>`;
        testSelect.innerHTML += `<option value="X_ii">Test (ii): Heat Strongly & Burn Gas</option>`;
        testSelect.innerHTML += `<option value="X_iii">Test (iii): Add Conc H₂SO₄</option>`;
        testSelect.innerHTML += `<option value="X_iv">Test (iv): Litmus Test</option>`;
        testSelect.innerHTML += `<option value="X_v">Test (v): Add neutral FeCl₃</option>`;
    } else if (salt === 'Y') {
        testSelect.innerHTML += `<option value="Y_i">Test (i): Flame Test</option>`;
        testSelect.innerHTML += `<option value="Y_ii">Test (ii): Add Conc H₂SO₄ & Warm</option>`;
        testSelect.innerHTML += `<option value="Y_iii">Test (iii): Heat with Soda Lime & Burn Gas</option>`;
        testSelect.innerHTML += `<option value="Y_iv">Test (iv): Litmus Test</option>`;
        testSelect.innerHTML += `<option value="Y_v">Test (v): Add neutral FeCl₃</option>`;
    } else if (salt === 'AA') {
        testSelect.innerHTML += `<option value="AA_i">Test (i): Esterification</option>`;
        testSelect.innerHTML += `<option value="AA_ii">Test (ii): Litmus Test</option>`;
        testSelect.innerHTML += `<option value="AA_iii">Test (iii): Add neutral FeCl₃</option>`;
    } else if (salt === 'BB') {
        testSelect.innerHTML += `<option value="BB_i">Test (i): Ignite in Crucible</option>`;
        testSelect.innerHTML += `<option value="BB_ii">Test (ii): Add 2,4-DNPH</option>`;
        testSelect.innerHTML += `<option value="BB_iii">Test (iii): Tollen's Reagent</option>`;
        testSelect.innerHTML += `<option value="BB_iv">Test (iv): Cannizzaro (NaOH then HCl)</option>`;
    } else if (salt === 'CC') {
        testSelect.innerHTML += `<option value="CC_i">Test (i): Ignite in Crucible</option>`;
        testSelect.innerHTML += `<option value="CC_ii">Test (ii): PCl₅ in Fume Cupboard</option>`;
        testSelect.innerHTML += `<option value="CC_iii">Test (iii): K₂Cr₂O₇ + H₂SO₄ (Oxidation)</option>`;
    } else if (salt === 'DD') {
        testSelect.innerHTML += `<option value="DD_i">Test (i): Water, HCl, NaOH</option>`;
        testSelect.innerHTML += `<option value="DD_ii">Test (ii): HNO₂ (NaNO₂ + HCl)</option>`;
        testSelect.innerHTML += `<option value="DD_iii">Test (iii): Bromine Water</option>`;
    } else if (salt === 'EE') {
        testSelect.innerHTML += `<option value="EE_i">Test (i): NaOH & Warm (Litmus)</option>`;
        testSelect.innerHTML += `<option value="EE_ii">Test (ii): HNO₂ (NaNO₂ + HCl)</option>`;
    } else if (salt === 'FF') {
        testSelect.innerHTML += `<option value="FF_i">Test (i): Water & Litmus</option>`;
        testSelect.innerHTML += `<option value="FF_ii">Test (ii): Na₂CO₃ (Limewater)</option>`;
        testSelect.innerHTML += `<option value="FF_iii">Test (iii): HNO₂ (NaNO₂ + HCl)</option>`;
        testSelect.innerHTML += `<option value="FF_iv">Test (iv): CuSO₄ & NaOH (Chelation)</option>`;
    } else if (salt === 'JJ') {
        testSelect.innerHTML += `<option value="JJ_i">Test (i): Ignite in Crucible</option>`;
        testSelect.innerHTML += `<option value="JJ_ii">Test (ii): Fehling's Solution</option>`;
        testSelect.innerHTML += `<option value="JJ_iii">Test (iii): Tollen's Reagent</option>`;
    } else if (salt === 'KK') {
        testSelect.innerHTML += `<option value="KK_i">Test (i): Ignite in Crucible</option>`;
        testSelect.innerHTML += `<option value="KK_ii">Test (ii): Conc H₂SO₄ (Dehydration/Charring!)</option>`;
        testSelect.innerHTML += `<option value="KK_iii">Test (iii): Fehling's Solution</option>`;
        testSelect.innerHTML += `<option value="KK_iv">Test (iv): Hydrolysis then Fehling's</option>`;
    } else if (salt === 'LL') {
        testSelect.innerHTML += `<option value="LL_i">Test (i): Heat Strongly</option>`;
        testSelect.innerHTML += `<option value="LL_ii">Test (ii): Starch-Iodine Formation</option>`;
        testSelect.innerHTML += `<option value="LL_iii">Test (iii): Decolorize with Na₂S₂O₃</option>`;
    }
    window.resetAdvQA();
    
};

window.resetAdvQA = function() {
    qaAdvState.salt = document.getElementById('qa-adv-salt').value;
    qaAdvState.testId = document.getElementById('qa-adv-test').value;
    qaAdvState.stepIndex = 0;
    qaAdvState.tubeLevel = 30;
    qaAdvState.solColor = baseColors[qaAdvState.salt];
    qaAdvState.pptColor = null;
    qaAdvState.pptAmount = 0;
    qaAdvState.mode = 'tube';
    qaAdvState.flameColor = '#3498db';

    let protocol = testProtocols[qaAdvState.testId];
    let btn = document.getElementById('btn-qa-step');
    btn.disabled = false;
    btn.style.background = '#2ecc71';
    btn.style.cursor = 'pointer';
    btn.innerHTML = `<i class="fas fa-play"></i> Step 1: ${protocol.steps[0].text}`;
};

window.executeNextQAStep = function() {
    let protocol = testProtocols[qaAdvState.testId];
    let step = protocol.steps[qaAdvState.stepIndex];

    if (step.mode) {
        qaAdvState.mode = step.mode;
        if (step.flame) qaAdvState.flameColor = step.flame;
    } else {
        qaAdvState.mode = 'tube';
    }

    if (step.sol) qaAdvState.solColor = step.sol;
    if (step.ppt !== undefined) qaAdvState.pptColor = step.ppt;
    if (step.amt !== undefined) qaAdvState.pptAmount = step.amt;
    qaAdvState.tubeLevel = Math.min(90, qaAdvState.tubeLevel + 15);

    qaAdvState.stepIndex++;
    
    let btn = document.getElementById('btn-qa-step');
    
    // Check if we just triggered a time-delayed animation
    if (qaAdvState.mode === 'watch_glass' || qaAdvState.mode === 'charring') {
        qaAdvState.lastTick = performance.now(); // Start evaporation timer
        qaAdvState.charStart = performance.now(); // Start charring timer
        btn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Please Wait...`;
        btn.disabled = true;
        btn.style.background = '#475569';
        btn.style.cursor = 'not-allowed';
    } 
    // Standard step progression
    else if (qaAdvState.stepIndex < protocol.steps.length) {
        btn.innerHTML = `<i class="fas fa-play"></i> Next: ${protocol.steps[qaAdvState.stepIndex].text}`;
    } 
    // End of protocol
    else {
        btn.disabled = true;
        btn.style.background = '#475569';
        btn.style.cursor = 'not-allowed';
        btn.innerHTML = `<i class="fas fa-check"></i> Protocol Complete`;
    }
};

function qaAdvLoop() {
    const canvas = document.getElementById('canvas-qa-adv');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0,0, canvas.width, canvas.height);

    const cx = canvas.width / 2;
    const bottomY = 380;
    const tubeHeight = 280;
    const topY = bottomY - tubeHeight;
    const radius = 35;

    let protocol = testProtocols[qaAdvState.testId];
    let step = protocol ? protocol.steps[qaAdvState.stepIndex - 1] : {};

    // --- DRAW NICHROME WIRE FLAME TEST ---
    if (qaAdvState.mode === 'flame') {
        let burnerGrad = ctx.createLinearGradient(cx - 15, 0, cx + 15, 0);
        burnerGrad.addColorStop(0, '#7f8c8d'); burnerGrad.addColorStop(0.5, '#bdc3c7'); burnerGrad.addColorStop(1, '#7f8c8d');
        ctx.fillStyle = burnerGrad; ctx.fillRect(cx - 15, bottomY - 50, 30, 100);
        
        ctx.fillStyle = 'rgba(41, 128, 185, 0.6)';
        ctx.beginPath(); ctx.moveTo(cx-20, bottomY-50); ctx.quadraticCurveTo(cx, bottomY-200, cx+20, bottomY-50); ctx.fill();
        
        ctx.fillStyle = qaAdvState.flameColor;
        ctx.beginPath(); ctx.moveTo(cx-12, bottomY-50); ctx.quadraticCurveTo(cx, bottomY-150, cx+12, bottomY-50); ctx.fill();

        ctx.strokeStyle = '#95a5a6'; ctx.lineWidth = 3;
        ctx.beginPath(); ctx.moveTo(cx + 150, bottomY - 120); ctx.lineTo(cx + 10, bottomY - 120); ctx.stroke();
        ctx.beginPath(); ctx.arc(cx, bottomY - 120, 10, 0, Math.PI*2); ctx.stroke();
        
        qaAdvState.animId = requestAnimationFrame(qaAdvLoop);
        return;
    }

    // --- DRAW GRAPHITE PENCIL FLAME TEST ---
    if (qaAdvState.mode === 'pencil_flame') {
        let burnerGrad = ctx.createLinearGradient(cx - 15, 0, cx + 15, 0);
        burnerGrad.addColorStop(0, '#7f8c8d'); burnerGrad.addColorStop(0.5, '#bdc3c7'); burnerGrad.addColorStop(1, '#7f8c8d');
        ctx.fillStyle = burnerGrad; ctx.fillRect(cx - 15, bottomY - 50, 30, 100);
        
        ctx.fillStyle = 'rgba(41, 128, 185, 0.6)';
        ctx.beginPath(); ctx.moveTo(cx-20, bottomY-50); ctx.quadraticCurveTo(cx, bottomY-200, cx+20, bottomY-50); ctx.fill();
        
        ctx.fillStyle = qaAdvState.flameColor;
        ctx.beginPath(); ctx.moveTo(cx-12, bottomY-50); ctx.quadraticCurveTo(cx, bottomY-160 + (Math.random()*10), cx+12, bottomY-50); ctx.fill();

        if (step && step.sooty) {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
            for(let i=0; i<15; i++) {
                let sx = cx - 10 + Math.random()*20;
                let sy = bottomY - 140 - ((performance.now()/(15 + Math.random()*10)) % 80);
                ctx.beginPath(); ctx.arc(sx, sy, Math.random()*3+1, 0, Math.PI*2); ctx.fill();
            }
        }

        ctx.save();
        ctx.translate(cx + 80, bottomY - 140);
        ctx.rotate(-Math.PI / 6); 
        
        ctx.fillStyle = '#f1c40f'; ctx.fillRect(0, -8, 150, 16);
        ctx.fillStyle = '#e67e22'; ctx.fillRect(0, -8, 150, 3); ctx.fillRect(0, 5, 150, 3);
        ctx.fillStyle = '#deb887';
        ctx.beginPath(); ctx.moveTo(0, -8); ctx.lineTo(-30, 0); ctx.lineTo(0, 8); ctx.fill();
        
        ctx.fillStyle = '#2c3e50';
        ctx.beginPath(); ctx.moveTo(-20, -3); ctx.lineTo(-30, 0); ctx.lineTo(-20, 3); ctx.fill();
        ctx.restore();
        
        qaAdvState.animId = requestAnimationFrame(qaAdvLoop);
        return;
    }

    // --- DRAW FUME CUPBOARD (PCl5 Test) ---
    if (qaAdvState.mode === 'fume_cupboard') {
        ctx.fillStyle = '#2c3e50'; ctx.fillRect(cx - 100, bottomY - 250, 200, 280); 
        ctx.strokeStyle = '#7f8c8d'; ctx.lineWidth = 10; ctx.strokeRect(cx - 100, bottomY - 250, 200, 280); 
        ctx.fillStyle = 'rgba(255, 255, 255, 0.1)'; ctx.fillRect(cx - 100, bottomY - 250, 200, 200); 
        
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.beginPath(); ctx.moveTo(cx - 15, bottomY - 120); ctx.lineTo(cx - 15, bottomY - 20); ctx.arc(cx, bottomY - 20, 15, Math.PI, 0, true); ctx.lineTo(cx + 15, bottomY - 120); ctx.fill();
        
        ctx.fillStyle = (step && step.gasColor) ? step.gasColor : 'rgba(255,255,255,0)';
        for(let i=0; i<30; i++) {
            let fx = cx - 40 + Math.random()*80;
            let fy = bottomY - 120 - ((performance.now()/(20 + Math.random()*20)) % 130);
            ctx.beginPath(); ctx.arc(fx, fy, Math.random()*15+5, 0, Math.PI*2); ctx.fill();
        }
        qaAdvState.animId = requestAnimationFrame(qaAdvLoop);
        return;
    }

    // --- DRAW CRUCIBLE IGNITION ---
    if (qaAdvState.mode === 'crucible_ignition') {
        ctx.fillStyle = '#ecf0f1';
        ctx.beginPath(); ctx.moveTo(cx - 40, bottomY - 20); ctx.quadraticCurveTo(cx, bottomY, cx + 40, bottomY - 20); ctx.lineTo(cx + 40, bottomY - 15); ctx.quadraticCurveTo(cx, bottomY + 5, cx - 40, bottomY - 15); ctx.fill();
        
        ctx.fillStyle = (step && step.flame) ? step.flame : '#3498db';
        ctx.beginPath(); ctx.moveTo(cx - 20, bottomY - 18); ctx.quadraticCurveTo(cx, bottomY - 120 + (Math.random()*20), cx + 20, bottomY - 18); ctx.fill();
        
        if (step && step.sooty) {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
            for(let i=0; i<20; i++) {
                let sx = cx - 15 + Math.random()*30;
                let sy = bottomY - 80 - ((performance.now()/(15 + Math.random()*10)) % 100);
                ctx.beginPath(); ctx.arc(sx, sy, Math.random()*4+2, 0, Math.PI*2); ctx.fill();
            }
        }

        qaAdvState.animId = requestAnimationFrame(qaAdvLoop);
        return;
    }

    // --- DRAW ESTERIFICATION (Smell Test) ---
    if (qaAdvState.mode === 'esterification') {
        ctx.fillStyle = 'rgba(112, 161, 255, 0.2)'; ctx.fillRect(cx - 50, bottomY - 80, 100, 80);
        ctx.strokeStyle = '#bdc3c7'; ctx.lineWidth = 3; ctx.strokeRect(cx - 50, bottomY - 80, 100, 80);
        
        if (step && step.smell) {
            let floatY = bottomY - 120 - ((performance.now()/30) % 50);
            ctx.fillStyle = `rgba(232, 67, 147, ${1 - ((bottomY - 120 - floatY)/50)})`;
            ctx.font = 'bold 16px Poppins'; ctx.textAlign = 'center';
            ctx.fillText(step.smellText || "♨️ Sweet Fruity Odour Detected!", cx, floatY);
        }
        qaAdvState.animId = requestAnimationFrame(qaAdvLoop);
        return;
    }

    if (qaAdvState.mode === 'iodoform') { qaAdvState.mode = 'tube'; } // Fall through to draw standard tube

    // --- DRAW SILVER MIRROR TEST (Tollen's) ---
    if (qaAdvState.mode === 'silver_mirror') {
        let fluidH = (qaAdvState.tubeLevel / 100) * tubeHeight;
        let fluidTop = bottomY - fluidH;

        let mirrorGrad = ctx.createLinearGradient(cx - radius, 0, cx + radius, 0);
        mirrorGrad.addColorStop(0, '#7f8c8d'); mirrorGrad.addColorStop(0.2, '#ffffff'); mirrorGrad.addColorStop(0.5, '#bdc3c7'); mirrorGrad.addColorStop(0.8, '#ecf0f1'); mirrorGrad.addColorStop(1, '#95a5a6');

        ctx.fillStyle = mirrorGrad;
        ctx.beginPath(); ctx.moveTo(cx - radius + 4, fluidTop); ctx.lineTo(cx - radius + 4, bottomY - radius); ctx.arc(cx, bottomY - radius, radius - 4, Math.PI, 0, false); ctx.lineTo(cx + radius - 4, fluidTop); ctx.closePath(); ctx.fill();
        
        ctx.beginPath(); ctx.ellipse(cx, fluidTop, radius - 4, 6, 0, 0, Math.PI*2);
        ctx.fillStyle = '#ecf0f1'; ctx.fill(); ctx.strokeStyle = '#7f8c8d'; ctx.lineWidth = 1; ctx.stroke();

        ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)'; ctx.lineWidth = 2; 
        ctx.beginPath(); ctx.moveTo(cx - radius, topY); ctx.lineTo(cx - radius, bottomY - radius); ctx.arc(cx, bottomY - radius, radius, Math.PI, 0, false); ctx.lineTo(cx + radius, topY); ctx.stroke();
        ctx.beginPath(); ctx.ellipse(cx, topY, radius+4, 8, 0, 0, Math.PI*2); ctx.stroke();

        qaAdvState.animId = requestAnimationFrame(qaAdvLoop);
        return;
    }

    // --- DRAW WATCH GLASS (Evaporation/Oxidation) ---
    if (qaAdvState.mode === 'watch_glass') {
        ctx.fillStyle = 'rgba(236, 240, 241, 0.3)'; ctx.strokeStyle = 'rgba(189, 195, 199, 0.8)'; ctx.lineWidth = 3;
        ctx.beginPath(); ctx.moveTo(cx - 100, bottomY - 50); ctx.quadraticCurveTo(cx, bottomY, cx + 100, bottomY - 50); ctx.fill(); ctx.stroke();
        
        let elapsed = (performance.now() - qaAdvState.lastTick) / 1000;
        let progress = Math.min(1.0, elapsed / 8.0); 
        
        let puddleW = 70 * (1 - progress);
        if (puddleW > 0) {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
            ctx.beginPath(); ctx.ellipse(cx, bottomY - 20, puddleW, puddleW*0.2, 0, 0, Math.PI*2); ctx.fill();
        }

        ctx.fillStyle = '#ffffff';
        let numCrystals = Math.floor(progress * 50);
        for(let i=0; i<numCrystals; i++) {
            let seed = (i * 997) % 100; let cx_pos = cx - 50 + seed; let cy_pos = bottomY - 25 + ((i * 123) % 15);
            ctx.beginPath(); ctx.moveTo(cx_pos, cy_pos); ctx.lineTo(cx_pos-4, cy_pos+6); ctx.lineTo(cx_pos+4, cy_pos+6); ctx.fill();
        }

        if (step && step.smell) {
            let floatY = bottomY - 80 - ((performance.now()/30) % 50);
            ctx.fillStyle = `rgba(155, 89, 182, ${1 - ((bottomY - 80 - floatY)/50)})`;
            ctx.font = 'bold 16px Poppins'; ctx.textAlign = 'center';
            ctx.fillText(step.smellText || "♨️ Scent of Bitter Almonds!", cx, floatY);
        }

        if (progress === 1.0 && document.getElementById('btn-qa-step').innerHTML.includes('Wait')) {
             let btn = document.getElementById('btn-qa-step');
             btn.innerHTML = `<i class="fas fa-play"></i> Next Step`;
             btn.disabled = false;
             btn.style.background = '#2ecc71';
             btn.style.cursor = 'pointer';
        }

        qaAdvState.animId = requestAnimationFrame(qaAdvLoop);
        return;
    }

    // --- DRAW FILTRATION SETUP ---
    if (qaAdvState.mode === 'filter') {
        ctx.fillStyle = qaAdvState.solColor; 
        ctx.beginPath(); ctx.moveTo(cx - 40, bottomY); ctx.lineTo(cx - 20, bottomY - 60); ctx.lineTo(cx + 20, bottomY - 60); ctx.lineTo(cx + 40, bottomY); ctx.fill();
        ctx.strokeStyle = 'rgba(255,255,255,0.8)'; ctx.lineWidth = 2; ctx.stroke();
        
        ctx.fillStyle = '#f8fafc'; 
        ctx.beginPath(); ctx.moveTo(cx - 45, bottomY - 120); ctx.lineTo(cx, bottomY - 50); ctx.lineTo(cx + 45, bottomY - 120); ctx.fill();
        ctx.strokeStyle = 'rgba(255,255,255,0.5)'; ctx.lineWidth = 4; ctx.stroke();
        
        ctx.fillStyle = qaAdvState.solColor;
        let dropY = bottomY - 50 + ((performance.now() * 0.1) % 50);
        ctx.beginPath(); ctx.ellipse(cx, dropY, 3, 5, 0, 0, Math.PI*2); ctx.fill();

        qaAdvState.animId = requestAnimationFrame(qaAdvLoop);
        return;
    }

    // --- DRAW LIMEWATER DELIVERY SYSTEM ---
    if (qaAdvState.mode === 'limewater') {
        ctx.fillStyle = qaAdvState.solColor;
        ctx.fillRect(cx - 70, bottomY - 60, 40, 60);
        ctx.strokeStyle = 'rgba(255,255,255,0.8)'; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(cx - 70, bottomY - 120); ctx.lineTo(cx - 70, bottomY); ctx.lineTo(cx - 30, bottomY); ctx.lineTo(cx - 30, bottomY - 120); ctx.stroke();
        
        let opacity = Math.min(1.0, (qaAdvState.stepIndex * 0.5)); 
        ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`; 
        ctx.fillRect(cx + 30, bottomY - 60, 40, 60);
        ctx.beginPath(); ctx.moveTo(cx + 30, bottomY - 100); ctx.lineTo(cx + 30, bottomY); ctx.lineTo(cx + 70, bottomY); ctx.lineTo(cx + 70, bottomY - 100); ctx.stroke();

        ctx.strokeStyle = 'rgba(200, 220, 255, 0.9)'; ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(cx - 50, bottomY - 100); ctx.lineTo(cx - 50, bottomY - 150); ctx.lineTo(cx + 50, bottomY - 150); ctx.lineTo(cx + 50, bottomY - 20);  
        ctx.stroke();

        ctx.fillStyle = 'rgba(255,255,255,0.9)';
        let by = bottomY - 20 - ((performance.now()*0.05) % 40);
        ctx.beginPath(); ctx.arc(cx + 50, by, 3, 0, Math.PI*2); ctx.fill();
        ctx.beginPath(); ctx.arc(cx + 45, by + 10, 2, 0, Math.PI*2); ctx.fill();

        qaAdvState.animId = requestAnimationFrame(qaAdvLoop);
        return;
    }

    // --- DRAW THERMAL DECOMPOSITION (Strong Heat & Ignited Gas) ---
    if (qaAdvState.mode === 'strong_heat') {
        let protocol = testProtocols[qaAdvState.testId];
        let step = protocol ? protocol.steps[qaAdvState.stepIndex - 1] : {};

        const tubeR = 35;
        const tubeLen = 220;

        // 1. Draw Bunsen Burner (Background)
        let burnerX = cx - 50;
        let burnerY = bottomY;
        
        let bGrad = ctx.createLinearGradient(burnerX - 15, 0, burnerX + 15, 0);
        bGrad.addColorStop(0, '#7f8c8d'); bGrad.addColorStop(0.5, '#bdc3c7'); bGrad.addColorStop(1, '#7f8c8d');
        ctx.fillStyle = bGrad;
        ctx.fillRect(burnerX - 15, burnerY - 100, 30, 100);

        // Bunsen Flame
        ctx.fillStyle = 'rgba(41, 128, 185, 0.7)';
        ctx.beginPath(); ctx.moveTo(burnerX - 25, burnerY - 100); ctx.quadraticCurveTo(burnerX, burnerY - 220 + (Math.random()*15), burnerX + 25, burnerY - 100); ctx.fill();
        ctx.fillStyle = 'rgba(52, 152, 219, 0.9)';
        ctx.beginPath(); ctx.moveTo(burnerX - 12, burnerY - 100); ctx.quadraticCurveTo(burnerX, burnerY - 170 + (Math.random()*10), burnerX + 12, burnerY - 100); ctx.fill();

        ctx.save();
        // Position and tilt the tube
        ctx.translate(cx + 30, bottomY - 160); 
        ctx.rotate(Math.PI / 4); // 45 degrees

        // 2. Define Tube Path for Clipping (Keeps gas/solids inside the glass)
        ctx.beginPath();
        ctx.moveTo(-tubeR, -tubeLen/2);
        ctx.lineTo(-tubeR, tubeLen/2 - tubeR);
        ctx.arc(0, tubeLen/2 - tubeR, tubeR, Math.PI, 0, true);
        ctx.lineTo(tubeR, -tubeLen/2);
        ctx.closePath();
        
        ctx.save();
        ctx.clip(); // <--- This fixes the bleeding!

        // Draw Gas
        if (step && step.gasColor) {
            ctx.fillStyle = step.gasColor;
            ctx.fillRect(-tubeR, -tubeLen/2, tubeR*2, tubeLen);
            
            // Animated gas clouds
            ctx.fillStyle = 'rgba(255,255,255,0.1)';
            for(let i=0; i<20; i++) {
                let gx = -tubeR + Math.random()*(tubeR*2);
                let gy = tubeLen/2 - ((performance.now()/(15+Math.random()*10)) % tubeLen);
                ctx.beginPath(); ctx.arc(gx, gy, Math.random()*15+5, 0, Math.PI*2); ctx.fill();
            }
        }

        // Draw Solid Residue
        let pptCol = (step && step.ppt) ? step.ppt : '#ffffff';
        let amt = (step && step.amt) ? step.amt + 10 : 25;
        ctx.fillStyle = pptCol;
        
        ctx.beginPath();
        ctx.moveTo(-tubeR, tubeLen/2 - amt);
        // Jagged surface for realism
        for(let px = -tubeR; px <= tubeR; px+=5) {
            ctx.lineTo(px, tubeLen/2 - amt - Math.random()*6); 
        }
        ctx.lineTo(tubeR, tubeLen/2);
        ctx.lineTo(-tubeR, tubeLen/2);
        ctx.fill();

        // Add a red glow if actively heating
        if (step && step.text && step.text.includes("Heat") && !step.text.includes("Cool")) {
             ctx.fillStyle = 'rgba(231, 76, 60, 0.4)';
             ctx.beginPath(); ctx.arc(0, tubeLen/2 - tubeR/2, tubeR, 0, Math.PI*2); ctx.fill();
        }

        ctx.restore(); // Remove clip for glass rendering

        // 3. Draw Photorealistic Glass
        let glassGrad = ctx.createLinearGradient(-tubeR, 0, tubeR, 0);
        glassGrad.addColorStop(0, 'rgba(100, 116, 139, 0.4)');
        glassGrad.addColorStop(0.1, 'rgba(255, 255, 255, 0.1)');
        glassGrad.addColorStop(0.85, 'rgba(255, 255, 255, 0.1)');
        glassGrad.addColorStop(0.95, 'rgba(255, 255, 255, 0.8)');
        glassGrad.addColorStop(1, 'rgba(100, 116, 139, 0.5)');

        ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.lineWidth = 3;
        ctx.fillStyle = glassGrad;
        
        ctx.beginPath();
        ctx.moveTo(-tubeR, -tubeLen/2);
        ctx.lineTo(-tubeR, tubeLen/2 - tubeR);
        ctx.arc(0, tubeLen/2 - tubeR, tubeR, Math.PI, 0, true);
        ctx.lineTo(tubeR, -tubeLen/2);
        ctx.fill(); ctx.stroke();

        // Tube Lip
        ctx.beginPath(); ctx.ellipse(0, -tubeLen/2, tubeR+4, 8, 0, 0, Math.PI*2); 
        ctx.strokeStyle = 'rgba(203, 213, 225, 0.9)'; ctx.lineWidth=3; ctx.stroke();
        ctx.beginPath(); ctx.ellipse(0, -tubeLen/2, tubeR+2, 6, 0, 0, Math.PI*2); 
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)'; ctx.lineWidth=1; ctx.stroke();
        
        // Glass Glare
        ctx.fillStyle = 'rgba(255,255,255,0.4)';
        ctx.beginPath();
        ctx.moveTo(-tubeR + 8, -tubeLen/2 + 12);
        ctx.lineTo(-tubeR + 8, tubeLen/2 - tubeR);
        ctx.arc(0, tubeLen/2 - tubeR, tubeR - 8, Math.PI, Math.PI*0.75, true);
        ctx.lineTo(-tubeR + 14, -tubeLen/2 + 12);
        ctx.fill();

        // 4. GAS IGNITION AT MOUTH OF TUBE
        if (step && step.gasFlame) {
            ctx.fillStyle = step.gasFlame;
            ctx.beginPath(); ctx.moveTo(-15, -tubeLen/2 - 10); ctx.quadraticCurveTo(0, -tubeLen/2 - 100 + (Math.random()*20), 15, -tubeLen/2 - 10); ctx.fill();
            
            if (step.sooty) {
                ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
                for(let i=0; i<15; i++) {
                    let sx = -15 + Math.random()*30;
                    let sy = -tubeLen/2 - 30 - ((performance.now()/(15 + Math.random()*10)) % 80);
                    ctx.beginPath(); ctx.arc(sx, sy, Math.random()*4+1, 0, Math.PI*2); ctx.fill();
                }
            }
        }

        ctx.restore();

        qaAdvState.animId = requestAnimationFrame(qaAdvLoop);
        return;
    }

    // --- DRAW CHARRING (Dehydration of Sugar) ---
    if (qaAdvState.mode === 'charring') {
        // Draw normal glass tube first
        ctx.strokeStyle = 'rgba(200, 210, 220, 0.9)'; ctx.lineWidth = 4;
        ctx.beginPath(); ctx.moveTo(cx - radius, topY); ctx.lineTo(cx - radius, bottomY - radius); ctx.arc(cx, bottomY - radius, radius, Math.PI, 0, false); ctx.lineTo(cx + radius, topY); ctx.stroke();
        ctx.beginPath(); ctx.ellipse(cx, topY, radius+4, 6, 0, 0, Math.PI*2); ctx.stroke();

        // Calculate growth based on time since step started
        if (!qaAdvState.charStart) qaAdvState.charStart = performance.now();
        let elapsed = (performance.now() - qaAdvState.charStart) / 1000;
        let progress = Math.min(1.0, elapsed / 6.0); // Grows over 6 seconds
        
        // The expanding black carbon mass
        let charH = progress * (tubeHeight + 80); // Grows OUT of the tube!
        let charTop = bottomY - charH;

        ctx.fillStyle = '#1a1a1a'; // Pitch black carbon
        
        // Draw the main lumpy column
        ctx.beginPath();
        ctx.moveTo(cx - radius + 5, bottomY - radius);
        
        // Wavy sides pushing out of tube
        let currentW = radius - 5;
        if (charTop < topY) currentW = radius + 15; // Expands outward when free of tube

        ctx.lineTo(cx - currentW, charTop);
        
        // Bubbling, porous top surface
        for(let px = cx - currentW; px <= cx + currentW; px += 8) {
            ctx.lineTo(px, charTop - 15 + Math.sin(px + elapsed*10)*15 + Math.random()*10);
        }
        
        ctx.lineTo(cx + currentW, charTop);
        ctx.lineTo(cx + radius - 5, bottomY - radius);
        ctx.arc(cx, bottomY - radius, radius - 5, 0, Math.PI, false);
        ctx.fill();

        // Add porous texture holes
        ctx.fillStyle = '#000000';
        let numHoles = Math.floor(progress * 150);
        for(let i=0; i<numHoles; i++) {
            let hx = cx - currentW + 5 + ((i * 37) % (currentW*2 - 10));
            let hy = bottomY - 10 - ((i * 91) % charH);
            ctx.beginPath(); ctx.arc(hx, hy, 2 + ((i*13)%4), 0, Math.PI*2); ctx.fill();
        }

        // Steamy H2O / SO2 fumes venting off the top
        ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
        for(let i=0; i<20; i++) {
            let fx = cx - 40 + Math.random()*80;
            let fy = charTop - ((performance.now()/(15 + Math.random()*10)) % 100);
            ctx.beginPath(); ctx.arc(fx, fy, Math.random()*8+4, 0, Math.PI*2); ctx.fill();
        }

        if (progress === 1.0 && document.getElementById('btn-qa-step').innerHTML.includes('Wait')) {
             let btn = document.getElementById('btn-qa-step');
             btn.innerHTML = `<i class="fas fa-play"></i> Next Step`;
             btn.disabled = false;
             btn.style.background = '#2ecc71';
             btn.style.cursor = 'pointer';
        }

        qaAdvState.animId = requestAnimationFrame(qaAdvLoop);
        return;
    }

    // --- DRAW STANDARD TEST TUBE ---
    let fluidH = (qaAdvState.tubeLevel / 100) * tubeHeight;
    let fluidTop = bottomY - fluidH;
    
    let solGrad = ctx.createLinearGradient(cx - radius, 0, cx + radius, 0);
    let cRgb = qaAdvState.solColor.match(/\d+(\.\d+)?/g) || [255,255,255,0.1];
    solGrad.addColorStop(0, `rgba(${cRgb[0]}, ${cRgb[1]}, ${cRgb[2]}, ${Math.min(1, parseFloat(cRgb[3])+0.2)})`);
    solGrad.addColorStop(0.5, qaAdvState.solColor);
    solGrad.addColorStop(1, `rgba(${cRgb[0]}, ${cRgb[1]}, ${cRgb[2]}, ${Math.min(1, parseFloat(cRgb[3])+0.2)})`);

    ctx.fillStyle = solGrad;
    ctx.beginPath(); ctx.moveTo(cx - radius + 4, topY); ctx.lineTo(cx - radius + 4, bottomY - radius); ctx.arc(cx, bottomY - radius, radius - 4, Math.PI, 0, true); ctx.arc(cx, bottomY - radius, radius - 4, Math.PI, 0, false); ctx.lineTo(cx + radius - 4, topY);
    
    ctx.save();
    ctx.beginPath(); ctx.moveTo(cx - radius + 4, fluidTop); ctx.lineTo(cx - radius + 4, bottomY - radius); ctx.arc(cx, bottomY - radius, radius - 4, Math.PI, 0, false); ctx.lineTo(cx + radius - 4, fluidTop); ctx.closePath(); ctx.clip();
    ctx.fillRect(cx - radius, fluidTop, radius*2, fluidH);
    
    ctx.beginPath(); ctx.ellipse(cx, fluidTop, radius - 4, 6, 0, 0, Math.PI*2);
    ctx.fillStyle = `rgba(${cRgb[0]}, ${cRgb[1]}, ${cRgb[2]}, ${Math.min(1, parseFloat(cRgb[3])+0.5)})`; ctx.fill(); 

    // --- DRAW DUAL LITMUS PAPERS ---
    if (qaAdvState.mode === 'dual_litmus') {
        let redColor = '#e74c3c';
        let blueColor = '#3498db';

        // Custom Logic based on current test
        if (qaAdvState.testId === 'W_iii' || qaAdvState.testId === 'AA_ii') {
            blueColor = '#e74c3c'; // Turns blue litmus red
        } else if (qaAdvState.testId === 'Y_iv' || qaAdvState.testId === 'EE_i') {
            redColor = '#3498db'; // Turns red litmus blue
        }
        
        // Red Paper
        ctx.fillStyle = redColor;
        ctx.fillRect(cx - 15, fluidTop - 80, 12, 70); 
        ctx.fillStyle = 'rgba(0,0,0,0.15)'; ctx.fillRect(cx - 15, fluidTop - 30, 12, 20); 
        
        // Blue Paper
        ctx.fillStyle = blueColor;
        ctx.fillRect(cx + 3, fluidTop - 80, 12, 70); 
        ctx.fillStyle = 'rgba(0,0,0,0.15)'; ctx.fillRect(cx + 3, fluidTop - 30, 12, 20); 
    }

    // DRAW BROWN RING
    if (qaAdvState.mode === 'brown_ring') {
        ctx.fillStyle = '#5c3a21';
        let ringY = fluidTop + (fluidH / 2); 
        ctx.beginPath(); ctx.ellipse(cx, ringY, radius - 4, 6, 0, 0, Math.PI*2); ctx.fill();
    }

    // Precipitate
    if (qaAdvState.pptColor && qaAdvState.pptAmount > 0) {
        let pptH = (qaAdvState.pptAmount / 100) * tubeHeight;
        let pptTop = bottomY - pptH;
        ctx.fillStyle = qaAdvState.pptColor;
        
        ctx.beginPath(); ctx.moveTo(cx - radius + 5, bottomY - radius);
        for(let px = cx - radius + 5; px <= cx + radius - 5; px += 5) {
            ctx.lineTo(px, pptTop + Math.sin(px/5)*5 + Math.random()*3);
        }
        ctx.lineTo(cx + radius - 5, bottomY - radius); ctx.arc(cx, bottomY - radius, radius - 5, 0, Math.PI, false); ctx.fill();

        for(let i=0; i<40; i++) {
            let px = cx - radius + 10 + Math.random()*(radius*2 - 20);
            let py = pptTop - Math.random()*(fluidH - pptH);
            py += (performance.now()/50) % (fluidH - pptH); if (py > pptTop) py -= (fluidH - pptH);
            ctx.beginPath(); ctx.arc(px, py, Math.random()*2.5+1, 0, Math.PI*2); ctx.fill();
        }
    }
    ctx.restore(); 

    // Glass Tube
    let glassGrad = ctx.createLinearGradient(cx - radius, 0, cx + radius, 0);
    glassGrad.addColorStop(0, 'rgba(100, 116, 139, 0.4)'); glassGrad.addColorStop(0.1, 'rgba(255, 255, 255, 0.1)'); glassGrad.addColorStop(0.85, 'rgba(255, 255, 255, 0.1)'); glassGrad.addColorStop(0.95, 'rgba(255, 255, 255, 0.8)'); glassGrad.addColorStop(1, 'rgba(100, 116, 139, 0.5)');

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)'; ctx.lineWidth = 2; ctx.fillStyle = glassGrad;
    ctx.beginPath(); ctx.moveTo(cx - radius, topY); ctx.lineTo(cx - radius, bottomY - radius); ctx.arc(cx, bottomY - radius, radius, Math.PI, 0, false); ctx.lineTo(cx + radius, topY); ctx.fill(); ctx.stroke();

    ctx.beginPath(); ctx.ellipse(cx, topY, radius+4, 8, 0, 0, Math.PI*2); ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)'; ctx.lineWidth=2; ctx.stroke();
    
    qaAdvState.animId = requestAnimationFrame(qaAdvLoop);
}