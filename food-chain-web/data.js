const foodChainWebData = {
    introduction: {
        title: "Food Chain and Food Web",
        definition: "A food chain refers to the order of events in an ecosystem, where one living organism eats another organism, and later that organism is consumed by another larger organism. The flow of nutrients and energy from one organism to another at different trophic levels forms a food chain.",
        historicalNote: {
            fact: "Charles Elton introduced the modern concept of the food chains in his 1927 book Animal Ecology. Also, he introduced the idea of food web, which he called food cycle."
        }
    },
    learningObjectives: {
        title: "Objectives",
        goals: [
            "Differentiate food chains from food webs.",
            "Define producers and consumers.",
            "Discuss the Pyramid of Energy and Biomass."
        ],
        outline: [
            "Food Chain vs. Food Web",
            "Producers vs. Consumers",
            "The Energy Pyramid",
            "The Biomass Pyramid",
            "Biomass vs. Energy"
        ]
    },
    components: {
        title: "4 Major Parts",
        parts: {
            sun: {
                name: "Sun",
                description: "Sunlight provides necessary light and energy to plants and other producers in the food chain and food web."
            },
            producers: {
                name: "Producers",
                description: "Producers absorb the sun's radiation and convert it into energy through a process called photosynthesis.",
                definition: "Producers are organisms that create their own energy, primarily through the process of photosynthesis. They form the base of the food chain and are also called autotrophs.",
                examples: [
                    "Plants (e.g., grass, trees, flowers)",
                    "Algae (e.g., phytoplankton)",
                    "Cyanobacteria"
                ]
            },
            consumers: {
                name: "Consumers",
                description: "Consumers control the overpopulation of organisms and vegetation by eating them and to provide energy to other organisms.",
                definition: "Obtain their energy from eating plants and other animals.",
                examples: [
                    "Rabbit (herbivore)",
                    "Lion (carnivore)",
                    "Bear (omnivore)"
                ]
            },
            decomposers: {
                name: "Decomposers",
                description: "Decomposers help recycle nutrients back into the system. When organic matter dies, such as animals or plants, decomposers eat this material, breaking it down into smaller molecules that can feed other organisms, like plants."
            }
        }
    },
    foodChainVsWeb: {
        foodChain: {
            title: "Food Chain",
            definition: "Shows the feeding relationships between organisms",
            example: "Producer: Sun -> Grass\nConsumers: Caterpillar -> Squirrel -> Eagle\n*Arrow represents the transfer of energy",
            types: [
                "Detritus food chain",
                "Grazing food chain"
            ]
        },
        foodWeb: {
            title: "Food Web",
            definition: "Consists of several food chains in a single ecosystem",
            description: "Several interconnected food chains form a food web. A food web is similar to a food chain but the food web is comparatively larger than a food chain. Occasionally, a single organism is consumed by many predators or it consumes several other organisms. Due to this, many trophic levels get interconnected.",
            example: "Producer: Sun -> Grass\nConsumers: Grasshopper -> Bird -> Fox, Grasshopper -> Squirrel -> Eagle, Bird -> Eagle",
            advantage: "The food web is able to show the proper representation of energy flow, as it displays the interactions between different organisms."
        }
    },
    pyramids: {
        energy: {
            title: "The Energy Pyramid",
            definition: "A pyramid of energy is a diagram that shows the flow of energy through an ecosystem. It's a type of ecological pyramid that shows how energy is transferred between different trophic levels in a food chain.",
            importance: "In a healthy ecosystem, there's more energy at the bottom of the energy pyramid than at the top. This abundance supports larger populations at lower levels and ensures energy can flow up to higher levels."
        },
        biomass: {
            title: "The Biomass Pyramid",
            definition: "Shows the relative amount of biomass in each of the trophic levels of an ecosystem.",
            description: "Biomass is simply the mass of living things in a particular trophic level. Terrestrial ecosystems usually have much more biomass in plants, such as trees and grass, and less biomass as you move up in trophic levels.",
            levels: {
                producers: "100kg",
                primaryConsumers: "100kg",
                secondaryConsumers: "10kg",
                tertiaryConsumers: "1kg"
            }
        },
        comparison: {
            title: "Difference & Similarities",
            differences: [
                "Energy Pyramid - Represents the energy flow in the ecosystem.",
                "Biomass Pyramid - Represents the biomass flow in the ecosystem."
            ],
            similarities: "Both pyramids have producers at the base and progressively smaller levels of consumers as you move up, reflecting the decrease in energy or biomass at each trophic level."
        }
    },
    summary: {
        keyPoints: [
            "Food Chain - Shows feeding relationships between organisms",
            "Food Web - Composed of several food chains",
            "Energy & Biomass Pyramid - Represents the biomass and energy flow in the ecosystem"
        ]
    }
};

export default foodChainWebData;
 