import { ReactNode, useState } from "react";
import { SelectOption } from "./Select/SelectOptions";

const enum TemperatureUnit {
    CELSIUS, FAHRENHEIT, RANKINE, KELVIN
}

interface propTypes {
    label: string,
    value: number,
}

export const TemperatureOutput = ({ label, value, }: propTypes) => {
    const [selectUnit, setSelectUnit] = useState<TemperatureUnit>(TemperatureUnit.KELVIN);

    function toCelsius(value: number): number {
        return parseFloat((value - 273.15).toFixed(2));
    }

    function toFahrenheit(value: number): number {
        return parseFloat(((value - 273.15) * (9/5) + 32).toFixed(2));
    }

    function toRankine(value: number): number {
        return parseFloat((value * 1.8).toFixed(2));
    }

    function decideUnit(): number {
        let result = 0;
        if(selectUnit == TemperatureUnit.CELSIUS) result = toCelsius(value) 
        else if(selectUnit == TemperatureUnit.FAHRENHEIT) result = toFahrenheit(value);
        else if(selectUnit == TemperatureUnit.RANKINE) result = toRankine(value); 
        else result = value;
        return result;
    }    

    function toCapitalize(label: string): string {
        return [label.at(0)?.toUpperCase() + "" + label.slice(1)].join("");
    } 

    return (
        <div className="flex items-center gap-4 flex-1 ">
            <label htmlFor={label} className="basis-1/2">{toCapitalize(label)}</label>
            <input
                disabled
                value={decideUnit()?.toFixed(2) || 0}
                id={label} 
                className="bg-zinc-800 p-2 rounded-md basis-1/4"
            />
            <SelectOption
                value={selectUnit}
                setValue={(e) => setSelectUnit(e as number)}
            >
                <option value={TemperatureUnit.KELVIN}>Kelvin[K]</option>
                <option value={TemperatureUnit.CELSIUS}>Celsius[°C]</option>
                <option value={TemperatureUnit.FAHRENHEIT}>Fahrenheit[°F]</option>
                <option value={TemperatureUnit.RANKINE}>Rankine[°R]</option>
            </SelectOption>
        </div>
    );
}