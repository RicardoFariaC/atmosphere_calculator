"use client"

import { InfoCard } from "@/app/components/TextCards/InfoCard";
import NavBar from "../../components/NavBar";
import { invoke } from "@tauri-apps/api/tauri";
import { FormEvent, useEffect, useState } from "react";
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, TooltipProps } from 'recharts';
import { NameType, ValueType } from "recharts/types/component/DefaultTooltipContent";
import { Graph } from "@/app/components/Graph/Graph";

export interface GraphReturnInterface {
  altitude: number, value: number
}


function CustomTooltip({ payload, label, active }: TooltipProps<string, number>) {
  if (active) {
    return (
      <div className="custom-tooltip p-2 bg-slate-50 bg-opacity-95 text-slate-950 rounded-md">
        <p className="label">{`Altitude: ${label}`}</p>
        <p className="desc">{`Temperature: ${parseFloat(payload?.[0]?.value || "0").toFixed(6) || ""}`}</p>
      </div>
    );
  }

  return null;
}

export default function Home() {
  const [dataTemperature, setDataTemperature] = useState<GraphReturnInterface[]>([]);
  const [dataPressure, setDataPressure] = useState<GraphReturnInterface[]>([]);
  const [dataDensity, setDataDensity] = useState<GraphReturnInterface[]>([]);
  const [dataSoS, setDataSoS] = useState<GraphReturnInterface[]>([]);
  const [dataViscosity, setDataViscosity] = useState<GraphReturnInterface[]>([]);

  const handleInputTemperature = async () => {
    await invoke<GraphReturnInterface[]>("compute_graph_temperature")
      .then(res => {
        setDataTemperature(res);
      })
      .catch(console.error);
  }

  const handleInputPressure = async () => {
    await invoke<GraphReturnInterface[]>("compute_graph_pressure")
    .then(res => {
      setDataPressure(res);
    })
    .catch(console.error);
  }

  const handleInputDensity = async () => {
    await invoke<GraphReturnInterface[]>("compute_graph_density")
    .then(res => {
      setDataDensity(res);
    })
    .catch(console.error);
  }

  const handleInputSoS = async () => {
    await invoke<GraphReturnInterface[]>("compute_graph_sos")
    .then(res => {
      setDataSoS(res);
    })
    .catch(console.error);
  }

  const handleInputViscosity = async () => {
    await invoke<GraphReturnInterface[]>("compute_graph_viscosity")
    .then(res => {
      setDataViscosity(res);
    })
    .catch(console.error);
  }

  useEffect(() => {
    handleInputTemperature();
    handleInputPressure();
    handleInputDensity();
    handleInputSoS();
    handleInputViscosity();
  })

  return (
    <div className="flex h-screen flex-col">
      <div className="flex flex-1">
        <NavBar />
        <main className="flex-1 p-6">
        <p className="pb-2">Configure Units</p>
          <div className="mb-8 w-auto p-6 rounded-md bg-slate-100 bg-opacity-20 drop-shadow-lg shadow-lg">
            <InfoCard
              className="mb-5"
              label="Alter units from tables"
            />
          </div>
          <div className="w-auto bg-slate-100 rounded-md px-8">
            <Graph
              data={dataTemperature}
              lineData="temperature"
              xData="temperature"
              yData="altitude"
              xLabel="Temperature"
              yLabel="Altitude"
              CustomTooltip={CustomTooltip}
              domain={[185, 283]}
            />
            <Graph
              data={dataPressure}
              lineData="pressure"
              xData="pressure"
              yData="altitude"
              xLabel="Pressure"
              yLabel="Altitude"
              CustomTooltip={CustomTooltip}
              domain={[0, 92000]}
            />
            <Graph
              data={dataDensity}
              lineData="density"
              xData="density"
              yData="altitude"
              xLabel="Density"
              yLabel="Altitude"
              CustomTooltip={CustomTooltip}
              domain={[0, 1.15]}
            />
            <Graph
              data={dataSoS}
              lineData="speed_of_sound"
              xData="speed_of_sound"
              yData="altitude"
              xLabel="Speed of Sound"
              yLabel="Altitude"
              CustomTooltip={CustomTooltip}
              domain={[273, 340]}
            />
            <Graph
              data={dataViscosity}
              lineData="viscosity"
              xData="viscosity"
              yData="altitude"
              xLabel="Viscosity"
              yLabel="Altitude"
              CustomTooltip={CustomTooltip}
              domain={[0.0000115, 0.000018]}
            />
          </div>
        </main>
      </div>
    </div>
  );
}
