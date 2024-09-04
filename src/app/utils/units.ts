
export enum UnitSystem {
    NONE = 0,
    INTERNACIONAL = 1,
    IMPERIAL = 2,
}


export class Unit {
    name: string;
    unit: string;
    value: string;
    type: UnitSystem;

    constructor(name: string, unit: string, value: string, type: UnitSystem) {
        this.name = name;
        this.unit = unit;
        this.value = value;
        this.type = type;
    }
}

export const dimensionlessUnit = [
];

export const distanceUnits = [
    new Unit(
        "kilometers",
        "km",
        "1000",
        UnitSystem.NONE
    ),
    new Unit(
        "meters",
        "m",
        "1",
        UnitSystem.INTERNACIONAL
    ),
    new Unit(
        "feet",
        "ft",
        "0.3048",
        UnitSystem.IMPERIAL
    )
];

export const velocityUnits = [
    new Unit(
        "kilometers/hour",
        "km/h",
        "0.2777778",
        UnitSystem.NONE
    ),
    new Unit(
        "meters/second",
        "m/s",
        "1",
        UnitSystem.INTERNACIONAL
    ),
    new Unit(
        "feet/s",
        "ft/s",
        "0.3048",
        UnitSystem.IMPERIAL
    )
];

export const sosUnits = [
    new Unit(
        "kilometers/hour",
        "km/h",
        "0.2777778",
        UnitSystem.NONE
    ),
    new Unit(
        "meters/second",
        "m/s",
        "1",
        UnitSystem.INTERNACIONAL
    ),
    new Unit(
        "feet/s",
        "ft/s",
        "0.3048",
        UnitSystem.IMPERIAL
    ),
    new Unit(
        "knots",
        "kts",
        "0.5144444",
        UnitSystem.NONE
    ),
    new Unit(
        "speed of sound ratio, a/a0",
        "-",
        "340.294",
        UnitSystem.NONE
    )
];

export const accelerationUnits = [
    new Unit(
        "kilometers/hour/second",
        "km/h/s",
        "0.2777778",
        UnitSystem.NONE
    ),
    new Unit(
        "meters/square-second",
        "m/s2",
        "1",
        UnitSystem.INTERNACIONAL
    ),
    new Unit(
        "feet/square-second",
        "ft/s2",
        "0.3048",
        UnitSystem.IMPERIAL
    ),
    new Unit(
        "gravity ratio, g/g0",
        "-",
        "9.80665",
        UnitSystem.NONE
    )
];

export const meanMolecularWeightUnits = [
    new Unit(
        "kilogram/kilomole",
        "km/kg-mol",
        "1",
        UnitSystem.INTERNACIONAL
    ),
    new Unit(
        "pound/pound mole",
        "lb/lb-mol",
        "1",
        UnitSystem.IMPERIAL
    ),
    new Unit(
        "molecular weight ratio",
        "m/m0",
        "28.96442528",
        UnitSystem.NONE
    ),
];

export const pressureUnits = [
    new Unit(
        "kilopascals",
        "kPa",
        "1000",
        UnitSystem.NONE
    ),
    new Unit(
        "pascals",
        "Pa",
        "1",
        UnitSystem.INTERNACIONAL
    ),
    new Unit(
        "pounds/square-foot",
        "lb/ft2",
        "47.88026",
        UnitSystem.IMPERIAL
    ),
    new Unit(
        "atmosphere",
        "atm",
        "101300",
        UnitSystem.NONE
    ),
    new Unit(
        "pressure ratio, delta",
        "-",
        "101325.0",
        UnitSystem.NONE
    )
];

export const densityUnits = [
    new Unit(
        "kilograms/cubic-meter",
        "kg/m3",
        "1",
        UnitSystem.INTERNACIONAL
    ),
    new Unit(
        "grams/cubic-centimeter",
        "g/cm3",
        "1000",
        UnitSystem.NONE
    ),
    new Unit(
        "slugs/cubit-foot",
        "slug/ft3",
        "515.4",
        UnitSystem.IMPERIAL
    ),
    new Unit(
        "density ratio, sigma",
        "-",
        "1.2250",
        UnitSystem.NONE
    )
];

export const dynamicVUnits = [
    new Unit(
        "newtons second/square-meter",
        "(N.s)/m2",
        "1",
        UnitSystem.INTERNACIONAL
    ),
    new Unit(
        "pounds-force second/square-foot",
        "(lbf.s)/ft2",
        "47.8803",
        UnitSystem.IMPERIAL
    ),
    new Unit(
        "poise",
        "P",
        "0.1",
        UnitSystem.NONE
    ),
    new Unit(
        "viscosity ratio, mu/mu0",
        "-",
        "0.00001747",
        UnitSystem.NONE
    )
];

export const kinematicVUnits = [
    new Unit(
        "square-meters/second",
        "m2/s",
        "1",
        UnitSystem.INTERNACIONAL
    ),
    new Unit(
        "square-feet/second",
        "ft2/s",
        "0.093",
        UnitSystem.IMPERIAL
    ),
    new Unit(
        "poise",
        "P",
        "0.1",
        UnitSystem.NONE
    ),
    new Unit(
        "kinematic viscosity ratio, eta/eta0",
        "-",
        "0.0000142636",
        UnitSystem.NONE
    )
];

export const coeffiecientOfThermUnits = [
    new Unit(
        "BTU/(foot second °Rankine)",
        "BTU/(ft.s.°R)",
        "6226.477504",
        UnitSystem.IMPERIAL
    ),
    new Unit(
        "watts/(meter Kelvin)",
        "W/(m·K)",
        "1",
        UnitSystem.INTERNACIONAL
    ),
    new Unit(
        "thermal conductivity ratio, kappa/kappa0",
        "-",
        "0.025325886905",
        UnitSystem.NONE
    ),
];

export const meanFreePathUnits = [
    new Unit(
        "kilometers",
        "km",
        "1000",
        UnitSystem.NONE
    ),
    new Unit(
        "meters",
        "m",
        "1",
        UnitSystem.INTERNACIONAL
    ),
    new Unit(
        "feet",
        "ft",
        "0.3048",
        UnitSystem.IMPERIAL
    ),
    new Unit(
        "mean free path ratio",
        "L/L0",
        "6.63323232786370e-8",
        UnitSystem.NONE
    ),
];

export const trueDynamicPressureUnits = [
    new Unit(
        "newtons/square-meter",
        "N/m2",
        "1",
        UnitSystem.INTERNACIONAL
    ),
    new Unit(
        "pounds/square-foot",
        "lb/ft2",
        "6894.757",
        UnitSystem.IMPERIAL
    ),
];