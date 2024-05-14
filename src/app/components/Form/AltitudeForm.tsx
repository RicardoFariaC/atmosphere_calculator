import { accelerationUnits, densityUnits, distanceUnits, meanMolecularWeightUnits, pressureUnits, sosUnits, velocityUnits, viscosityUnits } from "@/app/utils/units"
import { Output } from "../Output/Output"
import { TemperatureOutput } from "../Output/TemperatureOutput"

interface AltitudeFormPropTypes {
    atmosphere: {[key: string]: number}
}

export const AltitudeForm = ({ atmosphere }: AltitudeFormPropTypes) => {
    return(
        <form className="flex flex-col gap-4 text-lg">
              <Output
                label="Geometric Altitude"
                value={atmosphere["geometric"]}
                unit={distanceUnits}
              />
              <Output
                label="Geopotential Altitude"
                value={atmosphere["geopotential"]}
                unit={distanceUnits}
              />                
              <Output
                label="Gravity Acceleration"
                value={atmosphere["gravity_accel"]}
                unit={accelerationUnits}
              />         
              <Output
                label="Mean Molecular Weight"
                value={atmosphere["mean_molecular_weight"]}
                unit={meanMolecularWeightUnits}
              />
              <Output
                label="Pressure"
                value={atmosphere["pressure"]}
                unit={pressureUnits}
              />
              <TemperatureOutput
                label="Temperature"
                value={atmosphere["temperature"]}
              />
              <Output
                label="Density"
                value={atmosphere["density"]}
                unit={densityUnits}
                fixed={5}
              />
              <Output
                label="Speed of Sound"
                value={atmosphere["speed_of_sound"]}
                unit={sosUnits}
              />
              <Output
                label="Viscosity"
                value={atmosphere["viscosities"]}
                unit={viscosityUnits}
                fixed={8}
              />
            </form>
    )
}