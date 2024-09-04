import { ReactNode } from "react";

interface InfoCardPropTypes {
    className: string;
    label: string
}

export const InfoCard = ({className, label}: InfoCardPropTypes) => {
    return (
            <p 
                className={`bg-slate-100 bg-opacity-40 rounded-md text-black font-bold py-1 px-2 ${className}`}
            >
                {label}
            </p>
    )
}