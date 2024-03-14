"use client"
import { ReactPropTypes, useState } from "react";

interface propTypes {
    label: string,
    value: number
}

export const Output = ({ label, value }: propTypes) => {
    const [valueUnit, setValueUnit] = useState<number>(1);

    function toCapitalize(label: string): string {
        return [label.at(0)?.toUpperCase() + "" + label.slice(1)].join("");
    } 

    return (
        <div className="flex items-center gap-4 flex-1 ">
            <label htmlFor={label} className="basis-1/2">{toCapitalize(label)}</label>
            <input
                disabled
                value={parseFloat((value / valueUnit).toFixed(10)) || 0}
                id={label} 
                className="bg-zinc-800 p-2 rounded-md basis-1/4"
                />
            <select 
                className="bg-zinc-800 p-2 rounded-md w-64 basis-1/4" 
                value={valueUnit}
                onChange={(e) => setValueUnit(parseFloat(e.target.value))}
            >
                <option value="1">pascals[Pa]</option>
                <option value="1000">kilometers[km]</option>
                <option value="0.3048">feet[ft]</option>
            </select>
        </div>
    )
};