import { ReactNode, useEffect, useState } from "react"

interface SelectOptionPropTypes {
    children?: ReactNode[],
    value: number | string,
    setValue: (param: number | string) => void
}

export const SelectOption = ({children, value, setValue}: SelectOptionPropTypes) => {
    return(
        <>
            {(children!.length > 0) && (
                <select
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="bg-zinc-800 p-2 rounded-md w-64 basis-1/4"
                >
                    {children}
                </select>
            ) || (
                <div className="basis-1/4"></div>
            )}
        </>
    )
}