
export class Unit {
    name: string;
    unit: string;
    value: string;

    constructor(name: string, unit: string, value: string) {
        this.name = name;
        this.unit = unit;
        this.value = value;
    }
}

export const dimensionlessUnit = [
];

export const distanceUnits = [
    new Unit(
        "kilometers",
        "km",
        "1000"
    ),
    new Unit(
        "meters",
        "m",
        "1"
    ),
    new Unit(
        "feet",
        "ft",
        "0.3048"
    )
];

export const velocityUnits = [
    new Unit(
        "kilometers/hour",
        "km/h",
        "0.2777778"
    ),
    new Unit(
        "meters/second",
        "m/s",
        "1"
    ),
    new Unit(
        "feet/s",
        "ft/s",
        "0.3048"
    )
];

export const sosUnits = [
    new Unit(
        "kilometers/hour",
        "km/h",
        "0.2777778"
    ),
    new Unit(
        "meters/second",
        "m/s",
        "1"
    ),
    new Unit(
        "feet/s",
        "ft/s",
        "0.3048"
    ),
    new Unit(
        "knots",
        "kts",
        "0.5144444"
    ),
];

export const accelerationUnits = [
    new Unit(
        "kilometers/hour/second",
        "km/h/s",
        "0.2777778"
    ),
    new Unit(
        "meters/square-second",
        "m/s2",
        "1"
    ),
    new Unit(
        "feet/square-second",
        "ft/s2",
        "0.3048"
    )
];

export const meanMolecularWeightUnits = [
    new Unit(
        "kilogram/kilomole",
        "km/kg-mol",
        "1"
    ),
    new Unit(
        "molecular weight ratio",
        "m/m0",
        "1"
    ),
    new Unit(
        "pound/pound mole",
        "lb/lb-mol",
        "1"
    )
];

export const pressureUnits = [
    new Unit(
        "kilopascals",
        "kPa",
        "1000",
    ),
    new Unit(
        "pascals",
        "Pa",
        "1"
    ),
    new Unit(
        "atmosphere",
        "atm",
        "101300"
    ),
];

export const densityUnits = [
    new Unit(
        "kilograms/cubic-meter",
        "kg/m3",
        "1"
    ),
    new Unit(
        "grams/cubic-centimeter",
        "g/cm3",
        "1000"
    ),
    new Unit(
        "slugs/cubit-foot",
        "slug/ft3",
        "515.4"
    ),
];

export const viscosityUnits = [
    new Unit(
        "newtons second/square-meter",
        "(N.s)/m2",
        "1"
    ),
    new Unit(
        "pounds-force second/square-foot",
        "(lbf.s)/ft2",
        "47.8803"
    ),
    new Unit(
        "poise",
        "P",
        "0.1"
    ),
];
