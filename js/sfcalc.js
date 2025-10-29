const solver = require("javascript-lp-solver");

const recipes = [
    {
        name: "Computer",
        outputs: {Computer: 2.5},
        inputs: {CircuitBoard: 10, Cable: 20, Plastic: 40},
        machine: "Assembler"
    },
    {
        name: "CircuitBoard",
        outputs: {CircuitBoard: 7.5},
        inputs: {CopperSheet: 15, Plastic: 30},
        machine: "Assembler"
    },
    {
        name: "CateriumCircuitBoard",
        outputs: {CircuitBoard: 8.75},
        inputs: {Plastic: 12.5, Quickwire: 37.5},
        machine: "Assembler",
    },
    {
        name: "Cable",
        outputs: {Cable: 30},
        inputs: {Wire: 60},
        machine: "Constructor",
    },
    {
        name: "Wire",
        outputs: {Wire: 30},
        inputs: {CopperIngot: 15},
        machine: "Constructor",
    },
    {
        name: "CopperIngot",
        outputs: {CopperIngot: 30},
        inputs: {CopperOre: 30},
        machine: "Smelter",
    }
];

const targetItem = "Computer";
const targetRate = 10;

const model = {
    optimize: "machines",
    opType: "min",
    constraints: {},
    variables: {}
};

const items = new Set();
recipes.forEach((r) => {
    Object.keys(r.inputs).forEach(i => items.add(i));
    Object.keys(r.outputs).forEach(i => items.add(i));
});

const producedItems = new Set();
recipes.forEach((r) => Object.keys(r.outputs).forEach(i => producedItems.add(i)));
const rawResources = [...items].filter(i => !producedItems.has(i));

recipes.forEach((r) => {
    const variable = { machines: 1 };

    for (const [item, qty] of Object.entries(r.outputs)) {
        variable[item] = qty;
    }
    for (const [item, qty] of Object.entries(r.inputs)) {
        variable[item] = (variable[item] || 0) - qty;
    }
    model.variables[r.name] = variable;
});

items.forEach((item) => {
    if (item === targetItem) {
        model.constraints[item] = { equal: targetRate };
    } else if (!rawResources.includes(item)) {
        model.constraints[item] = { equal: 0 };
    }
});

const results = solver.Solve(model);

function buildTree(targetItem, requiredRate, recipes, results, rawResources) {
    // Map item -> recipes that produce it
    const itemProducers = {};
    recipes.forEach(r => {
        Object.keys(r.outputs).forEach(output => {
            if (!itemProducers[output]) itemProducers[output] = [];
            itemProducers[output].push(r);
        });
    });

    // Recursive function
    function makeNode(item, amountNeeded) {
        // Stop recursion if raw resource
        if (rawResources.includes(item)) {
            return {
                item,
                type: "raw",
                amountNeeded
            };
        }

        // Find recipes that produce this item and are actually used
        const usedRecipes = (itemProducers[item] || []).filter(r => results[r.name] > 0);

        return usedRecipes.map(r => {
            const multiplier = results[r.name]; // number of times recipe runs
            const node = {
                recipe: r.name,
                machine: r.machine,
                machinesUsed: multiplier,
                outputs: Object.fromEntries(
                    Object.entries(r.outputs).map(([k, v]) => [k, v * multiplier])
                ),
                children: []
            };

            // Recurse for each input of this recipe
            for (const [inputItem, inputQty] of Object.entries(r.inputs)) {
                const inputAmountNeeded = inputQty * multiplier;
                node.children.push(makeNode(inputItem, inputAmountNeeded));
            }

            return node;
        }).flat();
    }

    return makeNode(targetItem, requiredRate);
}

// Example usage
const tree = buildTree(targetItem, targetRate, recipes, results, rawResources);
console.log(JSON.stringify(tree, null, 2));