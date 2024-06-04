"use client"
import { useEffect, useState } from "react";
import { SelectOption } from "./Select/SelectOptions";
import { Unit, UnitSystem } from "@/app/utils/units";

interface propTypes {
    label: string,
    value: number,
    unit: Unit[],
    fixed?: number,
    unitSystem: UnitSystem
}

export const Output = ({ label, value, unit, fixed = 5, unitSystem }: propTypes) => {
    const [optionUnit, setOptionUnit] = useState<string>(unit.find((unitValue) => parseFloat(unitValue.value) == 1)?.unit || "");
    const [selectValueUnit, setSelectValueUnit] = useState<number>(1);

    useEffect(() => {
        setSelectValueUnit(parseFloat(unit.find((unitValue) => unitValue.unit == optionUnit)?.value || "1"));
    }, [optionUnit])

    function toCapitalize(label: string): string {
        return [label.at(0)?.toUpperCase() + "" + label.slice(1)].join("");
    }

    useEffect(() => {
        setSelectValueUnit(parseFloat(unit.find((unitValue) => unitValue.type == unitSystem)?.value || "1"))
        setOptionUnit(unit.find((unitValue) => unitValue.type == unitSystem)?.unit as string)
    }, [unitSystem])

    return (
        <div className="flex items-center gap-4 flex-1 ">
            <label htmlFor={label} className="basis-1/2">{toCapitalize(label)}</label>
            <input
                disabled
                value={parseFloat((value / (selectValueUnit || 1)).toPrecision(fixed)) ? (value / (selectValueUnit || 1)).toPrecision(fixed) : 0}
                id={label} 
                className="bg-zinc-800 p-2 rounded-md basis-1/4"
            />
            <SelectOption
                value={optionUnit}
                setValue={
                    (e) => {
                        setOptionUnit(e as string);
                        setSelectValueUnit(parseFloat(unit.find((unitValue) => unitValue.unit == optionUnit)!.value));
                    }
                }
            >
                {unit.map((unitValue) => {
                        if(!!optionUnit) {
                            return ( 
                                <option
                                key={unitValue.name} value={unitValue.unit}
                                >
                                    {`${unitValue.name}[${unitValue.unit}]`}
                                </option>
                            )
                        }
                })}
            </SelectOption>
        </div>
    )
};