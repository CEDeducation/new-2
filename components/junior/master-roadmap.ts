/**
 * THE AUTHOR'S 50-TOPIC MASTER ROADMAP (source: uploaded Pasted markdown.md).
 * Topic titles, scenario descriptions, and learning outcomes retain the source wording.
 * Catalog presence is NOT evidence of a completed simulator.
 * Regenerate with scripts/import-50-topic-blueprint.py.
 */
export type RoadmapSubject = "chemistry" | "biology";
export type RoadmapTopic = { number: number; title: string; subject: RoadmapSubject; grade: number; tier: number; experience: string; objective: string };
export const MASTER_ROADMAP: RoadmapTopic[] = [
  {
    "number": 1,
    "title": "Mixtures Separation & Compound Formation Dynamics",
    "subject": "chemistry",
    "grade": 9,
    "tier": 1,
    "experience": "A sandbox containing scattered iron filings and sulfur powder. Students drag a virtual magnet over the plate to physically separate the magnetic iron (Physical Mixture). They then click a Bunsen burner to heat the mixture; a localized thermal animation forces iron and sulfur atoms to clash, bond, and transform into non-magnetic, solid black Iron Sulphide (FeS) crystals.",
    "objective": "Visually distinguish between physical mixtures and chemical compounds."
  },
  {
    "number": 2,
    "title": "Interactive 3D Periodic Table Matrix",
    "subject": "chemistry",
    "grade": 9,
    "tier": 1,
    "experience": "A glossy 3D Periodic Table dashboard. Clicking any element expands a rotating orbital model. Toggling property sliders maps a colorful heatmap overlay across rows and groups to visually illustrate how metallic character shifts and how atomic radius physically contracts from left to right.",
    "objective": "Master the structural organization of elements and primary periodic variations."
  },
  {
    "number": 3,
    "title": "The Bohr-Rutherford Shell Constructor",
    "subject": "chemistry",
    "grade": 9,
    "tier": 1,
    "experience": "Drag-and-drop particle baskets containing protons, neutrons, and electrons. As students drop particles onto a blank center target, the software automatically snaps electrons into planetary, concentric orbits following strict K, L, M, N layer limits (2, 8, 8 configuration rules).",
    "objective": "Calculate atomic number, mass number, and standard electronic configurations."
  },
  {
    "number": 4,
    "title": "Valence Electrostatic & Ionization Factory",
    "subject": "chemistry",
    "grade": 9,
    "tier": 1,
    "experience": "Students deploy a virtual \"laser beam\" tool to blast valence electrons out of metal shells (shrinking the atom to yield a stable Cation like Na⁺) or force stray electrons into a non-metal shell to complete an octet ring (expanding the atom to yield an Anion like Cl⁻).",
    "objective": "Understand valence configurations, stable octet configurations, and net ionic charges."
  },
  {
    "number": 5,
    "title": "Law of Conservation of Mass Validation Scale",
    "subject": "chemistry",
    "grade": 9,
    "tier": 1,
    "experience": "A closed dual-chamber conical flask filled with colorless Barium Chloride and Sodium Sulphate solutions sits on a digital scale reading to ±0.01g. Students click to tip the flask over; a 3D sub-window animates a rapid double-displacement precipitation reaction forming solid white clouds while the digital weight readout on the scale remains completely frozen.",
    "objective": "Prove the Law of Conservation of Mass empirically through fixed gravimetric balances."
  },
  {
    "number": 6,
    "title": "Ionic Bonding & 3D Crystal Lattice Sandbox",
    "subject": "chemistry",
    "grade": 10,
    "tier": 2,
    "experience": "Side-by-side models of Na and Cl. The student must click and drag the lone valence electron from Na's shell across the space into Cl's open slot. Electrostatic vectors activate, snapping the ions together. The camera zooms out to display thousands of ions falling into a perfectly symmetrical, cubical NaCl lattice.",
    "objective": "Understand electron transfer mechanics and the electrostatic origin of ionic bonds."
  },
  {
    "number": 7,
    "title": "Covalent Electron Cloud Merging & Sharing",
    "subject": "chemistry",
    "grade": 10,
    "tier": 2,
    "experience": "Students select two non-metals (e.g., two Oxygen atoms). They must drag separate valence electrons into a central \"Shared Zone\". Once released, the distinct spherical electron clouds merge like water droplets into a single, unified molecular orbital cloud overlay (representing a stable covalent double bond).",
    "objective": "Comprehend electron pair sharing and discrete molecular orbital formations."
  },
  {
    "number": 8,
    "title": "The Four Fundamental Chemical Reaction Types",
    "subject": "chemistry",
    "grade": 10,
    "tier": 2,
    "experience": "A laboratory bench holding various test materials. Students slide iron nails into blue Copper Sulphate (watching the nail turn red and solution turn green for Displacement) or apply heat to Calcium Carbonate (observing gas bubbling for Decomposition), backed by parallel split-screen atomic rearrangements.",
    "objective": "Identify and systematically classify Combination, Decomposition, Displacement, and Double Displacement reactions."
  },
  {
    "number": 9,
    "title": "Quantitative pH Indicators & Ionic Proportions",
    "subject": "chemistry",
    "grade": 10,
    "tier": 2,
    "experience": "Dropper bottles containing litmus paper, universal indicator fluid, and digital pH probes. Immersing them into household fluids (lemon juice, pure water, liquid soap) triggers fluid color blending mapped across a spectrum panel, alongside real-time ratios showing excessive H⁺ or OH⁻ concentrations.",
    "objective": "Read the pH scale log scale and trace chemical properties via indicator arrays."
  },
  {
    "number": 10,
    "title": "Aliphatic Hydrocarbons & Real-Time IUPAC Naming",
    "subject": "chemistry",
    "grade": 10,
    "tier": 2,
    "experience": "An interactive 2D structure editor canvas. Students click to chain Carbon atoms using single, double, or triple bond nodes and satisfy remaining open links with Hydrogen atoms. As they add, modify, or erase branches, a dynamic text readout updates the IUPAC name in real-time.",
    "objective": "Master basic organic naming conventions, carbon tetravalency, and homologous series."
  },
  {
    "number": 11,
    "title": "Stoichiometric Equation Balancer & Balance Beam",
    "subject": "chemistry",
    "grade": 11,
    "tier": 3,
    "experience": "An unbalanced skeletal reaction (e.g., Al + O₂ → Al₂O₃) sits over a balance scale. Students toggle coefficients, causing atomic weights to drop onto left or right plates. The software hard-locks the subscript digits; trying to change a subscript throws an explicit error: ❌ Modifying subscripts changes the core identity of the substance!",
    "objective": "Perform standard chemical reaction accounting and molar balance calculations."
  },
  {
    "number": 12,
    "title": "Solution Preparation & Molarity Calibration",
    "subject": "chemistry",
    "grade": 11,
    "tier": 3,
    "experience": "Students select a custom dry reagent powder, evaluate its molecular mass, weigh out precise grams on a digital scale, and funnel the solute into a volumetric flask to fill it with distilled water to the meniscus ring to calculate target solution concentrations (e.g., 1.0 M).",
    "objective": "Connect the mass concept to molar concentration calculation sheets."
  },
  {
    "number": 13,
    "title": "Ideal Gas Laws Piston Engine",
    "subject": "chemistry",
    "grade": 11,
    "tier": 3,
    "experience": "A sealed cylinder packed with thousands of bouncing particle spheres. Students slide dashboard targets to alter Volume, Pressure, or Temperature. Forcing volume down rapidly makes particles collide violently with the cylinder walls, making the pressure dial jump and plotting exact real-time curves for Boyle’s and Charles’s laws (PV=nRT).",
    "objective": "Mathematically track gas variable distributions and kinetic behaviors."
  },
  {
    "number": 14,
    "title": "Quantum Mechanics 3D Space Orbitals",
    "subject": "chemistry",
    "grade": 11,
    "tier": 3,
    "experience": "Abandons classical rings. The software renders glowing, translucent 3D electron cloud shapes (s spheres, p dumb-bells, d cross-clovers). Students enter inputs for principal and angular quantum numbers (\\\\(n, l, m_l\\\\)) to rotate the probability geometries 360 degrees.",
    "objective": "Transition from planetary atomic pathways to modern quantum density concepts."
  },
  {
    "number": 15,
    "title": "Aufbau Energy Sequence Electronic Filler",
    "subject": "chemistry",
    "grade": 11,
    "tier": 3,
    "experience": "A tiered quantum ladder showing empty subshell boxes: 1s, 2s, 2p, 3s, 3p. Students drag spin arrows into the boxes. The software strictly validates Hund’s Rule (fill singly first) and the Pauli Exclusion Principle (paired electrons must point in opposite directions). Mismatched spin inputs pop right back out.",
    "objective": "Master the electronic configurations of multi-electron ground states."
  },
  {
    "number": 16,
    "title": "Insulated Bomb Calorimetry & Enthalpy Calculation",
    "subject": "chemistry",
    "grade": 11,
    "tier": 3,
    "experience": "An insulated reaction container fitted with a real-time stirring hotkey and an digital micro-thermometer. Students mix HCl and NaOH, then must rapidly tap the stir key to distribute heat evenly. The system tracks a smooth temperature curve to solve for enthalpy via:",
    "objective": "Experimentally quantify exothermic heat releases and enthalpy configurations."
  },
  {
    "number": 17,
    "title": "Le Chatelier's Reversible Equilibrium Matrix",
    "subject": "chemistry",
    "grade": 11,
    "tier": 3,
    "experience": "A chemical system containing Iron(III) Nitrate and Potassium Thiocyanate in dynamic equilibrium. Adding random reagents changes reactant levels or alters temperature. The background solver applies the law of mass action (\\\\(K\\_{c}\\\\)) to recalculate ion tracking, shifting the fluid opacity across a smooth color spectrum (pale yellow to deep blood-red).",
    "objective": "Visualize equilibrium adjustments under applied environmental stresses."
  },
  {
    "number": 18,
    "title": "High-Precision Acid-Base Titration & pH Breakthrough Graphing",
    "subject": "chemistry",
    "grade": 12,
    "tier": 4,
    "experience": "A volumetric burette assembly where the mouse scroll wheel provides micro-drop precision valve control over a NaOH base titrating an unknown acid sample. An ongoing plot traces an exact S-shaped pH Titration Curve, requiring the user to capture the inflection point.",
    "objective": "Execute precise volumetric titrations and evaluate exact unknown molarities."
  },
  {
    "number": 19,
    "title": "Back-Titration Permanganometry & Redox Mechanics",
    "subject": "chemistry",
    "grade": 12,
    "tier": 4,
    "experience": "A standard redox setup where Oxalic Acid reacts against a dark violet Potassium Permanganate (KMnO₄) burette. The fluid remains colorless drop-by-drop until a single micro-drop hits the threshold, flashing the fluid a permanent, faint pink endpoint hue.",
    "objective": "Master indirect calculations using complex multivalent electron exchanges."
  },
  {
    "number": 20,
    "title": "Organic Functional Group Substitutions & Property Sheets",
    "subject": "chemistry",
    "grade": 12,
    "tier": 4,
    "experience": "A functional organic builder workbench where students splice modifiers like -OH, -CHO, or -COOH onto carbon backbones. Clicking \"Properties\" updates data sheets explaining how intermolecular hydrogen bonds completely shift volatility, boiling points, and water solubility.",
    "objective": "Connect chemical group changes to real physical property profile outputs."
  },
  {
    "number": 21,
    "title": "Systematic Qualitative Inorganic Analysis: Anion Identification",
    "subject": "chemistry",
    "grade": 12,
    "tier": 4,
    "experience": "A multi-tier procedural tube array holding unknown salts. Following formal NCERT wet lab protocols, students add dilute/concentrated acids to trap evolving gases, testing fumes using virtual glowing splint animations or lime water checks to identify anions (CO₃²⁻, Cl⁻).",
    "objective": "Isolate unknown variables via deductive step-by-step chemical validation trees."
  },
  {
    "number": 22,
    "title": "Systematic Qualitative Inorganic Analysis: Cation Separation",
    "subject": "chemistry",
    "grade": 12,
    "tier": 4,
    "experience": "Students work through analytical classification groups by dropping NaOH or NH₄OH into solution targets. The code displays distinct precipitate colors and densities (e.g., reddish-brown gelatinous sludge for Fe³⁺, deep blue solution clearance for Cu²⁺).",
    "objective": "Apply solubility trends to isolate unknown heavy metal radicals."
  },
  {
    "number": 23,
    "title": "Spectrum Emission Flame Photometry",
    "subject": "chemistry",
    "grade": 12,
    "tier": 4,
    "experience": "A platinum loop tool dipped into various metallic paste salts and thrust over a blue Bunsen burner cone. The flame shifts colors (e.g., Persistent Golden Yellow for Na, Brick Red for Ca) while an interactive bright emission spectrum line strip unlocks above the flame.",
    "objective": "Connect electron energy level drop emissions to quantitative light spectroscopy."
  },
  {
    "number": 24,
    "title": "Galvanic Cell Generation & Nernst Equation Potential",
    "subject": "chemistry",
    "grade": 12,
    "tier": 4,
    "experience": "Two beakers holding metal strips (Zinc/Copper) and an interactive Salt Bridge wire connection link. Adjusting the molar sliders on either beaker drives changes across a digital voltmeter screen. The potential shifts match the Nernst Equation calculation layer:",
    "objective": "Map oxidation-reduction electron streams and quantify variable chemical cell potentials."
  },
  {
    "number": 25,
    "title": "Cryoscopic Depression & Supercooling Phases",
    "subject": "chemistry",
    "grade": 12,
    "tier": 4,
    "experience": "A Beckmann cooling assembly immersed in a salty ice jacket. Adding custom solute weights drops the freezing point below 0.00°C. If the user fails to toggle the continuous stirring shaft key, the timeline injects a realistic supercooling plunge loop artifact before freezing solid.",
    "objective": "Track phase state behaviors using molal depression equations."
  },
  {
    "number": 26,
    "title": "Compound Microscope Manipulation & Cell Staining",
    "subject": "biology",
    "grade": 9,
    "tier": 1,
    "experience": "An onboarding module where students slide an onion peel skin to a glass slide, click a dropper to stain the core nucleus using Iodine solution, place a cover slip, and turn coarse/fine adjustment dials to bring a blurred mesh of rectangular cell walls into sharp focus.",
    "objective": "Master wet mount specimen assembly steps and digital magnification focal tracking."
  },
  {
    "number": 27,
    "title": "3D Eukaryotic Cell Assembly & Organelle Comparison",
    "subject": "biology",
    "grade": 9,
    "tier": 1,
    "experience": "A split structural puzzle board featuring blank 3D plant and animal cell shells. Students drag components like Mitochondria or Central Vacuoles into position. Dropping a cell wall into an animal envelope triggers a rejection prompt: ❌ Error: Cell walls are isolated to plant and fungal kingdoms.",
    "objective": "Differentiate primary structural organelles dividing plant and animal lineages."
  },
  {
    "number": 28,
    "title": "Specialized Human Cell Typology Showroom",
    "subject": "biology",
    "grade": 9,
    "tier": 1,
    "experience": "An interactive collection scanning specific cellular profiles. Students select and cross-section biconcave red blood cells (no nucleus), elongated neuron branches (with synapses), and striated skeletal muscle columns to learn how shape dictates function.",
    "objective": "Core biological understanding that structural form mirrors evolutionary function."
  },
  {
    "number": 29,
    "title": "Interactive 3D Human Skeleton Atlas",
    "subject": "biology",
    "grade": 9,
    "tier": 1,
    "experience": "A fully rotatable 3D human skeletal frame. Scattered bones (Femur, Humerus, Clavicle) must be drag-and-locked into their correct articulation sockets. Clicking joints activates rotation animations showing the difference between ball-and-socket vs. hinge limitations.",
    "objective": "Memorize human bone nomenclature and understand structural mechanics."
  },
  {
    "number": 30,
    "title": "Food Web Interdependence & Cascade Crashing",
    "subject": "biology",
    "grade": 9,
    "tier": 1,
    "experience": "A landscape canvas containing plants, insects, frogs, snakes, and hawks. Students draw energy vectors to link a food web. Toggling a \"Disease Scissor\" icon kills off the primary consumer layer, animating an exponential population boom of vectors and a crash of predators due to starvation.",
    "objective": "Model food web complexity and ecosystem balance vulnerabilities."
  },
  {
    "number": 31,
    "title": "Cell Membrane Osmosis & Plasmolysis Monitor",
    "subject": "biology",
    "grade": 10,
    "tier": 2,
    "experience": "Cells dropped into Hypertonic, Isotonic, or Hypotonic baths. The display splits into two running tracks: the main screen shows the cell shrinking (plasmolysis) or swelling, while a micro zoom circle simultaneously animates water molecules crossing aquaporin channel proteins along the concentration gradient.",
    "objective": "Analyze osmotic pressure effects on plant turgor pressure and animal hemolyses."
  },
  {
    "number": 32,
    "title": "Passive Diffusion vs. ATP-Driven Active Transport",
    "subject": "biology",
    "grade": 10,
    "tier": 2,
    "experience": "A high-zoom membrane layout tracking molecule gates. Students direct simple diffusion for oxygen, click protein channels for facilitated sugar paths, and spend limited ATP token codes to activate sodium-potassium pumps to force ions against a concentration gradient.",
    "objective": "Categorize energy-dependent active transport pathways vs. passive kinetic flows."
  },
  {
    "number": 33,
    "title": "Mendelian Monohybrid Dihybrid Matrix Matching",
    "subject": "biology",
    "grade": 10,
    "tier": 2,
    "experience": "Breeding fields of pea plants matching trait sets (e.g., Round Yellow vs. Wrinkled Green). Crossing generations pops up an mandatory 16-square Punnett Grid overlay. The crop fields populates with sample seeds matching calculated ratios (9:3:3:1) only when the student completes the genotype math grid.",
    "objective": "Apply Mendel's Laws of Segregation and Independent Assortment to genetic crosses."
  },
  {
    "number": 34,
    "title": "Human Digestive Track Alimentary Digestion Monitor",
    "subject": "biology",
    "grade": 10,
    "tier": 2,
    "experience": "Feeding a customizable macronutrient bolus (Carbs/Proteins/Fats) to an avatar. A continuous mechanical animation follows the food mass rolling down the stomach and small intestines, unlocking dynamic scale bars that trace molecular absorption levels at the brush border membrane.",
    "objective": "Map human digestive mechanics and localization coordinates for chemical breakdown."
  },
  {
    "number": 35,
    "title": "Functional 3D Cardiac Cycle & Blood Circulation Track",
    "subject": "biology",
    "grade": 10,
    "tier": 2,
    "experience": "A high-fidelity, muscular 3D model heart pumping in real-time next to a scrolling ECG wave track. Blue deoxygenated streams flood the right chambers toward the lungs while bright red oxygenated vectors blast from the left ventricle into the systemic aorta loop. Sliding a heart rate dial drives the animation speeds up or down.",
    "objective": "Tracing double circulation routes and syncing physical valve timing to electrical cues."
  },
  {
    "number": 36,
    "title": "Plant Tissue Microtome Sectioning & Vascular Matrices",
    "subject": "biology",
    "grade": 11,
    "tier": 3,
    "experience": "A rotary microtome tool used to slice plant stem roots. Staining the slices with Safranin unlocks a compound lens view displaying Monocot layouts (scattered closed vascular bundles) contrasted against Dicot formats (structured rings encasing a active cambium zone).",
    "objective": "Identify internal plant anatomies and evaluate secondary growth potential."
  },
  {
    "number": 37,
    "title": "Transpiration Pull Cohesion-Tension Highway",
    "subject": "biology",
    "grade": 11,
    "tier": 3,
    "experience": "A deep zoom tracking water movement through vascular cross-sections. Toggling guard cells open activates an upward Cohesion-Tension Pull animation, displaying water molecules ascending like a continuous link chain up xylem tubes, driven by leaf evaporation and water molecule attraction.",
    "objective": "Understand plant water transport dynamics and pressure-flow mechanics."
  },
  {
    "number": 38,
    "title": "Photosynthesis Part A: Thylakoid Light Energy Transducer",
    "subject": "biology",
    "grade": 11,
    "tier": 3,
    "experience": "Inside a thylakoid landscape, students direct variable light spectrum wavelengths onto Photosystem II. The animation renders photons falling like a rain shower, unzipping water molecules (Photolysis) to flash oxygen gas bubbles while a proton pump rotating shaft synthesizes bright ATP and NADPH energy tokens.",
    "objective": "Map light-dependent electron tracking paths and chemiosmotic gradient balancing."
  },
  {
    "number": 39,
    "title": "Photosynthesis Part B: Stroma Calvin Cycle Carboxylation Engine",
    "subject": "biology",
    "grade": 11,
    "tier": 3,
    "experience": "Students transfer ATP and NADPH tokens collected from the light lab module into the fluid stroma space. They add CO₂ molecules, forcing the RuBisCO enzyme to spin an interactive cyclic wheel structure that yields golden Glyceraldehyde-3-phosphate (G3P) sugar outputs.",
    "objective": "Model mass balances and tracking biochemical steps inside dark cycle pathways."
  },
  {
    "number": 40,
    "title": "Ventilation Mechanics & Alveolar Pressure Exchange",
    "subject": "biology",
    "grade": 11,
    "tier": 3,
    "experience": "Keyboard direction keys drive diaphragm compression down and ribcage expansion outward. The UI pressure gauge slides into negative bars, making atmospheric oxygen enter the respiratory tract. The view zooms into an alveolus, tracing passive molecule diffusion governed by gas partial pressures.",
    "objective": "Connect mechanical ventilation volume changes to passive gas partial pressure laws."
  },
  {
    "number": 41,
    "title": "Enzyme Kinetics & Ambient Denaturation Sandbox",
    "subject": "biology",
    "grade": 11,
    "tier": 3,
    "experience": "Salivary Amylase or Pepsin proteins modeled as dynamic \"molecular scissors\" cutting long carbohydrate or protein links. Students manipulate pH sliders; moving pH from 2 (optimal for Pepsin) up to 8 initiates a structural mutation loop where the scissor animations unravel and break down (Denature), dropping reaction rates to zero.",
    "objective": "Calculate how environmental variables control enzymatic speed and structural stability."
  },
  {
    "number": 42,
    "title": "Synaptic Reflex Arc Action Potential Wave",
    "subject": "biology",
    "grade": 11,
    "tier": 3,
    "experience": "Striking a patellar tendon fires an electric signal down sensory nerve cables, bypassing the brain model to bounce through the spinal chord interneuron straight to motor fibers to trigger a leg twitch. Zooming into the synapse requires students to manually merge vesicle channels to release neurotransmitters across the gap.",
    "objective": "Track involuntary neural arcs and verify chemical cross-synapse transmission."
  },
  {
    "number": 43,
    "title": "Nephron Countercurrent Multiplier Homeostatic Regulator",
    "subject": "biology",
    "grade": 12,
    "tier": 4,
    "experience": "A fully functional 3D nephron mapping loop descending into an osmotic scale bar tissue layer (300 to 1200 mOsm/L). Students adjust blood pressure dials and scale Antidiuretic Hormone (ADH) sliders to dynamically open aquaporins, tracking water reclamation and urinary concentration drops.",
    "objective": "Master countercurrent multiplier physics and blood volume homeostatic loops."
  },
  {
    "number": 44,
    "title": "Central Dogma Part 1: DNA Transcription & mRNA Intron Splicing",
    "subject": "biology",
    "grade": 12,
    "tier": 4,
    "experience": "A double-helix gene strip. Students click an RNA Polymerase block to unzip the strand and type matching bases to build a pre-mRNA strand. They must deploy a virtual Spliceosome scissor tool to manually cut out intron loops and weld remaining exon strands into a mature, stable transcript.",
    "objective": "Differentiate post-transcriptional processing stages and remove non-coding domains."
  },
  {
    "number": 45,
    "title": "Central Dogma Part 2: Ribosomal Translation & Codon Point Mutations",
    "subject": "biology",
    "grade": 12,
    "tier": 4,
    "experience": "The finished mRNA slides through a dual-subunit ribosome model displaying 3-letter codes. Students select matching anti-codon tRNA shapes from a rack to synthesize long amino acid polypeptide rows. An editing brush allows them to alter single base units to test Silent, Missense, and Nonsense mutation breakdowns.",
    "objective": "Translate genetic codes and evaluate the structural results of point mutation variants."
  },
  {
    "number": 46,
    "title": "Drosophila Linkage Mapping Recombination Frequency Solver",
    "subject": "biology",
    "grade": 12,
    "tier": 4,
    "experience": "Fruit fly mating panels. Students execute test crosses tracking body color and wing shape variations. The resulting generation counts do not match the expected independent 1:1:1:1 assortment ratio. Students count the recombinant outliers to map relative map distances (Centimorgans, cM).",
    "objective": "Identify genetic linkage anomalies and plot relative chromosome gene map locations."
  },
  {
    "number": 47,
    "title": "Immune System Combat Sandbox: Cellular War Strategies",
    "subject": "biology",
    "grade": 12,
    "tier": 4,
    "experience": "Pathogens break through skin boundaries on a live battle canvas. Students command defense lines: releasing shapeshifting Macrophages to stretch pseudopodia to consume vectors via phagocytosis, activating Helper T-cells, and ordering B-Cell assembly lines to fire targeted Y-shaped antibodies to lock down the viral receptors.",
    "objective": "Co-ordinate non-specific innate responses alongside specific adaptive fluid immunities."
  },
  {
    "number": 48,
    "title": "Hardy-Weinberg Population Evolution Dynamics",
    "subject": "biology",
    "grade": 12,
    "tier": 4,
    "experience": "An isolated island population panel containing a fixed pool of allele variations. Students set mutation sliders, select natural selection pressures, or limit population space (Genetic Drift). The mathematical equation back-end scales genotypic distribution graphs over a 100-generation fast-forward window:",
    "objective": "Use population equations to observe equilibrium preservation or trace micro-evolutionary trends."
  },
  {
    "number": 49,
    "title": "Natural Selection Industrial Melanism Trait Adaptation",
    "subject": "biology",
    "grade": 12,
    "tier": 4,
    "experience": "An ecosystem sandbox tracking Peppered Moths. Students flip a timeline toggle from Pre-Industrial (light tree bark) to Post-Industrial (soot-covered black tree bark). Bird predation algorithms hunt highly visible moths, driving a 20-generation shift where the population frequency of dark moths surges from 5% to 95%.",
    "objective": "Visually track selective pressures and natural selection mechanisms over time."
  },
  {
    "number": 50,
    "title": "Ecosystem Biomagnification Toxic Cascade",
    "subject": "biology",
    "grade": 12,
    "tier": 4,
    "experience": "Students inject a low-level dosage of a non-degradable chemical pesticide (e.g., DDT at 0.000003 ppm) into an interactive lake simulation. Moving a 5-year timeline fast-forward engine tracks a geometric concentration curve up the food chain, resulting in eggshell collapse animations at the apex predator tier.",
    "objective": "Model bioaccumulation rules and track trophic level concentration risks."
  }
];
