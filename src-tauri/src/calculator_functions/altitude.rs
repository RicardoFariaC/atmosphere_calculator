use crate::calculator_functions::consts::*;

// pub fn calculate_altitude_values(altitude: f32) -> HashMap<String, f32> {
//     let altitude_with_unit = altitude; 
//     let geopotential_altitude = 
//         EARTH_RADIUS * (altitude_with_unit) / (EARTH_RADIUS + (altitude_with_unit));

//     // defining which altitude use
//     let mut i = 0;
//     if geopotential_altitude > 0.0 {
//         if geopotential_altitude > ALTITUDES[ALTITUDES.len()-1] as f32 {
//         let results = HashMap::from([
//             (String::from(""), 0.0)
//         ]);

//         return results;
//         }

//         while geopotential_altitude > ALTITUDES[i+1] as f32 {
//         i += 1;
//         if i+1 >= ALTITUDES.len() {
//             break;
//         }
//         }
//     }

//     let base_temp: f32 = TEMPERATURES[i];
//     let temp_grad: f32 = TEMP_GRADS[i] / 1000.0;
//     let pressure_relative_base: f32 = PRESSURE_REL[i];
//     let delta_altitude: f32 = geopotential_altitude - ALTITUDES[i] as f32;
//     let temperature = base_temp + temp_grad * delta_altitude;

//     let pressure_relative: f32;

//     if temp_grad.abs() < 1e-10 { // 33a
//         pressure_relative = 
//         pressure_relative_base * f32::exp(-G_M_R * delta_altitude / 1000.0 / base_temp);
//     } else { // 33b
//         pressure_relative = 
//         pressure_relative_base * f32::powf(base_temp / temperature, G_M_R / temp_grad / 1000.0);
//     }

//     let gravity_accel = GRAVITY * f32::powf(R_0 as f32 / (R_0 as f32+altitude), 2.0);
//     let speed_of_sound = f32::sqrt(GAMMA * R * temperature);
//     let pressure = pressure_relative * PRESSURE_SL as f32;
//     let density = DENSITY_SL * pressure_relative * TEMPERATURE_SL / temperature;
//     let dynamic_viscosity = 1.512041288 * f32::powf(temperature, 1.5) / (temperature + 110.4);
//     let kinematic_viscosity = dynamic_viscosity / density;
//     let coefficient_of_therm_cond = (2.64638 * 0.001 * f32::powf(temperature, 1.5)) / (temperature + 245.4 * f32::powf(10.0,-(12.0/temperature)));
    
//     let mut gas_density_sum = 0.0;
//     for i in GAS_DENSITY {
//         gas_density_sum += i;
//     }
    
//     let mean_free_path = (f32::powf(2.0, 1.0/2.0)) / ((2.0 * PI) * f32::powf(THETA, 2.0) * gas_density_sum);


//     return HashMap::from([
//         (String::from("geometric"), altitude),
//         (String::from("geopotential"), geopotential_altitude),
//         (String::from("gravity_accel"), gravity_accel),
//         (String::from("temperature"), temperature),
//         (String::from("speed_of_sound"), speed_of_sound),
//         (String::from("pressure"), pressure),
//         (String::from("density"), density),
//         (String::from("dynamic_viscosity"), dynamic_viscosity),
//         (String::from("kinematic_viscosity"), kinematic_viscosity),
//         (String::from("coefficient_of_therm_cond"), coefficient_of_therm_cond),
//         (String::from("mean_free_path"), mean_free_path),
//     ]);
// }

pub fn choose_altitude_value(geopotential_altitude: f32) -> usize {
    let mut i = 0;
    if geopotential_altitude > 0.0 {
      if geopotential_altitude > ALTITUDES[ALTITUDES.len()-1] as f32 {
        return ALTITUDES.len();
      }
  
      while geopotential_altitude > ALTITUDES[i+1] as f32 {
        i += 1;
        if i+1 >= ALTITUDES.len() {
          break;
        }
      } 
    }

    i
}

pub fn choose_pressure_value(geopotential_altitude: f32, temperature: f32, iterator: usize) -> f32 {
    let base_temp: f32 = TEMPERATURES[iterator];
    let temp_grad: f32 = TEMP_GRADS[iterator] / 1000.0;
    let delta_altitude: f32 = geopotential_altitude - ALTITUDES[iterator] as f32;

    let pressure_relative_base: f32 = PRESSURE_REL[iterator];
    let pressure_relative: f32;
    if temp_grad.abs() < 1e-10 { // 33a
      pressure_relative = 
        pressure_relative_base * f32::exp(-G_M_R * delta_altitude / 1000.0 / base_temp);
    } else { // 33b
      pressure_relative = 
        pressure_relative_base * f32::powf(base_temp / temperature, G_M_R / temp_grad / 1000.0);
    }

    pressure_relative
}

pub fn calculate_temperature(geopotential_altitude: f32, iterator: usize) -> f32 {
    let base_temp: f32 = TEMPERATURES[iterator];
    let temp_grad: f32 = TEMP_GRADS[iterator] / 1000.0;
    let delta_altitude: f32 = geopotential_altitude - ALTITUDES[iterator] as f32;

    return base_temp + temp_grad * delta_altitude;
}