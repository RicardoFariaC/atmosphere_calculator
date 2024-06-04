import { UnitSystem, coeffiecientOfThermUnits, dimensionlessUnit, trueDynamicPressureUnits } from "@/app/utils/units"
import { Output } from "../Output/Output"
import { TemperatureOutput } from "../Output/TemperatureOutput"

interface VelocityFormPropTypes {
    atmosphere: {[key: string]: number},
    unitSystem: UnitSystem
}

export const VelocityForm = ({ atmosphere, unitSystem }: VelocityFormPropTypes) => {
    return(
        <form className="flex flex-col gap-4 text-lg">
              <Output
                  label="Mach Number"
                  value={atmosphere["mach"]}
                  unit={dimensionlessUnit}
                  unitSystem={unitSystem}
              />
              <Output
                label="Dynamic Pressure"
                value={atmosphere["true_dynamic_pressure"]}
                unit={trueDynamicPressureUnits}
                unitSystem={unitSystem}
              />
              <TemperatureOutput
                label="Total Temperature"
                value={atmosphere["total_temperature"]}
                hasRatio={false}
                unitSystem={unitSystem}
              />
        </form>
      )
}