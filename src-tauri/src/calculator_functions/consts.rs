pub const AVOGADRO: f32 = 6.022169e23; 
pub const THETA: f32 = 3.65 * 10e-10;
pub const GAS_DENSITY: [f32;  5] = [
    1.129794 * 10e20, 8.6 * 10e16,
    3.030898 * 10e19, 1.351400 * 10e18,
    7.5817 * 10e10
];
pub const PI: f32 = 3.1415927;
pub const EARTH_RADIUS: f32 = 6356.766e3;
pub const AIR_MOL_WEIGHT: f32 = 28.9644;
pub const DENSITY_SL: f32 = 1.225;
pub const PRESSURE_SL: i32 = 101325;
pub const TEMPERATURE_SL: f32 = 288.15;
pub const GAMMA: f32 = 1.4;
pub const GRAVITY: f32 = 9.80665;
pub const R_GAS: f32 = 8.31432;
pub const R: f32 = 287.053;
pub const R_0: f32 = 6356766.0;
pub const ALTITUDES: [i32; 8] = [0, 11000, 20000, 32000, 47000, 51000, 71000, 84852];
pub const PRESSURE_REL: [f32; 8] = [
    1.0, 2.23361105092158e-1, 
    5.403295010784876e-2, 8.566678359291667e-3, 
    1.0945601337771144e-3, 6.606353132858367e-4, 
    3.904683373343926e-5, 3.6850095235747942e-6
];
pub const TEMPERATURES: [f32; 8] = [
    288.15, 216.65, 
    216.65, 228.65, 
    270.65, 270.65, 
    214.65, 186.946
];
pub const TEMP_GRADS: [f32; 8] = [
    -6.5, 0.0, 
    1.0, 2.8, 
    0.0, -2.8, 
    -2.0, 0.0
];
pub const G_M_R: f32 = GRAVITY * AIR_MOL_WEIGHT / R_GAS;
pub const MOLECULAR_WEIGHT: [f32; 10] = [
    28.0134, 31.9988,
    39.948, 44.00995,
    20.183, 4.0026,
    83.8, 131.3,
    16.04303, 2.01594
];
pub const FRACTIONAL_VOLUME: [f32; 10] = [
    0.78084, 0.209476,
    0.00934, 0.000314,
    0.00001818, 0.00000524,
    0.00000114, 0.000000087,
    0.000002, 0.0000005
];