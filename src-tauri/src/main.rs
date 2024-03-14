// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::collections::HashMap;

#[tauri::command]
fn compute(altitude: f32, altitude_unit: i32) -> HashMap<String, f32>{
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

  let altitude_with_unit = altitude * altitude_unit as f32; 
  let geopotential_altitude = 
    EARTH_RADIUS * (altitude_with_unit) / (EARTH_RADIUS + (altitude_with_unit));

  let mut i = 0;
  if geopotential_altitude > 0.0 {
    while geopotential_altitude > ALTITUDES[i+1] as f32 {
        i += 1;
    }
  }
  let base_temp: f32 = TEMPERATURES[i];
  let temp_grad: f32 = TEMP_GRADS[i] / 1000.0;
  let pressure_relative_base: f32 = PRESSURE_REL[i];
  let delta_altitude: f32 = geopotential_altitude - ALTITUDES[i] as f32;
  let temperature = base_temp + temp_grad * delta_altitude;

  let pressure_relative: f32;
  if temp_grad.abs() < 1e-10 {
    pressure_relative = 
      pressure_relative_base * f32::exp(-G_M_R * delta_altitude / 1000.0 / base_temp);
  } else {
    pressure_relative = 
      pressure_relative_base * f32::powf(base_temp / temperature, G_M_R / temp_grad / 1000.0);
  }

  let speed_of_sound = f32::sqrt(GAMMA * R * temperature);
  let pressure = pressure_relative * PRESSURE_SL as f32;
  let density = DENSITY_SL * pressure_relative * TEMPERATURE_SL / temperature;
  let viscosities = 1.512041288 * f32::powf(temperature, 1.5) / (temperature + 120.0) / 1000000.0;

  results = HashMap::from([
    (String::from("temperature"), temperature),
    (String::from("speed_of_sound"), speed_of_sound),
    (String::from("pressure"), pressure),
    (String::from("density"), density),
    (String::from("viscosities"), viscosities)
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
