async function shuffle_data_for_table(data, actions) {
    let output = {};
    
    await data.forEach(async (object) => {
        await Object.keys(object).map((key) => {
            if (!output[key]) {
                output[key] = [];
            }

            output[key].push(object[key]);
        });
    });

    if (actions) {
        output.actions = [];
        await data.forEach(async (object) => {
            output.actions.push(actions);
        });
    }

    return output;
}

function example_mindmaps_array() {
    return [
    {
        title: "Biology",
        topics: [
            "Cell Structure and Function",
            "Genetics and Heredity",
            "Evolution and Natural Selection",
            "Human Anatomy and Physiology",
            "Plant Biology",
            "Ecology and Ecosystems",
            "Microbiology",
            "Biotechnology",
            "Conservation Biology",
            "Animal Behavior"
        ]
    },
    {
        title: "Chemistry",
        topics: [
            "Atomic Structure",
            "Periodic Table",
            "Chemical Bonding",
            "Chemical Reactions",
            "Stoichiometry",
            "Acids and Bases",
            "Organic Chemistry",
            "Thermochemistry",
            "Electrochemistry",
            "Environmental Chemistry"
        ]
    },
    {
        title: "Physics",
        topics: [
            "Mechanics",
            "Electromagnetism",
            "Thermodynamics",
            "Waves and Optics",
            "Quantum Mechanics",
            "Relativity",
            "Particle Physics",
            "Nuclear Physics",
            "Fluid Dynamics",
            "Astrophysics"
        ]
    },
    {
        title: "Earth Science",
        topics: [
            "Geology",
            "Meteorology",
            "Oceanography",
            "Astronomy",
            "Paleontology",
            "Environmental Science",
            "Climate Change",
            "Natural Disasters",
            "Soil Science",
            "Renewable Energy"
        ]
    },
    {
        title: "Astronomy",
        topics: [
            "Solar System",
            "Stars and Galaxies",
            "Black Holes",
            "Cosmology",
            "Space Exploration",
            "Telescopes and Observatories",
            "Exoplanets",
            "Dark Matter and Dark Energy",
            "Astrobiology",
            "Space Missions"
        ]
    },
    {
        title: "Environmental Science",
        topics: [
            "Ecosystems and Biodiversity",
            "Pollution and Waste Management",
            "Renewable Resources",
            "Climate Change and Global Warming",
            "Conservation Strategies",
            "Sustainable Development",
            "Environmental Policies",
            "Natural Resource Management",
            "Human Impact on the Environment",
            "Environmental Ethics"
        ]
    },
    {
        title: "Genetics",
        topics: [
            "DNA Structure and Function",
            "Gene Expression and Regulation",
            "Genetic Mutations",
            "Inheritance Patterns",
            "Genomics and Proteomics",
            "Genetic Engineering",
            "CRISPR Technology",
            "Epigenetics",
            "Human Genome Project",
            "Ethical Implications"
        ]
    },
    {
        title: "Neuroscience",
        topics: [
            "Brain Anatomy",
            "Neurotransmitters and Synapses",
            "Neural Circuits",
            "Brain Disorders",
            "Cognitive Functions",
            "Neuroplasticity",
            "Neuroimaging Techniques",
            "Neural Development",
            "Behavioral Neuroscience",
            "Computational Neuroscience"
        ]
    },
    {
        title: "Materials Science",
        topics: [
            "Properties of Materials",
            "Crystallography",
            "Polymers",
            "Nanomaterials",
            "Composite Materials",
            "Metallurgy",
            "Ceramics",
            "Biomaterials",
            "Material Synthesis",
            "Applications in Technology"
        ]
    },
    {
        title: "Robotics and AI",
        topics: [
            "Robot Design and Engineering",
            "Sensors and Actuators",
            "Machine Learning Algorithms",
            "Artificial Intelligence",
            "Human-Robot Interaction",
            "Autonomous Systems",
            "Robotics in Medicine",
            "Ethical AI",
            "Robotics in Industry",
            "Future Trends in Robotics"
        ]
    }
    ];
}

export { shuffle_data_for_table, example_mindmaps_array };