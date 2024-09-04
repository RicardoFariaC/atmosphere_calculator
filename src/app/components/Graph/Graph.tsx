import { GraphReturnInterface } from "@/app/nav/graph/page"
import { CartesianGrid, Line, LineChart, Tooltip, XAxis, YAxis } from "recharts"
import { ContentType } from "recharts/types/component/Tooltip"
import { AxisDomain } from "recharts/types/util/types"

interface graphProps {
    data: GraphReturnInterface[],
    lineData: string,
    xData: string,
    xLabel: string,
    xUnit?: string,
    yData: string,
    yLabel: string,
    yUnit?: string,
    domain?: AxisDomain,
    CustomTooltip: ContentType<string, number>,
}


export const Graph = ({
    data,
    lineData,
    xData,
    xLabel,
    xUnit,
    yData,
    yLabel,
    yUnit,
    domain,
    CustomTooltip,
}: graphProps) => {
    return (
        <div className="py-5">
            <LineChart width={800} height={650} layout="vertical" margin={{
                left: 15,
                top: 10,
                bottom: 20
            }}>
                <CartesianGrid stroke="#ccc" />
                <Tooltip content={CustomTooltip}/>
                <Line type="monotone" stroke="#000" strokeWidth={2} dot={{ stroke: 'black', strokeWidth: 1 }} data={data} dataKey={lineData} />
                <YAxis dataKey={yData} 
                type="number" 
                reversed domain={[0, 'dataMax + 1149']} unit={yUnit || ""} 
                label={{value: yLabel, angle: -90, position: "left"}}
                />
                <XAxis dataKey={xData} type="number" domain={domain} tick tickCount={10} unit={xUnit||""} padding={{ right: 20 }} 
                label={{value: xLabel, position: "bottom", offset: 0 }}/>
            </LineChart>
        </div>
    )
}