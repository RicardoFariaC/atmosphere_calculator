import { Unit, UnitSystem } from "@/app/utils/units"
import { useEffect, useState } from "react"

interface propTypes {
    unique: string,
    label: string,
    unit: Unit[],
    unitSystem: UnitSystem,
    hasCheck?: boolean,
    setValue: (param: [string, number]) => void,
    setCheck: (param: boolean) => void,
}

export default function TableCheckInput({
    unique, label, unit, unitSystem, hasCheck = true, setValue, setCheck
}: propTypes) {
    const [optionUnit, setOptionUnit] = useState<string>(unit.find((unitValue) => parseFloat(unitValue.value) == 1)?.unit || "");
    const [isChecked, setIsChecked] = useState<boolean>(hasCheck ?? false);

    // useEffect(() => {
    //     setOptionUnit(unit.find((unitValue) => unitValue.type == unitSystem)?.unit as string)
    //     setValue([optionUnit, parseFloat(unit.find((unitValue) => unitValue.unit == optionUnit)?.value || "1")]);
    // }, [unitSystem])

    useEffect(() => {
        setValue([optionUnit, parseFloat(unit.find((unitValue) => unitValue.unit == optionUnit)?.value || "1")]);
    }, [optionUnit])

    const handleChange = () => {
        setIsChecked(!isChecked);
    }

    useEffect(() => {
        setCheck(isChecked);
    }, [isChecked])

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
                value={optionUnit}
                onChange={(e) => {
                    setOptionUnit(e.target.value)
                    setValue([e.target.value, parseFloat(unit.find((unitValue) => unitValue.unit == e.target.value)?.value || "1")]);
                }}
                id={"tbl-"+unique}
                className="bg-zinc-800 p-2 rounded-md basis-full"
            >
                {unit.map((unitValue) => {
                    return (
                        <option key={unitValue.name} value={unitValue.unit}>
                            {`${unitValue.name}[${unitValue.unit}]`}
                        </option>
                    )
                })}
            </select>
        </div>
    )
}