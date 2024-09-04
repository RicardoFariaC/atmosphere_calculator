import { UnitSystem, accelerationUnits, coeffiecientOfThermUnits, densityUnits, distanceUnits, dynamicVUnits, kinematicVUnits, meanFreePathUnits, meanMolecularWeightUnits, pressureUnits, sosUnits, } from "@/app/utils/units"
import { Output } from "../Output/Output"
import { TemperatureOutput } from "../Output/TemperatureOutput"

interface AltitudeFormPropTypes {
    atmosphere: {[key: string]: number},
    unitSystem: UnitSystem
}

export const AltitudeForm = ({ atmosphere, unitSystem }: AltitudeFormPropTypes) => {
 
  return(
        <form className="flex flex-col gap-4 text-lg">
              <Output
                label="Geometric Altitude"
                value={atmosphere["geometric"]}
                unit={distanceUnits}
                unitSystem={unitSystem}
              />
              <Output
                label="Geopotential Altitude"
                value={atmosphere["geopotential"]}
                unit={distanceUnits}
                fixed={8}
                unitSystem={unitSystem}
              />                
              <Output
                label="Gravity Acceleration"
                value={atmosphere["gravity_accel"]}
                unit={accelerationUnits}
                unitSystem={unitSystem}
              />         
              <Output
                label="Mean Molecular Weight"
                value={atmosphere["mean_molecular_weight"]}
                unit={meanMolecularWeightUnits}
                unitSystem={unitSystem}
              />
              <Output
                label="Pressure"
                value={atmosphere["pressure"]}
                unit={pressureUnits}
                unitSystem={unitSystem}
              />
              <TemperatureOutput
                label="Temperature"
                value={atmosphere["temperature"]}
                hasRatio
                unitSystem={unitSystem}
              />
              <Output
                label="Density"
                value={atmosphere["density"]}
                unit={densityUnits}
                fixed={5}
                unitSystem={unitSystem}
              />
              <Output
                label="Speed of Sound"
                value={atmosphere["speed_of_sound"]}
                unit={sosUnits}
                unitSystem={unitSystem}
              />
              <Output
                label="Dynamic Viscosity"
                value={atmosphere["dynamic_viscosity"]}
                unit={dynamicVUnits}
                fixed={10}
                unitSystem={unitSystem}
              />
              <Output
                label="Kinematic Viscosity"
                value={atmosphere["kinematic_viscosity"]}
                unit={kinematicVUnits}
                fixed={10}
                unitSystem={unitSystem}
              />
              <Output
                label="Mean Free Path"
                value={atmosphere["mean_free_path"]}
                unit={meanFreePathUnits}
                fixed={6}
                unitSystem={unitSystem}
              />
              <Output
                label="Coefficient of Thermal Conductivity"
                value={atmosphere["coefficient_of_therm_cond"]}
                unit={coeffiecientOfThermUnits}
                fixed={12}
                unitSystem={unitSystem}
              />
            </form>
    )
}