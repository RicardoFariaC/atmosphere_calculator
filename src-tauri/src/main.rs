// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::{collections::HashMap};

fn calculate_molecular_weight_ratio(altitude: f32) -> f32 {
  const MOLECULAR_RATIO: [f32; 13] = [
    1.0, 0.999996, 0.999989,
    0.999971, 0.999941, 0.999909,
    0.999870, 0.999829, 0.999786,
    0.999741, 0.999694, 0.999641,
    0.999579
  ];
  const DESIRED_ALTITUDE: [i32; 13] = [
    80000, 80500, 81000, 81500, 82000, 82500,
    83000, 83500, 84000, 84500, 85000, 85500,
    86000
  ];

  let mut i = 0;
  if altitude >= 80000.0 {
    while altitude > (DESIRED_ALTITUDE[i] as f32) {
      i += 1;
    }
  }

  return MOLECULAR_RATIO[i];
}

fn calculate_mean_molecular_weight(molecular_weight: [f32; 10], fractional_volume: [f32; 10]) -> f32 {
  let mut numerator: f32 = 0.0;
  let mut denominator: f32 = 0.0;

  for i in 0..molecular_weight.len() {
    numerator += molecular_weight[i] * fractional_volume[i];
    denominator += fractional_volume[i];
  }

  let result = numerator / denominator;

  result
}

fn calculate_mach(speed_of_sound: f32, velocity: f32) -> f32 {
  velocity / speed_of_sound
}

#[tauri::command]
fn compute(altitude: f32, velocity: f32) -> HashMap<String, f32>{
  let mut results = HashMap::<String, f32>::new();

  const EARTH_RADIUS: f32 = 6356.766e3;
  const AIR_MOL_WEIGHT: f32 = 28.9644;
  const DENSITY_SL: f32 = 1.225;
  const PRESSURE_SL: i32 = 101325;
  const TEMPERATURE_SL: f32 = 288.15;
  const GAMMA: f32 = 1.4;
  const GRAVITY: f32 = 9.80665;
  const R_GAS: f32 = 8.31432;
  const R: f32 = 287.053;
  const R_0: f32 = 6356766.0;
  const ALTITUDES: [i32; 8] = [0, 11000, 20000, 32000, 47000, 51000, 71000, 84852];
  const PRESSURE_REL: [f32; 8] = [
    1.0, 2.23361105092158e-1, 
    5.403295010784876e-2, 8.566678359291667e-3, 
    1.0945601337771144e-3, 6.606353132858367e-4, 
    3.904683373343926e-5, 3.6850095235747942e-6
  ];
  const TEMPERATURES: [f32; 8] = [
    288.15, 216.65, 
    216.65, 228.65, 
    270.65, 270.65, 
    214.65, 186.946
  ];
  const TEMP_GRADS: [f32; 8] = [
    -6.5, 0.0, 
    1.0, 2.8, 
    0.0, -2.8, 
    -2.0, 0.0
  ];
  const G_M_R: f32 = GRAVITY * AIR_MOL_WEIGHT / R_GAS;
  const MOLECULAR_WEIGHT: [f32; 10] = [
    28.0134, 31.9988,
    39.948, 44.00995,
    20.183, 4.0026,
    83.8, 131.3,
    16.04303, 2.01594
  ];
  const FRACTIONAL_VOLUME: [f32; 10] = [
    0.78084, 0.209476,
    0.00934, 0.000314,
    0.00001818, 0.00000524,
    0.00000114, 0.000000087,
    0.000002, 0.0000005
  ];


  let altitude_with_unit = altitude; 
  let geopotential_altitude = 
    EARTH_RADIUS * (altitude_with_unit) / (EARTH_RADIUS + (altitude_with_unit));

  // defining which altitude use
  let mut i = 0;
  if geopotential_altitude > 0.0 {
    if geopotential_altitude > ALTITUDES[ALTITUDES.len()-1] as f32 {
      let results = HashMap::from([
        (String::from(""), 0.0)
      ]);

      return results;
    }

    while geopotential_altitude > ALTITUDES[i+1] as f32 {
      i += 1;
      if i+1 >= ALTITUDES.len() {
        break;
      }
    }
  }

  let base_temp: f32 = TEMPERATURES[i];
  let temp_grad: f32 = TEMP_GRADS[i] / 1000.0;
  let pressure_relative_base: f32 = PRESSURE_REL[i];
  let delta_altitude: f32 = geopotential_altitude - ALTITUDES[i] as f32;
  let temperature = base_temp + temp_grad * delta_altitude;

  let pressure_relative: f32;
  if temp_grad.abs() < 1e-10 { // 33a
    pressure_relative = 
      pressure_relative_base * f32::exp(-G_M_R * delta_altitude / 1000.0 / base_temp);
  } else { // 33b
    pressure_relative = 
      pressure_relative_base * f32::powf(base_temp / temperature, G_M_R / temp_grad / 1000.0);
  }

  let gravity_accel = GRAVITY * f32::powf(R_0 as f32 / (R_0 as f32+altitude), 2.0);
  let speed_of_sound = f32::sqrt(GAMMA * R * temperature);
  let pressure = pressure_relative * PRESSURE_SL as f32;
  let density = DENSITY_SL * pressure_relative * TEMPERATURE_SL / temperature;
  let viscosities = 1.512041288 * f32::powf(temperature, 1.5) / (temperature + 120.0) / 1000000.0;
  let mean_molecular_weight = calculate_mean_molecular_weight(MOLECULAR_WEIGHT, FRACTIONAL_VOLUME);

  results = HashMap::from([
    (String::from("geometric"), altitude),
    (String::from("geopotential"), geopotential_altitude),
    (String::from("gravity_accel"), gravity_accel),
    (String::from("mean_molecular_weight"), mean_molecular_weight),
    (String::from("temperature"), temperature),
    (String::from("speed_of_sound"), speed_of_sound),
    (String::from("pressure"), pressure),
    (String::from("density"), density),
    (String::from("viscosities"), viscosities),
    (String::from("mach"), calculate_mach(speed_of_sound, velocity))
  ]);

  results
}

#[tauri::command]
fn greet(name: &str) -> String {
   format!("Hello, {}!", name)
}

fn main() {
  tauri::Builder::default()
    .invoke_handler(tauri::generate_handler![greet, compute])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
