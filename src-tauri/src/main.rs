// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod calculator_functions;
use std::collections::HashMap;

use calculator_functions::{altitude::{self, calculate_temperature, choose_altitude_value, choose_pressure_value}, consts};

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

fn calculate_mean_molecular_weight(altitude: f32) -> f32 {
  let mwr: f32 = calculate_molecular_weight_ratio(altitude);
  let mmwr = mwr * 28.96442528;
  mmwr
}

fn calculate_mach(speed_of_sound: f32, velocity: f32) -> f32 {
  velocity / speed_of_sound
}

#[tauri::command]
fn compute(altitude: f32, velocity: f32) -> HashMap<String, f32>{
  let results;

  let altitude_with_unit = altitude; 
  let geopotential_altitude = 
  consts::EARTH_RADIUS * (altitude_with_unit) / (consts::EARTH_RADIUS + (altitude_with_unit));

  // defining which altitude use
  let i = choose_altitude_value(geopotential_altitude);
  if i == consts::ALTITUDES.len() {
    let results = HashMap::from([
      (String::from(""), 0.0)
    ]);
    return results;
  }  

  let temperature = calculate_temperature(geopotential_altitude, i);
  let pressure_relative = choose_pressure_value(geopotential_altitude, temperature, i);
  let gravity_accel = consts::GRAVITY * f32::powf(consts::R_0 as f32 / (consts::R_0 as f32+altitude), 2.0);
  let speed_of_sound = f32::sqrt(consts::GAMMA * consts::R * temperature);
  let pressure = pressure_relative * consts::PRESSURE_SL as f32;
  let density = consts::DENSITY_SL * pressure_relative * consts::TEMPERATURE_SL / temperature;
  let mean_molecular_weight = calculate_mean_molecular_weight(altitude);
  let dynamic_viscosity = 1.458e-6 * f32::powf(temperature, 1.5) / (temperature + 120.0);
  let kinematic_viscosity = dynamic_viscosity / density;
  let coefficient_of_therm_cond = (2.64638 * 0.001 * f32::powf(temperature, 1.5)) / (temperature + 245.4 * f32::powf(10.0,-(12.0/temperature)));
  let mean_free_path = (f32::sqrt(2.0) * consts::R_GAS * temperature) / ((2.0 * consts::PI) * f32::powf(consts::THETA, 2.0) * pressure * consts::AVOGADRO);
  let dynamic_pressure: f32 = density * velocity.powf(2.0) / 2.0;
  let mach_number: f32 = calculate_mach(speed_of_sound, velocity);
  let total_temperature: f32 = temperature * (1.0 + ((consts::GAMMA - 1.0)/2.0) * mach_number.powf(2.0));

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
fn compute_table(min_altitude: i32, max_altitude: i32, step: usize) -> HashMap<String, Vec<f32>> {
  let mut altitude_vec: Vec<f32> = vec![];
  let mut temperature_vec: Vec<f32> = vec![];
  let mut pressure_vec: Vec<f32> = vec![];
  let mut density_vec: Vec<f32> = vec![];
  let mut speed_of_sound_vec: Vec<f32> = vec![];
  let mut dynamic_v_vec: Vec<f32> = vec![];

  for instant_altitude in (min_altitude..max_altitude+1).step_by(step) {
    altitude_vec.push(instant_altitude as f32);

    let geopotential_altitude = consts::EARTH_RADIUS * (instant_altitude as f32) / (consts::EARTH_RADIUS + (instant_altitude as f32));
    let i = choose_altitude_value(geopotential_altitude);
    if i == 8 {
      return HashMap::from([
        (String::from("altitude"), vec![]),
      ]);
    }
    let temperature = calculate_temperature(geopotential_altitude, i);
    let pressure_relative = choose_pressure_value(geopotential_altitude, temperature, i);
    let pressure = pressure_relative * consts::PRESSURE_SL as f32;
    let density = consts::DENSITY_SL * pressure_relative * consts::TEMPERATURE_SL / temperature;
    let speed_of_sound = f32::sqrt(consts::GAMMA * consts::R * temperature);
    let dynamic_viscosity = 1.458e-6 * f32::powf(temperature, 1.5) / (temperature + 120.0);

    temperature_vec.push(temperature);
    pressure_vec.push(pressure);
    density_vec.push(density);
    speed_of_sound_vec.push(speed_of_sound);
    dynamic_v_vec.push(dynamic_viscosity);
  }

  let res: HashMap<String, Vec<f32>> = HashMap::from([
    (String::from("altitude"), altitude_vec),
    (String::from("temperature"), temperature_vec),
    (String::from("pressure"), pressure_vec),
    (String::from("density"), density_vec),
    (String::from("speed_of_sound"), speed_of_sound_vec),
    (String::from("dynamic_v"), dynamic_v_vec),
  ]);
  res
}

#[tauri::command]
fn compute_graph_temperature() -> Vec<HashMap<String, f32>> {
  let mut vec: Vec<HashMap<String,f32>> = vec![];
  for instant_altitude in (0..consts::ALTITUDES.last().cloned().unwrap()).rev().step_by(1000) {
    let mut result_map: HashMap<String, f32> = HashMap::new();
    let geopotential_altitude = consts::EARTH_RADIUS * (instant_altitude as f32) / (consts::EARTH_RADIUS + (instant_altitude as f32));
    let i = choose_altitude_value(geopotential_altitude);
    let temperature = calculate_temperature(geopotential_altitude, i);

    result_map.insert("altitude".to_string(), instant_altitude as f32);  
    result_map.insert("value".to_string(), temperature);  
    vec.push(result_map);

  }

  vec
}

#[tauri::command]
fn compute_graph_pressure() -> Vec<HashMap<String, f32>> {
  let mut vec: Vec<HashMap<String,f32>> = vec![];
  for instant_altitude in (0..consts::ALTITUDES.last().cloned().unwrap()).rev().step_by(1000) {
    let mut result_map: HashMap<String, f32> = HashMap::new();
    let geopotential_altitude = consts::EARTH_RADIUS * (instant_altitude as f32) / (consts::EARTH_RADIUS + (instant_altitude as f32));
    let i = choose_altitude_value(geopotential_altitude);
    let temperature = calculate_temperature(geopotential_altitude, i);
    let pressure_relative = choose_pressure_value(geopotential_altitude, temperature, i);
    let pressure = pressure_relative * consts::PRESSURE_SL as f32;

    result_map.insert("altitude".to_string(), instant_altitude as f32);  
    result_map.insert("value".to_string(), pressure);  
    vec.push(result_map);

  }

  vec
}

#[tauri::command]
fn compute_graph_density() -> Vec<HashMap<String,f32>> {
  let mut vec: Vec<HashMap<String,f32>> = vec![];
  for instant_altitude in (0..consts::ALTITUDES.last().cloned().unwrap()).rev().step_by(1000) {
    let mut result_map: HashMap<String, f32> = HashMap::new();
    let geopotential_altitude = consts::EARTH_RADIUS * (instant_altitude as f32) / (consts::EARTH_RADIUS + (instant_altitude as f32));
    let i = choose_altitude_value(geopotential_altitude);
    let temperature = calculate_temperature(geopotential_altitude, i);
    let pressure_relative = choose_pressure_value(geopotential_altitude, temperature, i);
    let density = consts::DENSITY_SL * pressure_relative * consts::TEMPERATURE_SL / temperature;

    result_map.insert("altitude".to_string(), instant_altitude as f32);  
    result_map.insert("value".to_string(), density);  
    vec.push(result_map);
  }

  vec
}

#[tauri::command]
fn compute_graph_sos() -> Vec<HashMap<String,f32>> {
  let mut vec: Vec<HashMap<String,f32>> = vec![];
  for instant_altitude in (0..consts::ALTITUDES.last().cloned().unwrap()).rev().step_by(1000) {
    let mut result_map: HashMap<String, f32> = HashMap::new();
    let geopotential_altitude = consts::EARTH_RADIUS * (instant_altitude as f32) / (consts::EARTH_RADIUS + (instant_altitude as f32));
    let i = choose_altitude_value(geopotential_altitude);
    let temperature = calculate_temperature(geopotential_altitude, i);
    let speed_of_sound = f32::sqrt(consts::GAMMA * consts::R * temperature);

    result_map.insert("altitude".to_string(), instant_altitude as f32);  
    result_map.insert("value".to_string(), speed_of_sound);  
    vec.push(result_map);
  }

  vec
}

#[tauri::command]
fn compute_graph_viscosity() -> Vec<HashMap<String,f32>> {
  let mut vec: Vec<HashMap<String,f32>> = vec![];
  for instant_altitude in (0..consts::ALTITUDES.last().cloned().unwrap()).rev().step_by(1000) {
    let mut result_map: HashMap<String, f32> = HashMap::new();
    let geopotential_altitude = consts::EARTH_RADIUS * (instant_altitude as f32) / (consts::EARTH_RADIUS + (instant_altitude as f32));
    let i = choose_altitude_value(geopotential_altitude);
    let temperature = calculate_temperature(geopotential_altitude, i);
    let dynamic_viscosity = 1.458e-6 * f32::powf(temperature, 1.5) / (temperature + 120.0);

    result_map.insert("altitude".to_string(), instant_altitude as f32);  
    result_map.insert("value".to_string(), dynamic_viscosity);  
    vec.push(result_map);
  }

  vec
}

#[tauri::command]
fn greet(name: &str) -> String {
   format!("Hello, {}!", name)
}

fn main() {
  tauri::Builder::default()
    .invoke_handler(tauri::generate_handler![greet, compute, 
      compute_table, compute_graph_temperature, 
      compute_graph_pressure, compute_graph_density,
      compute_graph_sos, compute_graph_viscosity
      ])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
