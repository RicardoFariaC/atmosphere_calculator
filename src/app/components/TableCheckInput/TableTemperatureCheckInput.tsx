import { useEffect, useState } from "react"
import { TemperatureUnit } from "../Output/TemperatureOutput";

interface propTypes {
    unique: string,
    label: string,
    hasCheck?: boolean,
    setUnit: (param: TemperatureUnit) => void,
    setCheck?: (param: boolean) => void,
    setValue: (param: string) => void,
}

function toCelsius(value: number): number {
    return parseFloat((value - 273.15).toFixed(2));
}

function toFahrenheit(value: number): number {
    return parseFloat(((value - 273.15) * (9/5) + 32).toFixed(2));
}

function toRankine(value: number): number  {
    return parseFloat((value * 1.8).toFixed(2));
}

function toTheta(value: number): number {
    return parseFloat((value / 288.15).toFixed(6));
}

export function decideUnit(value: number, selectUnit: TemperatureUnit): number  {
    let result: number  = 0;
    if(selectUnit == TemperatureUnit.CELSIUS) result = toCelsius(value) 
    else if(selectUnit == TemperatureUnit.FAHRENHEIT) result = toFahrenheit(value);
    else if(selectUnit == TemperatureUnit.RANKINE) result = toRankine(value); 
    else if(selectUnit == TemperatureUnit.THETA) result = toTheta(value);
    else result = value;
    return result;
}   

export default function TableTemperatureCheckInput({
    unique, label, hasCheck = true, setUnit, setCheck, setValue
}: propTypes) {
    const [isChecked, setIsChecked] = useState<boolean>(hasCheck ?? false);
    const [selectUnit, setSelectUnit] = useState<TemperatureUnit>(TemperatureUnit.KELVIN);

    const handleChange = () => {
        setIsChecked(!isChecked);
    }

    const selectUnitAbbreviation = () => {
        let abbrStr = [
            "K", "°C", "°F", "°R", "-"
        ];

        setValue(abbrStr[selectUnit]);
    }

    useEffect(() => {
        if(setCheck)
            setCheck(isChecked);
    }, [isChecked])

    useEffect(() => {
        setUnit(selectUnit);
        selectUnitAbbreviation();
    }, [selectUnit])

    return (
        <div className="flex items-center gap-4 flex-1">
            <input
                type="checkbox"
                className={`accent-slate-50 w-6 h-6 rounded-md ${hasCheck ? "opacity-100" : "opacity-0"}`}
                disabled={!hasCheck}
                checked={isChecked}
                onChange={handleChange}
            />
            <label htmlFor={unique} className="basis-1/2">{label}</label>
            <select
                id={"tbl-"+unique}
                className="bg-zinc-800 p-2 rounded-md basis-full"
                value={selectUnit}
                onChange={(e) => setSelectUnit(parseInt(e.target.value))}
            >
                <option value={TemperatureUnit.KELVIN}>Kelvin[K]</option>
                <option value={TemperatureUnit.CELSIUS}>Celsius[°C]</option>
                <option value={TemperatureUnit.FAHRENHEIT}>Fahrenheit[°F]</option>
                <option value={TemperatureUnit.RANKINE}>Rankine[°R]</option>
                <option value={TemperatureUnit.THETA}>temperature ratio, theta[-]</option>
            </select>
        </div>
    )
}