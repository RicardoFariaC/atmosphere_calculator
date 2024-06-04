// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod calculator_functions;
use std::{collections::HashMap, result};

use calculator_functions::altitude::{self, calculate_altitude_values};

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

fn calculate_mean_molecular_weight_test(altitude: f32) -> f32 {
  let mwr: f32 = calculate_molecular_weight_ratio(altitude);

  let mmwr = mwr * 28.96442528;

  mmwr
}

fn calculate_mean_molecular_weight(molecular_weight: [f32; 5], gas_density_sum: f32, density: [f32;5]) -> f32 { // 20, pg.25
  
  let mut numerator: f32 = 0.0;
  let denominator: f32 = gas_density_sum;

  for i in 0..molecular_weight.len() {
    numerator += molecular_weight[i] * density[i];
  }

  let result = numerator / denominator;
  println!("{}", result);

  result
}

fn calculate_mach(speed_of_sound: f32, velocity: f32) -> f32 {
  velocity / speed_of_sound
}

#[tauri::command]
fn compute_calcs(altitude: f32, velocity: f32) -> HashMap<String, f32> {
  let mut results = HashMap::new();
  
  for (key, val) in calculate_altitude_values(altitude).iter() {
    results.insert(key.to_string(), val.clone());
  }

  results.insert("mach".to_string(), calculate_mach(*results.get("speed_of_sound").unwrap(), velocity));

  results
}

#[tauri::command]
fn compute(altitude: f32, velocity: f32) -> HashMap<String, f32>{
  let results;

  const AVOGADRO: f32 = 6.022169e23;
  const GAS_SUM: f32 = 1.447265163e20;
  const THETA: f32 = 3.65e-10;
  const PI: f32 = 3.1415927;
  const EARTH_RADIUS: f32 = 6356.766e3;
  const AIR_MOL_WEIGHT: f32 = 28.9644;
  const DENSITY_SL: f32 = 1.225;
  const PRESSURE_SL: i32 = 101325;
  const TEMPERATURE_SL: f32 = 288.15;
  const GAMMA: f32 = 1.4;
  const GRAVITY: f32 = 9.80665;
  const R_GAS: f32 = 8.31432; // R* - Constante Geral dos Gases
  const R: f32 = 287.053;
  const R_0: f32 = 6356766.0;
  const ALTITUDES: [i32; 8] = [0, 11000, 20000, 32000, 47000, 51000, 71000, 84853];
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
  let mean_molecular_weight = calculate_mean_molecular_weight_test(altitude);
  let dynamic_viscosity = 1.458e-6 * f32::powf(temperature, 1.5) / (temperature + 120.0);
  let kinematic_viscosity = dynamic_viscosity / density;
  let coefficient_of_therm_cond = (2.64638 * 0.001 * f32::powf(temperature, 1.5)) / (temperature + 245.4 * f32::powf(10.0,-(12.0/temperature)));
  let mean_free_path = (f32::sqrt(2.0) * R_GAS * temperature) / ((2.0 * PI) * f32::powf(THETA, 2.0) * pressure * AVOGADRO);
  let dynamic_pressure: f32 = density * velocity.powf(2.0) / 2.0;
  let mach_number: f32 = calculate_mach(speed_of_sound, velocity);
  let total_temperature: f32 = temperature * (1.0 + ((GAMMA - 1.0)/2.0) * mach_number.powf(2.0));

  results = HashMap::from([
    (String::from("geometric"), altitude),
    (String::from("geopotential"), geopotential_altitude),
    (String::from("gravity_accel"), gravity_accel),
    (String::from("mean_molecular_weight"), mean_molecular_weight),
    (String::from("mean_molecular_weight_ratio"), calculate_molecular_weight_ratio(altitude)),
    (String::from("temperature"), temperature),
    (String::from("speed_of_sound"), speed_of_sound),
    (String::from("pressure"), pressure),
    (String::from("density"), density),
    (String::from("dynamic_viscosity"), dynamic_viscosity),
    (String::from("kinematic_viscosity"), kinematic_viscosity),
    (String::from("coefficient_of_therm_cond"), coefficient_of_therm_cond),
    (String::from("mean_free_path"), mean_free_path),
    (String::from("mach"), mach_number),
    (String::from("true_dynamic_pressure"), dynamic_pressure),
    (String::from("total_temperature"), total_temperature)
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
